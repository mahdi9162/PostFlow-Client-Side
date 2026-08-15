import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useAccounts = (enabled = true) => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['accounts'],
    enabled,
    queryFn: async () => {
      const res = await axiosSecure.get('/api/accounts');
      return res.data;
    },
  });

  return { accounts: data?.accounts || [], isLoading, isError, error };
};
