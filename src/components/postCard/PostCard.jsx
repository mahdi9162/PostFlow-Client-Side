import React, { useEffect, useRef, useState } from 'react';
import Container from '../container/Container';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { formatDate } from '../../utils/formatDate';
import CopyButton from '../Buttons/copyButton/CopyButton';

import toast from 'react-hot-toast';
import { useMe } from '../../hooks/useMe';
import { getTodayDateBd } from '../../utils/getTodayDateBd';
import PostEditModal from './PostEditModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';

import { formatInstagramPostText } from '../Buttons/copyButton/formatInstagramPostText';

const PostCard = ({ account }) => {
  const axiosSecure = useAxiosSecure();

  const postEditRef = useRef(null);
  const [editPost, setEditPost] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateBd());
  const [selectedStatus, setSelectedStatus] = useState('pending');

  const { isAdmin, isCreator } = useMe();

  const { data: posts = [], refetch } = useQuery({
    queryKey: ['posts', account, selectedDate, selectedStatus],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/posts', {
        params: {
          account,
          scheduledDate: selectedDate,
          status: selectedStatus,
        },
      });

      return res.data;
    },
  });

  const handleMarkAsButton = async (id, status) => {
    try {
      await axiosSecure.patch(`/api/posts/${id}/status`, {
        status,
      });
      refetch();
      toast.success(`Marked as ${status} - successfully`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteButton = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axiosSecure.delete(`/api/posts/${id}`);
      refetch();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete post');
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

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <Container>
      <div className="min-h-screen bg-base-200/40 py-8 rounded-4xl">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-base-content/70">Date:</span>

              <div className="flex items-center gap-2">
                <button onClick={handlePrevDay} className="btn btn-sm btn-circle btn-ghost">
                  ←
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input input-sm input-bordered rounded-full cursor-pointer"
                />
                <button onClick={handleNextDay} className="btn btn-sm btn-circle btn-ghost">
                  →
                </button>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="select select-sm select-bordered rounded-full cursor-pointer"
              >
                <option value="pending">Pending only</option>
                <option value="posted">Posted only</option>
                <option value="all">All</option>
              </select>
            </div>

            {(isAdmin || isCreator) && (
              <Link to="/dashboard/create-post" className="btn btn-primary rounded-full px-6">
                <span className="text-lg leading-none">＋</span>
                New Post
              </Link>
            )}
          </div>

          <div>
            {posts?.map((post) => (
              <div key={post._id} className="mt-6 rounded-2xl bg-base-100 p-6 shadow-sm ring-1 ring-base-200">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-info badge-outline rounded-full">{capitalizeFirstLetter(post.day || 'N/A')}</span>
                    <span className="badge badge-warning badge-outline rounded-full">{capitalizeFirstLetter(post.status)}</span>
                    <span className="badge badge-success badge-outline rounded-full">{capitalizeFirstLetter(account)}</span>
                  </div>

                  <div className="text-sm text-base-content/60">
                    Created: <span className="font-medium">{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                <h2 className="mt-3 text-lg font-semibold text-base-content max-w-md line-clamp-1">{post.caption}</h2>

                <div className="mt-3 rounded-2xl bg-base-200/60 p-4 ring-1 ring-base-200">
                  <p className="whitespace-pre-line text-sm leading-6 text-base-content/80">
                    {formatInstagramPostText(post)}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <CopyButton post={post} />

                  <a
                    href={post?.driveLink || (post?.media?.driveFileId ? `https://drive.google.com/open?id=${post.media.driveFileId}` : '#')}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn bg-primary/30 text-black py-1 md:py-0 flex-1 rounded-full border border-base-300 cursor-pointer ${
                      (!post?.driveLink && !post?.media?.driveFileId) ? 'btn-disabled bg-white text-black/20' : ''
                    }`}
                  >
                    Open Drive
                  </a>

                  {post.status === 'pending' ? (
                    <button
                      onClick={() => handleMarkAsButton(post._id, 'posted')}
                      className="btn btn-ghost flex-1 py-1 md:py-0 rounded-full border border-base-300"
                    >
                      Mark as Posted
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsButton(post._id, 'pending')}
                      className="btn btn-ghost flex-1 py-1 md:py-0 rounded-full border border-base-300"
                    >
                      Mark as Pending
                    </button>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className={isAdmin || isCreator ? 'btn btn-circle btn-ghost border border-base-300' : 'hidden'}
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✎
                    </button>

                    <button
                      onClick={() => handleDeleteButton(post._id)}
                      className={isAdmin ? `btn btn-circle btn-ghost border border-error/40 text-error` : `hidden`}
                      aria-label="Delete"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PostEditModal modalRef={postEditRef} post={editPost} onClose={closeEditModal} refetch={refetch} />
    </Container>
  );
};

export default PostCard;
