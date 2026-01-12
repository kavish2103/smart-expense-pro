import { Router } from "express";
import { getSpendingInsights } from "../controllers/ai.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// 🔐 Protect AI route
router.get("/insights", authMiddleware, getSpendingInsights);
router.post("/insights", authMiddleware, getSpendingInsights);

export default router;
