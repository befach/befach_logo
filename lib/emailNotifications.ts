// Email notification system for shipment stage changes
// Note: This file should be used on the server side only
// For client-side usage, pass the supabase client as a parameter

export interface EmailNotificationData {
  clientEmail: string;
  trackingId: string;
  oldStage?: string;
  newStage: string;
  oldSubStage?: string;
  newSubStage?: string;
  shipmentName?: string;
  estimatedDelivery?: string;
}

export async function sendStageChangeEmail(data: EmailNotificationData, supabaseClient?: any) {
  try {
    console.log('📧 Sending stage change email:', data);
    
    // Create email content
    const subject = `Shipment Update - ${data.trackingId}`;
    const emailContent = generateEmailContent(data);
    
    // Send email using the API endpoint
    await sendEmailViaAPI(data.clientEmail, subject, emailContent);
    
    // Log the email notification in database if supabase client is provided
    if (supabaseClient) {
      await logEmailNotification(data, supabaseClient);
    }
    
    console.log('✅ Stage change email sent successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error sending stage change email:', error);
    return { success: false, error: error.message };
  }
}

function generateEmailContent(data: EmailNotificationData): string {
  // Get sub-stage details if available
  const getSubStageDetails = (subStageId: string) => {
    const subStageMap = {
      'stage_1': { date: 'Monday, 18/08/25', time: '7:30 PM', status: 'Shipment information received by Befach', location: 'SHENZHEN CN' },
      'stage_2': { date: 'Wednesday, 20/08/25', time: '1:12 PM', status: 'Picked up from supplier warehouse', location: 'SHENZHEN CN' },
      'stage_3': { date: 'Wednesday, 20/08/25', time: '5:45 PM', status: 'Package received at Befach export facility', location: 'SHENZHEN CN' },
      'stage_4': { date: 'Wednesday, 20/08/25', time: '10:35 PM', status: 'Customs export clearance submitted', location: 'SHENZHEN CN' },
      'stage_5': { date: 'Thursday, 21/08/25', time: '9:40 AM', status: 'Export clearance completed', location: 'SHENZHEN CN' },
      'stage_6': { date: 'Thursday, 21/08/25', time: '11:05 PM', status: 'Departed from Shenzhen International Airport', location: 'SHENZHEN CN' },
      'stage_7': { date: 'Friday, 22/08/25', time: '3:25 AM', status: 'Arrived at transit hub', location: 'HONG KONG CN' },
      'stage_8': { date: 'Friday, 22/08/25', time: '6:45 AM', status: 'Departed transit hub', location: 'HONG KONG CN' },
      'stage_9': { date: 'Friday, 22/08/25', time: '12:10 PM', status: 'Arrived at port of entry', location: 'DELHI IN' },
      'stage_10': { date: 'Friday, 22/08/25', time: '12:30 PM', status: 'Document verification initiated (Customs)', location: 'DELHI IN' },
      'stage_11': { date: 'Friday, 22/08/25', time: '3:15 PM', status: 'Import duty & GST assessment under process', location: 'DELHI IN' },
      'stage_12': { date: 'Friday, 22/08/25', time: '6:50 PM', status: 'Customs inspection & clearance completed', location: 'DELHI IN' },
      'stage_13': { date: 'Saturday, 23/08/25', time: '8:40 AM', status: 'Handed over to Befach local delivery hub', location: 'DELHI IN' },
      'stage_14': { date: 'Saturday, 23/08/25', time: '10:20 AM', status: 'Out for delivery', location: 'DELHI IN' },
      'stage_15': { date: 'Saturday, 23/08/25', time: '11:45 AM', status: 'Delivered', location: 'DELHI IN' }
    };
    return subStageMap[subStageId as keyof typeof subStageMap] || null;
  };

  // Get the current sub-stage details for display
  // Only show sub-stage if it's actually different from the main stage
  let subStageStatus = null;
  if (data.newSubStage && data.newSubStage !== data.newStage) {
    // Use the actual sub-stage from the database, not the hardcoded map
    subStageStatus = data.newSubStage;
  }
  
  // Format the current date and time for the update
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  });
  const formattedTime = currentDate.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Shipment Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; background: white; }
        .status-change { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 0 5px 5px 0; }
        .status-change h3 { color: #1e40af; margin: 0 0 10px 0; font-size: 18px; }
        .status-change p { margin: 5px 0; }
        .status-change .label { color: #333; font-weight: normal; }
        .status-change .value { color: #1e40af; font-weight: bold; }
        .shipment-details h3 { color: #1e40af; margin: 20px 0 10px 0; font-size: 18px; }
        .shipment-details p { margin: 5px 0; }
        .shipment-details .label { color: #333; font-weight: normal; }
        .shipment-details .value { color: #1e40af; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚛 Shipment Status Update</h1>
        </div>
        
        <div class="content">
            <p>Dear Valued Customer,</p>
            <p>Your shipment status has been updated. Here are the details:</p>
            
            <div class="status-change">
                <h3>Status Change</h3>
                <p><span class="label">Previous Status:</span> <span class="value">${data.oldStage || 'N/A'}</span></p>
                <p><span class="label">New Status:</span> <span class="value">${data.newStage}</span></p>
                ${subStageStatus ? `<p><span class="label">Current Sub-stage:</span> <span class="value">${subStageStatus}</span></p>` : ''}
                <p><span class="label">Updated:</span> <span class="value">${formattedDate}, ${formattedTime}</span></p>
            </div>
            
            <div class="shipment-details">
                <h3>Shipment Details</h3>
                <p><span class="label">Tracking ID:</span> <span class="value">${data.trackingId}</span></p>
                ${data.shipmentName ? `<p><span class="label">Shipment:</span> <span class="value">${data.shipmentName}</span></p>` : ''}
                ${data.estimatedDelivery ? `<p><span class="label">Estimated Delivery:</span> <span class="value">${new Date(data.estimatedDelivery).toLocaleDateString()}</span></p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://track.befach.com/track-new?tracking_id=${data.trackingId}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Track Your Shipment</a>
            </div>
            
            <p style="color: #1e40af; margin: 20px 0;">If you have any questions about your shipment, please don't hesitate to contact us.</p>
            
            <p style="margin: 20px 0;">Best regards,<br>Befach Logistics Team</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>© 2024 Befach Logistics. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}



async function sendEmailViaAPI(email: string, subject: string, content: string) {
  // Send to your backend API endpoint
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emailType: 'status-update',
      email: email,
      shipmentData: {
        tracking_id: 'N/A', // Will be filled by the API
        status: 'N/A', // Will be filled by the API
      },
      previousStatus: 'N/A', // Will be filled by the API
      newStatus: 'N/A', // Will be filled by the API
      customSubject: subject,
      customContent: content,
      useCustomContent: true, // Flag to indicate we want to use custom content
    }),
  });

  if (!response.ok) {
    throw new Error(`Email API error: ${response.statusText}`);
  }

  return response.json();
}

async function logEmailNotification(data: EmailNotificationData, supabaseClient: any) {
  try {
    const { error } = await supabaseClient
      .from('email_notifications')
      .insert({
        client_email: data.clientEmail,
        tracking_id: data.trackingId,
        old_stage: data.oldStage,
        new_stage: data.newStage,
        old_sub_stage: data.oldSubStage,
        new_sub_stage: data.newSubStage,
        sent_at: new Date().toISOString(),
        status: 'sent'
      });

    if (error) {
      console.error('Error logging email notification:', error);
    }
  } catch (error) {
    console.error('Error logging email notification:', error);
  }
}

// Function to check if stage has changed and send email
export async function checkAndNotifyStageChange(
  trackingId: string,
  oldData: { status?: string; subStage?: string },
  newData: { status: string; subStage?: string },
  supabaseClient: any
) {
  const hasStageChanged = oldData.status !== newData.status;
  const hasSubStageChanged = oldData.subStage !== newData.subStage;
  
  console.log('🔍 Email Notification Debug:');
  console.log('🔍 Tracking ID:', trackingId);
  console.log('🔍 Old Status:', oldData.status);
  console.log('🔍 New Status:', newData.status);
  console.log('🔍 Old Sub-stage:', oldData.subStage);
  console.log('🔍 New Sub-stage:', newData.subStage);
  console.log('🔍 Has Stage Changed:', hasStageChanged);
  console.log('🔍 Has Sub-stage Changed:', hasSubStageChanged);
  
  // Only send email if there are actual changes
  if (hasStageChanged || hasSubStageChanged) {
    console.log('🔍 Changes detected, checking for duplicate notifications...');
    
    // Check if we've already sent a notification for this exact change in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentNotifications } = await supabaseClient
      .from('email_notifications')
      .select('*')
      .eq('tracking_id', trackingId)
      .eq('old_stage', oldData.status)
      .eq('new_stage', newData.status)
      .eq('old_sub_stage', oldData.subStage)
      .eq('new_sub_stage', newData.subStage)
      .gte('sent_at', fiveMinutesAgo)
      .limit(1);

    if (recentNotifications && recentNotifications.length > 0) {
      console.log('🔍 Duplicate notification detected within 5 minutes, skipping...');
      return;
    }

    console.log('🔍 Sending email notification...');
    // Get shipment details for email
    const { data: shipment } = await supabaseClient
      .from('shipments')
      .select('client_email, shipment_name, estimated_delivery')
      .eq('tracking_id', trackingId)
      .single();

    if (shipment && shipment.client_email) {
      console.log('🔍 Found shipment with email:', shipment.client_email);
      await sendStageChangeEmail({
        clientEmail: shipment.client_email,
        trackingId: trackingId,
        oldStage: oldData.status,
        newStage: newData.status,
        oldSubStage: oldData.subStage,
        newSubStage: newData.subStage,
        shipmentName: shipment.shipment_name,
        estimatedDelivery: shipment.estimated_delivery,
      }, supabaseClient);
    } else {
      console.log('🔍 No shipment found or no client email');
    }
  } else {
    console.log('🔍 No changes detected, skipping email notification');
  }
}
