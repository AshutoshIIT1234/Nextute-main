# 🎨 Tech Hunt Page Preview

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         NAVBAR                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│              🎯 EVENT SPONSOR BADGE                          │
│                                                               │
│              TECH HUNT 2025                                  │
│         Claim Your Exclusive Reward Now! 🎉                  │
│                                                               │
│         [150 Participants]  [45 Teams]                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────┐
│                          │                                  │
│  🏆 EXCLUSIVE REWARDS    │    📝 CLAIM YOUR REWARD         │
│  Premium resources,      │                                  │
│  certificates & prizes   │    Name: [____________]          │
│                          │                                  │
│  🎁 LIMITED TIME OFFER   │    Roll Number: [______]         │
│  First come, first       │                                  │
│  served!                 │    Team Name: [________]         │
│                          │                                  │
│  👥 TEAM BENEFITS        │    Email: [____________]         │
│  Special perks for       │    (Optional)                    │
│  entire team             │                                  │
│                          │    Phone: [____________]         │
│                          │    (Optional)                    │
│                          │                                  │
│                          │    College: [__________]         │
│                          │    (Optional)                    │
│                          │                                  │
│                          │    [🎉 Claim My Reward Now!]    │
│                          │                                  │
│                          │    ⚠️ Hurry! Limited rewards    │
│                          │       available                  │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘

        ✨ Animated floating particles ✨

┌─────────────────────────────────────────────────────────────┐
│                         FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## After Successful Submission

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    ✅ (Animated Checkmark)                   │
│                                                               │
│              Congratulations! 🎉                             │
│                                                               │
│        You've successfully claimed your reward!              │
│                                                               │
│    ┌─────────────────────────────────────────┐             │
│    │  Name:        Rahul Kumar                │             │
│    │  Roll Number: 2021CS042                  │             │
│    │  Team:        Code Ninjas                │             │
│    └─────────────────────────────────────────┘             │
│                                                               │
│    Check your email for further instructions!                │
│                                                               │
│              [Back to Home]                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

**Background:**
- Gradient: Purple (900) → Blue (900) → Indigo (900)
- Animated white particles floating

**Cards:**
- White/10 opacity with backdrop blur
- White/20 border
- Glass morphism effect

**Buttons:**
- Gradient: Purple (600) → Pink (600)
- Hover: Purple (700) → Pink (700)
- Transform scale on hover

**Text:**
- Headings: White
- Body: Gray (300)
- Labels: White
- Placeholders: Gray (400)

**Accents:**
- Yellow (400) - Event badge
- Green (500) - Success state
- Red (400) - Required fields
- Pink (400) - Gift icon
- Blue (400) - Users icon

## Animations

1. **Page Load:**
   - Header fades in from top
   - Left cards slide in from left
   - Right form slides in from right

2. **Background:**
   - 20 floating particles
   - Random positions
   - Slow movement (10-20s duration)
   - Infinite loop

3. **Form Submission:**
   - Button shows loading spinner
   - Success: Scale animation
   - Checkmark appears with spring effect

4. **Hover Effects:**
   - Button scales up (1.05x)
   - Cards have subtle shadow
   - Input fields glow on focus

## Responsive Design

### Desktop (>768px)
- Two-column layout
- Benefits on left, form on right
- Full-width cards

### Mobile (<768px)
- Single column layout
- Benefits stack above form
- Touch-friendly buttons
- Larger input fields

## Icons Used

- ⚡ Zap - Event badge
- 🏆 Trophy - Rewards
- 🎁 Gift - Limited offer
- 👥 Users - Team benefits
- ✅ CheckCircle - Success
- ⚠️ AlertCircle - Warning

## Typography

**Headings:**
- H1: 5xl (3rem) on desktop, 6xl on large screens
- H2: 3xl (1.875rem)
- H3: 2xl (1.5rem)

**Body:**
- Base: 1rem
- Small: 0.875rem
- Large: 1.25rem

**Font Weight:**
- Bold: 700 (headings)
- Semibold: 600 (buttons, labels)
- Medium: 500 (subheadings)
- Normal: 400 (body text)

## Interactive Elements

### Form Inputs
- **Default:** White/20 background, white/30 border
- **Focus:** Purple ring (2px), outline removed
- **Error:** Red border (not implemented yet)
- **Disabled:** Opacity 50%, cursor not-allowed

### Submit Button
- **Default:** Purple-pink gradient
- **Hover:** Darker gradient, scale 1.05
- **Loading:** Spinner animation, disabled
- **Disabled:** Opacity 50%, no transform

### Statistics
- **Numbers:** Large (3xl), colored (yellow/purple)
- **Labels:** Small, gray
- **Update:** Smooth transition

## Accessibility

✅ Semantic HTML  
✅ ARIA labels on buttons  
✅ Keyboard navigation  
✅ Focus indicators  
✅ Color contrast (WCAG AA)  
✅ Responsive text sizes  
⚠️ Screen reader support (could be improved)

## Browser Support

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Mobile browsers  
⚠️ IE11 (not tested)

## Performance

- **Initial Load:** ~2-3s (with lazy loading)
- **Form Submission:** ~500ms-1s
- **Animations:** 60 FPS (GPU accelerated)
- **Bundle Size:** ~50KB (gzipped)

## User Flow

```
1. User visits /tech-hunt
   ↓
2. Sees event info & form
   ↓
3. Fills in required fields
   ↓
4. Clicks "Claim My Reward Now!"
   ↓
5. Loading state (spinner)
   ↓
6. Success animation
   ↓
7. Shows confirmation with details
   ↓
8. Can return to home
```

## Error States

**Validation Errors:**
- Toast notification (red)
- "Please fill in all required fields!"

**Duplicate Submission:**
- Toast notification (red)
- "You have already claimed your reward!"

**Network Error:**
- Toast notification (red)
- "Something went wrong. Please try again!"

## Success State

**Visual:**
- Green checkmark (animated)
- Confetti effect (optional)
- Submitted data display
- Call-to-action button

**Message:**
- "Congratulations! 🎉"
- "You've successfully claimed your reward!"
- "Check your email for further instructions"

---

**Design Style:** Modern, Vibrant, Engaging  
**Target Audience:** College students (18-25)  
**Mood:** Exciting, Urgent, Rewarding
