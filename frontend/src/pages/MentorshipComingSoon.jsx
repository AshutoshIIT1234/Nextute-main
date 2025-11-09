import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import useRazorpay from "../hooks/useRazorpay";
import toast from "react-hot-toast";
import axios from "axios";
import { getMentorImage } from "../utils/mentorImages";

const MentorshipComingSoon = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, userType } = useContext(AppContext);
  const { initiateMentorshipPayment } = useRazorpay();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [filter, setFilter] = useState('all');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const handleBookClick = (mentor) => {
    if (!isAuthenticated) {
      toast.error('Please login to book a session');
      return;
    }

    if (userType !== 'student') {
      toast.error('Only students can book mentorship sessions');
      return;
    }

    setSelectedMentor(mentor);
    setShowPricingModal(true);
  };

  const handlePlanSelect = (planType) => {
    const price = planType === 'premium' ? 1500 : 1000;

    const mentorData = {
      id: selectedMentor.id,
      name: selectedMentor.name,
      sessionPrice: price,
      planType: planType,
    };

    const studentData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.contact,
    };

    setShowPricingModal(false);
    initiateMentorshipPayment(mentorData, studentData);
  };

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/mentorship/mentors?filter=${filter}`);
        
        if (response.data.success) {
          // Map backend data to frontend format with hardcoded images
          const formattedMentors = response.data.mentors.map(mentor => ({
            id: mentor.id,
            name: mentor.name,
            expertise: mentor.expertise,
            students: mentor.studentsCount || 0,
            image: getMentorImage(mentor.id, mentor.name), // Use hardcoded images
            description: mentor.description || "Expert mentor ready to guide you to success.",
          }));
          setMentors(formattedMentors);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
        toast.error('Failed to load mentors');
        // Fallback to dummy data if API fails
        setMentors(dummyMentors);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [filter]);

  // Fallback dummy mentor data
  const dummyMentors = [
    {
      id: 1,
      name: "Arjun Verma",
      expertise: "IIT Bombay CSE",
      students: 150,
      image: "https://ui-avatars.com/api/?name=Arjun+Verma&background=2D7B67&color=fff&size=200",
      description: "Currently pursuing B.Tech at IIT Bombay. Specializes in Physics & Mathematics mentoring."
    },
    {
      id: 2,
      name: "Priya Malhotra",
      expertise: "AIIMS Delhi MBBS",
      students: 180,
      image: "https://ui-avatars.com/api/?name=Priya+Malhotra&background=8B5CF6&color=fff&size=200",
      description: "AIIMS Delhi student. Expert in Biology and Chemistry for NEET aspirants."
    },
    {
      id: 3,
      name: "Rohan Kapoor",
      expertise: "IIT Delhi EE",
      students: 120,
      image: "https://ui-avatars.com/api/?name=Rohan+Kapoor&background=3B82F6&color=fff&size=200",
      description: "IIT Delhi Electrical Engineering. Helps with JEE Maths and Physics problem-solving."
    },
    {
      id: 4,
      name: "Ananya Singh",
      expertise: "JIPMER MBBS",
      students: 165,
      image: "https://ui-avatars.com/api/?name=Ananya+Singh&background=EC4899&color=fff&size=200",
      description: "JIPMER Puducherry medical student. Specializes in NEET Biology and exam strategies."
    },
    {
      id: 5,
      name: "Karan Sharma",
      expertise: "IIT Madras ME",
      students: 95,
      image: "https://ui-avatars.com/api/?name=Karan+Sharma&background=F59E0B&color=fff&size=200",
      description: "IIT Madras Mechanical Engineering. Guides on JEE preparation and time management."
    },
    {
      id: 6,
      name: "Sneha Patel",
      expertise: "AFMC Pune MBBS",
      students: 200,
      image: "https://ui-avatars.com/api/?name=Sneha+Patel&background=10B981&color=fff&size=200",
      description: "Armed Forces Medical College student. Expert in NEET Chemistry and Physics."
    },
    {
      id: 7,
      name: "Aditya Reddy",
      expertise: "IIT Kanpur CSE",
      students: 140,
      image: "https://ui-avatars.com/api/?name=Aditya+Reddy&background=6366F1&color=fff&size=200",
      description: "IIT Kanpur Computer Science. Mentors in advanced Mathematics and coding."
    },
    {
      id: 8,
      name: "Ishita Gupta",
      expertise: "MAMC Delhi MBBS",
      students: 175,
      image: "https://ui-avatars.com/api/?name=Ishita+Gupta&background=EF4444&color=fff&size=200",
      description: "Maulana Azad Medical College student. Helps with NEET Biology and revision strategies."
    },
    {
      id: 9,
      name: "Vikram Joshi",
      expertise: "IIT Kharagpur CE",
      students: 110,
      image: "https://ui-avatars.com/api/?name=Vikram+Joshi&background=14B8A6&color=fff&size=200",
      description: "IIT Kharagpur Chemical Engineering. Specializes in JEE Chemistry and Physical Chemistry."
    },
    {
      id: 10,
      name: "Riya Deshmukh",
      expertise: "KGMU Lucknow MBBS",
      students: 130,
      image: "https://ui-avatars.com/api/?name=Riya+Deshmukh&background=A855F7&color=fff&size=200",
      description: "King George's Medical University student. Guides on NEET preparation and stress management."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-primary/20 rounded-3xl blur-3xl opacity-50 -z-10"></div>
          <div className="text-6xl mb-4 animate-bounce">🤝</div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Meet Our Expert Mentors
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Connect with IIT & NEET toppers who understand your journey. Get personalized guidance from those who've been exactly where you are.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-2xl">🎓</span>
              <span className="font-semibold">IIT & NEET Toppers</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold">1000+ Students Mentored</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-2xl">💯</span>
              <span className="font-semibold">Proven Results</span>
            </div>
          </div>
        </motion.div>

        {/* Filter/Search Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full transition ${
                filter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 border border-primary/20 hover:bg-accent/20'
              }`}
            >
              All Mentors
            </button>
            <button 
              onClick={() => setFilter('iit')}
              className={`px-4 py-2 rounded-full transition ${
                filter === 'iit' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 border border-primary/20 hover:bg-accent/20'
              }`}
            >
              IIT Mentors
            </button>
            <button 
              onClick={() => setFilter('neet')}
              className={`px-4 py-2 rounded-full transition ${
                filter === 'neet' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 border border-primary/20 hover:bg-accent/20'
              }`}
            >
              NEET Mentors
            </button>
          </div>
          <div className="text-gray-600 font-medium">
            {mentors.length} Expert Mentors Available
          </div>
        </motion.div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 mb-4">No mentors available at the moment</p>
            <p className="text-gray-500">Please check back later</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.05 * index, type: "spring" }}
              whileHover={{ 
                y: -12, 
                rotateX: 5,
                rotateY: 2,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group relative"
            >
              {/* Gradient Border Effect with 3D depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-sm -z-10" style={{ transform: "translateZ(-10px)" }}></div>
              
              <div className="p-6 relative bg-white rounded-2xl" style={{ transform: "translateZ(20px)" }}>
                <div 
                  onClick={() => navigate(`/mentor/${mentor.id}`)}
                  className="cursor-pointer"
                >
                  {/* Mentor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative" style={{ transform: "translateZ(30px)" }}>
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-accent/30 group-hover:ring-primary/50 transition-all group-hover:scale-110"
                        style={{ 
                          transform: "translateZ(10px)",
                          transition: "all 0.3s ease"
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white animate-pulse" style={{ transform: "translateZ(15px)" }}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-1">{mentor.expertise}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-500">👥</span>
                          {mentor.students}+ mentored
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-accent/20 text-primary rounded-full text-xs font-medium">
                      Expert Guidance
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-secondary rounded-full text-xs font-medium">
                      Available Now
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b">
                    <span className="text-gray-500">Starting from</span>
                    <span className="text-2xl font-bold text-primary">₹1,000</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookClick(mentor);
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
                  style={{ 
                    transform: "translateZ(25px)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateZ(35px) scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateZ(25px) scale(1)";
                  }}
                >
                  <span className="relative z-10">Book Session</span>
                  <span className="group-hover:translate-x-1 transition-transform relative z-10">→</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-br from-accent/20 to-primary/10 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Why Choose Our Mentorship Program?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of students who have transformed their preparation with personalized guidance from top rankers
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="text-5xl mb-3" style={{ transform: "translateZ(20px)" }}>👨‍🏫</div>
              <h3 className="font-bold text-lg mb-2">1-on-1 Guidance</h3>
              <p className="text-gray-600 text-sm">Personalized attention from experienced mentors</p>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="text-5xl mb-3" style={{ transform: "translateZ(20px)" }}>🎯</div>
              <h3 className="font-bold text-lg mb-2">Proven Strategies</h3>
              <p className="text-gray-600 text-sm">Learn techniques that actually worked for toppers</p>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="text-5xl mb-3" style={{ transform: "translateZ(20px)" }}>💡</div>
              <h3 className="font-bold text-lg mb-2">Expert Insights</h3>
              <p className="text-gray-600 text-sm">Real-world experiences and best practices</p>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="text-5xl mb-3" style={{ transform: "translateZ(20px)" }}>🚀</div>
              <h3 className="font-bold text-lg mb-2">Fast Results</h3>
              <p className="text-gray-600 text-sm">See improvement in your preparation quickly</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            What Our Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ 
                scale: 1.03,
                rotateY: 3,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center text-2xl" style={{ transform: "translateZ(15px)" }}>
                  👨‍🎓
                </div>
                <div>
                  <h4 className="font-bold">Rahul Sharma</h4>
                  <p className="text-sm text-gray-500">IIT Delhi, 2024</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "The mentorship helped me understand concepts I struggled with for months. My mentor's guidance was invaluable!"
              </p>
              <div className="mt-3 text-yellow-500">⭐⭐⭐⭐⭐</div>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.03,
                rotateY: 3,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl" style={{ transform: "translateZ(15px)" }}>
                  👩‍🎓
                </div>
                <div>
                  <h4 className="font-bold">Priya Patel</h4>
                  <p className="text-sm text-gray-500">AIIMS, 2023</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "Best decision I made! My mentor helped me create a study plan that actually worked for me."
              </p>
              <div className="mt-3 text-yellow-500">⭐⭐⭐⭐⭐</div>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.03,
                rotateY: 3,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-2xl" style={{ transform: "translateZ(15px)" }}>
                  👨‍🎓
                </div>
                <div>
                  <h4 className="font-bold">Amit Kumar</h4>
                  <p className="text-sm text-gray-500">IIT Bombay, 2024</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "The personalized attention and tips from someone who recently cleared JEE made all the difference!"
              </p>
              <div className="mt-3 text-yellow-500">⭐⭐⭐⭐⭐</div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
        >
          <NavLink
            to="/"
            className="bg-[#2D7B67] text-white px-8 py-3 rounded-full hover:bg-[#1F4C56] transition-all transform hover:scale-105"
          >
            Back to Home
          </NavLink>
          <NavLink
            to="/contact"
            className="border-2 border-[#2D7B67] text-[#2D7B67] px-8 py-3 rounded-full hover:bg-[#2D7B67] hover:text-white transition-all transform hover:scale-105"
          >
            Contact Us
          </NavLink>
        </motion.div>
      </motion.div>

      <Footer />

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Choose Your Plan
                  </h2>
                  <p className="text-gray-600">
                    Book a session with <span className="font-semibold text-primary">{selectedMentor?.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Pro Plan */}
                <motion.div
                  initial={{ opacity: 0, x: -20, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                  className="border-2 border-primary rounded-2xl p-8 hover:shadow-2xl transition-all bg-gradient-to-br from-accent/10 to-primary/5"
                >
                  <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-primary rounded-full mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro Plan</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-primary">₹1,000</span>
                      <span className="text-gray-500">/session</span>
                    </div>
                    <p className="text-sm text-gray-600">Perfect for focused learning</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">1 Hour Session</span>
                        <span className="text-xs text-gray-500">Focused mentoring time</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">Doubt Clearing</span>
                        <span className="text-xs text-gray-500">Get all your questions answered</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">Study Material</span>
                        <span className="text-xs text-gray-500">Curated resources</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">Email Support</span>
                        <span className="text-xs text-gray-500">Follow-up questions via email</span>
                      </div>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('pro')}
                    className="w-full bg-primary text-white py-4 rounded-xl hover:bg-secondary transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    Choose Pro Plan →
                  </button>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                  initial={{ opacity: 0, x: 20, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: -5,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                  className="bg-gradient-to-br from-secondary via-primary to-accent rounded-2xl p-8 text-white relative hover:shadow-2xl transition-all border-4 border-accent"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-secondary px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <span>⭐</span>
                      <span>MOST POPULAR</span>
                    </div>
                  </div>
                  <div className="text-center mb-6 mt-4">
                    <div className="inline-block p-3 bg-white/20 backdrop-blur rounded-full mb-4">
                      <span className="text-3xl">👑</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold">₹1,500</span>
                      <span className="text-white/70">/session</span>
                    </div>
                    <p className="text-sm text-white/80">Complete mentorship experience</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">1.5 Hour Session</span>
                        <span className="text-xs text-white/70">Extended learning time</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">Personalized Study Plan</span>
                        <span className="text-xs text-white/70">Custom roadmap for success</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">Premium Study Material</span>
                        <span className="text-xs text-white/70">Exclusive resources</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">WhatsApp Support (7 days)</span>
                        <span className="text-xs text-white/70">Direct mentor access</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent text-2xl flex-shrink-0">✓</span>
                      <div>
                        <span className="font-semibold block">Follow-up Session</span>
                        <span className="text-xs text-white/70">Track your progress</span>
                      </div>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('premium')}
                    className="w-full bg-white text-secondary py-4 rounded-xl hover:bg-accent/20 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    Choose Premium Plan →
                  </button>
                </motion.div>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>💳 Secure payment powered by Razorpay • 🔒 100% Safe & Encrypted</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MentorshipComingSoon;
