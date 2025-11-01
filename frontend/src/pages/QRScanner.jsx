import { motion } from "framer-motion";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const QRScanner = () => {
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result && result[0]) {
      try {
        const rawValue = result[0].rawValue;
        console.log("Scanned QR code URL:", rawValue);
        const url = new URL(rawValue);
        const validHostnames = ["localhost:5173", "www.nextute.com"];
        if (
          !validHostnames.includes(url.host) ||
          !url.pathname.startsWith("/team/")
        ) {
          throw new Error(
            `Invalid QR code URL: Expected host in ${validHostnames}, got ${url.host}`
          );
        }
        const certificateId = url.pathname.split("/").pop();
        if (certificateId) {
          console.log(`Navigating to /team/${certificateId}`);
          navigate(`/team/${certificateId}`);
        } else {
          throw new Error(
            "Invalid certificate ID: No certificate ID found in URL"
          );
        }
      } catch (err) {
        console.error("QR scan error:", err.message);
        alert(
          `Invalid QR code: ${err.message}. Please scan a valid team member QR code.`
        );
      }
    }
  };

  const handleError = (err) => {
    console.error("QR scan error:", err);
    alert(
      "Failed to scan QR code. Please ensure camera permissions are granted and try again."
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-teal-600 mb-6"
            onClick={() => navigate("/team")}
          >
            <ArrowLeft size={20} />
            Back to Team
          </motion.button>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
            Scan Team Member QR Code
          </h2>

          <div className="relative">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              scanDelay={500}
              styles={{
                container: {
                  width: "100%",
                  maxWidth: "400px",
                  margin: "0 auto",
                },
                video: { width: "100%", borderRadius: "12px" },
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-teal-500/50 rounded-md"></div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Point your camera at a team member's QR code to view their profile.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default QRScanner;
