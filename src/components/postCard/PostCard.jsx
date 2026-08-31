import React, { useEffect, useMemo, useRef, useState } from 'react';
import Container from '../container/Container';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import CopyButton from '../Buttons/copyButton/CopyButton';

import toast from 'react-hot-toast';
import { useMe } from '../../hooks/useMe';
import { getTodayDateBd } from '../../utils/getTodayDateBd';
import { formatFeedHeaderDate } from '../../utils/dateTime';
import PostEditModal from './PostEditModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';

import { formatInstagramPostText } from '../Buttons/copyButton/formatInstagramPostText';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import StatusBadge from '../common/StatusBadge';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import MediaPreview from './MediaPreview';

const PostCard = ({ account }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const postEditRef = useRef(null);
  const [editPost, setEditPost] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateBd());
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [statusLoadingIds, setStatusLoadingIds] = useState(new Set());
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  
  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isAdmin, isCreator } = useMe();

  const {
    data: allPosts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', account, selectedDate],
    queryFn: async () => {
      const params = {
        account,
        scheduledDate: selectedDate,
      };
      const res = await axiosSecure.get('/api/posts', { params });
      return res.data;
    },
    enabled: !!account && !!selectedDate,
  });

  const posts = useMemo(() => {
    if (selectedStatus === 'all') return allPosts;
    return allPosts.filter((p) => p.status === selectedStatus);
  }, [allPosts, selectedStatus]);

  const summary = useMemo(() => ({
    total: allPosts.length,
    pending: allPosts.filter((p) => p.status === 'pending').length,
    posted: allPosts.filter((p) => p.status === 'posted').length,
  }), [allPosts]);

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

  const handleDownloadMedia = async (post) => {
    if (!post?._id || !post?.media?.driveFileId) return;

    setDownloadingIds((prev) => new Set(prev).add(post._id));
    try {
      const response = await axiosSecure.get(`/api/posts/${post._id}/media/download`, {
        responseType: 'blob',
      });

      let filename = post.media?.fileName || `post-media-${post._id}`;
      const disposition = response.headers['content-disposition'];
      if (disposition) {
        const matchUtf8 = disposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (matchUtf8 && matchUtf8[1]) {
          filename = decodeURIComponent(matchUtf8[1]);
        } else {
          const matchStandard = disposition.match(/filename="?([^";]+)"?/i);
          if (matchStandard && matchStandard[1]) {
            filename = decodeURIComponent(matchStandard[1]);
          }
        }
      }

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Download started successfully');
    } catch (error) {
      let errorMsg = 'Failed to download media.';
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          if (json?.message) errorMsg = json.message;
        } catch {
          // fallback errorMsg
        }
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(post._id);
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
  const formattedDate = formatFeedHeaderDate(selectedDate);

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
                {isError ? (
                  <span className="text-sm font-semibold text-error/80 px-4 py-2">Summary unavailable</span>
                ) : isLoading ? (
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
                    className={`join-item btn btn-sm rounded-full flex-1 md:flex-none border-none font-semibold transition-all ${
                      selectedStatus === status 
                        ? 'bg-primary text-primary-content shadow-sm hover:bg-primary' 
                        : 'bg-transparent text-base-content/50 hover:bg-base-200 hover:text-base-content'
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
                {posts.map((post, index) => {
                  const reviewNumber = index + 1;
                  const isPostLoading = statusLoadingIds.has(post._id);
                  const isPending = post.status === 'pending';
                  
                  return (
                    <div key={post._id} className="rounded-3xl bg-base-100 p-5 md:p-7 shadow-sm ring-1 ring-base-200">
                      
                      {/* Post Card Media Preview */}
                      <MediaPreview post={post} reviewNumber={reviewNumber} />

                      {/* Post Card Top: Context */}
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-4">
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <StatusBadge status={post.status} />
                          <span className="text-xs font-semibold text-base-content/50 px-2 py-1 bg-base-200/50 rounded-lg">
                            {capitalizeFirstLetter(post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString('en-US', { weekday: 'long' }) : (post.day || 'N/A'))}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          {isAdmin && (
                            <button
                              onClick={() => openDeleteModal(post._id)}
                              className="btn btn-sm btn-ghost bg-error/5 text-error hover:bg-error hover:text-white rounded-lg px-3 sm:px-4 font-semibold"
                              aria-label="Delete"
                              title="Delete"
                            >
                              Delete
                            </button>
                          )}
                          {(isAdmin || isCreator) && (
                            <button
                              onClick={() => openEditModal(post)}
                              className="btn btn-sm btn-ghost bg-base-200/50 hover:bg-base-200 rounded-lg px-3 sm:px-4 font-semibold"
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
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                        <CopyButton post={post} className="btn btn-primary w-full min-h-11 h-auto rounded-xl text-xs md:text-sm font-semibold leading-tight" />

                        {post?.media?.driveFileId ? (
                          <button
                            onClick={() => handleDownloadMedia(post)}
                            disabled={downloadingIds.has(post._id)}
                            className={`btn btn-secondary w-full min-h-11 h-auto rounded-xl font-semibold text-secondary-content shadow-sm transition-all border-none text-xs md:text-sm leading-tight px-2 ${
                              downloadingIds.has(post._id) ? 'opacity-90 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
                            }`}
                          >
                            {downloadingIds.has(post._id) ? (
                              <div className="flex items-center gap-1.5">
                                <span className="loading loading-spinner text-current"></span>
                                <span className="text-xs md:text-sm leading-tight">Downloading...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs md:text-lg leading-none mb-0.5">⇩</span>
                                <span className="text-xs md:text-sm leading-tight">Download Media</span>
                              </div>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="btn w-full min-h-11 h-auto rounded-xl border border-base-300 bg-base-200/80 text-base-content/40 font-semibold cursor-not-allowed text-xs md:text-sm leading-tight px-2"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs md:text-lg leading-none mb-0.5">⇩</span>
                              <span>Download Media</span>
                            </div>
                          </button>
                        )}

                        {post?.driveLink || post?.media?.driveFileId ? (
                          <a
                            href={post?.driveLink || `https://drive.google.com/open?id=${post.media.driveFileId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn w-full min-h-11 h-auto rounded-xl border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs md:text-sm leading-tight px-2 flex items-center justify-center gap-1.5"
                          >
                            <span className="text-xs md:text-lg leading-none mb-0.5">☁</span>
                            <span>Open Drive</span>
                          </a>
                        ) : (
                          <button
                            disabled
                            className="btn w-full min-h-11 h-auto rounded-xl border border-base-300 bg-base-200 text-base-content/30 font-semibold text-xs md:text-sm leading-tight px-2 flex items-center justify-center gap-1.5"
                          >
                            <span className="text-xs md:text-lg leading-none mb-0.5">☁</span>
                            <span>Open Drive</span>
                          </button>
                        )}


                        <button
                          onClick={() => handleMarkAsButton(post._id, isPending ? 'posted' : 'pending')}
                          disabled={isPostLoading}
                          className={`btn w-full min-h-11 h-auto rounded-xl font-semibold border-none transition-all text-xs md:text-sm leading-tight px-2 ${
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
