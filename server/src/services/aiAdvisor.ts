import OpenAI from "openai";

// Only initialize OpenAI if API key is provided
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

interface AIInput {
  total: number;
  topCategory: any;
  highestExpense: any;
  categorySummary: any[];
}

// Fallback mock advice when OpenAI API fails
const generateMockAdvice = (data: AIInput): string => {
  return `• Your total spending is ₹${data.total.toLocaleString()}.
• Your highest expense was "${data.highestExpense.title}" of ₹${data.highestExpense.amount.toLocaleString()}.
• You spent most on "${data.topCategory.category}" which is ${data.topCategory.percentage}% of your total.
• Try reducing your biggest category by 10–15% to save more.
• Consider tracking your expenses daily to stay within budget.`;
};

export const generateSpendingAdvice = async (data: AIInput) => {
  // If no API key is set, return mock advice
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set, using mock advice");
    return generateMockAdvice(data);
  }

  try {
    if (!openai) {
      return generateMockAdvice(data);
    }

    const prompt = `
You are a personal finance advisor.

User spending summary:
- Total spent: ₹${data.total}
- Highest single expense: "${data.highestExpense.title}" of ₹${data.highestExpense.amount}
- Top category: ${data.topCategory.category} (${data.topCategory.percentage}%)

Category breakdown:
${data.categorySummary
  .map((c) => `${c.category}: ₹${c.amount} (${c.percentage}%)`)
  .join("\n")}

Give:
1. A short summary
2. One warning if user overspends
3. One saving tip
4. One positive reinforcement

Respond in bullet points.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    return completion.choices[0].message.content;
  } catch (error: any) {
    // If OpenAI API fails (quota exceeded, network error, etc.), fall back to mock advice
    console.warn("OpenAI API error, using fallback mock advice:", error?.message);
    return generateMockAdvice(data);
  }
};
