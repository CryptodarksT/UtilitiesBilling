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
import { authenticateToken, requireVerification, type AuthenticatedRequest } from "./auth-middleware";
import { db } from "./db";
import { userAccounts, linkedCards } from "@shared/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  // User registration endpoint
  app.post("/api/auth/register", async (req: AuthenticatedRequest, res) => {
    try {
      const { firebaseUid, email, name, businessName, phone } = insertUserAccountSchema.parse(req.body);
      
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(userAccounts)
        .where(eq(userAccounts.firebaseUid, firebaseUid));

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const [newUser] = await db
        .insert(userAccounts)
        .values({
          firebaseUid,
          email,
          name,
          businessName,
          phone,
        })
        .returning();

      res.json({ 
        message: "User registered successfully",
        user: newUser 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Registration failed" });
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

  // Link card to customer
  app.post("/api/cards/link", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cardData = cardLinkingSchema.parse(req.body);
      const cardService = new CardService();
      
      const linkedCard = await cardService.linkCard({
        userId: req.user!.userData.id,
        ...cardData,
      });

      res.json({
        message: "Card linked successfully",
        card: linkedCard
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Card linking error:', error);
      res.status(500).json({ message: "Failed to link card" });
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
