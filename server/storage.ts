import { 
  customers, 
  bills, 
  payments, 
  customerCards,
  type Customer, 
  type Bill, 
  type Payment,
  type CustomerCard,
  type InsertCustomer, 
  type InsertBill, 
  type InsertPayment,
  type InsertCustomerCard
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
  
  // Bulk operations for stats
  getAllCustomers(): Promise<Customer[]>;
  getAllBills(): Promise<Bill[]>;
  getAllPayments(): Promise<Payment[]>;
  
  // Customer card operations
  getCustomerCards(customerId: string): Promise<CustomerCard[]>;
  createCustomerCard(card: InsertCustomerCard): Promise<CustomerCard>;
  updateCustomerCard(id: number, updates: Partial<CustomerCard>): Promise<CustomerCard>;
  deleteCustomerCard(id: number): Promise<void>;
  setDefaultCard(customerId: string, cardId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private bills: Map<string, Bill>; // Changed to string for real API IDs
  private payments: Map<number, Payment>;
  private customerCards: Map<number, CustomerCard>;
  private currentCustomerId: number = 1;
  private currentBillId: number = 1;
  private currentPaymentId: number = 1;
  private currentCardId: number = 1;

  constructor() {
    this.customers = new Map();
    this.bills = new Map();
    this.payments = new Map();
    this.customerCards = new Map();
    // NO SEED DATA - Only real data from APIs
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

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getAllBills(): Promise<Bill[]> {
    return Array.from(this.bills.values());
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getCustomerCards(customerId: string): Promise<CustomerCard[]> {
    return Array.from(this.customerCards.values()).filter(card => card.customerId === customerId);
  }

  async createCustomerCard(insertCard: InsertCustomerCard): Promise<CustomerCard> {
    const card: CustomerCard = {
      id: this.currentCardId++,
      ...insertCard,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customerCards.set(card.id, card);
    return card;
  }

  async updateCustomerCard(id: number, updates: Partial<CustomerCard>): Promise<CustomerCard> {
    const card = this.customerCards.get(id);
    if (!card) {
      throw new Error("Thẻ không tồn tại");
    }
    const updatedCard = { ...card, ...updates, updatedAt: new Date() };
    this.customerCards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCustomerCard(id: number): Promise<void> {
    this.customerCards.delete(id);
  }

  async setDefaultCard(customerId: string, cardId: number): Promise<void> {
    // Remove default from all cards of this customer
    for (const [id, card] of this.customerCards.entries()) {
      if (card.customerId === customerId) {
        this.customerCards.set(id, { ...card, isDefault: false, updatedAt: new Date() });
      }
    }
    // Set the specified card as default
    const card = this.customerCards.get(cardId);
    if (card && card.customerId === customerId) {
      this.customerCards.set(cardId, { ...card, isDefault: true, updatedAt: new Date() });
    }
  }
}

export const storage = new MemStorage();
