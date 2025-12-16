import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getCurrentSubStage, getDaysElapsed } from '../../lib/autoSubStageProgression';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// This endpoint runs periodically to update sub-stages (every 2 minutes for testing)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting automatic sub-stage refresh process...');

    // Get all shipments in "In Transit to India" status
    const { data: shipments, error: fetchError } = await supabase
      .from('shipments')
      .select('id, tracking_id, status, subStage, transit_start_date')
      .eq('status', 'In Transit to India');

    if (fetchError) {
      console.error('Error fetching shipments:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch shipments' });
    }

    console.log(`Found ${shipments?.length || 0} shipments in "In Transit to India" status`);

    const updatedShipments = [];
    let updateCount = 0;

    // Process each shipment
    for (const shipment of shipments || []) {
      try {
        if (!shipment.transit_start_date) {
          continue;
        }

        const transitStartDate = new Date(shipment.transit_start_date);
        const currentSubStage = getCurrentSubStage(transitStartDate);

        // Check if sub-stage needs to be updated
        if (shipment.subStage !== currentSubStage) {
          console.log(`Updating shipment ${shipment.tracking_id} from ${shipment.subStage} to ${currentSubStage}`);

          // Update the shipment with new sub-stage
          const { error: updateError } = await supabase
            .from('shipments')
            .update({ 
              subStage: currentSubStage,
              updated_at: new Date().toISOString()
            })
            .eq('id', shipment.id);

          if (!updateError) {
            updatedShipments.push(shipment.tracking_id);
            updateCount++;
          }
        }

      } catch (error) {
        console.error(`Error processing shipment ${shipment.tracking_id}:`, error);
      }
    }

    console.log(`Process completed. Updated ${updateCount} shipments.`);

    return res.status(200).json({
      success: true,
      message: `Updated ${updateCount} shipments`,
      updated_shipments: updatedShipments,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in auto-refresh process:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}









