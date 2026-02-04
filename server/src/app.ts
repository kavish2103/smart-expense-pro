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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsConfig));
// Explicitly handle preflight requests for all routes
// NOTE: Express 5 can throw on "*" route patterns in some environments.
// Using a regex avoids startup crashes in serverless runtimes.
app.options(/.*/, cors(corsConfig));

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
app.use("/api/expenses", expensesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
