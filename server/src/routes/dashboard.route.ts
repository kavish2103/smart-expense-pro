import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getDashboardStats);

export default router;
