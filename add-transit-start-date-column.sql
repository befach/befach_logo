-- Add column to track when "In Transit to India" stage started
-- This will be used for automatic sub-stage progression

ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS "transit_start_date" TIMESTAMP WITH TIME ZONE;

-- Add index for better performance when querying by transit start date
CREATE INDEX IF NOT EXISTS idx_shipments_transit_start_date 
ON shipments ("transit_start_date");

-- Update existing shipments that are in "In Transit to India" status
-- Set transit_start_date to current timestamp if not already set
UPDATE shipments 
SET "transit_start_date" = COALESCE("transit_start_date", NOW())
WHERE status = 'In Transit to India' AND "transit_start_date" IS NULL;
