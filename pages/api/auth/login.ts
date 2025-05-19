import { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../server/storage';
import { loginSchema } from '../../../shared/schema';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Validate login credentials
    const credentials = loginSchema.parse(req.body);
    
    // Check if user exists with the provided username
    const user = await storage.getUserByUsername(credentials.username);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    if (user.password !== credentials.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Create session (in a real-world app, you'd use a secure session mechanism)
    // For now, we just return the user details (excluding password) to client
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input',
        errors: error.errors
      });
    }
    
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred'
    });
  }
}