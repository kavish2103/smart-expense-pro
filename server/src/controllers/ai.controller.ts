import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getSpendingInsights = async (req: Request, res: Response) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const modelName = "gemini-2.5-flash";

    // ✅ 1. Get userId (later this will come from auth middleware)
    const userId = (req as any).user?.id || req.body.userId;

    // ✅ 2. Fetch expenses from DB if userId exists
    let expenses: any[] = [];

    if (userId) {
      expenses = await prisma.expense.findMany({
        where: { userId },
        select: {
          title: true,
          amount: true,
          category: true,
          createdAt: true,
        },
      });
    }

    // ✅ 3. Fallback to request body (so old testing still works)
    if (!expenses || expenses.length === 0) {
      expenses = req.body.expenses;
    }

    // ❌ If still no data, return error
    if (!expenses || expenses.length === 0) {
      return res.status(400).json({
        error: "No expense data found to analyze",
      });
    }

    const prompt = `
You are a smart personal finance advisor.

Here is the user's expense data:
${JSON.stringify(expenses, null, 2)}

Your tasks:
1. Identify the top spending categories.
2. Point out unnecessary or unusually high expenses.
3. Suggest where the user can cut costs.
4. Provide 3–5 clear, practical money-saving tips.

Respond in short bullet points.
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return res.json({
      aiInsights: response.text,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: "Failed to generate AI insights",
      details: error.message || "Unknown error during AI generation",
    });
  }
};
