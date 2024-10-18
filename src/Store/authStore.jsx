import { create } from 'zustand';
import Cookies from 'js-cookie';

// Cookie names
const TOKEN = 'auth_token';
const USER_INFO = 'user_info';

// Function to calculate cookie expiration date in hours
const calculateExpiration = (hours) => {
  return new Date(new Date().getTime() + hours * 60 * 60 * 1000);
};

const useAuthStore = create((set) => ({
  token: Cookies.get(TOKEN) || null,
  userInfo: Cookies.get(USER_INFO) 
    ? JSON.parse(Cookies.get(USER_INFO)) 
    : null,

  /**
   * Set token and store it in cookies
   * @param {string} token - The JWT token to be stored
   * @param {number} expireTimeInHours - Cookie expiration time in hours (optional)
   */
  setToken: (token, expireTimeInHours) => {
    // Set cookie to expire in 10 seconds for testing
    const expirationDate = calculateExpiration(expireTimeInHours);
    // const expirationDate = new Date(new Date().getTime() + 10 * 1000);
    Cookies.set(TOKEN, token, { expires: expirationDate });
    set({ token });
  },

  /**
   * Get token from the state or cookies
   * @returns {string|null} - The stored token
   */
  getToken: () => {
    return Cookies.get(TOKEN) || null;
  },

  /**
   * Set user information and store it in cookies
   * @param {object} userInfo - The user info object to be stored
   * @param {number} expireTimeInHours - Cookie expiration time in hours (optional)
   */
  setUserInfo: (userInfo, expireTimeInHours = 7 * 24) => {
    // Default is 7 days (7 * 24 hours) if expireTimeInHours is not provided
    const expirationDate = calculateExpiration(expireTimeInHours);
    Cookies.set(USER_INFO, JSON.stringify(userInfo), { expires: expirationDate });
    set({ userInfo });
  },

  /**
   * Get user information from the state or cookies
   * @returns {object|null} - The stored user info
   */
  getUserInfo: () => {
    const userInfo = Cookies.get(USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  /**
   * Remove token and user information from state and cookies (logout)
   */
  clearAuth: () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_info');
    set({ token: null, userInfo: null });
  },
}));

export default useAuthStore;
