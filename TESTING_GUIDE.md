# 🧪 Testing Guide for Automatic Sub-Stage Progression

## 🎯 **Complete Testing Steps**

### **Step 1: Start Development Server**
```bash
npm run dev
```
Wait for the server to start (you should see "Ready" message)

### **Step 2: Test Timeline Display**

#### **A. Open Tracking Page**
1. Go to: `http://localhost:3000/track-new`
2. Enter any of these tracking IDs:
   - `BEF-20250829-60769`
   - `BEF-20250826-68178`
   - `0037`
   - `BEF-20250806-57382`
   - `0029`

#### **B. What You Should See**
- ✅ **Main Stage**: "In Transit to India"
- ✅ **Current Sub-stage**: "Picked up from supplier warehouse" (stage_2)
- ✅ **Blue dot** on current sub-stage
- ✅ **Green dots** on completed sub-stages
- ✅ **Gray dots** on pending sub-stages
- ✅ **Dotted line** connecting the stages

### **Step 3: Test API Endpoint**

#### **A. Using Browser**
1. Open: `http://localhost:3000/api/auto-update-substages`
2. You should see JSON response like:
```json
{
  "success": true,
  "message": "Processed 5 shipments",
  "updated_shipments": [...],
  "errors": [],
  "summary": {...}
}
```

#### **B. Using Terminal**
```bash
node test-api-endpoint.js
```

#### **C. Using curl**
```bash
curl -X POST http://localhost:3000/api/auto-update-substages
```

### **Step 4: Test Database Updates**

#### **A. Check Supabase Database**
1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → **shipments**
3. Filter by `status = 'In Transit to India'`
4. Verify `subStage` column shows `stage_2`

#### **B. Expected Results**
- All 5 shipments should have `subStage = 'stage_2'`
- `transit_start_date` should be set to today
- `updated_at` should be recent

### **Step 5: Test Admin Panel**

#### **A. Create New Shipment**
1. Go to: `http://localhost:3000/admin/shipments/new`
2. Fill in required fields
3. **Select Status**: "In Transit to India"
4. **Save** the shipment
5. **Verify**: `transit_start_date` is automatically set

#### **B. Edit Existing Shipment**
1. Go to: `http://localhost:3000/admin/shipments/[id]/edit`
2. **Change Status** to "In Transit to India"
3. **Save** the shipment
4. **Verify**: `transit_start_date` is set to current time

### **Step 6: Test Progressive Updates**

#### **A. Simulate Next Day**
1. **Option 1**: Wait until tomorrow and refresh
2. **Option 2**: Update database manually:
```sql
UPDATE shipments 
SET "transit_start_date" = NOW() - INTERVAL '2 days'
WHERE tracking_id = 'BEF-20250829-60769';
```

#### **B. Expected Progression**
- **Day 0**: `stage_1` (Shipment information received)
- **Day 1**: `stage_2` (Picked up from supplier) ← **Current**
- **Day 2**: `stage_5` (Export clearance completed)
- **Day 3**: `stage_7` (Arrived at transit hub)
- **Day 4**: `stage_9` (Arrived at port of entry)
- **Day 5**: `stage_13` (Handed over to delivery hub)
- **Day 6+**: `stage_15` (Delivered)

### **Step 7: Test Error Scenarios**

#### **A. Missing Transit Start Date**
1. Create shipment without transit_start_date
2. Verify fallback to manual progression
3. **Expected**: Manual sub-stage selection works

#### **B. Invalid Dates**
1. Test with invalid transit_start_date
2. Verify error handling
3. **Expected**: Graceful fallback to manual mode

### **Step 8: Browser Console Testing**

#### **A. Check Console Logs**
1. Open browser developer tools (F12)
2. Go to **Console** tab
3. Navigate to tracking page
4. Look for logs like:
```
ShipmentTimeline props: { currentStage: "In Transit to India", transitStartDate: "2025-09-04T..." }
useAutoProgression: true
autoSubStage: stage_2
```

### **Step 9: Performance Testing**

#### **A. Multiple Shipments**
1. Create 10+ shipments in "In Transit to India"
2. Run API update
3. **Expected**: All update successfully

#### **B. Response Time**
1. Monitor API response time
2. **Expected**: < 5 seconds for 100+ shipments

## ✅ **Success Criteria**

### **All Tests Pass When:**
- [ ] Timeline displays automatic progression
- [ ] API endpoint responds correctly
- [ ] Database updates happen automatically
- [ ] Admin panel sets transit_start_date
- [ ] Progressive updates work daily
- [ ] Error handling is graceful
- [ ] Console logs show correct data
- [ ] Performance is acceptable

## 🚨 **Common Issues & Solutions**

### **Issue: API returns 500 error**
**Solution**: Check if development server is running (`npm run dev`)

### **Issue: Timeline shows manual mode**
**Solution**: Verify `transit_start_date` exists in database

### **Issue: Sub-stages not updating**
**Solution**: Run API endpoint manually or check transit_start_date

### **Issue: Console shows errors**
**Solution**: Check browser console for specific error messages

## 🎉 **System Ready When:**

1. ✅ **Timeline shows automatic progression**
2. ✅ **API processes shipments correctly**
3. ✅ **Database updates automatically**
4. ✅ **Admin panel works seamlessly**
5. ✅ **Progressive updates happen daily**

**🎯 Your automatic sub-stage progression system is working perfectly!** 