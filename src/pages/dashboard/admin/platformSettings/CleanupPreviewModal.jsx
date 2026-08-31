import React, { useState } from 'react';
import { formatDisplayDate } from '../../../../utils/dateTime';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCleanupExecute } from '../../../../hooks/useCleanup';

const CleanupPreviewModal = ({ previewData, isOpen, onClose }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutateAsync: executeCleanup, isPending: isExecuting } = useCleanupExecute();

  if (!isOpen || !previewData) return null;

  const { target, cutoff, eligibleCount, retentionDays, sample } = previewData;
  const isSync = target === 'syncHistory';

  const handleExecute = async () => {
    try {
      const result = await executeCleanup(target);
      toast.success(
        `${result.data.deletedCount ?? 0} ${isSync ? 'sync history' : 'posted post'} records deleted.`
      );
      onClose();
      setIsConfirming(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cleanup failed.');
    }
  };

  const renderSample = () => {
    if (!sample || sample.length === 0) return null;
    return (
      <div className="mt-4 border border-base-200 rounded-xl bg-base-200/30 overflow-hidden">
        <div className="bg-base-200/50 px-3 py-2 text-xs font-semibold text-base-content/70 border-b border-base-200">
          Sample Eligible Records (Up to 5)
        </div>
        <ul className="text-sm divide-y divide-base-200">
          {sample.map((item, index) => {
            const dateStr = item.createdAt || item.postedAt;
            const formattedDate = formatDisplayDate(dateStr, 'Unknown Date');
            return (
              <li key={item.id || item._id || index} className="px-3 py-2 flex items-center justify-between">
                <span className="capitalize">{item.status || 'unknown'}</span>
                <span className="text-base-content/60">{formattedDate}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-200">
          <h3 className="text-lg font-bold text-base-content">
            {isSync ? 'Sync History Cleanup' : 'Posted Posts Cleanup'}
          </h3>
          <button 
            onClick={onClose}
            disabled={isExecuting}
            className="btn btn-ghost btn-sm btn-square rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {eligibleCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-base-content/60" />
              </div>
              <h4 className="font-semibold">No eligible records</h4>
              <p className="text-sm text-base-content/60 mt-1">
                No records are currently eligible for cleanup.
              </p>
            </div>
          ) : !isConfirming ? (
            // Preview State
            <div>
              <p className="text-base-content mb-4 font-medium">
                {eligibleCount} {isSync ? 'sync history' : 'posted post'} records are eligible for deletion.
              </p>
              
              <div className="bg-base-200/50 rounded-xl p-3 text-sm space-y-1 mb-2 border border-base-200">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Retention:</span>
                  <span className="font-semibold">{retentionDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Older than:</span>
                  <span className="font-semibold">{formatDisplayDate(cutoff, 'Unknown')}</span>
                </div>
              </div>

              {renderSample()}
            </div>
          ) : (
            // Confirmation State
            <div>
              <div className="flex items-start gap-3 bg-error/10 text-error p-3 rounded-xl border border-error/20 mb-4">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold mb-1">Delete {eligibleCount} eligible {isSync ? 'sync history' : 'posted post'} records?</p>
                  <p className="opacity-90">This action cannot be undone.</p>
                </div>
              </div>

              <div className="text-sm text-base-content/70 space-y-2">
                <p>
                  Only {isSync ? 'finalized records' : 'records already marked as Posted and'} older than the configured retention period will be deleted.
                </p>
                <p className="font-medium text-base-content">
                  {isSync ? 'Running syncs are protected.' : 'Pending posts are protected.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-200 bg-base-50 flex justify-end gap-3">
          <button 
            className="btn btn-ghost rounded-xl"
            onClick={onClose}
            disabled={isExecuting}
          >
            {eligibleCount === 0 ? 'Close' : 'Cancel'}
          </button>
          
          {eligibleCount > 0 && (
            !isConfirming ? (
              <button 
                className="btn btn-error rounded-xl text-error-content"
                onClick={() => setIsConfirming(true)}
              >
                Delete Eligible Records
              </button>
            ) : (
              <button 
                className="btn btn-error rounded-xl text-error-content"
                onClick={handleExecute}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : null}
                {isExecuting ? 'Deleting...' : `Delete ${eligibleCount} Records`}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanupPreviewModal;
