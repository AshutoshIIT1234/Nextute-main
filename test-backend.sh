#!/bin/bash

echo "🔍 Testing Nextute Backend Connection"
echo "======================================"
echo ""

# Test if backend is running
echo "1. Testing if backend is running..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/test 2>/dev/null)

if [ "$response" = "200" ]; then
    echo "✅ Backend is running on port 8080"
else
    echo "❌ Backend is NOT running on port 8080"
    echo "   Please start it with: cd backend && npm run dev"
    exit 1
fi

echo ""
echo "2. Testing chatbot endpoint..."

# Test chatbot endpoint
curl -X POST http://localhost:8080/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query":"Hello","conversationHistory":[],"useSemanticSearch":false}' \
  2>/dev/null | python -m json.tool 2>/dev/null || echo "Response received (check format)"

echo ""
echo "======================================"
echo "✅ Backend test complete!"
echo ""
echo "If you see errors above:"
echo "1. Make sure backend is running: cd backend && npm run dev"
echo "2. Check backend/.env has PORT=8080"
echo "3. Check frontend/.env has VITE_BACKEND_BASE_URL=http://localhost:8080"
