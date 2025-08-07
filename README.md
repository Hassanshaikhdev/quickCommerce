# QuickCommerce - AI-Powered Grocery Delivery Platform

A full-stack eCommerce application similar to BigBasket, combining traditional eCommerce functionality with an intelligent AI agent for assisted ordering.

## 🚀 Features

### Core eCommerce Features
- **User Authentication & Authorization** - JWT-based auth with role management
- **Product Catalog** - Browse, search, filter, and view products
- **Shopping Cart** - Add, update, remove items with real-time updates
- **Order Management** - Place orders, track status, view history
- **Admin Panel** - Manage products, categories, orders, and users

### AI Agent Features
- **Natural Language Processing** - Parse grocery lists in plain text
- **Smart Product Matching** - Intelligent mapping of text to products
- **Alternative Suggestions** - Suggest similar products when exact matches aren't found
- **Interactive Chat Interface** - Real-time chat with AI assistant
- **Order Confirmation** - Review and confirm orders before placement

### Technical Features
- **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS
- **Database** - MongoDB with Prisma ORM
- **AI Integration** - OpenAI GPT-4 for natural language processing
- **Real-time Updates** - WebSocket support for live updates
- **Responsive Design** - Mobile-first approach
- **Type Safety** - Full TypeScript implementation

## 🏗️ Architecture

```
quickCommerce/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── api/         # API routes
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── catalog/     # Product catalog
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── agent/       # AI agent interface
│   │   │   └── ...
│   │   ├── components/      # Reusable components
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript types
├── backend/                 # Backend services
├── prisma/                 # Database schema and migrations
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **UI Components**: Custom components + Lucide React icons
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API routes
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT
- **AI**: OpenAI GPT-4

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + Testing Library
- **Database**: MongoDB (local/cloud)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quickcommerce.git
   cd quickcommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="mongodb://localhost:27017/quickcommerce"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # JWT
   JWT_SECRET="your-jwt-secret"
   
   # App
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 📊 Database Schema

### Core Entities
- **User** - Customers, admins, store managers, agents
- **Store** - Physical stores with inventory
- **Category** - Product categories with hierarchy
- **InventoryItem** - Products with pricing, stock, images
- **CartItem** - Shopping cart items
- **Order** - Customer orders with status tracking
- **OrderItem** - Individual items in orders
- **BotSession** - AI agent conversation sessions
- **BotMessage** - Messages in bot conversations

### Key Relationships
- Users can have multiple orders and cart items
- Stores have categories and inventory items
- Categories can have parent-child relationships
- Orders contain multiple order items
- Bot sessions are linked to users and orders

## 🤖 AI Agent Features

### Natural Language Processing
The AI agent can understand and parse grocery lists in natural language:

**Example Inputs:**
- "I need 2 packets of Aashirvaad atta, 1 litre Amul milk, and 5 bananas"
- "Get me 3 bottles of Bisleri, 2 bread packets, and 6 eggs"
- "Order 1 kg tomatoes, 500g onions, and 2 kg potatoes"

**Features:**
- Quantity and unit extraction
- Brand name recognition
- Fuzzy matching for similar products
- Alternative suggestions
- Confidence scoring

### Smart Matching Algorithm
1. **Exact Match** - Direct name/brand matching
2. **Fuzzy Match** - Similar product names
3. **Category Match** - Products in same category
4. **Alternative Suggestions** - Similar products when exact match not found

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue, secondary colors
- **Typography**: Inter font family
- **Components**: Consistent design patterns
- **Responsive**: Mobile-first approach

### Key Pages
- **Home** - Landing page with features
- **Catalog** - Product browsing with filters
- **Product Details** - Individual product view
- **Cart** - Shopping cart management
- **Checkout** - Order placement
- **AI Agent** - Chat interface for ordering
- **Orders** - Order history and tracking

## 🔐 Authentication & Authorization

### User Roles
- **CUSTOMER** - Browse, order, manage profile
- **ADMIN** - Full system access
- **STORE_MANAGER** - Manage store inventory
- **DELIVERY_AGENT** - Order delivery
- **AGENT** - AI assistant

### Security Features
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Protected API routes
- Session management

## 📈 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get product details
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item
- `GET /api/cart/count` - Get cart count

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details

### AI Agent
- `POST /api/bot/parse` - Parse order request
- `POST /api/bot/order` - Create order via bot

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API endpoint tests
- **E2E Tests**: Full user journey tests

## 🚀 Deployment

### Production Build
```bash
# Build application
npm run build

# Start production server
npm start
```

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection string
- OpenAI API key
- JWT secrets
- Application URLs

### Deployment Platforms
- **Vercel** - Recommended for Next.js
- **Netlify** - Alternative option
- **AWS** - For custom infrastructure
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use consistent code formatting
- Write meaningful commit messages
- Add documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🔄 Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Core eCommerce functionality
- AI agent integration
- Responsive design
- TypeScript implementation

---

**QuickCommerce** - Making grocery shopping smarter with AI! 🛒🤖
