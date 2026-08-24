import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useLatestMaintenanceRun = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['latestDriveMaintenance'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/api/drive-automation/runs/latest');
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null; // Empty state
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 60 * 1000, // 1 minute
  });
};
