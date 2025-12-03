import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Zap, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TechHuntSponsor = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    teamName: '',
    email: '',
    phone: '',
    college: '',
  });
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [stats, setStats] = useState({ totalParticipants: 0, totalTeams: 0 });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventStarted, setEventStarted] = useState(false);

  // Event start time: December 3, 2025 at 7:30 PM
  // Set to past time to make it live immediately
  const EVENT_START_TIME = new Date('2025-12-03T00:00:00').getTime();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_START_TIME - now;

      if (distance < 0) {
        setEventStarted(true);
        clearInterval(timer);
      } else {
        setEventStarted(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/tech-hunt/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          setStats(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventStarted) {
      toast.error('Event has not started yet! Please wait until 7:30 PM.');
      return;
    }
    
    if (!formData.name || !formData.rollNumber || !formData.teamName) {
      toast.error('Please fill in all required fields!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/tech-hunt/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setClaimed(true);
        toast.success(data.message);
        
        // Update stats
        setStats(prev => ({
          totalParticipants: prev.totalParticipants + 1,
          totalTeams: prev.totalTeams + (formData.teamName ? 1 : 0),
        }));
      } else {
        toast.error(data.message || 'Failed to claim reward');
      }
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full mb-4">
            <Zap size={20} className="animate-pulse" />
            <span className="font-semibold">Organized by Zenith</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tech Hunt 2025
          </h1>
          
          <p className="text-xl text-gray-300 mb-2">
            Claim Your Exclusive Reward Now! 🎉
          </p>
          
          <p className="text-sm text-gray-400 mb-6">
            Event Date: December 3, 2025 | 7:30 PM
          </p>

          {/* Countdown Timer */}
          {!eventStarted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-orange-500/30 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="text-orange-400 animate-pulse" size={24} />
                <h3 className="text-2xl font-bold text-white">Event Starts In</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-4xl font-bold text-orange-400">{timeLeft.days}</div>
                  <div className="text-sm text-gray-300 mt-1">Days</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-4xl font-bold text-orange-400">{timeLeft.hours}</div>
                  <div className="text-sm text-gray-300 mt-1">Hours</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-4xl font-bold text-orange-400">{timeLeft.minutes}</div>
                  <div className="text-sm text-gray-300 mt-1">Minutes</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-4xl font-bold text-orange-400">{timeLeft.seconds}</div>
                  <div className="text-sm text-gray-300 mt-1">Seconds</div>
                </div>
              </div>
              
              <p className="text-yellow-300 mt-4 text-sm">
                ⏰ Reward claiming will be available once the event starts!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-4 mb-8 border border-green-500/30 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Event is Live! 🎉</h3>
              </div>
              <p className="text-green-300 mt-2 text-sm">
                Hurry! Claim your reward now before they run out!
              </p>
            </motion.div>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.totalParticipants}</div>
              <div className="text-sm text-gray-400">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.totalTeams}</div>
              <div className="text-sm text-gray-400">Teams</div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Trophy className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-white mb-2">Exclusive Rewards</h3>
              <p className="text-gray-300">
                Get access to premium resources, certificates, and exciting prizes!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Gift className="text-pink-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-white mb-2">Limited Time Offer</h3>
              <p className="text-gray-300">
                Hurry! Claim your reward before it's too late. First come, first served!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Users className="text-blue-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-white mb-2">Team Benefits</h3>
              <p className="text-gray-300">
                Special perks for your entire team. Collaborate and win together!
              </p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {!eventStarted ? (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
                >
                  <Clock className="text-orange-400 mx-auto mb-4 animate-pulse" size={64} />
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Get Ready! ⏰
                  </h2>

                  <p className="text-xl text-gray-300 mb-6">
                    Reward claiming will open at
                  </p>

                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold py-4 px-6 rounded-lg mb-6">
                    7:30 PM | December 3, 2025
                  </div>

                  <p className="text-gray-300 mb-4">
                    Organized by <span className="text-yellow-400 font-bold">Zenith</span>
                  </p>

                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mt-6">
                    <p className="text-yellow-300 text-sm">
                      💡 Tip: Keep this page open and be ready to claim your reward as soon as the timer hits zero!
                    </p>
                  </div>
                </motion.div>
              ) : !claimed ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Claim Your Reward
                    </h2>
                    <p className="text-sm text-gray-400">
                      Organized by <span className="text-yellow-400 font-semibold">Zenith</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white mb-2 font-medium">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">
                        Roll Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your roll number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">
                        Team Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your team name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">
                        College (Optional)
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your college name"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        '🎉 Claim My Reward Now!'
                      )}
                    </button>
                  </form>

                  <div className="mt-6 flex items-start gap-2 text-yellow-300 bg-yellow-400/10 p-4 rounded-lg">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Hurry! Limited rewards available. Claim yours before they run out!
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={48} className="text-white" />
                  </motion.div>

                  <h2 className="text-4xl font-bold text-white mb-4">
                    Congratulations! 🎉
                  </h2>

                  <p className="text-xl text-gray-300 mb-6">
                    You've successfully claimed your reward!
                  </p>

                  <div className="bg-white/20 rounded-lg p-6 mb-6 text-left">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Roll Number:</span>
                        <span className="text-white font-semibold">{formData.rollNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Team:</span>
                        <span className="text-white font-semibold">{formData.teamName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                      📧 Check your email for further instructions on how to collect your reward!
                    </p>
                  </div>

                  <p className="text-gray-400 text-sm mb-6">
                    Event organized by <span className="text-yellow-400 font-semibold">Zenith</span>
                  </p>

                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Back to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TechHuntSponsor;
