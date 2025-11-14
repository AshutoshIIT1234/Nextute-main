import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Badge,
  Code,
  Megaphone,
  Palette,
  FlaskConical,
  Users,
  Star,
} from "lucide-react";

const TeamCard = ({
  image,
  fullName = "Unknown",
  employeeId = "N/A",
  designation = "Team Member",
  department = "Unknown",
  isSpecial = false,
  delay = 0,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.25)" },
  };

  const imageVariants = {
    hover: { scale: 1.1, rotate: 5 },
  };

  const textVariants = {
    hover: { scale: 1.03, color: isSpecial ? "#E6EDE2" : "#144E53" },
  };

  const departmentIcons = {
    "EXECUTIVE OFFICE": <Star size={18} className="text-[#93E9A2]" />,
    "Co-Founder": <Users size={18} className="text-[#2D7A66]" />,
    Technology: <Code size={18} className="text-[#144E53]" />,
    Marketing: <Megaphone size={18} className="text-[#93E9A2]" />,
    Designing: <Palette size={18} className="text-[#2D7A66]" />,
    "R&D": <FlaskConical size={18} className="text-[#144E53]" />,
    "Business Development": <Users size={18} className="text-[#93E9A2]" />,
    Unknown: <User size={18} className="text-[#2D7A66]" />,
  };

  const departmentColors = {
    "EXECUTIVE OFFICE": "border-[#93E9A2] bg-[#93E9A2]/10",
    "Co-Founder": "border-[#2D7A66] bg-[#2D7A66]/10",
    Technology: "border-[#144E53] bg-[#144E53]/10",
    Marketing: "border-[#93E9A2] bg-[#93E9A2]/10",
    Designing: "border-[#2D7A66] bg-[#2D7A66]/10",
    "R&D": "border-[#144E53] bg-[#144E53]/10",
    "Business Development": "border-[#93E9A2] bg-[#93E9A2]/10",
    Unknown: "border-[#E6EDE2] bg-[#E6EDE2]/10",
  };

  return (
    <div>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ duration: 0.6, ease: "easeOut", delay: delay / 1000 }}
        className={`
          relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 md:p-6 bg-white/90 backdrop-blur-lg
          border-2 ${departmentColors[department] || departmentColors.Unknown}
          shadow-lg hover:shadow-2xl
          transition-all duration-500
          cursor-pointer h-[320px] md:h-[360px] group
          ${isSpecial ? "relative overflow-hidden" : ""}
        `}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View profile of ${fullName}`}
      >
        {isSpecial && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-2 h-2 bg-[#93E9A2] rounded-full animate-ping top-2 left-2"></div>
            <div className="absolute w-2 h-2 bg-[#93E9A2] rounded-full animate-ping bottom-2 right-2"></div>
          </div>
        )}
        <div className="relative mb-3 md:mb-4">
          <motion.div
            variants={imageVariants}
            transition={{ duration: 0.4 }}
            className="w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32 mx-auto rounded-full overflow-hidden ring-3 ring-[#93E9A2]/40 hover:ring-[#2D7A66]/60 transition-all duration-300"
          >
            {image && !imageError && !image.includes("example.com") ? (
              <img
                src={image.replace("/view?usp=drive_link", "/uc?export=view")}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log(`Failed to load image for ${fullName}: ${image}`);
                  setImageError(true);
                }}
                onLoad={() =>
                  console.log(`Image loaded successfully for ${fullName}`)
                }
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#93E9A2]/30 to-[#2D7A66]/30">
                <User size={32} className="text-[#144E53]" />
              </div>
            )}
          </motion.div>
          {isSpecial && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + delay / 1000, duration: 0.5 }}
              className="absolute -top-2 -right-2 bg-[#93E9A2] text-[#144E53] px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            >
              ⭐ CEO
            </motion.div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-start text-center space-y-2 md:space-y-3">
          <motion.h3
            variants={textVariants}
            className="text-lg md:text-xl font-extrabold text-[#144E53] truncate"
          >
            {fullName}
          </motion.h3>

          <div className="flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base text-[#2D7A66]">
            <Badge size={16} />
            <span className="font-medium truncate">
              Employee ID: {employeeId}
            </span>
          </div>

          <motion.p
            variants={textVariants}
            className="text-sm md:text-base font-semibold text-[#144E53] truncate"
          >
            {designation}
          </motion.p>

          <div className="flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold text-[#144E53]">
            {departmentIcons[department] || departmentIcons.Unknown}
            <span
              className={`px-2 md:px-3 py-1 rounded-full truncate ${
                departmentColors[department] || departmentColors.Unknown
              }`}
            >
              {department}
            </span>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#93E9A2]/0 to-[#2D7A66]/0 hover:from-[#93E9A2]/10 hover:to-[#2D7A66]/10 rounded-2xl transition-all duration-400 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </motion.div>
    </div>
  );
};

export default TeamCard;
