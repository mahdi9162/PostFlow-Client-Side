import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, Navigate } from 'react-router';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMe } from '../../../hooks/useMe';
import { useAccounts } from '../../../hooks/useAccounts';
import LoadingState from '../../../components/common/LoadingState';
import ErrorState from '../../../components/common/ErrorState';

const CreatePost = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const autoHashtags = useWatch({ control, name: 'autoHashtags' });
  const axiosSecure = useAxiosSecure();
  const { isAdmin, isCreator, isLoading: isMeLoading, isError: isMeError } = useMe();
  const { accounts, isLoading: isAccountsLoading, isError: isAccountsError } = useAccounts();

  if (isMeLoading) {
    return <LoadingState />;
  }

  if (isMeError) {
    return <ErrorState message="Failed to load user permissions." />;
  }

  if (!isAdmin && !isCreator) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNewPost = async (data) => {
    try {
      if (!data) return;
      await axiosSecure.post('/api/posts', data);
      reset();
      toast.success('Your post is uploaded successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">Create New Post</h1>
            <p className="text-sm text-base-content/60 mt-1">Fill the fields — your team will copy from the post card.</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-6">
          <div className="rounded-3xl border border-base-200 bg-base-100/80 backdrop-blur-xl shadow-sm overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-primary/20" />

            <form onSubmit={handleSubmit(handleNewPost)} className="p-4 md:p-7 space-y-8">
              
              {/* SECTION: Post Details */}
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-3 pl-1">Post Details</h2>
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
                        hover:border-primary/40
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
                        {isAccountsLoading ? 'Loading accounts...' : isAccountsError ? 'Error loading accounts' : accounts.filter(a => a.isActive).length === 0 ? 'No accounts available' : 'Choose an Account'}
                      </option>
                      {accounts.filter(a => a.isActive).map(account => (
                        <option key={account.slug} value={account.slug}>{account.displayName}</option>
                      ))}
                    </select>
                    {errors.account && <p className="text-left mt-1 text-xs text-red-400/80">{errors.account.message}</p>}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold mb-1">Post Date</span>
                    </label>
                    <input
                      type="date"
                      className="
                        input w-full rounded-2xl
                        bg-base-100/80
                        border border-base-300
                        hover:border-primary/40
                        focus:outline-none focus:border-primary/60
                        focus:ring-2 focus:ring-primary/15
                        transition cursor-pointer
                      "
                      name="scheduledDate"
                      {...register('scheduledDate', {
                        required: 'Post Date is required',
                      })}
                    />
                    {errors.scheduledDate && <p className="text-left mt-1 text-xs text-red-400/80">{errors.scheduledDate.message}</p>}
                  </div>
                </div>
              </section>

              {/* SECTION: Content */}
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-3 pl-1">Content</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold mb-1">Caption</span>
                    </label>
                    <textarea
                      className="
                        textarea w-full min-h-32 rounded-2xl
                        bg-base-100/80
                        border border-base-300
                        hover:border-primary/40
                        focus:outline-none focus:border-primary/60
                        focus:ring-2 focus:ring-primary/15
                        transition text-[15px] leading-relaxed resize-y
                      "
                      name="caption"
                      {...register('caption', {
                        required: 'Caption is required',
                      })}
                      placeholder="Write the hook + caption..."
                    />
                    {errors.caption && <p className="text-left mt-1 text-xs text-red-400/80">{errors.caption.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold mb-1">CTA</span>
                      </label>
                      <textarea
                        className="
                          textarea w-full h-full min-h-24 rounded-2xl
                          bg-base-100/80
                          border border-base-300
                          hover:border-primary/40
                          focus:outline-none focus:border-primary/60
                          focus:ring-2 focus:ring-primary/15
                          transition resize-y
                        "
                        name="cta"
                        {...register('cta', {
                          required: 'CTA is required',
                        })}
                        placeholder="Example: Follow @snortpugs for more..."
                      />
                      {errors.cta && <p className="text-left mt-1 text-xs text-red-400/80">{errors.cta.message}</p>}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold mb-1">Source (Optional)</span>
                      </label>
                      <input
                        className="
                          input w-full rounded-2xl
                          bg-base-100/80
                          border border-base-300
                          hover:border-primary/40
                          focus:outline-none focus:border-primary/60
                          focus:ring-2 focus:ring-primary/15
                          transition
                        "
                        name="source"
                        {...register('source')}
                        placeholder="TikTok: @username / link"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: Media */}
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-3 pl-1">Media</h2>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold mb-1">Drive Link (Optional)</span>
                    <span className="label-text-alt text-base-content/60">Paste the Google Drive file link.</span>
                  </label>
                  <input
                    type="url"
                    className="
                      input w-full rounded-2xl
                      bg-base-100/80
                      border border-base-300
                      hover:border-primary/40
                      focus:outline-none focus:border-primary/60
                      focus:ring-2 focus:ring-primary/15
                      transition
                    "
                    placeholder="https://drive.google.com/..."
                    {...register('driveLink')}
                  />
                </div>
              </section>

              {/* SECTION: Hashtags */}
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-3 pl-1">Hashtags</h2>
                <div className="form-control">
                  <div className="flex items-center justify-between">
                    <label className="label">
                      <span className="label-text font-semibold mb-1">Hashtags</span>
                    </label>
                    <label className="cursor-pointer label">
                      <span className="label-text mr-2 text-xs font-medium text-primary">Auto-assign next group on save</span>
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm checkbox-primary rounded-md" 
                        {...register('autoHashtags')}
                      />
                    </label>
                  </div>
                  <textarea
                    className="
                      textarea w-full min-h-24 rounded-2xl
                      bg-base-100/80
                      border border-base-300
                      hover:border-primary/40
                      focus:outline-none focus:border-primary/60
                      focus:ring-2 focus:ring-primary/15
                      transition disabled:opacity-50 disabled:cursor-not-allowed
                      font-mono text-[13px] resize-y
                    "
                    name="hashtags"
                    {...register('hashtags', {
                      required: autoHashtags ? false : 'Hashtags are required',
                    })}
                    placeholder={autoHashtags ? "Hashtags will be automatically selected from the next group" : "#snortpugs #pugsofinsta #ilovepug ..."}
                    disabled={autoHashtags}
                  />
                  {errors.hashtags && <p className="text-left mt-1 text-xs text-red-400/80">{errors.hashtags.message}</p>}
                </div>
              </section>

              <div className="h-px w-full bg-base-200 mt-2 mb-2" />

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Link to="/dashboard" className="btn btn-ghost rounded-xl border border-base-200 bg-base-100/60 hover:bg-base-100">
                  Cancel
                </Link>

                <button 
                  disabled={isSubmitting}
                  className="btn btn-primary rounded-xl shadow-sm border-none"
                >
                  {isSubmitting ? <span className="loading loading-spinner loading-sm text-current"></span> : 'Save Post'}
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
