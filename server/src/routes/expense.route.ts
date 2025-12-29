import { Router } from "express";
import { mockAuth } from "../middlewares/mockAuth.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "../schemas/expense.schema";

const router = Router();


router.post("/expenses", authMiddleware,
  validate(createExpenseSchema), createExpense);

router.get("/expenses",authMiddleware,
  getExpenses);

router.put(
  "/expenses/:id",
  authMiddleware,

  validate(updateExpenseSchema),
  updateExpense
);

router.delete("/expenses/:id",authMiddleware,
  deleteExpense);

export default router;
