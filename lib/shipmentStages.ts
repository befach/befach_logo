// Detailed shipment stages based on the provided timeline data
export const DETAILED_SHIPMENT_STAGES = [
  'Shipment information received by Befach',
  'Picked up from supplier warehouse',
  'Package received at Befach export facility',
  'Customs export clearance submitted',
  'Export clearance completed',
  'Departed from Shenzhen International Airport',
  'Arrived at transit hub',
  'Departed transit hub',
  'Arrived at port of entry',
  'Document verification initiated (Customs)',
  'Import duty & GST assessment under process',
  'Customs inspection & clearance completed',
  'Handed over to Befach local delivery hub',
  'Out for delivery',
  'Delivered'
];

// For backward compatibility, keep the original stages
export const ORIGINAL_SHIPMENT_STAGES = [
  'Product Insurance',
  'Supplier Payment',
  'Packaging Approval from Customer',
  'Pickup at Origin',
  'In Transit to India',
  'Customs Clearance',
  'Dispatch to Befach Warehouse',
  'Dispatch to Customer Warehouse',
  'Estimated Delivery'
];

// Use detailed stages as the primary list
export const SHIPMENT_STAGES = DETAILED_SHIPMENT_STAGES;




