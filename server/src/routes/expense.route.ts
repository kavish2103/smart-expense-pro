import { Router, Request, Response } from "express";
import { createExpense } from "../controllers/expense.controller";
import { validate } from "../middlewares/validate.middleware";
import { createExpenseSchema } from "../schemas/expense.schema";

const router = Router();

router.get("/expenses", (req: Request, res: Response) => {
  res.json({ message: "Expenses route is working!" });
});

router.post(
  "/expenses",
  validate(createExpenseSchema),
  createExpense
);

export default router;
