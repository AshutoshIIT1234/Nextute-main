import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { upload_area, menu_icon, cross_icon } from "../assets";
import logo from "../assets/logo.svg";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    isAuthenticated,
    setShowLogin,
    setShowSignup,
    user,
    userType,
    logout,
  } = useContext(AppContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const servicesButtonRef = useRef(null);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsServicesDropdownOpen(false);
    setShowMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target) &&
        servicesButtonRef.current &&
        !servicesButtonRef.current.contains(event.target)
      ) {
        setIsServicesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-[#f2fffc] bg-opacity-60 backdrop-blur-md shadow-lg border-b border-gray-200 mb-5 sm:mb-10 sticky top-0 z-50"
    >
    <div className="w-full max-w-[94rem] h-24 mx-auto flex items-center justify-between py-4 px-4 sm:px-8 relative">
      <NavLink to="/">
        <motion.img
          src={logo}
          alt="Nextute Logo"
          className="w-28 sm:w-32 lg:w-40"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.3 }}
        />
      </NavLink>

      <nav className="hidden md:flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-nav-link" : ""}`
          }
        >
          <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Home</motion.p>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-nav-link" : ""}`
          }
        >
          <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>About Us</motion.p>
        </NavLink>
        <div className="relative">
          <button
            ref={servicesButtonRef}
            onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
            className="nav-link flex items-center gap-1"
          >
            <p>Services</p>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isServicesDropdownOpen && (
            <motion.div
              ref={servicesDropdownRef}
              className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <NavLink
                to="/services/courses"
                className="block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                onClick={() => setIsServicesDropdownOpen(false)}
              >
                <motion.div whileHover={{ x: 5 }}>Courses</motion.div>
              </NavLink>
              <NavLink
                to="/services/mentorship"
                className="block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                onClick={() => setIsServicesDropdownOpen(false)}
              >
                <motion.div whileHover={{ x: 5 }}>Mentorship</motion.div>
              </NavLink>
            </motion.div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-500 hover:bg-gray-100 transition overflow-hidden"
              disabled={isLoggingOut}
              ref={profileButtonRef}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={upload_area}
                  alt="profile icon"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </motion.button>

            {isDropdownOpen && (
              <motion.div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink
                  to={`/${userType}/dashboard`}
                  className="block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <motion.div whileHover={{ x: 5 }}>Dashboard</motion.div>
                </NavLink>
                <NavLink
                  to={`/support`}
                  className="block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <motion.div whileHover={{ x: 5 }}>Support</motion.div>
                </NavLink>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  <motion.div whileHover={{ x: 5 }}>
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </motion.div>
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <motion.button
              className="text-gray-700 px-6 py-2 border border-gray-500 rounded-full hover:bg-gray-50 transition"
              onClick={() => {
                setShowLogin(true);
                setShowSignup(false);
              }}
              whileHover={{ scale: 1.05, borderColor: "#2D7B67" }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-[#2D7B67] to-[#1F4C56] text-white px-6 py-2 rounded-full hover:shadow-lg transition relative overflow-hidden"
              onClick={() => {
                setShowSignup(true);
                setShowLogin(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0"
                whileHover={{ opacity: 0.3 }}
              />
              <span className="relative z-10">Sign Up</span>
            </motion.button>
          </>
        )}
      </nav>

      <img
        src={menu_icon}
        alt="menu-icon"
        onClick={() => setShowMenu(true)}
        className="w-6 md:hidden cursor-pointer"
      />

      <div
        className={`fixed inset-0 z-30 bg-white transition-transform duration-300 md:hidden ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b">
          <img src={logo} alt="logo" className="w-28" loading="lazy" />
          <img
            src={cross_icon}
            alt="close"
            onClick={() => setShowMenu(false)}
            className="w-6 h-6 cursor-pointer"
            loading="lazy"
          />
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)] px-6 py-4 flex flex-col gap-4 text-base font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="py-2">Home</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="py-2">About Us</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/services">
            <p className="py-2">Services</p>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                onClick={() => setShowMenu(false)}
                to={`/${userType}/dashboard`}
              >
                <p className="py-2">Dashboard</p>
              </NavLink>
              <NavLink
                onClick={() => setShowMenu(false)}
                to={`/support`}
              >
                <p className="py-2">Support</p>
              </NavLink>
              <button
                className="text-left py-2 text-gray-700"
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button
                className="text-gray-700 py-2 border border-gray-500 rounded-full w-full text-center"
                onClick={() => {
                  setShowLogin(true);
                  setShowSignup(false);
                  setShowMenu(false);
                }}
              >
                Login
              </button>
              <button
                className="bg-[#2D7B67] text-white py-2 rounded-full w-full text-center"
                onClick={() => {
                  setShowSignup(true);
                  setShowLogin(false);
                  setShowMenu(false);
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </motion.nav>
  );
};

export default Navbar;
