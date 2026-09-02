import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import {
  Sprout,
  Plus,
  Search,
  ExternalLink,
  Pause,
  Play,
  Archive,
  RotateCcw,
  CheckCircle2,
  PauseCircle,
  Archive as ArchiveIcon,
  AlertCircle,
  Instagram,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useMe } from '../../../../hooks/useMe';
import LoadingState from '../../../../components/common/LoadingState';
import ErrorState from '../../../../components/common/ErrorState';

const SeedAccounts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: roleLoading, isError: roleError } = useMe();

  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lead-seeds', statusFilter, searchVal],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchVal.trim()) params.append('search', searchVal.trim());
      const res = await axiosSecure.get(`/api/lead-seeds?${params.toString()}`);
      return res.data;
    },
    enabled: !!isAdmin,
  });

  if (roleLoading) return <LoadingState />;
  if (roleError) return <ErrorState message="Failed to load user permissions." />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const seeds = data?.seeds || [];
  const totalCount = data?.count || 0;

  // Compute stat counts from current dataset or overall
  const verifiedCount = seeds.filter((s) => s.status === 'verified').length;
  const pausedCount = seeds.filter((s) => s.status === 'paused').length;
  const archivedCount = seeds.filter((s) => s.status === 'archived').length;

  const handleAddSeed = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      toast.error('Please enter an Instagram username or profile URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post('/api/lead-seeds', { input: inputVal.trim() });
      toast.success(`Seed account @${res.data.username} added successfully!`);
      setInputVal('');
      queryClient.invalidateQueries({ queryKey: ['lead-seeds'] });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to add seed account.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status, enabled) => {
    setActionId(id);
    try {
      await axiosSecure.patch(`/api/lead-seeds/${id}`, { status, enabled });
      toast.success(`Seed account updated to ${status}.`);
      queryClient.invalidateQueries({ queryKey: ['lead-seeds'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update seed account.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-2">
                Seed Accounts
                <span className="badge badge-primary badge-sm font-semibold">C1 Manual</span>
              </h1>
              <p className="text-sm text-base-content/60">
                Manage verified Instagram source accounts used for Lead Finder target generation and candidate discovery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Seed Form Card */}
      <div className="card bg-base-100 border border-base-200 shadow-sm rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-base-content">Add Verified Instagram Seed</h2>
        </div>
        <p className="text-xs text-base-content/60 mb-4">
          Enter an Instagram handle (e.g. <code className="text-primary font-mono font-semibold">@puglover</code>) or a full profile link (e.g. <code className="text-primary font-mono font-semibold">https://instagram.com/puglover</code>).
        </p>

        <form onSubmit={handleAddSeed} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
              <Instagram className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="e.g. @pugsofinstagram or https://instagram.com/pugsofinstagram"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="input input-bordered w-full pl-11 rounded-2xl font-medium bg-base-200/40 focus:bg-base-100 transition"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !inputVal.trim()}
            className="btn btn-primary rounded-2xl px-6 gap-2 shadow-sm font-semibold min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Seed
              </>
            )}
          </button>
        </form>
      </div>

      {/* Stats and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="tabs tabs-boxed bg-base-200/60 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`tab rounded-xl text-xs font-semibold transition ${
              statusFilter === 'all' ? 'tab-active font-bold shadow-sm' : ''
            }`}
          >
            All Seeds ({statusFilter === 'all' ? totalCount : seeds.length})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`tab rounded-xl text-xs font-semibold transition ${
              statusFilter === 'verified' ? 'tab-active font-bold shadow-sm text-success' : ''
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setStatusFilter('paused')}
            className={`tab rounded-xl text-xs font-semibold transition ${
              statusFilter === 'paused' ? 'tab-active font-bold shadow-sm text-warning' : ''
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5 mr-1" />
            Paused ({pausedCount})
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`tab rounded-xl text-xs font-semibold transition ${
              statusFilter === 'archived' ? 'tab-active font-bold shadow-sm text-base-content/50' : ''
            }`}
          >
            <ArchiveIcon className="w-3.5 h-3.5 mr-1" />
            Archived ({archivedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search username..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 rounded-xl bg-base-100"
          />
        </div>
      </div>

      {/* Seed Accounts Table */}
      <div className="card bg-base-100 border border-base-200 shadow-sm rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-base-content/60">
            <span className="loading loading-spinner loading-md text-primary mb-2"></span>
            <div>Loading seed accounts...</div>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-error">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <div>Failed to load seed accounts.</div>
          </div>
        ) : seeds.length === 0 ? (
          <div className="p-12 text-center text-base-content/60 space-y-2">
            <Sprout className="w-10 h-10 mx-auto text-base-content/30" />
            <div className="font-semibold text-base">No seed accounts found</div>
            <p className="text-xs text-base-content/50 max-w-sm mx-auto">
              {searchVal.trim() || statusFilter !== 'all'
                ? 'No seeds match your search filter.'
                : 'Add verified Instagram seed accounts above to populate the Lead Finder source pool.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-4 px-6">Instagram Username</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Source</th>
                  <th className="py-4 px-4">Verified Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {seeds.map((seed) => {
                  const isVerified = seed.status === 'verified';
                  const isPaused = seed.status === 'paused';
                  const isArchived = seed.status === 'archived';
                  const isActing = actionId === seed._id;

                  return (
                    <tr key={seed._id} className="hover:bg-base-200/20 transition-colors">
                      {/* Username + Profile Link */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-xs">
                            <Instagram className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-base-content">
                              @{seed.username}
                            </div>
                            <a
                              href={seed.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary/80 hover:text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              View profile <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        {isVerified && (
                          <span className="badge badge-success badge-sm font-semibold gap-1 text-white">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {isPaused && (
                          <span className="badge badge-warning badge-sm font-semibold gap-1 text-white">
                            <PauseCircle className="w-3 h-3" /> Paused
                          </span>
                        )}
                        {isArchived && (
                          <span className="badge badge-ghost badge-sm font-semibold gap-1 text-base-content/60">
                            <ArchiveIcon className="w-3 h-3" /> Archived
                          </span>
                        )}
                        {seed.status === 'candidate' && (
                          <span className="badge badge-info badge-sm font-semibold">Candidate</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-4 px-4 text-center">
                        <span className="badge badge-ghost font-mono text-xs capitalize">
                          {seed.source || 'manual'}
                        </span>
                      </td>

                      {/* Verified Date */}
                      <td className="py-4 px-4 text-xs text-base-content/70">
                        {seed.verifiedAt ? (
                          <span>{new Date(seed.verifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        ) : (
                          <span className="text-base-content/40">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isVerified && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(seed._id, 'paused', false)}
                                disabled={isActing}
                                className="btn btn-ghost btn-xs rounded-lg text-warning hover:bg-warning/10 gap-1 font-semibold"
                                title="Pause seed account"
                              >
                                <Pause className="w-3.5 h-3.5" />
                                Pause
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(seed._id, 'archived', false)}
                                disabled={isActing}
                                className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error/10 gap-1 font-semibold"
                                title="Archive seed account"
                              >
                                <Archive className="w-3.5 h-3.5" />
                                Archive
                              </button>
                            </>
                          )}

                          {isPaused && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(seed._id, 'verified', true)}
                                disabled={isActing}
                                className="btn btn-ghost btn-xs rounded-lg text-success hover:bg-success/10 gap-1 font-semibold"
                                title="Resume seed account"
                              >
                                <Play className="w-3.5 h-3.5" />
                                Resume
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(seed._id, 'archived', false)}
                                disabled={isActing}
                                className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error/10 gap-1 font-semibold"
                                title="Archive seed account"
                              >
                                <Archive className="w-3.5 h-3.5" />
                                Archive
                              </button>
                            </>
                          )}

                          {isArchived && (
                            <button
                              onClick={() => handleUpdateStatus(seed._id, 'verified', true)}
                              disabled={isActing}
                              className="btn btn-ghost btn-xs rounded-lg text-primary hover:bg-primary/10 gap-1 font-semibold"
                              title="Restore seed account to verified"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedAccounts;
