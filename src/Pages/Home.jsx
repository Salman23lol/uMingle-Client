import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay, FaRegEye, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../Config/Api";
import { Helmet } from "react-helmet"; // Importing Helmet

const TABS = [
  { id: "recommended", label: "Recommended" },
  { id: "latest", label: "Latest" },
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Popular" },
  { id: "music", label: "Music" },
];

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [videoDurations, setVideoDurations] = useState({});
  const [loadingVideos, setLoadingVideos] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state
  const videoRefs = useRef([]);
  const hoverTimeouts = useRef({});
  const navigate = useNavigate();

  const fetchVideos = useCallback(async (category) => {
    try {
      const endpoints = {
        recommended: "/videos/recommended",
        latest: "/videos/latest",
        trending: "/videos/trending",
        popular: "/videos/popular",
        music: "/videos/music",
      };

      const response = await api.videos.get(
        endpoints[category] || endpoints.recommended
      );
      setVideos(response.data);
      setLoading(false); // Set loading to false after fetching videos
    } catch (error) {
      console.error(`Error fetching ${category} videos:`, error);
      setLoading(false); // Set loading to false on error
    }
  }, []);

  useEffect(() => {
    fetchVideos(activeTab);
  }, [activeTab, fetchVideos]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleMetadataLoaded = (index, event) => {
    const duration = event.target.duration;
    setVideoDurations((prev) => ({
      ...prev,
      [index]: formatDuration(duration),
    }));
  };

  const handleMouseEnter = (index) => {
    setLoadingVideos((prev) => ({ ...prev, [index]: true }));
    hoverTimeouts.current[index] = setTimeout(() => {
      const videoElement = videoRefs.current[index];
      if (videoElement) {
        videoElement.style.display = "block";
        videoElement.play();
      }
    }, 1000);
  };

  const handleMouseLeave = (index) => {
    clearTimeout(hoverTimeouts.current[index]);
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.style.display = "none";
    }
    setLoadingVideos((prev) => ({ ...prev, [index]: false }));
  };

  const handleVideoPlay = (index) => {
    document.getElementById(`loading-${index}`).classList.add("hidden");
  };

  const handleVideoTimeUpdate = (index, videoId) => {
    const videoElement = videoRefs.current[index];
    if (
      videoElement &&
      videoElement.currentTime / videoElement.duration >= 0.2 &&
      window.innerWidth >= 768 // Check if screen width is at least 'sm'
    ) {
      navigate(`/video/${videoId}`);
    }
  };

  const handleCardClick = (videoId, event) => {
    event.stopPropagation();
    navigate(`/video/${videoId}`);
  };

  const handleChannelLinkClick = (e) => {
    e.stopPropagation();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.13,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    // Loading indicator
    return (
      <div className="w-full h-screen flex items-center justify-center relative bg-gray-100">
        <motion.div
          className="rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
          style={{ animation: "pulse 1.5s infinite" }}
        />
        <h1 className="text-xl lobster absolute text-red-600 animate-pulse z-50">
          UMingle
        </h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Home - UMingle </title>
        <meta name="description" content="Watch the latest videos on UMingle." />
      </Helmet>
      <div className="w-full h-full bg-white pb-16 text-gray-600">
        <div
          className="flex justify-start mb-4 py-2 border-b border-gray-300"
        >
          {TABS.map((tab) => (
            <div key={tab.id} className="relative">
              <button
                className={`relative z-10 px-2 sm:px-4 h-6 sm:h-8 mx-2 rounded-full text-xs sm:text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "border border-gray-300"
                } transition-colors duration-300 group overflow-hidden`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span
                  className={`relative z-10 font-medium ${
                    activeTab !== tab.id ? "group-hover:text-white" : ""
                  }`}
                >
                  {tab.label}
                </span>
                <span className="absolute inset-0 bg-red-600 z-0 scale-x-0 origin-center transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-2 sm:px-4">
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.div
                key={video._id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -100, transition: { duration: 0.5 } }}
                className="group relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={(e) => handleCardClick(video._id, e)}
              >
                <div className="bg-white overflow-hidden cursor-pointer hover:text-red-600 transition-colors duration-300 group">
                  <div className="w-full relative">
                    <img
                      src={
                        video.thumbnail ||
                        "https://picsum.photos/300/200?random=1"
                      }
                      alt={video.title}
                      className="w-full h-40 sm:h-48 rounded-lg object-cover transition-all duration-300"
                    />

                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={video.url}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      muted
                      loop
                      preload="metadata"
                      onLoadedMetadata={(e) => handleMetadataLoaded(index, e)}
                      onPlay={() => handleVideoPlay(index)}
                      onTimeUpdate={() => handleVideoTimeUpdate(index, video._id)}
                      style={{ display: "none" }}
                    />

                    <div
                      id={`loading-${index}`}
                      className={`w-full h-full bg-black/30 rounded-lg absolute top-0 flex flex-col items-center justify-center ${
                        loadingVideos[index] ? "" : "hidden"
                      }`}
                    >
                      <motion.div
                        className="rounded-full h-24 w-24 border-t-2 border-b-2 border-red-600 absolute"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                        }}
                      />
                      <h1 className="lobster text-red-600 animate-pulse z-50">
                        UMingle
                      </h1>
                    </div>
                  </div>

                  <div className="p-2">
                    <h1 className="font-semibold text-sm sm:text-base mb-2">
                      {video.title.length > 50
                        ? `${video.title.substring(0, 46)}...`
                        : video.title}
                    </h1>

                    <Link
                      to={`/channel/${video.channel._id}`}
                      className="w-full flex items-start gap-2 my-2 z-50"
                      onClick={handleChannelLinkClick}
                    >
                      <img
                        src={
                          video.channel?.image ||
                          "https://picsum.photos/300/200?random=11"
                        }
                        className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-cover"
                      />
                      <div className="w-full flex flex-col">
                        <h1 className="font-medium text-sm sm:text-base">
                          {video.channel?.name || "Unknown Channel"}
                        </h1>
                        <div className="w-full flex justify-between text-xs pt-1">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-xs sm:text-base">
                              <FaStar />
                              {video.channel?.stars}
                            </div>
                            <div className="flex items-center gap-2  text-xs sm:text-base">
                              <FaRegEye />
                              {video.views}
                            </div>
                          </div>
                          <p className="w-auto text-center text-xs sm:text-base">
                            {formatDate(video.uploadDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Home;
