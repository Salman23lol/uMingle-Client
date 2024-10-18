import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../Config/Api";
import { useParams, Link } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import { FaRegBell, FaStar, FaRegStar, FaRegEye } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { Helmet } from "react-helmet";

const Channel = () => {
  const [channelData, setChannelData] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { userInfo, token: authToken } = useAuthStore();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isOwnChannel, setIsOwnChannel] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        const response = await api.channels.post(`/getChannel/${id}`, {
          userId: userInfo?._id,
        });
        const fetchChannelVideos = await api.channels.get(`/${id}/videos`, {
          userId: userInfo?._id,
        });
        setChannelData(response.data);
        setChannelVideos(fetchChannelVideos.data.videos);
        if (response.data.userReactions) {
          setIsSubscribed(response.data.userReactions.isSubscribed || false);
          setIsStarred(response.data.userReactions.hasStarred || false);
        }
        setIsOwnChannel(userInfo && userInfo._id === response.data.creator._id || userInfo.channel === id);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [id, userInfo]);

  const handleSubscribe = async () => {
    if (!authToken) return;
    try {
      const endpoint = isSubscribed ? "unsubscribe" : "subscribe";
      const response = await api.channels.put(
        `/${id}/${endpoint}`,
        {},
        {
          headers: {
            "x-ming-token": authToken,
          },
        }
      );
      if (response.status === 200) {
        setIsSubscribed(!isSubscribed);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error(
        `Error ${
          isSubscribed ? "unsubscribing from" : "subscribing to"
        } channel:`,
        error
      );
    }
  };

  const handleStar = async () => {
    if (!authToken) return;
    try {
      const endpoint = isStarred ? "unstar" : "star";
      const response = await api.channels.post(
        `/${id}/${endpoint}`,
        {},
        {
          headers: {
            "x-ming-token": authToken,
          },
        }
      );
      if (response.status === 200) {
        setIsStarred(!isStarred);
      }
    } catch (error) {
      console.error(
        `Error ${isStarred ? "unstarring" : "starring"} channel:`,
        error
      );
    }
  };

  const toggleDropdown = () => {
    if (!authToken) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading)
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
        ></motion.div>
        <h1 className="text-xl lobster absolute text-red-600 animate-pulse z-50">
          UMingle
        </h1>
      </div>
    );
  if (!channelData) return <div>Channel not found</div>;

  return (
    <>
     <Helmet>
        <title>{channelData.name} - Mingle</title>
        <meta name="description" content={channelData.description} />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen overflow-y-scroll"
    >
      <div className="relative h-[60vh] md:h-[40vh] flex items-center justify-center gap-10">
        <img
          src={channelData.banner || "https://picsum.photos/1920/1080"}
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="w-full h-full flex flex-col justify-center gap-8 md:gap-0 md:flex-row md:justify-between items-center px-8 absolute top-0">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <div className="w-full max-w-xl flex flex-col sm:flex-row items-center sm:text-start justify-center gap-3">
              <img
                src={channelData.image}
                alt="Channel Avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="text-white">
                <h2 className="text-sm">{channelData.channelId.split('-').slice(0, 2).join('-')}</h2>
                <h1 className="text-3xl font-semibold">{channelData.name}</h1>
                <p className="w-full max-w-sm text-sm mt-">
                  {channelData.description}
                </p>
              </div>
            </div>
          </div>

          <div className="w-96 h-44 flex flex-col justify-center items-center bg-white/20 rounded">
            <div className="text-white px-4 py-2 rounded-sm text-base flex items-center justify-center gap-2 mb-4">
              {isOwnChannel && authToken ? (
                <Link to={`/customize/${id}`}>
                  <button className="text-sm sm:text-lg text-white w-32 h-8 sm:w-44 sm:h-10 rounded-sm bg-red-600 hover:bg-red-700">
                    Customize
                  </button>
                </Link>
              ) : (
                <div className="relative flex">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={isSubscribed ? toggleDropdown : handleSubscribe}
                      className={`text-sm sm:text-base text-white w-32 h-8 sm:h-10 rounded-sm flex items-center justify-center bg-red-600 hover:bg-red-700 ${
                        !authToken ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={!authToken}
                    >
                      {isSubscribed ? (
                        <>
                          <FaRegBell className="mr-2" />
                          Subscribed
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                    {!authToken && (
                      <p className="text-start text-sm text-red-500 ml-2">
                        Login required
                      </p>
                    )}
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-[9990] -top-12 right-6 w-full bg-white/50 text-black rounded-sm shadow-lg"
                      >
                        <button
                          onClick={handleSubscribe}
                          className="w-full text-sm px-4 py-2 hover:bg-gray-200 duration-200"
                        >
                          Unsubscribe
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={handleStar}
                    className={`ml-2 p-2 rounded-full ${
                      !authToken ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!authToken}
                  >
                    {isStarred ? (
                      <FaStar className="text-2xl text-red-600" />
                    ) : (
                      <FaRegStar className="text-2xl text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-6 text-white">
              <div className="flex flex-col items-center">
                <p className="text-xl flex items-center gap-2">
                  <IoVideocamOutline /> {channelData.totalVideos}
                </p>
                <p className="text-base">Videos</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl flex items-center gap-2">
                  <FaPeopleGroup size={22} />
                  {channelData.subscribers}
                </p>
                <p className="text-base">Subscribers</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl flex items-center gap-2">
                  <FaRegEye />
                  {channelData.totalViews}
                </p>
                <p className="text-base">Views</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl flex items-center gap-2">
                  <FaRegStar size={19} />
                  {channelData.stars}
                </p>
                <p className="text-base">Stars</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-24 text-gray-600 py-3">
        <div className="flex gap-3 border-b border-red-600 mb-6">
          <button
            className={`py-2 px-4 ${
              activeTab === "videos"
                ? "border-b-2 border-red-600 text-red-600"
                : ""
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "info"
                ? "border-b-2 border-red-600 text-red-600"
                : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            Channel Info
          </button>
        </div>

        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {channelVideos.map((video) => (
              <Link key={video._id} to={`/video/${video._id}`}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full lg:h-52 object-cover rounded shadow-md"
                />
                <div className="p-1 py-2">
                  <h3 className="font-medium text-base lg:text-lg mb-2">{video.title}</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={video.creator.avatar}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <h2 className="text-base font-medium mb-1">{video.creator.username}</h2>
                    </div>
                    <div className="w-full flex justify-between px-2">
                      <p className="text-sm flex items-center gap-2"><FaRegEye /> {video.views} views</p>
                      <p className="text-sm">{formatDate(video.uploadDate)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "info" && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img
                src={channelData.creator.avatar}
                alt={channelData.creator.username}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="font-medium text-xl">
                  {channelData.creator.username}
                </p>
                <p className="text-base ">
                  User Since: {formatDate(channelData.creator.createdAt)}
                </p>
              </div>
            </div>
            <p>
              <strong>Email:</strong> {channelData.creator.email}
            </p>
            <p>
              <strong>Total Videos:</strong> {channelData.totalVideos}
            </p>
            <p>
              <strong>Total Views:</strong> {channelData.totalViews}
            </p>
            <p>
              <strong>Subscribers:</strong> {channelData.subscribers}
            </p>
          </div>
        )}
      </div>
    </motion.div>
    </>
  );
};

export default Channel;
