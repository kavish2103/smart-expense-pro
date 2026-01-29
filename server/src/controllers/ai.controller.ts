import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { createNotification } from "./notification.controller";

export const getSpendingInsights = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return res.status(500).json({ error: "Server misconfiguration: GEMINI_API_KEY is missing" });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const modelName = "gemini-2.5-flash";

    // ✅ 1. Get userId ONLY from auth middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    // ✅ 2. Fetch expenses from DB
    const expenses = await prisma.expense.findMany({
      where: { userId },
      select: {
        title: true,
        amount: true,
        category: true,
        createdAt: true,
      },
    });

    // ❌ If user has no expenses
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

    // Notification Trigger: AI Insights
    await createNotification(
      userId,
      "New AI Insights",
      "We've analyzed your latest expenses. Check out the new financial advice!",
      "INFO"
    );

    return;

  } catch (error: any) {
    console.error("Gemini API Error Detail:", JSON.stringify(error, null, 2));
    console.error("Full Error Object:", error);

    return res.status(500).json({
      error: "Failed to generate AI insights",
      details: error.message || "Unknown error during AI generation",
    });
  }
};
