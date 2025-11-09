# Calendly Links Added to Mentors

## Changes Made

### 1. ✅ Updated Prisma Schema
Added `calendlyLink` field to the Mentor model:
```prisma
calendlyLink  String?  @map("calendly_link")
```

### 2. ✅ Updated Mentor Seed Data
Added Calendly links for all mentors:

| Mentor | Calendly Link |
|--------|--------------|
| Gopal Gurjar | https://calendly.com/nextuteedtech/30min |
| **Shubhomoy Dey** | **https://calendly.com/nextuteedtech/one-one-mentorship-clone** |
| Likhitha | https://calendly.com/nextuteedtech/30min |
| Karan garg | https://calendly.com/nextuteedtech/30min |

### 3. ✅ Updated Mentorship Controller
- Fetches mentor's Calendly link from database
- Uses mentor-specific link in confirmation email
- Falls back to default link if not set
- Includes `calendlyLink` in mentor list API response

### 4. ✅ Updated Email Template
- Email now uses dynamic mentor name
- Email includes mentor-specific Calendly link
- Button text updated to be more personalized

## Database Migration

✅ Schema pushed to database successfully
✅ Mentors seeded with Calendly links

## API Changes

### GET `/api/mentorship/mentors`
Now includes `calendlyLink` in response:
```json
{
  "success": true,
  "mentors": [
    {
      "id": 1,
      "name": "Shubhomoy Dey",
      "expertise": "IIT Dhanbad",
      "calendlyLink": "https://calendly.com/nextuteedtech/one-one-mentorship-clone",
      ...
    }
  ]
}
```

### POST `/api/mentorship/verify-payment`
- Fetches mentor's Calendly link from database
- Sends personalized email with correct link

## Email Template Changes

**Before:**
```
Click the button below to schedule your 30-minute mentorship session with Gopal...
[Button] → https://calendly.com/nextuteedtech/30min
```

**After:**
```
Click the button below to schedule your 30-minute mentorship session with {mentorName}...
[Button] → {mentor's specific calendlyLink}
```

## Testing

To verify the changes:

1. **Check mentor data:**
   ```bash
   # In Prisma Studio or database
   SELECT name, calendly_link FROM mentors;
   ```

2. **Test API:**
   ```bash
   curl http://localhost:8080/api/mentorship/mentors
   ```

3. **Test booking flow:**
   - Book a session with Shubhomoy Dey
   - Complete payment
   - Check confirmation email
   - Verify Calendly link is: `https://calendly.com/nextuteedtech/one-one-mentorship-clone`

## Files Modified

- ✅ `backend/prisma/schema.prisma` - Added calendlyLink field
- ✅ `backend/prisma/seed-mentors.js` - Added Calendly links for all mentors
- ✅ `backend/controllers/mentorshipController.js` - Updated to use dynamic links
- ✅ `backend/utils/emailSender.js` - Added sendEmail function

## Next Steps

1. **Restart your backend server** to load the changes
2. **Test the booking flow** with Shubhomoy Dey
3. **Verify email** contains the correct Calendly link
4. **Update frontend** if you want to display Calendly links on mentor cards

## Important Notes

- Each mentor can now have their own unique Calendly link
- The system falls back to the default link if a mentor doesn't have one set
- Links are stored in the database and can be updated via seed or admin panel
- Email template is now dynamic and personalized per mentor

---

**Status:** ✅ Complete - Shubhomoy Dey's Calendly link is now set to:
`https://calendly.com/nextuteedtech/one-one-mentorship-clone`
