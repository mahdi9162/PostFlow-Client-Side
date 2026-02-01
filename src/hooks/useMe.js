import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useMe = () => {
  const axiosSecure = useAxiosSecure();

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users/me');
      return res.data;
    },
  });

  const isAdmin = me?.status === 'approved' && me?.role === 'admin';
  const isPublisher = me?.status === 'approved' && me?.role === 'publisher';

  return { isAdmin, isPublisher };
};
