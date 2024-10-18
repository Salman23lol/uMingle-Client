import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell, FaChevronDown, FaRegEye } from "react-icons/fa";
import { api } from "../Config/Api"; // Importing the API
import useAuthStore from "../Store/authStore";
import { MdOutlineVideocam } from "react-icons/md";
import { Helmet } from "react-helmet"; // Importing Helmet

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const getToken = useAuthStore((state) => state.getToken);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.users.get("/subscriptions", {
          headers: {
            'x-ming-token': getToken()
          }
        });
        setSubscriptions(response.data); // Set subscriptions from API response
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };

    fetchSubscriptions(); // Fetch subscriptions on component mount
  }, [getToken]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Your Subscriptions - UMingle</title>
        <meta name="description" content="View your subscriptions on Mingle." />
      </Helmet>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full h-screen overflow-y-auto bg-white"
      >
        <h1 className="text-2xl font-medium m-4 flex items-center gap-2">Your Subscriptions <FaChevronDown className="text-base mt-1" /></h1>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {subscriptions.map((subscription) => (
            <motion.div
              key={subscription._id}
              variants={itemVariants}
              className="border border-gray-300 p-4 rounded hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={subscription.image}
                  alt={subscription.name}
                  className="w-32 h-32 object-cover rounded-full mr-4"
                />
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">
                    {subscription.name}
                  </h2>
                  <p className="text-sm ml-1 text-red-600">
                    {subscription.subscribers} Subscribers
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                  <span className="text-lg flex items-center gap-2"><MdOutlineVideocam size={22} /> {subscription.totalVideos} videos</span>
                </p>
                <p className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                  <span className="text-lg flex items-center gap-2"><FaRegEye />{subscription.totalViews}</span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <button className="border border-red-600 text-red-500 hover:text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red-700 transition-colors duration-300">
                  Subscribed
                </button>
                <div className="flex items-center border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300 text-sm md:text-base">
                  <FaBell className={`mr-2 text-gray-400`} />
                  <select 
                    className="bg-transparent outline-none"
                    defaultValue="All"
                  >
                    <option value="All">All</option>
                    <option value="Silent">Silent</option>
                    <option value="Off">Off</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default Subscriptions;
