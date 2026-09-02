import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

export const useAccounts = (enabled = true) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['accounts', user?.email],
    enabled: !!user && !!user?.emailVerified && enabled,
    queryFn: async () => {
      const res = await axiosSecure.get('/api/accounts');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  return { accounts: data?.accounts || [], isLoading, isError, error };
};
