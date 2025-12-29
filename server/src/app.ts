import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import express from "express";
import healthRoutes from "./routes/health.route";
import { logger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import expenseRoutes from "./routes/expense.route";

import authRoutes from "./routes/auth.route";



const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(logger); 
app.use(healthRoutes);
app.use(expenseRoutes);
app.use("/auth", authRoutes);
app.use(errorHandler);

export default app;
