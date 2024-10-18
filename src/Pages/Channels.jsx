import React, { useState, useEffect } from "react";
import { FaChevronUp, FaRegStar } from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { api } from "../Config/Api";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

// Utility function to format subscriber count
const formatSubscribers = (subscribers) => {
  if (subscribers >= 1_000_000) {
    return `${(subscribers / 1_000_000).toFixed(1)}M`;
  } else if (subscribers >= 1_000) {
    return `${(subscribers / 1_000).toFixed(1)}K`;
  }
  return subscribers.toString();
};

// ChannelItem component for individual channel
const ChannelItem = React.memo(({ channel, isRecommended }) => {
  const { _id, image, name, subscribers, totalVideos, stars } = channel;

  return (
    <div
      key={_id}
      className="flex items-start gap-2 hover:text-red-600 duration-200 border border-gray-300 rounded group relative overflow-hidden"
    >
      <div className="relative w-full h-32 overflow-hidden">
        <img
          src={image || "https://picsum.photos/160/100?random=1"}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 flex items-center justify-center transition-all duration-300">
          <Link to={`/channel/${_id}`} className="text-white w-10 h-10 flex items-center justify-center bg-white/30 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
            <FaChevronUp />
          </Link>
        </div>
      </div>
      <div className="w-full h-full relative pt-2">
        <h1 className="text-lg mb-1">{name}</h1>
        <div className="text-sm flex items-center">
          {formatSubscribers(subscribers)}{" "}
          <span className="flex items-center ml-1">
            Subscribers
            {subscribers > 200_000 && (
              <GoVerified className="ml-2 text-red-600 text-xs" />
            )}
          </span>
        </div>
        {!isRecommended && <p className="text-sm">{totalVideos} videos</p>}
        <p className="absolute bottom-1 right-2 flex items-center gap-1">
          <FaRegStar /> {stars}
        </p>
      </div>
    </div>
  );
});

// Loading component
const Loading = () => (
  <div className="w-full flex items-center justify-center relative">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600 flex items-center justify-center relative"></div>
    <h1 className="text-xl lobster absolute text-red-600 animate-pulse z-50">UMingle</h1>
  </div>
);

// Main Channels component
const Channels = () => {
  const channelsTypes = ["popular", "trending", "new", "recommended"];
  const [channels, setChannels] = useState([]);
  const [activeType, setActiveType] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);

  const fetchChannels = async (type) => {
    setIsLoading(true);
    try {
      const response = await api.channels.get(`/channels/${type}`);
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels(activeType);
  }, [activeType]);

  return (
    <>
    <Helmet>
        <title>Channels - Mingle</title>
        <meta name="description" content="Explore various channels on Mingle." />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <div className="w-full overflow-y-scroll p-4 text-gray-600">
      <h1 className="text-2xl font-medium mb-6">Channels</h1>
      <div className="mb-4 flex gap-2">
        {channelsTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              activeType === type ? "bg-red-600 text-white" : "border border-gray-300"
            }`}
            onClick={() => setActiveType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <ChannelItem key={channel._id} channel={channel} isRecommended={activeType === "recommended"} />
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Channels;
