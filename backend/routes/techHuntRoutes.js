import express from "express";
import { claimReward, getAllParticipants, getStats } from "../controllers/techHuntController.js";

const router = express.Router();

// Public route - claim reward
router.post("/claim", claimReward);

// Public route - get stats
router.get("/stats", getStats);

// Admin route - get all participants (you can add auth middleware later)
router.get("/participants", getAllParticipants);

export default router;
