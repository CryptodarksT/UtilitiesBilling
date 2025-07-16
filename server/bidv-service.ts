import axios from 'axios';
import crypto from 'crypto';
import https from 'https';
import { constants } from 'crypto';

interface BIDVBillLookupRequest {
  billNumber: string;
  billType?: string;
  provider?: string;
}

interface BIDVBillResponse {
  billNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  billType: string;
  provider: string;
  amount: string;
  dueDate: string;
  status: string;
  period?: string;
  oldReading?: string;
  newReading?: string;
  unit?: string;
  unitPrice?: string;
  taxes?: string;
  fees?: string;
  description?: string;
}

interface BIDVApiResponse {
  success: boolean;
  message?: string;
  data?: BIDVBillResponse;
  error?: string;
}

export class BIDVService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.BIDV_API_KEY || '';
    this.apiSecret = process.env.BIDV_API_SECRET || '';
    this.apiUrl = process.env.BIDV_API_URL || '';

    if (!this.apiKey || !this.apiSecret || !this.apiUrl) {
      throw new Error('BIDV API credentials are not configured');
    }
  }

  private createSignature(data: string, timestamp: string): string {
    const message = `${data}${timestamp}${this.apiKey}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }

  async lookupBill(request: BIDVBillLookupRequest): Promise<BIDVBillResponse> {
    if (!this.apiKey || !this.apiSecret || !this.apiUrl) {
      throw new Error('BIDV API credentials not configured. Please contact administrator to configure API access.');
    }

    try {
      const timestamp = Date.now().toString();
      const requestData = JSON.stringify(request);
      const signature = this.createSignature(requestData, timestamp);

      // Configure HTTPS agent with proper SSL settings
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // Allow self-signed certificates for testing
        secureProtocol: 'TLSv1_2_method',
        ciphers: 'HIGH:!aNULL:!MD5',
        timeout: 30000,
        secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT
      });

      const response = await axios.post<BIDVApiResponse>(
        `${this.apiUrl}/bills/lookup`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Signature': signature,
            'X-Timestamp': timestamp,
            'User-Agent': 'Payoo-System/2.0'
          },
          timeout: 30000,
          httpsAgent,
          maxRedirects: 5
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || response.data.error || 'BIDV API request failed');
      }

      if (!response.data.data) {
        throw new Error('No bill data returned from BIDV API');
      }

      return response.data.data;
      
    } catch (error: any) {
      console.error('BIDV API Error:', error.message);
      
      // Provide clear error message instead of fallback data
      if (error.code === 'EPROTO' || error.code === 'ECONNRESET') {
        throw new Error('Không thể kết nối với hệ thống BIDV. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Không tìm thấy server BIDV. Vui lòng kiểm tra cấu hình API.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Kết nối với BIDV quá thời gian chờ. Vui lòng thử lại.');
      } else if (error.response?.status === 401) {
        throw new Error('Xác thực BIDV API thất bại. Vui lòng kiểm tra API credentials.');
      } else if (error.response?.status === 404) {
        throw new Error('Không tìm thấy hóa đơn với mã số này trong hệ thống BIDV.');
      } else {
        throw new Error(`Lỗi kết nối BIDV API: ${error.message}`);
      }
    }
  }

  // Method to check API connectivity 
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.apiKey || !this.apiSecret || !this.apiUrl) {
        return {
          success: false,
          message: 'API credentials not configured'
        };
      }

      const httpsAgent = new https.Agent({
        rejectUnauthorized: true,
        secureProtocol: 'TLSv1_2_method',
        timeout: 10000
      });

      const response = await axios.get(`${this.apiUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Payoo-System/2.0'
        },
        timeout: 10000,
        httpsAgent
      });

      return {
        success: true,
        message: 'BIDV API connection successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `BIDV API connection failed: ${error.message}`
      };
    }
  }

  // Get real provider list from BIDV API
  async getProviders(): Promise<{ [key: string]: string[] }> {
    try {
      const response = await axios.get(`${this.apiUrl}/providers`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Payoo-System/2.0'
        },
        timeout: 10000
      });

      return response.data.providers;
    } catch (error) {
      // Return basic provider list if API fails
      return {
        electricity: ['EVN TP.HCM', 'EVN Hà Nội', 'EVN Đà Nẵng'],
        water: ['SAWACO', 'HAWACO', 'DAWACO'],
        internet: ['VNPT', 'Viettel', 'FPT'],
        television: ['VTVCab', 'SCTV', 'K+'],
        phonecard: ['Viettel', 'Vinaphone', 'Mobifone']
      };
    }
  }

  // Validate bill number format
  validateBillNumber(billNumber: string): boolean {
    // Check if bill number matches pattern like PD29007350490
    const billPattern = /^[A-Z]{2}\d{11}$/;
    return billPattern.test(billNumber);
  }

  // Get bill type from bill number prefix
  getBillTypeFromNumber(billNumber: string): string {
    const prefix = billNumber.substring(0, 2);
    
    switch (prefix) {
      case 'PD':
        return 'electricity';
      case 'WB':
        return 'water';
      case 'IT':
        return 'internet';
      case 'TV':
        return 'television';
      case 'TC':
        return 'phonecard';
      default:
        return 'unknown';
    }
  }

  // Get suggested provider from bill number
  getProviderFromNumber(billNumber: string): string {
    const prefix = billNumber.substring(0, 2);
    const regionCode = billNumber.substring(2, 4);
    
    switch (prefix) {
      case 'PD':
        return regionCode === '29' ? 'evn-hcm' : 'evn-hanoi';
      case 'WB':
        return regionCode === '29' ? 'sawaco' : 'hawaco';
      case 'IT':
        return 'fpt-telecom';
      case 'TV':
        return 'vtvcab';
      case 'TC':
        const cardType = parseInt(billNumber.substring(4, 5));
        if (cardType <= 3) return 'viettel';
        if (cardType <= 6) return 'vinaphone';
        return 'mobifone';
      default:
        return 'unknown';
    }
  }
}