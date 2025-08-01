@echo off
echo Starting QuickCommerce Application (Frontend Only)...
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Copying environment file...
copy env.local .env.local

echo.
echo Step 3: Starting development server...
call npm run dev

echo.
echo Application should now be running at http://localhost:3000
echo Note: This is frontend only. For full functionality, install Docker and use start-app.bat
pause 