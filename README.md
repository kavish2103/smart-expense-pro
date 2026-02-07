# Smart Expense Pro

A full-stack expense tracking application for students and young professionals, featuring expense management, budget tracking, AI-powered financial insights, and real-time notifications.

## 🎯 Overview

Smart Expense Pro is a privacy-first expense and subscription manager that helps users track their spending, manage budgets, and get AI-powered financial advice. Built with modern web technologies and deployed on Vercel.

## ✨ Key Features

- 🔐 **User Authentication**: JWT-based auth with secure password hashing
- 💰 **Expense Management**: Create, read, update, delete expenses with filtering
- 📊 **Budget Tracking**: Set budgets per category with real-time tracking
- 📈 **Dashboard Analytics**: Visual charts and spending insights
- 🤖 **AI-Powered Insights**: Personalized financial advice using OpenAI
- 🔔 **Smart Notifications**: Budget alerts and spending warnings
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite, Tailwind CSS
- React Router, Axios
- Chart.js, Recharts

### Backend
- Node.js + Express 5
- TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- OpenAI API Integration

### Deployment
- Vercel (Frontend + Backend)
- PostgreSQL (Supabase/Neon)

## 📚 Documentation

**For complete project documentation including architecture, API endpoints, setup instructions, and interview talking points, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/kavish2103/smart-expense-pro.git
cd smart-expense-pro
```

2. **Setup Backend**
```bash
cd server
npm install
# Create .env file
cp .env.example .env  # Add your DATABASE_URL, JWT_SECRET, etc.
npx prisma migrate dev
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client
npm install
# Create .env file
# VITE_API_URL=http://localhost:5000
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password
- `PATCH /api/auth/profile` - Update profile

### Expenses
- `GET /api/expenses` - Get expenses (with pagination & filters)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create/update budget

### AI
- `GET /api/ai/insights` - Get AI spending advice
- `GET /api/ai/history` - Get AI insights history

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications/:id/read` - Mark as read

## 🏗 Project Structure

```
smart-expense-pro/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # Documentation
└── README.md        # This file
```

## 🔑 Environment Variables

### Server (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-... (optional)
GEMINI_API_KEY=... (optional)
PORT=5000
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🚢 Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📝 License

ISC

## 👤 Author

Kavish

---

**For detailed documentation, architecture details, and interview preparation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**
