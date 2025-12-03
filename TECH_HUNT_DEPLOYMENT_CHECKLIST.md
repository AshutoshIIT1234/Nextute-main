# ✅ Tech Hunt Deployment Checklist

## Pre-Deployment

- [ ] **Review all files created**
  - [ ] Backend controller: `backend/controllers/techHuntController.js`
  - [ ] Backend routes: `backend/routes/techHuntRoutes.js`
  - [ ] Database schema: `backend/prisma/schema.prisma`
  - [ ] Frontend page: `frontend/src/pages/TechHuntSponsor.jsx`
  - [ ] App routes: `frontend/src/App.jsx`

- [ ] **Test locally first**
  - [ ] Run: `test-tech-hunt-local.bat`
  - [ ] Visit: `http://localhost:5173/tech-hunt`
  - [ ] Submit test form
  - [ ] Verify success message
  - [ ] Try duplicate submission
  - [ ] Check stats update

- [ ] **Test API endpoints**
  - [ ] Run: `test-tech-hunt-api.bat`
  - [ ] Verify all responses
  - [ ] Check error handling

## Deployment Steps

- [ ] **1. Commit changes to Git**
  ```bash
  git add .
  git commit -m "Add Tech Hunt event sponsor page"
  git push origin main
  ```

- [ ] **2. Run deployment script**
  - [ ] Windows: `deploy-tech-hunt.bat`
  - [ ] Linux/Mac: `./deploy-tech-hunt.sh`

- [ ] **3. Verify deployment**
  - [ ] SSH into VPS
  - [ ] Check PM2 status: `pm2 status`
  - [ ] Check logs: `pm2 logs backend --lines 50`

## Post-Deployment Testing

- [ ] **Test production page**
  - [ ] Visit: `https://www.nextute.com/tech-hunt`
  - [ ] Page loads correctly
  - [ ] No console errors
  - [ ] Stats display correctly

- [ ] **Test form submission**
  - [ ] Fill in all required fields
  - [ ] Submit form
  - [ ] Verify success message
  - [ ] Check data in database

- [ ] **Test duplicate prevention**
  - [ ] Submit same roll number + team name
  - [ ] Verify error message
  - [ ] Confirm no duplicate in database

- [ ] **Test API endpoints**
  ```bash
  # Get stats
  curl https://www.nextute.com/api/tech-hunt/stats
  
  # Get participants
  curl https://www.nextute.com/api/tech-hunt/participants
  ```

- [ ] **Test on different devices**
  - [ ] Desktop browser
  - [ ] Mobile browser
  - [ ] Tablet
  - [ ] Different browsers (Chrome, Firefox, Safari)

## Database Verification

- [ ] **Check table created**
  ```bash
  cd /root/Nextute-main/backend
  npx prisma studio
  # Navigate to tech_hunt_participants table
  ```

- [ ] **Verify data structure**
  - [ ] All columns present
  - [ ] Unique constraint working
  - [ ] Timestamps auto-populating

- [ ] **Test queries**
  ```bash
  # Count participants
  SELECT COUNT(*) FROM tech_hunt_participants;
  
  # Count unique teams
  SELECT COUNT(DISTINCT team_name) FROM tech_hunt_participants;
  ```

## Performance Checks

- [ ] **Page load time**
  - [ ] < 3 seconds on desktop
  - [ ] < 5 seconds on mobile

- [ ] **API response time**
  - [ ] Stats endpoint: < 500ms
  - [ ] Claim endpoint: < 1s
  - [ ] Participants endpoint: < 2s

- [ ] **Resource usage**
  - [ ] Check CPU: `top`
  - [ ] Check memory: `free -h`
  - [ ] Check disk: `df -h`

## Security Checks

- [ ] **Input validation working**
  - [ ] Required fields enforced
  - [ ] Email format validated
  - [ ] SQL injection protected (Prisma)

- [ ] **Duplicate prevention**
  - [ ] Roll number + team name unique
  - [ ] Error message shown

- [ ] **Rate limiting** (optional)
  - [ ] Consider adding if high traffic expected

