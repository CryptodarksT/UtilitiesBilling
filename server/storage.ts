import { 
  customers, 
  bills, 
  payments, 
  type Customer, 
  type Bill, 
  type Payment,
  type InsertCustomer, 
  type InsertBill, 
  type InsertPayment 
} from "@shared/schema";

export interface IStorage {
  // Customer operations
  getCustomer(customerId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  // Bill operations
  getBillByCustomerId(customerId: string, billType: string, provider: string): Promise<Bill | undefined>;
  getBillById(id: number | string): Promise<Bill | undefined>;
  createBill(bill: InsertBill, customId?: string): Promise<Bill>;
  updateBillStatus(id: number | string, status: string): Promise<void>;
  getBillsByCustomerId(customerId: string): Promise<Bill[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string): Promise<void>;
  getPaymentsByCustomerId(customerId: string): Promise<Payment[]>;
  getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private bills: Map<string, Bill>; // Changed to string for real API IDs
  private payments: Map<number, Payment>;
  private currentCustomerId: number = 1;
  private currentBillId: number = 1;
  private currentPaymentId: number = 1;

  constructor() {
    this.customers = new Map();
    this.bills = new Map();
    this.payments = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed some sample customers
    const sampleCustomers: Customer[] = [
      {
        id: 1,
        customerId: "EVN001234",
        name: "Nguyễn Văn A",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        phone: "0901234567",
        email: "nguyenvana@email.com",
        createdAt: new Date(),
      },
      {
        id: 2,
        customerId: "SAW987654",
        name: "Trần Thị B",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        phone: "0987654321",
        email: "tranthib@email.com",
        createdAt: new Date(),
      },
      {
        id: 3,
        customerId: "FPT789012",
        name: "Lê Văn C",
        address: "789 Đường DEF, Quận 3, TP.HCM",
        phone: "0912345678",
        email: "levanc@email.com",
        createdAt: new Date(),
      },
    ];

    sampleCustomers.forEach(customer => {
      this.customers.set(customer.customerId, customer);
    });

    // Seed some sample bills
    const sampleBills: Bill[] = [
      {
        id: 1,
        customerId: "EVN001234",
        billType: "electricity",
        provider: "EVN TP.HCM",
        period: "Tháng 12/2024",
        oldIndex: 500,
        newIndex: 842,
        consumption: 342,
        amount: "855000",
        status: "pending",
        dueDate: new Date("2024-12-31"),
        createdAt: new Date(),
      },
      {
        id: 2,
        customerId: "SAW987654",
        billType: "water",
        provider: "SAWACO",
        period: "Tháng 12/2024",
        oldIndex: 120,
        newIndex: 135,
        consumption: 15,
        amount: "225000",
        status: "pending",
        dueDate: new Date("2024-12-31"),
        createdAt: new Date(),
      },
      {
        id: 3,
        customerId: "FPT789012",
        billType: "internet",
        provider: "FPT Telecom",
        period: "Tháng 12/2024",
        oldIndex: 1,
        newIndex: 1,
        consumption: 1,
        amount: "350000",
        status: "pending",
        dueDate: new Date("2024-12-31"),
        createdAt: new Date(),
      },
    ];

    sampleBills.forEach(bill => {
      this.bills.set(bill.id.toString(), bill);
    });

    this.currentCustomerId = 4;
    this.currentBillId = 4;
  }

  async getCustomer(customerId: string): Promise<Customer | undefined> {
    return this.customers.get(customerId);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const customer: Customer = {
      id: this.currentCustomerId++,
      ...insertCustomer,
      email: insertCustomer.email || null,
      phone: insertCustomer.phone || null,
      createdAt: new Date(),
    };
    this.customers.set(customer.customerId, customer);
    return customer;
  }

  async getBillByCustomerId(customerId: string, billType: string, provider: string): Promise<Bill | undefined> {
    for (const bill of this.bills.values()) {
      if (bill.customerId === customerId && bill.billType === billType && bill.provider === provider) {
        return bill;
      }
    }
    return undefined;
  }

  async getBillById(id: number | string): Promise<Bill | undefined> {
    const stringId = id.toString();
    return this.bills.get(stringId);
  }

  async createBill(insertBill: InsertBill, customId?: string): Promise<Bill> {
    const billId = customId || this.currentBillId++;
    const bill: Bill = {
      id: billId,
      ...insertBill,
      status: insertBill.status || "pending",
      oldIndex: insertBill.oldIndex || null,
      newIndex: insertBill.newIndex || null,
      consumption: insertBill.consumption || null,
      createdAt: new Date(),
    };
    this.bills.set(billId.toString(), bill);
    return bill;
  }

  async updateBillStatus(id: number | string, status: string): Promise<void> {
    const stringId = id.toString();
    const bill = this.bills.get(stringId);
    
    if (bill) {
      bill.status = status;
      this.bills.set(stringId, bill);
    }
  }

  async getBillsByCustomerId(customerId: string): Promise<Bill[]> {
    return Array.from(this.bills.values()).filter(bill => bill.customerId === customerId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      id: this.currentPaymentId++,
      ...insertPayment,
      status: insertPayment.status || "pending",
      createdAt: new Date(),
      paidAt: null,
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  async updatePaymentStatus(id: number, status: string): Promise<void> {
    const payment = this.payments.get(id);
    if (payment) {
      payment.status = status;
      if (status === "completed") {
        payment.paidAt = new Date();
      }
      this.payments.set(id, payment);
    }
  }

  async getPaymentsByCustomerId(customerId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.customerId === customerId);
  }

  async getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined> {
    for (const payment of this.payments.values()) {
      if (payment.transactionId === transactionId) {
        return payment;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
