import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useStaleSyncPreview = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post('/api/settings/platform/stale-syncs/preview');
      return res.data;
    },
  });
};

export const useStaleSyncResolve = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post('/api/settings/platform/stale-syncs/resolve', {
        confirm: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syncHistory'] });
      queryClient.invalidateQueries({ queryKey: ['latestSync'] });
    },
  });
};
