import { useContext, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TeamCard from "../components/TeamCard";
import {
  Users,
  Star,
  Code,
  Megaphone,
  Palette,
  FlaskConical,
  Search,
  Menu,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FaSpinner } from "react-icons/fa";

const OurTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState({
    ceo: null,
    founders: [],
    tech: [],
    marketing: [],
    uiux: [],
    rd: [],
    others: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data } = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/employees/members`
        );
        console.log("Team data received:", data);

        const ceo =
          data.find((member) =>
            member.designation.toLowerCase().includes("ceo")
          ) || null;

        const founders =
          data.filter(
            (member) =>
              member.department.toLowerCase().includes("co-founder") ||
              member.designation.toLowerCase().includes("head") ||
              member.designation.toLowerCase().includes("lead")
          ) || [];

        const techTeam =
          data
            .filter((member) =>
              member.department.toLowerCase().includes("technology")
            )
            .sort((a, b) => {
              const roleOrder = {
                "full stack developer": 1,
                "backend developer": 2,
                "frontend developer": 3,
              };
              const aRole = a.designation.toLowerCase();
              const bRole = b.designation.toLowerCase();
              const aPriority = roleOrder[aRole] || 4;
              const bPriority = roleOrder[bRole] || 4;
              return aPriority - bPriority;
            }) || [];

        const marketing =
          data.filter((member) =>
            member.department.toLowerCase().includes("marketing")
          ) || [];

        const uiux =
          data.filter((member) =>
            member.department.toLowerCase().includes("designing")
          ) || [];

        const rd =
          data.filter((member) =>
            member.department.toLowerCase().includes("r&d")
          ) || [];

        const others =
          data.filter(
            (member) =>
              member &&
              !member.designation.toLowerCase().includes("ceo") &&
              !member.department.toLowerCase().includes("co-founder") &&
              !member.designation.toLowerCase().includes("head") &&
              !member.designation.toLowerCase().includes("lead") &&
              !member.department.toLowerCase().includes("technology") &&
              !member.department.toLowerCase().includes("marketing") &&
              !member.department.toLowerCase().includes("designing") &&
              !member.department.toLowerCase().includes("r&d")
          ) || [];

        setTeamData({
          ceo,
          founders,
          tech: techTeam,
          marketing,
          uiux,
          rd,
          others,
        });
        setIsVisible(true);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setLoading(false);
      }
    };
    fetchTeamMembers();

    let scrollTimeout = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll(".team-section");
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            section.classList.add("visible");
          }
        });
        scrollTimeout = null;
      }, 100); // Throttle to every 100ms
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [VITE_BACKEND_BASE_URL]);

  const filteredTeamData = useMemo(() => {
    if (!searchQuery) return teamData;
    const query = searchQuery.toLowerCase();
    return {
      ceo:
        teamData.ceo &&
        (teamData.ceo.fullName.toLowerCase().includes(query) ||
          teamData.ceo.department.toLowerCase().includes(query))
          ? teamData.ceo
          : null,
      founders: teamData.founders.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      ),
      tech: teamData.tech.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      ),
      marketing: teamData.marketing.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      ),
      uiux: teamData.uiux.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      ),
      rd: teamData.rd.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      ),
      others: teamData.others.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      ),
    };
  }, [teamData, searchQuery]);

  const TeamSection = ({ title, data, icon, delay = 0, special = false }) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log(`No data for section: ${title}`);
      return null;
    }

    return (
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: delay / 1000 }}
        className="team-section mb-8 md:mb-12 bg-white/90 backdrop-blur-lg rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl border border-[#93E9A2]/30 hover:border-[#2D7A66]/50 transition-all duration-300"
      >
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-flex items-center gap-2 md:gap-3 bg-[#2D7A66]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
              className="text-[#2D7A66]"
            >
              {icon}
            </motion.div>
            <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-[#144E53]">
              {title}
            </h2>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: delay / 1000 + 0.2 }}
            className="w-24 md:w-36 h-1 bg-gradient-to-r from-[#93E9A2] to-[#2D7A66] mx-auto rounded-full mt-2"
          ></motion.div>
        </div>

        <div
          className={`grid gap-4 md:gap-6 lg:gap-12 ${
            special
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 "
          } min-h-[150px]`}
        >
          {loading ? (
            Array.from({ length: special ? 1 : 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 animate-pulse h-[320px] md:h-[360px]"
              >
                <div className="w-24 md:w-28 h-24 md:h-28 mx-auto rounded-full bg-[#E6EDE2]/50"></div>
                <div className="mt-3 h-5 md:h-6 bg-[#E6EDE2]/50 rounded w-3/4 mx-auto"></div>
                <div className="mt-2 h-4 bg-[#E6EDE2]/50 rounded w-1/2 mx-auto"></div>
                <div className="mt-2 h-4 bg-[#E6EDE2]/50 rounded w-2/3 mx-auto"></div>
              </div>
            ))
          ) : special && data ? (
            <TeamCard
              key={data.id}
              fullName={data.fullName}
              employeeId={data.idNo}
              certificateId={data.certificateNo}
              designation={data.designation}
              email={data.email}
              image={data.image}
              department={data.department}
              isSpecial={true}
              delay={100}
              onClick={() => navigate(`/team/${data.certificateNo}`)}
            />
          ) : (
            data.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: (index * 150 + delay) / 1000,
                }}
              >
                <TeamCard
                  fullName={member.fullName}
                  employeeId={member.idNo}
                  certificateId={member.certificateNo}
                  designation={member.designation}
                  email={member.email}
                  image={member.image}
                  department={member.department}
                  delay={index * 150}
                  onClick={() => navigate(`/team/${member.certificateNo}`)}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner size={32} className="text-[#2D7A66]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6EDE2] font-sans">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-[#144E53] to-[#2D7A66] text-white">
        <motion.svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            fill="#93E9A2"
            fillOpacity="0.25"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </motion.svg>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg"
          >
            Our{" "}
            <span className="bg-gradient-to-r from-[#93E9A2] to-[#E6EDE2] bg-clip-text text-transparent">
              Visionary Team
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-[#E6EDE2] max-w-2xl mx-auto mt-3 md:mt-4 drop-shadow-md"
          >
            Discover the brilliant minds shaping the future of education at
            Nextute
          </motion.p>
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 md:mt-8 px-6 md:px-8 py-2.5 md:py-3 bg-[#93E9A2]/90 backdrop-blur-lg text-[#144E53] rounded-full font-semibold text-base md:text-lg shadow-xl hover:bg-[#E6EDE2] transition-all duration-300"
            onClick={() =>
              document
                .getElementById("team-content")
                .scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Explore Our Team"
          >
            Explore Our Team
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 bg-white/95 backdrop-blur-lg z-20 py-3 md:py-4 shadow-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-64">
              <Search
                size={18}
                className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-[#2D7A66]"
              />
              <input
                type="text"
                placeholder="Search by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 rounded-full bg-[#E6EDE2]/50 text-[#144E53] border border-[#93E9A2]/30 focus:outline-none focus:ring-2 focus:ring-[#2D7A66] transition-all duration-300 text-sm md:text-base"
                aria-label="Search team members"
              />
            </div>
            <button
              className="md:hidden p-2 text-[#144E53] hover:bg-[#93E9A2]/20 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 justify-center md:justify-start`}
          >
            {[
              { title: "CEO", id: "ceo" },
              { title: "Founders", id: "founders" },
              { title: "Tech", id: "tech" },
              { title: "Marketing", id: "marketing" },
              { title: "UI/UX", id: "uiux" },
              { title: "R&D", id: "rd" },
              { title: "Others", id: "others" },
            ].map((section) => (
              <motion.button
                key={section.id}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-3 md:px-4 py-1.5 md:py-2 text-[#144E53] bg-[#93E9A2]/20 rounded-full font-medium hover:bg-[#93E9A2]/40 transition-all duration-300 text-sm md:text-base"
                onClick={() => {
                  document
                    .getElementById(section.id)
                    .scrollIntoView({ behavior: "smooth" });
                  setIsMenuOpen(false);
                }}
                aria-label={`Go to ${section.title} section`}
              >
                {section.title}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div
        id="team-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 space-y-12 md:space-y-16"
      >
        <div id="ceo">
          <TeamSection
            title="Chief Executive Officer"
            data={filteredTeamData.ceo}
            icon={<Star size={24} />}
            delay={200}
            special={true}
          />
        </div>
        <div id="founders">
          <TeamSection
            title="Founders & Leaders"
            data={filteredTeamData.founders}
            icon={<Users size={24} />}
            delay={400}
          />
        </div>
        <div id="tech">
          <TeamSection
            title="Technology Team"
            data={filteredTeamData.tech}
            icon={<Code size={24} />}
            delay={600}
          />
        </div>
        <div id="marketing">
          <TeamSection
            title="Marketing Team"
            data={filteredTeamData.marketing}
            icon={<Megaphone size={24} />}
            delay={800}
          />
        </div>
        <div id="uiux">
          <TeamSection
            title="UI/UX Team"
            data={filteredTeamData.uiux}
            icon={<Palette size={24} />}
            delay={1000}
          />
        </div>
        <div id="rd">
          <TeamSection
            title="R&D Team"
            data={filteredTeamData.rd}
            icon={<FlaskConical size={24} />}
            delay={1200}
          />
        </div>
        <div id="others">
          <TeamSection
            title="Other Team Members"
            data={filteredTeamData.others}
            icon={<Users size={24} />}
            delay={1400}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurTeam;
