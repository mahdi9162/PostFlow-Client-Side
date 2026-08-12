import React from 'react';
import { Hash, Save, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import AccountTagGroupsPanel from './components/AccountTagGroupsPanel';
import { useQueryClient } from '@tanstack/react-query';

const accounts = [
  { value: 'snortpugs', label: 'Snortpugs' },
  { value: 'pugsnortz', label: 'Pugsnortz' },
  { value: 'pugsnuff', label: 'Pugsnuff' },
];

const AccountHashtagsManager = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleTagsSubmit = async (data) => {
    try {
      const { account, name, tags } = data;

      // validation
      const tagsArray = tags
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter((item) => Boolean(item));

      // exactly 5
      if (tagsArray.length !== 5) {
        toast.error('Exactly 5 unique hashtags are required');
        return;
      }

      // duplicate check
      const hasDuplicate = new Set(tagsArray.map((t) => t.toLowerCase())).size !== tagsArray.length;
      if (hasDuplicate) {
        toast.error('Duplicate tags are not allowed');
        return;
      }

      await axiosSecure.post('/api/hashtagGroups', {
        account,
        name,
        hashtags: tagsArray,
        enabled: true
      });
      
      toast.success('Hashtag group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['hashtagGroups', account] });
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 min-h-screen bg-base-200/30">
      <section>
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">Hashtag Groups Manager</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted max-w-[58ch] leading-relaxed">
              Manage saved hashtag groups per account. The system will automatically rotate through enabled groups.
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
                      <p className="text-sm font-bold text-base-content">Select Account</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-[11px] sm:text-xs font-semibold text-base-content/70">Account</label>
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
                  
                  <div className="mt-4">
                    <label className="text-[11px] sm:text-xs font-semibold text-base-content/70">Group Name</label>
                    <input
                      className="input input-bordered w-full mt-2 rounded-xl text-sm"
                      placeholder="e.g. Pug Reels 1"
                      {...register('name', { required: 'Group Name is required' })}
                    />
                    {errors.name && <p className="text-left mt-1 text-xs text-red-400/80">{errors.name.message}</p>}
                  </div>

                  <div className="mt-4 rounded-xl border border-base-200 bg-base-200/30 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted mt-0.5 shrink-0" />
                      <div className="text-xs text-muted leading-relaxed">
                        <span className="font-semibold text-base-content/80">Goal:</span> Organize strictly 5 hashtags per group. PostFlow will deterministically rotate through enabled groups.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="xl:col-span-2">
                <div className="rounded-2xl border border-base-200 bg-base-100 p-4 sm:p-5">
                  <div>
                    <p className="text-sm font-bold text-base-content">Hashtags (Exactly 5)</p>
                  </div>

                  <div className="mt-4">
                    <label className="text-[11px] sm:text-xs font-semibold text-base-content/70">
                      Paste EXACTLY 5 hashtags (comma or space separated)
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full mt-2 min-h-32 sm:min-h-40 rounded-2xl text-sm leading-relaxed font-mono"
                      placeholder="#snortpugs #puglife #pugsofinstagram #dogreels #funnydogs"
                      {...register('tags', { required: 'Tags are required' })}
                    />
                    {errors.tags && <p className="text-left mt-1 text-xs text-red-400/80">{errors.tags.message}</p>}
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center justify-end gap-2 ml-auto">
                      <button type="button" onClick={() => reset()} className="btn btn-sm rounded-xl bg-base-100 border border-base-200">Cancel</button>
                      <button type="submit" className="btn btn-sm rounded-xl btn-primary shadow-sm">
                        <Save className="h-4 w-4" />
                        Save Group
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className='mt-10'>
        <AccountTagGroupsPanel />
      </section>
    </div>
  );
};

export default AccountHashtagsManager;
