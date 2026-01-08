import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getSpendingInsights = async (req: Request, res: Response) => {
  try {
    // For now we’ll assume 1 user (later we plug auth)
 

    // Fetch user expenses
    const expenses = await prisma.expense.findMany({
    
      select: {
        title: true,
        amount: true,
        category: true,
        createdAt: true,
      },
    });

    if (expenses.length === 0) {
      return res.json({
        message: "No expenses found to analyze.",
        insights: [],
      });
    }

    // 📊 Aggregate Data
    let total = 0;
    const categoryMap: Record<string, number> = {};
    let highestExpense = expenses[0];

    expenses.forEach((exp) => {
      total += exp.amount;
      categoryMap[exp.category] =
        (categoryMap[exp.category] || 0) + exp.amount;

      if (exp.amount > highestExpense.amount) {
        highestExpense = exp;
      }
    });

    const categorySummary = Object.entries(categoryMap).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / total) * 100).toFixed(1),
      })
    );

    // 🧠 TEMPORARY MOCK AI (we'll plug real AI next step)
    const insights = [
      `Your total spending is ₹${total}.`,
      `Your highest expense was "${highestExpense.title}" of ₹${highestExpense.amount}.`,
      `You spent most on "${categorySummary[0].category}" which is ${categorySummary[0].percentage}% of your total.`,
      `Try reducing your biggest category by 10–15% to save more.`,
    ];

    return res.json({
      total,
      topCategory: categorySummary[0],
      highestExpense,
      categorySummary,
      insights,
    });
  } catch (error) {
    console.error("AI Insight Error:", error);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
};
