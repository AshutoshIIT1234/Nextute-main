@echo off
echo 🚀 Setting up Mentors in Database
echo ==================================

REM Generate Prisma Client
echo 📦 Generating Prisma Client...
call npx prisma generate

REM Create migration
echo 🔄 Creating database migration...
call npx prisma migrate dev --name add_mentor_fields

REM Run seed
echo 🌱 Seeding mentor data...
call node prisma/seed-mentors.js

echo ✅ Setup complete!
echo.
echo You can now:
echo   - View mentors at: http://localhost:8080/api/mentorship/mentors
echo   - Start your backend: npm run dev

pause
