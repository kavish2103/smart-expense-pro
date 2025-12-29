import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  title: z.string().min(1),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});



export const updateExpenseSchema = z.object({
  amount: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
});
