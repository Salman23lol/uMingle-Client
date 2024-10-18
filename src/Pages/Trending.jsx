import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { api } from "../Config/Api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegEye } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";


const VideoCard = ({ video }) => (
    <div className="w-full">
    <motion.li
      key={video._id}
      className="group w-full flex flex-col items-start p-4 gap-2 duration-300"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/video/${video._id}`} className="w-full h-48">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <div className="w-full h-full flex flex-col justify-between p-2">
        <div className="flex flex-col">
          <p className="text-lg font-medium">{video.title.length > 50 ? `${video.title.substring(0, 50)}...` : video.title}</p>
          <p className="text-sm text-gray-600 mt-1">{video.description.length > 50 ? `${video.description.substring(0, 50)}...` : video.description}</p>
        </div>
        <div className="flex gap-3 items-start mt-2 text-sm">
          <div className="flex items-center gap-2"><FaRegEye /> {video.views}</div>
          <div className="flex items-center gap-2"><AiOutlineLike /> {video.likes}</div>
        </div>
      </div>
    </motion.li>
  </div>
  );

const Trending = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await api.videos.get("/videos/trending");
        setVideos(response.data);
      } catch (error) {
        console.error("Failed to fetch trending videos:", error);
      }
    };

    fetchTrendingVideos();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <Helmet>
        <title>Trending Videos - UMingle</title>
        <meta name="description" content="Watch the latest trending videos." />
      </Helmet>
      <h1 className="text-2xl font-semibold m-4 mb-0">Trending Videos</h1>
      <div className="grid grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} /> // Using VideoCard component
        ))}
      </div>
    </div>
  );
};

export default Trending;