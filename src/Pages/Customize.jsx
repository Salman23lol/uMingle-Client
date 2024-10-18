import React, { useState, useEffect } from "react";
import { api } from "../Config/Api";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Modal from "react-modal"; // Import modal for pop-up
import { toast } from "react-toastify"; // For notifications
import { Helmet } from "react-helmet";

// Set app element for react-modal (important for accessibility)
Modal.setAppElement("#root"); // Ensure #root is your main app element

const Customize = () => {
  const { id } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [email, setEmail] = useState(""); // User email for verification
  const [password, setPassword] = useState(""); // User password for verification
  const authToken = Cookies.get("auth_token");

  // Fetch channel data on component load
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await api.channels.post(`/getChannel/${id}`);
        setChannelData(response.data);
      } catch (err) {
        setError("Failed to load channel data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [id, authToken]);

  // Handle form submission and open modal for verification
  const handleSaveChanges = () => {
    if (!channelData.name || !channelData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsModalOpen(true); // Open the verification modal
  };

  // Handle user verification when submitting email and password
  const handleVerification = async (e) => {
    e.preventDefault();

    console.log("Channel Data sent for update:", channelData);
    try {
      // Verify user credentials using the auth token
      const response = await api.users.post(
        "/checkUserInfo",
        {
          email,
          password,
        },
        {
          headers: { "x-ming-token": authToken },
        }
      );

      if (response.status === 201) {
        // User is verified, save the channel changes
        await api.channels.put(`/update/${id}`, channelData, {
          headers: { "x-ming-token": authToken },
        });
        toast.success("Channel updated successfully!");
        setIsModalOpen(false); // Close the modal
      } else {
        toast.error("Verification failed.");
      }
    } catch (err) {
      toast.error("Error verifying user.");
    }
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!channelData)
    return <div className="text-center text-lg">Channel not found</div>;

  return (
    <>
      <Helmet>
        <title>{channelData.name} - Mingle</title>
        <meta name="description" content={channelData.description} />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <div className="w-full h-screen relative">
      <div
        className={`w-full h-full flex flex-col items-center justify-center relative bg-gray-800`}
      >
        <img
          className="w-full h-full object-cover opacity-40 absolute"
          src={channelData.banner || "https://picsum.photos/1920/1080"}
          alt="Channel Banner"
        />
        <h2 className="z-[1] text-white text-3xl font-medium mb-8">
          Customize Channel
        </h2>
        <div className="flex gap-4">
          <img
            src={channelData.image}
            alt={channelData.name}
            className="w-64 h-64 rounded-full object-cover z-50"
          />
          <form className="w-96 z-[1] text-white bg-white/10 p-4">
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1">
                Edit Channel Name
              </label>
              <input
                type="text"
                value={channelData.name}
                onChange={(e) =>
                  setChannelData({ ...channelData, name: e.target.value })
                }
                className="bg-transparent border p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1">
                Edit Channel Description
              </label>
              <textarea
                value={channelData.description}
                onChange={(e) =>
                  setChannelData({
                    ...channelData,
                    description: e.target.value,
                  })
                }
                className="bg-transparent border p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1">
                Edit Channel Banner URL
              </label>
              <input
                type="text"
                value={channelData.banner}
                onChange={(e) =>
                  setChannelData({ ...channelData, banner: e.target.value })
                }
                className="bg-transparent border p-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1">
                Edit Channel Image URL
              </label>
              <input
                type="text"
                value={channelData.image}
                onChange={(e) =>
                  setChannelData({ ...channelData, image: e.target.value })
                }
                className="bg-transparent border p-2 w-full rounded"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-500 transition duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
      {isModalOpen && (
        <div className="absolute top-0 left-0 z-50 w-full h-screen bg-black/80 text-white flex items-center justify-center">
          <div className="w-80 h-96">
            <h2 className="text-2xl font-semibold mb-4">Verify Yourself</h2>
            <form onSubmit={handleVerification}>
              <div className="mb-4">
                <label className="block text-lg">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent border border-red-500 p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-transparent border border-red-500 p-2 w-full rounded"
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="submit"
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
                >
                  Verify & Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 border text-red-500 border-red-500 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Customize;
