# 🔧 Chatbot Troubleshooting Guide

## Issue: Responses Not Generating

If the chatbot is not responding, follow these steps:

### Step 1: Check Backend is Running

**Windows:**
```bash
test-backend.bat
```

**Mac/Linux:**
```bash
chmod +x test-backend.sh
./test-backend.sh
```

Or manually check:
```bash
curl http://localhost:8080/test
```

**Expected Response:**
```json
{"status":true,"message":"Server is running!"}
```

### Step 2: Verify Environment Variables

**Backend (.env):**
```env
PORT=8080
DATABASE_URL=your_database_url
```

**Frontend (.env):**
```env
VITE_BACKEND_BASE_URL=http://localhost:8080
```

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors when sending a message
4. Check Network tab for failed requests

**Common Errors:**

#### Error: "ERR_NETWORK" or "Network Error"
**Cause:** Backend is not running
**Solution:**
```bash
cd backend
npm run dev
```

#### Error: "404 Not Found"
**Cause:** Chatbot routes not registered
**Solution:** Verify `server.js` has:
```javascript
app.use('/api/chat', chatbotRoutes);
```

#### Error: "CORS Error"
**Cause:** Frontend URL not allowed
**Solution:** Add to `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Step 4: Test Chatbot Endpoint Manually

**Using curl:**
```bash
curl -X POST http://localhost:8080/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query":"Hello","conversationHistory":[],"useSemanticSearch":false}'
```

**Using Postman:**
- Method: POST
- URL: http://localhost:8080/api/chat/query
- Headers: Content-Type: application/json
- Body (raw JSON):
```json
{
  "query": "How do I find coaching institutes?",
  "conversationHistory": [],
  "useSemanticSearch": false
}
```

**Expected Response:**
```json
{
  "answer": "You can find coaching institutes by...",
  "sources": [...],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Step 5: Check Database Connection

The chatbot needs database access to load institute data.

**Test:**
```bash
cd backend
node -e "import('./db/index.js').then(db => console.log('DB Connected'))"
```

### Step 6: Restart Everything

Sometimes a fresh start helps:

```bash
# Stop all processes (Ctrl+C in terminals)

# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

### Step 7: Check Logs

**Backend logs:**
Look for:
- "✅ Knowledge base initialized with X entries"
- Any error messages

**Frontend logs:**
Open browser console and look for:
- "Sending request to: http://localhost:8080/api/chat/query"
- "Response received: {...}"
- Any error messages

## Common Issues & Solutions

### Issue: "Knowledge base empty"

**Symptoms:** Chatbot says it doesn't have information

**Solution:**
```bash
# Refresh knowledge base
curl -X POST http://localhost:8080/api/chat/refresh
```

### Issue: "Slow responses"

**Cause:** Using OpenAI without API key

**Solution:** 
1. Add `OPENAI_API_KEY` to backend/.env
2. Or set `useSemanticSearch: false` in ChatBot.jsx

### Issue: "Chat button not visible"

**Cause:** ChatBot component not rendered

**Solution:** Verify in `App.jsx`:
```jsx
import ChatBot from "./components/ChatBot";

// Inside return statement
<ChatBot />
```

### Issue: "Logo not showing"

**Cause:** Logo path incorrect

**Solution:** Verify logo exists at:
```
frontend/src/assets/logo.svg
```

## Debug Mode

Enable detailed logging in ChatBot.jsx:

```jsx
// Already added - check browser console for:
console.log('Sending request to:', url);
console.log('Response received:', response.data);
console.error('Chat error details:', error);
```

## Still Not Working?

1. **Check all services are running:**
   - Backend: http://localhost:8080/test
   - Frontend: http://localhost:5173
   - Database: Connected

2. **Verify file structure:**
   ```
   backend/
     controllers/
       chatbotController.js ✓
     routes/
       chatbotRoutes.js ✓
     server.js ✓
   
   frontend/
     src/
       components/
         ChatBot.jsx ✓
       App.jsx ✓
   ```

3. **Check dependencies installed:**
   ```bash
   # Backend
   cd backend
   npm list openai axios
   
   # Frontend
   cd frontend
   npm list axios framer-motion
   ```

4. **Clear cache and restart:**
   ```bash
   # Frontend
   cd frontend
   rm -rf node_modules/.vite
   npm run dev
   ```

## Getting Help

If you're still having issues:

1. Run the test script: `test-backend.bat` or `test-backend.sh`
2. Check browser console for errors
3. Check backend terminal for errors
4. Share error messages for support

## Quick Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Database connected
- [ ] Environment variables set correctly
- [ ] ChatBot component imported in App.jsx
- [ ] No CORS errors in console
- [ ] Knowledge base initialized
- [ ] Test endpoint returns 200

## Contact

For additional support:
- Email: contact@nextute.com
- Check: CHATBOT_SETUP.md
- Check: CHATBOT_QUICKSTART.md
