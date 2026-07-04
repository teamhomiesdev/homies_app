import axios from 'axios';
import { store } from '../redux/store'; 

const api = axios.create({
  baseURL: 'https://api.homies.support/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

api.interceptors.request.use(
  config => {
    // 1. Fetch the latest token from the Redux state
    const state = store.getState();
    const token = state.auth?.token;

    // 2. Attach the Bearer token to headers if present
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // CONSOLE LOG THE TOKEN HERE WHEN AVAILABLE
      console.log(`🔑 [API Header Token]: Bearer ${token}`);
    } else {
      console.log('ℹ️ [API Request]: No authentication token available for this request.');
    }
console.log(`[API Request Config]:`, config); // Log the entire
    // Safe method extraction
    const method = config?.method ? config.method.toUpperCase() : 'REQUEST'; 
    console.log(`[API Request] ${method} ➔ ${config?.url || ''}`); 

    // CONSOLE LOG THE REQUEST PAYLOAD HERE IF IT EXISTS
    if (config.data) {
      console.log(`📦 [API Request Payload]:`, typeof config.data === 'string' ? JSON.parse(config.data) : config.data);
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => {
    const method = response?.config?.method ? response.config.method.toUpperCase() : 'SUCCESS'; 
    console.log(
      `✅ [API Success] ${method} ${response?.config?.url || ''}`, 
      '\nStatus:', response?.status, 
      '\nResponse Data:', response?.data
    ); 
    return response;
  },
  error => {
    const method = error?.config?.method ? error.config.method.toUpperCase() : 'ERROR'; 
    const url = error?.config?.url || ''; 

    if (error?.response) {
      console.log(
        `❌ [API Error Response] ${method} ${url}`,
        '\nStatus:', error.response?.status,
        '\nError Data:', error.response?.data
      ); 
    } else if (error?.request) {
      console.log(`⏳ [API Network/Timeout Error] ${method} ${url}`); 
    }
    return Promise.reject(error);
  },
);

export default api;