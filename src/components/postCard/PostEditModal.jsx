import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

import { useAccounts } from '../../hooks/useAccounts';
const PostEditModal = ({ modalRef, post, onClose, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const [loading, setLoading] = useState(false);
  const p = post || {};
  
  const registryAccounts = accounts || [];
  const activeAccounts = registryAccounts.filter(a => a.isActive);
  const currentAccountInRegistry = registryAccounts.find(a => a.slug === p.account);
  const isHistoricalInactive = p.account && currentAccountInRegistry && !currentAccountInRegistry.isActive;
  const isHistoricalMissing = p.account && !currentAccountInRegistry;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await axiosSecure.patch(`/api/posts/${data.postId}`, {
        account: data.account,
        scheduledDate: data.scheduledDate,
        caption: data.caption,
        cta: data.cta,
        source: data.source,
        driveLink: data.driveLink,
        hashtags: data.hashtags,
      });

      toast.success('Post updated successfully');
      if (refetch) {
        await refetch();
      }
      modalRef?.current?.close?.();
      if (onClose) onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box p-0 w-full max-w-4xl max-h-[90vh] flex flex-col border border-base-200 bg-base-100 shadow-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden">
        {/* Header (Fixed) */}
        <div className="flex-none flex items-center justify-between px-4 sm:px-6 py-4 border-b border-base-200 bg-base-100/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-base-content tracking-tight">Edit Post</h3>
              <p className="text-xs text-base-content/50">Update fields and save your changes.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              modalRef?.current?.close?.();
              onClose?.();
            }}
            className="btn bg-primary/10 btn-sm btn-circle text-primary hover:bg-primary hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-base-200/20">
          {!post ? (
            <div className="py-10 text-center border-2 border-dashed border-base-200 rounded-xl bg-base-100">
              <p className="text-sm text-base-content/40 italic">Select a post to edit...</p>
            </div>
          ) : (
            <form id="postEditForm" className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              
              {/* SECTION: Post Details */}
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-3 pl-1">Post Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold mb-1">Account</span>
                    </label>
                    <select
                      name="account"
                      defaultValue={p.account || ''}
                      className="select select-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                      required
                    >
                      <option value="" disabled hidden>
                        {isAccountsLoading ? 'Loading accounts...' : 'Select Account'}
                      </option>
                      {activeAccounts.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.displayName}
                        </option>
                      ))}
                      {isHistoricalInactive && (
                        <option key={p.account} value={p.account}>
                          {currentAccountInRegistry.displayName} (Inactive)
                        </option>
                      )}
                      {isHistoricalMissing && (
                        <option key={p.account} value={p.account}>
                          {p.account} (Inactive)
                        </option>
                      )}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold mb-1">Post Date</span>
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      defaultValue={p.scheduledDate || ''}
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                      required
                    />
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
                      name="caption"
                      defaultValue={p.caption || ''}
                      className="textarea textarea-bordered w-full min-h-32 rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 text-[15px] leading-relaxed resize-y"
                      placeholder="Write caption here..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold mb-1">CTA</span>
                      </label>
                      <textarea
                        name="cta"
                        defaultValue={p.cta || ''}
                        className="textarea textarea-bordered w-full min-h-24 rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 resize-y"
                        placeholder="Follow @username..."
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold mb-1">Source (Optional)</span>
                      </label>
                      <input
                        name="source"
                        defaultValue={p.source || ''}
                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                        placeholder="TikTok @username"
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
                    name="driveLink"
                    defaultValue={p.driveLink || (p.media?.driveFileId ? `https://drive.google.com/open?id=${p.media.driveFileId}` : '')}
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </section>

              {/* SECTION: Hashtags */}
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 mb-3 pl-1">Hashtags</h2>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold mb-1">Hashtags</span>
                  </label>
                  <textarea
                    name="hashtags"
                    defaultValue={p.hashtags || ''}
                    className="textarea textarea-bordered w-full min-h-24 rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 font-mono text-[13px] resize-y"
                    placeholder="#pug #viral..."
                    required
                  />
                </div>
              </section>

              <input type="hidden" name="postId" defaultValue={p._id || ''} />
            </form>
          )}
        </div>

        {/* Footer (Fixed) */}
        <div className="flex-none flex items-center justify-end gap-3 px-4 sm:px-6 py-4 bg-base-100 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost rounded-xl border border-base-200 bg-base-100/60 hover:bg-base-200 text-base-content/70"
            onClick={() => {
              modalRef?.current?.close?.();
              onClose?.();
            }}
          >
            Cancel
          </button>

          <button 
            type="submit" 
            form="postEditForm" 
            className="btn btn-primary px-6 rounded-xl shadow-sm border-none"
            disabled={loading || !post}
          >
            {loading ? <span className="loading loading-spinner loading-sm text-current"></span> : 'Save Changes'}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop bg-black/30 backdrop-blur-[1px]">
        <button onClick={() => onClose?.()}>close</button>
      </form>
    </dialog>
  );
};

export default PostEditModal;
