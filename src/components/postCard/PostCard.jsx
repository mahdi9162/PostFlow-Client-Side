import React, { useEffect, useRef, useState } from 'react';
import Container from '../container/Container';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import CopyButton from '../Buttons/copyButton/CopyButton';

import toast from 'react-hot-toast';
import { useMe } from '../../hooks/useMe';
import { getTodayDateBd } from '../../utils/getTodayDateBd';
import PostEditModal from './PostEditModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';

import { formatInstagramPostText } from '../Buttons/copyButton/formatInstagramPostText';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import StatusBadge from '../common/StatusBadge';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

const PostCard = ({ account }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const postEditRef = useRef(null);
  const [editPost, setEditPost] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateBd());
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [statusLoadingIds, setStatusLoadingIds] = useState(new Set());
  
  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isAdmin, isCreator } = useMe();

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', account, selectedDate, selectedStatus],
    queryFn: async () => {
      const params = {
        account,
        scheduledDate: selectedDate,
      };
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      const res = await axiosSecure.get('/api/posts', { params });
      return res.data;
    },
  });

  const { 
    data: summaryPosts = [],
    isLoading: isSummaryLoading,
    isError: isSummaryError
  } = useQuery({
    queryKey: ['posts', account, selectedDate, 'all'],
    queryFn: async () => {
      const params = {
        account,
        scheduledDate: selectedDate,
      };
      const res = await axiosSecure.get('/api/posts', { params });
      return res.data;
    },
    enabled: selectedStatus !== 'all'
  });

  const summarySource = selectedStatus === 'all' ? posts : summaryPosts;
  const showSummaryLoading = selectedStatus === 'all' ? isLoading : isSummaryLoading;

  const summary = {
    total: summarySource.length,
    pending: summarySource.filter((p) => p.status === 'pending').length,
    posted: summarySource.filter((p) => p.status === 'posted').length,
  };

  const handleMarkAsButton = async (id, status) => {
    setStatusLoadingIds((prev) => new Set(prev).add(id));
    try {
      await axiosSecure.patch(`/api/posts/${id}/status`, { status });
      await queryClient.invalidateQueries({ queryKey: ['posts', account, selectedDate] });
      toast.success(`Marked as ${status} - successfully`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const openDeleteModal = (id) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/api/posts/${postToDelete}`);
      await queryClient.invalidateQueries({ queryKey: ['posts', account, selectedDate] });
      toast.success('Post deleted successfully');
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (editPost && postEditRef.current) {
      postEditRef.current.showModal();
    }
  }, [editPost]);

  const openEditModal = (post) => {
    setEditPost(post);
  };

  const closeEditModal = () => {
    postEditRef.current?.close();
    setEditPost(null);
  };

  const shiftDate = (days) => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day + days);
    setSelectedDate(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
  };

  const handlePrevDay = () => shiftDate(-1);
  const handleNextDay = () => shiftDate(1);

  const isToday = selectedDate === getTodayDateBd();
  
  // Format date nicely (e.g. Thursday, Aug 13)
  const [year, month, day] = selectedDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Container>
      <div className="min-h-screen bg-base-200/40 py-6 md:py-8 rounded-4xl mb-12">
        <div className="mx-auto w-full max-w-4xl px-4">
          
          {/* Header Area */}
          <div className="flex flex-col gap-6 bg-base-100 p-4 md:p-6 rounded-3xl shadow-sm ring-1 ring-base-200">
            
            {/* Top Row: Context & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="badge badge-success badge-outline rounded-full text-sm font-semibold px-3 py-3">
                  {capitalizeFirstLetter(account)}
                </span>
                {isToday && (
                  <span className="badge badge-primary badge-outline rounded-full text-sm font-semibold px-3 py-3">
                    Today
                  </span>
                )}
              </div>
              
              {(isAdmin || isCreator) && (
                <Link to="/dashboard/create-post" className="btn btn-sm md:btn-md btn-primary rounded-full px-5">
                  <span className="text-lg leading-none">＋</span>
                  New Post
                </Link>
              )}
            </div>

            {/* Date Navigation & Summary */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-base-200 pt-4">
              
              {/* Date Nav */}
              <div className="flex items-center justify-between w-full md:w-auto bg-base-200/50 rounded-full p-1 ring-1 ring-base-200">
                <button onClick={handlePrevDay} className="btn btn-sm btn-circle btn-ghost" aria-label="Previous day">
                  ←
                </button>
                <div className="relative group px-2 cursor-pointer flex items-center justify-center min-w-[140px]">
                   <span className="text-sm font-semibold text-base-content whitespace-nowrap">
                     {formattedDate}
                   </span>
                   {/* Hidden native picker covering the text */}
                   <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      aria-label="Select scheduled date"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    />
                </div>
                <button onClick={handleNextDay} className="btn btn-sm btn-circle btn-ghost" aria-label="Next day">
                  →
                </button>
              </div>

              {/* Summary Stats */}
              <div className="flex items-center gap-1.5 md:gap-3 w-full md:w-auto justify-center">
                {isSummaryError ? (
                  <span className="text-sm font-semibold text-error/80 px-4 py-2">Summary unavailable</span>
                ) : showSummaryLoading ? (
                  <>
                    <div className="flex flex-col items-center bg-base-200/40 px-3 py-1.5 rounded-xl border border-base-200 min-w-[70px]">
                      <span className="text-lg font-bold leading-none text-base-content/30">—</span>
                      <span className="text-[10px] uppercase font-bold text-base-content/40 mt-1">Total</span>
                    </div>
                    <div className="flex flex-col items-center bg-warning/5 px-3 py-1.5 rounded-xl border border-warning/10 min-w-[70px]">
                      <span className="text-lg font-bold leading-none text-warning/40">—</span>
                      <span className="text-[10px] uppercase font-bold text-warning/40 mt-1">Pending</span>
                    </div>
                    <div className="flex flex-col items-center bg-success/5 px-3 py-1.5 rounded-xl border border-success/10 min-w-[70px]">
                      <span className="text-lg font-bold leading-none text-success/40">—</span>
                      <span className="text-[10px] uppercase font-bold text-success/40 mt-1">Posted</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center bg-base-200/40 px-3 py-1.5 rounded-xl border border-base-200 min-w-[70px]">
                      <span className="text-lg font-bold leading-none text-base-content">{summary.total}</span>
                      <span className="text-[10px] uppercase font-bold text-base-content/60 mt-1">Total</span>
                    </div>
                    <div className="flex flex-col items-center bg-warning/10 px-3 py-1.5 rounded-xl border border-warning/20 min-w-[70px]">
                      <span className="text-lg font-bold leading-none text-warning/90">{summary.pending}</span>
                      <span className="text-[10px] uppercase font-bold text-warning/70 mt-1">Pending</span>
                    </div>
                    <div className="flex flex-col items-center bg-success/10 px-3 py-1.5 rounded-xl border border-success/20 min-w-[70px]">
                      <span className="text-lg font-bold leading-none text-success/90">{summary.posted}</span>
                      <span className="text-[10px] uppercase font-bold text-success/70 mt-1">Posted</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex justify-center md:justify-start pt-2">
              <div className="join bg-base-200/50 p-1 rounded-full w-full md:w-auto ring-1 ring-base-200 flex">
                {['pending', 'posted', 'all'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`join-item btn btn-sm rounded-full flex-1 md:flex-none border-none ${
                      selectedStatus === status 
                        ? 'bg-base-100 shadow-sm text-base-content hover:bg-base-100' 
                        : 'bg-transparent text-base-content/60 hover:bg-base-200'
                    }`}
                  >
                    {capitalizeFirstLetter(status)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Feed Content */}
          <div className="mt-8">
            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState 
                message={error?.response?.data?.message || error?.message || 'Failed to load posts.'} 
                onRetry={refetch} 
              />
            ) : posts.length === 0 ? (
              <div className="bg-base-100 rounded-3xl p-10 text-center shadow-sm ring-1 ring-base-200 flex flex-col items-center justify-center">
                <span className="text-4xl mb-4 opacity-50">📭</span>
                <h3 className="text-xl font-bold text-base-content">No posts found</h3>
                <p className="text-base-content/60 mt-2 max-w-sm">
                  There are no {selectedStatus !== 'all' ? selectedStatus : ''} posts scheduled for {formattedDate}. Try selecting another date or status filter.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post) => {
                  const isPostLoading = statusLoadingIds.has(post._id);
                  const isPending = post.status === 'pending';
                  
                  return (
                    <div key={post._id} className="rounded-3xl bg-base-100 p-5 md:p-7 shadow-sm ring-1 ring-base-200">
                      
                      {/* Post Card Top: Context */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={post.status} />
                          <span className="text-xs font-semibold text-base-content/50 px-2 py-1 bg-base-200/50 rounded-lg">
                            {capitalizeFirstLetter(post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString('en-US', { weekday: 'long' }) : (post.day || 'N/A'))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <button
                              onClick={() => openDeleteModal(post._id)}
                              className="btn btn-sm btn-ghost bg-error/5 text-error hover:bg-error hover:text-white rounded-lg px-4 font-semibold"
                              aria-label="Delete"
                              title="Delete"
                            >
                              Delete
                            </button>
                          )}
                          {(isAdmin || isCreator) && (
                            <button
                              onClick={() => openEditModal(post)}
                              className="btn btn-sm btn-ghost bg-base-200/50 hover:bg-base-200 rounded-lg px-4 font-semibold"
                              aria-label="Edit"
                              title="Edit"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Post Card Main: Caption */}
                      <div className="mb-6">
                        <div className="rounded-2xl bg-base-200/40 p-4 md:p-5 ring-1 ring-base-200/60">
                          <p className="whitespace-pre-line text-[15px] leading-relaxed text-base-content/80 font-medium">
                            {formatInstagramPostText(post)}
                          </p>
                        </div>
                      </div>

                      {/* Post Card Bottom: Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <CopyButton post={post} className="btn btn-primary flex-1 w-full sm:w-auto rounded-xl" />

                        {post?.driveLink || post?.media?.driveFileId ? (
                          <a
                            href={post?.driveLink || `https://drive.google.com/open?id=${post.media.driveFileId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn flex-1 w-full sm:w-auto rounded-xl border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 font-semibold"
                          >
                            <span className="text-lg leading-none mb-0.5">☁</span>
                            Open Drive
                          </a>
                        ) : (
                          <button
                            disabled
                            className="btn flex-1 w-full sm:w-auto rounded-xl border border-base-300 bg-base-200 text-base-content/30 font-semibold"
                          >
                            <span className="text-lg leading-none mb-0.5">☁</span>
                            Open Drive
                          </button>
                        )}

                        <button
                          onClick={() => handleMarkAsButton(post._id, isPending ? 'posted' : 'pending')}
                          disabled={isPostLoading}
                          className={`btn flex-1 w-full sm:w-auto rounded-xl font-semibold border-none transition-all ${
                            isPending 
                              ? 'bg-success text-white hover:bg-success/90 shadow-sm shadow-success/20' 
                              : 'bg-base-200 text-base-content hover:bg-base-300'
                          }`}
                        >
                          {isPostLoading ? (
                            <span className="loading loading-spinner loading-sm text-current"></span>
                          ) : (
                            isPending ? 'Mark as Posted ✓' : 'Mark as Pending ↺'
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {(isAdmin || isCreator) && (
        <PostEditModal modalRef={postEditRef} post={editPost} onClose={closeEditModal} refetch={refetch} />
      )}

      {isAdmin && (
        <DeleteConfirmModal 
          isOpen={deleteModalOpen} 
          onClose={closeDeleteModal} 
          onConfirm={handleConfirmDelete} 
          isDeleting={isDeleting} 
        />
      )}
    </Container>
  );
};

export default PostCard;
