import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../../Config/Api";
import useAuthStore from "../../Store/authStore";
import { AiOutlineLike } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";

const CommentSection = ({ video, userInfo }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [video._id]);

  const fetchComments = async () => {
    try {
      console.log(video._id);
      const response = await api.videos.get(`/${video._id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!userInfo) return;
    try {
      const getToken = useAuthStore.getState().getToken;
      console.log(getToken);
      await api.videos.post(
        `/${video._id}/comments`,
        { content: newComment },
        {
          headers: {
            "x-ming-token": getToken(),
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLikeComment = async (commentId) => {
    if (!userInfo) return;
    try {
      const getToken = useAuthStore.getState().getToken;
      await api.comments.post(
        `/${commentId}/like`,
        {},
        {
          headers: {
            "x-ming-token": getToken(),
          },
        }
      );
      fetchComments(); // Refresh comments to update like count
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <div className="flex flex-col gap-3 text-gray-600 border-r border-gray-300">

      <h1 className="text-xl font-semibold mt-4 ml-2 flex gap-2">
        Comments <FaChevronDown className="mt-2 text-sm" />
      </h1>

      {!userInfo && 
      <h1 className="text-sm px-3 text-red-600">Login Required</h1>
      }
      <form onSubmit={handleSubmitComment} className="w-full flex items-center h-16">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={userInfo ? "Add a comment..." : "Please login to comment"}
          className="w-full h-full p-2 outline-none border-y border-gray-300"
          disabled={!userInfo}
        ></textarea>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`px-2 h-full bg-red-500 text-white hover:bg-red-600 transition-colors rounded-r ${!userInfo && 'opacity-50 cursor-not-allowed'}`}
          type="submit"
          disabled={!userInfo}
        >
          Post Comment
        </motion.button>
      </form>
      <div className="flex flex-col gap-2">
        {comments.map((comment) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col w-full border-b border-gray-300 p-3">
              <div className="flex items-top py-2 gap-2 mb-2">
                <img
                  className="w-10 h-10 rounded-full object-cover mt-1"
                  src={
                    comment.author.avatar ||
                    "https://picsum.photos/200/200?random=1"
                  }
                  alt={`${comment.author.username}'s avatar`}
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {comment.author.username}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className={`text-sm m-1 h-6 flex items-center gap-1 border-b border-red-600/50 hover:bg-red-600 hover:rounded-sm cursor-pointer hover:text-white p-1 ${comment.isLiked ? 'bg-red-600 text-white' : ''} ${!userInfo && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!userInfo}
                >
                  <AiOutlineLike size={20} /> {comment.likes}
                </button>
              </div>
              <p className="text-base mb-2">{comment.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
