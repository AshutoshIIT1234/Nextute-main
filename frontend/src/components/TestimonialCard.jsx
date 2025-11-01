import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { test2, test3 } from "../assets";

const TestimonialCard = ({ text, quote, author, rating }) => {
  const renderStars = (rating) => {
    const starCount = parseFloat(rating) || 0;
    const fullStars = Math.floor(starCount);
    const hasHalfStar = starCount % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`star-full-${i}`} className="text-[#2d7a66] text-xl" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key={`star-half`} className="text-[#2d7a66] text-xl" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`star-empty-${i}`} className="text-[#2d7a66] text-xl" />
      );
    }

    return <div className="flex justify-center gap-1 mb-4">{stars}</div>;
  };

  // Determine if the author is likely male or female based on name
  const isFemale = (name) => {
    // Common female names in the testimonials
    const femaleNames = ["priya", "sneha", "ananya", "kavya", "meera"];
    const firstName = name.split(" ")[0].toLowerCase();
    return femaleNames.includes(firstName);
  };

  // Choose image based on gender
  const getProfileImage = () => {
    if (isFemale(author)) {
      return test2; // Female testimonial image
    } else {
      return test3; // Male testimonial image
    }
  };

  return (
    <div className="my-20 flex items-center justify-center px-4">
      <div className="polygon relative bg-gradient-to-t from-[#ffffff] to-[#e8f3e2] rounded-[60px] max-w-xl w-full p-8 pt-16 text-center shadow-lg">
        <div className="absolute top-[-40px] left-0 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="rounded-full w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {renderStars(rating)}
        <p className="text-xs text-gray-800 leading-relaxed">{text}</p>
        <p className="text-xs text-gray-900 mt-2 font-bold leading-relaxed">
          {quote}
        </p>
        <div className="mt-4 text-sm text-gray-700 italic">
          <span className="inline-block px-3 py-1 rounded-full font-medium">
            - {author}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
