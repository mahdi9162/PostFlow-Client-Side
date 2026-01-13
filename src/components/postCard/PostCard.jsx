import React from 'react';
import Container from '../container/Container';

const PostCard = () => {
  const days = ['All', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <Container>
      <div className="min-h-screen bg-base-200/40 py-8 rounded-4xl">
        <div className="mx-auto w-full max-w-5xl px-4">
          {/* Top filters row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-base-content/70">Day:</span>

              <div className="flex items-center gap-2">
                <select className="select select-sm select-bordered rounded-full cursor-pointer">
                  {days.map((day, i) => (
                    <option key={i}>{day}</option>
                  ))}
                </select>
              </div>

              <select className="select select-sm select-bordered rounded-full">
                <option>Pending only</option>
                <option>Posted only</option>
                <option>All</option>
              </select>
            </div>

            <button className="btn btn-primary rounded-full px-6">
              <span className="text-lg leading-none">＋</span>
              New Post
            </button>
          </div>

          {/* Card */}
          <div className="mt-6 rounded-2xl bg-base-100 p-6 shadow-sm ring-1 ring-base-200">
            {/* Header row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-info badge-outline rounded-full">Saturday</span>
                <span className="badge badge-warning badge-outline rounded-full">Pending</span>
              </div>

              <div className="text-sm text-base-content/60">
                Created: <span className="font-medium">23 Feb, 2025</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-3 text-lg font-semibold text-base-content">
              Is this not the cutest wedding entrance you've EVER seen?? 😍💍...
            </h2>

            {/* Caption area */}
            <div className="mt-3 rounded-2xl bg-base-200/60 p-4 ring-1 ring-base-200">
              <p className="whitespace-pre-line text-sm leading-6 text-base-content/80">
                Is this not the cutest wedding entrance you've EVER seen?? 😍💍{'\n'}
                Follow @snortpugs for more wholesome pug magic 💞{'\n'}.{'\n'}.{'\n'}.{'\n'}.{'\n'}
                Source: TikTok 🎥 @pugphilosophy77 | All rights reserved 💗{'\n'}
                DM for credit/removal 💗{'\n'}.{'\n'}.{'\n'}.{'\n'}.{'\n'}
                #snortpugs #pugsofinsta #ilovepug #pugmoments ...
              </p>
            </div>

            {/* Bottom actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="btn btn-primary flex-1 rounded-full">Copy</button>
              <button className="btn btn-ghost flex-1 rounded-full border border-base-300">Mark as Posted</button>

              <div className="ml-auto flex items-center gap-2">
                <button className="btn btn-circle btn-ghost border border-base-300" aria-label="Edit" title="Edit">
                  ✎
                </button>
                <button className="btn btn-circle btn-ghost border border-error/40 text-error" aria-label="Delete" title="Delete">
                  🗑
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PostCard;
