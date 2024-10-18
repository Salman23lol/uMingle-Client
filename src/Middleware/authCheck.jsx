import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const { getToken } = useAuthStore();
  const [alertShown, setAlertShown] = useState(false);
  const authClear = useAuthStore((state) => state.clearAuth);

  const checkAuth = useCallback(() => {
    const authToken = Cookies.get('auth_token')

    if (!authToken && !alertShown) {
      setAlertShown(true);
      authClear()
      toast.warn(
        "Your session has expired. Please login again for full experience.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "progress-bar",
          theme: "dark",
          onClick: () => navigate("/auth"),
        }
      );
    } else if (authToken) {
      setAlertShown(false);
    }
  }, [getToken, navigate, alertShown]);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [checkAuth]);

  return children;
};

export default AuthCheck;
