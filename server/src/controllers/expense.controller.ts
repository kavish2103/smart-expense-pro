import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createExpense = async (req: Request, res: Response) => {
  const expense = await prisma.expense.create({
    data: {
      amount: req.body.amount,
      category: req.body.category,
      title: req.body.title,
    },
  });

  res.status(201).json({
    message: "Expense created successfully",
    data: expense,
  });
};

export const getExpenses = async (req: Request, res: Response) => {
  const expenses = await prisma.expense.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    message: "Expenses fetched successfully",
    data: expenses,
  });
};

