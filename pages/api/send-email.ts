import { NextApiRequest, NextApiResponse } from 'next';
import { sendShipmentCreationEmail, sendShipmentStatusUpdateEmail } from '../../lib/smtpEmailService';

// Function to send custom email with subject and content
async function sendCustomEmail(email: string, subject: string, content: string) {
  try {
    // Use Resend directly to send the custom email
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY in environment variables.');
    }
    
    const { data, error } = await resend.emails.send({
      from: 'logistics@befach.com',
      to: email,
      subject: subject,
      html: content,
      text: content.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });
    
    if (error) {
      console.error('Resend API error details:', error);
      throw new Error(error.message || 'Failed to send email via Resend');
    }
    
    // Log the custom email for debugging
    console.log('📧 Custom email sent successfully:', { email, subject, data });
    
    return { success: true, message: 'Custom email sent successfully', data };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return { success: false, error: error.message };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailType, email, shipmentData, previousStatus, newStatus, customSubject, customContent } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    let result;

    if (emailType === 'shipment-creation') {
      // Send shipment creation email
      if (!shipmentData) {
        return res.status(400).json({ error: 'Shipment data is required for creation email' });
      }
      result = await sendShipmentCreationEmail(shipmentData, email);
    } else if (emailType === 'status-update') {
      // Send status update email
      if (customSubject && customContent) {
        // Use custom subject and content for new email notification system
        result = await sendCustomEmail(email, customSubject, customContent);
      } else if (!shipmentData || !previousStatus || !newStatus) {
        return res.status(400).json({ error: 'Shipment data, previous status, and new status are required for status update email' });
      } else {
        result = await sendShipmentStatusUpdateEmail(
          shipmentData,
          email,
          previousStatus,
          newStatus
        );
      }
    } else {
      return res.status(400).json({ error: 'Invalid email type. Use "shipment-creation" or "status-update"' });
    }

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Email sent successfully',
        emailType,
        recipient: email
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error,
        emailType,
        recipient: email
      });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    });
  }
} 