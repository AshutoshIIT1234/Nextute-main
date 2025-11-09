// Mentor image mappings
import mentor1 from '../assets/mentor1.jpg';
import mentor3 from '../assets/mentor3.jpg';
import mentor4 from '../assets/mentor4.jpg';
import mentor9 from '../assets/mentor9.jpg';

// Add your mentor images here
export const mentorImages = {
  1: mentor1, // Gopal Gurjar
  2: mentor3, // Shubhomoy Dey
  3: mentor4, // Likhitha
  4: mentor9, // Karan Garg
  5: "https://ui-avatars.com/api/?name=Mentor&background=F59E0B&color=fff&size=400",
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
