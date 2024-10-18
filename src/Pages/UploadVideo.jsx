import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // Importing Helmet for managing document head
import { api } from "../Config/Api";
import { FaVideo, FaHeading, FaImage, FaTags } from "react-icons/fa";
import { MdOutlineDescription, MdOutlineSpeakerNotes } from "react-icons/md";
import useAuthStore from "../Store/authStore";
import Swal from "sweetalert2";

const UploadVideo = ({ userInfo }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [tags, setTags] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { getToken } = useAuthStore();
  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log(userInfo);
    const authToken = getToken();
    setToken(authToken);
    if (!authToken) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to upload a video.",
        icon: "warning",
        iconColor: "#DC2626",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }, [getToken]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      setVideoPreview(null);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
    } else {
      setThumbnailPreview(null);
    }
  };

  useEffect(() => {
    setIsFormValid(
      videoFile !== null &&
        title.trim() !== "" &&
        description.trim() !== "" &&
        thumbnail !== null &&
        tags.trim() !== "" &&
        token !== null
    );
  }, [videoFile, title, description, thumbnail, tags, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setErrorMessage("");

    try {
      // Upload video
      const videoFormData = new FormData();
      videoFormData.append("file", videoFile);
      const videoUploadResponse = await api.videos.post(
        "/upload-url/video",
        videoFormData,
        {
          headers: {
            "x-ming-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!videoUploadResponse.data || !videoUploadResponse.data.url) {
        throw new Error("Video upload failed");
      }

      const videoUrl = videoUploadResponse.data.url;

      // Upload thumbnail
      const thumbnailFormData = new FormData();
      thumbnailFormData.append("file", thumbnail);
      const thumbnailUploadResponse = await api.videos.post(
        "/upload-url/image",
        thumbnailFormData,
        {
          headers: {
            "x-ming-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!thumbnailUploadResponse.data || !thumbnailUploadResponse.data.url) {
        throw new Error("Thumbnail upload failed");
      }

      const thumbnailUrl = thumbnailUploadResponse.data.url;

      // Create video entry
      const createVideoResponse = await api.videos.post(
        `/create/${userInfo._id}`,
        {
          title,
          description,
          tags,
          url: videoUrl,
          thumbnail: thumbnailUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-ming-token": token,
          },
        }
      );

      setLoading(false);
      setTitle("");
      setDescription("");
      setTags("");
      setVideoFile(null);
      setVideoPreview(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      setErrorMessage("");
      alert("Video uploaded successfully!");
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to upload video. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Upload Video - UMingle</title>
        <meta name="description" content="Upload your video to UMingle" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full mx-auto p-4 sm:p-6 text-gray-600 relative"
      >
        <div className="absolute top-2 left-2 cursor-pointer bg-black/50 w-10 h-10 flex flex-col items-center hover:items-start hover:justify-start justify-center hover:w-64 hover:h-64 text-white p-2 rounded-md transition-all duration-300 group">
          <div className="flex items-center gap-2 group-hover:pb-2 text-xl">
            <MdOutlineSpeakerNotes size={20} className="animate-bounce mt-1" />
            <h1 className="hidden group-hover:flex">Tips for better reach:</h1>
          </div>
          <p className="text-sm hidden group-hover:flex flex-col gap-2 items-start mt-2">
            <h2>
              1. Pick a clear, relevant title that explains your video’s purpose.
            </h2>
            <h3>
              2. Add tags that describe the content and key topics of your video.
              This helps people find your video when searching for related
              content.
            </h3>
            <h4>3. Provide Additional Links/information in Description</h4>
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center">
          Upload Video
        </h1>

        {loading ? (
          <div className="w-full h-96 flex items-center justify-center relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t border-b border-red-600 flex items-center justify-center relative"></div>
            <h1 className="text-xl lobster absolute text-red-600 z-50">
              UMingle
            </h1>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div className="w-full h-48 sm:h-64 flex flex-col bg-gray-100 rounded-lg p-4">
                <p className="text-lg sm:text-xl text-gray-800 mb-2">
                  Video Preview
                </p>
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="mt-2 w-full h-full object-contain rounded-md"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 rounded-md">
                    <p className="text-gray-500">No video selected</p>
                  </div>
                )}
              </div>
              <div className="w-full h-48 sm:h-64 flex flex-col bg-gray-100 rounded-lg p-4">
                <p className="text-lg sm:text-xl text-gray-800 mb-2">
                  Thumbnail Preview
                </p>
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="mt-2 w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 rounded-md">
                    <p className="text-gray-500">No thumbnail selected</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <label
                  htmlFor="video"
                  className="mb-2 flex items-center text-sm sm:text-base"
                >
                  <FaVideo className="mr-2" />
                  Video File
                </label>
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-red-600 rounded text-sm sm:text-base"
                  required
                  disabled={!token}
                />
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 flex items-center text-sm sm:text-base"
                >
                  <FaHeading className="mr-2" />
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-red-600 rounded text-sm sm:text-base"
                  required
                  disabled={!token}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 flex items-center text-sm sm:text-base"
                >
                  <MdOutlineDescription size={22} className="mr-1" />
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-red-600 rounded text-sm sm:text-base"
                  rows="4"
                  required
                  disabled={!token}
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="thumbnail"
                  className="mb-2 flex items-center text-sm sm:text-base"
                >
                  <FaImage className="mr-2" />
                  Thumbnail
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-red-600 rounded text-sm sm:text-base"
                  required
                  disabled={!token}
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="mb-2 flex items-center text-sm sm:text-base"
                >
                  <FaTags className="mr-2" />
                  Tags [ Separate by Comma ]
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2 border border-gray-300 outline-none focus:border-red-600 rounded text-sm sm:text-base"
                  placeholder="e.g. music, rock, live"
                  required
                  disabled={!token}
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-xs sm:text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded transition duration-300 text-sm sm:text-base ${
                  isFormValid
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isFormValid || loading || !token}
              >
                {loading ? "Uploading..." : "Upload Video"}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default UploadVideo;
