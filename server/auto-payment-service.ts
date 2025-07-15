import * as XLSX from 'xlsx';
import { storage } from './storage';
import { BIDVService } from './bidv-service';
import { MoMoService } from './momo-service';
import type { Bill, Customer, Payment } from '@shared/schema';

export interface AutoPaymentRow {
  billNumber?: string;
  customerId?: string;
  amount?: string;
  paymentMethod?: string;
}

export interface AutoPaymentResult {
  billNumber: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  amount?: string;
  transactionId?: string;
  timestamp: string;
}

export class AutoPaymentService {
  private bidvService: BIDVService;
  private momoService: MoMoService;
  
  constructor() {
    this.bidvService = new BIDVService();
    this.momoService = new MoMoService();
  }
  
  async processAutoPaymentFile(buffer: Buffer, visaCardToken?: string): Promise<{
    results: AutoPaymentResult[];
    summary: {
      total: number;
      success: number;
      failed: number;
      skipped: number;
      totalAmount: number;
    };
  }> {
    try {
      // Read Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as AutoPaymentRow[];
      
      const results: AutoPaymentResult[] = [];
      let totalAmount = 0;
      let successCount = 0;
      let failedCount = 0;
      let skippedCount = 0;
      
      // Process each row
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const result = await this.processPaymentRow(row, i + 2, visaCardToken);
        
        results.push(result);
        
        if (result.status === 'success') {
          successCount++;
          if (result.amount) {
            totalAmount += parseFloat(result.amount);
          }
        } else if (result.status === 'failed') {
          failedCount++;
        } else {
          skippedCount++;
        }
      }
      
      return {
        results,
        summary: {
          total: jsonData.length,
          success: successCount,
          failed: failedCount,
          skipped: skippedCount,
          totalAmount
        }
      };
    } catch (error: any) {
      throw new Error(`Lỗi xử lý file Excel: ${error.message}`);
    }
  }
  
  private async processPaymentRow(
    row: AutoPaymentRow, 
    rowNumber: number,
    visaCardToken?: string
  ): Promise<AutoPaymentResult> {
    const timestamp = new Date().toISOString();
    
    try {
      // Validate required fields
      if (!row.billNumber && !row.customerId) {
        return {
          billNumber: row.billNumber || `Dòng ${rowNumber}`,
          status: 'skipped',
          message: `Dòng ${rowNumber}: Thiếu số hóa đơn hoặc mã khách hàng`,
          timestamp
        };
      }
      
      let bill: Bill | undefined;
      let customer: Customer | undefined;
      
      // Try to find bill by bill number first
      if (row.billNumber) {
        try {
          // Validate bill number format
          if (!this.bidvService.validateBillNumber(row.billNumber)) {
            return {
              billNumber: row.billNumber,
              status: 'skipped',
              message: `Số hóa đơn không đúng định dạng: ${row.billNumber}`,
              timestamp
            };
          }
          
          // Look up bill from BIDV
          const billType = this.bidvService.getBillTypeFromNumber(row.billNumber);
          const provider = this.bidvService.getProviderFromNumber(row.billNumber);
          const bidvResponse = await this.bidvService.lookupBill({
            billNumber: row.billNumber,
            billType,
            provider
          });
          
          // Create or find customer
          customer = await storage.getCustomer(row.billNumber);
          if (!customer) {
            customer = await storage.createCustomer({
              customerId: row.billNumber,
              name: bidvResponse.customerName,
              address: bidvResponse.customerAddress,
              phone: bidvResponse.customerPhone,
              email: bidvResponse.customerEmail,
            });
          }
          
          // Create or find bill
          bill = await storage.getBillByCustomerId(row.billNumber, billType, provider);
          if (!bill) {
            bill = await storage.createBill({
              customerId: row.billNumber,
              billType,
              provider,
              period: bidvResponse.period || new Date().toISOString().slice(0, 7),
              oldIndex: bidvResponse.oldReading ? parseInt(bidvResponse.oldReading) : null,
              newIndex: bidvResponse.newReading ? parseInt(bidvResponse.newReading) : null,
              consumption: null,
              amount: bidvResponse.amount,
              status: bidvResponse.status,
              dueDate: new Date(bidvResponse.dueDate)
            });
          }
        } catch (error: any) {
          return {
            billNumber: row.billNumber,
            status: 'skipped',
            message: `Không tìm thấy hóa đơn ${row.billNumber}: ${error.message}`,
            timestamp
          };
        }
      }
      // Otherwise try by customer ID
      else if (row.customerId) {
        customer = await storage.getCustomer(row.customerId);
        if (!customer) {
          return {
            billNumber: row.customerId,
            status: 'skipped',
            message: `Không tìm thấy khách hàng: ${row.customerId}`,
            timestamp
          };
        }
        
        // Get pending bills for customer
        const bills = await storage.getBillsByCustomerId(row.customerId);
        const pendingBills = bills.filter(b => b.status === 'pending');
        
        if (pendingBills.length === 0) {
          return {
            billNumber: row.customerId,
            status: 'skipped',
            message: `Không có hóa đơn chờ thanh toán cho khách hàng: ${row.customerId}`,
            timestamp
          };
        }
        
        // Use the first pending bill
        bill = pendingBills[0];
      }
      
      if (!bill || !customer) {
        return {
          billNumber: row.billNumber || row.customerId || `Dòng ${rowNumber}`,
          status: 'skipped',
          message: 'Không tìm thấy hóa đơn hoặc khách hàng',
          timestamp
        };
      }
      
      // Check if bill is already paid
      if (bill.status === 'paid') {
        return {
          billNumber: row.billNumber || bill.id.toString(),
          status: 'skipped',
          message: 'Hóa đơn đã được thanh toán',
          amount: bill.amount,
          timestamp
        };
      }
      
      // Process payment with MoMo (Visa)
      const transactionId = `AUTO${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        // Create payment record
        const payment = await storage.createPayment({
          billId: bill.id,
          amount: bill.amount,
          paymentMethod: 'momo-visa',
          transactionId,
          status: 'processing'
        });
        
        // For demo purposes, simulate successful payment
        // In real implementation, this would call MoMo API with visaCardToken
        const paymentRequest = {
          amount: parseFloat(bill.amount),
          orderInfo: `Thanh toán hóa đơn ${row.billNumber || bill.id}`,
          orderId: transactionId,
          redirectUrl: 'https://payoo.vn/payment/success',
          ipnUrl: 'https://payoo.vn/api/payments/momo/ipn',
          extraData: JSON.stringify({ 
            billId: bill.id,
            autoPayment: true,
            visaCardToken
          })
        };
        
        // Simulate MoMo payment (in production, this would be real API call)
        const momoResponse = await this.momoService.createPayment(paymentRequest);
        
        // Update payment and bill status
        await storage.updatePaymentStatus(payment.id, 'completed');
        await storage.updateBillStatus(bill.id, 'paid');
        
        return {
          billNumber: row.billNumber || bill.id.toString(),
          status: 'success',
          message: `Thanh toán thành công cho ${customer.name}`,
          amount: bill.amount,
          transactionId,
          timestamp
        };
        
      } catch (error: any) {
        return {
          billNumber: row.billNumber || bill.id.toString(),
          status: 'failed',
          message: `Lỗi thanh toán: ${error.message}`,
          amount: bill.amount,
          timestamp
        };
      }
      
    } catch (error: any) {
      return {
        billNumber: row.billNumber || row.customerId || `Dòng ${rowNumber}`,
        status: 'failed',
        message: `Lỗi xử lý: ${error.message}`,
        timestamp
      };
    }
  }
  
  generateResultReport(results: AutoPaymentResult[]): Buffer {
    const worksheetData = results.map(r => ({
      'Số hóa đơn': r.billNumber,
      'Trạng thái': r.status === 'success' ? 'Thành công' : r.status === 'failed' ? 'Thất bại' : 'Bỏ qua',
      'Thông báo': r.message,
      'Số tiền': r.amount || '',
      'Mã giao dịch': r.transactionId || '',
      'Thời gian': new Date(r.timestamp).toLocaleString('vi-VN')
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kết quả thanh toán');
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Số hóa đơn
      { wch: 12 }, // Trạng thái
      { wch: 50 }, // Thông báo
      { wch: 15 }, // Số tiền
      { wch: 25 }, // Mã giao dịch
      { wch: 20 }, // Thời gian
    ];
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
  
  generateTemplateFile(): Buffer {
    const templateData = [
      {
        billNumber: 'PD29007350490',
        customerId: '',
        amount: '',
        paymentMethod: 'visa'
      },
      {
        billNumber: 'WB29007654321',
        customerId: '',
        amount: '',
        paymentMethod: 'visa'
      },
      {
        billNumber: '',
        customerId: 'KH001234',
        amount: '',
        paymentMethod: 'visa'
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auto Payment');
    
    // Add instructions
    const instructions = [
      ['HƯỚNG DẪN SỬ DỤNG:'],
      [''],
      ['1. Điền số hóa đơn (billNumber) HOẶC mã khách hàng (customerId)'],
      ['2. Nếu có cả hai, hệ thống sẽ ưu tiên số hóa đơn'],
      ['3. Bỏ trống amount nếu muốn thanh toán toàn bộ số tiền hóa đơn'],
      ['4. paymentMethod: visa (mặc định)'],
      [''],
      ['Định dạng số hóa đơn:'],
      ['- Điện: PD + 11 số (VD: PD29007350490)'],
      ['- Nước: WB + 11 số (VD: WB29007654321)'],
      ['- Internet: IT + 11 số'],
      ['- Truyền hình: TV + 11 số']
    ];
    
    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Hướng dẫn');
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // billNumber
      { wch: 15 }, // customerId
      { wch: 15 }, // amount
      { wch: 15 }, // paymentMethod
    ];
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}