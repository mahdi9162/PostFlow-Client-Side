import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useSyncHistory = (page = 1, limit = 10) => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['syncHistory', page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/sync/history', {
        params: { page, limit },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  return {
    runs: data?.runs || [],
    pagination: data?.pagination || { page: 1, totalPages: 1, totalCount: 0, limit: 10 },
    isLoading,
    isError,
    error,
    refetch,
  };
};
