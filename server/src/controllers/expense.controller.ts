import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await prisma.expense.create({
      data: {
        amount: req.body.amount,
        category: req.body.category,
        title: req.body.description || req.body.title,
      },
    });

    res.status(201).json({
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};
