# Frontend Testing Guide for Automatic Sub-Stage Progression

## 🎯 **Testing Checklist**

### **1. Database Setup**
- [ ] Run the migration script: `add-transit-start-date-column.sql`
- [ ] Verify column exists: `test-database-migration.sql`
- [ ] Check existing shipments in "In Transit to India" status

### **2. Admin Panel Testing**

#### **A. Create New Shipment**
1. Go to `/admin/shipments/new`
2. Fill in required fields
3. **Select "In Transit to India" as status**
4. Verify:
   - ✅ Sub-stage dropdown appears
   - ✅ `transit_start_date` is automatically set
   - ✅ Sub-stages are available for selection

#### **B. Edit Existing Shipment**
1. Go to `/admin/shipments/[id]/edit`
2. **Change status to "In Transit to India"**
3. Verify:
   - ✅ `transit_start_date` is set to current timestamp
   - ✅ Sub-stage dropdown becomes available
   - ✅ Previous sub-stage is cleared

### **3. Customer Tracking Page Testing**

#### **A. Timeline Display**
1. Go to `/track-new`
2. Enter tracking ID of shipment in "In Transit to India"
3. Verify timeline shows:
   - ✅ **Automatic progression** (if `transit_start_date` exists)
   - ✅ **Manual progression** (if `transit_start_date` is null)
   - ✅ Correct sub-stages based on days elapsed

#### **B. Progressive Display**
1. Check that completed sub-stages show:
   - ✅ Green dots
   - ✅ Checkmarks
   - ✅ Proper completion status

2. Check that current sub-stage shows:
   - ✅ Blue dot
   - ✅ Active status
   - ✅ Correct day-based progression

3. Check that pending sub-stages:
   - ✅ Don't appear until their time
   - ✅ Show gray dots when they do appear
   - ✅ Follow realistic timeline

### **4. API Testing**

#### **A. Manual API Test**
```bash
# Start development server
npm run dev

# In another terminal, run API test
node test-api-endpoint.js
```

#### **B. Expected Results**
- ✅ API returns success response
- ✅ Shows number of shipments processed
- ✅ Lists updated shipments with old/new sub-stages
- ✅ Shows days elapsed for each update

### **5. Real-World Testing Scenarios**

#### **Scenario 1: New Shipment**
1. Create shipment with "In Transit to India"
2. Check timeline immediately
3. **Expected**: Shows stage_1 (same day)

#### **Scenario 2: Next Day**
1. Wait until next day (or simulate by changing date)
2. Refresh timeline
3. **Expected**: Shows stage_2 (next day)

#### **Scenario 3: Multiple Days Later**
1. Simulate 3-4 days elapsed
2. Check timeline
3. **Expected**: Shows appropriate stage (stage_7 or stage_9)

#### **Scenario 4: Completed Journey**
1. Simulate 6+ days elapsed
2. Check timeline
3. **Expected**: Shows stage_15 (delivered)

### **6. Browser Console Testing**

#### **A. Check Console Logs**
1. Open browser developer tools
2. Go to tracking page
3. Look for logs:
   ```
   ShipmentTimeline props: { currentStage: "In Transit to India", transitStartDate: "2025-01-20T..." }
   ```

#### **B. Verify Auto Progression**
1. Check console for:
   - ✅ `useAutoProgression: true`
   - ✅ `autoSubStage: stage_X`
   - ✅ `effectiveSubStage: stage_X`

### **7. Error Testing**

#### **A. Missing Transit Start Date**
1. Create shipment without transit_start_date
2. Verify fallback to manual progression
3. **Expected**: Manual sub-stage selection works

#### **B. Invalid Dates**
1. Test with invalid transit_start_date
2. Verify error handling
3. **Expected**: Graceful fallback to manual mode

#### **C. API Errors**
1. Test API with invalid data
2. Verify error responses
3. **Expected**: Proper error messages and logging

### **8. Performance Testing**

#### **A. Multiple Shipments**
1. Create 10+ shipments in "In Transit to India"
2. Run API update
3. **Expected**: All update successfully

#### **B. Large Dataset**
1. Test with 100+ shipments
2. Monitor API response time
3. **Expected**: Reasonable performance (< 5 seconds)

### **9. Cross-Browser Testing**

#### **A. Browser Compatibility**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### **B. Mobile Testing**
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design
- [ ] Touch interactions

### **10. Integration Testing**

#### **A. Email Notifications**
1. Change sub-stage via API
2. Verify email is sent
3. **Expected**: Email contains correct sub-stage info

#### **B. WhatsApp Integration**
1. Test WhatsApp notifications
2. Verify sub-stage updates
3. **Expected**: WhatsApp message shows current sub-stage

### **11. Debug Commands**

#### **A. Database Queries**
```sql
-- Check transit_start_date column
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'shipments' AND column_name = 'transit_start_date';

-- Check shipments in transit
SELECT tracking_id, status, "subStage", "transit_start_date" 
FROM shipments WHERE status = 'In Transit to India';
```

#### **B. API Testing**
```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/auto-update-substages

# Check response
echo $response | jq '.'
```

### **12. Success Criteria**

#### **✅ All Tests Pass When:**
- [ ] Logic test shows correct progression
- [ ] Database migration successful
- [ ] API endpoint responds correctly
- [ ] Frontend displays automatic progression
- [ ] Manual fallback works
- [ ] Email/WhatsApp notifications sent
- [ ] Cross-browser compatibility verified
- [ ] Performance acceptable
- [ ] Error handling graceful

### **13. Common Issues & Solutions**

#### **Issue: Sub-stages not updating**
**Solution**: Check `transit_start_date` is set and API is running

#### **Issue: Timeline showing manual mode**
**Solution**: Verify `transit_start_date` exists in database

#### **Issue: API returning errors**
**Solution**: Check Supabase connection and environment variables

#### **Issue: Frontend not reflecting changes**
**Solution**: Clear browser cache and refresh page

### **14. Final Verification**

#### **Complete Test Flow:**
1. ✅ Run logic test: `node test-simple-progression.js`
2. ✅ Run database test: Execute `test-database-migration.sql`
3. ✅ Start dev server: `npm run dev`
4. ✅ Run API test: `node test-api-endpoint.js`
5. ✅ Test admin panel: Create/edit shipments
6. ✅ Test customer view: Check timeline progression
7. ✅ Test notifications: Verify email/WhatsApp
8. ✅ Test error scenarios: Verify graceful handling

**🎉 System is ready when all tests pass!**
