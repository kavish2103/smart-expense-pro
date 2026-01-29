import dotenv from "dotenv";
dotenv.config();
import prisma from "../src/config/prisma";

const debug = async () => {
    try {
        // 1. Get User
        // Find user with recent expenses or just the last created one
        const user = await prisma.user.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!user) {
            console.log("No user found");
            return;
        }
        console.log("Checking for User:", user.email, "ID:", user.id);

        // 2. Dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        console.log("Date Range:", startOfMonth.toISOString(), "to", endOfMonth.toISOString());

        // 3. Budgets
        const budgets = await prisma.budget.findMany({ where: { userId: user.id } });
        console.log("Budgets:", JSON.stringify(budgets, null, 2));

        // 4. Expenses
        const expenses = await prisma.expense.findMany({
            where: {
                userId: user.id,
                createdAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });
        console.log("Expenses found:", expenses.length);
        expenses.forEach(e => console.log(`- ${e.category}: ${e.amount} (${e.createdAt.toISOString()})`));

        // 5. Grouped Check
        const grouped = await prisma.expense.groupBy({
            by: ["category"],
            _sum: { amount: true },
            where: {
                userId: user.id,
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            }
        });
        console.log("Grouped Stats:", JSON.stringify(grouped, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

debug();
