# 🎯 Tech Hunt Event Sponsor Feature

## Overview

A dedicated event sponsorship page where Tech Hunt participants can claim their rewards by submitting their information.

**Event Details:**
- **Organized by:** Zenith
- **Event Date:** December 3, 2025
- **Event Time:** 7:30 PM
- **Feature:** Countdown timer before event starts

## Features

### Frontend (`/tech-hunt`)
- ✅ Countdown timer until event starts (7:30 PM, Dec 3, 2025)
- ✅ Beautiful gradient background with animated particles
- ✅ Reward claim form with validation (only available after event starts)
- ✅ Real-time participant statistics
- ✅ Success animation after claiming
- ✅ Duplicate submission prevention
- ✅ Mobile responsive design
- ✅ "Organized by Zenith" branding

### Backend API

#### Endpoints

**1. Claim Reward**
```
POST /api/tech-hunt/claim
```

**Request Body:**
```json
{
  "name": "John Doe",
  "rollNumber": "2021CS001",
  "teamName": "Code Warriors",
  "email": "john@example.com",      // Optional
  "phone": "+91 9876543210",        // Optional
  "college": "ABC Institute"        // Optional
}
```

**Response (Success):**
```json
{
  "status": true,
  "message": "Congratulations! Reward claimed successfully! 🎉",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "teamName": "Code Warriors",
    "claimedAt": "2025-11-23T10:30:00Z"
  }
}
```

**Response (Already Claimed):**
```json
{
  "status": false,
  "message": "You have already claimed your reward!",
  "error": "ALREADY_CLAIMED"
}
```

**2. Get Statistics**
```
GET /api/tech-hunt/stats
```

**Response:**
```json
{
  "status": true,
  "data": {
    "totalParticipants": 150,
    "totalTeams": 45
  }
}
```

**3. Get All Participants (Admin)**
```
GET /api/tech-hunt/participants
```

**Response:**
```json
{
  "status": true,
  "count": 150,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "rollNumber": "2021CS001",
      "teamName": "Code Warriors",
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "college": "ABC Institute",
      "claimedAt": "2025-11-23T10:30:00Z"
    }
  ]
}
```

## Database Schema

```prisma
model TechHuntParticipant {
  id         String   @id @default(uuid())
  name       String
  rollNumber String   @map("roll_number")
  teamName   String   @map("team_name")
  email      String?
  phone      String?
  college    String?
  claimedAt  DateTime @default(now()) @map("claimed_at")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@unique([rollNumber, teamName])
  @@map("tech_hunt_participants")
}
```

## Deployment

### Option 1: Automated Deployment

**Linux/Mac:**
```bash
chmod +x deploy-tech-hunt.sh
./deploy-tech-hunt.sh
```

**Windows:**
```bash
deploy-tech-hunt.bat
```

### Option 2: Manual Deployment

**On VPS:**
```bash
cd /root/Nextute-main

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
npx prisma db push

# Update frontend
cd ../frontend
npm install
npm run build

# Restart services
cd ..
pm2 restart all

# Test
curl http://localhost:8080/api/tech-hunt/stats
```

## Testing

### 1. Test Form Submission

Visit: `https://www.nextute.com/tech-hunt`

Fill in:
- Name: Test User
- Roll Number: TEST001
- Team Name: Test Team
- Submit

Expected: Success message with confetti animation

### 2. Test Duplicate Prevention

Try submitting the same roll number and team name again.

Expected: Error message "You have already claimed your reward!"

### 3. Test API Directly

```bash
# Get stats
curl https://www.nextute.com/api/tech-hunt/stats

# Claim reward
curl -X POST https://www.nextute.com/api/tech-hunt/claim \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "rollNumber": "TEST002",
    "teamName": "Test Team 2"
  }'

# Get all participants
curl https://www.nextute.com/api/tech-hunt/participants
```

## Validation Rules

### Required Fields
- ✅ Name (max 255 chars)
- ✅ Roll Number (max 100 chars)
- ✅ Team Name (max 255 chars)

### Optional Fields
- Email (validated format)
- Phone (max 20 chars)
- College (max 255 chars)

### Duplicate Check
- Combination of `rollNumber` + `teamName` must be unique
- Email must be unique (if provided)

## UI Features

### Form Page
- Gradient background (purple to blue)
- Animated floating particles
- Real-time statistics display
- Responsive design (mobile-friendly)
- Loading states
- Error handling with toast notifications

### Success State
- Animated checkmark
- Confetti effect
- Display submitted information
- Call-to-action button

## Customization

### Change Colors

Edit `frontend/src/pages/TechHuntSponsor.jsx`:

```jsx
// Background gradient
className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"

// Button gradient
className="bg-gradient-to-r from-purple-600 to-pink-600"
```

### Change Rewards Text

Edit the benefits section in `TechHuntSponsor.jsx`:

```jsx
<h3 className="text-2xl font-bold text-white mb-2">Exclusive Rewards</h3>
<p className="text-gray-300">
  Your custom reward description here
</p>
```

### Add More Fields

1. Update Prisma schema
2. Add field to form in `TechHuntSponsor.jsx`
3. Update controller validation
4. Run `npx prisma db push`

## Admin Panel (Future Enhancement)

To view participants, you can:

### Option 1: Direct API Call
```bash
curl https://www.nextute.com/api/tech-hunt/participants
```

### Option 2: Database Query
```bash
cd /root/Nextute-main/backend
npx prisma studio
# Navigate to tech_hunt_participants table
```

### Option 3: Create Admin Page (TODO)
- Add authentication middleware
- Create admin dashboard
- Display participants in table
- Export to CSV functionality

## Troubleshooting

### Form Not Submitting
1. Check browser console for errors
2. Verify backend is running: `pm2 status`
3. Check backend logs: `pm2 logs backend`
4. Test API directly with curl

### Database Errors
```bash
cd /root/Nextute-main/backend
npx prisma generate
npx prisma db push
```

### Frontend Not Updating
```bash
cd /root/Nextute-main/frontend
rm -rf dist
npm run build
```

## Security Considerations

### Current Implementation
- ✅ Input validation
- ✅ Duplicate prevention
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)

### Recommended Additions
- [ ] Rate limiting on claim endpoint
- [ ] CAPTCHA for bot prevention
- [ ] Admin authentication for participants endpoint
- [ ] Email verification (optional)

## Analytics

Track these metrics:
- Total participants
- Total teams
- Submission rate over time
- Most common colleges
- Peak submission times

## Support

If you encounter issues:

1. **Backend not responding:**
   - Check: `pm2 logs backend`
   - Restart: `pm2 restart backend`

2. **Database errors:**
   - Check connection: `npx prisma db pull`
   - Regenerate: `npx prisma generate`

3. **Frontend issues:**
   - Clear cache and rebuild
   - Check browser console

## Future Enhancements

- [ ] Email confirmation after claiming
- [ ] QR code generation for verification
- [ ] Admin dashboard
- [ ] Export participants to CSV
- [ ] Team leaderboard
- [ ] Social sharing buttons
- [ ] Multi-language support

---

**Status:** ✅ Ready for deployment  
**Version:** 1.0.0  
**Last Updated:** November 23, 2025

**Access:** https://www.nextute.com/tech-hunt
