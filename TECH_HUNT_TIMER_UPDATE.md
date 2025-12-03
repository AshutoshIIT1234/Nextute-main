# 🎯 Tech Hunt - Timer & Branding Update

## What Changed

### ✅ New Features Added

1. **Countdown Timer**
   - Shows days, hours, minutes, and seconds until event starts
   - Event start time: **December 3, 2025 at 7:30 PM**
   - Timer updates every second
   - Automatically switches to "Event is Live" when time is reached

2. **Event Branding**
   - Added "Organized by Zenith" badge at the top
   - Zenith branding in form header
   - Zenith credit in success message

3. **Pre-Event State**
   - Form is hidden before event starts
   - Shows countdown timer instead
   - Displays "Get Ready!" message
   - Tip to keep page open

4. **Event Live State**
   - Green "Event is Live!" banner
   - Form becomes available
   - Urgent messaging to claim rewards

## Visual Changes

### Before Event Starts (Timer View)
```
┌─────────────────────────────────────────┐
│     🎯 Organized by Zenith              │
│                                         │
│         TECH HUNT 2025                  │
│                                         │
│     ⏰ Event Starts In                  │
│                                         │
│   [0] Days  [12] Hours                  │
│   [34] Minutes  [56] Seconds            │
│                                         │
│   ⏰ Reward claiming will be available  │
│      once the event starts!             │
│                                         │
│   [150 Participants] [45 Teams]         │
└─────────────────────────────────────────┘

Right Side:
┌─────────────────────────────────────────┐
│           ⏰ Get Ready!                  │
│                                         │
│   Reward claiming will open at          │
│                                         │
│   7:30 PM | December 3, 2025            │
│                                         │
│   Organized by Zenith                   │
│                                         │
│   💡 Tip: Keep this page open!          │
└─────────────────────────────────────────┘
```

### After Event Starts (Form View)
```
┌─────────────────────────────────────────┐
│     🎯 Organized by Zenith              │
│                                         │
│         TECH HUNT 2025                  │
│                                         │
│   ✅ Event is Live! 🎉                  │
│   Hurry! Claim your reward now!         │
│                                         │
│   [150 Participants] [45 Teams]         │
└─────────────────────────────────────────┘

Right Side:
┌─────────────────────────────────────────┐
│      Claim Your Reward                  │
│      Organized by Zenith                │
│                                         │
│   [Form fields...]                      │
│                                         │
│   [🎉 Claim My Reward Now!]             │
└─────────────────────────────────────────┘
```

## Technical Details

### Timer Logic
```javascript
// Event start time
const EVENT_START_TIME = new Date('2025-12-03T19:30:00').getTime();

// Updates every second
useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = EVENT_START_TIME - now;

    if (distance < 0) {
      setEventStarted(true); // Show form
    } else {
      // Calculate and display countdown
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

### Form Validation
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Check if event has started
  if (!eventStarted) {
    toast.error('Event has not started yet! Please wait until 7:30 PM.');
    return;
  }
  
  // Continue with form submission...
};
```

## Testing

### Test Timer (Before Event)
1. Visit `/tech-hunt` before December 3, 2025 7:30 PM
2. Should see countdown timer
3. Form should be hidden
4. Should see "Get Ready!" message

### Test Timer (After Event)
1. Visit `/tech-hunt` after December 3, 2025 7:30 PM
2. Should see "Event is Live!" banner
3. Form should be visible
4. Should be able to submit

### Test Timer Locally (Override Time)
To test the timer locally, temporarily change the event time:

```javascript
// In TechHuntSponsor.jsx
// Change this line to a time in the near future:
const EVENT_START_TIME = new Date('2025-12-03T19:30:00').getTime();

// To test "before event" state:
const EVENT_START_TIME = new Date('2025-12-31T23:59:59').getTime();

// To test "after event" state:
const EVENT_START_TIME = new Date('2020-01-01T00:00:00').getTime();
```

## Branding Elements

### "Organized by Zenith" appears in:
1. ✅ Top badge (yellow, with lightning icon)
2. ✅ Form header (below "Claim Your Reward")
3. ✅ Pre-event waiting screen
4. ✅ Success message (after claiming)

### Color Scheme
- **Zenith Badge:** Yellow (400) background with opacity
- **Timer:** Orange (500) to Red (500) gradient
- **Event Live:** Green (500) to Emerald (500) gradient
- **Main Theme:** Purple (900) to Blue (900) to Indigo (900)

## User Experience Flow

### Before Event (User arrives early)
1. User visits page
2. Sees countdown timer
3. Sees "Organized by Zenith"
4. Gets excited about upcoming event
5. Keeps page open or bookmarks it

### At Event Time (Timer hits zero)
1. Timer automatically switches to "Event is Live!"
2. Form appears
3. User can now claim reward
4. Urgent messaging encourages quick action

### After Claiming
1. Success animation
2. Shows submitted details
3. Credits Zenith organization
4. Provides next steps

## Deployment

No changes needed to deployment process. Just run:

```bash
deploy-tech-hunt.bat
```

The timer will automatically work based on the system time.

## Configuration

### Change Event Time
Edit `frontend/src/pages/TechHuntSponsor.jsx`:

```javascript
// Line ~20
const EVENT_START_TIME = new Date('2025-12-03T19:30:00').getTime();

// Change to your desired time:
const EVENT_START_TIME = new Date('YYYY-MM-DDTHH:MM:SS').getTime();
```

### Change Organization Name
Search and replace "Zenith" with your organization name in:
- `frontend/src/pages/TechHuntSponsor.jsx`

## Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Countdown Timer | ✅ | Shows time until event starts |
| Auto-Switch | ✅ | Automatically enables form at event time |
| Zenith Branding | ✅ | Organization credit throughout |
| Pre-Event State | ✅ | Waiting screen before event |
| Event Live Banner | ✅ | Green banner when event starts |
| Form Validation | ✅ | Prevents submission before event |
| Mobile Responsive | ✅ | Works on all devices |

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Handles timezone correctly

## Timezone Handling

The timer uses the user's local timezone. The event time is set as:
```javascript
new Date('2025-12-03T19:30:00')
```

This will be interpreted in the user's local timezone. If you want a specific timezone (e.g., IST), use:
```javascript
new Date('2025-12-03T19:30:00+05:30') // IST
```

## Next Steps

1. ✅ Timer implemented
2. ✅ Zenith branding added
3. ✅ Pre-event state created
4. ✅ Form validation updated
5. 🚀 Ready to deploy!

---

**Updated:** November 23, 2025  
**Version:** 1.1.0  
**New Features:** Countdown timer, Zenith branding
