import React, { Suspense, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Ad from "../components/Ad";
import Test from "../components/Test";
import SearchTest from "../components/SearchTest";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
const Testimonial = React.lazy(() => import("../components/Testimonial"));

const HomePage = () => {
  const { setUserLocation } = useContext(AppContext);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error or denied", error);
          setUserLocation(null); // fallback to default
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setUserLocation(null);
    }
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-b from-white via-emerald-50/10 to-teal-50/5 relative">
      {/* Animated background orbs */}
      <motion.div
        className="fixed top-20 left-10 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 50, 0],
          x: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <Ad />
      </motion.div>
      
      <Suspense fallback={
        <motion.div 
          style={{minHeight:200}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
        </motion.div>
      }>
        <Testimonial />
      </Suspense>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <Test />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <SearchTest />
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default HomePage;