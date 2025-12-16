import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getCurrentSubStage, getSubStagesUpToCurrent, getDaysElapsed } from '../../lib/autoSubStageProgression';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting automatic sub-stage update process...');

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

    const updatedShipments: Array<{
      tracking_id: string;
      old_sub_stage: string | null;
      new_sub_stage: string;
      days_elapsed: number;
    }> = [];
    const errors: Array<{ tracking_id: string; error: string }> = [];

    // Process each shipment
    for (const shipment of shipments || []) {
      try {
        if (!shipment.transit_start_date) {
          console.log(`Shipment ${shipment.tracking_id} has no transit_start_date, skipping`);
          continue;
        }

        const transitStartDate = new Date(shipment.transit_start_date);
        const daysElapsed = getDaysElapsed(transitStartDate);
        const currentSubStage = getCurrentSubStage(transitStartDate);
        const completedStages = getSubStagesUpToCurrent(transitStartDate);

        console.log(`Shipment ${shipment.tracking_id}: Days elapsed: ${daysElapsed}, Current sub-stage: ${currentSubStage}`);

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

          if (updateError) {
            console.error(`Error updating shipment ${shipment.tracking_id}:`, updateError);
            errors.push({ tracking_id: shipment.tracking_id, error: updateError.message });
          } else {
            updatedShipments.push({
              tracking_id: shipment.tracking_id,
              old_sub_stage: shipment.subStage,
              new_sub_stage: currentSubStage,
              days_elapsed: daysElapsed
            });
          }
        } else {
          console.log(`Shipment ${shipment.tracking_id} sub-stage is already up to date: ${currentSubStage}`);
        }

      } catch (error) {
        console.error(`Error processing shipment ${shipment.tracking_id}:`, error);
        errors.push({ tracking_id: shipment.tracking_id, error: error.message });
      }
    }

    console.log(`Process completed. Updated ${updatedShipments.length} shipments. Errors: ${errors.length}`);

    return res.status(200).json({
      success: true,
      message: `Processed ${shipments?.length || 0} shipments`,
      updated_shipments: updatedShipments,
      errors: errors,
      summary: {
        total_shipments: shipments?.length || 0,
        updated: updatedShipments.length,
        errors: errors.length
      }
    });

  } catch (error) {
    console.error('Error in auto-update process:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
