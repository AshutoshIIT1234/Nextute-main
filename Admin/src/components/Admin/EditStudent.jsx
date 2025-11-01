import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import useAdminData from "../../hooks/useAdminData";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const EditStudent = () => {
  const initialStudent = {
    name: "",
    email: "",
    gender: "",
    phone_number: "",
    address: "",
    course: "",
    date_of_birth: "",
    is_verified: false,
    code: "",
    student_id: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData, dataLoading, error, hasRenderedOnce } = useAdminData();
  const [student, setStudent] = useState(initialStudent);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    const errors = {};
    if (!student.name.trim()) errors.name = "Name is required";
    if (!student.email.trim() || !/^\S+@\S+\.\S+$/.test(student.email))
      errors.email = "Valid email is required";
  // Removed institute validation, not present in state or form
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });
      if (!res.ok) throw new Error("Failed to update student");
      toast.success("Student updated!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/admin/students");
    } catch (err) {
      toast.error("Failed to save student", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${apiUrl}/api/students/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch student");
          return res.json();
        })
        .then((data) => {
          console.log('Fetched student data:', data);
          const s = data.data || {};
          setStudent({
            name: s.name || "",
            email: s.email || "",
            gender: s.gender || "",
            phone_number: s.phone_number || "",
            address: s.address || "",
            course: s.course || "",
            date_of_birth: s.date_of_birth ? s.date_of_birth.split('T')[0] : "",
            is_verified: s.is_verified || false,
            code: s.code || "",
            student_id: s.student_id || "",
          });
        })
        .catch((err) => {
          toast.error("Failed to load student: " + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id, apiUrl]);

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error && id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading student data. Please try again.
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
              {id ? "Edit Student" : "Add Student"}
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
                { label: "Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Gender", key: "gender", type: "text" },
                { label: "Phone Number", key: "phone_number", type: "text" },
                { label: "Address", key: "address", type: "text" },
                { label: "Course", key: "course", type: "text" },
                { label: "Date of Birth", key: "date_of_birth", type: "date" },
                { label: "Verified", key: "is_verified", type: "checkbox" },
                { label: "Code", key: "code", type: "text" },
                { label: "Student ID", key: "student_id", type: "text" },
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
                    <input
                      type={field.type}
                      name={field.key}
                      value={student[field.key]}
                      onChange={handleChange}
                      className="w-full p-3 border border-[#2D7A66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-gray-700 text-sm sm:text-base"
                      placeholder={`Enter ${field.label}`}
                      aria-label={field.label}
                    />
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
                onClick={() => navigate("/admin/students")}
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
                aria-label="Save Student"
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

export default EditStudent;