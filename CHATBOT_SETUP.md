# RAG Chatbot Setup Guide

## Overview
The Nextute chatbot is a RAG (Retrieval-Augmented Generation) AI assistant that helps users find coaching institutes, learn about mentorship programs, and navigate the platform.

## Features
- ✅ Real-time chat interface with smooth animations
- ✅ Context-aware responses using RAG architecture
- ✅ Knowledge base with institute data and FAQs
- ✅ OpenAI integration for intelligent responses
- ✅ Fallback to keyword search when OpenAI is unavailable
- ✅ Conversation history tracking
- ✅ Quick question suggestions
- ✅ Mobile responsive design

## Architecture

### Backend (RAG System)
1. **Knowledge Base**: Stores information about institutes, services, FAQs
2. **Retrieval**: Searches knowledge base using semantic or keyword search
3. **Generation**: Uses OpenAI GPT-3.5 to generate contextual responses

### Frontend
- React component with Framer Motion animations
- Real-time message streaming
- Conversation history management

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install openai
```

#### Frontend
```bash
cd frontend
npm install axios framer-motion
```

### 2. Environment Variables

Add to `backend/.env`:
```env
# Optional: For advanced semantic search and better responses
OPENAI_API_KEY=your_openai_api_key_here

# Required: Backend URL
PORT=3000
```

Add to `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Choose Controller Version

#### Option A: Basic Version (No OpenAI required)
Uses keyword-based search and simple responses.

```bash
# Already active in chatbotController.js
# No additional setup needed
```

#### Option B: Advanced Version (OpenAI required)
Uses semantic search and GPT-3.5 for intelligent responses.

```bash
# Rename the advanced controller
cd backend/controllers
mv chatbotController.js chatbotController.basic.js
mv chatbotControllerAdvanced.js chatbotController.js
```

### 4. Start the Application

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Usage

### For Users
1. Click the chat button in the bottom-right corner
2. Type your question or select a quick question
3. Get instant responses about institutes, mentorship, and platform features

### Example Questions
- "How do I find coaching institutes in Delhi?"
- "Tell me about mentorship programs"
- "What are the fees for premium mentorship?"
- "How to register as a student?"
- "Compare institutes in my area"

## API Endpoints

### POST /api/chat/query
Send a chat query and get a response.

**Request:**
```json
{
  "query": "How do I find coaching institutes?",
  "conversationHistory": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ],
  "useSemanticSearch": true
}
```

**Response:**
```json
{
  "answer": "You can find coaching institutes by...",
  "sources": [
    { "type": "faq", "category": "search" }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### POST /api/chat/refresh
Refresh the knowledge base (admin only).

**Response:**
```json
{
  "message": "Knowledge base refreshed successfully",
  "entries": 25
}
```

## Customization

### Adding New Knowledge
Edit `backend/controllers/chatbotController.js` or `chatbotControllerAdvanced.js`:

```javascript
const websiteInfo = [
  {
    type: 'custom',
    content: 'Your custom information here',
    metadata: { category: 'custom', priority: 'high' }
  },
  // ... more entries
];
```

### Styling the Chat Widget
Edit `frontend/src/components/ChatBot.jsx`:

```jsx
// Change colors
className="bg-gradient-to-r from-primary to-secondary"

// Change size
className="w-96 h-[600px]"

// Change position
className="fixed bottom-6 right-6"
```

### Modifying Quick Questions
```jsx
const quickQuestions = [
  "Your custom question 1",
  "Your custom question 2",
  // ... more questions
];
```

## Knowledge Base Structure

The chatbot knows about:

1. **Institutes**
   - Names, locations, courses
   - Fees, ratings, facilities
   - Contact information

2. **Services**
   - Institute discovery
   - Mentorship programs
   - Reviews and comparisons

3. **Mentorship**
   - Pro Plan (₹1,000)
   - Premium Plan (₹1,500)
   - Features and benefits

4. **Registration**
   - Student registration
   - Institute registration
   - Account management

5. **Platform Features**
   - Search and filters
   - Comparison tool
   - Review system

## Troubleshooting

### Chatbot not responding
1. Check backend is running: `http://localhost:3000/test`
2. Verify VITE_BACKEND_URL in frontend/.env
3. Check browser console for errors

### OpenAI errors
1. Verify OPENAI_API_KEY is set correctly
2. Check API key has credits
3. Fallback to basic version if needed

### Knowledge base empty
1. Ensure database has institute data
2. Run: `POST /api/chat/refresh`
3. Check backend logs for initialization errors

### CORS errors
1. Verify FRONTEND_URL in backend/.env
2. Check CORS configuration in server.js
3. Ensure credentials are enabled

## Performance Optimization

### For Production

1. **Cache Embeddings**
   ```javascript
   // Store embeddings in database instead of generating on-the-fly
   const cachedEmbedding = await prisma.embedding.findUnique({
     where: { content: item.content }
   });
   ```

2. **Use Vector Database**
   - Pinecone
   - Weaviate
   - PostgreSQL with pgvector

3. **Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const chatLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 50 // limit each IP to 50 requests per windowMs
   });
   
   router.post('/query', chatLimiter, handleChatQuery);
   ```

4. **Response Caching**
   ```javascript
   // Cache common questions
   const cache = new Map();
   if (cache.has(query)) {
     return cache.get(query);
   }
   ```

## Cost Estimation (OpenAI)

### GPT-3.5-turbo
- Input: $0.0015 / 1K tokens
- Output: $0.002 / 1K tokens
- Average query: ~500 tokens = $0.00125

### text-embedding-3-small
- $0.00002 / 1K tokens
- Average embedding: ~100 tokens = $0.000002

**Estimated cost for 1000 queries: ~$1.25**

## Security Considerations

1. **API Key Protection**
   - Never commit .env files
   - Use environment variables
   - Rotate keys regularly

2. **Rate Limiting**
   - Prevent abuse
   - Limit requests per IP
   - Implement user-based limits

3. **Input Validation**
   - Sanitize user input
   - Limit message length
   - Filter malicious content

4. **Authentication**
   - Consider requiring login for chat
   - Track usage per user
   - Implement abuse detection

## Future Enhancements

- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Image understanding
- [ ] Booking integration
- [ ] Analytics dashboard
- [ ] A/B testing
- [ ] Sentiment analysis
- [ ] Proactive suggestions

## Support

For issues or questions:
- Email: contact@nextute.com
- GitHub: Create an issue
- Documentation: Check this file

## License

Proprietary - Nextute EdTech Pvt. Ltd.
