import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const StudentDashboard = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedStudentDashboard");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎉</span>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              View student details here.
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
    localStorage.setItem("hasVisitedStudentDashboard", "true");
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/students/${id}`);
        const result = await res.json();
        if (!result.status) throw new Error(result.message || "Failed to fetch student");
        setStudent(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [apiUrl, id]);

  if (loading) return <LoadingSpinner />;
  if (error || !student) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading student data. Please try again.<br />{error}
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
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#144E53] mb-4">Student Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Object.entries(student)
                .filter(([key]) => ![
                  "id",
                  "password",
                  "code",
                  "updated_at",
                  "password_reset_token",
                  "password_reset_expires",
                  "created_at",
                  "code_expires_at"
                ].includes(key))
                .map(([key, value]) => {
                  let displayValue = value;
                  if (key === "date_of_birth" && value) {
                    // Show only date part
                    const dateObj = new Date(value);
                    displayValue = isNaN(dateObj.getTime()) ? value : dateObj.toISOString().slice(0, 10);
                  }
                  return (
                    <div key={key} className="min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2D7A66] mb-2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <p className="text-gray-700 text-xs sm:text-sm md:text-base break-all">
                        {displayValue === null ? '-' : String(displayValue)}
                      </p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default StudentDashboard;
