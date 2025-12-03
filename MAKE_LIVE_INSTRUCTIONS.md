# 🚀 Make Tech Hunt Live - Instructions

## What Changed

I've updated the event start time to make the Tech Hunt claim form **live immediately**:

```javascript
// Before (Timer shows until Dec 3, 7:30 PM):
const EVENT_START_TIME = new Date('2025-12-03T19:30:00').getTime();

// After (Live NOW):
const EVENT_START_TIME = new Date('2025-12-03T00:00:00').getTime();
```

## 🎯 Deploy to Production

### Option 1: Quick Deploy (Recommended)

**On your VPS, run:**
```bash
cd /root/Nextute-main
chmod +x make-tech-hunt-live.sh
./make-tech-hunt-live.sh
```

This will:
1. ✅ Update database schema (create tech_hunt_participants table)
2. ✅ Build frontend with live event
3. ✅ Deploy to Nginx
4. ✅ Restart all services
5. ✅ Test the endpoints

### Option 2: Manual Deploy

**On your VPS:**
```bash
cd /root/Nextute-main

# 1. Update database
cd backend
npx prisma db push

# 2. Build frontend
cd ../frontend
npm run build

# 3. Deploy to Nginx
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute

# 4. Restart services
pm2 restart all
sudo systemctl reload nginx
```

### Option 3: Use Existing Deploy Script

```bash
cd /root/Nextute-main
chmod +x deploy-tech-hunt.sh
./deploy-tech-hunt.sh
```

## ✅ What Users Will See

### Before Deployment
- ⏰ Countdown timer
- 📝 Form hidden
- "Get Ready!" message

### After Deployment (LIVE)
- ✅ "Event is Live!" green banner
- 📝 Form visible and enabled
- 🎉 Users can claim rewards immediately

## 🧪 Test After Deployment

### 1. Check Backend
```bash
curl https://www.nextute.com/api/tech-hunt/stats
```

Expected:
```json
{
  "status": true,
  "data": {
    "totalParticipants": 0,
    "totalTeams": 0
  }
}
```

### 2. Visit Frontend
```
https://www.nextute.com/tech-hunt
```

Should see:
- ✅ Green "Event is Live!" banner
- 📝 Claim form visible
- No countdown timer

### 3. Test Form Submission
Fill in:
- Name: Test User
- Roll Number: TEST001
- Team Name: Test Team

Submit and verify success message.

### 4. Check Data Stored
```bash
curl https://www.nextute.com/api/tech-hunt/participants
```

Should show the test participant.

## 📊 Monitor After Going Live

### Check Logs
```bash
# Backend logs
pm2 logs backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Check Stats
```bash
# Every few minutes, check:
curl https://www.nextute.com/api/tech-hunt/stats
```

### Download Data
```bash
# Export all participants
curl https://www.nextute.com/api/tech-hunt/participants > participants.json
```

## 🔄 If You Need to Revert

To show the timer again (event not started):

1. Edit `frontend/src/pages/TechHuntSponsor.jsx`
2. Change back to:
```javascript
const EVENT_START_TIME = new Date('2025-12-03T19:30:00').getTime();
```
3. Rebuild and deploy

## 🎉 You're Live!

Once deployed:
- ✅ Form is immediately available
- ✅ Users can claim rewards
- ✅ Data is stored in database
- ✅ Stats update in real-time

## 📱 Share These Links

**Event Page:**
```
https://www.nextute.com/tech-hunt
```

**QR Code:** Generate a QR code pointing to the above URL

**Social Media Post:**
```
🎯 Tech Hunt 2025 is LIVE!

Claim your exclusive reward NOW! 🎉

👉 https://www.nextute.com/tech-hunt

Organized by Zenith
#TechHunt2025 #Zenith
```

## 🚨 Important Notes

1. **Database:** Make sure `npx prisma db push` runs successfully
2. **Cache:** Users may need to clear browser cache
3. **Mobile:** Test on mobile devices
4. **Stats:** Monitor participant count
5. **Backup:** Export data regularly

## 📞 Support

**If issues occur:**

1. Check backend: `pm2 logs backend`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Test API: `curl http://localhost:8080/api/tech-hunt/stats`
4. Restart: `pm2 restart all`

---

**Status:** ✅ Ready to Deploy  
**Action:** Run `make-tech-hunt-live.sh` on VPS  
**Result:** Tech Hunt will be live immediately!
