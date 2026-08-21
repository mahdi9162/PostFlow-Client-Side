import React, { useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStaleSyncResolve } from '../../../../hooks/useStaleSyncs';

const StaleSyncPreviewModal = ({ previewData, isOpen, onClose }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutateAsync: executeResolve, isPending: isExecuting } = useStaleSyncResolve();

  if (!isOpen || !previewData) return null;

  const { cutoff, staleCount, sample, timeoutMinutes } = previewData;

  const handleResolve = async () => {
    try {
      const result = await executeResolve();
      toast.success(`${result.resolvedCount ?? 0} stale syncs marked as incomplete.`);
      onClose();
      setIsConfirming(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to resolve stale syncs.');
    }
  };

  const handleClose = () => {
    setIsConfirming(false);
    onClose();
  };

  const renderSample = () => {
    if (!sample || sample.length === 0) return null;
    return (
      <div className="mt-4 border border-base-200 rounded-xl bg-base-200/30 overflow-hidden">
        <div className="bg-base-200/50 px-3 py-2 text-xs font-semibold text-base-content/70 border-b border-base-200">
          Sample Stale Records (Up to 5)
        </div>
        <ul className="text-sm divide-y divide-base-200">
          {sample.map((item, index) => {
            const dateStr = item.createdAt;
            const formattedDate = dateStr ? format(new Date(dateStr), 'MMM d, yyyy h:mm a') : 'Unknown Date';
            return (
              <li key={item.id || index} className="px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-medium text-base-content/90">Target: {item.targetDate || 'unknown'}</span>
                <div className="flex flex-col sm:items-end text-xs text-base-content/60">
                  <span>Started: {formattedDate}</span>
                  <span>By: {item.triggeredBy}</span>
                </div>
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
            Stale Running Syncs
          </h3>
          <button 
            onClick={handleClose}
            disabled={isExecuting}
            className="btn btn-ghost btn-sm btn-square rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {staleCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-base-content/60" />
              </div>
              <h4 className="font-semibold">No stale running syncs found.</h4>
              <p className="text-sm text-base-content/60 mt-1">
                All sync runs are currently healthy or have already been resolved.
              </p>
            </div>
          ) : !isConfirming ? (
            // Preview State
            <div>
              <p className="text-base-content mb-4 font-medium">
                {staleCount} stale running {staleCount === 1 ? 'sync is' : 'syncs are'} found.
              </p>
              
              <div className="bg-base-200/50 rounded-xl p-3 text-sm space-y-1 mb-2 border border-base-200">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Timeout:</span>
                  <span className="font-semibold">{timeoutMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Started before:</span>
                  <span className="font-semibold">{cutoff ? format(new Date(cutoff), 'MMM d, yyyy h:mm a') : 'Unknown'}</span>
                </div>
              </div>

              {renderSample()}
            </div>
          ) : (
            // Confirmation State
            <div>
              <div className="flex items-start gap-3 bg-warning/10 text-warning-content p-3 rounded-xl border border-warning/20 mb-4">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-warning" />
                <div className="text-sm">
                  <p className="font-bold mb-1">Resolve {staleCount} stale running {staleCount === 1 ? 'sync' : 'syncs'}?</p>
                  <p className="opacity-90">This action cannot be undone automatically.</p>
                </div>
              </div>

              <div className="text-sm text-base-content/70 space-y-2">
                <p>
                  These sync runs will be marked as Incomplete because they exceeded the configured running timeout.
                </p>
                <p>
                  They will <span className="font-semibold text-base-content">not be deleted</span>. Their history will remain available and normal retention rules may remove them later.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-200 bg-base-50 flex justify-end gap-3">
          <button 
            className="btn btn-ghost rounded-xl"
            onClick={handleClose}
            disabled={isExecuting}
          >
            {staleCount === 0 ? 'Close' : 'Cancel'}
          </button>
          
          {staleCount > 0 && (
            !isConfirming ? (
              <button 
                className="btn btn-warning rounded-xl"
                onClick={() => setIsConfirming(true)}
              >
                Resolve {staleCount} Syncs
              </button>
            ) : (
              <button 
                className="btn btn-warning rounded-xl"
                onClick={handleResolve}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : null}
                {isExecuting ? 'Resolving...' : `Resolve ${staleCount} Syncs`}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default StaleSyncPreviewModal;
