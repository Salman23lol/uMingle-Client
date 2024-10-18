import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // Importing Helmet
import VideoPlayer from "../Components/Video/VideoPlayer";
import VideoInfo from "../Components/Video/VideoInfo";
import ChannelInfo from "../Components/Video/ChannelInfo";
import VideoDescription from "../Components/Video/VideoDescription";
import RelatedVideos from "../Components/Video/RelatedVideos";
import CommentSection from "../Components/Video/CommentSection";
import { api } from "../Config/Api";
import useAuthStore from "../Store/authStore";

const Video = () => {
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useAuthStore((state) => state.userInfo);

  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      const userId = userInfo !== null ? userInfo._id : '';
      const response = await api.videos.post(`/getVideo/${id}`, { userId });
      setVideo(response.data);
    } catch (err) {
      setError("Failed to load video. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!video) return <div>Video not found</div>;

  // Fake related videos data
  const relatedVideos = [
    // Your fake related videos here
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full overflow-y-scroll"
    >
      <Helmet>
        <title>{video.title} - UMingle</title>
        <meta name="description" content={video.description} />
      </Helmet>
      <div className="w-full mx-auto">
        <VideoPlayer url={video.url} vidId={video._id} />

        <VideoInfo video={video} />
        <ChannelInfo video={video} />

        <div className="w-full lg:grid md:grid-cols-3 pb-16">
          <div className="w-full flex flex-col lg:col-span-2 sm:pr-8">
            <VideoDescription
              description={video.description}
              showFullDescription={showFullDescription}
              setShowFullDescription={setShowFullDescription}
            />
            <div className="w-full">
              <div className="md:hidden">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="bg-red-600 mx-2 text-white px-4 py-2 rounded-md my-4 hover:bg-red-700 transition duration-300"
                >
                  {showComments ? "Hide Comments" : "Show Comments"}
                </button>
              </div>
              <div className={`md:block ${showComments ? 'block' : 'hidden'}`}>
                <CommentSection video={video} userInfo={userInfo} />
              </div>
            </div>
          </div>
          <div className="w-full px-2">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Video;
