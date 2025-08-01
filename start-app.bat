@echo off
echo Starting QuickCommerce Application...
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Copying environment file...
copy env.local .env.local

echo.
echo Step 3: Starting Docker services...
call npm run docker:up

echo.
echo Step 4: Generating Prisma client...
call npm run db:generate

echo.
echo Step 5: Pushing database schema...
call npm run db:push

echo.
echo Step 6: Seeding database...
call npm run db:seed

echo.
echo Step 7: Starting development server...
call npm run dev

pause 