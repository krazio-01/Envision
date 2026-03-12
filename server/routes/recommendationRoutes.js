import express from "express";
import { getPersonalizedRecommendations } from "../controllers/recommendationController.js";
import optionalAuth from "../middlewares/optionalAuthMiddleware.js";

const router = express.Router();

router.post("/recommendations", optionalAuth, getPersonalizedRecommendations);

export default router;
