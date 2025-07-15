import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { billLookupSchema, billNumberLookupSchema, paymentRequestSchema } from "@shared/schema";
import { z } from "zod";
import { MoMoService } from "./momo-service";
import { BIDVService } from "./bidv-service";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
        tv: ['VTVcab', 'SCTV', 'AVG', 'K+']
      };

      const providerList = providers[billType as keyof typeof providers] || [];
      res.json({ providers: providerList });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
