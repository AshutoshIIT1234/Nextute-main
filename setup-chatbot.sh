#!/bin/bash

echo "🤖 Nextute RAG Chatbot Setup"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Nextute-main directory"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install openai
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install axios framer-motion
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🔧 Checking environment variables..."

# Check backend .env
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating template..."
    cat > backend/.env << EOF
# Database
DATABASE_URL="your_database_url"

# Server
PORT=3000
NODE_ENV=development

# OpenAI (Optional - for advanced chatbot features)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ Created backend/.env template"
else
    echo "✅ backend/.env exists"
fi

# Check frontend .env
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env not found. Creating template..."
    cat > frontend/.env << EOF
# Backend URL
VITE_BACKEND_URL=http://localhost:3000
EOF
    echo "✅ Created frontend/.env template"
else
    echo "✅ frontend/.env exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env and add your OPENAI_API_KEY (optional)"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 and click the chat button!"
echo ""
echo "📚 For more information, see CHATBOT_SETUP.md"
