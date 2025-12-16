# Automatic Sub-Stage Progression System

This document explains the automatic sub-stage progression system for shipments in "In Transit to India" status.

## Overview

The automatic sub-stage progression system automatically advances sub-stages based on calendar days elapsed since the "In Transit to India" stage was started. This provides realistic, time-based progression that matches the actual shipment timeline.

## How It Works

### 1. Transit Start Date Tracking
- When admin selects "In Transit to India" status, `transit_start_date` is automatically set
- This date serves as the baseline for calculating days elapsed
- The system uses this date to determine which sub-stages should be active

### 2. Day-Based Progression
The system follows this progression based on days elapsed:

| Days Elapsed | Current Sub-Stage | Description |
|-------------|------------------|-------------|
| 0 (Same day) | stage_1 | Shipment information received by Befach |
| 1 (Next day) | stage_2 | Picked up from supplier warehouse |
| 2 (2 days later) | stage_5 | Export clearance completed |
| 3 (3 days later) | stage_7 | Arrived at transit hub |
| 4 (4 days later) | stage_9 | Arrived at port of entry |
| 5 (5 days later) | stage_13 | Handed over to Befach local delivery hub |
| 6+ (6+ days later) | stage_15 | Delivered |

### 3. Automatic Updates
- Sub-stages automatically progress each day
- No manual intervention required
- System calculates the appropriate sub-stage based on elapsed time
- Timeline displays completed and current sub-stages correctly

## Database Changes

### New Column
```sql
-- Add transit_start_date column
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS "transit_start_date" TIMESTAMP WITH TIME ZONE;
```

### When It's Set
- **New Shipments**: Set when "In Transit to India" is selected during creation
- **Existing Shipments**: Set when status changes to "In Transit to India" from another status

## API Endpoint

### Auto-Update Sub-Stages
**Endpoint**: `POST /api/auto-update-substages`

**Purpose**: Updates all shipments in "In Transit to India" status with appropriate sub-stages

**Response**:
```json
{
  "success": true,
  "message": "Processed X shipments",
  "updated_shipments": [
    {
      "tracking_id": "TRK123456",
      "old_sub_stage": "stage_1",
      "new_sub_stage": "stage_2",
      "days_elapsed": 1
    }
  ],
  "errors": [],
  "summary": {
    "total_shipments": 5,
    "updated": 3,
    "errors": 0
  }
}
```

## Frontend Integration

### ShipmentTimeline Component
The timeline component now supports automatic progression:

```tsx
<ShipmentTimeline 
  currentStage={shipment.status}
  subStage={shipment.subStage}
  estimatedDelivery={shipment.estimated_delivery}
  transitStartDate={shipment.transit_start_date} // New prop
/>
```

### Automatic vs Manual Progression
- **Automatic**: Used when `transit_start_date` is available
- **Manual**: Fallback when `transit_start_date` is not set
- System automatically chooses the appropriate method

## Timeline Display Logic

### Completed Sub-Stages
- All sub-stages up to the current day are marked as completed
- Green dots and checkmarks for completed stages
- Progressive display based on actual time elapsed

### Current Sub-Stage
- Blue dot for the current active sub-stage
- Determined by days elapsed since transit start
- Updates automatically each day

### Pending Sub-Stages
- Gray dots for future sub-stages
- Not displayed until their time comes
- Maintains realistic progression

## Example Timeline

### Day 1 (Monday)
- ✅ stage_1: Shipment information received by Befach
- 🔵 stage_2: Picked up from supplier warehouse (current)
- ⚪ stage_3: Package received at Befach export facility (pending)

### Day 3 (Wednesday)
- ✅ stage_1: Shipment information received by Befach
- ✅ stage_2: Picked up from supplier warehouse
- ✅ stage_3: Package received at Befach export facility
- ✅ stage_4: Customs export clearance submitted
- 🔵 stage_5: Export clearance completed (current)
- ⚪ stage_6: Departed from Shenzhen International Airport (pending)

## Benefits

### 1. Realistic Progression
- Sub-stages advance based on actual calendar days
- Matches real-world shipment timelines
- No artificial delays or jumps

### 2. Automatic Updates
- No manual sub-stage management required
- System handles progression automatically
- Reduces admin workload

### 3. Consistent Experience
- All shipments follow the same timeline
- Predictable progression for customers
- Professional tracking experience

### 4. Flexible System
- Falls back to manual progression when needed
- Supports both automatic and manual modes
- Easy to maintain and extend

## Testing

### Manual Testing
```bash
# Run the test script
node test-auto-progression.js
```

### API Testing
```bash
# Test the auto-update endpoint
curl -X POST http://localhost:3000/api/auto-update-substages
```

## Deployment

### 1. Database Migration
Run the SQL script to add the new column:
```bash
psql -d your_database -f add-transit-start-date-column.sql
```

### 2. Deploy Code
- Deploy the updated components and API
- Ensure environment variables are set
- Test with existing shipments

### 3. Monitor
- Check logs for auto-update process
- Monitor sub-stage progression
- Verify timeline display

## Troubleshooting

### Common Issues

1. **Sub-stages not updating automatically**
   - Check if `transit_start_date` is set
   - Verify the shipment is in "In Transit to India" status
   - Check API endpoint logs

2. **Timeline showing incorrect stages**
   - Verify `transit_start_date` format
   - Check timezone settings
   - Ensure automatic progression is enabled

3. **Manual progression still active**
   - Check if `transit_start_date` is null
   - Verify the shipment status
   - Check component props

### Debug Information
- Console logs show progression calculations
- API responses include detailed information
- Database queries can verify data integrity

## Future Enhancements

### Potential Improvements
1. **Customizable Timelines**: Allow different progression speeds
2. **Holiday Handling**: Skip weekends/holidays in calculations
3. **Real-time Updates**: WebSocket-based live updates
4. **Analytics**: Track progression patterns and delays

### Integration Points
1. **Email Notifications**: Auto-send updates when sub-stages change
2. **WhatsApp Integration**: Send automatic status updates
3. **Dashboard Analytics**: Show progression statistics
4. **API Webhooks**: Notify external systems of changes



