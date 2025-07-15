import * as XLSX from 'xlsx';
import { storage } from './storage';
import type { InsertCustomer, InsertBill } from '@shared/schema';

export interface ExcelBillData {
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  billType: string;
  provider: string;
  period: string;
  amount: string;
  dueDate: string;
  status: string;
  oldIndex?: number;
  newIndex?: number;
  consumption?: number;
}

export class ExcelService {
  
  async processExcelFile(buffer: Buffer): Promise<{ processed: number; errors: string[] }> {
    try {
      // Read Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
      
      const errors: string[] = [];
      let processed = 0;
      
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        try {
          await this.processRow(row, i + 2); // +2 because row 1 is header and Excel is 1-indexed
          processed++;
        } catch (error: any) {
          errors.push(`Dòng ${i + 2}: ${error.message}`);
        }
      }
      
      return { processed, errors };
    } catch (error: any) {
      throw new Error(`Lỗi xử lý file Excel: ${error.message}`);
    }
  }
  
  private async processRow(row: any, rowNumber: number): Promise<void> {
    // Validate required fields
    const requiredFields = ['customerId', 'customerName', 'customerAddress', 'billType', 'provider', 'amount', 'dueDate'];
    
    for (const field of requiredFields) {
      if (!row[field]) {
        throw new Error(`Thiếu trường bắt buộc: ${field}`);
      }
    }
    
    // Validate bill type
    const validBillTypes = ['electricity', 'water', 'internet', 'television'];
    if (!validBillTypes.includes(row.billType)) {
      throw new Error(`Loại hóa đơn không hợp lệ: ${row.billType}. Phải là: ${validBillTypes.join(', ')}`);
    }
    
    // Validate amount
    const amount = parseFloat(row.amount.toString().replace(/[^\d.]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Số tiền không hợp lệ: ${row.amount}`);
    }
    
    // Validate date
    let dueDate: Date;
    try {
      dueDate = new Date(row.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new Error(`Ngày hết hạn không hợp lệ: ${row.dueDate}`);
      }
    } catch {
      throw new Error(`Ngày hết hạn không hợp lệ: ${row.dueDate}`);
    }
    
    // Create or update customer
    let customer = await storage.getCustomer(row.customerId);
    if (!customer) {
      const customerData: InsertCustomer = {
        customerId: row.customerId,
        name: row.customerName,
        address: row.customerAddress,
        phone: row.customerPhone || null,
        email: row.customerEmail || null,
      };
      customer = await storage.createCustomer(customerData);
    }
    
    // Create bill
    const billData: InsertBill = {
      customerId: row.customerId,
      billType: row.billType,
      provider: row.provider,
      period: row.period || new Date().toISOString().slice(0, 7),
      oldIndex: row.oldIndex ? parseInt(row.oldIndex.toString()) : null,
      newIndex: row.newIndex ? parseInt(row.newIndex.toString()) : null,
      consumption: row.consumption ? parseInt(row.consumption.toString()) : null,
      amount: amount.toString(),
      status: row.status || 'pending',
      dueDate: dueDate,
    };
    
    await storage.createBill(billData);
  }
  
  generateExcelTemplate(): Buffer {
    const templateData = [
      {
        customerId: 'EVN001234',
        customerName: 'Nguyễn Văn An',
        customerAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        customerPhone: '0901234567',
        customerEmail: 'nguyenvanan@gmail.com',
        billType: 'electricity',
        provider: 'EVN TP.HCM',
        period: '2024-01',
        amount: '350000',
        dueDate: '2024-02-15',
        status: 'pending',
        oldIndex: 1000,
        newIndex: 1150,
        consumption: 150
      },
      {
        customerId: 'SAW987654',
        customerName: 'Trần Thị Bình',
        customerAddress: '456 Trần Hưng Đạo, Quận 5, TP.HCM',
        customerPhone: '0987654321',
        customerEmail: 'tranthibinh@gmail.com',
        billType: 'water',
        provider: 'SAWACO',
        period: '2024-01',
        amount: '180000',
        dueDate: '2024-02-20',
        status: 'pending',
        oldIndex: 50,
        newIndex: 62,
        consumption: 12
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // customerId
      { wch: 20 }, // customerName
      { wch: 30 }, // customerAddress
      { wch: 15 }, // customerPhone
      { wch: 25 }, // customerEmail
      { wch: 12 }, // billType
      { wch: 15 }, // provider
      { wch: 10 }, // period
      { wch: 12 }, // amount
      { wch: 12 }, // dueDate
      { wch: 10 }, // status
      { wch: 10 }, // oldIndex
      { wch: 10 }, // newIndex
      { wch: 12 }, // consumption
    ];
    
    worksheet['!cols'] = columnWidths;
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}