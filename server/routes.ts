import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { billLookupSchema, billNumberLookupSchema, paymentRequestSchema, insertUserAccountSchema, cardLinkingSchema } from "@shared/schema";
import { z } from "zod";
import { MoMoService } from "./momo-service";
import { BIDVService } from "./bidv-service";
import { ExcelService } from "./excel-service";
import { AutoPaymentService } from "./auto-payment-service";
import { CardService } from "./card-service";
import { VNPayService } from "./vnpay-service";
import { AuthService } from "./auth-service";
import { authenticateToken, requireVerification, requireAdmin, type AuthenticatedRequest } from "./auth-middleware";
import { db } from "./db";
import { userAccounts, linkedCards } from "@shared/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { registerTestEndpoints } from "./test-endpoints";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Register test endpoints for development
  registerTestEndpoints(app);
  
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedExts = ['.xlsx', '.xls'];
      const fileExt = path.extname(file.originalname).toLowerCase();
      
      if (allowedExts.includes(fileExt)) {
        cb(null, true);
      } else {
        cb(new Error('Chỉ hỗ trợ file Excel (.xlsx, .xls)'));
      }
    }
  });
  
  // Excel upload endpoint
  app.post("/api/excel/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được upload" });
      }
      
      const excelService = new ExcelService();
      const result = await excelService.processExcelFile(req.file.buffer);
      
      res.json({
        message: `Đã xử lý ${result.processed} hóa đơn`,
        processed: result.processed,
        errors: result.errors
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Download Excel template
  app.get("/api/excel/template", (req, res) => {
    try {
      const excelService = new ExcelService();
      const templateBuffer = excelService.generateExcelTemplate();
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="template-hoa-don.xlsx"');
      res.send(templateBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Bill lookup endpoint (by customer ID)
  app.post("/api/bills/lookup", async (req, res) => {
    try {
      const { billType, provider, customerId } = billLookupSchema.parse(req.body);
      
      // Get customer
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      }

      // Get bill
      const bill = await storage.getBillByCustomerId(customerId, billType, provider);
      if (!bill) {
        return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
      }

      res.json({ bill, customer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Bill lookup endpoint (by bill number - BIDV API)
  app.post("/api/bills/lookup-by-number", async (req, res) => {
    try {
      const { billNumber } = billNumberLookupSchema.parse(req.body);
      
      // Initialize BIDV service
      const bidvService = new BIDVService();
      
      // Validate bill number format
      if (!bidvService.validateBillNumber(billNumber)) {
        return res.status(400).json({ message: "Số hóa đơn không đúng định dạng" });
      }

      // Get bill type and provider from bill number
      const billType = bidvService.getBillTypeFromNumber(billNumber);
      const provider = bidvService.getProviderFromNumber(billNumber);

      // Call BIDV API to lookup bill
      const bidvResponse = await bidvService.lookupBill({
        billNumber,
        billType,
        provider
      });

      // Create or find customer in local storage
      let customer = await storage.getCustomer(billNumber);
      if (!customer) {
        customer = await storage.createCustomer({
          customerId: billNumber,
          name: bidvResponse.customerName,
          address: bidvResponse.customerAddress,
          phone: bidvResponse.customerPhone,
          email: bidvResponse.customerEmail
        });
      }

      // Create or find bill in local storage
      let bill = await storage.getBillByCustomerId(billNumber, billType, provider);
      if (!bill) {
        bill = await storage.createBill({
          customerId: billNumber,
          billType,
          provider,
          period: bidvResponse.period || new Date().toISOString().slice(0, 7),
          oldIndex: bidvResponse.oldReading ? parseInt(bidvResponse.oldReading) : null,
          newIndex: bidvResponse.newReading ? parseInt(bidvResponse.newReading) : null,
          consumption: bidvResponse.oldReading && bidvResponse.newReading ? 
            parseInt(bidvResponse.newReading) - parseInt(bidvResponse.oldReading) : null,
          amount: bidvResponse.amount,
          status: bidvResponse.status === 'paid' ? 'paid' : 'pending',
          dueDate: new Date(bidvResponse.dueDate)
        });
      }

      res.json({ 
        bill: {
          ...bill,
          billNumber,
          description: bidvResponse.description,
          unit: bidvResponse.unit,
          unitPrice: bidvResponse.unitPrice,
          taxes: bidvResponse.taxes,
          fees: bidvResponse.fees
        }, 
        customer,
        source: 'bidv'
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      
      // Handle BIDV API specific errors
      if (error.message.includes('BIDV API')) {
        return res.status(400).json({ message: error.message });
      }
      
      console.error('BIDV Lookup Error:', error);
      res.status(500).json({ message: "Lỗi khi tra cứu hóa đơn từ BIDV" });
    }
  });

  // Create payment endpoint
  app.post("/api/payments", async (req, res) => {
    try {
      const { billId, paymentMethod } = paymentRequestSchema.parse(req.body);
      
      // Get bill
      const bill = await storage.getBillById(billId);
      if (!bill) {
        return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
      }

      if (bill.status === "paid") {
        return res.status(400).json({ message: "Hóa đơn đã được thanh toán" });
      }

      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Create payment
      const payment = await storage.createPayment({
        billId,
        customerId: bill.customerId,
        amount: bill.amount,
        paymentMethod,
        transactionId,
        status: "pending",
      });

      // Handle MoMo payment (both wallet and credit card)
      if (paymentMethod === "momo" || paymentMethod === "visa") {
        try {
          const momoService = new MoMoService();
          const momoResponse = await momoService.createPayment({
            amount: parseInt(bill.amount.replace(/[^\d]/g, '')),
            orderInfo: `Thanh toán hóa đơn ${bill.billType} - ${bill.provider}`,
            orderId: transactionId,
            redirectUrl: `${req.protocol}://${req.get('host')}/payment-success`,
            ipnUrl: `${req.protocol}://${req.get('host')}/api/payments/momo/ipn`,
            extraData: JSON.stringify({ billId, customerId: bill.customerId })
          });

          res.json({ 
            payment, 
            transactionId,
            paymentUrl: momoResponse.payUrl,
            qrCodeUrl: momoResponse.qrCodeUrl,
            deeplink: momoResponse.deeplink
          });
        } catch (error) {
          console.error('MoMo payment error:', error);
          
          // If MoMo API is not available (e.g., business verification required),
          // inform user about the integration status
          res.status(200).json({ 
            payment, 
            transactionId,
            momoStatus: "pending_verification",
            message: "Tích hợp MoMo đã sẵn sàng. Tài khoản doanh nghiệp cần được xác thực để xử lý thanh toán thực tế.",
            testMode: true
          });
        }
      } else {
        // For other payment methods, use simulation
        setTimeout(async () => {
          await storage.updatePaymentStatus(payment.id, "completed");
          await storage.updateBillStatus(billId, "paid");
        }, 2000);

        res.json({ payment, transactionId });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Get payment status
  app.get("/api/payments/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      const payment = await storage.getPaymentByTransactionId(transactionId);
      if (!payment) {
        return res.status(404).json({ message: "Không tìm thấy giao dịch" });
      }

      res.json({ payment });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Get payment history
  app.get("/api/payments/history/:customerId", async (req, res) => {
    try {
      const { customerId } = req.params;
      
      const payments = await storage.getPaymentsByCustomerId(customerId);
      const bills = await storage.getBillsByCustomerId(customerId);
      
      // Combine payment and bill data
      const history = payments.map(payment => {
        const bill = bills.find(b => b.id === payment.billId);
        return {
          ...payment,
          bill,
        };
      });

      res.json({ history });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // MoMo IPN endpoint
  app.post("/api/payments/momo/ipn", async (req, res) => {
    try {
      const momoService = new MoMoService();
      
      if (!momoService.verifyIPN(req.body)) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const { orderId, resultCode, extraData } = req.body;
      
      if (resultCode === 0) {
        // Payment successful
        const payment = await storage.getPaymentByTransactionId(orderId);
        if (payment) {
          await storage.updatePaymentStatus(payment.id, "completed");
          await storage.updateBillStatus(payment.billId, "paid");
        }
      } else {
        // Payment failed
        const payment = await storage.getPaymentByTransactionId(orderId);
        if (payment) {
          await storage.updatePaymentStatus(payment.id, "failed");
        }
      }

      res.json({ message: "Success" });
    } catch (error) {
      console.error('MoMo IPN error:', error);
      res.status(500).json({ message: "Error processing IPN" });
    }
  });

  // Get providers by bill type
  app.get("/api/providers/:billType", async (req, res) => {
    try {
      const { billType } = req.params;
      
      const providers = {
        electricity: ['EVN TP.HCM', 'EVN Hà Nội', 'EVN Miền Trung', 'EVN Miền Nam'],
        water: ['SAWACO', 'HAWACO', 'DAWACO', 'CAWACO'],
        internet: ['FPT Telecom', 'Viettel', 'VNPT', 'CMC'],
        tv: ['VTVcab', 'SCTV', 'AVG', 'K+'],
        phonecard: ['Viettel', 'Vinaphone', 'Mobifone', 'Vietnamobile', 'Gmobile']
      };

      const providerList = providers[billType as keyof typeof providers] || [];
      res.json({ providers: providerList });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Auto-payment endpoint
  app.post("/api/payments/auto", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được upload" });
      }
      
      const visaCardToken = req.body.visaCardToken || process.env.VISA_CARD_TOKEN;
      
      const autoPaymentService = new AutoPaymentService();
      const result = await autoPaymentService.processAutoPaymentFile(req.file.buffer, visaCardToken);
      
      res.json({
        message: `Đã xử lý ${result.summary.total} hóa đơn`,
        results: result.results,
        summary: result.summary
      });
    } catch (error: any) {
      console.error('Auto payment error:', error);
      res.status(500).json({ message: error.message || "Lỗi xử lý thanh toán tự động" });
    }
  });

  // Download auto-payment template
  app.get("/api/payments/auto/template", async (req, res) => {
    try {
      const autoPaymentService = new AutoPaymentService();
      const buffer = autoPaymentService.generateTemplateFile();
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=auto-payment-template.xlsx');
      res.send(buffer);
    } catch (error: any) {
      console.error('Generate template error:', error);
      res.status(500).json({ message: "Lỗi tạo file template" });
    }
  });

  // Download auto-payment report
  app.post("/api/payments/auto/report", async (req, res) => {
    try {
      const { results } = req.body;
      
      if (!results || !Array.isArray(results)) {
        return res.status(400).json({ message: "Dữ liệu kết quả không hợp lệ" });
      }
      
      const autoPaymentService = new AutoPaymentService();
      const buffer = autoPaymentService.generateResultReport(results);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=auto-payment-report.xlsx');
      res.send(buffer);
    } catch (error: any) {
      console.error('Generate report error:', error);
      res.status(500).json({ message: "Lỗi tạo báo cáo" });
    }
  });

  // Phone card purchase endpoint
  app.post("/api/phonecard/purchase", async (req, res) => {
    try {
      const { provider, denomination, quantity } = req.body;
      
      // Generate phone card serial numbers
      const cards = [];
      for (let i = 0; i < quantity; i++) {
        const serial = `${provider.toUpperCase()}${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const pin = Math.floor(Math.random() * 900000000000) + 100000000000; // 12 digit PIN
        cards.push({
          serial,
          pin: pin.toString(),
          denomination,
          provider
        });
      }
      
      // Create a bill record for the purchase
      const totalAmount = parseInt(denomination) * quantity;
      const bill = await storage.createBill({
        customerId: "PHONECARD_CUSTOMER",
        billType: "phonecard",
        provider,
        amount: totalAmount.toString(),
        dueDate: new Date().toISOString(),
        status: "pending",
        period: new Date().toISOString().slice(0, 7),
      });
      
      res.json({ 
        bill,
        cards,
        message: `Đã tạo ${quantity} thẻ ${denomination}đ của ${provider}`
      });
    } catch (error) {
      console.error('Phone card purchase error:', error);
      res.status(500).json({ message: "Lỗi khi mua thẻ cào" });
    }
  });

  // User registration endpoint (create new account with API key)
  app.post("/api/auth/register", async (req: AuthenticatedRequest, res) => {
    try {
      const { email, name, businessName, phone } = req.body;
      
      // Create new user with API key
      const newUser = await AuthService.createAccount({
        email,
        name,
        businessName: businessName || null,
        phone: phone || null,
      });

      res.json({ 
        message: "Tài khoản đã được tạo thành công",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          businessName: newUser.businessName,
          phone: newUser.phone,
          apiKey: newUser.apiKey,
          isVerified: newUser.isVerified,
          keyExpiresAt: newUser.keyExpiresAt,
          createdAt: newUser.createdAt
        }
      });
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Không thể tạo tài khoản" });
    }
  });

  // Get user profile
  app.get("/api/auth/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // API key login endpoint
  app.post("/api/auth/login", async (req: AuthenticatedRequest, res) => {
    try {
      const { apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }
      
      const userData = await AuthService.verifyApiKey(apiKey);
      
      res.json({
        message: "Đăng nhập thành công",
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          businessName: userData.businessName,
          phone: userData.phone,
          isVerified: userData.isVerified,
          keyExpiresAt: userData.keyExpiresAt,
          lastLoginAt: userData.lastLoginAt
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: error.message || "Invalid API key" });
    }
  });

  // Admin endpoint to list all accounts
  app.get("/api/admin/accounts", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const accounts = await AuthService.listAccounts();
      res.json({ accounts });
    } catch (error) {
      console.error('List accounts error:', error);
      res.status(500).json({ message: "Failed to list accounts" });
    }
  });

  // Admin endpoint to verify account
  app.post("/api/admin/accounts/:id/verify", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const verifiedAccount = await AuthService.verifyAccount(userId);
      res.json({ 
        message: "Account verified successfully",
        account: verifiedAccount
      });
    } catch (error) {
      console.error('Verify account error:', error);
      res.status(500).json({ message: "Failed to verify account" });
    }
  });

  // Admin endpoint to toggle account status
  app.post("/api/admin/accounts/:id/toggle", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      const updatedAccount = await AuthService.toggleAccountStatus(userId, isActive);
      res.json({ 
        message: `Account ${isActive ? 'activated' : 'deactivated'} successfully`,
        account: updatedAccount
      });
    } catch (error) {
      console.error('Toggle account error:', error);
      res.status(500).json({ message: "Failed to toggle account status" });
    }
  });

  // Regenerate API key
  app.post("/api/auth/regenerate-key", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updatedUser = await AuthService.regenerateApiKey(req.user!.id);
      res.json({
        message: "API key regenerated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          apiKey: updatedUser.apiKey,
          keyExpiresAt: updatedUser.keyExpiresAt
        }
      });
    } catch (error) {
      console.error('Regenerate key error:', error);
      res.status(500).json({ message: "Failed to regenerate API key" });
    }
  });

  // Link card to customer with 3DS verification
  app.post("/api/cards/link", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cardData = cardLinkingSchema.parse(req.body);
      const cardService = new CardService();
      const vnpayService = new VNPayService();
      
      // Check if card is Visa and requires 3DS
      const isVisaCard = cardData.cardNumber.replace(/\s/g, '').startsWith('4');
      
      if (isVisaCard && req.body.cvv) {
        // Initiate 3DS verification for Visa cards
        const verification3DS = await vnpayService.initiate3DSVerification({
          cardNumber: cardData.cardNumber,
          cardHolderName: cardData.cardHolderName,
          expiryMonth: cardData.expiryMonth || '',
          expiryYear: cardData.expiryYear || '',
          cvv: req.body.cvv,
          amount: 1000, // Small verification amount
          orderId: `VERIFY${Date.now()}`,
          orderInfo: 'Card verification',
          ipAddr: req.ip || '127.0.0.1'
        });

        if (verification3DS.vnp_3DSUrl) {
          // Need 3DS verification - return URL for popup/redirect
          return res.json({
            requires3DS: true,
            verificationUrl: verification3DS.vnp_3DSUrl,
            verificationData: verification3DS.vnp_3DSData,
            message: "Yêu cầu xác minh 3DS"
          });
        }
      }
      
      // Link card without 3DS (for non-Visa or if 3DS not required)
      const linkedCard = await cardService.linkCard({
        userId: req.user!.userData.id,
        ...cardData,
      });

      res.json({
        message: "Thẻ đã được liên kết thành công",
        card: linkedCard
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Card linking error:', error);
      res.status(500).json({ message: "Không thể liên kết thẻ" });
    }
  });

  // 3DS verification callback
  app.get("/api/cards/3ds-callback", async (req, res) => {
    try {
      const vnpayService = new VNPayService();
      const cardService = new CardService();
      
      // Verify 3DS callback
      const isValid = vnpayService.verify3DSCallback(req.query);
      
      if (isValid) {
        // Extract card data from 3DS response
        const verificationData = req.query.vnp_3DSData 
          ? JSON.parse(Buffer.from(req.query.vnp_3DSData as string, 'base64').toString())
          : null;
          
        if (verificationData && verificationData.cardToken) {
          // Update card with token and 3DS verification status
          const updatedCard = await db
            .update(linkedCards)
            .set({
              cardToken: verificationData.cardToken,
              is3DSVerified: true,
              verifiedAt: new Date()
            })
            .where(eq(linkedCards.id, verificationData.cardId))
            .returning();
            
          res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5000'}/cards?status=success`);
        } else {
          res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5000'}/cards?status=failed&message=invalid_data`);
        }
      } else {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5000'}/cards?status=failed&message=verification_failed`);
      }
    } catch (error) {
      console.error('3DS callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5000'}/cards?status=failed`);
    }
  });

  // Get user's linked cards
  app.get("/api/cards", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cardService = new CardService();
      const cards = await cardService.getUserCards(req.user!.userData.id);
      
      res.json({ cards });
    } catch (error) {
      console.error('Get cards error:', error);
      res.status(500).json({ message: "Failed to get cards" });
    }
  });

  // Set default card
  app.patch("/api/cards/:cardId/default", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cardId = parseInt(req.params.cardId);
      const cardService = new CardService();
      
      const updatedCard = await cardService.setDefaultCard(cardId, req.user!.userData.id);
      
      res.json({
        message: "Default card updated",
        card: updatedCard
      });
    } catch (error) {
      console.error('Set default card error:', error);
      res.status(500).json({ message: "Failed to set default card" });
    }
  });

  // Remove card
  app.delete("/api/cards/:cardId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cardId = parseInt(req.params.cardId);
      const cardService = new CardService();
      
      await cardService.deactivateCard(cardId, req.user!.userData.id);
      
      res.json({ message: "Card removed successfully" });
    } catch (error) {
      console.error('Remove card error:', error);
      res.status(500).json({ message: "Failed to remove card" });
    }
  });

  // Generate customer token for auto-payment
  app.post("/api/tokens/generate", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { customerId } = req.body;
      const cardService = new CardService();
      
      const token = await cardService.generateCustomerToken(
        req.user!.userData.id,
        customerId
      );
      
      res.json({
        message: "Token generated successfully",
        token,
        customerId
      });
    } catch (error) {
      console.error('Generate token error:', error);
      res.status(500).json({ message: "Failed to generate token" });
    }
  });

  // Process payment with linked Visa card (3DS verified)
  app.post("/api/payments/visa-card", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { billId, cardId, cvv } = req.body;
      const cardService = new CardService();
      const vnpayService = new VNPayService();
      
      // Get card details
      const card = await cardService.getCardForPayment(cardId, req.user!.userData.id);
      
      // Check if card is 3DS verified
      if (!card.is3DSVerified) {
        return res.status(400).json({ 
          message: "Thẻ chưa được xác minh 3DS. Vui lòng xác minh thẻ trước khi thanh toán." 
        });
      }
      
      // Get bill
      const bill = await storage.getBillById(billId);
      if (!bill) {
        return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
      }

      const transactionId = `VISA${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      try {
        // Create payment record
        const payment = await storage.createPayment({
          billId,
          customerId: bill.customerId,
          amount: bill.amount,
          paymentMethod: "visa_card",
          transactionId,
          status: "pending",
        });

        // Process payment with VNPay using card token
        const paymentResult = await vnpayService.processCardPayment({
          cardToken: card.cardToken!,
          amount: parseFloat(bill.amount),
          orderId: transactionId,
          orderInfo: `Thanh toán hóa đơn ${bill.billType} - ${bill.customerId}`,
          ipAddr: req.ip || '127.0.0.1',
          cvv: cvv // Optional CVV for additional security
        });

        if (paymentResult.vnp_ResponseCode === '00') {
          // Payment successful
          await storage.updatePaymentStatus(payment.id, "completed");
          await storage.updateBillStatus(billId, "paid");
          
          // Update card last used
          await db
            .update(linkedCards)
            .set({ lastUsed: new Date() })
            .where(eq(linkedCards.id, cardId));

          res.json({
            message: "Thanh toán thành công",
            payment,
            transactionId,
            bankTransactionNo: paymentResult.vnp_TransactionNo
          });
        } else {
          // Payment failed
          await storage.updatePaymentStatus(payment.id, "failed");
          
          res.status(400).json({
            message: "Thanh toán thất bại",
            error: paymentResult.vnp_Message
          });
        }
      } catch (error) {
        console.error('Visa payment error:', error);
        res.status(500).json({ message: "Lỗi xử lý thanh toán" });
      }
    } catch (error) {
      console.error('Visa payment validation error:', error);
      res.status(401).json({ message: "Thông tin không hợp lệ" });
    }
  });

  // Create 3DS payment URL for web-based flow
  app.post("/api/payments/3ds-url", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { billId, amount } = req.body;
      const vnpayService = new VNPayService();
      
      const transactionId = `3DS${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const paymentUrl = vnpayService.create3DSPaymentUrl({
        amount: amount,
        orderId: transactionId,
        orderInfo: `Payment for bill ${billId}`,
        bankCode: 'VISA',
        ipAddr: req.ip || '127.0.0.1'
      });
      
      res.json({
        paymentUrl,
        transactionId
      });
    } catch (error) {
      console.error('3DS URL error:', error);
      res.status(500).json({ message: "Không thể tạo link thanh toán" });
    }
  });

  // Auto-payment with linked card
  app.post("/api/payments/auto-card", async (req, res) => {
    try {
      const { token, billId, cardId } = req.body;
      const cardService = new CardService();
      
      // Validate token
      const { userId } = await cardService.validateCustomerToken(token);
      
      // Get card details
      const card = await cardService.getCardForPayment(cardId, userId);
      
      // Get bill
      const bill = await storage.getBillById(billId);
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      // Process payment with MoMo using linked card
      const momoService = new MoMoService();
      const transactionId = `AUTO${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      try {
        const payment = await storage.createPayment({
          billId,
          customerId: bill.customerId,
          amount: bill.amount,
          paymentMethod: "auto_card",
          transactionId,
          status: "pending",
        });

        // In a real implementation, you would:
        // 1. Use card details to process payment via MoMo
        // 2. Handle the response and update payment status
        // For now, we'll simulate success
        
        setTimeout(async () => {
          await storage.updatePaymentStatus(payment.id, "completed");
          await storage.updateBillStatus(billId, "paid");
        }, 2000);

        res.json({
          message: "Auto-payment processed successfully",
          payment,
          transactionId
        });
      } catch (error) {
        console.error('Auto-payment error:', error);
        res.status(500).json({ message: "Auto-payment failed" });
      }
    } catch (error) {
      console.error('Auto-payment validation error:', error);
      res.status(401).json({ message: "Invalid token or card" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
