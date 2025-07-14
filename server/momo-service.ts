import crypto from 'crypto-js';
import axios from 'axios';

interface MoMoPaymentRequest {
  amount: number;
  orderInfo: string;
  orderId: string;
  redirectUrl: string;
  ipnUrl: string;
  extraData?: string;
}

interface MoMoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
}

export class MoMoService {
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly endpoint: string;

  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE || '';
    this.accessKey = process.env.MOMO_ACCESS_KEY || '';
    this.secretKey = process.env.MOMO_SECRET_KEY || '';
    this.endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
    
    if (!this.partnerCode || !this.accessKey || !this.secretKey) {
      throw new Error('Missing MoMo API credentials');
    }
  }

  private createSignature(rawData: string): string {
    return crypto.HmacSHA256(rawData, this.secretKey).toString();
  }

  async createPayment(request: MoMoPaymentRequest): Promise<MoMoPaymentResponse> {
    const requestId = request.orderId;
    const orderType = 'momo_wallet';
    const requestType = 'payWithMethod';
    const lang = 'vi';
    
    // Create raw signature string
    const rawSignature = `accessKey=${this.accessKey}&amount=${request.amount}&extraData=${request.extraData || ''}&ipnUrl=${request.ipnUrl}&orderId=${request.orderId}&orderInfo=${request.orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${request.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: request.amount,
      orderId: request.orderId,
      orderInfo: request.orderInfo,
      redirectUrl: request.redirectUrl,
      ipnUrl: request.ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: true,
      extraData: request.extraData || '',
      orderGroupId: '',
      signature: signature
    };

    try {
      const response = await axios.post(this.endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      console.error('MoMo API Error:', error);
      throw new Error('Failed to create MoMo payment');
    }
  }

  verifyIPN(data: any): boolean {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = data;

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData || ''}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const expectedSignature = this.createSignature(rawSignature);
    
    return signature === expectedSignature;
  }
}