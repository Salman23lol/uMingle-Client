import React from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const VideoDescription = ({
  description,
  showFullDescription,
  setShowFullDescription,
}) => {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gray-200 p-4 rounded-sm z-0"
    >
      <p className="text-sm mb-2">
        {showFullDescription
          ? description
          : `${description.slice(0, 150)}...`}
      </p>
      <button
        onClick={() => setShowFullDescription(!showFullDescription)}
        className="text-red-600 hover:underline flex items-center text-xs"
      >
        {showFullDescription ? "Show less" : "Show more"}
        {showFullDescription ? (
          <FaChevronUp className="ml-1" />
        ) : (
          <FaChevronDown className="ml-1" />
        )}
      </button>
    </motion.div>
  );
};

export default VideoDescription;