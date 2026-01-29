import express from "express";
import { getBudgets, setBudget } from "../controllers/budget.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getBudgets);
router.post("/", setBudget);

export default router;
