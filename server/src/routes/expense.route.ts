import { Router } from "express";
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

router.post("/expenses", validate(createExpenseSchema), createExpense);

router.get("/expenses", getExpenses);

router.put(
  "/expenses/:id",
  validate(updateExpenseSchema),
  updateExpense
);

router.delete("/expenses/:id", deleteExpense);

export default router;
