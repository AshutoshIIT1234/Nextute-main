import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CoursesComingSoon = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center min-h-[calc(100vh-400px)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">📚</div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
        >
          Courses Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          We're working hard to bring you the best online courses. Stay tuned for exciting learning opportunities!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <NavLink
            to="/"
            className="bg-[#2D7B67] text-white px-8 py-3 rounded-full hover:bg-[#1F4C56] transition-all transform hover:scale-105"
          >
            Back to Home
          </NavLink>
          <NavLink
            to="/about"
            className="border-2 border-[#2D7B67] text-[#2D7B67] px-8 py-3 rounded-full hover:bg-[#2D7B67] hover:text-white transition-all transform hover:scale-105"
          >
            Learn More About Us
          </NavLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-4">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-semibold text-lg mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals with years of experience</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2">Flexible Learning</h3>
              <p className="text-gray-600">Study at your own pace, anytime and anywhere</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-semibold text-lg mb-2">Certifications</h3>
              <p className="text-gray-600">Earn recognized certificates upon course completion</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default CoursesComingSoon;
