import { Router } from "express";
import {
  createExpense,
  getExpenses,
} from "../controllers/expense.controller";
import { validate } from "../middlewares/validate.middleware";
import { createExpenseSchema } from "../schemas/expense.schema";

const router = Router();

/**
 * GET /expenses
 * Fetch all expenses
 */
router.get("/expenses", getExpenses);

/**
 * POST /expenses
 * Create a new expense
 */
router.post(
  "/expenses",
  validate(createExpenseSchema),
  createExpense
);

export default router;
