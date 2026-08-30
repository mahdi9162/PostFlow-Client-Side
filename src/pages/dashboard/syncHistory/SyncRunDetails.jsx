import React, { useState } from 'react';

/**
 * @typedef {Object} FailedSyncAttempt
 * @property {'vision' | 'caption'} stage
 * @property {'groq' | 'gemini'} provider
 * @property {string} model
 * @property {boolean} success
 * @property {number | null} [statusCode]
 * @property {string} reason
 * @property {string} [message]
 */

/**
 * @typedef {Object} FailedSyncItem
 * @property {string} account
 * @property {string} driveFileId
 * @property {string} [fileName]
 * @property {string} [mimeType]
 * @property {string} [fingerprint]
 * @property {'duplicate-check' | 'vision' | 'caption' | 'create-post' | 'workflow'} stage
 * @property {string} reason
 * @property {string} message
 * @property {FailedSyncAttempt[]} [attempts]
 */
import { useParams, Link, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertCircle, XCircle, FileText, Settings2, Users, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
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
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, isError, error } = useSyncHistoryDetails(syncId);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryFailed = async () => {
    try {
      setIsRetrying(true);
      const res = await axiosSecure.post(`/api/sync/${syncId}/retry-failed`);
      toast.success('Retry sync started');
      if (res.data && res.data.syncId) {
        navigate(`/dashboard/sync-history/${res.data.syncId}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to start retry sync');
    } finally {
      setIsRetrying(false);
    }
  };

  const toggleExpand = (idx) => {
    const next = new Set(expandedItems);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedItems(next);
  };

  const expandAll = () => {
    if (data?.result?.failedItems) {
      setExpandedItems(new Set(data.result.failedItems.map((_, i) => i)));
    }
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

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

  const { targetDate, status, createdAt, completedAt, result, triggeredBy } = data;
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
            {data.retryOf && (
              <span className="flex items-center gap-1.5 text-warning font-medium">
                <RefreshCw className="w-4 h-4" /> Retry of: 
                <Link to={`/dashboard/sync-history/${data.retryOf}`} className="underline hover:text-warning/80">
                  {data.retryOf}
                </Link>
              </span>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Target: {targetDate ? format(new Date(targetDate), 'MMM d, yyyy') : '—'}</span>
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4" /> 
              Source: {triggeredBy === 'system-auto-sync' ? 'System Auto Sync' : triggeredBy || 'Manual'}
            </span>
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

      {/* Failed Items */}
      {hasResult && result.failed > 0 && result.failedItems && result.failedItems.length > 0 && (
        <div className="rounded-2xl border border-error/20 bg-base-100 shadow-sm overflow-hidden mt-6">
          <div className="p-4 border-b border-error/20 bg-error/5 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-error" />
              <h2 className="text-lg font-semibold text-error">Failed Items ({result.failedItems.length})</h2>
            </div>
            <div className="flex items-center gap-2">
              {!isRunning && (
                data.retryRunId ? (
                  <Link 
                    to={`/dashboard/sync-history/${data.retryRunId}`}
                    className="btn btn-sm btn-outline btn-warning font-medium"
                  >
                    Retried <RefreshCw className="w-3.5 h-3.5 ml-1" />
                  </Link>
                ) : (
                  <button 
                    onClick={handleRetryFailed} 
                    disabled={isRetrying}
                    className="btn btn-sm btn-outline btn-error font-medium"
                  >
                    {isRetrying ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry All Failed
                      </>
                    )}
                  </button>
                )
              )}
              {!isRunning && <div className="divider divider-horizontal mx-0 w-1"></div>}
              <button onClick={expandAll} className="btn btn-xs btn-ghost text-base-content/70 font-medium">Expand all</button>
              <button onClick={collapseAll} className="btn btn-xs btn-ghost text-base-content/70 font-medium">Collapse all</button>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {result.failedItems.map((item, idx) => {
              const isExpanded = expandedItems.has(idx);
              const latestAttempt = item.attempts && item.attempts.length > 0 ? item.attempts[item.attempts.length - 1] : null;

              return (
                <div key={idx} className={`p-4 rounded-xl border border-base-200 bg-base-100 flex flex-col transition-all shadow-sm ${isExpanded ? 'gap-4' : 'gap-3 hover:border-base-300'}`}>
                  {/* Compact Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(idx)}>
                      <h3 className="text-base font-semibold text-base-content break-all">{item.fileName || 'Unknown file'}</h3>
                      <p className="text-sm text-base-content/70 mt-1">
                        <span className="font-medium">{item.account}</span> &bull; <span className="capitalize">{item.stage}</span> &bull; {item.reason}
                      </p>
                      
                      {!isExpanded && latestAttempt && (
                        <p className="text-xs text-base-content/60 mt-1">
                          <span className="capitalize">{latestAttempt.provider}</span> / {latestAttempt.model} &rarr; {latestAttempt.statusCode ? latestAttempt.statusCode : latestAttempt.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                      {item.driveFileId && (
                        <a
                          href={`https://drive.google.com/file/d/${item.driveFileId}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open Drive
                        </a>
                      )}
                      <button 
                        onClick={() => toggleExpand(idx)}
                        className="btn btn-sm btn-ghost gap-1"
                      >
                        {isExpanded ? (
                          <>
                            View less
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View details
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="flex flex-col gap-4 pt-3 border-t border-base-200 mt-1">
                      <div className="bg-base-200/50 p-3 rounded-lg text-sm text-base-content/80 whitespace-pre-wrap break-words">
                        <p className="font-semibold mb-1 text-base-content">Message:</p>
                        {item.message}
                      </div>

                      {item.attempts && item.attempts.length > 0 && (
                        <div className="mt-1">
                          <p className="font-semibold text-sm text-base-content mb-2">Attempts:</p>
                          <ul className="space-y-1">
                            {item.attempts.map((attempt, i) => (
                              <li key={i} className="text-sm text-base-content/80 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-base-content/40"></span>
                                <span className="capitalize">{attempt.provider}</span> / {attempt.model} &rarr; {attempt.statusCode ? attempt.statusCode : attempt.reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            {triggeredBy && <p><strong className="text-base-content">Triggered By:</strong> {triggeredBy}</p>}
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
