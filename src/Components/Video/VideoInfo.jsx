import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaShare, FaStar } from "react-icons/fa";
import { api } from "../../Config/Api";
import useAuthStore from "../../Store/authStore";

// A simple loading spinner
const LoadingSpinner = () => (
  <>
    <div className="rounded-full animate-spin h-[80%] w-[80%] border-t border-b border-red-600"></div>
    <h1 className="text-[8px] lobster absolute text-red-600 animate-pulse z-50">
      UM
    </h1>
  </>
);

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const VideoInfo = ({ video }) => {
  const { getToken, userInfo } = useAuthStore();
  const [token, setToken] = useState(null);
  console.log(video.url)
  // Initial button states based on userReaction
  const { userReaction } = video;
  const [isLikeDisabled, setIsLikeDisabled] = useState(true);
  const [isDislikeDisabled, setIsDislikeDisabled] = useState(true);

  // Loading state for buttons
  const [isLoading, setIsLoading] = useState({ like: false, dislike: false });

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken);
      
      if (fetchedToken) {
        setIsLikeDisabled(userReaction ? userReaction.hasLiked : false);
        setIsDislikeDisabled(userReaction ? userReaction.hasDisliked : false);
      } else {
        setIsLikeDisabled(true);
        setIsDislikeDisabled(true);
      }
    };

    fetchToken();
  }, [getToken, userReaction]);

  const handleReaction = async (type) => {
    if (!token || !userInfo) {
      console.log("Please log in to react to videos");
      return;
    }

    // Set loading state for the respective button
    setIsLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const response = await api.videos.post(
        `/${video._id}/${type}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-ming-token": token,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (type === "like") {
          // If the user liked the video, disable like and enable dislike
          setIsLikeDisabled(true);
          setIsDislikeDisabled(false);
        } else if (type === "dislike") {
          // If the user disliked the video, disable dislike and enable like
          setIsLikeDisabled(false);
          setIsDislikeDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error reacting to video:", error);
    } finally {
      // Reset loading state after the request completes
      setIsLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row items-start p-4 pt-0 md:pb-0"
      >
        <h1 className="w-full text-lg md:text-xl font-medium text-gray-600">
          {video.title}
        </h1>
        <div className="w-full flex gap-3 text-sm items-center justify-end my-3">
          <div className="w-auto flex gap-2 items-start justify-start pl-1 text-sm text-gray-600">
            <p className="text-base font-medium">{video.views} views</p>
            <div className="flex gap-1">
              <FaStar className="text-xs text-red-600" />
              <p className="text-sm font-semibold"> {formatDate(video.uploadDate)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`w-8 h-8 flex items-center justify-center border border-gray-300 duration-100 gap-2 ${
                isLikeDisabled ? "bg-red-600 text-white cursor-not-allowed" : ""
              }`}
              onClick={() => !isLikeDisabled && handleReaction("like")}
              disabled={isLikeDisabled || isLoading.like}
            >
              {isLoading.like ? <LoadingSpinner /> : <FaThumbsUp />}
            </button>

            <button
              className={`w-8 h-8 flex items-center justify-center border border-gray-300 duration-100 gap-2 ${
                isDislikeDisabled ? "bg-red-600 text-white cursor-not-allowed" : ""
              }`}
              onClick={() => !isDislikeDisabled && handleReaction("dislike")}
              disabled={isDislikeDisabled || isLoading.dislike}
            >
              {isLoading.dislike ? <LoadingSpinner /> : <FaThumbsDown />}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default VideoInfo;
