import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SearchComponent = () => {
  const [searchText, setSearchText] = useState(''); // To hold the search input
  
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle the search button click
  const handleSearch = () => {
    const trimmedSearchText = searchText.trim();
    
      console.log('Searching for:', trimmedSearchText);
      
      navigate(`/search/${trimmedSearchText}`); 
    }


  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  }
  return (
    <div className="w-[26rem] h-full hidden md:flex items-center relative">
      <input
        type="text"
        value={searchText} // Controlled value via state
        onChange={handleInputChange} // Handle text input changes
        placeholder="Search..."
        className="w-full h-full focus:border-red-600 outline-none p-2 px-3 border border-gray-300 rounded-l-lg"
      />
     
      <motion.button
        whileHover="hover"
        className="relative flex justify-center items-center hover:text-white w-16 h-full group border-y border-r rounded-r-lg border-gray-300 overflow-hidden"
        onClick={handleSearch} // Search button click
      >
        <FaSearch />
        <span className="absolute inset-0 rounded-r-lg bg-red-500 shadow-lg shadow-gray-400 -z-50 transform scale-x-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
      </motion.button>
    </div>
  );
};

export default SearchComponent;
