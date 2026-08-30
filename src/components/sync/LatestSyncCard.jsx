import React from 'react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { ArrowRight, History, Settings2, AlertCircle } from 'lucide-react';
import { useLatestSync } from '../../hooks/useLatestSync';
import SyncStatusBadge from './SyncStatusBadge';

const LatestSyncCard = () => {
  const { data, isLoading, isError } = useLatestSync();

  if (isLoading) {
    return (
      <div className="mt-6 rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-base-200 rounded w-1/4 mb-3"></div>
        <div className="h-6 bg-base-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 rounded-xl border border-error/20 bg-error/5 p-4 flex items-center gap-2 text-error text-sm">
        <AlertCircle className="w-4 h-4" />
        Unable to load latest sync.
      </div>
    );
  }

  const run = data?.runs?.[0];

  if (!run) {
    return (
      <div className="mt-6 rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-base-content/50" />
          <h3 className="font-semibold text-base-content text-sm">Latest Sync</h3>
        </div>
        <p className="text-sm text-base-content/60">
          No sync runs yet. Prepare posts to create your first sync record.
        </p>
      </div>
    );
  }

  const { status, targetDate, createdAt, result } = run;
  const isRunning = status === 'running';

  const renderSummary = () => {
    if (isRunning) {
      return (
        <div className="text-sm text-base-content/70 mt-2">
          <p className="flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 animate-spin" />
            Preparing posts for {targetDate ? format(new Date(targetDate), 'MMM d, yyyy') : '...'}
          </p>
          {createdAt && (
            <p className="text-xs opacity-70 mt-1">
              Started at {format(new Date(createdAt), 'h:mm a')}
            </p>
          )}
        </div>
      );
    }

    if (!result) return null;

    if (status === 'incomplete') {
      return (
        <p className="text-sm text-base-content/70 mt-2">
          {result.processed ?? 0} of {result.totalCandidates ?? 0} candidates processed
        </p>
      );
    }

    if (status === 'failed') {
      return (
        <p className="text-sm text-error mt-2 font-medium">
          {result.processed ?? 0} processed • {result.failed ?? 0} failed
        </p>
      );
    }

    const parts = [];
    if (result.processed != null) parts.push(`${result.processed} processed`);
    if (result.created > 0) parts.push(`${result.created} created`);
    if (result.skippedDuplicates > 0) parts.push(`${result.skippedDuplicates} duplicate${result.skippedDuplicates > 1 ? 's' : ''}`);
    if (result.qualitySkipped > 0) parts.push(`${result.qualitySkipped} skipped`);
    if (result.failed > 0) parts.push(`${result.failed} failed`);

    return (
      <p className="text-sm text-base-content/70 mt-2 font-medium">
        {parts.join(' • ')}
      </p>
    );
  };

  return (
    <div className="mt-6 rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div>
        <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-base-content/80">
          <History className="w-4 h-4" />
          Latest Sync
        </div>
        <div className="flex items-center gap-2">
          <SyncStatusBadge status={status} />
          {targetDate && (
            <span className="text-sm font-medium">
              {format(new Date(targetDate), 'MMM d, yyyy')}
            </span>
          )}
          <span className={`badge badge-sm ${run.triggeredBy === 'system-auto-sync' ? 'badge-primary badge-outline' : 'badge-ghost'}`}>
            {run.triggeredBy === 'system-auto-sync' ? 'Auto' : 'Manual'}
          </span>
        </div>
        {renderSummary()}
      </div>

      <div className="flex flex-row md:flex-col gap-3 md:gap-1.5 md:items-end w-full md:w-auto mt-2 md:mt-0 text-sm">
        <Link 
          to={`/dashboard/sync-history/${run._id}`}
          className="font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link 
          to="/dashboard/sync-history"
          className="text-base-content/60 hover:text-base-content transition-colors"
        >
          View Sync History
        </Link>
      </div>
    </div>
  );
};

export default LatestSyncCard;
