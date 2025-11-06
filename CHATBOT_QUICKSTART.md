# 🤖 Chatbot Quick Start

## What's Been Added

✅ **Backend RAG System**
- `backend/controllers/chatbotController.js` - Basic version (keyword search)
- `backend/controllers/chatbotControllerAdvanced.js` - Advanced version (OpenAI + semantic search)
- `backend/routes/chatbotRoutes.js` - API endpoints
- Knowledge base with institutes, FAQs, and platform info

✅ **Frontend Chat Widget**
- `frontend/src/components/ChatBot.jsx` - Beautiful animated chat interface
- Floating chat button (bottom-right corner)
- Real-time messaging
- Quick question suggestions
- Mobile responsive

✅ **Documentation**
- `CHATBOT_SETUP.md` - Complete setup guide
- `setup-chatbot.sh` - Automated setup script

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install openai

# Frontend  
cd ../frontend
npm install axios framer-motion
```

### 2. Configure Environment

**backend/.env:**
```env
OPENAI_API_KEY=your_key_here  # Optional - for advanced features
PORT=3000
```

**frontend/.env:**
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Start the App

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Test It Out

1. Open http://localhost:5173
2. Click the chat button (bottom-right corner)
3. Try asking:
   - "How do I find coaching institutes?"
   - "Tell me about mentorship programs"
   - "What are the fees?"

## Two Versions Available

### Basic Version (Active by default)
- ✅ No API key needed
- ✅ Keyword-based search
- ✅ Fast responses
- ✅ Works offline

### Advanced Version (Optional)
- 🚀 OpenAI GPT-3.5 integration
- 🚀 Semantic search
- 🚀 More intelligent responses
- 🚀 Context-aware conversations

**To switch to advanced:**
```bash
cd backend/controllers
mv chatbotController.js chatbotController.basic.js
mv chatbotControllerAdvanced.js chatbotController.js
# Add OPENAI_API_KEY to backend/.env
```

## Features

- 💬 Real-time chat interface
- 🎨 Beautiful animations (Framer Motion)
- 📱 Mobile responsive
- 🔍 Smart search (keyword or semantic)
- 💾 Conversation history
- ⚡ Quick question suggestions
- 🎯 Context-aware responses
- 🔄 Auto-refresh knowledge base

## Knowledge Base Includes

- 🏫 All coaching institutes from database
- 📚 Platform features and services
- 👨‍🏫 Mentorship program details
- 💰 Pricing information
- 📝 Registration guides
- 🔍 Search and comparison help
- ⭐ Review system info

## API Endpoints

```
POST /api/chat/query
- Send chat messages
- Get AI responses

POST /api/chat/refresh
- Refresh knowledge base
- Update institute data
```

## Troubleshooting

**Chat button not showing?**
- Check browser console for errors
- Verify ChatBot is imported in App.jsx
- Clear browser cache

**No responses?**
- Ensure backend is running on port 3000
- Check VITE_BACKEND_URL in frontend/.env
- Verify /api/chat/query endpoint works

**OpenAI errors?**
- Check API key is valid
- Verify you have credits
- Switch to basic version if needed

## Cost (Advanced Version)

Using OpenAI:
- ~$0.00125 per query
- ~$1.25 per 1000 queries
- Very affordable for most use cases

## Next Steps

1. ✅ Test the chatbot
2. 📝 Customize quick questions
3. 🎨 Adjust colors/styling
4. 📊 Add analytics
5. 🚀 Deploy to production

## Need Help?

- 📖 Full docs: `CHATBOT_SETUP.md`
- 💬 Contact: contact@nextute.com
- 🐛 Issues: Create GitHub issue

---

**Made with ❤️ for Nextute EdTech**
