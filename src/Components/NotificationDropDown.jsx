import React, { useEffect, useState } from "react";
import { api } from "../Config/Api";
import useAuthStore from "../Store/authStore"; // Importing useAuthStore
import { useNavigate } from "react-router-dom"; // Importing useHistory for navigation

const NotificationDropDown = ({ setIsNotificationDown }) => {
  const [notifications, setNotifications] = useState([]);
  const getToken = useAuthStore((state) => state.getToken); // Getting the token from the store
  const navigate = useNavigate(); // Initializing useHistory

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.notifications.get("/notifications", {
          headers: {
            "x-ming-token": getToken(), // Applying the header with the token
          },
        });
        setNotifications(response.data.notifications || []); // Accessing the notifications array from the response, defaulting to an empty array
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [getToken]); // Adding getToken to the dependency array

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.notifications.put(
        `/${notificationId}/read`,
        {},
        {
          headers: {
            "x-ming-token": getToken(),
          },
        }
      );
      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="absolute top-0 right-4 w-64 h-80 text-black/80 bg-white border border-gray-200 z-50 overflow-y-auto flex flex-col gap-2">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-2 flex gap-2 cursor-pointer ${
              notification.isRead ? "bg-gray-100" : "bg-white"
            }`}
            onClick={() => navigate(`/video/${notification.video._id}`)} // Navigate to video on click
          >
            <div className="flex flex-col gap-1">
              <img
                src={notification.video?.thumbnail || "/default-thumbnail.jpg"}
                alt={notification.video?.title || "Thumbnail"}
                className="max-w-32 h-20 object-cover rounded"
              />
              <p className="text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
            </div>
            <p className="font-medium">
              {notification.video.title.length > 50 ? `${notification.video.title.slice(0, 47)}...` : notification.video.title}
            </p>

            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from bubbling up
                  markAsRead(notification._id);
                }}
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="p-2">No notifications</div>
      )}
    </div>
  );
};

export default NotificationDropDown;
