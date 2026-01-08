import { Router } from "express";
import { getSpendingInsights } from "../controllers/ai.controller";

const router = Router();

router.get("/insights", getSpendingInsights);

export default router;
