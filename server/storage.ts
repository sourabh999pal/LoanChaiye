import { loanLeads, users, type User, type InsertUser, type LoanLead, type InsertLoanLead } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLoanLead(lead: InsertLoanLead): Promise<LoanLead>;
  getLoanLead(id: number): Promise<LoanLead | undefined>;
  getAllLoanLeads(): Promise<LoanLead[]>;
  getLoanLeadsByDateRange(startDate: Date, endDate: Date): Promise<LoanLead[]>;
  getLoanLeadsByOccupationType(occupationType: string): Promise<LoanLead[]>;
  updateLoanLeadStatus(id: number, status: string): Promise<LoanLead | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLoanLead(insertLead: InsertLoanLead): Promise<LoanLead> {
    const [lead] = await db
      .insert(loanLeads)
      .values({
        ...insertLead,
        status: "new",
        createdAt: new Date()
      })
      .returning();
    return lead;
  }

  async getLoanLead(id: number): Promise<LoanLead | undefined> {
    const [lead] = await db.select().from(loanLeads).where(eq(loanLeads.id, id));
    return lead;
  }

  async getAllLoanLeads(): Promise<LoanLead[]> {
    return await db.select().from(loanLeads);
  }

  async getLoanLeadsByDateRange(startDate: Date, endDate: Date): Promise<LoanLead[]> {
    return await db
      .select()
      .from(loanLeads)
      .where(
        and(
          gte(loanLeads.createdAt, startDate),
          lte(loanLeads.createdAt, endDate)
        )
      );
  }

  async getLoanLeadsByOccupationType(occupationType: string): Promise<LoanLead[]> {
    return await db
      .select()
      .from(loanLeads)
      .where(eq(loanLeads.occupationType, occupationType));
  }

  async updateLoanLeadStatus(id: number, status: string): Promise<LoanLead | undefined> {
    const [updatedLead] = await db
      .update(loanLeads)
      .set({ status })
      .where(eq(loanLeads.id, id))
      .returning();
    return updatedLead;
  }

  // Initialize the database with a default admin user if it doesn't exist
  async initialize() {
    const adminUser = await this.getUserByUsername("admin");
    if (!adminUser) {
      await this.createUser({
        username: "admin",
        password: "adminpass", // In a real app, this would be hashed
        isAdmin: true,
      });
      console.log("Created default admin user");
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize the storage with default data
storage.initialize().catch(err => {
  console.error("Failed to initialize storage:", err);
});
