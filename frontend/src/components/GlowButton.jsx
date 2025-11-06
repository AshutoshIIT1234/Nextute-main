import { motion } from "framer-motion";

const GlowButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  className = "",
  ...props 
}) => {
  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-emerald-600 to-teal-600",
      glow: "rgba(45, 123, 103, 0.5)",
      hoverGlow: "rgba(45, 123, 103, 0.8)"
    },
    secondary: {
      bg: "bg-gradient-to-r from-blue-600 to-cyan-600",
      glow: "rgba(59, 130, 246, 0.5)",
      hoverGlow: "rgba(59, 130, 246, 0.8)"
    },
    accent: {
      bg: "bg-gradient-to-r from-purple-600 to-pink-600",
      glow: "rgba(168, 85, 247, 0.5)",
      hoverGlow: "rgba(168, 85, 247, 0.8)"
    }
  };

  const config = variants[variant] || variants.primary;

  return (
    <motion.button
      className={`${config.bg} text-white px-6 py-3 rounded-lg font-semibold relative overflow-hidden ${className}`}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 0 30px ${config.hoverGlow}`,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 3
        }}
      />
      
      {/* Glow pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow: [
            `0 0 20px ${config.glow}`,
            `0 0 40px ${config.hoverGlow}`,
            `0 0 20px ${config.glow}`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlowButton;
