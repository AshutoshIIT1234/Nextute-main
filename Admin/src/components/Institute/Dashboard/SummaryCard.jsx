import { motion } from "framer-motion";

const SummaryCard = ({ title, value, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}
      className="bg-[#E6EDE2] rounded-2xl shadow-md p-4 sm:p-6 flex items-center gap-3 sm:gap-4 border border-[#2D7A66]/20 min-w-0"
    >
      {icon}
      <div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#144E53] truncate">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#144E53]">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default SummaryCard;