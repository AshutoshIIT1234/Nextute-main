import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import { motion } from "framer-motion";
import * as assets from "../../../assets/index.js";
import { Upload } from "lucide-react";
import Loader from "./Loader";

const ProfileSection = ({ studentData, isEditing }) => {
  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      picture: previewUrl,
    }));
    try {
      const formData = new FormData();
      formData.append("image", file);
      const studentId = studentData?.id;
      const response = await axios.patch(
        `${config.apiBaseUrl}/api/students/${studentId}/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.data && response.data.profileImage) {
        setProfile((prev) => ({
          ...prev,
          picture: response.data.profileImage,
        }));
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading image. Please try again.");
      console.error("Image upload error:", err);
    }
  };
  const data = studentData || {};
  const [profile, setProfile] = useState({
    name: data.name || "Student Name",
    picture: assets.profileImage,
    completion: 0,
  });
  useEffect(() => {
    console.log("[DEBUG] studentData:", {
      name: data.name,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      student_id: data.student_id,
      phone_number: data.phone_number,
      email: data.email,
      address: data.address,
      profileImage: data.profileImage,
      languagePreference: data.languagePreference,
      bio: data.bio,
      hobbies: data.hobbies,
      learningStyle: data.learningStyle,
      targetExams: data.targetExams,
      attemptYear: data.attemptYear,
      studyMode: data.studyMode,
      currentClass: data.currentClass,
      careerGoal: data.careerGoal,
      preparationReason: data.preparationReason,
      studyHours: data.studyHours,
      preferredTime: data.preferredTime,
      favoriteSubjects: data.favoriteSubjects,
      socialLinks: data.socialLinks,
      achievements: data.achievements,
      studyResources: data.studyResources,
      mentorshipPreference: data.mentorshipPreference,
      studyGoals: data.studyGoals,
      extracurriculars: data.extracurriculars,
    });
  }, [data.address]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentData) return;
    const allowedFields = [
      "name", "gender", "date_of_birth", "student_id", "phone_number", "email", "address", "profileImage", "languagePreference", "bio", "hobbies", "learningStyle", "targetExams", "attemptYear", "studyMode", "currentClass", "careerGoal", "preparationReason", "studyHours", "preferredTime", "favoriteSubjects", "socialLinks", "achievements", "studyResources", "mentorshipPreference", "studyGoals", "extracurriculars"
    ];
    const fields = allowedFields.map((key) => {
      if (["socialLinks", "studyGoals"].includes(key)) {
        if (key === "socialLinks") {
          const social = data.socialLinks || {};
          const socialKeys = ["linkedin", "github", "twitter", "instagram"];
          return socialKeys.every((k) => social[k]) ? 1 : 0;
        }
        if (key === "studyGoals") {
          const goals = data.studyGoals || {};
          return goals.shortTerm && goals.longTerm ? 1 : 0;
        }
        return 0;
      }
      return data[key] ? 1 : 0;
    });
    let completion = (fields.reduce((a, b) => a + b, 0) / allowedFields.length) * 100;
    completion = Math.min(completion, 100);
    setProfile((prev) => ({
      ...prev,
      completion: completion.toFixed(0),
      picture: data.profileImage || assets.profilePlaceholder,
      name: data.name || "Student Name",
    }));
    setTimeout(() => setIsLoading(false), 1000);
  }, [studentData]);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-7xl mx-auto bg-opacity-90 backdrop-blur-lg"
    >
      <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 transition aspect-square"
          >
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              <img
                src={profile.picture || assets.profilePlaceholder}
                alt="Student Profile"
                className="w-full h-full object-cover rounded-full"
              />
            )}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
              >
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload profile picture"
                />
              </motion.div>
            )}
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              {profile.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Nextute Student
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Loader isLoading={isLoading} completion={profile.completion} />
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Profile Completed
          </p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-sm sm:text-base text-teal-600 italic font-medium max-w-xs text-center"
          >
            "Empower your future with knowledge!"
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
