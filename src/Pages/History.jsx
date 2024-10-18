import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaSearch } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { MdClose } from "react-icons/md";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("video");
  const [historyData, setHistoryData] = useState([
    {
      id: 1,
      title: "How to Build a React App",
      channelName: "CodeMaster",
      thumbnail: "https://picsum.photos/300/200?random=1",
      watchedAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      channelName: "WebDesignPro",
      thumbnail: "https://picsum.photos/300/200?random=2",
      watchedAt: "Yesterday",
    },
    {
      id: 3,
      title: "JavaScript ES6 Features Explained",
      channelName: "JSGuru",
      thumbnail: "https://picsum.photos/300/200?random=3",
      watchedAt: "3 days ago",
    },
    {
      id: 4,
      title: "Python for Data Science",
      channelName: "DataWizard",
      thumbnail: "https://picsum.photos/300/200?random=4",
      watchedAt: "1 week ago",
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      channelName: "AIExplorer",
      thumbnail: "https://picsum.photos/300/200?random=5",
      watchedAt: "2 weeks ago",
    },
    {
      id: 6,
      title: "Docker for Beginners",
      channelName: "DevOpsGuru",
      thumbnail: "https://picsum.photos/300/200?random=6",
      watchedAt: "3 weeks ago",
    },
    {
      id: 7,
      title: "GraphQL vs REST API",
      channelName: "APImaster",
      thumbnail: "https://picsum.photos/300/200?random=7",
      watchedAt: "1 month ago",
    },
    {
      id: 8,
      title: "Vue.js Tutorial for Beginners",
      channelName: "FrontEndPro",
      thumbnail: "https://picsum.photos/300/200?random=8",
      watchedAt: "1 month ago",
    },
    {
      id: 9,
      title: "Blockchain Technology Explained",
      channelName: "CryptoExpert",
      thumbnail: "https://picsum.photos/300/200?random=9",
      watchedAt: "2 months ago",
    },
    {
      id: 10,
      title: "iOS App Development with Swift",
      channelName: "AppleDev",
      thumbnail: "https://picsum.photos/300/200?random=10",
      watchedAt: "2 months ago",
    },
  ]);

  const [searchHistoryData, setSearchHistoryData] = useState([
    { id: 1, term: "React tutorials" },
    { id: 2, term: "CSS grid layout" },
    { id: 3, term: "JavaScript async/await" },
    { id: 4, term: "Python data visualization" },
    { id: 5, term: "Machine learning algorithms" },
    { id: 6, term: "Docker containers" },
    { id: 7, term: "GraphQL queries" },
    { id: 8, term: "Vue.js components" },
    { id: 9, term: "Blockchain applications" },
    { id: 10, term: "Swift UI design" },
    { id: 11, term: "Node.js best practices" },
    { id: 12, term: "Angular vs React" },
    { id: 13, term: "TensorFlow tutorials" },
    { id: 14, term: "Kubernetes deployment" },
    { id: 15, term: "Responsive web design" },
  ]);

  const removeHistoryItem = (id) => {
    if (searchType === "video") {
      setHistoryData(historyData.filter((item) => item.id !== id));
    } else {
      setSearchHistoryData(searchHistoryData.filter((item) => item.id !== id));
    }
  };

  const filteredHistory =
    searchType === "video"
      ? historyData.filter(
          (video) =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : searchHistoryData.filter((search) =>
          search.term.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const containerVariants = {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 1.1,
            },
          },
        };
      
        const itemVariants = {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 500,
            },
          },
        };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full flex h-screen overflow-hidden"
    >
      <div className="flex-grow overflow-y-auto pb-14">
        <AnimatePresence mode="wait">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex flex-col gap-2"
          >
            {filteredHistory.map((history) => (
              <motion.div
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={history.id}
                className="w-full p-2 flex relative border-b border-gray-300"
              >
                <div className="flex items-start gap-2">
                  {searchType === "video" ? (
                    <img
                      className="w-48 h-28 rounded-sm object-cover"
                      src={history.thumbnail}
                      alt={history.title}
                    />
                  ) : (
                    <div className="w-48 h-28 bg-gray-200 rounded-sm flex items-center justify-center">
                      <FaSearch className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 pt-1">
                    <h1 className="text-lg font-medium">
                      {searchType === "video" ? history.title : history.term}
                    </h1>
                    {searchType === "video" && (
                      <h1 className="text-base flex gap-2 ml-1">
                        {history.channelName}
                        <div className="flex gap-2">
                          <CiStar className="text-xs" />
                          <span className="text-sm">{history.watchedAt}</span>
                        </div>
                      </h1>
                    )}
                  </div>
                </div>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 hover:bg-black/15 text-black/50 text-xl duration-200 cursor-pointer absolute top-4 right-4 flex items-center justify-center"
                  onClick={() => removeHistoryItem(history.id)}
                >
                  <MdClose />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-1/3 flex-shrink-0 border-l border-gray-300 overflow-y-auto">
        <div className="sticky top-0 bg-white p-4">
          <h2 className="text-xl font-semibold mb-2">Search History</h2>
          <div className="flex items-center gap-2 mb-2">
            <select
              className="p-2 border border-gray-300 rounded outline-none"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="video">Video History</option>
              <option value="search">Search History</option>
            </select>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={`Search ${searchType} history...`}
                className="w-full p-2 pr-10 border border-gray-300 rounded outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.ul variants={containerVariants} className="flex flex-col">
            {filteredHistory.map((item) => (
              <motion.li
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-8 flex justify-between items-center px-2 hover:bg-gray-300 duration-200 group"
              >
                <span className="truncate">
                  {searchType === "video" ? item.title : item.term}
                </span>
                <button
                  className="text-red-500 hover:text-red-700 group-hover:scale-125"
                  onClick={() => removeHistoryItem(item.id)}
                >
                  <FaTrash />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default History;
