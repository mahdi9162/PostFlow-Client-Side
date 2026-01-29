import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';
import axiosInstance from '../services/axiosInstance';
import { auth } from '../firebase/firebase.config';

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { userSignOut } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
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

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          toast.error('Session expired. Please login again.');

          try {
            await userSignOut();
          } catch {
            // ignore signout errors
          } finally {
            navigate('/login', { replace: true });
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, userSignOut]);

  return axiosInstance;
};

export default useAxiosSecure;
