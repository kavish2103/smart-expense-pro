# Smart Expense Tracker API

A secure and scalable backend API for managing personal expenses with
JWT-based authentication, user-level data isolation, and full CRUD support.

This project is built to demonstrate real-world backend engineering
practices using Node.js, TypeScript, Prisma, and PostgreSQL.

---

## 🚀 Features

- User registration & login (JWT authentication)
- Create, read, update, and delete expenses
- Expenses scoped per authenticated user
- Pagination and filtering support
- Input validation using Zod
- Centralized error handling
- PostgreSQL database via Prisma ORM

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** JWT
- **Validation:** Zod
- **Testing:** Postman

---

## 📌 API Endpoints

### Auth
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and receive JWT

### Expenses (Protected)
- `POST /expenses` – Create expense
- `GET /expenses` – Get expenses (pagination & filters)
- `PUT /expenses/:id` – Update expense
- `DELETE /expenses/:id` – Delete expense

---

## ⚙️ Setup & Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/kavish2103/smart-expense-pro.git
cd smart-expense-pro/server
