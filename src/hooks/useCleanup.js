import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useCleanupPreview = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (target) => {
      const res = await axiosSecure.post(`/api/settings/platform/cleanup/${target}/preview`);
      return res.data;
    },
  });
};

export const useCleanupExecute = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target) => {
      const res = await axiosSecure.post(`/api/settings/platform/cleanup/${target}/execute`, {
        confirm: true,
      });
      return { target, data: res.data };
    },
    onSuccess: ({ target }) => {
      if (target === 'syncHistory') {
        queryClient.invalidateQueries({ queryKey: ['syncHistory'] });
        queryClient.invalidateQueries({ queryKey: ['latestSync'] });
      }
      // Note: If we had a dedicated 'posts' cache key for list/dashboard, we would invalidate it here.
      // E.g. queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
