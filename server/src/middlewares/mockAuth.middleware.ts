import { Request, Response, NextFunction } from "express";

export const mockAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TEMPORARY user (will be replaced by JWT later)
  req.user = {
    id: "demo-user-id-123",
  };

  next();
};
