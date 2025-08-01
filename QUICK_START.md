# QuickCommerce - Quick Start Guide

## 🚀 Complete Setup Commands

Follow these commands **exactly in order** to get the application running:

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
```bash
# Copy the environment file
copy env.local .env.local
```

### 3. Start MongoDB and Redis (Docker)
```bash
# Start the database services
npm run docker:up
```

### 4. Generate Prisma Client
```bash
# Generate Prisma client for MongoDB
npm run db:generate
```

### 5. Push Database Schema
```bash
# Push the schema to MongoDB
npm run db:push
```

### 6. Seed the Database
```bash
# Populate with sample data
npm run db:seed
```

### 7. Start the Development Server
```bash
# Start the Next.js application
npm run dev
```

## 🎯 What You'll Get

After running these commands, you'll have:

- ✅ **Frontend**: Next.js 14 app running on `http://localhost:3000`
- ✅ **Backend**: API routes working with MongoDB
- ✅ **Database**: MongoDB with sample data
- ✅ **Bot**: AI-powered order processing
- ✅ **Authentication**: JWT-based auth system

## 🔑 Test Credentials

Use these credentials to test the application:

- **Admin**: `admin@quickcommerce.com` / `password123`
- **Manager**: `manager@quickcommerce.com` / `password123`
- **Agent**: `bot@quickcommerce.com` / `password123`
- **Customer**: `customer@quickcommerce.com` / `password123`
- **Delivery**: `delivery@quickcommerce.com` / `password123`

## 📱 Available Pages

- **Home**: `http://localhost:3000`
- **Demo**: `http://localhost:3000/demo`
- **Login**: `http://localhost:3000/auth/login`
- **Register**: `http://localhost:3000/auth/register`

## 🛠️ Troubleshooting

If you encounter issues:

1. **Database Connection**: Make sure MongoDB is running (`docker ps`)
2. **Port Conflicts**: Check if ports 3000, 27017, 6379 are available
3. **Environment**: Ensure `.env.local` exists with correct values
4. **Dependencies**: Run `npm install` again if needed

## 🐳 Docker Services

- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`
- **Mongo Express**: `http://localhost:8081` (admin/admin)
- **App**: `http://localhost:3000`

## 📁 Project Structure

```
quickCommerce/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/      # Utilities
│   │   └── types/    # TypeScript types
│   └── config files
├── backend/          # Backend services
│   ├── prisma/      # Database schema & seed
│   └── services/    # Business logic
├── bot/             # AI bot services
└── root config files
```

## 🎉 Success!

Your QuickCommerce application should now be running with:
- AI-powered bot for order processing
- MongoDB database with sample data
- JWT authentication
- Modern React/Next.js frontend
- Modular architecture (frontend/backend/bot) 