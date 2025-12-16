-- Add subStage column to shipments table
-- This column will store the selected sub-stage ID from the admin forms

ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS "subStage" TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN shipments."subStage" IS 'Stores the selected sub-stage ID (e.g., stage_1, stage_2, etc.) for detailed shipment tracking';

-- Update existing shipments to have a default sub-stage value if needed
-- UPDATE shipments SET "subStage" = NULL WHERE "subStage" IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'shipments' AND column_name = 'subStage';








