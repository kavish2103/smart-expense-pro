import { Request, Response } from "express";

export const createExpense = (req: Request, res: Response) => {
  res.status(201).json({
    message: "Expense validated successfully",
    data: req.body,
  });
};
