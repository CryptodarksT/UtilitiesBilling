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

export const customerCards = pgTable("customer_cards", {
  id: serial("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  cardName: text("card_name").notNull(),
  cardNumber: text("card_number").notNull(), // Encrypted
  cardHolder: text("card_holder").notNull(),
  expiryMonth: text("expiry_month").notNull(),
  expiryYear: text("expiry_year").notNull(),
  cardType: text("card_type").notNull(), // visa, mastercard, jcb
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertCustomerCardSchema = createInsertSchema(customerCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  billId: z.union([z.number(), z.string()]),
  paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
  cardData: z.object({
    cardNumber: z.string().min(16, "Số thẻ không hợp lệ"),
    cardHolder: z.string().min(1, "Vui lòng nhập tên chủ thẻ"),
    expiryMonth: z.string().min(1, "Vui lòng chọn tháng hết hạn"),
    expiryYear: z.string().min(1, "Vui lòng chọn năm hết hạn"),
    cvv: z.string().min(3, "CVV không hợp lệ")
  }).optional()
});

export const batchQuerySchema = z.object({
  queries: z.array(z.object({
    type: z.enum(["customer_id", "bill_number"]),
    value: z.string().min(1, "Giá trị tìm kiếm không được để trống"),
    billType: z.string().optional(),
    provider: z.string().optional()
  })).min(1, "Phải có ít nhất 1 truy vấn").max(50, "Tối đa 50 truy vấn cùng lúc")
});

export const customerCardSchema = z.object({
  customerId: z.string().min(1, "Mã khách hàng không được để trống"),
  cardName: z.string().min(1, "Tên thẻ không được để trống"),
  cardNumber: z.string()
    .min(16, "Số thẻ phải có ít nhất 16 ký tự")
    .max(19, "Số thẻ không được quá 19 ký tự")
    .regex(/^\d+$/, "Số thẻ chỉ được chứa số"),
  cardHolder: z.string().min(1, "Tên chủ thẻ không được để trống"),
  expiryMonth: z.string()
    .min(1, "Tháng hết hạn không được để trống")
    .regex(/^(0[1-9]|1[0-2])$/, "Tháng hết hạn không hợp lệ"),
  expiryYear: z.string()
    .min(2, "Năm hết hạn không được để trống")
    .regex(/^\d{2}$/, "Năm hết hạn phải có 2 chữ số"),
  cardType: z.enum(["visa", "mastercard", "jcb", "amex"]),
  isDefault: z.boolean().default(false)
});

export type Customer = typeof customers.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type CustomerCard = typeof customerCards.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertCustomerCard = z.infer<typeof insertCustomerCardSchema>;
export type BillLookup = z.infer<typeof billLookupSchema>;
export type BillNumberLookup = z.infer<typeof billNumberLookupSchema>;
export type PaymentRequest = z.infer<typeof paymentRequestSchema>;
export type BatchQuery = z.infer<typeof batchQuerySchema>;
export type CustomerCardRequest = z.infer<typeof customerCardSchema>;
