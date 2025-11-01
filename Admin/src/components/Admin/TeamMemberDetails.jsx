import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaEnvelope } from "react-icons/fa";

const TeamMemberDetails = () => {
  const { certificateNo } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/api/employees/member/${certificateNo}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch member details");
        const data = await res.json();
        setMember(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [apiUrl, certificateNo]);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedTeamMemberDetails");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              View team member details here.
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
    localStorage.setItem("hasVisitedTeamMemberDetails", "true");
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !member) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
          <SidePanel />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
              Error loading team member data. Please try again.
              <br />
              {error || "Team member not found."}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, {
      position: "top-right",
      style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
    });
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <img
                  src={member.image}
                  alt={member.fullName}
                  className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full object-cover"
                />
                <div className="text-center sm:text-left min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#144E53] truncate">
                    {member.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                    Role: {member.designation}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                    Department: {member.department}
                  </p>
                </div>
              </div>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/admin/team/edit/${member.id}`)}
                className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                aria-label="Edit Team Member"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </motion.button> */}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#144E53] mb-4 sm:mb-6">
              Team Member Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                  Email
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base flex items-center gap-2">
                  <FaEnvelope className="text-[#2D7A66] w-4 sm:w-5 h-4 sm:h-5" />
                  <span
                    className="cursor-pointer hover:text-[#144E53] transition-colors duration-200 truncate min-w-0 p-2 -m-2"
                    onClick={() => handleCopy(member.email, "Email")}
                    aria-label="Copy Email"
                  >
                    {member.email || "-"}
                  </span>
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                  Phone Number
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                  {member.phoneNumber || "-"}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                  Joining Date
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                  {member.joiningDate
                    ? new Date(member.joiningDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                  Certificate No
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                  {member.certificateNo}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                  Achievements
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                  {member.achievementsURL ? (
                    <a
                      href={member.achievementsURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Achievements
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                  Certificate
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                  {member.certificateURL ? (
                    <a
                      href={member.certificateURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Certificate
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default TeamMemberDetails;