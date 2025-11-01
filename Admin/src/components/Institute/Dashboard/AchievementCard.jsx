import { motion } from "framer-motion";

const AchievementCard = ({ achievement }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}
      className="bg-[#E6EDE2] rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-[#2D7A66]/20 min-w-0"
    >
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#144E53] truncate">
        {achievement.title || "Achievement"}
      </h3>
      <p className="text-xs sm:text-sm text-gray-700 break-words mt-1">
        {achievement.description || "No description available"}
      </p>
      <p className="text-xs sm:text-sm text-[#2D7A66] mt-2">
        Date: {achievement.date || "N/A"}
      </p>
    </motion.div>
  );
};

export default AchievementCard;