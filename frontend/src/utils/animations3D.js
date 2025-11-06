// 3D Animation Utilities and Variants for Framer Motion

// Floating animation for elements
export const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 3D Card flip animation
export const cardFlip3D = {
  initial: { rotateY: 0 },
  hover: {
    rotateY: 180,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

// Parallax scroll variants
export const parallaxVariants = {
  initial: { y: 0, opacity: 0 },
  animate: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: custom * 0.1,
      ease: "easeOut"
    }
  })
};

// 3D Perspective card
export const card3DVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: -15,
    rotateY: -15
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    rotateX: 5,
    rotateY: 5,
    z: 50,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Stagger children animation
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Slide in from sides with 3D effect
export const slideIn3D = (direction = "left") => ({
  initial: {
    x: direction === "left" ? -100 : 100,
    opacity: 0,
    rotateY: direction === "left" ? -45 : 45
  },
  animate: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
});

// Bounce in with 3D rotation
export const bounceIn3D = {
  initial: {
    scale: 0,
    opacity: 0,
    rotateX: -180
  },
  animate: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 0.8
    }
  }
};

// Morph animation
export const morphVariants = {
  initial: { 
    borderRadius: "50%",
    scale: 0.5,
    opacity: 0
  },
  animate: { 
    borderRadius: ["50%", "20%", "10%"],
    scale: 1,
    opacity: 1,
    transition: { 
      duration: 1,
      ease: "easeInOut"
    }
  }
};

// Glowing pulse effect
export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(45, 123, 103, 0.3)",
      "0 0 40px rgba(45, 123, 103, 0.6)",
      "0 0 20px rgba(45, 123, 103, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Text reveal animation
export const textReveal = {
  initial: { 
    opacity: 0,
    y: 50,
    rotateX: -90
  },
  animate: { 
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Zoom with rotation
export const zoomRotate = {
  initial: {
    scale: 0,
    rotate: -180,
    opacity: 0
  },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3
    }
  }
};

// Wave animation for backgrounds
export const waveAnimation = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// 3D Button press effect
export const button3D = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    rotateX: 10,
    rotateY: 10,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    rotateX: -5,
    rotateY: -5,
    transition: { duration: 0.1 }
  }
};

// Scroll-triggered fade in up
export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  whileInView: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  viewport: { once: true, amount: 0.3 }
};

// Magnetic hover effect (for buttons)
export const magneticHover = {
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

// Ripple effect
export const rippleEffect = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};
