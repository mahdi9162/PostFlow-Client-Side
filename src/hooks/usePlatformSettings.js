import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const usePlatformSettings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['platformSettings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/settings/platform');
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.patch('/api/settings/platform', payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['platformSettings'], data);
    },
  });

  return {
    ...query,
    updateSettings: mutation.mutate,
    updateSettingsAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
