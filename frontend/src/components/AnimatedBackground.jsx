import { motion } from "framer-motion";

const AnimatedBackground = ({ children, variant = "default" }) => {
  const variants = {
    default: {
      gradient: "from-white via-emerald-50/20 to-teal-50/10",
      particles: 3
    },
    hero: {
      gradient: "from-emerald-50/30 via-teal-50/20 to-blue-50/10",
      particles: 5
    },
    dark: {
      gradient: "from-gray-900 via-emerald-900/20 to-teal-900/10",
      particles: 4
    }
  };

  const config = variants[variant] || variants.default;

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${config.gradient} overflow-hidden`}>
      {/* Animated floating orbs */}
      {[...Array(config.particles)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            background: `radial-gradient(circle, ${
              i % 2 === 0 
                ? "rgba(45, 123, 103, 0.3)" 
                : "rgba(16, 185, 129, 0.3)"
            }, transparent)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45, 123, 103, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 123, 103, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
