import express from "express";
import { newReview, fetchAllReviews, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();


router.get("/reviews", fetchAllReviews);
router.post("/reviews", newReview);

// Delete review by ID
router.delete("/reviews/:id", deleteReview);

export default router;
