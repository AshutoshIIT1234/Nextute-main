import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaSchool,
  FaUsers,
  FaBriefcase,
  FaStar,
  FaUserTie,
} from "react-icons/fa";
import SidePanel from "./SidePanel";
import useAdminData from "../../hooks/useAdminData";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";

const Dashboard = () => {
  const { adminData, dataLoading, error, hasRenderedOnce } = useAdminData();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedAdminDashboard");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back, Admin!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your Nextute platform with ease.
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            maxWidth: "90vw",
          },
        }
      );
    }
    localStorage.setItem("hasVisitedAdminDashboard", "true");
  }, []);

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error || !adminData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading data. Please try again.
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Institutes",
      value: adminData?.totalInstitutes ?? 0,
      icon: <FaSchool className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
    },
    {
      title: "Students",
      value: adminData?.totalStudents ?? 0,
      icon: <FaUsers className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
    },
    {
      title: "Jobs",
      value: Array.isArray(adminData?.jobs) ? adminData.jobs.length : 0,
      icon: <FaBriefcase className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
    },
    {
      title: "Reviews",
      value: Array.isArray(adminData?.reviews) ? adminData.reviews.length : 0,
      icon: <FaStar className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
    },
    {
      title: "Team",
      value: Array.isArray(adminData?.team) ? adminData.team.length : 0,
      icon: <FaUserTie className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />,
    },
  ];

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-r from-[#2D7A66] to-[#144E53] rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  Welcome to Nextute Admin
                </h1>
                <p className="text-sm sm:text-base md:text-lg mt-2 max-w-md">
                  Monitor and manage all platform activities with real-time
                  insights and quick actions.
                </p>
              </div>
              <motion.div
                className="flex gap-3 sm:gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/admin/profile")}
                  className="px-4 sm:px-6 py-2 bg-[#93E9A2] text-[#144E53] rounded-lg shadow-md hover:bg-[#E6EDE2] transition-all duration-300 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                  aria-label="View Profile"
                >
                  Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/admin/settings")}
                  className="px-4 sm:px-6 py-2 bg-white text-[#144E53] rounded-lg shadow-md hover:bg-[#E6EDE2] transition-all duration-300 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                  aria-label="Settings"
                >
                  Settings
                </motion.button> */}
              </motion.div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#144E53] mb-4 sm:mb-6">
              Platform Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {summaryCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-[#E6EDE2] rounded-2xl shadow-md p-4 flex items-center gap-3 sm:gap-4 border border-[#2D7A66]/20 min-w-0"
                >
                  {card.icon}
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#144E53] truncate">
                      {card.title}
                    </h3>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#144E53]">
                      {card.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;