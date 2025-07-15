import { Express } from 'express';
import { MoMoService } from './momo-service';
import { BIDVService } from './bidv-service';
import { VNPayService } from './vnpay-service';

export function registerTestEndpoints(app: Express) {
  // Test MoMo payment endpoint
  app.post('/api/payments/momo-test', async (req, res) => {
    try {
      const { amount, orderInfo, orderId } = req.body;
      
      const momoService = new MoMoService();
      const result = await momoService.createPayment({
        amount: amount || 50000,
        orderInfo: orderInfo || 'Test payment',
        orderId: orderId || `TEST${Date.now()}`,
        redirectUrl: 'https://example.com/success',
        ipnUrl: 'https://example.com/ipn'
      });

      res.json({
        success: true,
        message: 'MoMo API hoạt động bình thường',
        data: result
      });
    } catch (error: any) {
      res.json({
        success: false,
        message: 'MoMo API lỗi hoặc cần business verification',
        error: error.message,
        testMode: true
      });
    }
  });

  // Test BIDV bill lookup endpoint
  app.post('/api/bills/bidv-test', async (req, res) => {
    try {
      const { billNumber } = req.body;
      
      const bidvService = new BIDVService();
      const result = await bidvService.lookupBill({
        billNumber: billNumber || 'PD29007350490'
      });

      res.json({
        success: true,
        message: 'BIDV API hoạt động bình thường',
        data: result
      });
    } catch (error: any) {
      res.json({
        success: false,
        message: 'BIDV API lỗi hoặc không khả dụng',
        error: error.message,
        fallbackMode: true
      });
    }
  });

  // Test VNPay 3DS endpoint
  app.post('/api/cards/vnpay-test', async (req, res) => {
    try {
      const vnpayService = new VNPayService();
      const result = await vnpayService.initiate3DSVerification({
        cardNumber: '4111111111111111',
        cardHolderName: 'Test User',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123',
        amount: 100000,
        orderId: `TEST${Date.now()}`,
        orderInfo: 'Test 3DS verification',
        ipAddr: '127.0.0.1'
      });

      res.json({
        success: true,
        message: 'VNPay 3DS simulation hoạt động',
        data: result
      });
    } catch (error: any) {
      res.json({
        success: false,
        message: 'VNPay service lỗi',
        error: error.message,
        simulationMode: true
      });
    }
  });

  // System health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        momo: process.env.MOMO_PARTNER_CODE ? 'configured' : 'missing',
        bidv: process.env.BIDV_API_KEY ? 'configured' : 'missing',
        vnpay: 'simulation',
        firebase: process.env.VITE_FIREBASE_API_KEY ? 'configured' : 'missing'
      }
    });
  });
}