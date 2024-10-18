import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { api } from '../../Config/Api';
import { Link } from "react-router-dom";

const RelatedVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const response = await api.videos.get('/videos/trending');
        setVideos(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching related videos:", error);
      }
    };

    fetchRelatedVideos();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="flex flex-col gap-4 pt-4 md:pt-0"
    >
      <div className="text-xl font-semibold flex items-center gap-2 text-gray-600 ">Trending <FaChevronDown className="text-sm" /></div>
        <div className="w-full flex flex-wrap gap-3">
        {videos.map((video) => (
          <Link 
            to={`/video/${video._id}`}
          key={video._id} className="w-full flex items-start hover:text-red-600 duration-200">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-64 lg:h-28 object-cover"
            />
            <div className="px-2">
              <h4 className="font-medium text-base">
                {video.title.length > 40
                  ? `${video.title.substring(0, 40)}...`
                  : video.title}
              </h4>
              <div className="flex items-start justify-start pt-1">
                <div className="flex flex-col">
              <h1 className="text-sm">{video.channel.name}</h1>
              <p className="text-xs pl-0.5">
                {video.views} views • {formatDate(video.uploadDate)}
              </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
        </div>
    </motion.div>
  );
};

export default RelatedVideos;