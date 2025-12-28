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
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, minAmount, maxAmount } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = Number(minAmount);
      if (maxAmount) where.amount.lte = Number(maxAmount);
    }

    const expenses = await prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.expense.count({ where });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};


