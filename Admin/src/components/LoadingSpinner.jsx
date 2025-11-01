import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-[#2D7A66] border-[#144E53] rounded-full"
      />
    </motion.div>
  );
};

export default LoadingSpinner;