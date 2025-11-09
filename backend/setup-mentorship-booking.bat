@echo off
echo ========================================
echo  Setup Mentorship Booking Table
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
cd backend
call npx prisma generate

echo.
echo Step 2: Creating mentorship_bookings table...
call npx prisma db push

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo The mentorship_bookings table has been created.
echo You can now accept mentorship bookings with payment.
echo.
pause
