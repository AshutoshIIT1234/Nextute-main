import { motion } from "framer-motion";

const FloatingElement = ({ 
  children, 
  duration = 3, 
  yOffset = 20,
  xOffset = 0,
  delay = 0,
  className = "" 
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-yOffset, yOffset, -yOffset],
        x: [-xOffset, xOffset, -xOffset],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
