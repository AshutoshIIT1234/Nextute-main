import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import useAdminData from "../../hooks/useAdminData";
import LoadingSpinner from "../LoadingSpinner";
import Navbar from "../Navbar";
import Footer from "../Footer";

const EditInstitute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData, dataLoading, error, hasRenderedOnce } = useAdminData();
  const [formData, setFormData] = useState({
  institute_id: "",
  institute_name: "",
  email: "",
  contact: "",
  basic_info: "",
  contact_details: "",
  courses: "",
  faculty_details: "",
  student_achievements: "",
  institute_achievements: "",
  facilities: "",
  social_media: "",
  media_gallery: "",
  is_verified: false,
  code: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && adminData) {
      const institute = adminData.institutes.find((inst) => inst.id === id);
      if (institute) {
        setFormData({
          institute_id: institute.institute_id || "",
          institute_name: institute.institute_name || "",
          email: institute.email || "",
          contact: institute.contact || "",
          basic_info: JSON.stringify(institute.basic_info || {}, null, 2),
          contact_details: JSON.stringify(institute.contact_details || {}, null, 2),
          courses: JSON.stringify(institute.courses || {}, null, 2),
          faculty_details: JSON.stringify(institute.faculty_details || {}, null, 2),
          student_achievements: JSON.stringify(institute.student_achievements || {}, null, 2),
          institute_achievements: JSON.stringify(institute.institute_achievements || {}, null, 2),
          facilities: JSON.stringify(institute.facilities || {}, null, 2),
          social_media: JSON.stringify(institute.social_media || {}, null, 2),
          media_gallery: JSON.stringify(institute.media_gallery || {}, null, 2),
          is_verified: Boolean(institute.is_verified),
          code: institute.code || ""
        });
      }
    }
  }, [id, adminData]);

  const validateForm = () => {
    const errors = {};
    if (!formData.institute_id.trim()) errors.institute_id = "Institute ID is required";
    if (!formData.institute_name.trim()) errors.institute_name = "Institute Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.contact.trim()) errors.contact = "Contact is required";

    ["basic_info","contact_details","courses","faculty_details","student_achievements","institute_achievements","facilities","social_media","media_gallery"].forEach(key => {
      if (formData[key]) {
        try {
          JSON.parse(formData[key]);
        } catch {
          errors[key] = `Invalid JSON in ${key.replace(/_/g, ' ')}`;
        }
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
      // Send only the institute_name field for debugging
      const payload = { institute_name: formData.institute_name };

      const apiUrl = import.meta.env.VITE_API_URL;
      const method = id ? "PATCH" : "POST";
      const url = id ? `${apiUrl}/api/institutes/${id}` : `${apiUrl}/api/institutes`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let errorMsg = "Failed to save institute";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch {}
        throw new Error(errorMsg);
      }
      toast.success(id ? "Institute updated!" : "Institute added!", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/admin/institutes");
    } catch (err) {
      toast.error("Failed to save institute", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error && id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
        Error loading institute data. Please try again.
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
              {id ? "Edit Institute" : "Add Institute"}
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

              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm sm:text-base font-medium text-[#144E53]">Is Verified</label>
                  <input type="checkbox" checked={formData.is_verified} onChange={e => setFormData({ ...formData, is_verified: e.target.checked })} className="ml-2" />
                </div>
                <div>
                  <label className="text-sm sm:text-base font-medium text-[#144E53]">Institute ID</label>
                  <input type="text" value={formData.institute_id} onChange={e => setFormData({ ...formData, institute_id: e.target.value })} className="w-full p-3 border border-[#2D7A66] rounded-lg" placeholder="Enter Institute ID" />
                </div>
                <div>
                  <label className="text-sm sm:text-base font-medium text-[#144E53]">Institute Name</label>
                  <input type="text" value={formData.institute_name} onChange={e => setFormData({ ...formData, institute_name: e.target.value })} className="w-full p-3 border border-[#2D7A66] rounded-lg" placeholder="Enter Institute Name" />
                </div>
                <div>
                  <label className="text-sm sm:text-base font-medium text-[#144E53]">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border border-[#2D7A66] rounded-lg" placeholder="Enter Email" />
                </div>
                <div>
                  <label className="text-sm sm:text-base font-medium text-[#144E53]">Contact</label>
                  <input type="text" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="w-full p-3 border border-[#2D7A66] rounded-lg" placeholder="Enter Contact" />
                </div>
                <div>
                  <label className="text-sm sm:text-base font-medium text-[#144E53]">Code</label>
                  <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full p-3 border border-[#2D7A66] rounded-lg" placeholder="Enter Code" />
                </div>
                {/* JSON fields as textarea */}
                {[
                  "basic_info","contact_details","courses","faculty_details","student_achievements","institute_achievements","facilities","social_media","media_gallery"
                ].map((key) => (
                  <div key={key} className="sm:col-span-2">
                    <label className="text-sm sm:text-base font-medium text-[#144E53]">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                    <textarea value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} className="w-full p-3 border border-[#2D7A66] rounded-lg min-h-[80px]" placeholder={`Enter ${key.replace(/_/g, ' ')}`}/>
                  </div>
                ))}
              </motion.div>
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
                onClick={() => navigate("/admin/institutes")}
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
                aria-label="Save Institute"
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

export default EditInstitute;