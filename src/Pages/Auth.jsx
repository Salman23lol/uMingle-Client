import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUser, FaLock, FaEnvelope, FaImage } from 'react-icons/fa';
import useAuthStore from '../Store/authStore';
import { api } from '../Config/Api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const { setUserInfo, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        response = await api.users.post('/login', { email, password });
      } else {
        response = await api.users.post('/register', { email, username, password, avatar });
      }
      
      const { user, token, expiresIn } = response.data;
      setUserInfo(user, expiresIn);
      setToken(token, expiresIn);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: isLogin ? 'You have successfully logged in.' : 'Your account has been created successfully.',
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Authentication error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'An error occurred during authentication.',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} - Mingle</title>
        <meta name="description" content={isLogin ? 'Log in to your Mingle account to connect with friends and share your experiences.' : 'Create a new Mingle account to start sharing your moments and connecting with others.'} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="w-full max-w-lg p-4 border border-gray-300 rounded">
          <h3 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <div className="flex items-center border border-gray-300 py-2 px-3 rounded-sm mb-4">
                <FaEnvelope className="text-gray-400" />
                <input
                  className="pl-2 outline-none border-none w-full"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <>
                  <div className="flex items-center border border-gray-300 py-2 px-3 rounded-sm mb-4">
                    <FaUser className="text-gray-400" />
                    <input
                      className="pl-2 outline-none border-none w-full"
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center border border-gray-300 py-2 px-3 rounded-sm mb-4">
                    <FaImage className="text-gray-400" />
                    <input
                      className="pl-2 outline-none border-none w-full"
                      type="url"
                      name="avatar"
                      placeholder="Avatar URL"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center border border-gray-300 py-2 px-3 rounded-sm">
                <FaLock className="text-gray-400" />
                <input
                  className="pl-2 outline-none border-none w-full"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700" type="submit">
                {isLogin ? 'Login' : 'Register'}
              </button>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
                type="button"
              >
                {isLogin ? 'Need to register?' : 'Already have an account?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;