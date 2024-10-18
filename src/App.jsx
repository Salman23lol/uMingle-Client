import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import ProfileDropDown from "./Components/ProfileDropDown";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "./Store/authStore";
import AuthCheck from "./Middleware/authCheck";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NotificationDropDown from "./Components/NotificationDropDown";

// Lazy load components
const Home = lazy(() => import("./Pages/Home"));
const Video = lazy(() => import("./Pages/Video"));
const Channel = lazy(() => import("./Pages/Channel"));
const History = lazy(() => import("./Pages/History"));
const Subscriptions = lazy(() => import("./Pages/Subscriptions"));
const Auth = lazy(() => import("./Pages/Auth"));
const Channels = lazy(() => import("./Pages/Channels"));
const UploadVideo = lazy(() => import ("./Pages/UploadVideo"));
const Search = lazy(() => import("./Pages/Search")); // New lazy import for Search component
const Trending = lazy(() => import("./Pages/Trending")); // New lazy import for Trending component
const Customize = lazy(() => import("./Pages/Customize")); // New lazy import for Customize component

// Loading component
const Loading = () => (
  <div className="w-full h-screen flex items-center justify-center relative bg-gray-100">
    <motion.div
      className="rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      }}
      style={{ animation: 'pulse 1.5s infinite' }}
    />
    <h1 className="text-xl lobster absolute text-red-600 animate-pulse z-50">
      UMingle
    </h1>
  </div>
);

// PageNotFound component
const PageNotFound = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">404</h1>
    <p className="text-xl mb-4">Oops! Page not found.</p>
    <a href="/" className="text-blue-500 hover:underline">Go back to home</a>
  </div>
);

const App = () => {
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isProfileDown, setIsProfileDown] = useState(false);
  const [isNotificationDown, setIsNotificationDown] = useState(false); // Fixed variable declaration
  const [isLoading, setIsLoading] = useState(true);

  // Using zustand store to get user info and auth clear function
  const userInfo = useAuthStore((state) => state.userInfo);
  const authClear = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleProfileToggle = () => {
    if (isNotificationDown) {
      setIsNotificationDown(false); // Close notifications if they are open
    }
    setIsProfileDown((prev) => !prev); // Toggle profile dropdown
  };

  return (
    <BrowserRouter>
      <AuthCheck>
        <ToastContainer />
        <div className="flex flex-col h-screen overflow-hidden">
          <Header
            isCompactMode={isCompactMode}
            setIsCompactMode={setIsCompactMode}
            setIsProfileDown={handleProfileToggle} // Use the new handler
            setIsNotificationDown={setIsNotificationDown}
            userInfo={userInfo}
          />
          <AnimatePresence>
            {isProfileDown && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="z-50"
              >
                <ProfileDropDown
                  setIsProfileDown={setIsProfileDown}
                  userInfo={userInfo}
                  authClear={authClear}  
                />
              </motion.div>
            )}
            {isNotificationDown && ( // Fixed variable name
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="z-50"
              >
                <NotificationDropDown
                  setIsNotificationDown={setIsNotificationDown}
                  userInfo={userInfo}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex overflow-hidden">
            <Sidebar isCompactMode={isCompactMode} userInfo={userInfo} />
            <main className="w-full flex flex-col overflow-y-auto">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home userInfo={userInfo} />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/upload-video" element={<UploadVideo userInfo={userInfo} />} />
                  <Route path="/subscriptions" element={<Subscriptions userInfo={userInfo} />} />
                  <Route path="/video/:id" element={<Video userInfo={userInfo} />} />
                  <Route path="/channel/:id" element={<Channel userInfo={userInfo} />} />
                  <Route path="/channels" element={<Channels />} />
                  <Route path="/search/:query" element={<Search />} /> {/* New route for Search */}
                  <Route path="/trending" element={<Trending />} /> {/* New route for Trending */}
                  <Route path="/customize/:id" element={<Customize />} /> {/* New route for Customize */}
                  <Route path="/404" element={<PageNotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </AuthCheck>
    </BrowserRouter>
  );
};

export default App;
