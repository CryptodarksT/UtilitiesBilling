import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { billLookupSchema, paymentRequestSchema } from "@shared/schema";
import { z } from "zod";
import { MoMoService } from "./momo-service";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Bill lookup endpoint
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
          res.status(500).json({ message: "Lỗi khi tạo thanh toán MoMo" });
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
