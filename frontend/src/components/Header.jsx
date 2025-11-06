import { cities } from "../assets/index.js";
import SearchBar from "./SearchBar.jsx";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { textReveal, staggerContainer, zoomRotate } from "../utils/animations3D";

const Header = () => {
  // Typewriter effect state
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = ["100+ Cities", "1000+ Institutes", "10000+ Students"];
  const navigate = useNavigate();

  // Typewriter effect logic
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  // Navigation handler for city clicks
  const handleCityClick = (cityName, isLast) => {
    if (isLast) {
      navigate("/institutes-on-location");
    } else {
      navigate(`/institutes-on-location?city=${encodeURIComponent(cityName)}`);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Heading and Subheading */}
      <motion.div 
        className="flex flex-col text-center relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#002639] flex flex-col sm:flex-row items-center justify-center"
          variants={textReveal}
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "linear-gradient(90deg, #002639, #2D7B67, #002639)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Search Across
          </motion.span>{" "}
          <span className="relative inline-block text-[#204B55] ml-2">
            <span className="invisible">"100+ Courses"</span>
            <motion.span 
              className="absolute left-0 top-0 whitespace-nowrap neon-glow"
              animate={{
                textShadow: [
                  "0 0 10px rgba(32, 75, 85, 0.5)",
                  "0 0 20px rgba(32, 75, 85, 0.8)",
                  "0 0 10px rgba(32, 75, 85, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              "{text}"
            </motion.span>
          </span>
          <span className="text-[#204B55] animate-blink"></span>
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-[#002639] font-normal mt-4 mx-auto max-w-3xl"
          variants={textReveal}
        >
          We don't just prepare you for exams - we prepare you for life
        </motion.p>
      </motion.div>

      {/* Search Bar */}
      <SearchBar />

      {/* Cities Images */}
      <motion.div 
        className="flex flex-row items-center gap-4 sm:gap-6 mt-8 sm:mt-12 overflow-x-auto scrollbar-hide px-4 w-full h-[30vh] max-w-5xl mx-auto relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {cities.map((city, index) => {
          const isLast = index === cities.length - 1;
          return (
            <motion.div
              key={city.id}
              className="flex-shrink-0 flex flex-col items-center text-center relative group perspective-1000"
              custom={index}
              variants={zoomRotate}
              whileHover={{ 
                scale: 1.15,
                rotateY: 10,
                z: 50,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 blur-xl"
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Image */}
              <motion.img
                src={city.src}
                alt={city.alt}
                onClick={() => handleCityClick(city.name, isLast)}
                className="cursor-pointer h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-cover rounded-full border-2 border-[#204B55] shadow-md relative z-10 preserve-3d"
                role="button"
                aria-label={isLast ? "View more cities" : `Search institutes in ${city.name}`}
                loading="lazy"
                style={isLast ? { backdropFilter: "blur(3.1px)", background: "rgba(255, 255, 255, 0.51)", filter: "blur(3.1px)" } : {}}
                whileHover={{ rotateZ: 5 }}
              />

              {/* Name or "More" Overlay */}
              <motion.p
                className={`mt-2 text-[#204B55] font-medium text-xs sm:text-sm ${
                  isLast ? "hidden" : ""
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {city.name}
              </motion.p>

              {/* More Text Overlay for last image */}
              {isLast && (
                <motion.button
                  className="absolute inset-0 flex items-center justify-center underline text-black font-semibold text-xs sm:text-sm md:text-base z-20"
                  onClick={() => navigate("/institutes-on-location")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  More...
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Header;
