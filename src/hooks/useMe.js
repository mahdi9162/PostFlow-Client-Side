import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

export const useMe = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: me, isLoading, isError } = useQuery({
    queryKey: ['me', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users/me');
      return res.data;
    },
    enabled: !!user && !!user?.emailVerified,
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = me?.status === 'approved' && me?.role === 'admin';
  const isCreator = me?.status === 'approved' && me?.role === 'creator';
  const isApproved = me?.status === 'approved';

  return { me, isAdmin, isCreator, isApproved, isLoading, isError };
};
