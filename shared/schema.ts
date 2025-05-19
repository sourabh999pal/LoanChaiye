import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const loanLeads = pgTable("loan_leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  mobileNumber: text("mobile_number").notNull(),
  email: text("email"),
  panCard: text("pan_card"),
  occupationType: text("occupation_type").notNull(),
  companyName: text("company_name"),
  monthlySalary: integer("monthly_salary"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoanLeadSchema = createInsertSchema(loanLeads).pick({
  fullName: true,
  mobileNumber: true,
  email: true,
  panCard: true,
  occupationType: true,
  companyName: true,
  monthlySalary: true,
});

export type InsertLoanLead = z.infer<typeof insertLoanLeadSchema>;
export type LoanLead = typeof loanLeads.$inferSelect;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
