import axios from 'axios';
import crypto from 'crypto';

interface VisaPaymentRequest {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: number;
  currency: string;
  merchantId: string;
  orderId: string;
  description: string;
}

interface VisaPaymentResponse {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message: string;
  amount: number;
  timestamp: string;
  authCode?: string;
  processingTime: number;
  secureToken?: string;
}

interface Visa3DSecureRequest {
  cardNumber: string;
  amount: number;
  currency: string;
  merchantId: string;
  returnUrl: string;
  orderId: string;
}

interface Visa3DSecureResponse {
  enrolled: boolean;
  acsUrl?: string;
  paReq?: string;
  transactionId: string;
  secureToken: string;
}

export class VisaPaymentService {
  private readonly apiUrl: string;
  private readonly merchantId: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly sandboxMode: boolean;

  constructor() {
    this.apiUrl = process.env.VISA_API_URL || 'https://sandbox.api.visa.com/v1';
    this.merchantId = process.env.VISA_MERCHANT_ID || 'TEST_MERCHANT_VN';
    this.apiKey = process.env.VISA_API_KEY || '';
    this.secretKey = process.env.VISA_SECRET_KEY || '';
    this.sandboxMode = process.env.NODE_ENV !== 'production';
  }

  /**
   * Validate Visa card number using Luhn algorithm
   */
  public validateVisaCard(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Check if it's a Visa card (starts with 4)
    if (!cleanNumber.startsWith('4')) {
      return false;
    }
    
    // Check length (13-19 digits for Visa)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }
    
    // Luhn algorithm
    return this.luhnCheck(cleanNumber);
  }

  /**
   * Check if card is expired
   */
  public isCardExpired(month: string, year: string): boolean {
    const currentDate = new Date();
    const expiryDate = new Date();
    
    // Convert 2-digit year to 4-digit
    const fullYear = parseInt(year) + (parseInt(year) < 50 ? 2000 : 1900);
    expiryDate.setFullYear(fullYear, parseInt(month) - 1, 1);
    
    return expiryDate < currentDate;
  }

  /**
   * Generate secure transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(4).toString('hex');
    return `VPS_${timestamp}_${random}`;
  }

  /**
   * Create HMAC signature for request authentication
   */
  private createSignature(data: string): string {
    return crypto.createHmac('sha256', this.secretKey).update(data).digest('hex');
  }

  /**
   * Mask card number for security
   */
  private maskCardNumber(cardNumber: string): string {
    const clean = cardNumber.replace(/\D/g, '');
    return `${clean.substring(0, 4)} **** **** ${clean.substring(clean.length - 4)}`;
  }

  /**
   * Check 3D Secure enrollment
   */
  public async check3DSecure(request: Visa3DSecureRequest): Promise<Visa3DSecureResponse> {
    const requestData = {
      cardNumber: request.cardNumber,
      amount: request.amount,
      currency: request.currency,
      merchantId: this.merchantId,
      returnUrl: request.returnUrl,
      orderId: request.orderId,
      timestamp: new Date().toISOString()
    };

    const signature = this.createSignature(JSON.stringify(requestData));
    
    try {
      const response = await axios.post(`${this.apiUrl}/3ds/enrollment`, requestData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.merchantId,
          'X-Signature': signature
        },
        timeout: 30000
      });

