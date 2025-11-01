import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaLink, FaPlus } from "react-icons/fa";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import * as assets from "../../../assets/index.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const SocialMedia = () => {
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } =
    useInstituteData();
  const navigate = useNavigate();

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedSocialMedia");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Manage your institute's social media links seamlessly.
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
    localStorage.setItem("hasVisitedSocialMedia", "true");
  }, []);

  // Parse social media data
  const socialMediaData = useMemo(() => {
    if (!instituteDashboardData) return [];
    try {
      const socialMedia =
        JSON.parse(instituteDashboardData.social_media)?.socialMedia || {};
      return [
        { label: "Facebook", url: socialMedia.facebook || "" },
        { label: "Twitter", url: socialMedia.twitter || "" },
        { label: "Instagram", url: socialMedia.instagram || "" },
        { label: "LinkedIn", url: socialMedia.linkedin || "" },
        { label: "YouTube", url: socialMedia.youtube || "" },
        ...(socialMedia.other || []).map((other, index) => ({
          label: other.label || `Other ${index + 1}`,
          url: other.link || "",
          key: `other-${index}`,
        })),
      ].filter((social) => social.url);
    } catch (err) {
      console.error("Error parsing social media data:", err);
      return [];
    }
  }, [instituteDashboardData]);

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error || !socialMediaData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-lg sm:text-xl font-semibold">
        Error loading social media data. Please try again.
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
            className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4"
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Social Media Links
            </h1>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/institute/edit-social-media")}
              className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              aria-label="Edit Social Media Links"
            >
              <FaPlus className="w-4 sm:w-5 h-4 sm:h-5" />
              Edit/Add Links
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {socialMediaData.length > 0 ? (
                  socialMediaData.map((social, index) => (
                    <motion.div
                      key={social.key || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-[#2D7A66]/20 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-[#E6EDE2]"
                    >
                      <FaLink className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-[#144E53]">
                          {social.label}
                        </h3>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs sm:text-lg break-all hover:text-blue-700 transition-colors duration-200"
                        >
                          {social.url}
                        </a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-8 sm:py-10"
                  >
                    <img
                      src={assets.Not_found}
                      alt="No Social Media Links"
                      className="mx-auto mb-4 w-24 sm:w-32 h-24 sm:h-32 opacity-60"
                      onError={(e) => (e.target.src = assets.Not_found)}
                    />
                    <p className="text-gray-700 text-sm sm:text-base mb-4">
                      No social media links found. Add a new link to get
                      started!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/institute/edit-social-media")}
                      className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 text-sm sm:text-base"
                      aria-label="Add New Social Media Link"
                    >
                      Add Link
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default SocialMedia;
