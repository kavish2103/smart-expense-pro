import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // 📅 Date Ranges
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. 💰 Total Expenses (This Month)
        const expensesThisMonth = await prisma.expense.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            },
        });

        const expensesLastMonth = await prisma.expense.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
        });

        const totalSpent = expensesThisMonth._sum.amount || 0;
        const lastMonthSpent = expensesLastMonth._sum.amount || 0;

        // Calculate percentage change
        let percentageChange = 0;
        if (lastMonthSpent > 0) {
            percentageChange = ((totalSpent - lastMonthSpent) / lastMonthSpent) * 100;
        } else if (totalSpent > 0) {
            percentageChange = 100; // First month spending
        }

        // 2. 🏷️ Highest Spending Category
        const categoryStats = await prisma.expense.groupBy({
            by: ["category"],
            _sum: { amount: true },
            where: {
                userId,
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            },
            orderBy: { _sum: { amount: "desc" } },
            take: 1,
        });

        const highestCategory = categoryStats[0]
            ? {
                category: categoryStats[0].category,
                amount: categoryStats[0]._sum.amount,
            }
            : null;

        // 3. 🗓️ Average Daily Spend
        const daysPassed = now.getDate();
        const avgDailyId = totalSpent / daysPassed;

        // 4. 📉 Spending Trends (Last 6 Months or Weeks - Simplification: Last 7 Days for now)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentExpenses = await prisma.expense.findMany({
            where: { userId, createdAt: { gte: sevenDaysAgo } },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day for chart
        const trendMap: Record<string, number> = {};
        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            trendMap[d.toLocaleDateString(undefined, { weekday: 'short' })] = 0;
        }

        recentExpenses.forEach(exp => {
            const day = new Date(exp.createdAt).toLocaleDateString(undefined, { weekday: 'short' });
            if (trendMap[day] !== undefined) trendMap[day] += exp.amount;
        });

        const trendData = Object.keys(trendMap).reverse().map(name => ({
            name,
            amount: trendMap[name]
        }));


        // 5. 🎯 Budgets & Remaining Limits
        console.log("Fetching budgets...");
        const budgets = await prisma.budget.findMany({
            where: { userId }
        });
        console.log("Budgets found:", budgets.length);

        // Calculate spend per category
        const allCategorySpend = await prisma.expense.groupBy({
            by: ["category"],
            _sum: { amount: true },
            where: {
                userId,
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            }
        });

        const budgetStatus = budgets.map(budget => {
            // Case-insensitive matching: Sum up all expense groupings that match the budget category name
            const spent = allCategorySpend
                .filter(c => c.category.toLowerCase() === budget.category.toLowerCase())
                .reduce((total, current) => total + (current._sum.amount || 0), 0);

            return {
                ...budget,
                spent,
                remaining: Math.max(0, budget.amount - spent),
                progress: Math.min(100, (spent / budget.amount) * 100)
            }
        });

        // 🔢 Total Budget Health
        const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.amount, 0);
        // Note: Total spend vs Total Budget (Only for budgeted categories, or absolute total?)
        // Usually users want to know "Of the money I allocated, how much is left?"
        // We will sum the spending ONLY for categories that have budgets to be accurate to the "Remaining Budget" concept,
        // OR we can just simple do Total Budget - Total Spent (Global). 
        // Let's do Total Budget - Total Spent (in budgeted categories) to be precise.
        const totalSpentInBudgets = budgetStatus.reduce((sum, b) => sum + b.spent, 0);
        const totalBudgetRemaining = Math.max(0, totalBudgetLimit - totalSpentInBudgets);

        console.log("Sending response...");
        res.json({
            summary: {
                totalSpent,
                percentageChange,
                highestCategory,
                avgDailyId,
                totalBudgetLimit,
                totalBudgetRemaining
            },
            trendData,
            budgets: budgetStatus
        });

    } catch (error) {
        console.error("Dashboard stats error DETAIL:", error); // Enhanced logging
        res.status(500).json({ message: "Failed to fetch dashboard stats", error });
    }
};
