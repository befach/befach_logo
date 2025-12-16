# Testing: 2-Minute Sub-Stage Progression

## Overview

The sub-stage progression system has been modified for **testing purposes** to use **2-minute intervals** instead of calendar days. This allows you to see automatic sub-stage progression in a much shorter timeframe.

## How It Works

### Time Intervals

Each sub-stage advances every **2 minutes** from the `transit_start_date`:

| Time Elapsed | Sub-Stage | Description |
|-------------|-----------|-------------|
| 0-2 min | stage_1 | Shipment information received by Befach |
| 2-4 min | stage_2 | Picked up from supplier warehouse |
| 4-6 min | stage_3 | Package received at Befach export facility |
| 6-8 min | stage_4 | Customs export clearance submitted |
| 8-10 min | stage_5 | Export clearance completed |
| 10-12 min | stage_6 | Departed from Shenzhen International Airport |
| 12-14 min | stage_7 | Arrived at transit hub |
| 14-16 min | stage_8 | Departed transit hub |
| 16-18 min | stage_9 | Arrived at port of entry |
| 18-20 min | stage_10 | Document verification initiated |
| 20-22 min | stage_11 | Import duty & GST assessment |
| 22-24 min | stage_12 | Customs inspection & clearance completed |
| 24-26 min | stage_13 | Handed over to Befach local delivery hub |
| 26-28 min | stage_14 | Out for delivery |
| 28+ min | stage_15 | Delivered |

### Automatic Updates

The system automatically:
1. **Calculates** the current sub-stage based on elapsed time (2-minute intervals)
2. **Updates** the database via API endpoint `/api/auto-refresh-substages`
3. **Refreshes** the tracking page every 2 minutes to show latest status

### Auto-Refresh Mechanism

When a shipment is being viewed on the tracking page (`/track-new`):
- Every 2 minutes, the system calls the update API
- The database sub-stage is updated for all shipments in "In Transit to India" status
- The tracking page refreshes to show the new sub-stage

## Testing Steps

### 1. Create a Test Shipment

1. Go to Admin panel → Create New Shipment
2. Set status to "In Transit to India"
3. Note the time when you create it (this sets `transit_start_date`)
4. Save the shipment

### 2. Track the Shipment

1. Open the tracking page
2. Enter your tracking ID
3. Watch the sub-stage progress

### 3. Observe Automatic Changes

- After 2 minutes → stage_2 should appear
- After 4 minutes → stage_3 should appear
- After 6 minutes → stage_4 should appear
- And so on...

### 4. View in Browser Console

Open browser console (F12) to see logs:
```
Auto-refreshing shipment data...
Sub-stages updated via API
```

## Manual Testing

You can manually trigger the update API:

```bash
curl -X POST http://localhost:3000/api/auto-refresh-substages
```

Or visit in browser:
```
http://localhost:3000/api/auto-refresh-substages
```

## Database Updates

The database will be automatically updated every 2 minutes when:
- A shipment is being tracked on the tracking page
- The shipment is in "In Transit to India" status
- The shipment has a `transit_start_date` value

## Key Files Modified

1. **lib/autoSubStageProgression.ts**
   - Changed `getDaysElapsed()` to calculate 2-minute intervals
   - Updated `getCurrentSubStage()` to map intervals to stages

2. **pages/api/auto-refresh-substages.ts**
   - New endpoint for updating sub-stages automatically

3. **pages/track-new.tsx**
   - Added auto-refresh interval (every 2 minutes)
   - Calls update API automatically

## Notes

⚠️ **This is for testing only!**

To revert to production mode (calendar days):
- Change `lib/autoSubStageProgression.ts` back to day-based calculation
- Update time calculation from minutes to days

## Timeline

Complete progression from stage_1 to stage_15:
- **Total time**: 30 minutes (15 stages × 2 minutes)
- Perfect for testing the entire shipment lifecycle

## Troubleshooting

### Sub-stages not updating?

1. Check that shipment has `transit_start_date` set
2. Verify shipment status is "In Transit to India"
3. Check browser console for errors
4. Manually call the update API

### Want faster testing?

To test even faster, change the interval in `pages/track-new.tsx`:
```typescript
}, 30 * 1000); // 30 seconds instead of 2 minutes
```

And change `lib/autoSubStageProgression.ts`:
```typescript
const intervals = Math.floor(diffMinutes / 0.5); // 30 seconds per stage
```



