import { useRef, useState } from "react";
import { motion } from "framer-motion";
import * as assets from "../../../assets/index.js";
import { Award, BookOpen, Lock } from "lucide-react";
import { FaMale, FaFemale, FaUser } from "react-icons/fa";

const genderIcons = {
  male: <FaMale className="w-8 h-8 text-teal-700" />,
  female: <FaFemale className="w-8 h-8 text-teal-700" />,
  default: <FaUser className="w-8 h-8 text-teal-700" />,
};

const MainContent = ({ studentData, setStudentProfile, isEditing }) => {
  const data = studentData || {};
  const refs = {
    address: useRef(null),
    bio: useRef(null),
    achievements: useRef(null),
  };

  const handleTagChange = (field, value) => {
    setStudentProfile((prev) => {
      const updated = {
        ...prev,
        [field]: prev[field]?.includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...(prev[field] || []), value],
      };
      return updated;
    });
  };

  const fields = [
    {
      icon: assets.student_id,
      label: "Student ID",
      value: data.student_id || "N/A",
      editable: false,
    },
    {
      icon:
        data.gender?.toLowerCase() === "male"
          ? genderIcons.male
          : data.gender?.toLowerCase() === "female"
          ? genderIcons.female
          : genderIcons.default,
      label: "Gender",
      value: data.gender || "Not specified",
      editable: false,
    },
    {
      icon: assets.address,
      label: "Address",
      value: data.address ?? "",
      onChange: (e) => {
        setStudentProfile((prev) => {
          const updated = { ...prev, address: e.target.value };
          return updated;
        });
      },
      ref: refs.address,
      editable: true,
      placeholder: "Enter your address",
      fieldKey: "address",
    },
    {
      icon: assets.dob,
      label: "Date of Birth",
      value: data.date_of_birth
        ? new Date(data.date_of_birth).toLocaleDateString()
        : "Not provided",
      editable: false,
    },
    {
      icon: <BookOpen className="w-6 h-6 text-teal-800" />,
      label: "Short Bio",
      value: data.bio ?? "",
      onChange: (e) => {
        setStudentProfile((prev) => {
          const updated = { ...prev, bio: e.target.value };
          return updated;
        });
      },
      ref: refs.bio,
      editable: true,
      placeholder: "Tell us about yourself",
      fieldKey: "bio",
      isTextArea: true,
    },
    {
      icon: <Award className="w-6 h-6 text-teal-800" />,
      label: "Achievements",
      value: data.achievements ?? [],
      fieldKey: "achievements",
      editable: true,
      type: "tags",
      options: ["Math Olympiad Winner", "Science Fair 1st", "Debate Champion"],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 bg-opacity-80 backdrop-blur-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              {typeof field.icon === "string" ? (
                <img
                  src={field.icon}
                  alt={`${field.label} Icon`}
                  className="w-6 h-6"
                />
              ) : (
                field.icon
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {field.label}
              </h3>
            </div>
            {field.type === "tags" ? (
              <div className="flex flex-wrap gap-2">
                {field.options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      isEditing && handleTagChange(field.fieldKey, option)
                    }
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm ${
                      data[field.fieldKey]?.includes(option)
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    } ${isEditing ? "hover:bg-teal-600" : ""} transition`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            ) : field.editable ? (
              field.isTextArea ? (
                <motion.textarea
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!isEditing}
                  ref={field.ref}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-1 p-3 rounded-lg border ${
                    isEditing
                      ? "border-teal-500 bg-white"
                      : "border-gray-300 bg-gray-100"
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 transition min-h-[100px]`}
                />
              ) : (
                <motion.input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!isEditing}
                  ref={field.ref}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-1 p-3 rounded-lg border ${
                    isEditing
                      ? "border-teal-500 bg-white"
                      : "border-gray-300 bg-gray-100"
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                />
              )
            ) : (
              <p className="flex-1 p-3 text-gray-600">{field.value}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MainContent;
