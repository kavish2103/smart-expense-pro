# Smart Expense Pro - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture & Flow](#architecture--flow)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Key Technical Decisions](#key-technical-decisions)
8. [Challenges Solved](#challenges-solved)
9. [Setup & Deployment](#setup--deployment)
10. [Interview Talking Points](#interview-talking-points)

---

## 🎯 Project Overview

**Smart Expense Pro** is a full-stack web application designed to help Indian students and young professionals track their expenses, manage budgets, and get AI-powered financial insights. The application emphasizes privacy-first design, requiring no bank login or card details.

### Problem Statement
Managing personal finances is challenging for students and young professionals who need:
- Simple expense tracking without complex bank integrations
- Budget management with visual insights
- AI-powered spending advice
- Real-time notifications for budget thresholds

### Solution
A modern, responsive web application with:
- Manual expense entry with categorization
- Budget tracking per category
- AI-powered financial insights using OpenAI and Google Gemini
- Real-time dashboard with charts and analytics
- Smart notifications for budget alerts

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.11.0
- **HTTP Client**: Axios 1.13.2
- **Charts**: 
  - Chart.js 4.5.1
  - React-Chartjs-2 5.3.1
  - Recharts 3.6.0
- **Icons**: Lucide React 0.562.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Language**: TypeScript 5.9.3
- **ORM**: Prisma 6.19.1
- **Database**: PostgreSQL (via Supabase/Neon)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **Validation**: Zod 4.2.1
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Rate Limiting**: express-rate-limit 8.2.1
- **CORS**: cors 2.8.5

### AI Services
- **OpenAI API**: For spending advice and insights (gpt-4o-mini)
- **Google Gemini API**: For alternative AI insights

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel Serverless Functions
- **Database**: PostgreSQL (Supabase/Neon/Railway)

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code quality
- **Prisma Migrations**: Database version control
- **Git**: Version control

---

## ✨ Features

### 1. User Authentication & Authorization
- **User Registration**: Email-based signup with password hashing
- **User Login**: JWT token-based authentication
- **Password Management**: Change password functionality
- **Profile Management**: Update name and email
- **Protected Routes**: Client-side route protection
- **Token Management**: Automatic token refresh and logout

### 2. Expense Management
- **Create Expenses**: Add expenses with title, amount, category, and date
- **View Expenses**: Paginated list with filtering options
- **Update Expenses**: Edit existing expense entries
- **Delete Expenses**: Remove expense entries
- **Filtering**: Filter by category, date range, amount range
- **Pagination**: Efficient data loading with page-based pagination

### 3. Budget Management
- **Set Budgets**: Create monthly budgets per category
- **Budget Tracking**: Real-time tracking of spending vs. budget
- **Budget Alerts**: Automatic notifications when approaching/exceeding limits
- **Budget Progress**: Visual progress bars showing budget utilization
- **Multi-Category Budgets**: Support for multiple budget categories simultaneously

### 4. Dashboard & Analytics
- **Summary Cards**: 
  - Total spending this month
  - Percentage change from last month
  - Highest spending category
  - Average daily spending
- **Charts & Visualizations**:
  - Spending trends (last 7 days)
  - Category-wise breakdown
  - Budget vs. actual spending
- **Budget Overview**: 
  - Total budget limit
  - Remaining budget
  - Per-category budget status

### 5. AI-Powered Insights
- **Spending Advice**: AI-generated personalized financial advice using OpenAI
- **Insight History**: Store and view past AI insights
- **Smart Categorization**: AI-assisted expense categorization
- **Fallback System**: Mock advice when AI API is unavailable

### 6. Notifications System
- **Real-time Notifications**: 
  - High expense alerts
  - Budget threshold warnings
  - Frequent spending alerts
- **Notification Types**: INFO, WARNING, SUCCESS
- **Mark as Read**: Individual and bulk read status management
- **Notification Dropdown**: Quick access from navigation bar

### 7. Additional Features
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Dark/Light Theme Support**: Modern UI with consistent styling
- **Error Handling**: Comprehensive error handling on both client and server
- **Loading States**: User-friendly loading indicators
- **Form Validation**: Client and server-side validation using Zod

---

## 🏗 Architecture & Flow

### Project Structure
```
smart-expense-pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable React components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   └── vercel.json         # Vercel deployment config
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── api/           # Vercel serverless entry point
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── routes/        # API route definitions
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── services/      # Business logic (AI)
│   │   └── utils/         # Utility functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── vercel.json        # Vercel serverless config
│
└── docs/                   # Documentation
```

### Application Flow

#### 1. Authentication Flow
```
User Registration/Login
    ↓
Server validates credentials
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
Token attached to all API requests (via Axios interceptor)
    ↓
Protected routes check token validity
```

#### 2. Expense Creation Flow
```
User fills expense form
    ↓
Client-side validation (Zod)
    ↓
POST /api/expenses
    ↓
Server validates (Zod schema + auth middleware)
    ↓
Expense saved to database (Prisma)
    ↓
Smart checks triggered:
    - Budget threshold check
    - Frequent spending check
    ↓
Notifications created if thresholds exceeded
    ↓
Response sent to client
    ↓
Dashboard refreshes with new data
```

#### 3. Dashboard Data Flow
```
User navigates to Dashboard
    ↓
GET /api/dashboard/stats
    ↓
Server aggregates data:
    - Total expenses (this month)
    - Category-wise spending
    - Budget status
    - Spending trends
    ↓
Data formatted and sent
    ↓
Client renders:
    - Summary cards
    - Charts (Chart.js/Recharts)
    - Budget cards
```

#### 4. AI Insights Flow
```
User requests AI advice
    ↓
GET /api/ai/insights
    ↓
Server fetches spending data
    ↓
Data sent to OpenAI API
    ↓
AI generates personalized advice
    ↓
Insight saved to database
    ↓
Response sent to client
    ↓
Displayed in AI Advisor card
```

### Request Flow (Server)
```
Incoming Request
    ↓
CORS Middleware (handles preflight)
    ↓
JSON Parser
    ↓
Logger Middleware
    ↓
Rate Limiter (skips OPTIONS)
    ↓
Route Handler
    ↓
Auth Middleware (if protected)
    ↓
Validation Middleware (Zod)
    ↓
Controller
    ↓
Service/Utils (if needed)
    ↓
Database (Prisma)
    ↓
Response
    ↓
Error Handler (if error)
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/change-password` | Change password | Yes |
| PATCH | `/api/auth/profile` | Update profile | Yes |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/expenses` | Get expenses (with pagination & filters) | Yes |
| POST | `/api/expenses` | Create expense | Yes |
| PUT | `/api/expenses/:id` | Update expense | Yes |
| DELETE | `/api/expenses/:id` | Delete expense | Yes |

**Query Parameters for GET:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |

**Response includes:**
- Summary (total spent, percentage change, highest category, avg daily)
- Trend data (last 7 days)
- Budget status (per category)

### Budgets (`/api/budgets`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/budgets` | Get all budgets | Yes |
| POST | `/api/budgets` | Create/update budget | Yes |

### AI (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ai/insights` | Get AI spending advice | Yes |
| GET | `/api/ai/history` | Get AI insights history | Yes |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all notifications | Yes |
| POST | `/api/notifications/:id/read` | Mark notification as read | Yes |
| POST | `/api/notifications/read-all` | Mark all as read | Yes |

### Health (`/health`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |

---

## 🗄 Database Schema

### Models

#### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String   // Hashed with bcrypt
  createdAt DateTime @default(now())
  
  expenses      Expense[]
  notifications Notification[]
  budgets       Budget[]
  aiInsights    AIInsight[]
}
```

#### Expense
```prisma
model Expense {
  id        String   @id @default(uuid())
  title     String
  amount    Float
  category  String
  createdAt DateTime @default(now())
  
  userId String?
  user   User?   @relation(fields: [userId], references: [id])
}
```

#### Budget
```prisma
model Budget {
  id        String   @id @default(uuid())
  category  String
  amount    Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@unique([userId, category])  // One budget per category per user
}
```

#### Notification
```prisma
model Notification {
  id        String   @id @default(uuid())
  title     String
  message   String
  type      String   // INFO, WARNING, SUCCESS
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

#### AIInsight
```prisma
model AIInsight {
  id        String   @id @default(uuid())
  summary   String
  createdAt DateTime @default(now())
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

### Relationships
- **User → Expenses**: One-to-Many
- **User → Budgets**: One-to-Many
- **User → Notifications**: One-to-Many
- **User → AIInsights**: One-to-Many

---

## 🔑 Key Technical Decisions

### 1. **Monorepo Structure**
- **Decision**: Separate `client` and `server` directories
- **Reason**: Clear separation of concerns, independent deployment, easier maintenance

### 2. **TypeScript Everywhere**
- **Decision**: Use TypeScript for both frontend and backend
- **Reason**: Type safety, better IDE support, catch errors at compile time

### 3. **Prisma ORM**
- **Decision**: Use Prisma instead of raw SQL or other ORMs
- **Reason**: 
  - Type-safe database queries
  - Automatic migrations
  - Excellent developer experience
  - Built-in connection pooling

### 4. **JWT Authentication**
- **Decision**: Stateless JWT tokens instead of sessions
- **Reason**: 
  - Scalable for serverless architecture
  - No server-side session storage needed
  - Works well with Vercel serverless functions

### 5. **Zod Validation**
- **Decision**: Use Zod for both client and server validation
- **Reason**: 
  - Single source of truth for schemas
  - Type inference from schemas
  - Runtime validation

### 6. **Vercel Serverless**
- **Decision**: Deploy on Vercel serverless functions
- **Reason**: 
  - Automatic scaling
  - Zero server management
  - Integrated CI/CD
  - Cost-effective for MVP

### 7. **Axios Interceptors**
- **Decision**: Use Axios interceptors for token management
- **Reason**: 
  - Automatic token attachment
  - Centralized error handling
  - Clean API service layer

### 8. **React Context for Auth**
- **Decision**: Use Context API instead of Redux
- **Reason**: 
  - Simpler state management for auth
  - Less boilerplate
  - Sufficient for current needs

### 9. **Dual AI Provider Support**
- **Decision**: Support both OpenAI and Google Gemini
- **Reason**: 
  - Fallback if one service fails
  - Cost optimization options
  - Better reliability

### 10. **CORS Configuration**
- **Decision**: Explicit CORS handling with multiple layers
- **Reason**: 
  - Vercel serverless requires explicit CORS
  - Support for both development and production origins
  - Preflight request handling

---

## 🐛 Challenges Solved

### 1. **CORS Issues in Production**
**Problem**: Browser blocked requests due to missing CORS headers in preflight responses.

**Solution**:
- Added explicit CORS middleware with proper origin handling
- Implemented global CORS headers for all responses
- Added explicit OPTIONS handler for preflight requests
- Configured Vercel rewrites correctly

**Code**: `server/src/config/cors.ts`, `server/src/app.ts`

### 2. **Route Path Mismatch**
**Problem**: Client calling `/api/api/...` due to baseURL already including `/api`.

**Solution**:
- Normalized axios baseURL to always end with `/api`
- Removed `/api` prefix from all API service calls
- Ensured server routes support both `/api/*` and direct paths

**Code**: `client/src/api/axios.ts`, `client/src/api/*.ts`

### 3. **TypeScript Build in Vercel**
**Problem**: Vercel wasn't compiling TypeScript, deploying old code.

**Solution**:
- Updated build script to include `tsc` compilation
- Ensured `dist/` folder is generated before deployment
- Verified Prisma client generation in build process

**Code**: `server/package.json`

### 4. **Serverless Function Routing**
**Problem**: Vercel serverless functions need specific file structure.

**Solution**:
- Created `server/api/index.ts` as entry point
- Configured `vercel.json` for proper routing
- Ensured Express app is properly exported

**Code**: `server/api/index.ts`, `server/vercel.json`

### 5. **Budget vs Expense Category Matching**
**Problem**: Case-sensitive category matching causing budget tracking issues.

**Solution**:
- Implemented case-insensitive category comparison
- Unified category names (prefer Budget casing)
- Added fallback for categories with expenses but no budget

**Code**: `server/src/controllers/dashboard.controller.ts`

### 6. **AI API Fallback**
**Problem**: Application crashes when AI API is unavailable or quota exceeded.

**Solution**:
- Implemented graceful fallback to mock advice
- Added error handling in AI service
- Made AI features optional (app works without API key)

**Code**: `server/src/services/aiAdvisor.ts`

### 7. **Rate Limiting on Preflight**
**Problem**: Rate limiter blocking OPTIONS requests.

**Solution**:
- Added skip condition for OPTIONS method
- Ensured preflight requests bypass rate limiting

**Code**: `server/src/config/rateLimit.ts`

### 8. **Type Safety with Prisma**
**Problem**: Type errors when using `req.params.id` (can be `string | string[]`).

**Solution**:
- Explicitly convert params to string: `String(id)`
- Added type guards where needed

**Code**: `server/src/controllers/expense.controller.ts`, `server/src/controllers/notification.controller.ts`

---

## 🚀 Setup & Deployment

### Local Development Setup

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Git

#### Steps

1. **Clone Repository**
```bash
git clone https://github.com/kavish2103/smart-expense-pro.git
cd smart-expense-pro
```

2. **Setup Backend**
```bash
cd server
npm install
# Create .env file with:
# DATABASE_URL="postgresql://..."
# JWT_SECRET="your-secret-key"
# OPENAI_API_KEY="sk-..." (optional)
# GEMINI_API_KEY="..." (optional)
npx prisma migrate dev
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client
npm install
# Create .env file with:
# VITE_API_URL="http://localhost:5000"
npm run dev
```

### Production Deployment (Vercel)

#### Backend Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Set Root Directory to `server`
4. Configure environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY` (optional)
   - `GEMINI_API_KEY` (optional)
5. Deploy

#### Frontend Deployment
1. Import project in Vercel (separate project)
2. Set Root Directory to `client`
3. Configure environment variables:
   - `VITE_API_URL` = Your backend Vercel URL
4. Deploy

#### Database Setup
1. Create PostgreSQL database (Supabase/Neon/Railway)
2. Run migrations:
```bash
cd server
npx prisma migrate deploy
```

---

## 💼 Interview Talking Points

### Project Overview (30 seconds)
"I built Smart Expense Pro, a full-stack expense tracking application for students and young professionals. It features expense management, budget tracking, AI-powered financial insights, and real-time notifications. The application is built with React and Express, uses PostgreSQL with Prisma ORM, and is deployed on Vercel."

### Technical Highlights (2-3 minutes)

#### 1. **Full-Stack Architecture**
- "I designed a monorepo structure with clear separation between client and server. The frontend uses React 19 with TypeScript, and the backend uses Express 5 with TypeScript for type safety across the stack."

#### 2. **Authentication & Security**
- "I implemented JWT-based authentication with bcrypt password hashing. All protected routes use middleware to verify tokens, and I used Zod for input validation on both client and server to prevent injection attacks."

#### 3. **Database Design**
- "I used Prisma ORM with PostgreSQL, which gave me type-safe database queries. I designed the schema with proper relationships - one user can have many expenses, budgets, and notifications. I also implemented unique constraints to prevent duplicate budgets per category."

#### 4. **AI Integration**
- "I integrated OpenAI's API for generating personalized financial advice. I implemented a fallback system so the app works even if the AI service is unavailable, using mock advice. This ensures reliability."

#### 5. **Real-time Features**
- "I built a notification system that triggers alerts when users exceed budget thresholds or make high-value expenses. The system uses background checks that don't block the main request flow."

#### 6. **Deployment Challenges**
- "I faced significant CORS issues when deploying to Vercel. I solved this by implementing multiple layers of CORS handling - explicit middleware, global headers, and proper preflight request handling. I also had to fix route path mismatches where the client was calling `/api/api/...` due to baseURL configuration."

#### 7. **Performance Optimizations**
- "I implemented pagination for expense lists, rate limiting to prevent abuse, and efficient database queries using Prisma's aggregation features. The dashboard uses optimized queries that fetch all needed data in minimal database calls."

#### 8. **Code Quality**
- "I used TypeScript throughout for type safety, Zod for validation schemas, and ESLint for code quality. I structured the codebase with clear separation of concerns - controllers handle requests, services contain business logic, and utilities handle reusable functions."

### Challenges & Solutions (1-2 minutes)

**Challenge 1: CORS in Production**
- "When deploying to Vercel, I encountered CORS errors. The issue was that preflight OPTIONS requests weren't getting proper CORS headers. I solved this by adding explicit CORS middleware, global headers, and a dedicated OPTIONS handler. I also had to ensure the rate limiter skipped OPTIONS requests."

**Challenge 2: TypeScript Build Process**
- "Initially, Vercel wasn't compiling TypeScript, so it was deploying old code. I fixed this by updating the build script to explicitly run `tsc` before deployment, ensuring the latest code is always deployed."

**Challenge 3: Route Path Configuration**
- "I discovered the client was making requests to `/api/api/...` because the axios baseURL already included `/api`. I fixed this by normalizing the baseURL and removing the `/api` prefix from all API service calls."

### What You Learned (30 seconds)
"This project taught me a lot about full-stack development, especially deployment challenges. I learned how to handle CORS properly in serverless environments, the importance of type safety with TypeScript, and how to structure a monorepo for independent deployment. I also gained experience with Prisma ORM and integrating third-party AI APIs."

### Future Improvements (30 seconds)
"If I were to continue this project, I'd add:
- Real-time updates using WebSockets
- Export functionality (CSV/PDF reports)
- Recurring expense templates
- Mobile app using React Native
- Bank integration for automatic expense import
- Advanced analytics with machine learning predictions"

### Metrics & Scale
- "The application supports unlimited users with proper data isolation"
- "Uses efficient database queries with pagination"
- "Implements rate limiting (100 requests per 15 minutes)"
- "Designed for serverless scalability on Vercel"

### Code Examples to Discuss
1. **JWT Authentication Flow**: `server/src/middlewares/auth.middleware.ts`
2. **Dashboard Aggregation**: `server/src/controllers/dashboard.controller.ts`
3. **AI Service with Fallback**: `server/src/services/aiAdvisor.ts`
4. **CORS Configuration**: `server/src/config/cors.ts`
5. **Axios Interceptor**: `client/src/api/axios.ts`

---

## 📊 Project Statistics

- **Total Files**: ~50+ TypeScript files
- **Lines of Code**: ~5,000+ lines
- **API Endpoints**: 15+ endpoints
- **Database Models**: 5 models
- **React Components**: 20+ components
- **Development Time**: 2-3 weeks (MVP)
- **Deployment**: 2 separate Vercel projects (client + server)

---

## 🔗 Important Links

- **GitHub Repository**: `https://github.com/kavish2103/smart-expense-pro`
- **Live Demo**: (Add your Vercel URLs)
- **API Documentation**: `/api-docs` (Swagger UI when server is running)

---

## 📝 Notes for Interview

1. **Be Specific**: When discussing challenges, mention exact error messages and solutions
2. **Show Code Understanding**: Be ready to explain any part of the codebase
3. **Discuss Trade-offs**: Explain why you chose certain technologies
4. **Mention Testing**: If asked, discuss how you'd add testing (Jest, React Testing Library)
5. **Scalability**: Discuss how the app would scale (database indexing, caching, CDN)
6. **Security**: Mention security considerations (SQL injection prevention via Prisma, XSS protection, HTTPS)

---

**Last Updated**: January 2025
**Version**: 1.0.0

