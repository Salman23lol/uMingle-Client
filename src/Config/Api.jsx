import axios from 'axios';

const createAPI = (baseURL) => axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

const BASE_URL = 'https://u-mingle-server.vercel.app/api/';

const api = {
  users: createAPI(`${BASE_URL}users`),
  videos: createAPI(`${BASE_URL}videos`),
  comments: createAPI(`${BASE_URL}comments`),
  channels: createAPI(`${BASE_URL}channels`),
  notifications: createAPI(`${BASE_URL}notifications`),
  search: createAPI(`${BASE_URL}search`),
};

export { api };
