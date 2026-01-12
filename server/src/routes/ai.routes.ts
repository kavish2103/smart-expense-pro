import { Router } from "express";
import { getSpendingInsights } from "../controllers/ai.controller";

const router = Router();

router.get("/insights", getSpendingInsights);
router.post("/insights", getSpendingInsights);

export default router;
