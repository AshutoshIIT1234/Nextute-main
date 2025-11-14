import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap, FaUsers, FaRocket, FaHeart, FaLightbulb, FaMedal, FaUniversity } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const CareersPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    course: '',
    year: '',
    expertise: '',
    linkedin: '',
    coverLetter: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const response = await fetch(`${API_URL}/api/careers/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Application submitted successfully! Check your email for confirmation.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          institution: '',
          course: '',
          year: '',
          expertise: '',
          linkedin: '',
          coverLetter: ''
        });
      } else {
        toast.error(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <FaRocket className="text-4xl text-teal-600" />,
      title: 'Flexible Schedule',
      description: 'Work on your own time and set your availability'
    },
    {
      icon: <FaHeart className="text-4xl text-emerald-600" />,
      title: 'Competitive Pay',
      description: 'Earn competitive rates for your expertise'
    },
    {
      icon: <FaUsers className="text-4xl text-teal-700" />,
      title: 'Impact Lives',
      description: 'Help students achieve their career goals'
    },
    {
      icon: <FaLightbulb className="text-4xl text-emerald-500" />,
      title: 'Grow Together',
      description: 'Continuous learning and development opportunities'
    }
  ];

  const requirements = [
    'Currently studying at IIT (Indian Institute of Technology) or AIIMS (All India Institute of Medical Sciences)',
    'Strong academic performance and subject expertise',
    'Excellent communication and teaching skills',
    'Passion for mentoring and helping students succeed',
    'Available for at least 5-10 hours per week',
    'Ability to explain complex concepts in simple terms'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-teal-50 via-emerald-50/50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center items-center gap-4 mb-6">
              <FaUniversity className="text-5xl text-teal-700" />
              <FaMedal className="text-6xl text-emerald-500" />
              <FaGraduationCap className="text-5xl text-teal-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Join Nextute as a Student Mentor
            </h1>
            <div className="inline-block bg-gradient-to-r from-teal-700 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold text-lg mb-6 shadow-lg">
              Exclusively for IIT & AIIMS Students
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Share your knowledge, earn while you study, and help aspiring students achieve their dreams
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Nextute?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Eligibility Criteria</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            We're looking for exceptional students from India's premier institutions
          </p>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg shadow-lg p-8 border-2 border-teal-200">
            <div className="flex items-center justify-center gap-4 mb-6">
              <FaUniversity className="text-4xl text-teal-700" />
              <h3 className="text-2xl font-bold text-gray-800">IIT & AIIMS Students Only</h3>
            </div>
            <ul className="space-y-4">
              {requirements.map((req, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <span className="text-emerald-600 mr-3 text-xl font-bold">✓</span>
                  <span className="text-gray-700 text-lg">{req}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <FaBriefcase className="text-5xl text-teal-700 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Apply Now</h2>
              <p className="text-gray-600">Join our community of expert mentors</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution *
                  </label>
                  <select
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select your institution...</option>
                    <optgroup label="IIT">
                      <option value="IIT Bombay">IIT Bombay</option>
                      <option value="IIT Delhi">IIT Delhi</option>
                      <option value="IIT Madras">IIT Madras</option>
                      <option value="IIT Kanpur">IIT Kanpur</option>
                      <option value="IIT Kharagpur">IIT Kharagpur</option>
                      <option value="IIT Roorkee">IIT Roorkee</option>
                      <option value="IIT Guwahati">IIT Guwahati</option>
                      <option value="IIT Hyderabad">IIT Hyderabad</option>
                      <option value="IIT Indore">IIT Indore</option>
                      <option value="IIT BHU">IIT BHU (Varanasi)</option>
                      <option value="IIT Patna">IIT Patna</option>
                      <option value="IIT Ropar">IIT Ropar</option>
                      <option value="IIT Bhubaneswar">IIT Bhubaneswar</option>
                      <option value="IIT Gandhinagar">IIT Gandhinagar</option>
                      <option value="IIT Jodhpur">IIT Jodhpur</option>
                      <option value="IIT Mandi">IIT Mandi</option>
                      <option value="IIT Palakkad">IIT Palakkad</option>
                      <option value="IIT Tirupati">IIT Tirupati</option>
                      <option value="IIT Dhanbad">IIT Dhanbad (ISM)</option>
                      <option value="IIT Bhilai">IIT Bhilai</option>
                      <option value="IIT Goa">IIT Goa</option>
                      <option value="IIT Jammu">IIT Jammu</option>
                      <option value="IIT Dharwad">IIT Dharwad</option>
                    </optgroup>
                    <optgroup label="AIIMS">
                      <option value="AIIMS Delhi">AIIMS Delhi</option>
                      <option value="AIIMS Bhopal">AIIMS Bhopal</option>
                      <option value="AIIMS Bhubaneswar">AIIMS Bhubaneswar</option>
                      <option value="AIIMS Jodhpur">AIIMS Jodhpur</option>
                      <option value="AIIMS Patna">AIIMS Patna</option>
                      <option value="AIIMS Raipur">AIIMS Raipur</option>
                      <option value="AIIMS Rishikesh">AIIMS Rishikesh</option>
                      <option value="AIIMS Nagpur">AIIMS Nagpur</option>
                      <option value="AIIMS Mangalagiri">AIIMS Mangalagiri</option>
                      <option value="AIIMS Gorakhpur">AIIMS Gorakhpur</option>
                      <option value="AIIMS Bathinda">AIIMS Bathinda</option>
                      <option value="AIIMS Deoghar">AIIMS Deoghar</option>
                      <option value="AIIMS Kalyani">AIIMS Kalyani</option>
                      <option value="AIIMS Rae Bareli">AIIMS Rae Bareli</option>
                      <option value="AIIMS Vijaypur">AIIMS Vijaypur</option>
                    </optgroup>
                    <option value="Other">Other (Please specify in cover letter)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Branch *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., B.Tech CSE, MBBS"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Expertise *
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Physics, Mathematics, Biology"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to be a mentor? *
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell us about your motivation and what you can bring to our students..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-700 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-teal-800 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;
