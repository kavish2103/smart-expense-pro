import express from "express";
import healthRoutes from "./routes/health.route";
import { logger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import expenseRoutes from "./routes/expense.route";



const app = express();

app.use(express.json());
app.use(logger); 
app.use(healthRoutes);
app.use(expenseRoutes);
app.use(errorHandler);

export default app;
