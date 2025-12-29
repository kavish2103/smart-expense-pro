import { Router } from "express";
import { mockAuth } from "../middlewares/mockAuth.middleware";

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

router.use(mockAuth);
router.post("/expenses", mockAuth,
  validate(createExpenseSchema), createExpense);

router.get("/expenses",mockAuth,
  getExpenses);

router.put(
  "/expenses/:id",
  mockAuth,

  validate(updateExpenseSchema),
  updateExpense
);

router.delete("/expenses/:id",mockAuth,
  deleteExpense);

export default router;
