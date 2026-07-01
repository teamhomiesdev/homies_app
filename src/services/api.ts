import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

export default api;