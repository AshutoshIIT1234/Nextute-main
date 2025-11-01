import SummaryCard from "../Institute/Dashboard/SummaryCard";
import upload_area from "../../assets/upload_area.svg";
import Not_found from "../../assets/Not_found.svg";
import { FaSchool, FaUsers, FaTrophy, FaBook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const InstituteDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instituteData, setInstituteData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInstitute = async () => {
      setDataLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/institutes/${id}`);
        const result = await res.json();
        // Always use result.data, regardless of status code
        if (!result.data) throw new Error(result.message || "Failed to fetch institute");
        setInstituteData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setInstituteData(null);
      } finally {
        setDataLoading(false);
      }
    };
    if (id) fetchInstitute();
  }, [apiUrl, id]);

  useEffect(() => {
    const hasVisited = localStorage.getItem(`hasVisitedInstituteDashboard_${id}`);
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              View institute details here.
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
        }
      );
    }
    localStorage.setItem(`hasVisitedInstituteDashboard_${id}`, "true");
  }, [id]);

  useEffect(() => {
    if (instituteData && instituteData.image) {
      setImagePreview(instituteData.image);
    }
  }, [instituteData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB", {
          position: "top-right",
          style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
        });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image uploaded successfully!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    }
  };

  if (dataLoading) return <LoadingSpinner />;
  if (error || !instituteData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading institute data. Please try again.
      </div>
    );
  }

  const institute = instituteData;
  if (!institute) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Institute not found.
      </div>
    );
  }

  // Show all institute details (except sensitive fields)
  const hiddenFields = [
    "password_reset_token",
    "password_reset_expires",
    "code_expires_at",
    "created_at",
    "updated_at"
  ];
  // ...existing code...

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <SidePanel />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto scrollbar-thin"
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <FaSchool className="text-[#2D7A66] w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24" />
                <div className="text-center sm:text-left min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#144E53] truncate">
                    {institute.institute_name}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
                    {institute.basic_info || ""}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/admin/institutes/edit/${institute.id}`)}
                className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                aria-label="Edit Institute"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </motion.button>
            </div>
            {/* Institute Details Section - show all fields except sensitive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
              {Object.entries(institute)
                .filter(([key]) => !hiddenFields.includes(key))
                .map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base break-all">
                      {value === null ? '-' : String(value)}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Image Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#144E53] mb-4 sm:mb-6">
              Institute Image
            </h2>
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square bg-[#E6EDE2] rounded-lg flex items-center justify-center overflow-hidden"
              >
                <img
                  src={imagePreview || Not_found}
                  alt="Institute"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 relative cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload Institute Image"
                />
                <img
                  src={upload_area}
                  alt="Upload Area"
                  className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
                />
              </motion.label>
            </div>
          </motion.div>

          {/* Summary Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#144E53] mb-4 sm:mb-6">
              Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: "Total Students",
                  value: institute.stats?.students || 0,
                  icon: <FaUsers className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
                },
                {
                  title: "Achievements",
                  value: institute.achievements?.length || 0,
                  icon: <FaTrophy className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
                },
                {
                  title: "Courses",
                  value: institute.stats?.courses || 0,
                  icon: <FaBook className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
                },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <SummaryCard title={card.title} value={card.value} icon={card.icon} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#144E53] mb-4 sm:mb-6">
              Achievements
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {institute.achievements && institute.achievements.length > 0 ? (
                institute.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  No achievements available.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default InstituteDashboard;