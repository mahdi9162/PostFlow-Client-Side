import axios from 'axios';
import { auth } from '../firebase/firebase.config';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach Firebase Bearer token once globally
axiosInstance.interceptors.request.use(
  async (config) => {
    const current = auth.currentUser;
    if (current) {
      const token = await current.getIdToken();
      config.headers = config.headers || {};
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 / 403 unauthorized responses once globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      toast.error('Session expired. Please login again.');
      try {
        await signOut(auth);
      } catch {
        // ignore signout errors
      }
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
