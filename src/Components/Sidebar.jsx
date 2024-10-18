import React, { memo } from "react";
import { FaFire, FaHome, FaHistory, FaTv, FaUserFriends, FaWpexplorer } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animation variants
const sidebarVariants = {
  open: { width: "12rem" },
  closed: { width: "3.5rem" },
};

// Sidebar Item Component
const SidebarItem = memo(({ to, icon: Icon, text, isCompactMode }) => (
  <motion.div
    whileHover="hover"
    className="relative w-full group text-gray-500  overflow-hidden rounded-lg"
  >
    <Link
      to={to}
      className={`w-full flex rounded-lg font-medium ${isCompactMode ? 'justify-center p-3.5' : 'justify-start p-4'} items-center gap-2 duration-300 group-hover:text-white`}
    >
      <Icon size={18} />
      {!isCompactMode && text}
    </Link>
    <span className={`absolute inset-0 w-full h-full rounded-lg bg-red-500 shadow-lg shadow-gray-400 -z-50 transform ${isCompactMode ? 'scale-y-0 group-hover:scale-y-100' : 'scale-x-0 group-hover:scale-x-100'} origin-bottom transition-transform duration-300 ease-in-out `}></span>
  </motion.div>
));

// Divider Component
const Divider = memo(() => (
  <div className="w-full py-2">
    <div className="border-t border-gray-300"></div>
  </div>
));

// Sidebar items configuration
const sidebarItemsConfig = [
  { to: "/", icon: FaHome, text: "Home", show: true },
  { to: "/trending", icon: FaFire, text: "Trending", show: true },
  { to: "/channels", icon: FaUserFriends, text: "Channels", show: true },
  { to: "/channel", icon: FaTv, text: "Your Channel", show: (userInfo) => !!userInfo?.channel },
  { to: "/subscriptions", icon: IoLibrary, text: "Subscriptions", show: (userInfo) => !!userInfo },
];

const Sidebar = ({ isCompactMode, userInfo }) => {
  const sidebarItems = sidebarItemsConfig.map(item => ({
    ...item,
    show: typeof item.show === 'function' ? item.show(userInfo) : item.show,
    to: item.text === "Your Channel" && userInfo?.channel ? `/channel/${userInfo.channel}` : item.to
  }));

  return (
    <motion.div
      className="pt-4 text-gray-600 h-screen hidden sm:block border-r border-gray-300 w-full"
      initial={isCompactMode ? "closed" : "open"}
      animate={isCompactMode ? "closed" : "open"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={`w-full flex flex-col items-center justify-center gap-3 px-1`}>
        {sidebarItems.map((item, index) =>
          item.show ? (
            <React.Fragment key={index}>
              <SidebarItem to={item.to} icon={item.icon} text={item.text} isCompactMode={isCompactMode} />
              {item.text === "Channels" && <Divider />}
            </React.Fragment>
          ) : null
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
