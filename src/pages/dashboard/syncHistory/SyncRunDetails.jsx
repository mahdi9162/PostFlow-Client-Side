import React from 'react';
import { useParams, Link } from 'react-router';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertCircle, XCircle, FileText, Settings2, Users } from 'lucide-react';
import { useSyncHistoryDetails } from '../../../hooks/useSyncHistoryDetails';
import SyncStatusBadge from '../../../components/sync/SyncStatusBadge';
import { formatDuration } from '../../../utils/syncHelpers';

const getFallbackMessage = (status) => {
  switch (status) {
    case 'running': return 'Sync is still running.';
    case 'completed': return 'Sync completed successfully.';
    case 'partial_success': return 'Sync partially completed.';
    case 'failed': return 'Sync failed.';
    case 'incomplete': return 'Sync incomplete.';
    default: return 'Unknown sync status.';
  }
};

const SyncRunDetails = () => {
  const { syncId } = useParams();
  const { data, isLoading, isError, error } = useSyncHistoryDetails(syncId);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex gap-2 items-center opacity-50 cursor-not-allowed">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Sync History</span>
        </div>
        <div className="h-8 bg-base-200 animate-pulse rounded w-1/3"></div>
        <div className="h-6 bg-base-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skel-metric-${i}`} className="h-24 bg-base-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
        <div className="h-32 bg-base-200 animate-pulse rounded-2xl mt-6"></div>
      </div>
    );
  }

  if (isError) {
    const is404 = error?.response?.status === 404;
    return (
      <div className="w-full space-y-6 flex flex-col items-center justify-center py-20">
        <XCircle className="w-16 h-16 text-error/50" />
        <h2 className="text-2xl font-semibold text-base-content">
          {is404 ? 'Sync run not found.' : 'Unable to load sync run details.'}
        </h2>
        <Link to="/dashboard/sync-history" className="btn btn-primary mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sync History
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const { targetDate, status, createdAt, completedAt, result } = data;
  const isRunning = status === 'running';
  const hasResult = !!result;

  return (
    <div className="w-full space-y-6">
      {/* Back Link */}
      <div>
        <Link to="/dashboard/sync-history" className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Sync History
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-base-content">
              Sync Run — {targetDate ? format(new Date(targetDate), 'MMM d, yyyy') : 'Unknown Date'}
            </h1>
            <SyncStatusBadge status={status} />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-base-content/60">
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> ID: {syncId}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Target: {targetDate ? format(new Date(targetDate), 'MMM d, yyyy') : '—'}</span>
            {createdAt && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Started: {format(new Date(createdAt), 'HH:mm:ss')}</span>}
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Completed: {completedAt ? format(new Date(completedAt), 'HH:mm:ss') : (isRunning ? 'Running' : '—')}</span>
            <span className="flex items-center gap-1.5"><Settings2 className="w-4 h-4" /> Duration: {isRunning ? 'Running' : formatDuration(createdAt, completedAt)}</span>
          </div>
        </div>
      </div>

      {/* Result Message Panel */}
      <div className={`p-4 rounded-xl border flex gap-3 ${
        status === 'completed' ? 'bg-success/10 border-success/20 text-success' :
        status === 'partial_success' || status === 'incomplete' ? 'bg-warning/10 border-warning/20 text-warning' :
        status === 'failed' ? 'bg-error/10 border-error/20 text-error' :
        'bg-primary/10 border-primary/20 text-primary'
      }`}>
        <div className="mt-0.5">
          {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
           status === 'failed' ? <XCircle className="w-5 h-5" /> :
           status === 'running' ? <Settings2 className="w-5 h-5 animate-spin" /> :
           <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <p className="font-medium">
            {hasResult && result.message ? result.message : getFallbackMessage(status)}
          </p>
          {hasResult && (result.created > 0 || result.failed > 0) && (
            <p className="text-sm opacity-80 mt-1">
              {result.created ?? 0} created • {result.skippedDuplicates ?? 0} duplicates • {result.failed ?? 0} failed
            </p>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Candidates', value: hasResult ? result.totalCandidates : '—', color: 'text-base-content' },
          { label: 'Processed', value: hasResult ? result.processed : '—', color: 'text-base-content' },
          { label: 'Created', value: hasResult ? result.created : '—', color: 'text-success' },
          { label: 'Duplicates', value: hasResult ? result.skippedDuplicates : '—', color: 'text-base-content/70' },
          { label: 'Skipped', value: hasResult ? result.qualitySkipped : '—', color: 'text-warning' },
          { label: 'Failed', value: hasResult ? result.failed : '—', color: 'text-error' },
        ].map((metric, i) => (
          <div key={`metric-${i}`} className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-xs text-base-content/60 mb-1">{metric.label}</p>
            <p className={`text-2xl font-semibold ${metric.color}`}>
              {metric.value ?? '—'}
            </p>
          </div>
        ))}
      </div>

      {/* Account Breakdown */}
      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-base-200 bg-base-100/50 flex items-center gap-2">
          <Users className="w-5 h-5 text-base-content/70" />
          <h2 className="text-lg font-semibold text-base-content">Account Breakdown</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead className="bg-base-200/30">
              <tr>
                <th>Account</th>
                <th className="text-right">Found</th>
                <th className="text-right">Created</th>
                <th className="text-right">Duplicates</th>
                <th className="text-right">Skipped</th>
                <th className="text-right">Failed</th>
              </tr>
            </thead>
            <tbody>
              {hasResult && result.accounts && Object.keys(result.accounts).length > 0 ? (
                Object.entries(result.accounts).map(([accountName, stats]) => (
                  <tr key={accountName} className="hover">
                    <td className="font-medium text-base-content">{accountName}</td>
                    <td className="text-right tabular-nums text-base-content/80">{stats.found ?? 0}</td>
                    <td className="text-right tabular-nums text-success font-medium">{stats.created ?? 0}</td>
                    <td className="text-right tabular-nums text-base-content/70">{stats.duplicates ?? 0}</td>
                    <td className="text-right tabular-nums text-warning">{stats.qualitySkipped ?? 0}</td>
                    <td className={`text-right tabular-nums ${stats.failed > 0 ? 'text-error font-bold' : 'text-base-content/50'}`}>
                      {stats.failed ?? 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-base-content/50 text-sm">
                    {isRunning ? 'Breakdown not available while sync is running.' : 'No account breakdown available for this run.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Details */}
      <div className="collapse collapse-arrow border border-base-200 bg-base-100 rounded-xl">
        <input type="checkbox" /> 
        <div className="collapse-title font-medium text-base-content/80 text-sm">
          Technical Details
        </div>
        <div className="collapse-content"> 
          <div className="bg-base-200/50 p-4 rounded-lg font-mono text-xs text-base-content/70 overflow-x-auto">
            <p><strong className="text-base-content">Sync ID:</strong> {syncId}</p>
            <p><strong className="text-base-content">Backend Status:</strong> {status}</p>
            {hasResult && <p><strong className="text-base-content">Result Message:</strong> {result.message}</p>}
            {createdAt && <p><strong className="text-base-content">Created At:</strong> {createdAt}</p>}
            {completedAt && <p><strong className="text-base-content">Completed At:</strong> {completedAt}</p>}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SyncRunDetails;
