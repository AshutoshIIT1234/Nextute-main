import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedJobsList");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage all jobs here.
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
    localStorage.setItem("hasVisitedJobsList", "true");
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/jobs/all`, { cache: "no-store" });
        const result = await res.json();
        // Parse requirements if it is a string
        const jobsWithParsedRequirements = (Array.isArray(result) ? result : []).map(job => {
          let requirements = job.requirements;
          if (typeof requirements === "string") {
            try {
              requirements = JSON.parse(requirements);
            } catch {
              requirements = { skills: [], experience: "" };
            }
          }
          return { ...job, requirements };
        });
        setJobs(jobsWithParsedRequirements);
        setError(null);
      } catch (err) {
        setError(err.message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [apiUrl]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading jobs. Please try again.<br />{error}
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/jobs/id/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("Job deleted successfully!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } catch (err) {
      toast.error("Failed to delete job", {
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
              Jobs
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/jobs/add")}
              className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base min-w-[48px] min-h-[48px]"
              aria-label="Add New Job"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Job
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#144E53] border-b border-[#2D7A66]/20">
                    <th className="p-3 text-xs sm:text-sm md:text-base">Title</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Location</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Type</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Salary</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Skills</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Experience</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Posted</th>
                    <th className="p-3 text-xs sm:text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-[#2D7A66]/10 hover:bg-[#E6EDE2]"
                    >
                      <td
                        className="p-3 text-xs sm:text-sm md:text-base cursor-pointer truncate"
                        onClick={() => navigate(`/admin/jobs/${job.id}`)}
                      >
                        {job.title}
                      </td>
                      <td className="p-3 text-xs sm:text-sm md:text-base">{job.location}</td>
                      <td className="p-3 text-xs sm:text-sm md:text-base">{job.type}</td>
                      <td className="p-3 text-xs sm:text-sm md:text-base">{job.salary}</td>
                      <td className="p-3 text-xs sm:text-sm md:text-base">
                        {job.requirements?.skills?.join(", ")}
                      </td>
                      <td className="p-3 text-xs sm:text-sm md:text-base">
                        {job.requirements?.experience}
                      </td>
                      <td className="p-3 text-xs sm:text-sm md:text-base">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/admin/jobs/edit/${job.job_id}`)}
                          className="p-2 bg-[#2D7A66] text-white rounded-lg hover:bg-[#144E53] min-w-[40px] min-h-[40px]"
                          aria-label="Edit Job"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(job.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 min-w-[40px] min-h-[40px]"
                          aria-label="Delete Job"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default JobsList;