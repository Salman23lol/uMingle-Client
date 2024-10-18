import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../Config/Api";
import Cookies from 'js-cookie';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FaRegBell = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaRegBell })));
const FaStar = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaStar })));
const FaRegStar = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaRegStar })));
const FaChevronUp = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaChevronUp })));
const FaChevronDown = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaChevronDown })));
const HiOutlineStatusOnline = lazy(() => import("react-icons/hi").then(module => ({ default: module.HiOutlineStatusOnline })));
const Link = lazy(() => import("react-router-dom").then(module => ({ default: module.Link })));

const ChannelInfo = ({ video }) => {
  const [isSubscribed, setIsSubscribed] = useState(video.userReaction?.isSubscribed || false);
  const [isStarred, setIsStarred] = useState(video.userReaction?.isStarred || false);
  const [isOwnChannel, setIsOwnChannel] = useState(false);
  const [channelStatus, setChannelStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false); // New state for status dropdown
  const [status, setStatus] = useState(video.userReaction && video.userReaction.channelStatus || ""); // New state for status
  const userInfo = JSON.parse(Cookies.get('user_info') || '{}');
  const authToken = Cookies.get('auth_token');

  useEffect(() => {
    if (userInfo && userInfo.channel === video.channel._id) {
      setIsOwnChannel(true);
    }
  }, [userInfo, video.channel._id]);

  const handleSubscribe = async () => {
    if (!authToken) return;
    try {
      const endpoint = isSubscribed ? 'unsubscribe' : 'subscribe';
      const response = await api.channels.put(`/${video.channel._id}/${endpoint}`, {}, {
        headers: {
          'x-ming-token': authToken
        }
      });
      if (response.status === 200) {
        setIsSubscribed(!isSubscribed);
        setIsDropdownOpen(false);
        setChannelStatus(response.subscription.status);
      }
    } catch (error) {
      console.error(`Error ${isSubscribed ? 'unsubscribing from' : 'subscribing to'} channel:`, error);
    }
  };

  const handleStar = async () => {
    if (!authToken) return;
    try {
      const endpoint = isStarred ? 'unstar' : 'star';
      const response = await api.channels.post(`/${video.channel._id}/${endpoint}`, {}, {
        headers: {
          'x-ming-token': authToken
        }
      });
      if (response.status === 200) {
        setIsStarred(!isStarred);
      }
    } catch (error) {
      console.error(`Error ${isStarred ? 'unstarring' : 'starring'} channel:`, error);
    }
  };

  const toggleDropdown = () => {
    if (!authToken) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleStatusDropdown = () => {
    if (!authToken) return;
    setIsStatusDropdownOpen(!isStatusDropdownOpen); // Toggle status dropdown
  };

  const handleStatus = async (selectedStatus) => {
    if (!authToken) return;
    try {
      const response = await api.channels.post(`/${video.channel._id}/${selectedStatus}`, {}, {
        headers: {
          'x-ming-token': authToken
        }
      });
      if (response.status === 200) {
        setStatus(selectedStatus); // Update the status state
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full h-16 flex items-center justify-start gap-2 mb-6 px-2 sm:px-4"
    >
      <div className="w-12 h-12">
        <Suspense fallback={<div>Loading...</div>}>
          <Link to={`/channel/${video.channel._id}`}>
            <img
              src={video.channel.image}
              alt={video.channel.name}
              className="w-full h-full rounded-full object-cover"
            />
          </Link>
        </Suspense>
      </div>
      <div className="w-full md:w-auto flex items-end justify-start gap-4">
        <div className="w-full flex flex-col">
          <h2 className="font-semibold">{video.channel.name}</h2>
          <p className="text-sm text-gray-600">
            {video.channel.subscribers} subscribers
          </p>
        </div>
        {isOwnChannel ? (
          <Suspense fallback={<button>Loading...</button>}>
            <Link to={`/customize/${video.channel._id}`}>
              <button className="text-base text-red-500 w-32 py-2 rounded-full border border-red-600 hover:bg-red-500 hover:text-white duration-200">
                Customize
              </button>
            </Link>
          </Suspense>
        ) : (
          <div className="relative flex">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <button 
                onClick={isSubscribed ? toggleDropdown : handleSubscribe}
                className={`text-base flex items-center justify-center py-2 w-36 rounded-full border border-gray-300 ${isSubscribed && "text-red-500 border-red-600"} hover:bg-red-500 hover:text-white duration-200 ${!authToken ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!authToken}
              >
                {isSubscribed ? (
                  <Suspense fallback={<div>Loading...</div>}>
                    <FaRegBell className="mr-2" />
                    Subscribed
                    {isDropdownOpen ? <FaChevronLeft className="ml-2" /> : <FaChevronRight className="ml-2" />} 
                    
                    </Suspense>
                ) : "Subscribe"}
              </button>
              {!authToken && (
                <p className="text-start text-sm text-red-500 ml-2">Login required</p>
              )}
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <div className="absolute top-0 right-52 md:-right-44 flex gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-red-500 rounded-full shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={handleSubscribe}
                      className="w-full text-base px-4 py-2 h-full hover:bg-red-500 text-gray-600 hover:text-white duration-200 font-medium"
                    >
                      unSubscribe
                    </button>
                  </motion.div>

                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                  className="relative">
                    <button 
                      onClick={toggleStatusDropdown} // Toggle status dropdown on click
                      className={`w-full flex items-center justify-center gap-2 text-base px-4 py-2 border border-red-600 rounded-full hover:bg-red-500 text-red-600 hover:text-white duration-200`}
                    >
                      <Suspense fallback={<div>Loading...</div>}>
                        <HiOutlineStatusOnline size={18} />
                      </Suspense>
                      <span className="font-medium">{status || channelStatus}</span>
                      {isStatusDropdownOpen ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </button>
                    <AnimatePresence>
                      {isStatusDropdownOpen && ( // Use the new state for the status dropdown
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          id="status-btn"
                          className="absolute -top-12 -right-1 w-56 bg-white border border-red-500 rounded-lg shadow-lg overflow-hidden z-10"
                        >
                          <div className="grid grid-cols-3">
                            {["All", "Off", "Silent"].map((option) => (
                              <div key={option} className={`w-full flex items-center justify-center text-gray-600 hover:text-white duration-200 ${status === option ? 'bg-red-600 text-white' : 'hover:bg-red-600'}`}>
                                <button className="w-full px-4 py-2" onClick={() => handleStatus(option)}>{option}</button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                </div>
              )}
            </AnimatePresence>
            {isStarred && (
              <button 
                onClick={handleStar} 
                className={`ml-2 p-2 rounded-full ${isStarred ? 'text-red-600 cursor-not-allowed' : 'text-gray-400'}`}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  {isStarred ? <FaStar className="text-2xl" /> : <FaRegStar className="text-2xl" />}
                </Suspense>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChannelInfo;
