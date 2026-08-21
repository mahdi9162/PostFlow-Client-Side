import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useSyncHistoryDetails = (syncId) => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['syncHistoryDetails', syncId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/sync/history/${syncId}`);
      return res.data;
    },
    enabled: !!syncId,
    retry: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
