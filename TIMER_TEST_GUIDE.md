# ⏰ Timer Testing Guide

## How to Test the Countdown Timer

The Tech Hunt page has a countdown timer that shows before the event starts at **7:30 PM on December 3, 2025**.

## Testing Scenarios

### Scenario 1: Test "Before Event" State

**Goal:** See the countdown timer

**Method 1: Wait for Real Event**
- Just visit the page before December 3, 2025 at 7:30 PM
- You'll see the countdown timer

**Method 2: Change Event Time (For Testing)**

1. Open `frontend/src/pages/TechHuntSponsor.jsx`

2. Find this line (around line 20):
```javascript
const EVENT_START_TIME = new Date('2025-12-03T19:30:00').getTime();
```

3. Change to a future time:
```javascript
// Set to tomorrow at 10:00 AM
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);
const EVENT_START_TIME = tomorrow.getTime();
```

4. Save and refresh the page
5. You should see the countdown timer

### Scenario 2: Test "Event Started" State

**Goal:** See the form (event is live)

**Method 1: Wait for Real Event**
- Visit the page after December 3, 2025 at 7:30 PM
- You'll see the form

**Method 2: Change Event Time (For Testing)**

1. Open `frontend/src/pages/TechHuntSponsor.jsx`

2. Change the event time to the past:
```javascript
// Set to yesterday
const EVENT_START_TIME = new Date('2020-01-01T00:00:00').getTime();
```

3. Save and refresh the page
4. You should see "Event is Live!" and the form

### Scenario 3: Test Timer Countdown

**Goal:** Watch the timer count down in real-time

1. Set event time to 2 minutes from now:
```javascript
const now = new Date();
now.setMinutes(now.getMinutes() + 2);
const EVENT_START_TIME = now.getTime();
```

2. Save and refresh
3. Watch the timer count down
4. After 2 minutes, it should automatically switch to "Event is Live!"

## Quick Test Commands

### Test Timer (5 minutes from now)
```javascript
const EVENT_START_TIME = new Date(Date.now() + 5 * 60 * 1000).getTime();
```

### Test Timer (1 hour from now)
```javascript
const EVENT_START_TIME = new Date(Date.now() + 60 * 60 * 1000).getTime();
```

### Test Timer (Already started)
```javascript
const EVENT_START_TIME = new Date('2020-01-01T00:00:00').getTime();
```

## What to Check

### Before Event Starts
- [ ] Countdown timer visible
- [ ] Shows days, hours, minutes, seconds
- [ ] Timer updates every second
- [ ] "Get Ready!" message shown
- [ ] Form is hidden
- [ ] "Organized by Zenith" badge visible
- [ ] Stats still visible

### When Event Starts
- [ ] Timer disappears
- [ ] "Event is Live!" banner appears (green)
- [ ] Form becomes visible
- [ ] Can fill and submit form
- [ ] All validations work

### After Claiming
- [ ] Success message shows
- [ ] "Organized by Zenith" credit visible
- [ ] Can't submit again (duplicate check)

## Production Settings

**For production deployment, use the actual event time:**

```javascript
// December 3, 2025 at 7:30 PM (IST)
const EVENT_START_TIME = new Date('2025-12-03T19:30:00+05:30').getTime();
```

**Note:** The `+05:30` ensures it's 7:30 PM Indian Standard Time regardless of user's timezone.

## Timezone Considerations

### Without Timezone Suffix
```javascript
new Date('2025-12-03T19:30:00')
```
- Interprets time in user's local timezone
- User in USA sees different countdown than user in India

### With Timezone Suffix (Recommended)
```javascript
new Date('2025-12-03T19:30:00+05:30') // IST
```
- Everyone sees same countdown
- Event starts at same moment worldwide
- Recommended for consistency

## Common Issues

### Timer shows negative numbers
**Cause:** Event time is in the past  
**Fix:** Update EVENT_START_TIME to future date

### Timer doesn't update
**Cause:** JavaScript error  
**Fix:** Check browser console for errors

### Form visible before event
**Cause:** Event time set to past  
**Fix:** Verify EVENT_START_TIME is correct

### Timer shows wrong time
**Cause:** Timezone mismatch  
**Fix:** Add timezone suffix (+05:30 for IST)

## Testing Checklist

- [ ] Timer shows correct countdown
- [ ] Timer updates every second
- [ ] Days/hours/minutes/seconds calculate correctly
- [ ] Form hidden before event
- [ ] Form appears when timer reaches zero
- [ ] "Organized by Zenith" visible throughout
- [ ] Mobile responsive
- [ ] Works in different browsers
- [ ] Handles timezone correctly

## Deployment

**Before deploying to production:**

1. ✅ Verify EVENT_START_TIME is correct
2. ✅ Test timer locally
3. ✅ Check timezone is set correctly
4. ✅ Test on mobile
5. ✅ Deploy with `deploy-tech-hunt.bat`

## Quick Reference

**Event Details:**
- Date: December 3, 2025
- Time: 7:30 PM IST
- Organized by: Zenith

**Timer Location:**
- File: `frontend/src/pages/TechHuntSponsor.jsx`
- Line: ~20

**To Change Event Time:**
```javascript
const EVENT_START_TIME = new Date('YYYY-MM-DDTHH:MM:SS+05:30').getTime();
```

---

**Need Help?** Check `TECH_HUNT_TIMER_UPDATE.md` for detailed documentation.
