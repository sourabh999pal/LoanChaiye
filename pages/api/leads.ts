import { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../server/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Convert form data to the database schema format
      const leadData = {
        fullName: req.body.fullName || '',
        mobileNumber: req.body.mobileNumber,
        email: req.body.email || '',
        panCard: req.body.panCard || '',
        occupationType: req.body.occupationType,
        companyName: req.body.companyName || '',
        monthlySalary: req.body.monthlySalary ? parseInt(req.body.monthlySalary) : 0,
        status: 'new',
        createdAt: new Date(),
      };

      // Save to database
      const lead = await storage.createLoanLead(leadData);
      
      res.status(201).json({ 
        success: true, 
        data: lead 
      });
    } catch (error: any) {
      console.error('Error saving lead:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      });
    }
  } else if (req.method === 'GET') {
    try {
      let leads;
      const { startDate, endDate, occupationType } = req.query;
      
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
      
      res.status(200).json({ 
        success: true, 
        data: leads 
      });
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}