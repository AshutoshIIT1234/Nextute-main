import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ScrollReveal = ({ 
  children, 
  variant = "fadeInUp",
  delay = 0,
  duration = 0.6,
  once = true 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const variants = {
    fadeInUp: {
      hidden: { opacity: 0, y: 60, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration, delay, ease: "easeOut" }
      }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -60, rotateY: -15 },
      visible: { 
        opacity: 1, 
        x: 0, 
        rotateY: 0,
        transition: { duration, delay, ease: "easeOut" }
      }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 60, rotateY: 15 },
      visible: { 
        opacity: 1, 
        x: 0, 
        rotateY: 0,
        transition: { duration, delay, ease: "easeOut" }
      }
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.5, rotate: -10 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        transition: { duration, delay, type: "spring", stiffness: 200 }
      }
    },
    rotate3D: {
      hidden: { opacity: 0, rotateX: -90, rotateY: -45 },
      visible: { 
        opacity: 1, 
        rotateX: 0, 
        rotateY: 0,
        transition: { duration, delay, ease: "easeOut" }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 100 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, type: "spring", stiffness: 100 }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
