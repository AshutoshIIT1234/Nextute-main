import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import useAdminData from "../../hooks/useAdminData";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaBriefcase, FaSchool, FaCalendar } from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData, dataLoading, hasRenderedOnce } = useAdminData();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedJobDetails");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              View job details here.
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
    localStorage.setItem("hasVisitedJobDetails", "true");
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job details");
        const data = await res.json();
        // Parse requirements if it is a string
        let requirements = data.requirements;
        if (typeof requirements === "string") {
          try {
            requirements = JSON.parse(requirements);
          } catch {
            requirements = { skills: [], experience: "" };
          }
        }
        setJob({ ...data, requirements });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (loading) return <LoadingSpinner />;
  if (error || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        {error ? "Error loading job data. Please try again." : "Job not found."}
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <FaBriefcase className="text-[#2D7A66] w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24" />
                <div className="text-center sm:text-left min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#144E53] truncate">
                    {job.title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                    Job ID: {job.job_id}
                  </p>
                </div>
              </div>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                aria-label="Edit Job"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Job Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Description</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{job.description}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Location</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{job.location}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Type</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{job.type}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Salary</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{job.salary}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Skills</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{job.requirements?.skills?.join(", ")}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Experience</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{job.requirements?.experience}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Posted On</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{new Date(job.created_at).toLocaleString()}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">Last Updated</h3>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{new Date(job.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default JobDetails;