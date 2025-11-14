import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import * as assets from "../assets/index.js";
import { card3DVariants, button3D } from "../utils/animations3D";

// Default fallback image
const DEFAULT_IMAGE =
  assets.coaching || "https://via.placeholder.com/400x300?text=Institute+Image";

const defaultInstitute = {
  id: "default-1",
  institute_name: "Sample Coaching Institute",
  image: DEFAULT_IMAGE,
  rating: 4.5,
  address: "123 Main Street, Hajipur – 844101",
  tags: ["JEE", "NEET", "Class 12"],
};

const Card = ({ institute = defaultInstitute }) => {
  const navigate = useNavigate();

  // Normalize backend data to handle inconsistencies
  const normalizedInstitute = {
    id: institute.id?.trim() || defaultInstitute.id,
    name:
      institute.basic_info?.institute_name?.trim() ||
      institute.basic_info?.name?.trim() ||
      institute.institute_name?.trim() ||
      defaultInstitute.institute_name,
    image:
      institute.basic_info?.logo?.trim() ||
      institute.image?.trim() ||
      defaultInstitute.image,
    rating:
      typeof institute.rating === "number" &&
      institute.rating >= 0 &&
      institute.rating <= 5
        ? institute.rating
        : parseFloat(institute.rating) || defaultInstitute.rating,
    address:
      institute.contact_details?.headOffice?.address?.trim() ||
      institute.address?.trim() ||
      defaultInstitute.address,
    tags: Array.isArray(institute.basic_info?.exams)
      ? institute.basic_info.exams
          .map((exam) => exam?.trim()?.toUpperCase())
          .filter((tag) => tag)
          .slice(0, 3)
      : Array.isArray(institute.tags)
      ? institute.tags
          .filter((tag) => typeof tag === "string" && tag.trim())
          .slice(0, 3)
      : defaultInstitute.tags,
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const starCount =
      typeof rating === "string" ? parseFloat(rating) || 0 : rating;
    const fullStars = Math.floor(starCount);
    const hasHalfStar = starCount % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4"
          />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            className="text-gray-300 w-3 h-3 sm:w-4 sm:h-4"
          />
        ))}
        <span className="text-xs sm:text-sm text-gray-600 ml-1">
          {starCount.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[22rem] sm:max-w-[24rem] mx-auto my-4">
      <motion.div
        variants={card3DVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 border border-emerald-200/40 rounded-2xl shadow-lg overflow-hidden min-h-[26rem] sm:h-[30rem] flex flex-col relative preserve-3d cursor-pointer"
        onClick={() => navigate(`/institute/overview/${normalizedInstitute.id}`)}
      >
        {/* Shimmer effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 5
          }}
          style={{ pointerEvents: "none" }}
        />
      {/* Image Section */}
      <div className="w-full h-44 sm:h-56 p-3 relative overflow-hidden flex-shrink-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        />
        <motion.img
          src={normalizedInstitute.image}
          alt={`Coaching - ${normalizedInstitute.name}`}
          className="w-full h-full object-cover rounded-xl relative z-0"
          loading="lazy"
          whileHover={{ scale: 1.08, rotate: 1 }}
          transition={{ duration: 0.4 }}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-3 sm:p-5 space-y-2 sm:space-y-3 min-h-0">
        {/* Title + Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-600 line-clamp-2 sm:line-clamp-1 flex-1">
            {normalizedInstitute.name}
          </h2>
          <div className="text-emerald-600 flex-shrink-0">
            {renderStars(normalizedInstitute.rating)}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-gray-700">
          <FaLocationDot className="text-emerald-600 w-3 h-3 sm:w-4 sm:h-4 shrink-0 mt-1" />
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
            {normalizedInstitute.address}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {normalizedInstitute.tags.length > 0 ? (
            normalizedInstitute.tags.map((tag) => (
              <span
                key={tag}
                className="bg-emerald-100 text-emerald-800 text-[0.65rem] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full hover:bg-emerald-200 transition whitespace-nowrap"
              >
                {tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs italic">No tags</span>
          )}
        </div>
      </div>

      {/* Button Section */}
      <div className="flex items-center justify-center p-3 sm:p-5 pt-0 pb-4">
        <motion.button
          variants={button3D}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="w-full max-w-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-xl relative overflow-hidden preserve-3d"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/institute/overview/${normalizedInstitute.id}`);
          }}
        >
          {/* Button glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0"
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          <BsChatTextFill className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          <span className="relative z-10">Enquiry Now</span>
        </motion.button>
      </div>
    </motion.div>
    </div>
  );
};

export default Card;
