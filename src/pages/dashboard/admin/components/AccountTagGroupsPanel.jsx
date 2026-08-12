import React, { useRef, useState, useEffect } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TagGroupsList from './TagGroupsList';
import toast from 'react-hot-toast';
import LoadingState from '../../../../components/common/LoadingState';
import ErrorState from '../../../../components/common/ErrorState';
import DeleteConfirmModal from '../../../../components/common/DeleteConfirmModal';
import HashtagGroupModal from './HashtagGroupModal';

const AccountTagGroupsPanel = ({ selectedAccount, groups, isLoading, isError, accounts }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const editModalRef = useRef(null);
  const [editingGroup, setEditingGroup] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(null);

  const toggleEnableMutation = useMutation({
    mutationFn: async (group) => {
      await axiosSecure.patch(`/api/hashtagGroups/${group._id}`, { enabled: !group.enabled });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['hashtagGroups', selectedAccount] });
      toast.success('Group status updated');
    },
    onError: () => toast.error('Failed to update group status')
  });

  const deleteMutation = useMutation({
    mutationFn: async (group) => {
      await axiosSecure.delete(`/api/hashtagGroups/${group._id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['hashtagGroups', selectedAccount] });
      toast.success('Group deleted');
      setDeleteModalOpen(false);
      setDeletingGroup(null);
    },
    onError: () => {
      toast.error('Failed to delete group');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedGroupIds) => {
      await axiosSecure.patch('/api/hashtagGroups/reorder', { account: selectedAccount, orderedGroupIds });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['hashtagGroups', selectedAccount] });
    },
    onError: () => toast.error('Failed to reorder groups')
  });

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newGroups = [...groups];
    const temp = newGroups[index - 1];
    newGroups[index - 1] = newGroups[index];
    newGroups[index] = temp;
    reorderMutation.mutate(newGroups.map(g => g._id));
  };

  const handleMoveDown = (index) => {
    if (index === groups.length - 1) return;
    const newGroups = [...groups];
    const temp = newGroups[index + 1];
    newGroups[index + 1] = newGroups[index];
    newGroups[index] = temp;
    reorderMutation.mutate(newGroups.map(g => g._id));
  };

  const confirmDelete = (group) => {
    setDeletingGroup(group);
    setDeleteModalOpen(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    // showModal() is called via useEffect after the new keyed dialog mounts.
  };

  useEffect(() => {
    if (editingGroup && editModalRef.current) {
      editModalRef.current.showModal();
    }
  }, [editingGroup]);

  const isMutating = toggleEnableMutation.isPending || reorderMutation.isPending;

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100">
      {isLoading && selectedAccount ? (
        <div className="p-4"><LoadingState message="Loading groups..." /></div>
      ) : isError ? (
        <div className="p-4"><ErrorState message="Failed to load groups." /></div>
      ) : (
        <TagGroupsList 
          groups={groups} 
          onToggleEnable={(g) => toggleEnableMutation.mutate(g)}
          onDelete={confirmDelete} 
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onEdit={openEditModal}
          isMutating={isMutating}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate(deletingGroup)}
        isDeleting={deleteMutation.isPending}
        title="Delete Hashtag Group?"
        message={`Are you sure you want to delete "${deletingGroup?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Group"
      />

      {/* Edit Group Modal */}
      <HashtagGroupModal 
        key={editingGroup ? editingGroup._id : 'edit-modal'}
        modalRef={editModalRef} 
        mode="edit" 
        group={editingGroup} 
        account={selectedAccount} 
        accounts={accounts}
        onClose={() => setEditingGroup(null)}
      />
    </div>
  );
};

export default AccountTagGroupsPanel;
