import React from "react";
import { Link } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaTv } from "react-icons/fa";
import { motion } from "framer-motion";

const ProfileDropDown = ({ setIsProfileDown, userInfo, authClear }) => {
  const handleClose = () => setIsProfileDown(false);

  const handleLogout = () => {
    authClear();
    handleClose();
  };

  const profileItems = [
    { to: `/channel/${userInfo?.channel}`, icon: FaTv, text: "Your Channel" },
    { to: "/settings", icon: FaCog, text: "Settings" },
    { to: null, icon: FaSignOutAlt, text: "Sign Out", isButton: true },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="absolute top-0 right-4 w-64 text-black/80 bg-white border border-gray-200 z-50"
      initial="hidden"
      animate="visible"
      variants={dropdownVariants}
      transition={{ duration: 0.3 }}
    >
      {profileItems.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{ delay: index * 0.1 }}
        >
          {item.isButton ? (
            <motion.div
              whileHover="hover"
              onClick={handleLogout}
              className="relative w-full py-3 flex justify-center items-center px-4 group"
            >
              <p
                className={`relative flex items-center w-full h-full gap-2 duration-300 group-hover:text-white`}
              >
                <item.icon className="mr-2 text-lg" />
                {item.text}
              </p>
              <span className="absolute inset-0 w-full h-full bg-red-500 shadow-lg shadow-gray-400 -z-50 transform scale-x-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </motion.div>
          ) : (
            <div>
              <Link
                to={item.to}
                className="relative w-full py-3 flex justify-center items-center px-4 group"
              >
                <p className={`relative flex items-center w-full h-full gap-2 duration-300 group-hover:text-white`}>
                  <item.icon className="mr-2 text-lg" />
                  {item.text}
                </p>
                <span className="absolute inset-0 w-full h-full bg-red-500 shadow-lg shadow-gray-400 -z-50 transform scale-x-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
              </Link>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProfileDropDown;
