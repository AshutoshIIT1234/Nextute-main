# 📝 User Feedback Collection

## Quick Feedback Banner (Temporary)

Add this to your frontend for the first week after deployment:

### Option 1: Simple Banner Component

Create `frontend/src/components/FeedbackBanner.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FeedbackBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed
    const dismissed = localStorage.getItem('feedbackBannerDismissed');
    if (!dismissed) {
      // Show after 30 seconds
      const timer = setTimeout(() => setIsVisible(true), 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('feedbackBannerDismissed', 'true');
  };

  const handleFeedback = () => {
    window.open('https://forms.google.com/YOUR_FORM_ID', '_blank');
    handleDismiss();
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-2xl z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        <X size={20} />
      </button>
      
      <div className="pr-6">
        <h3 className="font-bold text-lg mb-2">🎉 We've just updated!</h3>
        <p className="text-sm mb-3">
          Help us improve by sharing your experience. Found a bug or have suggestions?
        </p>
        <button
          onClick={handleFeedback}
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
        >
          Give Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackBanner;
```

**Add to App.jsx:**
```jsx
import FeedbackBanner from './components/FeedbackBanner';

// Inside App component
<FeedbackBanner />
```

### Option 2: Floating Feedback Button

Create `frontend/src/components/FeedbackButton.jsx`:

```jsx
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send to your backend
      await fetch('https://api.nextute.com/api/feedback/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback,
          email,
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
        }),
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedback('');
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label="Feedback"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Feedback Form */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl p-6 z-50 border border-gray-200">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-3">✓</div>
              <h3 className="font-bold text-lg">Thank you!</h3>
              <p className="text-gray-600 text-sm">Your feedback helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold text-lg mb-2">Quick Feedback</h3>
              <p className="text-gray-600 text-sm mb-4">
                Found a bug or have a suggestion?
              </p>
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm resize-none"
                rows="4"
                required
              />
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm"
              />
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Send Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
```

## Backend Endpoint for Quick Feedback

Add to `backend/routes/feedbackRoutes.js`:

```javascript
router.post('/quick', async (req, res) => {
  try {
    const { feedback, email, page, timestamp } = req.body;
    
    // Save to database or send email
    await prisma.quickFeedback.create({
      data: {
        feedback,
        email: email || null,
        page,
        timestamp: new Date(timestamp),
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      },
    });
    
    // Optionally send email notification to team
    await sendEmail({
      to: 'team@nextute.com',
      subject: '📝 New User Feedback',
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Page:</strong> ${page}</p>
        <p><strong>Feedback:</strong> ${feedback}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
      `,
    });
    
    res.json({ success: true, message: 'Feedback received' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
});
```

## Google Forms Alternative (No Code Required)

### Create Google Form

1. Go to forms.google.com
2. Create new form with these fields:
   - **What page were you on?** (Short answer)
   - **What happened?** (Paragraph)
   - **What did you expect?** (Paragraph)
   - **Your email** (Email, optional)
   - **How urgent is this?** (Multiple choice: Critical Bug, Minor Issue, Suggestion)

3. Get the form link

4. Add to your site:
```jsx
<a 
  href="https://forms.google.com/YOUR_FORM_ID" 
  target="_blank"
  className="text-blue-600 hover:underline"
>
  Report an Issue
</a>
```

## Internal Team Communication

### Slack/Discord Notification Template

```javascript
// Send to Slack when deployment completes
const notifyTeam = async () => {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: '🚀 New version deployed to production!',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*🚀 Production Deployment Complete*\n\n' +
                  '✅ Frontend: https://www.nextute.com\n' +
                  '✅ Backend: https://api.nextute.com\n\n' +
                  '*Please test and report any issues immediately.*'
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Key Changes:*\n' +
                  '• Mentorship feature updates\n' +
                  '• Performance improvements\n' +
                  '• Bug fixes'
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: '🔍 View Site' },
              url: 'https://www.nextute.com'
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: '📊 Health Check' },
              url: 'https://api.nextute.com/test'
            }
          ]
        }
      ]
    })
  });
};
```

## Monitoring User Behavior

### Simple Analytics Events

Add to key pages:

```javascript
// Track page views
useEffect(() => {
  // Send to your analytics
  fetch('https://api.nextute.com/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    }),
  });
}, []);

// Track errors
window.addEventListener('error', (event) => {
  fetch('https://api.nextute.com/api/analytics/error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: event.message,
      stack: event.error?.stack,
      page: window.location.pathname,
    }),
  });
});
```

## Testing Checklist for Team

Share this with your team:

### Critical User Flows to Test

- [ ] **Homepage loads correctly**
- [ ] **Student signup flow**
  - [ ] Email verification works
  - [ ] Can login after signup
- [ ] **Institute signup flow**
  - [ ] All registration steps work
  - [ ] Dashboard accessible after signup
- [ ] **Search functionality**
  - [ ] Can search for institutes
  - [ ] Filters work correctly
- [ ] **Mentorship features**
  - [ ] Mentor list loads
  - [ ] Can view mentor details
  - [ ] Booking flow works
- [ ] **Payment flow** (if applicable)
  - [ ] Razorpay integration works
  - [ ] Payment confirmation received
- [ ] **Mobile responsiveness**
  - [ ] Test on actual mobile devices
  - [ ] All features accessible

### What to Report

**For Bugs:**
- What page were you on?
- What did you do?
- What happened?
- What did you expect?
- Screenshot if possible

**For Performance Issues:**
- Which page is slow?
- How long did it take?
- What time did this happen?

---

**Feedback Collection Period:** 1 week after deployment  
**Review Feedback:** Daily for first 3 days, then weekly
