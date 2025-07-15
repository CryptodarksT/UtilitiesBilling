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

export type Customer = typeof customers.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type BillLookup = z.infer<typeof billLookupSchema>;
export type BillNumberLookup = z.infer<typeof billNumberLookupSchema>;
export type PaymentRequest = z.infer<typeof paymentRequestSchema>;
