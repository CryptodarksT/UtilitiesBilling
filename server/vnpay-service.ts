import crypto from 'crypto';
import axios from 'axios';
import { format } from 'date-fns';

interface VNPayConfig {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_ReturnUrl: string;
  vnp_Api: string;
}

interface Card3DSRequest {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  ipAddr: string;
}

interface Card3DSResponse {
  vnp_ResponseCode: string;
  vnp_Message: string;
  vnp_SecureHash: string;
  vnp_TransactionNo?: string;
  vnp_BankCode?: string;
  vnp_CardType?: string;
  vnp_3DSUrl?: string;
  vnp_3DSData?: string;
}

export class VNPayService {
  private config: VNPayConfig;

  constructor() {
    // Simulator config for development
    this.config = {
      vnp_TmnCode: process.env.VNPAY_TMN_CODE || 'DEMO2025',
      vnp_HashSecret: process.env.VNPAY_HASH_SECRET || 'DEMOSECRET',
      vnp_Url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5000/api/cards/3ds-callback',
      vnp_Api: process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
    };
  }

  private sortObject(obj: any): any {
    const sorted: any = {};
    const str: string[] = [];
    let key;
    
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    
    str.sort();
    
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    
    return sorted;
  }

  private createSecureHash(data: any): string {
    const sortedData = this.sortObject(data);
    let signData = '';
    
    for (const key in sortedData) {
      if (sortedData.hasOwnProperty(key) && sortedData[key]) {
        signData += `${key}=${sortedData[key]}&`;
      }
    }
    
    signData = signData.slice(0, -1);
    
    const hmac = crypto.createHmac('sha512', this.config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    return signed.toUpperCase();
  }

  async initiate3DSVerification(card: Card3DSRequest): Promise<Card3DSResponse> {
    try {
      // Simulate 3DS verification for Visa cards
      const is3DSRequired = card.cardNumber.replace(/\s/g, '').startsWith('4') && 
                          parseFloat(card.amount.toString()) > 100000; // Require 3DS for amounts > 100k

      if (is3DSRequired) {
        // Generate 3DS verification URL
        const verificationData = {
          cardNumber: card.cardNumber.replace(/\s/g, '').slice(-4),
          amount: card.amount,
          orderId: card.orderId,
          timestamp: Date.now()
        };

        const encodedData = Buffer.from(JSON.stringify(verificationData)).toString('base64');
        
        return {
          vnp_ResponseCode: '3DS',
          vnp_Message: '3D Secure verification required',
          vnp_SecureHash: this.createSecureHash(verificationData),
          vnp_3DSUrl: `${this.config.vnp_ReturnUrl}?data=${encodedData}`,
          vnp_3DSData: encodedData
        };
      }

      // Card doesn't require 3DS - direct approval
      return await this.simulate3DSFlow({
        ...card,
        skipVerification: true
      });
    } catch (error) {
      console.error('3DS initiation error:', error);
      return {
        vnp_ResponseCode: '99',
        vnp_Message: 'System error during 3DS verification',
        vnp_SecureHash: ''
      };
    }
  }

  async processCardPayment(data: {
    cardToken: string;
    amount: number;
    orderId: string;
    orderInfo: string;
    ipAddr: string;
    cvv?: string;
  }): Promise<any> {
    try {
      // Simulate card payment processing
      const params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay_token',
        vnp_TmnCode: this.config.vnp_TmnCode,
        vnp_Amount: data.amount * 100, // Convert to smallest unit
        vnp_CurrCode: 'VND',
        vnp_TxnRef: data.orderId,
        vnp_OrderInfo: data.orderInfo,
        vnp_OrderType: 'billpayment',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: this.config.vnp_ReturnUrl,
        vnp_IpAddr: data.ipAddr,
        vnp_CreateDate: this.formatDate(new Date()),
        vnp_CardToken: data.cardToken
      };

      if (data.cvv) {
        params['vnp_CVV'] = data.cvv;
      }

      // Simulate payment processing
      return await this.simulatePayment(params);
    } catch (error) {
      console.error('Card payment error:', error);
      throw error;
    }
  }

  verify3DSCallback(query: any): boolean {
    try {
      const secureHash = query.vnp_SecureHash;
      delete query.vnp_SecureHash;
      delete query.vnp_SecureHashType;
      
      const signed = this.createSecureHash(query);
      
      return secureHash === signed;
    } catch (error) {
      console.error('3DS verification error:', error);
      return false;
    }
  }

  create3DSPaymentUrl(data: {
    amount: number;
    orderId: string;
    orderInfo: string;
    bankCode: string;
    ipAddr: string;
  }): string {
    const params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.vnp_TmnCode,
      vnp_Amount: data.amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: data.orderId,
      vnp_OrderInfo: data.orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: this.config.vnp_ReturnUrl,
      vnp_IpAddr: data.ipAddr,
      vnp_CreateDate: this.formatDate(new Date()),
      vnp_BankCode: data.bankCode
    };

    const sortedParams = this.sortObject(params);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', this.config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    sortedParams['vnp_SecureHash'] = signed;
    
    return `${this.config.vnp_Url}?${new URLSearchParams(sortedParams).toString()}`;
  }

  private formatDate(date: Date): string {
    return format(date, 'yyyyMMddHHmmss');
  }

  private async simulate3DSFlow(params: any): Promise<Card3DSResponse> {
    // Simulate successful 3DS verification
    const cardToken = `TOKEN_${params.cardNumber.slice(-4)}_${Date.now()}`;
    
    return {
      vnp_ResponseCode: '00',
      vnp_Message: '3DS verification successful',
      vnp_SecureHash: this.createSecureHash({ cardToken }),
      vnp_CardType: 'VISA',
      vnp_BankCode: 'VCB',
      vnp_TransactionNo: `VNP${Date.now()}`,
      vnp_3DSData: Buffer.from(JSON.stringify({ cardToken })).toString('base64')
    };
  }

  private async simulatePayment(params: any): Promise<any> {
    // Simulate successful payment
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      return {
        vnp_ResponseCode: '00',
        vnp_Message: 'Payment successful',
        vnp_TransactionNo: `VNP${Date.now()}`,
        vnp_Amount: params.vnp_Amount,
        vnp_OrderInfo: params.vnp_OrderInfo,
        vnp_BankCode: 'VCB',
        vnp_PayDate: this.formatDate(new Date())
      };
    } else {
      return {
        vnp_ResponseCode: '24',
        vnp_Message: 'Customer cancelled payment',
        vnp_TransactionNo: null,
        vnp_Amount: params.vnp_Amount,
        vnp_OrderInfo: params.vnp_OrderInfo
      };
    }
  }
}