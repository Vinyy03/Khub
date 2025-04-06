import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { createNavigationContainerRef } from '@react-navigation/native';

// Create a navigation reference to use outside of components
export const navigationRef = createNavigationContainerRef();

const baseURL = API_URL || 'http://192.168.1.64:5000';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
let isLogoutProcessing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !isLogoutProcessing) {
      isLogoutProcessing = true;
      
      // Clear stored credentials
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        
        // If navigation reference is ready, navigate to login
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
        
        // If using Redux, you could dispatch logout here if you had store access
        // But this should be handled by the auto-redirect and the missing token
      } catch (err) {
        console.error('Error during logout:', err);
      } finally {
        isLogoutProcessing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;