import logo from "../assets/logo.svg";
import { instagram, linkedin } from "../assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations3D";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#f2fffc] to-emerald-50/30 border-t border-gray-200 px-4 sm:px-6 lg:px-16 py-10 sm:py-14 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-cyan-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
        {/* Left Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-start">
          <img
            src={logo}
            alt="Nextute Logo"
            className="w-40 sm:w-52 mb-4 hover:cursor-pointer"
          />
          
          <div className="text-[#000] font-semibold space-y-1 ml-5 text-sm sm:text-base">
            <p>Contact Us</p>
            <p>Office Address:</p>
            <p>Nextute EdTech Pvt. Ltd.</p>
            <p>Patna, Bihar</p>
            <p>Email: contact@nextute.com</p>
          </div>

          <p className="mt-3 font-semibold text-[#000] ml-5 text-sm sm:text-base">
            Connect With Us
          </p>
          <div className="flex gap-4 mt-2 ml-5">
            <Link
              to="https://www.instagram.com/nextute_edtech/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={instagram}
                alt="Instagram"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </Link>

            <Link
              to="https://www.linkedin.com/company/nextute?trk=blended-typeahead"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={linkedin}
                alt="LinkedIn"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-sm:ml-5">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#000] gradient-text">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 font-medium text-[#000] text-sm sm:text-base">
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/about">About Us</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/institutes-on-location">Find Coaching</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/review">Write A Review</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#000] gradient-text">
              For Students
            </h3>
            <ul className="mt-4 space-y-2 font-medium text-[#000] text-sm sm:text-base">
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/institute-compare">Compare Institutes</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/review">Write a Review</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* For Coaching Centers */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#000] gradient-text">
              For Coaching Centers
            </h3>
            <ul className="mt-4 space-y-2 font-medium text-[#000] text-sm sm:text-base">
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/student-feedback-dashboard">Student Feedback Dashboard</Link>
              </li>
              <li className="hover:text-[#2D7B67] transition-colors">
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-gray-300 mt-10 pt-6 text-center text-sm sm:text-xl text-gray-800 relative z-10">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[#2D7B67]">
          Nextute EdTech Pvt. Ltd.
        </span>
        , All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
