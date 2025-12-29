import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createExpense = async (req: Request, res: Response) => {
  const expense = await prisma.expense.create({
    data: {
      amount: req.body.amount,
      category: req.body.category,
      title: req.body.title,
      userId: req.user!.id,
    },
  });
  

  res.status(201).json({  
    message: "Expense created successfully",
    data: expense,
  });
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const { category, minAmount, maxAmount } = req.query;

    // Base WHERE clause (important for Task 16)
    const where: any = {
      userId: req.user.id, 
    };

    if (category) {
      where.category = category;
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = Number(minAmount);
      if (maxAmount) where.amount.lte = Number(maxAmount);
    }

    // Fetch expenses
    const expenses = await prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count total
    const total = await prisma.expense.count({ where });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await prisma.expense.updateMany({
      where: {
        id,
        userId,
      },
      data: req.body,
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Expense not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await prisma.expense.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Expense not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



