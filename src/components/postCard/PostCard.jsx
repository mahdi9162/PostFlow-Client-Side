import React, { useState } from 'react';
import Container from '../container/Container';
import { Link } from 'react-router';
import { capitalizeFirstLetter } from '../../services/capitalizeFirstLetter';
import { formatDate } from '../../services/formatDate';
import CopyButton from '../Buttons/copyButton/CopyButton';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';
import { useMe } from '../../hooks/useMe';
import { getTodayBd } from '../../services/getTodayBd';

const PostCard = ({ posts, account, refetch }) => {
  const [selectedDay, setSelectedDay] = useState(() => getTodayBd());
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const { isAdmin, isCreator } = useMe();

  const filteredPosts = posts?.filter((post) => {
    const dayOk = (post.day || '').toLowerCase() === selectedDay;
    const statusOk = (post.status || '').toLowerCase() === selectedStatus;
    return dayOk && statusOk;
  });

  const handleMarkAsButton = async (id, status) => {
    try {
      await axiosInstance.patch(`/api/posts/${id}/status`, {
        status,
      });
      refetch();
      toast.success(`Marked as ${status} - successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <div className="min-h-screen bg-base-200/40 py-8 rounded-4xl">
        <div className="mx-auto w-full max-w-5xl px-4">
          {/* Top filters row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-base-content/70">Day:</span>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="select select-sm select-bordered rounded-full cursor-pointer"
                >
                  {days.map((day, i) => (
                    <option key={i} value={day}>
                      {capitalizeFirstLetter(day)}
                    </option>
                  ))}
                </select>
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

            <Link to="/dashboard/create-post" className="btn btn-primary rounded-full px-6">
              <span className="text-lg leading-none">＋</span>
              New Post
            </Link>
          </div>

          {/* Card */}
          <div>
            {filteredPosts?.map((post) => (
              <div key={post._id} className="mt-6 rounded-2xl bg-base-100 p-6 shadow-sm ring-1 ring-base-200">
                {/* Header row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-info badge-outline rounded-full">{capitalizeFirstLetter(post.day)}</span>
                    <span className="badge badge-warning badge-outline rounded-full">{capitalizeFirstLetter(post.status)}</span>
                    <span className="badge badge-success badge-outline rounded-full">{capitalizeFirstLetter(account)}</span>
                  </div>

                  <div className="text-sm text-base-content/60">
                    Created: <span className="font-medium">{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="mt-3 text-lg font-semibold text-base-content max-w-md line-clamp-1">{post.caption}</h2>

                {/* Caption area */}
                <div className="mt-3 rounded-2xl bg-base-200/60 p-4 ring-1 ring-base-200">
                  <p className="whitespace-pre-line text-sm leading-6 text-base-content/80">
                    <span>{post.caption}</span>
                    {'\n'}
                    <span>{post.cta}</span>
                    {'\n'}.{'\n'}.{'\n'}.{'\n'}.{'\n'}
                    <span>{post.source}</span>
                    {'\n'}.{'\n'}.{'\n'}.{'\n'}.{'\n'}
                    <span className="max-w-xl block">{post.hashtags}</span>
                  </p>
                </div>

                {/* Bottom actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <CopyButton post={post} />

                  {/* Drive link button */}
                  <a
                    href={post?.driveLink || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn bg-primary/30 text-black py-1 md:py-0 flex-1 rounded-full border border-base-300 cursor-pointer ${
                      !post?.driveLink ? 'btn-disabled bg-white text-black/20' : ''
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
                      className={isAdmin || isCreator ? 'btn btn-circle btn-ghost border border-base-300' : 'hidden'}
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
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
    </Container>
  );
};

export default PostCard;
