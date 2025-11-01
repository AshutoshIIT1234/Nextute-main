import prisma from "../db/index.js";

const createReview = async ({
  email,
  reviewerType,
  rating,
  title,
  comment,
}) => {
  return await prisma.review.create({
    data: {
      email,
      reviewerType,
      rating,
      title,
      comment,
    },
  });
};

const getAllReviews = async () => {
  return await prisma.review.findMany();
};


const deleteReviewById = async (id) => {
  return await prisma.review.delete({
    where: { id },
  });
};

export { createReview, getAllReviews, deleteReviewById };
