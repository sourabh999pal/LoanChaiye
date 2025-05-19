import { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../../server/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const leadId = parseInt(id as string, 10);
    const { status } = req.body;
    
    if (!status || typeof status !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be a string'
      });
    }
    
    // Update lead status
    const updatedLead = await storage.updateLoanLeadStatus(leadId, status);
    
    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${leadId} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedLead
    });
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while updating the lead status'
    });
  }
}