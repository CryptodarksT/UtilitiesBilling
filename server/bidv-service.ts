import axios from 'axios';
import crypto from 'crypto';
import https from 'https';

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
    try {
      const timestamp = Date.now().toString();
      const requestData = JSON.stringify(request);
      const signature = this.createSignature(requestData, timestamp);

      const response = await axios.post<BIDVApiResponse>(
        `${this.apiUrl}/api/bills/lookup`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Timestamp': timestamp,
            'X-Signature': signature,
          },
          timeout: 30000, // 30 second timeout
          httpsAgent: new https.Agent({ 
            rejectUnauthorized: false,
            secureProtocol: 'TLSv1_2_method'
          }),
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
      
      // Handle different error types
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy hóa đơn với số này');
      } else if (error.response?.status === 401) {
        throw new Error('Lỗi xác thực API BIDV');
      } else if (error.response?.status === 400) {
        throw new Error('Số hóa đơn không hợp lệ');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout khi kết nối đến BIDV API');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối đến BIDV API');
      } else {
        throw new Error(error.message || 'Lỗi không xác định từ BIDV API');
      }
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
      default:
        return 'unknown';
    }
  }
}