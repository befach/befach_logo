-- Test script for database migration
-- Run this to verify the transit_start_date column exists

-- Check if column exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shipments' 
AND column_name = 'transit_start_date';

-- Check existing shipments in "In Transit to India" status
SELECT 
    tracking_id,
    status,
    "subStage",
    "transit_start_date",
    created_at
FROM shipments 
WHERE status = 'In Transit to India'
ORDER BY created_at DESC
LIMIT 10;

-- Test: Update a shipment to "In Transit to India" to trigger transit_start_date
-- (Run this only on a test shipment)
-- UPDATE shipments 
-- SET status = 'In Transit to India',
--     "transit_start_date" = NOW()
-- WHERE tracking_id = 'TEST123';



