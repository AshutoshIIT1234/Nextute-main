#!/bin/bash

echo "🚀 Setting up Mentors in Database"
echo "=================================="

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Create migration
echo "🔄 Creating database migration..."
npx prisma migrate dev --name add_mentor_fields

# Run seed
echo "🌱 Seeding mentor data..."
node prisma/seed-mentors.js

echo "✅ Setup complete!"
echo ""
echo "You can now:"
echo "  - View mentors at: http://localhost:8080/api/mentorship/mentors"
echo "  - Start your backend: npm run dev"
