import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import useAdminData from "../../hooks/useAdminData";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const API_URL = import.meta.env.VITE_API_URL;
const initialJob = {
  job_id: "",
  title: "",
  description: "",
  location: "",
  type: "Full-time",
  salary: "",
  requirements: { skills: [], experience: "" },
};

const EditJob = () => {
  const { id: job_id } = useParams();
  const navigate = useNavigate();
  const { adminData, dataLoading, error, hasRenderedOnce } = useAdminData();
  const [job, setJob] = useState(initialJob);
  const [skillsInput, setSkillsInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (job_id) {
      setFetching(true);
      fetch(`${API_URL}/api/jobs/jobid/${job_id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch job");
          return res.json();
        })
        .then((data) => {
          let requirements = data.requirements;
          if (typeof requirements === "string") {
            try {
              requirements = JSON.parse(requirements);
            } catch {
              requirements = { skills: [], experience: "" };
            }
          }
          setJob({
            job_id: data.job_id || "",
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            type: data.type || "Full-time",
            salary: data.salary || "",
            requirements: requirements || { skills: [], experience: "" },
            created_at: data.created_at || "",
            updated_at: data.updated_at || "",
          });
          setSkillsInput((requirements?.skills || []).join(", "));
          setExperienceInput(requirements?.experience || "");
        })
        .catch((err) => {
          toast.error("Failed to load job: " + err.message);
        })
        .finally(() => setFetching(false));
    }
  }, [job_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
    setJob((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
      },
    }));
  };

  const handleExperienceChange = (e) => {
    setExperienceInput(e.target.value);
    setJob((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        experience: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url;
      let method;
      // Always include skills and experience from local state
      const requirements = {
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        experience: experienceInput,
      };
      let payload = {
        ...job,
        requirements: JSON.stringify(requirements),
      };
      if (job_id) {
        url = `${API_URL}/api/jobs/jobid/${job_id}`;
        method = "PUT";
      } else {
        url = `${API_URL}/api/jobs/`;
        method = "POST";
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(method === "PUT" ? "Failed to update job" : "Failed to create job");
      toast.success(method === "PUT" ? "Job updated successfully!" : "Job created successfully!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      setJob(initialJob);
      setSkillsInput("");
      setExperienceInput("");
      navigate("/admin/jobs");
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error && job_id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading job data. Please try again.
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
              {job_id ? "Edit Job" : "Add Job"}
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
                { label: "Job ID", key: "job_id", type: "text", required: true },
                { label: "Title", key: "title", type: "text", required: true },
                { label: "Description", key: "description", type: "textarea", required: true },
                { label: "Location", key: "location", type: "text" },
                { label: "Type", key: "type", type: "select", options: ["Full-time", "Internship", "Part-time", "Contract"] },
                { label: "Salary", key: "salary", type: "text" },
                { label: "Skills (comma separated)", key: "skills", type: "text" },
                { label: "Experience", key: "experience", type: "text" },
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
                        name={field.key}
                        value={job[field.key]}
                        onChange={handleChange}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        placeholder={`Enter ${field.label}`}
                        aria-label={field.label}
                      />
                    ) : field.type === "select" ? (
                      <select
                        name={field.key}
                        value={job[field.key]}
                        onChange={handleChange}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        aria-label={field.label}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.key === "skills" ? (
                      <input
                        type="text"
                        name="skills"
                        value={skillsInput}
                        onChange={handleSkillsChange}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        placeholder="Enter skills separated by commas"
                        aria-label="Skills"
                      />
                    ) : field.key === "experience" ? (
                      <input
                        type="text"
                        name="experience"
                        value={experienceInput}
                        onChange={handleExperienceChange}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        placeholder="Enter experience requirements"
                        aria-label="Experience"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        value={job[field.key]}
                        onChange={handleChange}
                        className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                        placeholder={`Enter ${field.label}`}
                        aria-label={field.label}
                        readOnly={field.readOnly}
                      />
                    )}
                    {field.key === "skills" && (
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Enter skills separated by commas.
                      </p>
                    )}
                    {field.key === "experience" && (
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Enter experience requirements.
                      </p>
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
                onClick={() => navigate("/admin/jobs")}
                className="px-4 sm:px-6 py-2 bg-[#E6EDE2] text-[#144E53] rounded-lg border border-[#2D7A66] hover:bg-[#93E9A2] transition-all duration-300 text-sm sm:text-base min-w-[48px] min-h-[48px]"
                aria-label="Cancel"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className={`px-4 sm:px-6 py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 text-sm sm:text-base min-w-[48px] min-h-[48px] ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                aria-label="Save Job"
              >
                {loading ? "Saving..." : "Save"}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default EditJob;