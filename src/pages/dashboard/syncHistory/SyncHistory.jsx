import React, { useState } from 'react';
import { Search, Filter, History, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useSyncHistory } from '../../../hooks/useSyncHistory';
import { useMe } from '../../../hooks/useMe';

import { Link } from 'react-router';
import SyncStatusBadge from '../../../components/sync/SyncStatusBadge';
import { formatDuration } from '../../../utils/syncHelpers';
import { formatDisplayDate, formatDisplayTime } from '../../../utils/dateTime';

const SyncHistory = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { runs, pagination, isLoading, isError } = useSyncHistory(page, limit);
  const { isAdmin, isCreator } = useMe();

  if (!isAdmin && !isCreator) {
    return <div className="p-6 text-center text-error">You do not have permission to view sync history.</div>;
  }

  // Calculate page-level metrics
  const pageCompleted = runs.filter((r) => r.status === 'completed').length;
  const pagePartial = runs.filter((r) => r.status === 'partial_success').length;
  const pageFailed = runs.filter((r) => r.status === 'failed' || r.status === 'incomplete').length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          Sync History
        </h1>
        <p className="text-sm text-base-content/60">
          Track PostFlow automation runs and review previous sync results.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-base-content/60">Total Runs</p>
            <History className="w-5 h-5 text-base-content/40" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">
            {isLoading ? '—' : pagination.totalCount}
          </div>
          <p className="mt-1 text-xs text-base-content/40">All time</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-base-content/60">Completed</p>
            <CheckCircle2 className="w-5 h-5 text-success/70" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">
            {isLoading ? '—' : pageCompleted}
          </div>
          <p className="mt-1 text-xs text-base-content/40">(This Page)</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-base-content/60">Partial Success</p>
            <AlertCircle className="w-5 h-5 text-warning/70" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">
            {isLoading ? '—' : pagePartial}
          </div>
          <p className="mt-1 text-xs text-base-content/40">(This Page)</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-base-content/60">Failed / Incomplete</p>
            <XCircle className="w-5 h-5 text-error/70" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">
            {isLoading ? '—' : pageFailed}
          </div>
          <p className="mt-1 text-xs text-base-content/40">(This Page)</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search runs... (Unsupported)"
            disabled
            className="input input-bordered w-full pl-9 h-10 rounded-xl bg-base-100 opacity-50 cursor-not-allowed text-sm"
          />
        </div>
        <button disabled className="btn btn-outline h-10 min-h-0 rounded-xl px-4 flex gap-2 opacity-50">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Main Table Content */}
      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="table table-md w-full">
            <thead className="bg-base-200/50">
              <tr>
                <th>Target Date</th>
                <th>Status</th>
                <th>Started</th>
                <th>Duration</th>
                <th className="text-right">Candidates</th>
                <th className="text-right">Created</th>
                <th className="text-right">Duplicates</th>
                <th className="text-right">Skipped</th>
                <th className="text-right">Failed</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    <td colSpan={10}>
                      <div className="h-10 bg-base-200 animate-pulse rounded-lg w-full" />
                    </td>
                  </tr>
                ))
              )}

              {isError && (
                <tr>
                  <td colSpan={10} className="text-center py-8">
                    <div className="text-error flex flex-col items-center gap-2">
                      <AlertCircle className="w-6 h-6" />
                      Unable to load sync history.
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && runs.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex flex-col items-center justify-center text-primary">
                        <History className="w-8 h-8" />
                      </div>
                      <p className="text-base font-semibold text-base-content mt-2">No sync history yet.</p>
                      <p className="text-sm text-base-content/60 max-w-sm">
                        Run Prepare Posts from the dashboard to create your first automation record.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && runs.map((run) => {
                const isRunning = run.status === 'running';
                const hasResult = !!run.result;

                return (
                  <tr key={run._id} className="hover hover:bg-base-200/20 transition-colors">
                    <td className="font-medium">
                      {formatDisplayDate(run.targetDate, '—')}
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <SyncStatusBadge status={run.status} />
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`badge badge-xs ${run.triggeredBy === 'system-auto-sync' ? 'badge-primary badge-outline' : 'badge-ghost'}`}>
                            {run.triggeredBy === 'system-auto-sync' ? 'Auto' : 'Manual'}
                          </span>
                          {run.result?.message === 'Sync completed with media warnings' && (
                            <span className="badge badge-xs badge-warning badge-outline" title="Media warnings present">
                              Media Notice
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-base-content/70">
                      {formatDisplayTime(run.createdAt, '—')}
                    </td>
                    <td className="text-base-content/70">
                      {isRunning ? 'Running' : formatDuration(run.createdAt, run.completedAt)}
                    </td>
                    <td className="text-right tabular-nums text-base-content/80">
                      {hasResult ? run.result.totalCandidates ?? '—' : '—'}
                    </td>
                    <td className="text-right tabular-nums text-base-content/80">
                      {hasResult ? run.result.created ?? '—' : '—'}
                    </td>
                    <td className="text-right tabular-nums text-base-content/80">
                      {hasResult ? run.result.skippedDuplicates ?? '—' : '—'}
                    </td>
                    <td className="text-right tabular-nums text-base-content/80">
                      {hasResult ? run.result.qualitySkipped ?? '—' : '—'}
                    </td>
                    <td className="text-right tabular-nums text-base-content/80">
                      {hasResult ? run.result.failed ?? '—' : '—'}
                    </td>
                    <td className="text-center">
                      <Link 
                        to={`/dashboard/sync-history/${run._id}`}
                        className="btn btn-sm btn-ghost text-primary hover:bg-primary/10" 
                        title="View Details"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-base-200 px-4 py-3 flex items-center justify-between bg-base-100">
          <div className="text-sm text-base-content/60">
            Showing page <span className="font-medium text-base-content">{pagination.page}</span> of <span className="font-medium text-base-content">{pagination.totalPages}</span>
          </div>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={page === 1 || isLoading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              «
            </button>
            <button className="join-item btn btn-sm cursor-default">Page {page}</button>
            <button
              className="join-item btn btn-sm"
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => setPage(p => p + 1)}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncHistory;
