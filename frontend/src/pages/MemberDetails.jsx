import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { User, Badge, Mail, ArrowLeft, X } from "lucide-react";
import axios from "axios";
import QRCode from "qrcode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { FaSpinner } from "react-icons/fa";

const MemberDetails = () => {
  const { certificateNo } = useParams();
  const [member, setMember] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);

  useEffect(() => {
    const fetchMember = async () => {
      if (!certificateNo || certificateNo === "undefined") {
        console.error("Invalid certificateNo:", certificateNo);
        navigate("/team");
        return;
      }
      try {
        const { data } = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/employees/member/${certificateNo}`
        );
        console.log("Member data received:", data);
        setMember(data);

        const url = `http://www.nextute.com/team/${certificateNo}`;
        const qrUrl = await QRCode.toDataURL(url, {
          width: window.innerWidth < 640 ? 100 : 150,
        });
        setQrCodeUrl(qrUrl);
        console.log(`QR code generated for ${data.fullName}: ${url}`);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching member:", err);
        navigate("/team");
      }
    };
    fetchMember();
  }, [certificateNo, navigate, VITE_BACKEND_BASE_URL]);

  const handleDownloadCertificate = async () => {
    if (member?.certificateURL) {
      try {
        const response = await fetch(member.certificateURL);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${member.fullName}-certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading certificate:", err);
      }
    }
  };

  const handleShowCertificate = () => {
    setShowCertificate(!showCertificate);
  };

  const isImageUrl = (url) => {
    return /\.(png|jpg|jpeg|gif)$/i.test(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6EDE2] to-[#D1E0C9] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner size={32} className="text-[#2D7A66]" />
        </motion.div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6EDE2] to-[#D1E0C9] flex items-center justify-center">
        <p className="text-lg md:text-xl text-[#144E53] font-semibold">
          Member not found
        </p>
      </div>
    );
  }

  const imageUrl = member.image?.includes("drive.google.com")
    ? member.image.replace("/view?usp=drive_link", "/uc?export=view")
    : member.image;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6EDE2] to-[#D1E0C9] font-sans flex flex-col relative">
      <div
        className={`transition-all duration-300 ${
          showCertificate ? "backdrop-blur-md" : ""
        }`}
      >
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-7xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-[#93E9A2]/20 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#93E9A2]/10 to-[#2D7A66]/10 opacity-50" />
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2 text-[#144E53] bg-[#93E9A2]/30 px-4 py-2 rounded-full mb-6 hover:bg-[#93E9A2]/50 transition-all duration-300 text-sm sm:text-base font-medium z-10"
              onClick={() => navigate("/team")}
              aria-label="Back to Team"
            >
              <ArrowLeft size={20} />
              Back to Team
            </motion.button>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 z-10">
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-40 sm:w-48 md:w-52 lg:w-60 h-40 sm:h-48 md:h-52 lg:h-60 rounded-full overflow-hidden ring-4 ring-[#93E9A2]/60 shadow-md"
                >
                  {imageUrl && !imageUrl.includes("example.com") ? (
                    <img
                      src={imageUrl}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(
                          `Failed to load image for ${member.fullName}: ${imageUrl}`
                        );
                      }}
                      onLoad={() =>
                        console.log(
                          `Image loaded successfully for ${member.fullName}`
                        )
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#93E9A2]/40 to-[#2D7A66]/40">
                      <User size={48} className="text-[#144E53]" />
                    </div>
                  )}
                </motion.div>

                {qrCodeUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-4 flex flex-col items-center"
                  >
                    <img
                      src={qrCodeUrl}
                      alt={`${member.fullName}'s QR Code`}
                      className="w-28 sm:w-32 md:w-36 h-28 sm:h-32 md:h-36 rounded-lg shadow-md border border-[#93E9A2]/40"
                      onError={(e) => {
                        console.log(
                          `Failed to load QR code for ${
                            member.fullName
                          }: ${qrCodeUrl.substring(0, 30)}...`
                        );
                      }}
                      onLoad={() =>
                        console.log(
                          `QR code loaded successfully for ${member.fullName}`
                        )
                      }
                      loading="lazy"
                    />
                    <p className="text-xs sm:text-sm text-[#2D7A66] mt-2 text-center font-medium">
                      Scan to share profile
                    </p>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-3 px-5 py-2 bg-[#93E9A2]/90 text-[#144E53] rounded-full text-sm font-semibold hover:bg-[#93E9A2] transition-all duration-300"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = qrCodeUrl;
                        link.download = `${member.fullName}-qrcode.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      aria-label="Download QR Code"
                    >
                      Download QR Code
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col space-y-6">
                <div className="text-center md:text-left space-y-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#144E53] tracking-tight">
                    {member.fullName}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm sm:text-base text-[#2D7A66]">
                    <Badge size={18} />
                    <span className="font-semibold">{member.idNo}</span>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-[#144E53]">
                    {member.designation}
                  </p>
                  {member.department && (
                    <p className="text-sm sm:text-base text-[#2D7A66] font-medium">
                      Department: {member.department}
                    </p>
                  )}
                  {member.email && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm sm:text-base text-[#2D7A66]">
                      <Mail size={16} />
                      <span className="truncate font-medium">
                        {member.email}
                      </span>
                    </div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#144E53] mb-3">
                    Achievements
                  </h3>
                  <div className="bg-[#E6EDE2]/30 rounded-xl p-4 sm:p-6 shadow-sm border border-[#93E9A2]/20">
                    <p className="text-sm sm:text-base text-[#2D7A66] font-medium">
                      {member.fullName} has contributed significantly to{" "}
                      {member.department || "the team"}.
                      <br />
                      Notable achievements will be displayed here soon.
                    </p>
                  </div>
                </motion.div>

                {member.certificateURL && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4"
                  >
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#144E53] mb-3">
                      Certificate
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 bg-[#93E9A2]/90 text-[#144E53] rounded-full text-sm sm:text-base font-semibold hover:bg-[#93E9A2] transition-all duration-300"
                        onClick={handleShowCertificate}
                        aria-label={
                          showCertificate
                            ? "Hide Certificate"
                            : "Show Certificate"
                        }
                      >
                        {showCertificate
                          ? "Hide Certificate"
                          : "Show Certificate"}
                      </motion.button>
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 bg-[#93E9A2]/90 text-[#144E53] rounded-full text-sm sm:text-base font-semibold hover:bg-[#93E9A2] transition-all duration-300"
                        onClick={handleDownloadCertificate}
                        aria-label="Download Certificate"
                      >
                        Download Certificate
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>

      <AnimatePresence>
        {showCertificate && member.certificateURL && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[95vw] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 text-[#144E53] bg-[#93E9A2]/30 p-2 rounded-full hover:bg-[#93E9A2]/50 transition-all duration-300"
                onClick={handleShowCertificate}
                aria-label="Close Certificate"
              >
                <X size={24} />
              </motion.button>
              <div className="w-full h-full flex items-center justify-center">
                {isImageUrl(member.certificateURL) ? (
                  <img
                    src={member.certificateURL}
                    alt={`${member.fullName}'s Certificate`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.log(
                        `Failed to load certificate image for ${member.fullName}: ${member.certificateURL}`
                      );
                    }}
                    onLoad={() =>
                      console.log(
                        `Certificate image loaded successfully for ${member.fullName}`
                      )
                    }
                    loading="lazy"
                  />
                ) : (
                  <iframe
                    src={member.certificateURL}
                    className="w-full h-full object-contain"
                    style={{ transform: "scale(1)", transformOrigin: "center" }}
                    title="Certificate Preview"
                    onError={(e) => {
                      console.log(
                        `Failed to load certificate for ${member.fullName}: ${member.certificateURL}`
                      );
                    }}
                    onLoad={() =>
                      console.log(
                        `Certificate loaded successfully for ${member.fullName}`
                      )
                    }
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDetails;
