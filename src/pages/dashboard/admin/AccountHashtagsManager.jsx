import React from 'react';
import { Hash, Save, RefreshCw, Trash2, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import AccountTagGroupsPanel from './adminComponents/AccountTagGroupsPanel';

const accounts = [
  { value: 'snortpugs', label: 'Snortpugs' },
  { value: 'pugsnortz', label: 'Pugsnortz' },
  { value: 'pugsnuff', label: 'Pugsnuff' },
];

const AccountHashtagsManager = () => {
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleTagsSubmit = async (data) => {
    try {
      const { tags } = data;

      // validation
      const tagsArray = tags
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((item) => Boolean(item));

      // exactly 5
      if (tagsArray.length < 5) {
        toast.error('Minimum 5 tags required');
        return;
      }

      if (tagsArray.length > 5) {
        toast.error('Maximum 5 tags allowed');
        return;
      }

      // duplicate check
      const hasDuplicate = new Set(tagsArray.map((t) => t.toLowerCase())).size !== tagsArray.length;

      if (hasDuplicate) {
        toast.error('Duplicate tags are not allowed');
        return;
      }

      const res = await axiosSecure.post('/api/tags', data);
      if (res.data.acknowledged) {
        toast.success('Your tags is successfully posted!');
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 min-h-screen bg-base-200/30">
      <section>
        {/* Header (mobile+tablet behave same) */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary">Account Hashtags</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted max-w-[58ch] leading-relaxed">
              Manage saved hashtags per account. Your Create Post page can show these as quick options.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-visible">
          <form onSubmit={handleSubmit(handleTagsSubmit)} className="p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
              {/* Left panel */}
              <div className="xl:col-span-1">
                <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Hash className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary">Select Account</p>
                      <p className="text-xs text-muted leading-relaxed">Choose which accounts tags you’re posting.</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-[11px] sm:text-xs font-semibold text-secondary/70">Account</label>
                    <select
                      className="select select-bordered w-full mt-2 rounded-xl text-sm"
                      {...register('account', { required: 'Account is required' })}
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Select an Account
                      </option>
                      {accounts.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                    {errors.account && <p className="text-left mt-1 text-xs text-red-400/80">{errors.account.message}</p>}
                  </div>

                  <div className="mt-4 rounded-xl border border-base-200 bg-base-200/30 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted mt-0.5 shrink-0" />
                      <div className="text-xs text-muted leading-relaxed">
                        <span className="font-semibold text-secondary/80">Goal:</span> Save hashtags once per account. Then Create Post can
                        show them as clickable options.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tip: show only on desktop */}
                <div className="mt-4 px-1 hidden xl:flex items-center gap-1.5 text-[11px] text-muted opacity-80">
                  <span>💡</span>
                  <span>Keep 15–25 strong tags per account. Too many reduces relevance.</span>
                </div>
              </div>

              {/* Right panel */}
              <div className="xl:col-span-2">
                <div className="rounded-2xl border border-base-200 bg-base-100 p-4 sm:p-5">
                  <div>
                    <p className="text-sm font-bold text-secondary">Hashtags</p>
                    <p className="text-xs text-muted leading-relaxed">Paste tags, preview chips, then save.</p>
                  </div>

                  {/* Input */}
                  <div className="mt-4">
                    <label className="text-[11px] sm:text-xs font-semibold text-secondary/70">
                      Paste hashtags (comma or new line separated)
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full mt-2 min-h-30 sm:min-h-35 rounded-2xl text-sm leading-relaxed"
                      placeholder={`Example: #snortpugs, #puglife, #pugsofinstagram #dogreels #funnydogs`}
                      name="tags"
                      {...register('tags', { required: 'Tags are required' })}
                    />
                    {errors.tags && <p className="text-left mt-1 text-xs text-red-400/80">{errors.tags.message}</p>}

                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-muted">
                      <span className="badge badge-ghost text-[10px] sm:text-[11px]">Enter / comma to split</span>
                      <span className="badge badge-ghost text-[10px] sm:text-[11px]">Auto add #</span>
                      <span className="badge badge-ghost text-[10px] sm:text-[11px]">Trim spaces</span>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] sm:text-xs font-semibold text-secondary/70">Preview (chips)</label>
                      <div className="text-xs text-muted">Count: —</div>
                    </div>

                    <div className="mt-2 rounded-2xl border border-base-200 bg-base-200/20 p-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-ghost text-[11px] sm:text-xs">#exampletag</span>
                        <span className="badge badge-ghost text-[11px] sm:text-xs">#pugs</span>
                        <span className="badge badge-ghost text-[11px] sm:text-xs">#dogreels</span>
                        <span className="badge badge-ghost text-[11px] sm:text-xs">#funnydogs</span>
                        <span className="badge badge-ghost text-[11px] sm:text-xs">#puglife</span>
                        <span className="badge badge-ghost text-[11px] sm:text-xs">#pugsofinstagram</span>
                      </div>

                      <div className="mt-3 hidden xl:block text-[11px] text-muted opacity-80">
                        Click-to-remove behavior goes here (you’ll add logic).
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs text-muted leading-relaxed">
                      Saving will store this list under the selected account in MongoDB.
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="btn btn-sm rounded-xl bg-base-100 border border-base-200">Cancel</button>
                      <button className="btn btn-sm rounded-xl btn-primary shadow-sm">
                        <Save className="h-4 w-4" />
                        Save Hashtags
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* right end */}
            </div>
          </form>
        </div>
      </section>
      {/* All Tags */}
      <section className='mt-20'>
        <AccountTagGroupsPanel />
      </section>
    </div>
  );
};

export default AccountHashtagsManager;
