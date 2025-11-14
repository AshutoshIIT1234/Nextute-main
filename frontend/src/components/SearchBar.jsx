import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RectangleIcon } from "./RectangleIcon.jsx";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/institutes-on-location?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative flex items-center justify-between mt-6 sm:mt-10 w-full max-w-md md:max-w-lg lg:max-w-4xl mx-auto shadow-lg border-2 border-gray-800 rounded-full bg-white overflow-visible">
      {/* Left: Location Icon + Input */}
      <div className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 flex-1">
        <FaLocationDot className="text-green-700 text-xl sm:text-2xl flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by Coaching, Course, location..."
          className="outline-none bg-transparent w-full text-gray-900 placeholder-gray-600 text-sm sm:text-base font-normal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {/* Right: Search Button with subtle decorative elements */}
      <div className="relative flex items-center justify-center pr-1">
        {/* Desktop: Small decorative accent behind button */}
        <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        
        </div>
        
        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="relative z-10 bg-teal-700 hover:bg-teal-800 text-white rounded-full p-3 sm:p-4 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105"
          aria-label="Search"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
