import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import earlyBirdWebGif from "../assets/early bird web.gif";
import earlyBirdMobileGif from "../assets/early-bird mobile.gif";

const EarlyBirdPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("earlyBirdPopupSeen");

    if (!hasSeenPopup) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("earlyBirdPopupSeen", "true");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePopupClick = () => {
    setShowPopup(false);
    navigate("services/mentorship");
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all hover:scale-110"
                aria-label="Close popup"
              >
                <X size={24} className="text-gray-700" />
              </button>

              {/* Clickable GIF Container */}
              <div
                onClick={handlePopupClick}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02] bg-white"
              >
                {/* Desktop GIF */}
                {!isMobile && (
                  <img
                    src={earlyBirdWebGif}
                    alt="Early Bird Offer - Click to view mentorship plans"
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                )}

                {/* Mobile GIF */}
                {isMobile && (
                  <img
                    src={earlyBirdMobileGif}
                    alt="Early Bird Offer - Click to view mentorship plans"
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                  <span className="text-white font-bold text-lg bg-primary px-6 py-3 rounded-full shadow-lg">
                    Click to View mentors →
                  </span>
                </div>
              </div>

             
             
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EarlyBirdPopup;
