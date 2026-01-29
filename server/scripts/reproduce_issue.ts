import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

const reproduce = async () => {
    try {
        const email = `repro-${Date.now()}@test.com`;
        const password = "password";

        console.log("1. Creating User:", email);
        const user = await prisma.user.create({
            data: { email, password: await bcrypt.hash(password, 10), name: "Repro User" }
        });

        console.log("2. Adding Expense: travel - 300");
        await prisma.expense.create({
            data: {
                userId: user.id,
                category: "travel", // Lowercase
                amount: 300,
                title: "Taxi",
                createdAt: new Date()
            }
        });

        console.log("3. Setting Budget: Travel - 1000");
        await prisma.budget.create({
            data: {
                userId: user.id,
                category: "Travel", // Capitalized
                amount: 1000
            }
        });

        // 4. Run dashboard logic manually (copy-paste aggregation)
        const userId = user.id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        console.log("4. Fetching Stats...");
        const budgets = await prisma.budget.findMany({ where: { userId } });
        const allCategorySpend = await prisma.expense.groupBy({
            by: ["category"],
            _sum: { amount: true },
            where: {
                userId,
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            }
        });

        console.log("All Spend Grouped:", allCategorySpend);

        const budgetStatus = budgets.map(budget => {
            // Updated Logic:
            const spent = allCategorySpend
                .filter(c => c.category.toLowerCase() === budget.category.toLowerCase())
                .reduce((total, current) => total + (current._sum.amount || 0), 0);

            return {
                category: budget.category,
                spent,
                budget: budget.amount
            };
        });

        console.log("Final Budget Status:", budgetStatus);

        if (budgetStatus[0].spent === 0) {
            console.error("FAIL: Spent is 0!");
        } else {
            console.log("SUCCESS: Spent is correct.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

reproduce();
