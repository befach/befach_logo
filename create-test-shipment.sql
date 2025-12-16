-- Create a test shipment with automatic sub-stage progression for TODAY
-- This will help you test the automatic progression system

-- First, make sure the transit_start_date column exists
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS "transit_start_date" TIMESTAMP WITH TIME ZONE;

-- Create a test shipment with "In Transit to India" status
-- The transit_start_date will be set to today automatically
INSERT INTO shipments (
    tracking_id,
    client_email,
    status,
    "subStage",
    "transit_start_date",
    origin_country,
    destination_country,
    transport_mode,
    estimated_delivery,
    shipment_name,
    created_at,
    updated_at
) VALUES (
    'TEST-AUTO-' || EXTRACT(EPOCH FROM NOW())::TEXT, -- Unique tracking ID
    'test@example.com',
    'In Transit to India',
    'stage_1', -- Will be automatically updated based on days elapsed
    NOW(), -- Today's date and time
    'China',
    'India',
    'Air',
    (NOW() + INTERVAL '7 days')::DATE,
    'Test Shipment for Automatic Progression',
    NOW(),
    NOW()
);

-- Verify the shipment was created
SELECT 
    tracking_id,
    status,
    "subStage",
    "transit_start_date",
    created_at,
    shipment_name
FROM shipments 
WHERE tracking_id LIKE 'TEST-AUTO-%'
ORDER BY created_at DESC
LIMIT 1;

-- Check all test shipments
SELECT 
    tracking_id,
    status,
    "subStage",
    "transit_start_date",
    created_at,
    shipment_name
FROM shipments 
WHERE tracking_id LIKE 'TEST-AUTO-%'
ORDER BY created_at DESC;



