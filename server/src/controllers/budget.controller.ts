import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getBudgets = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const budgets = await prisma.budget.findMany({
            where: { userId },
        });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch budgets", error });
    }
};

export const setBudget = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { category, amount } = req.body;

        const budget = await prisma.budget.upsert({
            where: {
                userId_category: {
                    userId,
                    category,
                },
            },
            update: { amount: Number(amount) },
            create: {
                userId,
                category,
                amount: Number(amount),
            },
        });

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Failed to set budget", error });
    }
};
