import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useMe = () => {
  const axiosSecure = useAxiosSecure();

  const { data: me, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users/me');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = me?.status === 'approved' && me?.role === 'admin';
  const isCreator = me?.status === 'approved' && me?.role === 'creator';

  return { me, isAdmin, isCreator, isLoading, isError };
};
