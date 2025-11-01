import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#144E53] text-white p-4 sm:p-6 text-center"
    >
      <p className="text-xs sm:text-sm md:text-base">
        &copy; {new Date().getFullYear()} Nextute. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;