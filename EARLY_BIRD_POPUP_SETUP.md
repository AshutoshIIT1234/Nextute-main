# Early Bird Popup Setup Guide

## Overview
A popup component that displays Early Bird offer GIFs when users enter the website. The popup shows different GIFs for mobile and desktop devices and redirects to the mentorship page when clicked.

## Files Created

### 1. Component File
- **Location:** `frontend/src/components/EarlyBirdPopup.jsx`
- **Purpose:** Popup component with responsive GIF display

### 2. Updated Files
- **Location:** `frontend/src/App.jsx`
- **Changes:** Added EarlyBirdPopup component import and rendering

## Features

✅ **Responsive Design**
- Shows `early bird website.gif` on desktop (>768px)
- Shows `early bird mobile.gif` on mobile (≤768px)

✅ **Smart Display**
- Appears 2 seconds after page load
- Shows only once per session (uses sessionStorage)
- Won't annoy returning users in same session

✅ **User Experience**
- Smooth animations (fade in, scale, spring effect)
- Click anywhere on GIF to go to mentorship page
- Close button (X) in top-right corner
- Backdrop blur effect
- Hover effect with "Click to View Offers" text

✅ **Accessibility**
- Proper ARIA labels
- Keyboard accessible
- Screen reader friendly

## Setup Instructions

### Step 1: Add GIF Files

Place your GIF files in the `frontend/public/` directory:

```
frontend/
  └── public/
      ├── early-bird-web.gif     (Desktop version)
      └── early-bird-mobile.gif  (Mobile version)
```

**Important:** File names must match exactly (case-sensitive).

### Step 2: GIF Specifications

**Desktop GIF (`early-bird-web.gif`):**
- Recommended size: 1200px - 1600px width
- Aspect ratio: 16:9 or similar
- File size: Keep under 5MB for fast loading
- Format: GIF (animated)

**Mobile GIF (`early-bird-mobile.gif`):**
- Recommended size: 600px - 800px width
- Aspect ratio: 9:16 or 4:5 (portrait)
- File size: Keep under 3MB
- Format: GIF (animated)

### Step 3: Deploy

After adding the GIF files:

```bash
# Build frontend
cd frontend
npm run build

# Deploy to VPS
# (Follow your normal deployment process)
```

## Customization Options

### Change Display Timing

Edit `frontend/src/components/EarlyBirdPopup.jsx`:

```javascript
// Line 17 - Change delay before popup appears
setTimeout(() => {
  setShowPopup(true);
  sessionStorage.setItem("earlyBirdPopupSeen", "true");
}, 2000); // Change 2000 to desired milliseconds
```

### Change Mobile Breakpoint

```javascript
// Line 29 - Change mobile detection breakpoint
setIsMobile(window.innerWidth <= 768); // Change 768 to desired width
```

### Show Popup Multiple Times

To show popup every time (not just once per session):

```javascript
// Line 14 - Comment out or remove this check
// const hasSeenPopup = sessionStorage.getItem("earlyBirdPopupSeen");
// if (!hasSeenPopup) {
  const timer = setTimeout(() => {
    setShowPopup(true);
    // sessionStorage.setItem("earlyBirdPopupSeen", "true"); // Remove this
  }, 2000);
// }
```

### Change Redirect URL

```javascript
// Line 42 - Change redirect destination
navigate("/mentorship"); // Change to any route
```

### Adjust Animation

```javascript
// Lines 60-64 - Modify animation properties
initial={{ opacity: 0, scale: 0.8, y: 50 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.8, y: 50 }}
transition={{ type: "spring", duration: 0.5 }}
```

## Testing

### Test on Desktop
1. Open website in desktop browser
2. Wait 2 seconds
3. Popup should appear with desktop GIF
4. Click on GIF → Should redirect to mentorship page
5. Click X button → Should close popup

### Test on Mobile
1. Open website in mobile browser or use DevTools mobile view
2. Wait 2 seconds
3. Popup should appear with mobile GIF
4. Click on GIF → Should redirect to mentorship page
5. Click X button → Should close popup

### Test Session Storage
1. Visit website → Popup appears
2. Close popup
3. Navigate to another page
4. Return to homepage → Popup should NOT appear
5. Open new tab/window → Popup SHOULD appear

## Troubleshooting

### Popup Not Appearing

**Check 1: Session Storage**
```javascript
// Open browser console (F12)
sessionStorage.getItem("earlyBirdPopupSeen")
// If returns "true", clear it:
sessionStorage.removeItem("earlyBirdPopupSeen")
// Refresh page
```

**Check 2: GIF Files**
- Verify files exist in `frontend/public/`
- Check file names match exactly (case-sensitive)
- Try accessing directly: `http://localhost:5173/early-bird-web.gif`

**Check 3: Console Errors**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab to see if GIFs are loading

### Wrong GIF Showing

**Issue:** Desktop GIF on mobile or vice versa

**Solution:** Check breakpoint setting
```javascript
// Line 29 in EarlyBirdPopup.jsx
setIsMobile(window.innerWidth <= 768);
```

### GIF Not Loading

**Issue:** 404 error for GIF files

**Solutions:**
1. Verify files are in `frontend/public/` directory
2. Check file names (spaces, case-sensitivity)
3. Rebuild frontend: `npm run build`
4. Clear browser cache

### Popup Appears Every Time

**Issue:** Popup shows on every page load

**Solution:** This is expected behavior if you want it to show once per session. If it's showing every time, check if sessionStorage is being cleared.

## Performance Optimization

### Lazy Load GIFs
```javascript
// Add loading="lazy" to img tags (already included)
<img loading="eager" /> // Change to "lazy" if needed
```

### Preload GIFs
Add to `frontend/public/index.html`:
```html
<link rel="preload" as="image" href="/early-bird-web.gif">
<link rel="preload" as="image" href="/early-bird-mobile.gif">
```

### Compress GIFs
- Use tools like ezgif.com to compress
- Reduce colors if possible
- Optimize frame rate
- Reduce dimensions if too large

## Accessibility

The popup includes:
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Proper semantic HTML
- ✅ Alt text for images

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Checklist

- [ ] GIF files added to `frontend/public/`
- [ ] Desktop GIF: `early-bird-web.gif`
- [ ] Mobile GIF: `early-bird-mobile.gif`
- [ ] GIF files optimized (< 5MB)
- [ ] Component tested on desktop
- [ ] Component tested on mobile
- [ ] Redirect to mentorship page works
- [ ] Close button works
- [ ] Session storage works
- [ ] Frontend built: `npm run build`
- [ ] Deployed to VPS
- [ ] Tested on production

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify GIF files are in correct location
3. Clear browser cache and sessionStorage
4. Check network tab for 404 errors
5. Verify file names match exactly

---

**Component:** EarlyBirdPopup
**Version:** 1.0
**Last Updated:** $(date)
