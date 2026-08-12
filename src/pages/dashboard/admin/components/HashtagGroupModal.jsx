import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';

const HashtagGroupModal = ({ modalRef, mode, group, account, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [hashtags, setHashtags] = useState(['', '', '', '', '']);

  useEffect(() => {
    if (mode === 'edit' && group) {
      setName(group.name || '');
      setEnabled(group.enabled ?? true);
      const initialTags = group.hashtags || [];
      const newHashtags = Array.from({ length: 5 }, (_, i) => initialTags[i] || '');
      setHashtags(newHashtags);
    } else {
      setName('');
      setEnabled(true);
      setHashtags(['', '', '', '', '']);
    }
  }, [mode, group]);

  const handleHashtagChange = (index, value) => {
    const newTags = [...hashtags];
    let cleaned = value.replace(/#/g, '').replace(/\s+/g, '');
    newTags[index] = cleaned;
    setHashtags(newTags);
  };

  const handleClose = () => {
    if (loading) return;
    modalRef?.current?.close?.();
    onClose?.();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (loading) return;
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const tagsArray = hashtags.map(t => t.trim()).filter(Boolean);
    if (tagsArray.length !== 5) {
      toast.error('Exactly 5 hashtags are required');
      setLoading(false);
      return;
    }

    const hasDuplicate = new Set(tagsArray.map(t => t.toLowerCase())).size !== tagsArray.length;
    if (hasDuplicate) {
      toast.error('Duplicate tags are not allowed');
      setLoading(false);
      return;
    }

    const payload = {
      name: name.trim(),
      hashtags: tagsArray,
      enabled: enabled
    };
    
    if (mode === 'add') {
      payload.account = account;
    }

    try {
      if (mode === 'add') {
        await axiosSecure.post('/api/hashtagGroups', payload);
        toast.success('Group created successfully!');
      } else {
        await axiosSecure.patch(`/api/hashtagGroups/${group._id}`, payload);
        toast.success('Group updated successfully!');
      }
      
      const targetAccount = mode === 'add' ? payload.account : group?.account || account;
      await queryClient.invalidateQueries({ queryKey: ['hashtagGroups', targetAccount] });
      
      // Programmatic close: bypass handleClose() which is guarded by `loading`.
      // loading is still true here; finally runs after this block.
      modalRef?.current?.close?.();
      onClose?.();

      if (mode === 'add') {
        setName('');
        setEnabled(true);
        setHashtags(['', '', '', '', '']);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to ${mode} group`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onCancel={handleCancel}>
      <div className="modal-box p-0 w-full max-w-2xl max-h-[90vh] flex flex-col border border-base-200 bg-base-100 shadow-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-4 sm:px-6 py-4 border-b border-base-200 bg-base-100/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-base-content tracking-tight">
                {mode === 'add' ? 'Create Hashtag Group' : 'Edit Hashtag Group'}
              </h3>
              <p className="text-xs text-base-content/50">
                {mode === 'add' ? 'Add a new group of 5 hashtags.' : 'Update this group.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="btn bg-base-200/50 btn-sm btn-circle text-base-content hover:bg-base-200 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-base-200/20">
          <form id="hashtagGroupForm" className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === 'add' && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold mb-1">Account</span>
                  </label>
                  <div className="px-4 py-3 bg-base-200/50 rounded-2xl border border-base-200 text-sm font-semibold text-base-content/80">
                    {account}
                  </div>
                </div>
              )}

              <div className="form-control sm:col-span-1">
                <label className="label">
                  <span className="label-text font-semibold mb-1">Group Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                  placeholder="e.g. Pug Reels 1"
                  required
                />
              </div>

              <div className="form-control sm:col-span-2">
                <label className="label cursor-pointer justify-start gap-3">
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary toggle-sm" 
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <span className="label-text font-semibold">Enabled for Auto Rotation</span>
                </label>
              </div>
            </div>

            {/* Hashtags Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-base-content/40 pl-1">Hashtags (Exactly 5)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-base-200 bg-base-100">
                {hashtags.map((tag, index) => (
                  <div key={index} className="form-control relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 font-bold select-none">#</span>
                    <input
                      type="text"
                      className="input input-bordered w-full rounded-xl bg-base-200/50 pl-7 text-sm focus:bg-base-100 focus:border-primary/50"
                      placeholder={`tag ${index + 1}`}
                      value={tag}
                      onChange={(e) => handleHashtagChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </section>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-none flex items-center justify-end gap-3 px-4 sm:px-6 py-4 bg-base-100 border-t border-base-200">
          <button
            type="button"
            disabled={loading}
            className="btn btn-ghost rounded-xl border border-base-200 bg-base-100/60 hover:bg-base-200 text-base-content/70 disabled:opacity-50"
            onClick={handleClose}
          >
            Cancel
          </button>

          <button 
            type="submit" 
            form="hashtagGroupForm" 
            className="btn btn-primary px-6 rounded-xl shadow-sm border-none disabled:opacity-70"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm text-current"></span> : 'Save Group'}
          </button>
        </div>

      </div>
      <form method="dialog" className="modal-backdrop bg-black/30 backdrop-blur-[1px]">
        <button onClick={(e) => { if(loading) e.preventDefault(); else handleClose(); }} disabled={loading}>close</button>
      </form>
    </dialog>
  );
};

export default HashtagGroupModal;
