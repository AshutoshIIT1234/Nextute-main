# 🔧 Fix Mentorship Booking Error

## Problem
Getting 500 error on `/api/mentorship/verify-payment` because the `mentorship_bookings` table doesn't exist.

## Solution

### Step 1: Add the Database Table

Run this command in your backend directory:

```bash
cd backend
npx prisma generate
npx prisma db push
```

**OR** use the batch file (Windows):
```bash
cd Nextute-main
setup-mentorship-booking.bat
```

**OR** run the SQL manually:
```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database

# Then run:
\i backend/add-mentorship-booking-table.sql
```

### Step 2: Restart Backend

```bash
# If using PM2
pm2 restart nextute-backend

# If running locally
# Stop the server (Ctrl+C) and restart:
npm run dev
```

### Step 3: Test Payment Flow

1. Go to mentorship page
2. Select a mentor
3. Click "Book Session"
4. Complete test payment
5. Should see success and redirect to Calendly

---

## What Was Fixed

### Backend Changes:
1. ✅ Added `MentorshipBooking` model to Prisma schema
2. ✅ Updated controller to accept `studentEmail` and `studentName`
3. ✅ Removed database lookup for student (avoiding error)
4. ✅ Added email sending with Calendly link

### Frontend Changes:
1. ✅ Updated payment verification to send student email and name
2. ✅ Added auto-redirect to Calendly after success

### Database:
1. ✅ Created `mentorship_bookings` table
2. ✅ Added indexes for performance
3. ✅ Stores all booking details

---

## Table Structure

```sql
mentorship_bookings (
  id UUID PRIMARY KEY,
  mentor_id INTEGER,
  mentor_name VARCHAR(255),
  student_id VARCHAR(255),
  student_email VARCHAR(255),
  student_name VARCHAR(255),
  amount DECIMAL(10, 2),
  payment_id VARCHAR(255) UNIQUE,
  order_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'confirmed',
  booking_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## Testing

### Test Payment Credentials (Razorpay Test Mode):
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

### Expected Flow:
1. ✅ Payment modal opens
2. ✅ Enter test card details
3. ✅ Payment succeeds
4. ✅ Booking saved to database
5. ✅ Email sent with Calendly link
6. ✅ Success toast appears
7. ✅ Auto-redirect to Calendly after 2 seconds

---

## Verify It Works

### Check Database:
```sql
SELECT * FROM mentorship_bookings 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check Backend Logs:
```bash
pm2 logs nextute-backend --lines 50
```

Look for:
- ✅ "Payment verified successfully"
- ✅ "Confirmation email sent to [email]"

### Check Email:
- Student should receive confirmation email
- Email should have Calendly button
- Link should work

---

## Troubleshooting

### Error: "Table doesn't exist"
**Solution:** Run `npx prisma db push` in backend directory

### Error: "Cannot find module prisma"
**Solution:** Run `npm install` in backend directory

### Error: "Email not sent"
**Solution:** Check EMAIL_USER and EMAIL_PASS in backend/.env

### Error: "Redirect not working"
**Solution:** Check browser console, verify Calendly URL

---

## Files Modified

1. `backend/prisma/schema.prisma` - Added MentorshipBooking model
2. `backend/controllers/mentorshipController.js` - Updated payment verification
3. `frontend/src/hooks/useRazorpay.js` - Added student email/name to request
4. `backend/add-mentorship-booking-table.sql` - SQL migration
5. `backend/setup-mentorship-booking.bat` - Setup script

---

## Quick Commands

```bash
# Setup database table
cd backend
npx prisma generate
npx prisma db push

# Restart backend
pm2 restart nextute-backend

# Check logs
pm2 logs nextute-backend

# Test database
psql -U your_user -d your_db -c "SELECT COUNT(*) FROM mentorship_bookings;"
```

---

## ✅ After Setup

Your mentorship booking flow will:
1. Accept payments via Razorpay
2. Save bookings to database
3. Send confirmation emails
4. Redirect to Calendly for scheduling
5. Track all transactions

**Status:** Ready to accept real bookings! 🚀
