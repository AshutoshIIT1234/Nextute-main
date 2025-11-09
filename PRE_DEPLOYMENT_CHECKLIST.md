# Pre-Deployment Checklist

## Before You Deploy

### 1. Local Testing ✓
- [x] Testimonials loop infinitely
- [x] Email OTP sends successfully
- [x] Login/Signup works without 403 errors
- [x] Mentorship pricing shows Early Bird offers
- [x] Calendly links added to mentors
- [x] All features working locally

### 2. Code Quality ✓
- [x] No console errors in browser
- [x] No TypeScript/ESLint errors
- [x] All imports resolved
- [x] Build completes successfully
- [x] Backend starts without errors

### 3. Database Changes ✓
- [x] Prisma schema updated (calendly_link field)
- [x] Migration/push tested locally
- [x] Seed data updated
- [x] No breaking changes

### 4. Environment Variables
- [ ] Verify VPS .env file has all required variables
- [ ] Check DATABASE_URL is correct
- [ ] Verify EMAIL_USER and EMAIL_PASS
- [ ] Confirm RAZORPAY keys are production keys
- [ ] Ensure FRONTEND_URL is production URL
- [ ] Set NODE_ENV=production

### 5. Git Repository
- [ ] All changes committed
- [ ] Commit message is descriptive
- [ ] Pushed to main branch
- [ ] No merge conflicts

### 6. Backup Strategy
- [ ] Know how to create backup
- [ ] Know how to rollback
- [ ] Have backup of current production

### 7. Deployment Plan
- [ ] Read DEPLOY_TO_VPS.md
- [ ] Choose deployment method (Git/Script/Manual)
- [ ] Have SSH access to VPS
- [ ] Know project path on VPS
- [ ] Know how to restart services (PM2/systemd)

## Deployment Steps Summary

```bash
# Quick deployment commands:
ssh user@vps-ip
cd /path/to/Nextute-main
git pull origin main
cd backend && npm install && npx prisma db push && node prisma/seed-mentors.js
cd ../frontend && npm install && npm run build
pm2 restart all
```

## Post-Deployment Verification

### Immediate Checks (5 minutes)
- [ ] Backend health: `curl http://localhost:8080/test`
- [ ] PM2 status: `pm2 status`
- [ ] No errors in logs: `pm2 logs backend --lines 50`
- [ ] Frontend loads: Visit https://www.nextute.com

### Feature Testing (10 minutes)
- [ ] Testimonials section loops infinitely
- [ ] Mentorship page shows new pricing
  - [ ] Pro Plan: ₹1,500 → ₹1,000
  - [ ] Premium Plan: ₹1,999 → ₹1,499
  - [ ] Early Bird badges visible
- [ ] Signup sends OTP email
- [ ] Login works without 403 error
- [ ] Profile page accessible after verification
- [ ] Mentor booking flow works

### API Testing (5 minutes)
- [ ] GET /api/mentorship/mentors returns calendlyLink
- [ ] POST /api/students/signup sends email
- [ ] GET /api/students/profile works after login
- [ ] Debug endpoint works: /api/debug/auth-status

### Database Verification (3 minutes)
- [ ] Mentors table has calendly_link column
- [ ] Shubhomoy Dey has correct Calendly link
- [ ] All mentors seeded correctly

## Rollback Plan

If anything goes wrong:

```bash
# Stop services
pm2 stop all

# Restore backup
cd /path/to
rm -rf Nextute-main
mv Nextute-backup-YYYYMMDD Nextute-main

# Restart
cd Nextute-main
pm2 restart all
```

## Emergency Contacts

- **VPS Provider:** [Your VPS provider support]
- **Database:** [Neon.tech support if needed]
- **Email Service:** [Gmail/SMTP support]
- **Payment Gateway:** [Razorpay support]

## Monitoring After Deployment

### First Hour
- Check logs every 10 minutes
- Monitor error rates
- Watch for email delivery issues
- Check payment processing

### First Day
- Monitor user signups
- Check booking conversions
- Watch for any 500 errors
- Verify email delivery rate

### First Week
- Track Early Bird offer conversions
- Monitor Calendly booking rates
- Check for any recurring errors
- Gather user feedback

## Success Criteria

Deployment is successful when:
- ✅ All services running (pm2 status shows "online")
- ✅ No errors in logs
- ✅ Website loads correctly
- ✅ All features working as expected
- ✅ Email OTPs arriving
- ✅ Payments processing
- ✅ Database queries working
- ✅ No 403/500 errors

## Files to Deploy

### Backend Changes
- `backend/utils/emailSender.js` - Email improvements
- `backend/middlewares/studentAuthMiddleware.js` - Better logging
- `backend/controllers/studentAuthController.js` - Better error messages
- `backend/controllers/mentorshipController.js` - Calendly links
- `backend/controllers/chatbotController.js` - Updated pricing
- `backend/controllers/chatbotControllerAdvanced.js` - Updated pricing
- `backend/prisma/schema.prisma` - Added calendly_link
- `backend/prisma/seed-mentors.js` - Calendly links data
- `backend/routes/debugRoutes.js` - New debug endpoint
- `backend/server.js` - Debug routes registration

### Frontend Changes
- `frontend/src/components/Testimonial.jsx` - Infinite loop
- `frontend/src/pages/MentorshipComingSoon.jsx` - New pricing
- `frontend/src/pages/MentorDetailPage.jsx` - New pricing

### Documentation
- `DEPLOYMENT_GUIDE.md`
- `DEPLOY_TO_VPS.md`
- `PRE_DEPLOYMENT_CHECKLIST.md`
- `PRICING_UPDATE_SUMMARY.md`
- `CALENDLY_LINKS_ADDED.md`
- `FIXES_APPLIED.md`

## Final Checks Before Deploying

1. **Read this entire checklist** ✓
2. **Have rollback plan ready** ✓
3. **Backup current production** ✓
4. **Test locally one more time** ✓
5. **Verify environment variables** ✓
6. **Choose deployment method** ✓
7. **Have monitoring ready** ✓

## Ready to Deploy?

If all checks pass, proceed with deployment using:
- **DEPLOY_TO_VPS.md** for step-by-step guide
- **deploy.sh** for automated deployment
- **DEPLOYMENT_GUIDE.md** for detailed instructions

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Deployment Method:** _____________
**Backup Location:** _____________
**Status:** _____________

Good luck! 🚀
