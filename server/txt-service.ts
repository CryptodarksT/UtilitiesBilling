import { storage } from "./storage";

export class TxtService {
  
  async processTxtFile(buffer: Buffer): Promise<{ processed: number; errors: string[] }> {
    try {
      // Read TXT file
      const content = buffer.toString('utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      const errors: string[] = [];
      let processed = 0;
      
      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;
        
        try {
          await this.processLine(line, i + 2); // +2 because line 1 is header and starting from line 2
          processed++;
        } catch (error: any) {
          errors.push(`Dòng ${i + 2}: ${error.message}`);
        }
      }
      
      return { processed, errors };
    } catch (error: any) {
      throw new Error(`Lỗi xử lý file TXT: ${error.message}`);
    }
  }
  
  private async processLine(line: string, lineNumber: number): Promise<void> {
    // Parse line - format: customerId|customerName|customerAddress|billType|provider|amount|dueDate
    const parts = line.split('|');
    
    if (parts.length < 7) {
      throw new Error(`Định dạng dòng không đúng - cần 7 trường, có ${parts.length} trường`);
    }
    
    const [customerId, customerName, customerAddress, billType, provider, amount, dueDate] = parts;
    
    // Validate required fields
    if (!customerId || !customerName || !customerAddress || !billType || !provider || !amount || !dueDate) {
      throw new Error(`Thiếu thông tin bắt buộc`);
    }
    
    // Validate bill type
    const validBillTypes = ['electricity', 'water', 'internet', 'tv'];
    if (!validBillTypes.includes(billType)) {
      throw new Error(`Loại hóa đơn không hợp lệ: ${billType}`);
    }
    
    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      throw new Error(`Số tiền không hợp lệ: ${amount}`);
    }
    
    // Validate due date
    const dueDateValue = new Date(dueDate);
    if (isNaN(dueDateValue.getTime())) {
      throw new Error(`Ngày hết hạn không hợp lệ: ${dueDate}`);
    }
    
    // Create or find customer
    let customer = await storage.getCustomer(customerId);
    if (!customer) {
      customer = await storage.createCustomer({
        customerId,
        name: customerName,
        address: customerAddress,
        phone: null,
        email: null
      });
    }
    
    // Create bill
    await storage.createBill({
      customerId,
      billType,
      provider,
      period: new Date().toISOString().slice(0, 7), // Current month
      oldIndex: null,
      newIndex: null,
      consumption: null,
      amount: amount,
      status: "pending",
      dueDate: dueDateValue
    });
  }
  
  generateTxtTemplate(): string {
    const template = `customerId|customerName|customerAddress|billType|provider|amount|dueDate
EVN001234|Nguyễn Văn A|123 Nguyễn Huệ, Q1, TP.HCM|electricity|EVN TP.HCM|500000|2025-08-15
SAW567890|Trần Thị B|456 Lê Lợi, Q2, TP.HCM|water|SAWACO|150000|2025-08-20
FPT123456|Lê Văn C|789 Trần Hưng Đạo, Q3, TP.HCM|internet|FPT Telecom|300000|2025-08-25

# Hướng dẫn sử dụng:
# - Mỗi dòng là một hóa đơn
# - Các trường cách nhau bằng dấu |
# - Định dạng ngày: YYYY-MM-DD
# - Loại hóa đơn: electricity, water, internet, tv
# - Số tiền: số nguyên (đơn vị VND)
# - Không để trống các trường bắt buộc`;
    
    return template;
  }
}