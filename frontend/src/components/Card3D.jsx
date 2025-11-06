import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const Card3D = ({ 
  children, 
  className = "",
  tiltMaxAngle = 10,
  scale = 1.02,
  glowColor = "rgba(45, 123, 103, 0.3)",
  ...props 
}) => {
  return (
    <Tilt
      tiltMaxAngleX={tiltMaxAngle}
      tiltMaxAngleY={tiltMaxAngle}
      perspective={1000}
      scale={scale}
      transitionSpeed={2000}
      gyroscope={true}
      className={className}
      {...props}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 blur-xl"
          style={{ background: glowColor }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </Tilt>
  );
};

export default Card3D;
