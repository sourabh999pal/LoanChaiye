import express, { Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import memorystore from "memorystore";
import { loginSchema, insertLoanLeadSchema } from "@shared/schema";
import { z } from "zod";

const MemoryStore = memorystore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup with proper cookie settings
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "loanchaiye-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      }
    })
  );

  // Passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post("/api/login", (req, res, next) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.status(200).json({ 
            id: user.id, 
            username: user.username,
            isAdmin: user.isAdmin 
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      next(error);
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Check auth status
  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.status(200).json({ 
        authenticated: true, 
        user: { 
          id: user.id, 
          username: user.username,
          isAdmin: user.isAdmin 
        }
      });
    }
    res.status(200).json({ authenticated: false });
  });

  // Middleware to check if user is authenticated and is admin
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (req.user as any).isAdmin) {
      return next();
    }
    res.status(403).json({ message: "Access denied" });
  };

  // Loan Lead API routes
  app.post("/api/leads", async (req, res, next) => {
    try {
      const lead = insertLoanLeadSchema.parse(req.body);
      const newLead = await storage.createLoanLead(lead);
      res.status(201).json(newLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0]?.message || "Invalid input" });
      }
      next(error);
    }
  });

  // Protected Admin routes
  app.get("/api/admin/leads", isAdmin, async (req, res, next) => {
    try {
      const leads = await storage.getAllLoanLeads();
      res.json(leads);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/leads/filter", isAdmin, async (req, res, next) => {
    try {
      const { startDate, endDate, occupationType } = req.query;
      let leads;

      if (startDate && endDate) {
        leads = await storage.getLoanLeadsByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else if (occupationType) {
        leads = await storage.getLoanLeadsByOccupationType(occupationType as string);
      } else {
        leads = await storage.getAllLoanLeads();
      }

      res.json(leads);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/leads/:id/status", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedLead = await storage.updateLoanLeadStatus(id, status);
      
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  });

  // CSV Export
  app.get("/api/admin/leads/export", isAdmin, async (req, res, next) => {
    try {
      const leads = await storage.getAllLoanLeads();
      
      // Convert leads to CSV format
      const headers = "ID,Full Name,Mobile,Email,PAN Card,Occupation,Company,Monthly Salary,Status,Created At\n";
      const rows = leads.map(lead => {
        return `${lead.id},"${lead.fullName || ''}","${lead.mobileNumber}","${lead.email || ''}","${lead.panCard || ''}","${lead.occupationType}","${lead.companyName || ''}","${lead.monthlySalary || ''}","${lead.status}","${lead.createdAt}"`
      }).join('\n');
      
      const csv = headers + rows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="loan-leads.csv"');
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
