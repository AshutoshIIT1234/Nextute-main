import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";
import { Trash2 } from "lucide-react";

const EditSocialMedia = () => {
  const { instituteDashboardData, dataLoading, hasRenderedOnce, error } =
    useInstituteData();
  const navigate = useNavigate();
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    other: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize social media data
  useEffect(() => {
    if (instituteDashboardData && hasRenderedOnce) {
      try {
        const socialMediaData =
          JSON.parse(instituteDashboardData.social_media)?.socialMedia || {};
        setSocialMedia({
          facebook: socialMediaData.facebook || "",
          twitter: socialMediaData.twitter || "",
          instagram: socialMediaData.instagram || "",
          linkedin: socialMediaData.linkedin || "",
          youtube: socialMediaData.youtube || "",
          other: socialMediaData.other || [],
        });
      } catch (err) {
        console.error("Error parsing social media data:", err);
        toast.error("Error loading social media data", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
      }
    }
  }, [instituteDashboardData, hasRenderedOnce]);

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedEditSocialMedia");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Edit your institute's social media links.
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
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    }
    localStorage.setItem("hasVisitedEditSocialMedia", "true");
  }, []);

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-lg sm:text-xl font-semibold">
        Error loading social media data. Please try again.
      </div>
    );
  }

  const handlePredefinedChange = (platform, value) => {
    setSocialMedia((prev) => ({ ...prev, [platform]: value }));
    setFormErrors((prev) => ({ ...prev, [platform]: "" }));
  };

  const handleOtherChange = (index, field, value) => {
    const updatedOthers = [...socialMedia.other];
    updatedOthers[index][field] = value;
    setSocialMedia((prev) => ({ ...prev, other: updatedOthers }));
    setFormErrors((prev) => ({ ...prev, [`other-${index}-${field}`]: "" }));
  };

  const addOtherLink = () => {
    setSocialMedia((prev) => ({
      ...prev,
      other: [...prev.other, { label: "", link: "" }],
    }));
  };

  const deleteOtherLink = (index) => {
    const updatedOthers = socialMedia.other.filter((_, i) => i !== index);
    setSocialMedia((prev) => ({ ...prev, other: updatedOthers }));
  };

  const validateForm = () => {
    const errors = {};
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

    ["facebook", "twitter", "instagram", "linkedin", "youtube"].forEach(
      (platform) => {
        if (socialMedia[platform] && !urlRegex.test(socialMedia[platform])) {
          errors[platform] = `Invalid ${platform} URL`;
        }
      }
    );

    socialMedia.other.forEach((other, index) => {
      if (!other.label.trim()) {
        errors[`other-${index}-label`] = "Label is required";
      }
      if (!other.link.trim()) {
        errors[`other-${index}-link`] = "Link is required";
      } else if (!urlRegex.test(other.link)) {
        errors[`other-${index}-link`] = "Invalid URL";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call (replace with real API)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Social media links updated successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#E6EDE2",
          color: "#144E53",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      });
      navigate("/institute/social-media");
    } catch (err) {
      toast.error("Failed to update social media links", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#E6EDE2",
          color: "#144E53",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSubmitting(false);
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
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
                Edit Social Media Links
              </h1>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/institute/social-media")}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
                aria-label="Back to Social Media"
              >
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            </div>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="space-y-6">
              {[
                { platform: "facebook", label: "Facebook" },
                { platform: "twitter", label: "Twitter" },
                { platform: "instagram", label: "Instagram" },
                { platform: "linkedin", label: "LinkedIn" },
                { platform: "youtube", label: "YouTube" },
              ].map(({ platform, label }, index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
                >
                  <label className="text-sm font-medium text-[#144E53] capitalize w-24">
                    {label}
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={socialMedia[platform]}
                      onChange={(e) =>
                        handlePredefinedChange(platform, e.target.value)
                      }
                      className="flex-1 p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                      placeholder={`Enter ${label} URL`}
                      aria-label={`${label} URL`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handlePredefinedChange(platform, "")}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm"
                      aria-label={`Clear ${label} URL`}
                    >
                      <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                    </motion.button>
                  </div>
                  {formErrors[platform] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 sm:ml-28">
                      {formErrors[platform]}
                    </p>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="mt-6"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-[#144E53] mb-4">
                  Other Links
                </h3>
                {socialMedia.other.map((other, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index + 5) * 0.05 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4"
                  >
                    <input
                      type="text"
                      value={other.label}
                      onChange={(e) =>
                        handleOtherChange(index, "label", e.target.value)
                      }
                      className="w-full sm:w-24 p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                      placeholder="Label"
                      aria-label={`Other Link ${index + 1} Label`}
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={other.link}
                        onChange={(e) =>
                          handleOtherChange(index, "link", e.target.value)
                        }
                        className="flex-1 p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        placeholder="Link URL"
                        aria-label={`Other Link ${index + 1} URL`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => deleteOtherLink(index)}
                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm"
                        aria-label={`Delete Other Link ${index + 1}`}
                      >
                        <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                      </motion.button>
                    </div>
                    <div className="sm:ml-28">
                      {formErrors[`other-${index}-label`] && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors[`other-${index}-label`]}
                        </p>
                      )}
                      {formErrors[`other-${index}-link`] && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors[`other-${index}-link`]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addOtherLink}
                  className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                  aria-label="Add New Social Media Link"
                >
                  <FaPlus className="w-4 sm:w-5 h-4 sm:h-5" />
                  Add New Link
                </motion.button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex justify-end gap-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate("/institute/social-media")}
                className="px-4 sm:px-6 py-2 bg-[#E6EDE2] text-[#144E53] rounded-lg border border-[#2D7A66] hover:bg-[#93E9A2] transition-all duration-300 text-sm sm:text-base"
                aria-label="Cancel"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{
                  scale: isSubmitting ? 1 : 1.05,
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`px-4 sm:px-6 py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Save Social Media Links"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default EditSocialMedia;