      return {
        enrolled: response.data.enrolled || false,
        acsUrl: response.data.acsUrl,
        paReq: response.data.paReq,
        transactionId: response.data.transactionId || this.generateTransactionId(),
        secureToken: response.data.secureToken || crypto.randomBytes(32).toString('hex')
      };
    } catch (error) {
      console.error('3D Secure check failed:', error);
      
      // Fallback for development/testing
      if (this.sandboxMode) {
        return {
          enrolled: false, // Skip 3DS in sandbox
          transactionId: this.generateTransactionId(),
          secureToken: crypto.randomBytes(32).toString('hex')
        };
      }
      
      throw new Error('3D Secure enrollment check failed');
    }
  }

  /**
   * Process Visa payment
   */
  public async processPayment(request: VisaPaymentRequest): Promise<VisaPaymentResponse> {
    const startTime = Date.now();
    
    // Validate card
    if (!this.validateVisaCard(request.cardNumber)) {
      throw new Error('Invalid Visa card number');
    }
    
    if (this.isCardExpired(request.expiryMonth, request.expiryYear)) {
      throw new Error('Card has expired');
    }
    
    // Generate transaction ID
    const transactionId = this.generateTransactionId();
    
    // Prepare payment data
    const paymentData = {
      cardNumber: request.cardNumber,
      cardHolder: request.cardHolder,
      expiryMonth: request.expiryMonth,
      expiryYear: request.expiryYear,
      cvv: request.cvv,
      amount: request.amount,
      currency: request.currency,
      merchantId: this.merchantId,
      orderId: request.orderId,
      description: request.description,
      transactionId: transactionId,
      timestamp: new Date().toISOString()
    };
    
    const signature = this.createSignature(JSON.stringify(paymentData));
    
    try {
      const response = await axios.post(`${this.apiUrl}/payments/process`, paymentData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.merchantId,
          'X-Signature': signature
        },
        timeout: 45000
      });
      
      const processingTime = Date.now() - startTime;
      
      return {
        transactionId: response.data.transactionId || transactionId,
        status: response.data.status || 'SUCCESS',
        message: response.data.message || 'Payment processed successfully',
        amount: request.amount,
        timestamp: new Date().toISOString(),
        authCode: response.data.authCode,
        processingTime: processingTime,
        secureToken: response.data.secureToken
      };
      
    } catch (error: any) {
      console.error('Visa payment failed:', error.response?.data || error.message);
      
      // Handle different error types
      if (error.response?.status === 402) {
        throw new Error('Insufficient funds');
      } else if (error.response?.status === 401) {
        throw new Error('Card declined');
      } else if (error.response?.status === 403) {
        throw new Error('Transaction blocked');
      }
      
      // For development/testing, simulate success
      if (this.sandboxMode && request.cardNumber.startsWith('4111')) {
        const processingTime = Date.now() - startTime;
        return {
          transactionId: transactionId,
          status: 'SUCCESS',
          message: 'Payment processed successfully (sandbox)',
          amount: request.amount,
          timestamp: new Date().toISOString(),
          authCode: 'AUTH_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          processingTime: processingTime,
          secureToken: crypto.randomBytes(32).toString('hex')
        };
      }
      
      throw new Error('Payment processing failed');
    }
  }

  /**
   * Check payment status
   */
  public async checkPaymentStatus(transactionId: string): Promise<VisaPaymentResponse> {
    const requestData = {
      transactionId: transactionId,
      merchantId: this.merchantId,
      timestamp: new Date().toISOString()
    };
    
    const signature = this.createSignature(JSON.stringify(requestData));
    
    try {
      const response = await axios.get(`${this.apiUrl}/payments/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Merchant-Id': this.merchantId,
          'X-Signature': signature
        },
        timeout: 15000
      });
      
      return {
        transactionId: response.data.transactionId,
        status: response.data.status,
        message: response.data.message,
        amount: response.data.amount,
        timestamp: response.data.timestamp,
        authCode: response.data.authCode,
        processingTime: response.data.processingTime || 0
      };
      
    } catch (error) {
      console.error('Payment status check failed:', error);
      throw new Error('Unable to check payment status');
    }
  }

  /**
   * Refund a payment
   */
  public async refundPayment(transactionId: string, amount?: number): Promise<VisaPaymentResponse> {
    const requestData = {
      transactionId: transactionId,
      refundAmount: amount,
      merchantId: this.merchantId,
      timestamp: new Date().toISOString()
    };
    
    const signature = this.createSignature(JSON.stringify(requestData));
    
    try {
      const response = await axios.post(`${this.apiUrl}/payments/refund`, requestData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.merchantId,
          'X-Signature': signature
        },
        timeout: 30000
      });
      
      return {
        transactionId: response.data.refundTransactionId,
        status: response.data.status,
        message: response.data.message,
        amount: response.data.refundAmount,
        timestamp: new Date().toISOString(),
        processingTime: 0
      };
      
    } catch (error) {
      console.error('Refund failed:', error);
      throw new Error('Refund processing failed');
    }
  }

  /**
   * Luhn algorithm for card validation
   */
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return (sum % 10) === 0;
  }
}

export const visaPaymentService = new VisaPaymentService();