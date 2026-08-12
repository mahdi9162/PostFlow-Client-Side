import React, { useState } from 'react';
import { Hash } from 'lucide-react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TagGroupsList from './TagGroupsList';
import toast from 'react-hot-toast';
import LoadingState from '../../../../components/common/LoadingState';
import ErrorState from '../../../../components/common/ErrorState';

const accounts = [
  { value: 'snortpugs', label: 'Snortpugs' },
  { value: 'pugsnortz', label: 'Pugsnortz' },
  { value: 'pugsnuff', label: 'Pugsnuff' },
];

const AccountTagGroupsPanel = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['hashtagGroups', selectedAccount],
    enabled: Boolean(selectedAccount),
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/hashtagGroups?accountId=${selectedAccount}`);
      return res.data;
    },
  });

  const toggleEnableMutation = useMutation({
    mutationFn: async (group) => {
      await axiosSecure.patch(`/api/hashtagGroups/${group._id}`, { enabled: !group.enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hashtagGroups', selectedAccount] });
      toast.success('Group status updated');
    },
    onError: () => toast.error('Failed to update group status')
  });

  const deleteMutation = useMutation({
    mutationFn: async (group) => {
      if (!window.confirm(`Delete group "${group.name}"?`)) throw new Error('cancelled');
      await axiosSecure.delete(`/api/hashtagGroups/${group._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hashtagGroups', selectedAccount] });
      toast.success('Group deleted');
    },
    onError: (err) => {
      if (err.message !== 'cancelled') toast.error('Failed to delete group');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedGroupIds) => {
      await axiosSecure.patch('/api/hashtagGroups/reorder', { account: selectedAccount, orderedGroupIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hashtagGroups', selectedAccount] });
    },
    onError: () => toast.error('Failed to reorder groups')
  });

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newGroups = [...groups];
    // swap positions
    const temp = newGroups[index - 1];
    newGroups[index - 1] = newGroups[index];
    newGroups[index] = temp;
    reorderMutation.mutate(newGroups.map(g => g._id));
  };

  const handleMoveDown = (index) => {
    if (index === groups.length - 1) return;
    const newGroups = [...groups];
    // swap positions
    const temp = newGroups[index + 1];
    newGroups[index + 1] = newGroups[index];
    newGroups[index] = temp;
    reorderMutation.mutate(newGroups.map(g => g._id));
  };

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
          <Hash className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-base-content">Manage Groups</p>
          <p className="text-xs text-muted leading-relaxed">View, reorder, enable, or delete groups.</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-[11px] sm:text-xs font-semibold text-base-content/70">Account</label>
        <select
          className="select select-bordered w-full mt-2 rounded-xl text-sm"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="" disabled hidden>
            Select an Account
          </option>
          {accounts.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && selectedAccount ? (
        <LoadingState message="Loading groups..." />
      ) : isError ? (
        <ErrorState message="Failed to load groups." />
      ) : (
        <TagGroupsList 
          groups={groups} 
          onToggleEnable={(g) => toggleEnableMutation.mutate(g)}
          onDelete={(g) => deleteMutation.mutate(g)} 
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      )}
    </div>
  );
};

export default AccountTagGroupsPanel;
