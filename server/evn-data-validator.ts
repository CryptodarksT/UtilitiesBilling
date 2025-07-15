import { BillInfo } from './real-bill-service';

export class EVNDataValidator {
  
  /**
   * Validates and corrects EVN electricity bill data
   * Ensures data integrity and proper calculation
   */
  static validateAndCorrectEVNData(billData: any): any {
    if (!billData) {
      return billData;
    }

    // Check if this is an EVN electricity bill
    const isEVNBill = billData.billType === 'electricity' || 
                     billData.provider === 'PC_HCMC' ||
                     billData.provider === 'evn-hcm' ||
                     (billData.billNumber && billData.billNumber.startsWith('PD'));

    if (!isEVNBill) {
      return billData;
    }

    // EVN data corrections based on real format
    const correctedData = { ...billData };
    
    // Fix customer name and address mapping
    if (!correctedData.customerName && correctedData.name) {
      correctedData.customerName = correctedData.name;
    }
    if (!correctedData.address && correctedData.customerAddress) {
      correctedData.address = correctedData.customerAddress;
    }
    
    // Ensure customer info is properly formatted
    if (correctedData.customerName) {
      correctedData.customerName = correctedData.customerName.trim();
    }
    if (correctedData.address) {
      correctedData.address = correctedData.address.trim();
    }
    
    // Fix meter reading logic for EVN
    if (correctedData.oldIndex && correctedData.newIndex) {
      const oldReading = parseInt(correctedData.oldIndex.toString());
      const newReading = parseInt(correctedData.newIndex.toString());
      
      // EVN sometimes shows readings in different order
      // Calculate actual consumption based on the consumption value provided
      if (correctedData.consumption) {
        const actualConsumption = parseInt(correctedData.consumption.toString());
        
        // Correct the readings to match consumption
        if (actualConsumption > 0) {
          // If we have consumption, ensure readings are consistent
          if (newReading < oldReading) {
            // Swap readings if they appear reversed
            correctedData.oldIndex = newReading;
            correctedData.newIndex = oldReading;
          }
          
          // Verify consumption calculation
          const calculatedConsumption = correctedData.newIndex - correctedData.oldIndex;
          if (calculatedConsumption !== actualConsumption) {
            // If calculation doesn't match, trust the consumption value
            correctedData.newIndex = correctedData.oldIndex + actualConsumption;
          }
        }
      }
    }
    
    // Format amount properly for EVN
    if (correctedData.amount) {
      const amountStr = correctedData.amount.toString();
      // Remove 'đ' suffix if present and convert to number
      const cleanAmount = amountStr.replace(/[^\d.,]/g, '').replace(',', '.');
      correctedData.amount = parseFloat(cleanAmount);
    }
    
    // Ensure proper date format
    if (correctedData.dueDate) {
      try {
        const dateStr = correctedData.dueDate.toString();
        // Handle Vietnamese date format DD/MM/YYYY
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            correctedData.dueDate = `${year}-${month}-${day}`;
          }
        }
      } catch (error) {
        console.error('Error parsing due date:', error);
      }
    }
    
    // Ensure proper provider name format
    if (correctedData.provider === 'PC_HCMC' || correctedData.provider === 'evn-hcm') {
      correctedData.providerName = 'Điện lực TP. Hồ Chí Minh';
      correctedData.provider = 'PC_HCMC'; // Normalize provider name
    }
    
    return correctedData;
  }
  
  /**
   * Validates EVN bill number format
   */
  static validateEVNBillNumber(billNumber: string): boolean {
    // EVN bill numbers typically start with PD followed by digits
    const evnPattern = /^PD\d{11}$/;
    return evnPattern.test(billNumber);
  }
  
  /**
   * Extracts customer info from EVN bill data
   */
  static extractCustomerInfo(billData: any): any {
    return {
      customerId: billData.customerId || billData.billNumber,
      name: billData.customerName || billData.name || '',
      address: billData.customerAddress || billData.address || '',
      phone: billData.customerPhone || billData.phone || '',
      email: billData.customerEmail || billData.email || ''
    };
  }
  
  /**
   * Calculates EVN bill breakdown
   */
  static calculateEVNBillBreakdown(consumption: number, oldIndex: number, newIndex: number): any {
    const tiers = [
      { limit: 50, price: 1678 },
      { limit: 100, price: 1734 },
      { limit: 200, price: 2014 },
      { limit: 300, price: 2536 },
      { limit: 400, price: 2834 },
      { limit: Infinity, price: 2927 }
    ];
    
    let totalAmount = 0;
    let remainingConsumption = consumption;
    const breakdown: any[] = [];
    
    for (const tier of tiers) {
      if (remainingConsumption <= 0) break;
      
      const tierConsumption = Math.min(remainingConsumption, tier.limit);
      const tierAmount = tierConsumption * tier.price;
      
      totalAmount += tierAmount;
      remainingConsumption -= tierConsumption;
      
      breakdown.push({
        tier: tier.limit === Infinity ? '400+' : `0-${tier.limit}`,
        consumption: tierConsumption,
        price: tier.price,
        amount: tierAmount
      });
    }
    
    // Add VAT (10%)
    const vat = totalAmount * 0.1;
    const totalWithVAT = totalAmount + vat;
    
    return {
      subtotal: totalAmount,
      vat: vat,
      total: totalWithVAT,
      breakdown: breakdown
    };
  }
}