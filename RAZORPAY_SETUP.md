# Razorpay Integration for Mentorship Bookings

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up at https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live API Keys
4. Copy the Key ID and Key Secret

### 2. Update Backend Environment Variables

Add these to `backend/.env`:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Install Razorpay Package

```bash
cd backend
npm install razorpay
```

### 4. Create Database Table (Optional)

If you want to store bookings in database, add this to your Prisma schema:

```prisma
model MentorshipBooking {
  id          String   @id @default(uuid())
  mentorId    Int
  mentorName  String
  studentId   String
  amount      Float
  paymentId   String
  orderId     String
  status      String   @default("confirmed")
  bookingDate DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:
```bash
npx prisma migrate dev --name add_mentorship_bookings
npx prisma generate
```

### 5. Deploy Backend Changes

```bash
cd /root/Nextute-main/backend
npm install razorpay
pm2 restart nextute-backend
```

### 6. Deploy Frontend Changes

```bash
cd /root/Nextute-main/frontend
npm run build
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute/
```

## How It Works

1. **Student clicks "Book Session"** on mentor card
2. **Frontend validates** - checks if user is logged in and is a student
3. **Backend creates Razorpay order** with mentor and student details
4. **Razorpay payment modal opens** with prefilled student information
5. **Student completes payment** using any payment method
6. **Backend verifies payment signature** for security
7. **Booking is saved** to database with payment details
8. **Success notification** shown to student

## Features

- ✅ Secure payment processing with Razorpay
- ✅ Payment signature verification
- ✅ User authentication check
- ✅ Student-only booking restriction
- ✅ Toast notifications for feedback
- ✅ Payment details stored in database
- ✅ Responsive payment modal
- ✅ Support for all Razorpay payment methods

## Testing

Use Razorpay test cards:
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## API Endpoints

### Create Order
```
POST /api/mentorship/create-order
Body: {
  mentorId: number,
  mentorName: string,
  amount: number,
  studentId: string
}
```

### Verify Payment
```
POST /api/mentorship/verify-payment
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  mentorId: number,
  mentorName: string,
  studentId: string,
  amount: number
}
```

## Troubleshooting

1. **Payment modal not opening**: Check if Razorpay script is loaded
2. **Payment verification fails**: Verify RAZORPAY_KEY_SECRET is correct
3. **CORS errors**: Ensure frontend URL is in backend CORS whitelist
4. **Database errors**: Run Prisma migrations if using database storage

## Security Notes

- Never expose RAZORPAY_KEY_SECRET in frontend
- Always verify payment signature on backend
- Use HTTPS in production
- Store sensitive data securely
