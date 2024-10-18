import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBell, FaStar, FaRegStar, FaRegEye } from "react-icons/fa";
import { api } from "../Config/Api"; // Assuming you have a properly configured API instance
import { AiOutlineLike } from "react-icons/ai";
import useAuthStore from "../Store/authStore";
import { Helmet } from "react-helmet"; // Importing Helmet

const ChannelCard = ({ channel }) => {
  const isChannelNotFound = channel.queryResult === "Channel Not Found";
  const isSubscribed = channel.userReactions?.isSubscribed;
  const hasStarred = channel.userReactions?.hasStarred;

  return (
    <motion.li
      key={channel._id}
      className="flex flex-col md:flex-row items-start justify-between gap-16 p-4 transition-shadow duration-300 border-b border-gray-300"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isChannelNotFound ? (
        <p className="text-center text-lg">{channel.queryResult}</p>
      ) : (
        <>
          <div className="flex gap-3 group transition-all">
            <Link to={`/channel/${channel._id}`} className="w-40 h-40 group">
              <img src={channel.image} alt={channel.name} className="w-full h-full rounded-full object-cover" />
            </Link>
            <div className="flex flex-col">
              <span className="text-sm">
                {channel.channelId && isNaN(channel.channelId[0])
                  ? `${channel.channelId.split("-").slice(0, 2).join("-")}`
                  : "N/A"}
              </span>
              <p className="text-xl">{channel.name}</p>
              <p className="text-sm pl-0.5 pt-1 max-w-sm">{channel.description}</p>
              <div className="flex gap-3 items-start mt-2 text-sm">
                <div className="flex items-center text-base">
                  <FaBell className="mr-1 text-sm" />
                  <span>{channel.subscribers}</span>
                </div>
                <div className="flex items-center text-base">
                  <FaStar className="mr-1 text-sm" />
                  <span>{channel.stars}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              className={`relative w-32 group py-2 flex items-center justify-center gap-2 overflow-hidden rounded-full cursor-pointer border ${
                isSubscribed ? "border-red-500 text-red-500" : "border-gray-300"
              }`}
            >
              {isSubscribed ? (
                <>
                  <FaBell />
                  Subscribed
                </>
              ) : (
                "Subscribe"
              )}
              {channel.userReactions?.isOwn && "Customize"}
              <span className="absolute inset-0 w-full h-full rounded-lg bg-red-500 -z-50 transform scale-x-0 group-hover:scale-x-100 origin-bottom transition-transform duration-300 ease-in-out"></span>
            </button>

            <button
              className={`relative w-24 py-2 flex items-center justify-center gap-2 overflow-hidden rounded-full cursor-pointer border ${
                hasStarred ? "border-red-500" : "border-gray-300"
              }`}
              disabled={hasStarred}
            >
              <FaRegStar className={hasStarred ? "text-red-500" : ""} />
              <span className={hasStarred ? "text-red-500" : ""}>
                {hasStarred ? "Starred" : "Star"}
              </span>
              <span
                className={`absolute inset-0 w-full h-full rounded-lg ${
                  hasStarred ? "bg-red-500" : "bg-gray-300"
                } -z-50 transform scale-x-0 group-hover:scale-x-100 origin-bottom transition-transform duration-300 ease-in-out`}
              ></span>
            </button>
          </div>
        </>
      )}
    </motion.li>
  );
};

const VideoCard = ({ video }) => (
  <div className="w-full">
  <motion.li
    key={video._id}
    className="w-full flex flex-col lg:flex-row items-start p-4 gap-2 duration-300 border-b border-r border-gray-300"
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Link to={`/video/${video._id}`} className="w-full h-48">
      <img src={video.thumbnail} alt={video.title} className="w-full h-full rounded-lg object-cover" />
    </Link>
    <div className="max-w-64 h-full flex flex-col justify-between p-2">
      <div className="flex flex-col">
      <p className="text-lg font-medium">{video.title.length > 50 ? `${video.title.substring(0, 50)}...` : video.title}</p>
      <p className="text-sm text-gray-600 mt-1">{video.description.length > 100 ? `${video.description.substring(0, 80)}...` : video.description}</p>
      </div>
     
      <div className="flex gap-3 items-start mt-2 text-sm">
        <div className="flex items-center gap-2"><FaRegEye /> {video.views}</div>
        <div className="flex items-center gap-2"><AiOutlineLike /> {video.likes}</div>
      </div>
    </div>
  </motion.li>
</div>
);

const Search = () => {
  const { query } = useParams(); // Get the query from the URL
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [fetchingData, setFetchingData] = useState(true); // Set fetchingData to true initially to trigger the first fetch
  const userInfo = useAuthStore((state) => state.userInfo);

  useEffect(() => {
    // This effect will run once when the component mounts, or when the query changes
    const fetchChannelsAndVideos = async () => {
      try {
        console.log(userInfo && userInfo._id)
        const response = await api.search.post(`/${query}`, { userId: userInfo && userInfo._id || null });
        setChannels(response.data.channels);
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching channels and videos:", error);
      } finally {
        setFetchingData(false); // Stop the loading state after fetching
      }
    };

    fetchChannelsAndVideos(); // Fetch data on component mount
  }, [query]); // Dependency on query to refetch data when it changes

  return (
    <>
      <Helmet>
        <title>Search Results for "{query}" - UMingle</title>
        <meta name="description" content={`Search results for "${query}" on UMingle.`} />
      </Helmet>
      <div className="w-full flex flex-col gap-2">
        {fetchingData ? (
            <div className="w-full h-screen flex items-center justify-center relative bg-gray-100">
            <motion.div
              className="rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
              style={{ animation: 'pulse 1.5s infinite' }}
            >
            </motion.div>
            <h1 className="text-xl lobster absolute text-red-600 animate-pulse z-50">
              UMingle
            </h1>
          </div>
        ) : (
          <ul className="text-gray-600">
            {channels.map((channel) => (
              <ChannelCard key={channel._id} channel={channel} />
            ))}
            <div className="grid grid-cols-2">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
            </div>
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;
