# QuickCommerce - AI-Powered Quick Commerce Platform

A full-stack quick commerce application similar to Zepto and Blinkit, featuring an internal AI bot for order processing.

## 🏗️ Project Structure

```
quickCommerce/
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # App Router pages & API routes
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities & services
│   │   └── types/          # TypeScript type definitions
│   ├── next.config.js      # Next.js configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── postcss.config.js   # PostCSS configuration
├── backend/                 # Backend services
│   ├── prisma/             # Database schema & migrations
│   │   ├── schema.prisma   # MongoDB schema
│   │   └── seed.ts         # Database seeding script
│   └── services/           # Business logic services
├── bot/                    # AI bot services
│   └── bot-service.ts      # Bot processing logic
├── package.json            # Root dependencies & scripts
├── docker-compose.yml      # Docker services configuration
├── Dockerfile              # Application container
├── mongo-init.js           # MongoDB initialization script
├── env.local               # Environment variables template
├── start-app.bat           # Windows batch file for easy startup
├── start-app.ps1           # PowerShell script for easy startup
└── README.md               # This file
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 🎯 **EASY STARTUP METHODS**

#### **Method 1: Use the Batch File (Recommended for Windows)**
```bash
# Simply double-click or run:
start-app.bat
```

#### **Method 2: Use the PowerShell Script**
```bash
# Run in PowerShell:
.\start-app.ps1
```

#### **Method 3: Manual Commands**
**All commands should be run from: `C:\Users\Hassan\Documents\Desktop\quickCommerce`**

##### **Step 1: Fix PowerShell Execution Policy (if needed)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

##### **Step 2: Install Dependencies**
```bash
npm install
```

##### **Step 3: Set up Environment Variables**
```bash
copy env.local .env.local
```

##### **Step 4: Start Database Services (Docker)**
```bash
npm run docker:up
```

##### **Step 5: Generate Prisma Client**
```bash
npm run db:generate
```

##### **Step 6: Push Database Schema to MongoDB**
```bash
npm run db:push
```

##### **Step 7: Seed Database with Sample Data**
```bash
npm run db:seed
```

##### **Step 8: Start Development Server**
```bash
npm run dev
```

## 🎯 What You'll Get

After following the steps above:

- ✅ **Frontend**: Next.js 14 app running on `http://localhost:3000`
- ✅ **Backend**: API routes working with MongoDB
- ✅ **Database**: MongoDB with sample data
- ✅ **Bot**: AI-powered order processing
- ✅ **Authentication**: JWT-based auth system

## 🔑 Test Credentials

Use these credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@quickcommerce.com` | `password123` |
| **Store Manager** | `manager@quickcommerce.com` | `password123` |
| **AI Bot Agent** | `bot@quickcommerce.com` | `password123` |
| **Customer** | `customer@quickcommerce.com` | `password123` |
| **Delivery Agent** | `delivery@quickcommerce.com` | `password123` |

## 📱 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `http://localhost:3000` | Landing page with features |
| **Demo** | `http://localhost:3000/demo` | AI bot interface demo |
| **Login** | `http://localhost:3000/auth/login` | User authentication |
| **Register** | `http://localhost:3000/auth/register` | User registration |

## 🐳 Docker Services

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| **MongoDB** | 27017 | `mongodb://localhost:27017` | - |
| **Redis** | 6379 | `redis://localhost:6379` | - |
| **Mongo Express** | 8081 | `http://localhost:8081` | `admin/admin` |
| **Next.js App** | 3000 | `http://localhost:3000` | - |

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. PowerShell Execution Policy Error
```powershell
# Fix execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use the batch file instead
start-app.bat
```

#### 2. CSS/Tailwind Errors
```bash
# If you see CSS errors, they're already fixed in the latest version
# The globals.css file now uses standard Tailwind classes
```

#### 3. Database Connection Error
```bash
# Check if MongoDB is running
docker ps

# If not running, restart services
npm run docker:down
npm run docker:up
```

#### 4. Port Already in Use
```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :27017
netstat -ano | findstr :6379

# Kill the process if needed
taskkill /PID <process_id> /F
```

#### 5. Environment Variables Missing
```bash
# Ensure .env.local exists
dir .env.local

# If missing, copy from template
copy env.local .env.local
```

#### 6. Dependencies Issues
```bash
# Clear node_modules and reinstall
rmdir /s node_modules
del package-lock.json
npm install
```

#### 7. Prisma Issues
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database
npm run docker:down
npm run docker:up
npm run db:push
npm run db:seed
```

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start development server |
| **Build** | `npm run build` | Build for production |
| **Start** | `npm run start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint |
| **Type Check** | `npm run type-check` | Run TypeScript check |
| **Database Generate** | `npm run db:generate` | Generate Prisma client |
| **Database Push** | `npm run db:push` | Push schema to database |
| **Database Seed** | `npm run db:seed` | Seed database with data |
| **Database Studio** | `npm run db:studio` | Open Prisma Studio |
| **Docker Up** | `npm run docker:up` | Start Docker services |
| **Docker Down** | `npm run docker:down` | Stop Docker services |
| **Docker Logs** | `npm run docker:logs` | View Docker logs |

## 🏗️ Architecture

### Frontend (`frontend/`)
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for forms
- **Zod** for validation

### Backend (`backend/`)
- **Prisma ORM** for database operations
- **MongoDB** as the database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for API validation

### Bot (`bot/`)
- **OpenAI GPT-4** for natural language processing
- **Custom parsing logic** for order extraction
- **Inventory matching** algorithms
- **Order confirmation** workflows

## 🔧 Development

### Adding New Features

1. **Frontend Components**: Add to `frontend/src/components/`
2. **API Routes**: Add to `frontend/src/app/api/`
3. **Database Models**: Update `backend/prisma/schema.prisma`
4. **Bot Logic**: Update `bot/bot-service.ts`

### Database Changes

```bash
# After modifying schema.prisma
npm run db:generate
npm run db:push
```

### Environment Variables

Update `.env.local` for local development:
```env
DATABASE_URL="mongodb://quickcommerce_user:quickcommerce_password@localhost:27017/quickcommerce?authSource=quickcommerce"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

### Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎉 Success!

Your QuickCommerce application is now running with:
- ✅ AI-powered bot for order processing
- ✅ MongoDB database with sample data
- ✅ JWT authentication system
- ✅ Modern React/Next.js frontend
- ✅ Modular architecture (frontend/backend/bot)
- ✅ Docker containerization
- ✅ Complete development environment
- ✅ Fixed CSS/Tailwind issues
- ✅ Easy startup scripts

**🎯 Just run `start-app.bat` or follow the manual steps above, and your application will be working perfectly!** 🚀
