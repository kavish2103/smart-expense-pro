import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import { corsConfig } from "./config/cors";

import express from "express";
import healthRoutes from "./routes/health.route";
import { logger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import expensesRoutes from "./routes/expense.route";
import dashboardRoutes from "./routes/dashboard.route";
import budgetRoutes from "./routes/budget.route";
import aiRoutes from "./routes/ai.routes";

import notificationRoutes from "./routes/notification.route";

import authRoutes from "./routes/auth.route";
import { apiLimiter } from "./config/rateLimit";




const app = express();

// Basic CORS headers for all responses (defensive, in addition to `cors`)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsConfig));
// Explicitly handle preflight requests for all routes
app.options(/.*/, (req, res) => {
  res.sendStatus(204);
});

app.use(express.json());
app.use(logger);
app.use(apiLimiter);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Smart Expense Pro API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      apiDocs: "/api-docs",
      auth: "/api/auth",
      expenses: "/api/expenses",
      dashboard: "/api/dashboard",
      budgets: "/api/budgets",
      ai: "/api/ai",
      notifications: "/api/notifications"
    }
  });
});

app.use(healthRoutes);
// app.use(expenseRoutes); // Removed duplicate

// Support both direct mounts (for local dev) and `/api/*` paths (for Vercel).
// This way, whether the app is mounted at `/` or `/api`, routes still match.
app.use("/expenses", expensesRoutes);
app.use("/api/expenses", expensesRoutes);

app.use("/dashboard", dashboardRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/budgets", budgetRoutes);
app.use("/api/budgets", budgetRoutes);

app.use("/ai", aiRoutes);
app.use("/api/ai", aiRoutes);

app.use("/notifications", notificationRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
