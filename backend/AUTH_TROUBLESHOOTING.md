# 403 Forbidden Error Troubleshooting Guide

## The Error
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
/api/students/profile
```

## What 403 Means
A 403 error means the server understood your request but refuses to authorize it. This is different from 401 (Unauthorized).

## Common Causes

### 1. Wrong Token Type
**Problem:** You're logged in as an institute but trying to access student routes (or vice versa)

**Check:**
- Look at the server console logs for: `❌ Invalid token type: institute Expected: student`
- The token has a `type` field that must match the route

**Solution:**
- Logout and login with the correct account type
- Clear cookies and localStorage
- Make sure you're using the right login form

### 2. Email Not Verified
**Problem:** Student account exists but email is not verified

**Check:**
- Server logs show: `Verified: false`
- You can see the OTP code in server console

**Solution:**
- Complete email verification with the OTP code
- Check spam folder for verification email
- Use "Resend Code" button
- Use OTP from server console if email doesn't arrive

### 3. Token Expired
**Problem:** JWT token has expired (default: 1 day)

**Check:**
- Visit: `http://localhost:8080/api/debug/auth-status`
- Look for `tokenError: "jwt expired"`

**Solution:**
- Logout and login again
- Token will be refreshed

### 4. Cookie Not Being Sent
**Problem:** Browser not sending cookies due to CORS or SameSite issues

**Check:**
- Open DevTools → Application → Cookies
- Look for `authToken` cookie
- Visit: `http://localhost:8080/api/debug/auth-status`
- Check `hasCookieToken` and `hasHeaderToken`

**Solution:**
- Make sure frontend and backend are on allowed origins
- Check CORS configuration in `backend/server.js`
- For local development, use `http://localhost:5173` (not 127.0.0.1)

### 5. Token Not Stored After Login
**Problem:** Login succeeds but token is not saved

**Check:**
- DevTools → Application → Cookies (look for `authToken`)
- DevTools → Application → Local Storage (look for `user` and `userType`)
- Console logs during login

**Solution:**
- Check if login response includes `token`
- Verify `withCredentials: true` in axios calls
- Clear all cookies and localStorage, then login again

## Debugging Steps

### Step 1: Check Server Logs
Restart your backend with logging enabled:
```bash
cd backend
npm run dev
```

Look for these logs when accessing `/api/students/profile`:
- `🔐 Student Auth - Token present: true/false`
- `🔓 Token decoded: { id: '...', type: '...' }`
- `✅ Student authenticated: email@example.com Verified: true`

### Step 2: Check Auth Status
Visit this debug endpoint in your browser:
```
http://localhost:8080/api/debug/auth-status
```

You should see:
```json
{
  "hasCookieToken": true,
  "hasHeaderToken": false,
  "tokenValid": true,
  "tokenData": {
    "id": "...",
    "type": "student",
    "exp": "2024-..."
  }
}
```

### Step 3: Check Browser Cookies
1. Open DevTools (F12)
2. Go to Application tab
3. Click Cookies → http://localhost:8080
4. Look for `authToken` cookie

If missing:
- Login again
- Check if login response sets the cookie
- Verify CORS allows credentials

### Step 4: Check Frontend Token Handling
Open browser console and run:
```javascript
// Check localStorage
console.log('User:', localStorage.getItem('user'));
console.log('UserType:', localStorage.getItem('userType'));
console.log('Token:', localStorage.getItem('authToken'));

// Check cookies
console.log('Cookies:', document.cookie);
```

### Step 5: Test with cURL
Test the endpoint directly:
```bash
# Replace YOUR_TOKEN with actual token from cookie
curl -X GET http://localhost:8080/api/students/profile \
  -H "Cookie: authToken=YOUR_TOKEN" \
  -v
```

## Quick Fixes

### Fix 1: Clear Everything and Re-login
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### Fix 2: Force Token Refresh
1. Logout
2. Clear browser cache
3. Close all tabs
4. Open new tab and login

### Fix 3: Check Environment Variables
Make sure backend `.env` has:
```
TOKEN_KEY=t7DU1935c_Fy7AEXAqY7bg
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Fix 4: Verify CORS Configuration
In `backend/server.js`, ensure:
```javascript
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
]);
```

## Understanding the Flow

### Successful Authentication Flow:
1. User logs in → POST `/api/students/auth/login`
2. Server validates credentials
3. Server creates JWT token with `{ id, type: "student" }`
4. Server sets cookie: `authToken=...`
5. Server responds with user data
6. Frontend stores user in localStorage
7. Frontend makes request to `/api/students/profile`
8. Browser automatically sends `authToken` cookie
9. Middleware verifies token
10. Middleware checks token type === "student"
11. Middleware fetches student from database
12. Request proceeds to controller

### Where 403 Happens:
- Step 10: Token type mismatch (institute token on student route)
- After Step 11: Student not found or not verified

## Still Having Issues?

1. **Check server console** for detailed error logs
2. **Use debug endpoint**: `http://localhost:8080/api/debug/auth-status`
3. **Check browser DevTools** → Network tab → Look at request headers
4. **Verify token** is being sent in Cookie header
5. **Check token type** matches the route (student vs institute)

## Common Scenarios

### Scenario 1: "I just signed up but can't access profile"
→ You need to verify your email first with the OTP code

### Scenario 2: "I was logged in yesterday, now getting 403"
→ Token expired (1 day), logout and login again

### Scenario 3: "Login works but profile gives 403"
→ Check if you're using institute account on student route

### Scenario 4: "Everything worked in development, fails in production"
→ Check CORS configuration and FRONTEND_URL in production .env
