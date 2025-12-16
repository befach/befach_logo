# Manual Sub-Stage System

This document explains the manual sub-stage system for shipments in "In Transit to India" status.

## Overview

The sub-stage system is now **completely manual**. Admins must manually select and change sub-stages through the admin panel. No automatic progression occurs.

## How It Works

### 1. Sub-Stages Only for "In Transit to India"
- Sub-stages are only available when the main stage is "In Transit to India"
- All other stages show no sub-stages (clean and simple)

### 2. Manual Selection
- When admin selects "In Transit to India" as main stage, sub-stage field becomes available
- Admin must manually select the appropriate sub-stage from the dropdown
- Sub-stage selection is independent of main stage selection

### 3. Available Sub-Stages
When "In Transit to India" is selected, these sub-stages become available:

1. **stage_1**: Shipment information received by Befach
2. **stage_2**: Picked up from supplier warehouse
3. **stage_3**: Package received at Befach export facility
4. **stage_4**: Customs export clearance submitted
5. **stage_5**: Export clearance completed
6. **stage_6**: Departed from Shenzhen International Airport
7. **stage_7**: Arrived at transit hub
8. **stage_8**: Departed transit hub
9. **stage_9**: Arrived at port of entry
10. **stage_10**: Document verification initiated (Customs)
11. **stage_11**: Import duty & GST assessment under process
12. **stage_12**: Customs inspection & clearance completed
13. **stage_13**: Handed over to Befach local delivery hub
14. **stage_14**: Out for delivery
15. **stage_15**: Delivered

### 4. Updated Main Stage Order
The main stages now follow this order (without "Pending Customer Clearance"):

1. **Product Insurance**
2. **Supplier Payment**
3. **Packaging Approval from Customer**
4. **Pickup at Origin**
5. **In Transit to India** (with sub-stages)
6. **Customs Clearance**
7. **Dispatch to Befach Warehouse**
8. **Dispatch to Customer Warehouse**
9. **Estimated Delivery**

## Admin Panel Behavior

### New Shipment Form
- When "In Transit to India" is selected → sub-stage dropdown appears
- When any other stage is selected → sub-stage field is cleared and hidden
- Admin must manually select the appropriate sub-stage

### Edit Shipment Form
- Same behavior as new shipment form
- Existing sub-stage is preserved when editing other fields
- Sub-stage is cleared when main stage changes

## Database Structure

### Required Columns
```sql
-- subStage column stores the selected sub-stage
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS "subStage" TEXT;
```

### Sample Data
```sql
-- Example: Shipment in "In Transit to India" with sub-stage
UPDATE shipments 
SET status = 'In Transit to India', "subStage" = 'stage_5'
WHERE tracking_id = 'TRK123456';
```

## Timeline Display

### Customer View
- Main stage shows: "In Transit to India"
- Sub-stage shows: "Export clearance completed" (for stage_5)
- Timeline displays both main stage and sub-stage progress
- Sub-stages appear as detailed steps under "In Transit to India"

### Admin View
- Can see current sub-stage in shipment details
- Can change sub-stage at any time through edit form
- Changes are immediately reflected in customer view

## Email Notifications

### Sub-Stage Changes
- Email notifications are sent when sub-stage changes
- Customers receive detailed updates about sub-stage progress
- Email includes both main stage and sub-stage information

### Example Email Content
```
Status Change: In Transit to India - Export clearance completed
Previous: In Transit to India - Package received at Befach export facility
```

## Best Practices

### 1. Sub-Stage Selection
- Choose the most accurate sub-stage for current shipment status
- Update sub-stage when shipment progresses to next step
- Use sub-stages to provide detailed tracking information

### 2. Communication
- Inform customers about sub-stage updates
- Use sub-stages to provide granular tracking details
- Keep sub-stage information accurate and up-to-date

### 3. Monitoring
- Regularly check shipments in "In Transit to India" status
- Update sub-stages as shipments progress
- Ensure sub-stage information is current and accurate

## Troubleshooting

### Common Issues

1. **Sub-stages not showing**
   - Verify main stage is exactly "In Transit to India"
   - Check if sub-stage dropdown is visible in admin form

2. **Sub-stage not updating**
   - Ensure you're editing the correct shipment
   - Check if sub-stage field is properly selected
   - Verify form submission was successful

3. **Timeline not displaying sub-stages**
   - Check if shipment status is "In Transit to India"
   - Verify sub-stage value is not null
   - Ensure timeline component is properly configured

### Testing

Test the system by:
1. Creating a new shipment with "In Transit to India" status
2. Selecting different sub-stages
3. Checking customer timeline view
4. Verifying email notifications

## Support

For issues or questions:
1. Check admin form sub-stage dropdown
2. Verify database sub-stage values
3. Test timeline display
4. Review email notification settings
