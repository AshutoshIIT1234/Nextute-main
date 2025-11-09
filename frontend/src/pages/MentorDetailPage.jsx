import { motion } from "framer-motion";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import useRazorpay from "../hooks/useRazorpay";
import toast from "react-hot-toast";
import { getMentorImage } from "../utils/mentorImages";

const MentorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { isAuthenticated, user, userType } = useContext(AppContext);
  const { initiateMentorshipPayment } = useRazorpay();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a session');
      return;
    }

    if (userType !== 'student') {
      toast.error('Only students can book mentorship sessions');
      return;
    }

    setShowPricingModal(true);
  };

  const handlePlanSelect = (planType) => {
    const price = planType === 'premium' ? 1500 : 1000;

    const mentorData = {
      id: mentor.id,
      name: mentor.name,
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

  const [loading, setLoading] = useState(true);

  // Fetch mentor from API
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/mentorship/mentors/${id}`);
        const data = await response.json();
        
        if (data.success) {
          // Map backend data to frontend format with defaults
          const mentorData = {
            id: data.mentor.id,
            name: data.mentor.name,
            expertise: data.mentor.expertise,
            achievement: data.mentor.rank || "Top Ranker",
            students: data.mentor.studentsCount || 0,
            image: getMentorImage(data.mentor.id, data.mentor.name), // Use hardcoded images
            shortDescription: data.mentor.description || "Expert mentor ready to guide you.",
            detailedDescription: data.mentor.description || "Experienced mentor with proven track record of helping students achieve their goals.",
           
            subjects: data.mentor.subjects || [],
            availability: "Flexible timings",
            sessionPrice: "₹500/hour"
          };
          setMentor(mentorData);
        } else {
          toast.error('Mentor not found');
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
        toast.error('Failed to load mentor details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentor();
    }
  }, [id]);

  // Fallback dummy data
  const mentorsData = [
    {
      id: 1,
      name: "Arjun Verma",
      expertise: "IIT Bombay CSE",
      achievement: "AIR 47 JEE Advanced 2022",
      students: 150,
      image: "https://ui-avatars.com/api/?name=Arjun+Verma&background=2D7B67&color=fff&size=400",
      shortDescription: "Currently pursuing B.Tech at IIT Bombay. Specializes in Physics & Mathematics mentoring.",
      detailedDescription: "Arjun is a passionate mentor currently pursuing Computer Science Engineering at IIT Bombay. With an All India Rank of 47 in JEE Advanced 2022, he brings fresh insights and proven strategies to help students crack competitive exams. His teaching methodology focuses on concept clarity and problem-solving techniques that helped him succeed.\n\nHaving recently gone through the JEE journey himself, Arjun understands the challenges students face and provides practical solutions. He specializes in Physics and Mathematics, breaking down complex topics into easy-to-understand concepts. His students appreciate his patient approach and ability to explain difficult concepts in simple terms.\n\nArjun believes in personalized mentoring, understanding each student's strengths and weaknesses to create customized study plans. He has successfully mentored over 150 students, many of whom have secured top ranks in JEE.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Physics", "Mathematics", "Problem Solving"],
      availability: "Weekends & Evenings",
      sessionPrice: "₹500/hour"
    },
    {
      id: 2,
      name: "Priya Malhotra",
      expertise: "AIIMS Delhi MBBS",
      achievement: "AIR 12 NEET 2023",
      students: 180,
      image: "https://ui-avatars.com/api/?name=Priya+Malhotra&background=8B5CF6&color=fff&size=400",
      shortDescription: "AIIMS Delhi student. Expert in Biology and Chemistry for NEET aspirants.",
      detailedDescription: "Priya is currently pursuing MBBS at AIIMS Delhi, one of India's most prestigious medical institutions. Securing AIR 12 in NEET 2023, she has proven expertise in Biology and Chemistry. Her journey from a NEET aspirant to an AIIMS student makes her an ideal mentor for medical entrance preparation.\n\nPriya's teaching style emphasizes conceptual understanding over rote learning. She helps students develop a deep understanding of biological processes and chemical reactions, making it easier to tackle NEET's challenging questions. Her revision strategies and time management techniques have helped numerous students improve their scores significantly.\n\nWith experience mentoring over 180 students, Priya has developed a comprehensive approach to NEET preparation. She focuses on building strong fundamentals while also teaching exam-specific strategies. Her students consistently praise her dedication and ability to simplify complex topics.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Biology", "Chemistry", "NEET Strategy"],
      availability: "Flexible timings",
      sessionPrice: "₹600/hour"
    },
    {
      id: 3,
      name: "Rohan Kapoor",
      expertise: "IIT Delhi EE",
      achievement: "AIR 89 JEE Advanced 2021",
      students: 120,
      image: "https://ui-avatars.com/api/?name=Rohan+Kapoor&background=3B82F6&color=fff&size=400",
      shortDescription: "IIT Delhi Electrical Engineering. Helps with JEE Maths and Physics problem-solving.",
      detailedDescription: "Rohan is pursuing Electrical Engineering at IIT Delhi after securing AIR 89 in JEE Advanced 2021. His strong foundation in Mathematics and Physics makes him an excellent mentor for JEE aspirants. He specializes in teaching problem-solving techniques and shortcuts that save valuable time during exams.\n\nWhat sets Rohan apart is his systematic approach to preparation. He helps students identify their weak areas and works on strengthening them through targeted practice. His focus on building problem-solving speed and accuracy has helped many students improve their performance significantly.\n\nRohan has mentored over 120 students, helping them develop confidence in tackling JEE's toughest questions. His students appreciate his friendly demeanor and ability to make learning enjoyable while maintaining focus on results.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Mathematics", "Physics", "JEE Strategy"],
      availability: "Weekdays evenings",
      sessionPrice: "₹500/hour"
    },
    {
      id: 4,
      name: "Ananya Singh",
      expertise: "JIPMER MBBS",
      achievement: "AIR 34 NEET 2022",
      students: 165,
      image: "https://ui-avatars.com/api/?name=Ananya+Singh&background=EC4899&color=fff&size=400",
      shortDescription: "JIPMER Puducherry medical student. Specializes in NEET Biology and exam strategies.",
      detailedDescription: "Ananya is currently studying MBBS at JIPMER Puducherry after achieving AIR 34 in NEET 2022. Her exceptional performance in Biology makes her a sought-after mentor for NEET aspirants. She brings a fresh perspective to medical entrance preparation, having recently experienced the journey herself.\n\nAnanya's teaching methodology focuses on understanding rather than memorization. She helps students connect different biological concepts, making it easier to remember and apply them. Her exam strategies, including time management and question selection techniques, have proven highly effective.\n\nWith 165+ students mentored, Ananya has developed a reputation for being patient and supportive. She understands the stress of NEET preparation and provides not just academic guidance but also emotional support to help students stay motivated throughout their journey.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Biology", "Exam Strategy", "Motivation"],
      availability: "Weekends",
      sessionPrice: "₹550/hour"
    },
    {
      id: 5,
      name: "Karan Sharma",
      expertise: "IIT Madras ME",
      achievement: "AIR 156 JEE Advanced 2023",
      students: 95,
      image: "https://ui-avatars.com/api/?name=Karan+Sharma&background=F59E0B&color=fff&size=400",
      shortDescription: "IIT Madras Mechanical Engineering. Guides on JEE preparation and time management.",
      detailedDescription: "Karan is pursuing Mechanical Engineering at IIT Madras after securing AIR 156 in JEE Advanced 2023. Being a recent JEE qualifier, he brings the most current insights into the exam pattern and preparation strategies. His journey from a determined aspirant to an IITian inspires many students.\n\nKaran's strength lies in his ability to teach time management and efficient study techniques. He helps students create realistic study schedules and stick to them. His focus on consistent practice and regular revision has helped many students improve their ranks significantly.\n\nThough relatively new to mentoring with 95 students, Karan's fresh perspective and relatable approach make him popular among current JEE aspirants. He shares his own preparation journey, including mistakes to avoid and strategies that worked for him.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Physics", "Time Management", "Study Planning"],
      availability: "Flexible",
      sessionPrice: "₹450/hour"
    },
    {
      id: 6,
      name: "Sneha Patel",
      expertise: "AFMC Pune MBBS",
      achievement: "AIR 28 NEET 2021",
      students: 200,
      image: "https://ui-avatars.com/api/?name=Sneha+Patel&background=10B981&color=fff&size=400",
      shortDescription: "Armed Forces Medical College student. Expert in NEET Chemistry and Physics.",
      detailedDescription: "Sneha is studying MBBS at Armed Forces Medical College, Pune, after achieving an impressive AIR 28 in NEET 2021. Her exceptional performance in Chemistry and Physics makes her a valuable mentor for NEET aspirants. With over 200 students mentored, she is one of the most experienced mentors in our program.\n\nSneha's teaching approach combines conceptual clarity with practical problem-solving. She helps students understand the underlying principles in Chemistry and Physics, making it easier to tackle any type of question. Her comprehensive notes and study materials are highly appreciated by her students.\n\nWhat makes Sneha stand out is her dedication to her students' success. She goes beyond regular mentoring sessions, providing additional support through doubt-clearing sessions and motivational talks. Her students consistently achieve significant improvements in their NEET scores.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Chemistry", "Physics", "NEET Preparation"],
      availability: "All days",
      sessionPrice: "₹650/hour"
    },
    {
      id: 7,
      name: "Aditya Reddy",
      expertise: "IIT Kanpur CSE",
      achievement: "AIR 72 JEE Advanced 2022",
      students: 140,
      image: "https://ui-avatars.com/api/?name=Aditya+Reddy&background=6366F1&color=fff&size=400",
      shortDescription: "IIT Kanpur Computer Science. Mentors in advanced Mathematics and coding.",
      detailedDescription: "Aditya is pursuing Computer Science at IIT Kanpur after securing AIR 72 in JEE Advanced 2022. His passion for Mathematics and coding makes him an excellent mentor for students interested in computer science and engineering. He brings a unique blend of theoretical knowledge and practical application to his teaching.\n\nAditya specializes in advanced Mathematics topics that often challenge JEE aspirants. His ability to break down complex mathematical concepts into simple, understandable parts has helped many students overcome their fear of Mathematics. He also introduces students to basic coding concepts, giving them a head start for their engineering journey.\n\nWith 140 students mentored, Aditya has developed effective teaching methods that cater to different learning styles. His interactive sessions and real-world examples make learning engaging and memorable. Students appreciate his patience and willingness to explain concepts multiple times until they're fully understood.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Advanced Mathematics", "Coding Basics", "JEE Preparation"],
      availability: "Evenings & Weekends",
      sessionPrice: "₹550/hour"
    },
    {
      id: 8,
      name: "Ishita Gupta",
      expertise: "MAMC Delhi MBBS",
      achievement: "AIR 45 NEET 2023",
      students: 175,
      image: "https://ui-avatars.com/api/?name=Ishita+Gupta&background=EF4444&color=fff&size=400",
      shortDescription: "Maulana Azad Medical College student. Helps with NEET Biology and revision strategies.",
      detailedDescription: "Ishita is currently studying MBBS at Maulana Azad Medical College, Delhi, after achieving AIR 45 in NEET 2023. Her recent success and deep understanding of Biology make her an ideal mentor for NEET aspirants. She has quickly become popular among students for her effective teaching methods and supportive nature.\n\nIshita's revision strategies are particularly noteworthy. She teaches students how to revise efficiently, ensuring maximum retention with minimum time investment. Her focus on high-yield topics and smart study techniques has helped many students optimize their preparation.\n\nHaving mentored 175 students, Ishita understands the common challenges faced by NEET aspirants. She provides personalized guidance based on each student's learning pace and style. Her students praise her for being approachable and always available to clear doubts, no matter how basic they might be.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Biology", "Revision Strategies", "High-Yield Topics"],
      availability: "Flexible timings",
      sessionPrice: "₹550/hour"
    },
    {
      id: 9,
      name: "Vikram Joshi",
      expertise: "IIT Kharagpur CE",
      achievement: "AIR 134 JEE Advanced 2021",
      students: 110,
      image: "https://ui-avatars.com/api/?name=Vikram+Joshi&background=14B8A6&color=fff&size=400",
      shortDescription: "IIT Kharagpur Chemical Engineering. Specializes in JEE Chemistry and Physical Chemistry.",
      detailedDescription: "Vikram is pursuing Chemical Engineering at IIT Kharagpur after securing AIR 134 in JEE Advanced 2021. His strong foundation in Chemistry, particularly Physical Chemistry, makes him a valuable mentor for JEE aspirants. He brings both theoretical knowledge and practical insights to his teaching.\n\nVikram's teaching style focuses on building a strong conceptual base in Chemistry. He helps students understand the logic behind chemical reactions and processes, making it easier to solve complex problems. His systematic approach to Physical Chemistry has helped many students who previously struggled with the subject.\n\nWith 110 students mentored, Vikram has developed a reputation for being thorough and detail-oriented. He ensures that students not only solve problems correctly but also understand the underlying concepts. His students appreciate his structured teaching method and comprehensive study materials.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["Chemistry", "Physical Chemistry", "Problem Solving"],
      availability: "Weekdays",
      sessionPrice: "₹500/hour"
    },
    {
      id: 10,
      name: "Riya Deshmukh",
      expertise: "KGMU Lucknow MBBS",
      achievement: "AIR 67 NEET 2022",
      students: 130,
      image: "https://ui-avatars.com/api/?name=Riya+Deshmukh&background=A855F7&color=fff&size=400",
      shortDescription: "King George's Medical University student. Guides on NEET preparation and stress management.",
      detailedDescription: "Riya is studying MBBS at King George's Medical University, Lucknow, after achieving AIR 67 in NEET 2022. Beyond her academic expertise, Riya is known for her holistic approach to NEET preparation, which includes stress management and mental well-being alongside academic guidance.\n\nRiya understands that NEET preparation can be overwhelming, and she helps students maintain a healthy balance between studies and self-care. Her stress management techniques and motivational support have helped many students overcome exam anxiety and perform to their full potential.\n\nWith 130 students mentored, Riya has developed a comprehensive mentoring approach that addresses both academic and emotional aspects of NEET preparation. Her students value her empathetic nature and practical advice on handling the pressure of competitive exams. She creates a supportive environment where students feel comfortable discussing their challenges.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      subjects: ["NEET Preparation", "Stress Management", "Study-Life Balance"],
      availability: "Weekends & Evenings",
      sessionPrice: "₹500/hour"
    }
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2D7B67] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentor details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="w-full min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Mentor not found</h2>
          <NavLink to="/services/mentorship" className="text-[#2D7B67] hover:underline mt-4 inline-block">
            Back to Mentors
          </NavLink>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#2D7B67] hover:text-[#1F4C56] mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Mentors
        </button>

        {/* Mentor Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-48 h-48 rounded-full object-cover shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{mentor.name}</h1>
              <p className="text-xl text-[#2D7B67] font-semibold mb-4">{mentor.expertise}</p>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">Students Mentored</p>
                <p className="text-2xl font-bold text-gray-800">{mentor.students}+</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="text-lg text-gray-700">{mentor.availability}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Introduction Video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction Video</h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={mentor.videoUrl}
              title={`${mentor.name} Introduction`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </motion.div>

        {/* Detailed Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About {mentor.name}</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {mentor.detailedDescription}
          </div>
        </motion.div>

        {/* Book Session CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-[#2D7B67] to-[#1F4C56] rounded-2xl shadow-lg p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6">Book a session with {mentor.name} and take the first step towards your goals</p>
          <button 
            onClick={handleBookClick}
            className="bg-white text-[#2D7B67] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Book a Session Now
          </button>
        </motion.div>
      </motion.div>

      <Footer />

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Choose Your Plan with {mentor?.name}
                </h2>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Pro Plan */}
                <div className="border-2 border-[#2D7B67] rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pro Plan</h3>
                    <div className="text-3xl font-bold text-[#2D7B67] mb-2">₹1,000</div>
                    <p className="text-sm text-gray-600">Perfect for focused learning</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-sm">1 Hour Session</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-sm">Doubt Clearing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-sm">Study Material</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-sm">Email Support</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('pro')}
                    className="w-full bg-[#2D7B67] text-white py-3 rounded-lg hover:bg-[#1F4C56] transition-all font-semibold"
                  >
                    Book Pro Session
                  </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white relative hover:shadow-lg transition-all">
                  <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                    <div className="text-3xl font-bold mb-2">₹1,500</div>
                    <p className="text-sm">Complete mentorship experience</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-300 text-xl">✓</span>
                      <span className="text-sm">1.5 Hour Session</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-300 text-xl">✓</span>
                      <span className="text-sm">Personalized Study Plan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-300 text-xl">✓</span>
                      <span className="text-sm">Premium Study Material</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-300 text-xl">✓</span>
                      <span className="text-sm">WhatsApp Support (7 days)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-300 text-xl">✓</span>
                      <span className="text-sm">Follow-up Session</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('premium')}
                    className="w-full bg-white text-purple-600 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                  >
                    Book Premium Session
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MentorDetailPage;
