import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const accounts = ['snortpugs', 'pugsnortz', 'pugsnuff'];


const cap = (s = '') => (s ? s[0].toUpperCase() + s.slice(1) : '');

const PostEditModal = ({ modalRef, post, onClose, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const p = post || {};

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
      if (refetch) refetch();
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
      <div className="modal-box p-0 max-w-4xl border border-base-200 bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-100">
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
            className="btn bg-primary/30 btn-sm btn-circle opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!post ? (
            <div className="py-10 text-center border-2 border-dashed border-base-200 rounded-xl bg-base-100">
              <p className="text-sm text-base-content/40 italic">Select a post to edit...</p>
            </div>
          ) : (
            <form id="postEditForm" className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="h-32 flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">Caption</label>
                  <textarea
                    name="caption"
                    defaultValue={p.caption || ''}
                    className="textarea textarea-bordered w-full flex-1 rounded-xl bg-base-200/30 resize-none text-[13px] leading-relaxed"
                    placeholder="Write caption here..."
                  />
                </div>

                <div className="h-32 flex flex-col">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">Account</label>
                      <select
                        name="account"
                        defaultValue={p.account || ''}
                        className="select select-bordered select-sm w-full rounded-lg bg-base-200/30"
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        {accounts.map((a) => (
                          <option key={a} value={a}>
                            {cap(a)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">Post Date</label>
                      <input
                        type="date"
                        name="scheduledDate"
                        defaultValue={p.scheduledDate || ''}
                        className="input input-bordered input-sm w-full rounded-lg bg-base-200/30"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex-1 flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">Source</label>
                    <input
                      name="source"
                      defaultValue={p.source || ''}
                      className="input input-bordered input-sm w-full rounded-lg bg-base-200/30"
                      placeholder="TikTok @username"
                    />
                    <div className="flex-1" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="h-32 flex flex-col gap-3">
                  <div className="flex-1 flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">CTA</label>
                    <textarea
                      name="cta"
                      defaultValue={p.cta || ''}
                      className="textarea textarea-bordered w-full flex-1 rounded-xl bg-base-200/30 resize-none text-[13px]"
                      placeholder="Follow @username..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">Drive Link</label>
                    <input
                      name="driveLink"
                      defaultValue={p.driveLink || (p.media?.driveFileId ? `https://drive.google.com/open?id=${p.media.driveFileId}` : '')}
                      className="input input-bordered input-sm w-full rounded-lg bg-base-200/30"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div className="h-42 flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">Hashtags</label>
                  <textarea
                    name="hashtags"
                    defaultValue={p.hashtags || ''}
                    className="textarea textarea-bordered w-full flex-1 rounded-xl bg-base-200/30 font-mono text-[11px] resize-none"
                    placeholder="#pug #viral..."
                  />
                </div>
              </div>

              <input type="hidden" name="postId" defaultValue={p._id || ''} />
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-base-200/20 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost btn-sm font-bold text-base-content/50"
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
            className="btn btn-primary btn-sm px-6 rounded-lg font-bold shadow-md shadow-primary/20"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
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
