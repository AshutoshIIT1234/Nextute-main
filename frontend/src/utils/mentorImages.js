// Mentor image mappings
import mentor1 from '../assets/mentor1.jpg';

// Add your mentor images here
export const mentorImages = {
  1: mentor1, // Gopal Gurjar - using local image
  2: "https://ui-avatars.com/api/?name=Priya+Malhotra&background=8B5CF6&color=fff&size=400",
  3: "https://ui-avatars.com/api/?name=Rohan+Kapoor&background=3B82F6&color=fff&size=400",
  4: "https://ui-avatars.com/api/?name=Ananya+Singh&background=EC4899&color=fff&size=400",
  5: "https://ui-avatars.com/api/?name=Karan+Sharma&background=F59E0B&color=fff&size=400",
  // Add more mentor IDs and their image URLs or imports
};

// Function to get mentor image by ID
export const getMentorImage = (mentorId, mentorName = "Mentor") => {
  return mentorImages[mentorId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=2D7B67&color=fff&size=400`;
};

// To add more local images:
// 1. Put the image in frontend/src/assets/
// 2. Import it: import mentor2 from '../assets/mentor2.jpg';
// 3. Add to mentorImages object: 2: mentor2,
