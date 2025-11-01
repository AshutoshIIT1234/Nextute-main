import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSchool,
  FaUsers,
  FaStar,
  FaBriefcase,
  FaUserTie,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

const SidePanel = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    {
      name: "Institutes",
      path: "/admin/institutes",
      icon: <FaSchool className="w-5 h-5" />,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: <FaStar className="w-5 h-5" />,
    },
    {
      name: "Jobs",
      path: "/admin/jobs",
      icon: <FaBriefcase className="w-5 h-5" />,
    },
    {
      name: "Team",
      path: "/admin/team",
      icon: <FaUserTie className="w-5 h-5" />,
    },
    {
      name: "Admin",
      path: "/admin/all-admins",
      icon: <FaUserShield className="w-5 h-5" />,
    },
  ];

  const handleNavigation = (path, action) => {
    if (action) {
      action();
    } else {
      navigate(path);
      setIsOpen(false);
    }
    document.body.style.overflow = "auto"; // Restore body scroll
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-[#2D7A66] text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 640) && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed sm:static top-0 left-0 h-full w-64 bg-[#144E53] text-white flex flex-col shadow-xl z-40"
          >
            <div className="p-4 sm:p-6 flex items-center gap-3 border-b border-[#2D7A66]">
              <h2 className="text-lg sm:text-xl font-bold">Nextute Admin</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: "#2D7A66", x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#2D7A66] transition-colors duration-200"
                  onClick={() => handleNavigation(link.path, link.action)}
                  aria-label={link.name}
                >
                  {link.icon}
                  <span className="text-sm sm:text-base">{link.name}</span>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="sm:hidden fixed inset-0 bg-black z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidePanel;
