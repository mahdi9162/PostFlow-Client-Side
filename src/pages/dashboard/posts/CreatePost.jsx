import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import axiosInstance from '../../../services/axiosInstance';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleNewPost = async (data) => {
    try {
      if (!data) return;
      await axiosInstance.post('/api/posts', data);
      reset();
      toast.success('Your post is uploaded successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-linear-to-br from-primary/10 via-base-100 to-secondary/10 rounded-4xl">
      <div className="mx-auto max-w-6xl px-3 md:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-secondary tracking-tight">Create New Post</h1>
            <p className="text-sm text-base-content/60 mt-1">Fill the fields — your team will copy from the post card.</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-6">
          <div className="rounded-3xl border border-base-200 bg-base-100/80 backdrop-blur-xl shadow-xl shadow-primary/10 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-primary via-primary/70 to-secondary/60" />

            <form onSubmit={handleSubmit(handleNewPost)} className="p-4 md:p-7">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold mb-1">Account</span>
                  </label>

                  <select
                    className="
                      select w-full rounded-2xl
                      bg-base-100
                      border border-base-300
                      hover:border-base-400
                      focus:outline-none focus:border-primary/60
                      focus:ring-2 focus:ring-primary/15
                      transition cursor-pointer
                    "
                    name="account"
                    defaultValue=""
                    {...register('account', {
                      required: 'Account is required',
                    })}
                  >
                    <option value="" disabled hidden>
                      Choose an Account
                    </option>
                    <option>Snortpugs</option>
                    <option>Pugsnortz</option>
                    <option>Pugsnuff</option>
                  </select>
                  {errors.account && <p className="text-left mt-1 text-xs text-red-400/80">{errors.account.message}</p>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold mb-1">Day of week</span>
                  </label>

                  <select
                    className="
                      select w-full rounded-2xl
                      bg-base-100/80
                      border border-base-300
                      hover:border-base-400
                      focus:outline-none focus:border-primary/60
                      focus:ring-2 focus:ring-primary/15
                      transition cursor-pointer
                    "
                    defaultValue=""
                    name="day"
                    {...register('day', {
                      required: 'Day is required',
                    })}
                  >
                    <option value="" disabled hidden>
                      Choose a Day
                    </option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                  </select>
                  {errors.day && <p className="text-left mt-1 text-xs text-red-400/80">{errors.day.message}</p>}
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text font-semibold mb-1">Caption</span>
                </label>

                <div className="relative">
                  <textarea
                    className="
                      textarea w-full min-h-37.5 rounded-2xl
                      bg-base-100/80
                      border border-base-300
                      hover:border-base-400
                      focus:outline-none focus:border-primary/60
                      focus:ring-2 focus:ring-primary/15
                      transition
                    "
                    name="caption"
                    {...register('caption', {
                      required: 'Caption is required',
                    })}
                    placeholder="Write the hook + caption..."
                  />
                  {errors.caption && <p className="text-left mt-1 text-xs text-red-400/80">{errors.caption.message}</p>}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text font-semibold mb-1">CTA</span>
                </label>

                <textarea
                  className="
                    textarea w-full min-h-27.5 rounded-2xl
                    bg-base-100/80
                    border border-base-300
                    hover:border-base-400
                    focus:outline-none focus:border-primary/60
                    focus:ring-2 focus:ring-primary/15
                    transition
                  "
                  name="cta"
                  {...register('cta', {
                    required: 'CTA is required',
                  })}
                  placeholder="Example: Follow @snortpugs for more..."
                />
                {errors.cta && <p className="text-left mt-1 text-xs text-red-400/80">{errors.cta.message}</p>}
              </div>

              {/* Source */}
              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text font-semibold mb-1">Source</span>
                </label>

                <input
                  className="
                    input w-full rounded-2xl
                    bg-base-100/80
                    border border-base-300
                    hover:border-base-400
                    focus:outline-none focus:border-primary/60
                    focus:ring-2 focus:ring-primary/15
                    transition
                  "
                  name="source"
                  {...register('source', {
                    required: 'Source is required',
                  })}
                  placeholder="TikTok: @username / link"
                />
                {errors.source && <p className="text-left mt-1 text-xs text-red-400/80">{errors.source.message}</p>}
              </div>

              {/* Drive link */}
              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text font-semibold mb-1">Drive video link</span>
                </label>

                <input
                  type="url"
                  className="input w-full rounded-2xl bg-base-100/80 border border-base-300 hover:border-base-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition"
                  placeholder="https://drive.google.com/..."
                  {...register('driveLink', {
                    required: 'DriveLink is required',
                  })}
                />
                {errors.driveLink && <p className="text-left mt-1 text-xs text-red-400/80">{errors.driveLink.message}</p>}
              </div>

              {/* Hashtags */}
              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text font-semibold mb-1">Hashtags</span>
                </label>

                <textarea
                  className="
                    textarea w-full min-h-27.5 rounded-2xl
                    bg-base-100/80
                    border border-base-300
                    hover:border-base-400
                    focus:outline-none focus:border-primary/60
                    focus:ring-2 focus:ring-primary/15
                    transition
                  "
                  name="hashtags"
                  {...register('hashtags', {
                    required: 'Hashtags is required',
                  })}
                  placeholder="#snortpugs #pugsofinsta #ilovepug ..."
                />
                {errors.hashtags && <p className="text-left mt-1 text-xs text-red-400/80">{errors.hashtags.message}</p>}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Link to="/dashboard/posts" className="btn btn-ghost rounded-xl border border-base-200 bg-base-100/60 hover:bg-base-100">
                  Cancel
                </Link>

                <button className="btn rounded-xl border-0 text-white bg-linear-to-b from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-primary/35">
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
