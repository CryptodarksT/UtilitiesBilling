import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  customerId: text("customer_id").notNull().unique(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  billType: text("bill_type").notNull(), // electricity, water, internet, tv
  provider: text("provider").notNull(),
  period: text("period").notNull(),
  oldIndex: integer("old_index"),
  newIndex: integer("new_index"),
  consumption: integer("consumption"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").notNull(),
  customerId: text("customer_id").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // qr, bank, ewallet
  transactionId: text("transaction_id").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User accounts for business customers
export const userAccounts = pgTable("user_accounts", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  businessName: text("business_name"),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Linked cards for customers
export const linkedCards = pgTable("linked_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userAccounts.id),
  customerId: text("customer_id").notNull(),
  cardType: text("card_type").notNull(), // visa, mastercard, local_bank
  cardNumber: text("card_number").notNull(), // Encrypted
  cardHolderName: text("card_holder_name").notNull(),
  expiryMonth: text("expiry_month"),
  expiryYear: text("expiry_year"),
  bankName: text("bank_name"),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  momoToken: text("momo_token"), // For MoMo linked cards
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer tokens for auto-payment
export const customerTokens = pgTable("customer_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userAccounts.id),
  customerId: text("customer_id").notNull(),
  token: text("token").notNull().unique(),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  paidAt: true,
});

export const billLookupSchema = z.object({
  billType: z.string().min(1, "Vui lòng chọn loại hóa đơn"),
  provider: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  customerId: z.string().min(1, "Vui lòng nhập mã khách hàng"),
});

export const billNumberLookupSchema = z.object({
  billNumber: z.string()
    .min(13, "Số hóa đơn phải có 13 ký tự")
    .max(13, "Số hóa đơn phải có 13 ký tự")
    .regex(/^[A-Z]{2}\d{11}$/, "Số hóa đơn không đúng định dạng (VD: PD29007350490)")
});

export const paymentRequestSchema = z.object({
  billId: z.number(),
  paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
});

export const insertUserAccountSchema = createInsertSchema(userAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLinkedCardSchema = createInsertSchema(linkedCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerTokenSchema = createInsertSchema(customerTokens).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
});

export const cardLinkingSchema = z.object({
  customerId: z.string().min(1, "Vui lòng nhập mã khách hàng"),
  cardType: z.string().min(1, "Vui lòng chọn loại thẻ"),
  cardNumber: z.string().min(16, "Số thẻ không hợp lệ"),
  cardHolderName: z.string().min(1, "Vui lòng nhập tên chủ thẻ"),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  bankName: z.string().optional(),
});

export type Customer = typeof customers.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type UserAccount = typeof userAccounts.$inferSelect;
export type LinkedCard = typeof linkedCards.$inferSelect;
export type CustomerToken = typeof customerTokens.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertUserAccount = z.infer<typeof insertUserAccountSchema>;
export type InsertLinkedCard = z.infer<typeof insertLinkedCardSchema>;
export type InsertCustomerToken = z.infer<typeof insertCustomerTokenSchema>;
export type BillLookup = z.infer<typeof billLookupSchema>;
export type BillNumberLookup = z.infer<typeof billNumberLookupSchema>;
export type PaymentRequest = z.infer<typeof paymentRequestSchema>;
export type CardLinking = z.infer<typeof cardLinkingSchema>;
