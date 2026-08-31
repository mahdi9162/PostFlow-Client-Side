import React from 'react';
import { formatMaintenanceDateTime } from '../../../../utils/dateTime';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useLatestMaintenanceRun } from '../../../../hooks/useDriveAutomation';

const LatestMaintenanceCard = () => {
  const { data: run, isLoading, isError } = useLatestMaintenanceRun();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-base-200 bg-base-100 p-5 h-[340px] animate-pulse flex flex-col gap-4">
        <div className="h-6 bg-base-200 rounded w-1/2"></div>
        <div className="h-4 bg-base-200 rounded w-1/3"></div>
        <div className="flex-1"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-5 flex flex-col items-center justify-center text-error text-center h-[340px]">
        <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
        <p className="text-sm font-medium">Unable to load latest maintenance run.</p>
      </div>
    );
  }

  if (run === null) {
    return (
      <div className="rounded-2xl border border-base-200 bg-base-100 p-5 flex flex-col items-center justify-center text-base-content/60 text-center h-[340px]">
        <p className="text-sm font-medium">No maintenance runs have been recorded yet.</p>
      </div>
    );
  }

  const isCompleted = run.status === 'completed';

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 p-5 flex flex-col h-full min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-base-content">Last Maintenance Run</h3>
        {isCompleted ? (
          <span className="badge badge-success gap-1 badge-sm font-medium">
            <CheckCircle className="w-3 h-3" /> Success
          </span>
        ) : (
          <span className="badge badge-error gap-1 badge-sm font-medium">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-base-content/60 mb-5 pb-4 border-b border-base-200">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {formatMaintenanceDateTime(run.ranAt)}
        </div>
        <div className="px-2 py-0.5 rounded-full bg-base-200 capitalize font-medium">
          {run.triggeredBy}
        </div>
      </div>

      {run.errorMessage && !isCompleted && (
        <div className="text-sm text-error bg-error/10 p-3 rounded-lg border border-error/20 mb-4">
          <span className="font-semibold block mb-1">Error</span>
          {run.errorMessage}
        </div>
      )}

      {run.result && (
        <>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-5 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-base-content/60">Prepared Dates</span>
              <span className="text-base font-semibold">{run.result.preparedDates}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-base-content/60">Prepared Account Folders</span>
              <span className="text-base font-semibold">{run.result.preparedAccountFolders}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-base-content/60">Created Date Folders</span>
              <span className="text-base font-semibold">{run.result.createdDateFolders}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-base-content/60">Created Account Folders</span>
              <span className="text-base font-semibold">{run.result.createdAccountFolders}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-base-content/60">Cleanup Candidates</span>
              <span className="text-base font-semibold">{run.result.cleanupCandidates}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-error/80">Deleted Old Folders</span>
              <span className="text-base font-semibold">{run.result.deletedFolders}</span>
            </div>
          </div>
          
          <div className="text-xs text-base-content/60 bg-base-200 p-3 rounded-lg mt-auto">
            <span className="block mb-1 font-medium text-base-content">Result Message</span>
            {run.result.message}
            {run.result.cutoffDate && (
              <span className="block mt-1 italic opacity-75">
                Cutoff Date: {formatMaintenanceDateTime(run.result.cutoffDate)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LatestMaintenanceCard;
