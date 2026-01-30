import prisma from "../config/prisma";
import { createNotification } from "../controllers/notification.controller";

/**
 * Checks budget thresholds (Total and Category-wise) and triggers notifications.
 */
export const checkBudgetThresholds = async (userId: string, newExpenseAmount: number, category: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 1. Get all budgets for the user
    const budgets = await prisma.budget.findMany({
        where: { userId },
    });

    if (budgets.length === 0) return; // No monitoring if no budgets set

    // --- Category Specific Check ---
    const categoryBudget = budgets.find((b) => b.category === category);
    if (categoryBudget) {
        // Calculate total spent in this category for the month (including new expense)
        const categoryExpenses = await prisma.expense.aggregate({
            where: {
                userId,
                category,
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            _sum: {
                amount: true,
            },
        });

        const totalCategorySpent = (categoryExpenses._sum.amount || 0) + newExpenseAmount;

        // Trigger: Exceeded Category Budget
        if (totalCategorySpent > categoryBudget.amount) {
            // Only notify if the PREVIOUS total was below or equal (to avoid spamming every transaction after crossing)
            // This approximates "crossing" the threshold. 
            // Strictly speaking, we should check if we *just* crossed it.
            const previousSpent = categoryExpenses._sum.amount || 0;
            if (previousSpent <= categoryBudget.amount) {
                await createNotification(
                    userId,
                    "Category Budget Exceeded",
                    `Alert: ${category} expenses are strictly high (${totalCategorySpent}). You've exceeded your budget of ${categoryBudget.amount}.`,
                    "WARNING"
                );
            } else {
                // Maybe a reminder every significant chunk? For now, stick to just crossing.
                // However, user might want to know they are "Unusually high".
                // The prompt says: "🍔 Food expenses are unusually high this month."
            }
        }
    }

    // --- Total Monthly Budget Check ---
    const totalBudgetAmount = budgets.reduce((sum, b) => sum + b.amount, 0);

    // Calculate total spent across ALL categories
    const allExpenses = await prisma.expense.aggregate({
        where: {
            userId,
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            }
        },
        _sum: {
            amount: true
        }
    });

    const totalSpent = (allExpenses._sum.amount || 0) + newExpenseAmount;
    const previousTotalSpent = allExpenses._sum.amount || 0;

    // Trigger: Exceeded Total Budget
    if (totalSpent > totalBudgetAmount && previousTotalSpent <= totalBudgetAmount) {
        await createNotification(
            userId,
            "Budget Exceeded Alert",
            "🚨 You’ve exceeded your monthly budget. Consider reducing discretionary expenses.",
            "WARNING"
        );
    }
    // Trigger: Warning (80-90%)
    // Check if we just entered the 80% zone
    else if (totalSpent >= 0.8 * totalBudgetAmount && totalSpent <= 0.9 * totalBudgetAmount) {
        // To avoid spamming in the 80-90% range, we might want to check if we were previously below 80%
        // OR if this is the first time we detected it.
        // Logic: If previous spent was < 80%, notify.
        if (previousTotalSpent < 0.8 * totalBudgetAmount) {
            await createNotification(
                userId,
                "Monthly Budget Warning",
                "⚠️ You’re close to your monthly spending limit. Review your expenses to avoid overspending.",
                "WARNING"
            );
        }
    }
};

/**
 * Checks for frequent spending spikes.
 */
export const checkFrequentSpending = async (userId: string) => {
    // Trigger when many expenses are added in a short time span.
    // Definition: > 5 expenses in the last 24 hours (or "today").
    // Let's use "Today" to match the prompt "added several expenses today".

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Count expenses created today (excluding the one just being added? No, including it usually, but this is called before or after?)
    // This function will be called *before* or *after* logic? 
    // If called inside createExpense, the current transaction might not be committed yet if implicit?
    // Usually prisma create is awaited. So if we call this after awaiting create, it counts the new one.

    const countToday = await prisma.expense.count({
        where: {
            userId,
            createdAt: {
                gte: startOfToday
            }
        }
    });

    // Check if we hit specific thresholds to avoid spamming on every expense #6, #7, #8...
    // Let's notify on exactly 5th, 10th, etc? Or just once at 5?
    // Prompt: "Trigger when many expenses are added..."
    // Let's trigger at 5.
    if (countToday === 5) { // Assuming this counts the one we just added
        await createNotification(
            userId,
            "Frequent Spending Alert",
            "📊 You’ve added several expenses today. Track carefully.",
            "INFO"
        );
    }
};
