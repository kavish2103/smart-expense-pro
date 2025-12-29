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

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Lunch
 *               amount:
 *                 type: number
 *                 example: 250
 *               category:
 *                 type: string
 *                 example: Food
 *     responses:
 *       201:
 *         description: Expense created
 */

router.post("/expenses", authMiddleware,
  validate(createExpenseSchema), createExpense);

  /**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses for logged-in user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of expenses
 */

router.get("/expenses",authMiddleware,
  getExpenses);

  /**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Expense updated
 */


router.put(
  "/expenses/:id",
  authMiddleware,

  validate(updateExpenseSchema),
  updateExpense
);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 */

router.delete("/expenses/:id",authMiddleware,
  deleteExpense);

export default router;
