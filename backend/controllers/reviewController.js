import { createReview, getAllReviews, deleteReviewById } from "../models/reviewModel.js";

const newReview = async (req, res) => {
  const { email, reviewerType, rating, title, comment } = req.body;

  try {
    const newReview = await createReview({
      email,
      reviewerType,
      rating,
      title,
      comment,
    });
    res.status(201).json({ status: "success", data: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create review." });
  }
};


const fetchAllReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch reviews." });
  }
};

// Delete review by ID
const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteReviewById(id);
    res.status(200).json({ status: "success", message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ status: "error", message: "Failed to delete review." });
  }
};

export { newReview, fetchAllReviews, deleteReview };
