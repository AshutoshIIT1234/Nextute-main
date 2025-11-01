import { useEffect, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MainContent from "../components/Student/Dashboard/MainContent";
import ProfileSection from "../components/Student/Dashboard/ProfileSection";
import ContactInfo from "../components/Student/Dashboard/ContactInfo";
import PreferencesSection from "../components/Student/Dashboard/PreferencesSection";
import InstituteRecommendations from "../components/Student/Dashboard/InstituteRecommendations";
import WelcomePopup from "../components/Student/Dashboard/WelcomePopup";
import { AppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Menu, X } from "lucide-react";
import * as assets from "../assets/index.js";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    userType,
    isAuthenticated,
    loading: authLoading,
    logout,
    VITE_BACKEND_BASE_URL,
  } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDashboardData = useCallback(
    async (abortController) => {
      setDataLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/students/profile`,
          {
            withCredentials: true,
            signal: abortController?.signal,
          }
        );
        if (!response.data) {
          throw new Error("No dashboard data received.");
        }
      
        const enhancedData = {
          ...response.data.data,
          languagePreference: response.data.data.languagePreference ?? "",
          bio: response.data.data.bio ?? "",
          hobbies: response.data.data.hobbies ?? [],
          learningStyle: response.data.data.learningStyle ?? "",
          targetExams: response.data.data.targetExams ?? [],
          attemptYear: response.data.data.attemptYear ?? "",
          studyMode: response.data.data.studyMode ?? "",
          currentClass: response.data.data.currentClass ?? "",
          careerGoal: response.data.data.careerGoal ?? "",
          preparationReason: response.data.data.preparationReason ?? "",
          studyHours: response.data.data.studyHours ?? "",
          preferredTime: response.data.data.preferredTime ?? "",
          favoriteSubjects: response.data.data.favoriteSubjects ?? [],
          socialLinks: response.data.data.socialLinks ?? {
            linkedin: "",
            github: "",
            twitter: "",
            instagram: "",
          },
          certifications: response.data.data.certifications ?? [],
          achievements: response.data.data.achievements ?? [],
          studyResources: response.data.data.studyResources ?? [],
          mentorshipPreference: response.data.data.mentorshipPreference ?? "",
          studyGoals: response.data.data.studyGoals ?? {
            shortTerm: "",
            longTerm: "",
          },
          extracurriculars: response.data.data.extracurriculars ?? [],
          recommendedInstitutes: response.data.data.recommendedInstitutes || [
            {
              name: "Alpha Institute",
              location: "Mumbai",
              rating: 4.5,
              image: assets.coaching,
            },
            {
              name: "Beta Academy",
              location: "Delhi",
              rating: 4.2,
              image: assets.signup_illustration,
            },
          ],
        };
        setDashboardData(response.data);
        setStudentProfile(enhancedData);
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/student/login");
        } else {
          setError(err.message || "Failed to load dashboard data.");
          toast.error(err.message || "Failed to load dashboard data.");
        }
      } finally {
        setDataLoading(false);
      }
    },
    [logout, navigate]
  );

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to log out");
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const allowedFields = [
        "id", "name", "email", "password", "gender", "phone_number", "address", "course", "date_of_birth",
        "is_verified", "code", "created_at", "updated_at", "code_expires_at", "student_id",
        "password_reset_token", "password_reset_expires", "profileImage", "bio", "languagePreference",
        "hobbies", "learningStyle", "targetExams", "attemptYear", "studyMode", "currentClass",
        "careerGoal", "preparationReason", "studyHours", "preferredTime", "favoriteSubjects",
        "socialLinks", "studyResources", "mentorshipPreference", "studyGoals", "extracurriculars",
        "enrolledCourses", "achievements", "notifications"
      ];
      const filteredProfile = {};
      for (const key of allowedFields) {
        if (studentProfile[key] !== undefined) {
          filteredProfile[key] = studentProfile[key];
        }
      }
      console.log('[DEBUG] Student update payload:', filteredProfile);
      const response = await axios.put(
        `${VITE_BACKEND_BASE_URL}/api/students/${studentProfile.id}`,
        filteredProfile,
      );
      if (response.data.status) {
        toast.success("Profile updated successfully!");
        setStudentProfile(response.data.data);
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      toast.error("Error updating profile.");
      console.error(err);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (!authLoading) {
      if (isAuthenticated && userType === "student" && user) {
        fetchDashboardData(abortController);
      } else {
        navigate("/student/login", {
          state: { error: "Please log in as a student" },
        });
      }
    }
    return () => abortController.abort();
  }, [
    authLoading,
    isAuthenticated,
    userType,
    user,
    fetchDashboardData,
    navigate,
    VITE_BACKEND_BASE_URL,
  ]);

  if (authLoading || dataLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition"
          onClick={() => fetchDashboardData()}
          disabled={dataLoading}
        >
          {dataLoading ? "Retrying..." : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        <motion.aside
          initial={{ x: 0, opacity: 1 }}
          animate={{
            x: isSidebarOpen || isLargeScreen ? 0 : -100,
            opacity: isSidebarOpen || isLargeScreen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white rounded-r-2xl shadow-lg p-6 flex flex-col gap-4 lg:static lg:bg-opacity-80 lg:backdrop-blur-lg lg:transform-none lg:opacity-100 lg:w-64 transition-transform duration-300 ease-in-out"
          style={{ display: isSidebarOpen || isLargeScreen ? "flex" : "none" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-full hover:bg-gray-200 transition"
            >
              <X className="w-6 h-6 text-gray-800" />
            </motion.button>
          </div>
          <nav className="space-y-2">
            {[
              "profile",
              "personal",
              "contact",
              "preferences",
              "institutes",
            ].map((section, index) => (
              <motion.button
                key={section}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  document
                    .getElementById(section)
                    .scrollIntoView({ behavior: "smooth" });
                  setIsSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-teal-100 hover:text-teal-600 transition"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition"
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </motion.button>
          </nav>
        </motion.aside>

        {!isSidebarOpen && !isLargeScreen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-teal-500 text-white rounded-full shadow-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition shadow-md"
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </motion.button>

          <div id="profile">
            <ProfileSection
              studentData={studentProfile}
              setStudentProfile={setStudentProfile}
              isEditing={isEditing}
            />
          </div>
          <div id="personal">
            <MainContent studentData={studentProfile} setStudentProfile={setStudentProfile} isEditing={isEditing} />
          </div>
          <div id="contact">
            <ContactInfo studentData={studentProfile} setStudentProfile={setStudentProfile} isEditing={isEditing} />
          </div>
          <div id="preferences">
            <PreferencesSection
              studentData={studentProfile}
              setStudentProfile={setStudentProfile}
              isEditing={isEditing}
            />
          </div>
          <div id="institutes">
            <InstituteRecommendations studentData={studentProfile} />
          </div>
        </motion.main>
      </div>
      <AnimatePresence>
        {showWelcome && studentProfile && (
          <WelcomePopup
            name={studentProfile.name}
            onClose={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
