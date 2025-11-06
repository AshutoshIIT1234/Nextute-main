# OTP Email Troubleshooting Guide

## Quick Test
Run this command to test your email configuration:
```bash
node test-email.js
```

## Common Issues & Solutions

### 1. Gmail App Password Issues
**Problem:** Gmail blocking login attempts

**Solution:**
- Make sure you're using an **App Password**, not your regular Gmail password
- Generate a new App Password:
  1. Go to Google Account → Security
  2. Enable 2-Step Verification (if not already enabled)
  3. Go to "App passwords"
  4. Generate a new password for "Mail"
  5. Update `EMAIL_PASS` in `.env` with the 16-character code (remove spaces)

### 2. Less Secure Apps
**Problem:** Gmail blocking "less secure app access"

**Solution:**
- Use App Passwords (recommended) instead of enabling less secure apps
- App Passwords work even with 2FA enabled

### 3. Environment Variables Not Loading
**Problem:** `.env` file not being read

**Check:**
```bash
# In backend directory
echo $EMAIL_USER
echo $EMAIL_PASS
```

**Solution:**
- Ensure `.env` is in the `backend` folder
- Restart your server after changing `.env`
- Check for typos in variable names

### 4. Firewall/Network Issues
**Problem:** SMTP port blocked

**Solution:**
- Check if port 587 or 465 is open
- Try from a different network
- Check corporate firewall settings

### 5. Rate Limiting
**Problem:** Too many emails sent in short time

**Solution:**
- Gmail has sending limits (500 emails/day for free accounts)
- Wait a few minutes between tests
- Consider using a dedicated email service (SendGrid, AWS SES)

### 6. Spam Folder
**Problem:** Emails going to spam

**Solution:**
- Check recipient's spam/junk folder
- Add sender to contacts
- Verify domain authentication (SPF, DKIM)

## Current Configuration

Your `.env` should have:
```
EMAIL_USER=nextuteedtech@gmail.com
EMAIL_PASS=uosw fhhe hjgg yqhq
```

## Testing Steps

1. **Test SMTP Connection:**
   ```bash
   node test-email.js
   ```

2. **Check Server Logs:**
   - Look for "✅ Email server is ready to send messages"
   - Look for "📧 Attempting to send OTP to: [email]"
   - Check for any error messages

3. **Test Signup Flow:**
   - Try signing up with a new email
   - Check server console for OTP code
   - Check email inbox (and spam folder)

4. **Manual Test:**
   - Use the OTP code from server logs if email doesn't arrive
   - This confirms the issue is with email sending, not OTP generation

## Alternative Solutions

If Gmail continues to fail, consider:

1. **Nodemailer with other providers:**
   - Outlook/Hotmail
   - Yahoo Mail
   - Custom SMTP server

2. **Dedicated email services:**
   - SendGrid (free tier: 100 emails/day)
   - AWS SES (very cheap)
   - Mailgun
   - Postmark

3. **Temporary workaround:**
   - Display OTP in server console
   - Use SMS OTP instead
   - Implement magic link authentication
