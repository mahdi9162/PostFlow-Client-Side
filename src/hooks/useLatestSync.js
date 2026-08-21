import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useLatestSync = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['latestSync'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/sync/history', {
        params: { page: 1, limit: 1 },
      });
      return res.data;
    },
    refetchInterval: (query) => {
      const run = query.state.data?.runs?.[0];
      return run?.status === 'running' ? 4000 : false;
    },
    keepPreviousData: true,
  });
};
