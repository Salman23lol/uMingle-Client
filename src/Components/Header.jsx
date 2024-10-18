import React from "react";
import { FaBars, FaBell, FaSearch, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SearchComponent from "./Header/SearchComponent";

const Header = ({ setIsCompactMode, setIsProfileDown, userInfo, setIsNotificationDown }) => {
  const toggleProfileDown = () => setIsProfileDown((prev) => !prev);
  const toggleNotificationDown = () => setIsNotificationDown((prev) => !prev);
  const toggleSidebar = () => setIsCompactMode((prev) => !prev);

  return (
    <header className="w-full h-12 sm:h-16 sticky top-0 z-50 border-b border-gray-300 text-gray-400">
      <div className="w-full h-full flex justify-between px-4 py-2">
        <div className="h-full flex gap-1 items-center">
          <motion.button
            whileHover="hover"
            id="sideBar-toggle"
            onClick={toggleSidebar}
            className="relative flex justify-center items-center group border border-gray-300 hover:border-red-500 rounded xs:rounded-lg overflow-hidden"
          >
            <p
              className={`relative flex items-center p-1 xs:p-2 text-xs sm:text-base duration-300 group-hover:text-white`}
            >
              <FaBars />
            </p>
            <span className="absolute inset-0 bg-red-500  -z-50 transform scale-y-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
          </motion.button>
          <Link
            to="/"
            className="w-auto h-10 flex items-center justify-center text-gray-600 hover:text-red-600 duration-200 px-3 pb-2"
          >
            <span className="pt-2 text-xl sm:text-2xl font-semibold">UMingle</span>
          </Link>
        </div>
    <SearchComponent />
        <div className="flex items-center gap-4">
          {userInfo && (
            <div className="hidden sm:flex gap-2 h-10">
              <motion.div
                whileHover="hover"
                className="relative flex justify-center items-center w-10 group overflow-hidden border border-gray-300 hover:border-red-500 rounded-lg"
              >
                <Link
                  to="/upload-video"
                  className={`relative flex items-center p-2 gap-2 duration-300 group-hover:text-white`}
                >
                  <FaUpload />
                </Link>
                <span className="absolute inset-0 bg-red-500  -z-50 transform scale-y-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
              </motion.div>
              <motion.div
                onClick={toggleNotificationDown}
                className="relative flex justify-center items-center w-10 group overflow-hidden border border-gray-300 hover:border-red-500 rounded-lg"
              >
                <Link
                  className={`relative flex items-center p-2 gap-2 duration-300 group-hover:text-white`}
                >
                  <FaBell />
                </Link>
                <span className="absolute inset-0 bg-red-500 -z-50 transform scale-y-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
              </motion.div>
            </div>
          )}
          {userInfo && userInfo.avatar ? (
            <button
              onClick={toggleProfileDown}
              className=" w-10 h-10 flex items-center justify-center"
              aria-label="Profile"
            >
              <img
                src={userInfo && userInfo.avatar}
                alt="User profile"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          ) : (
            <Link
              to="/auth"
              className="py-1 px-5 border border-gray-300 text-xs sm:text-base rounded-lg hover:bg-gray-200 hover:text-red-600 duration-200 flex items-center justify-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