## Monitoring Setup

- [ ] **Set up alerts**
  - [ ] UptimeRobot monitor for `/tech-hunt`
  - [ ] Error tracking (Sentry)
  - [ ] Log monitoring

- [ ] **Track metrics**
  - [ ] Total participants
  - [ ] Submissions per hour
  - [ ] Error rate
  - [ ] Page views

## Documentation

- [ ] **Update README** (if needed)
  - [ ] Add Tech Hunt feature
  - [ ] Document new endpoints

- [ ] **Share with team**
  - [ ] Send page URL
  - [ ] Explain how to view participants
  - [ ] Share API documentation

## Marketing/Communication

- [ ] **Prepare announcement**
  - [ ] Social media posts
  - [ ] Email to participants
  - [ ] WhatsApp groups

- [ ] **Share the link**
  - [ ] `https://www.nextute.com/tech-hunt`
  - [ ] QR code (optional)
  - [ ] Short URL (optional)

## Backup Plan

- [ ] **Create backup before deployment**
  - [ ] Database backup
  - [ ] Code backup
  - [ ] Note current commit hash

- [ ] **Rollback procedure ready**
  ```bash
  cd /root/Nextute-main
  git log --oneline -5
  git reset --hard <previous-commit>
  cd frontend && npm run build
  pm2 restart all
  ```

## Post-Launch Monitoring

### First Hour
- [ ] Check every 15 minutes
- [ ] Monitor error logs
- [ ] Watch submission rate
- [ ] Respond to issues immediately

### First Day
- [ ] Check every hour
- [ ] Review all submissions
- [ ] Check for duplicate attempts
- [ ] Monitor server resources

### First Week
- [ ] Daily review of stats
- [ ] Export participant data
- [ ] Check for any issues
- [ ] Gather feedback

## Data Export

- [ ] **Export participants**
  ```bash
  # Via API
  curl https://www.nextute.com/api/tech-hunt/participants > participants.json
  
  # Via Prisma Studio
  # Export to CSV from UI
  ```

- [ ] **Backup data regularly**
  - [ ] Daily during event
  - [ ] Keep multiple backups

## Troubleshooting

### If page doesn't load
- [ ] Check Nginx config
- [ ] Check frontend build
- [ ] Check route in App.jsx

### If API doesn't work
- [ ] Check backend logs: `pm2 logs backend`
- [ ] Check database connection
- [ ] Verify routes imported in server.js

### If form doesn't submit
- [ ] Check browser console
- [ ] Check network tab
- [ ] Verify API endpoint URL
- [ ] Check CORS settings

### If duplicate check fails
- [ ] Verify unique constraint in database
- [ ] Check controller logic
- [ ] Test with Prisma Studio

## Success Criteria

- [ ] **Page accessible**
  - [ ] Loads in < 3 seconds
  - [ ] No errors in console
  - [ ] Mobile responsive

- [ ] **Form working**
  - [ ] Accepts valid submissions
  - [ ] Rejects duplicates
  - [ ] Shows appropriate messages

- [ ] **Data persisting**
  - [ ] Submissions saved to database
  - [ ] Stats update in real-time
  - [ ] No data loss

- [ ] **Performance acceptable**
  - [ ] Handles 100+ concurrent users
  - [ ] No server crashes
  - [ ] Response times < 2s

## Final Sign-Off

**Deployed By:** ___________________  
**Date:** ___________________  
**Time:** ___________________  

**Checklist Completed:** [ ] Yes [ ] No  
**Issues Found:** ___________________  
**Status:** [ ] Production Ready [ ] Needs Work  

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## Quick Reference

**Page URL:** https://www.nextute.com/tech-hunt  
**API Base:** https://www.nextute.com/api/tech-hunt  
**Documentation:** TECH_HUNT_README.md  
**Support:** Check PM2 logs and Prisma Studio

**Emergency Contacts:**
- Backend Issues: Check `pm2 logs backend`
- Database Issues: Check Prisma connection
- Frontend Issues: Check Nginx and build

---

**Remember:** Test locally first, deploy carefully, monitor closely!
