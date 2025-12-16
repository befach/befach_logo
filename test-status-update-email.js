require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

// Test Status Update Email
async function testStatusUpdateEmail() {
  console.log('🧪 Testing Status Update Email...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    return;
  }
  
  try {
    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test data for status update
    const testShipmentData = {
      tracking_id: 'TEST-STATUS-123',
      shipment_name: 'Test Status Update Shipment',
      origin_city: 'Mumbai',
      origin_country: 'India',
      destination_city: 'New York',
      destination_country: 'USA',
      current_location_city: 'In Transit',
      current_location_country: 'International Waters',
      transport_mode: 'Sea',
      estimated_delivery: '2025-01-15',
      status: 'In Transit',
      buyer_name: 'Test Customer'
    };
    
    const previousStatus = 'Shipment Created';
    const newStatus = 'In Transit';
    
    console.log('📧 Sending status update email...');
    console.log('📋 Previous Status:', previousStatus);
    console.log('📋 New Status:', newStatus);
    console.log('📋 Tracking ID:', testShipmentData.tracking_id);
    
    // Generate status update email content
    const htmlContent = generateStatusUpdateEmailHTML(testShipmentData, previousStatus, newStatus);
    
    // Send email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'iamirfan6767@gmail.com', // Your verified email
      subject: `Shipment Status Update: ${testShipmentData.tracking_id}`,
      html: htmlContent
    });
    
    if (error) {
      console.log('❌ Status update email failed:', error.message);
      console.log('🔍 Error details:', error);
    } else {
      console.log('✅ Status update email sent successfully!');
      console.log('📧 Email ID:', data.id);
      console.log('📧 Subject:', `Shipment Status Update: ${testShipmentData.tracking_id}`);
      console.log('📧 To:', 'iamirfan6767@gmail.com');
    }
    
  } catch (error) {
    console.log('❌ Status update email test failed:', error.message);
    console.log('🔍 Full error:', error);
  }
}

function generateStatusUpdateEmailHTML(shipmentData, previousStatus, newStatus) {
  const trackingUrl = `https://track.befach.com/track-new?tracking_id=${shipmentData.tracking_id}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Shipment Status Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .status-change { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .shipment-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .tracking-button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📦 Shipment Status Update</h1>
            </div>
            
            <div class="content">
                <p>Dear ${shipmentData.buyer_name || 'Valued Customer'},</p>
                
                <div class="status-change">
                    <h3>🔄 Status Change Detected</h3>
                    <p><strong>Previous Status:</strong> ${previousStatus}</p>
                    <p><strong>New Status:</strong> <span style="color: #059669; font-weight: bold;">${newStatus}</span></p>
                </div>
                
                <p>Your shipment status has been updated. Here are the current details:</p>
                
                <div class="shipment-details">
                    <h3>Shipment Details</h3>
                    <p><strong>Tracking ID:</strong> ${shipmentData.tracking_id}</p>
                    <p><strong>Shipment Name:</strong> ${shipmentData.shipment_name}</p>
                    <p><strong>Current Status:</strong> ${shipmentData.status}</p>
                    <p><strong>Origin:</strong> ${shipmentData.origin_city}, ${shipmentData.origin_country}</p>
                    <p><strong>Destination:</strong> ${shipmentData.destination_city}, ${shipmentData.destination_country}</p>
                    <p><strong>Current Location:</strong> ${shipmentData.current_location_city}, ${shipmentData.current_location_country}</p>
                    <p><strong>Transport Mode:</strong> ${shipmentData.transport_mode}</p>
                    ${shipmentData.estimated_delivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipmentData.estimated_delivery).toLocaleDateString()}</p>` : ''}
                </div>
                
                <div style="text-align: center;">
                    <a href="${trackingUrl}" class="tracking-button">Track Your Shipment</a>
                </div>
                
                <p>You will continue to receive email notifications whenever your shipment status is updated.</p>
                
                <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>Befach Logistics Team</p>
            </div>
            
            <div class="footer">
                <p>This is an automated notification. Please do not reply to this email.</p>
                <p>© 2024 Befach Logistics. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Run the test
testStatusUpdateEmail();
















