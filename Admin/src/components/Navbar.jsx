import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { admin } = useAdmin();

  const navLinks = [
    { name: "Logout", action: () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!", {
          position: "top-right",
          style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
        });
        navigate("/admin/login");
      }
    }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#144E53] text-white h-20 flex items-center justify-center p-4 sm:p-6 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}> 
          <img
            src={assets.logo}
            alt="Nextute Logo"
            className="w-28 sm:w-32 lg:w-40"
          />
          <span className="hidden sm:inline ml-12 text-2xl font-semibold">Welcome, {admin?.name || "Admin"}!</span>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link, idx) => (
            <motion.div key={link.name} whileHover={{ scale: 1.05 }}>
              <button
                onClick={link.action}
                className="text-sm sm:text-base hover:text-[#93E9A2] transition-colors duration-200 border border-white rounded-lg px-4 py-2 bg-transparent"
                style={{ borderWidth: 2 }}
              >
                {link.name}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-[#144E53] mt-3 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex flex-col items-start p-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { link.action(); setIsOpen(false); }}
                  className="block w-full py-2 text-white hover:text-[#93E9A2] transition-colors duration-200 border border-white rounded-lg bg-transparent"
                  style={{ borderWidth: 2 }}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
