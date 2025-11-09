# Razorpay Pricing Fix

## Issue
The pricing displayed on the website was updated to Early Bird offers, but the actual Razorpay payment amounts were still using old test prices (₹101 and ₹201).

## Fix Applied

### Files Updated:

#### 1. frontend/src/pages/MentorshipComingSoon.jsx
**Line 38 - Changed:**
```javascript
// Before:
const price = planType === 'premium' ? 201 : 101;

// After:
const price = planType === 'premium' ? 1499 : 1000;
```

#### 2. frontend/src/pages/MentorDetailPage.jsx
**Line 35 - Changed:**
```javascript
// Before:
const price = planType === 'premium' ? 201 : 101;

// After:
const price = planType === 'premium' ? 1499 : 1000;
```

## Updated Pricing

| Plan | Display Price | Razorpay Amount | Razorpay (Paise) |
|------|--------------|-----------------|------------------|
| Pro Plan | ₹1,000 | 1000 | 100000 |
| Premium Plan | ₹1,499 | 1499 | 149900 |

## How Payment Flow Works

1. **User clicks "Book Session"** on mentor card
2. **Pricing modal opens** showing Pro (₹1,000) and Premium (₹1,499)
3. **User selects plan** (Pro or Premium)
4. **handlePlanSelect** is called with planType
5. **Price is set** based on planType:
   - Pro: 1000
   - Premium: 1499
6. **Razorpay order created** with amount in rupees
7. **Backend converts** to paise (amount * 100)
8. **Razorpay checkout opens** with correct amount
9. **Payment processed** by Razorpay
10. **Confirmation email sent** with correct amount

## Deployment Steps

### Quick Deploy:
```bash
# Connect to VPS
ssh root@72.60.218.219

# Navigate to project
cd /root/Nextute-main

# Pull latest changes
git pull origin main

# Rebuild frontend
cd frontend
rm -rf dist
npm run build

# Copy to nginx (if applicable)
sudo cp -r dist/* /var/www/nextute/
sudo systemctl restart nginx

# Restart PM2
cd ..
pm2 restart all
```

### Verify Fix:
1. Visit https://www.nextute.com
2. Go to Mentorship page
3. Click "Book Session" on any mentor
4. Select Pro Plan
5. Check Razorpay shows ₹1,000 (not ₹101)
6. Cancel and try Premium Plan
7. Check Razorpay shows ₹1,499 (not ₹201)

## Testing Checklist

- [ ] Pro Plan displays ₹1,000 in UI
- [ ] Premium Plan displays ₹1,499 in UI
- [ ] Razorpay checkout shows ₹1,000 for Pro
- [ ] Razorpay checkout shows ₹1,499 for Premium
- [ ] Payment confirmation email shows correct amount
- [ ] Calendly link works after payment

## Important Notes

1. **Test Mode vs Live Mode:**
   - Make sure Razorpay keys in backend/.env are for the correct mode
   - Test mode: Use test card numbers
   - Live mode: Real payments will be processed

2. **Razorpay Amount Format:**
   - Frontend sends amount in rupees (1000, 1499)
   - Backend converts to paise (100000, 149900)
   - Razorpay API requires amount in paise

3. **Email Confirmation:**
   - Confirmation email will show the amount paid
   - Verify email template shows correct pricing

## Related Files

**Frontend:**
- `frontend/src/pages/MentorshipComingSoon.jsx` - Main mentorship page
- `frontend/src/pages/MentorDetailPage.jsx` - Individual mentor page
- `frontend/src/hooks/useRazorpay.js` - Razorpay integration hook

**Backend:**
- `backend/controllers/mentorshipController.js` - Payment processing
- `backend/routes/mentorshipRoutes.js` - Payment routes

## Rollback

If you need to revert to test prices:
```javascript
const price = planType === 'premium' ? 201 : 101;
```

## Support

If payment issues occur:
1. Check Razorpay dashboard for failed payments
2. Check backend logs: `pm2 logs backend`
3. Verify Razorpay keys in backend/.env
4. Test with Razorpay test cards first

---

**Status:** ✅ Fixed
**Updated:** Razorpay payment amounts now match displayed prices
**Pro Plan:** ₹1,000
**Premium Plan:** ₹1,499
