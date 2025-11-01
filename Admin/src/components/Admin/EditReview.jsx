import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import useAdminData from "../../hooks/useAdminData";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData, dataLoading, error, hasRenderedOnce } = useAdminData();
  const [formData, setFormData] = useState({
    author: "",
    content: "",
    rating: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && adminData) {
      const review = adminData.reviews.find((r) => r.id === parseInt(id));
      if (review) {
        setFormData({
          author: review.author,
          content: review.content,
          rating: review.rating.toString(),
        });
      }
    }
  }, [id, adminData]);

  const validateForm = () => {
    const errors = {};
    if (!formData.author.trim()) errors.author = "Author is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    if (!formData.rating || isNaN(formData.rating) || formData.rating < 1 || formData.rating > 5)
      errors.rating = "Rating must be between 1 and 5";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(id ? "Review updated!" : "Review added!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/admin/reviews");
    } catch (err) {
      toast.error("Failed to save review", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error && id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading review data. Please try again.
      </div>
    );
  }

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
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#144E53]">
              {id ? "Edit Review" : "Add Review"}
            </h1>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="space-y-4 sm:space-y-6">
              {[
                { label: "Author", key: "author", type: "text" },
                { label: "Content", key: "content", type: "textarea" },
                { label: "Rating", key: "rating", type: "number" },
              ].map((field, index) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
                >
                  <label className="text-sm sm:text-base font-medium text-[#144E53] capitalize w-24">
                    {field.label}
                  </label>
                  <div className="flex-1">
                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base min-h-[100px]"
                        placeholder={`Enter ${field.label}`}
                        aria-label={field.label}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        placeholder={`Enter ${field.label}`}
                        aria-label={field.label}
                        min={field.key === "rating" ? 1 : undefined}
                        max={field.key === "rating" ? 5 : undefined}
                      />
                    )}
                    {formErrors[field.key] && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors[field.key]}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex justify-end gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate("/admin/reviews")}
                className="px-4 sm:px-6 py-2 bg-[#E6EDE2] text-[#144E53] rounded-lg border border-[#2D7A66] hover:bg-[#93E9A2] transition-all duration-300 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                aria-label="Cancel"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`px-4 sm:px-6 py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 text-sm sm:text-base min-w-[48px] min-h-[48px] ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                aria-label="Save Review"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default EditReview;