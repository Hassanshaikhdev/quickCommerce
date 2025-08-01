# QuickCommerce Application Startup Script
# This script bypasses execution policy to run the application

Write-Host "Starting QuickCommerce Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
& npm install

Write-Host ""
Write-Host "Step 2: Copying environment file..." -ForegroundColor Yellow
Copy-Item env.local .env.local -Force

Write-Host ""
Write-Host "Step 3: Starting Docker services..." -ForegroundColor Yellow
& npm run docker:up

Write-Host ""
Write-Host "Step 4: Generating Prisma client..." -ForegroundColor Yellow
& npm run db:generate

Write-Host ""
Write-Host "Step 5: Pushing database schema..." -ForegroundColor Yellow
& npm run db:push

Write-Host ""
Write-Host "Step 6: Seeding database..." -ForegroundColor Yellow
& npm run db:seed

Write-Host ""
Write-Host "Step 7: Starting development server..." -ForegroundColor Yellow
& npm run dev

Write-Host ""
Write-Host "Application should now be running at http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan 