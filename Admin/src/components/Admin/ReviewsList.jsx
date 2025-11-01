import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaStar } from "react-icons/fa";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedReviewsList");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage all reviews here.
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "12px",
            padding: "12px sm:16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            maxWidth: "90vw",
          },
          // ...existing code...
        }
      );
    }
    localStorage.setItem("hasVisitedReviewsList", "true");
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/feedback/reviews`, { cache: "no-store" });
        const result = await res.json();
        setReviews(result.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [apiUrl]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading reviews. Please try again.<br />{error}
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/feedback/reviews/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setReviews((prev) => prev.filter((review) => review.id !== id));
      toast.success("Review deleted successfully!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } catch (err) {
      toast.error("Failed to delete review", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <SidePanel />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-between items-center mb-6 sm:mb-8"
          >
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#144E53]">
              Reviews
            </h1>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/reviews/add")}
              className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base min-w-[48px] min-h-[48px]"
              aria-label="Add New Review"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Review
            </motion.button> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-[#2D7A66]/20 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-[#E6EDE2] min-w-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="text-[#2D7A66] w-5 h-5" />
                    <h3 className="text-sm sm:text-base font-semibold text-[#144E53] truncate">{review.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">{review.comment}</p>
                  <p className="text-xs sm:text-sm text-[#2D7A66] mt-2">Rating: {review.rating}/5</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">By: {review.email} ({review.reviewerType})</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">{new Date(review.created_at).toLocaleString()}</p>
                  <div className="flex gap-2 mt-3">
                    {/* <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/admin/reviews/edit/${review.id}`)}
                      className="p-2 bg-[#2D7A66] text-white rounded-lg hover:bg-[#144E53] min-w-[40px] min-h-[40px]"
                      aria-label="Edit Review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </motion.button> */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(review.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 min-w-[30px] min-h-[30px]"
                      aria-label="Delete Review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewsList;