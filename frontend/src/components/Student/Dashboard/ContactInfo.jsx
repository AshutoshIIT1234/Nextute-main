import { useRef } from "react";
import { motion } from "framer-motion";
import * as assets from "../../../assets/index.js";
import { Mail, Phone } from "lucide-react";

const ContactInfo = ({ studentData, setStudentProfile, isEditing }) => {
  const refs = {
    phoneNumber: useRef(null),
  };

  const contactFields = [
    {
      icon: <Phone className="w-6 h-6 text-teal-900" />,
      label: "Phone Number",
      value: studentData?.phone_number || "",
      onChange: (e) => setStudentProfile(prev => ({ ...prev, phone_number: e.target.value })),
      ref: refs.phoneNumber,
      fieldKey: "phone_number",
      editable: true,
      placeholder: "Enter phone number",
    },
    {
      icon: <Mail className="w-6 h-6 text-teal-900" />,
      label: "Email Address",
      value: studentData?.email || "Not provided",
      onChange: () => {},
      fieldKey: "email",
      editable: false,
      placeholder: "Not provided",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 bg-opacity-80 backdrop-blur-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <img
          src={assets.dashboard_contact}
          alt="Contact Icon"
          className="w-6 h-6"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          Contact Information
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {contactFields.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              {field.icon}
              <h3 className="text-lg font-semibold text-gray-800">
                {field.label}
              </h3>
            </div>
            <motion.input
              type="text"
              placeholder={field.placeholder}
              value={field.value}
              onChange={field.onChange}
              disabled={!field.editable || !isEditing}
              ref={field.ref}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex-1 p-3 rounded-lg border ${
                field.editable && isEditing
                  ? "border-teal-500 bg-white"
                  : "border-gray-300 bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactInfo;
