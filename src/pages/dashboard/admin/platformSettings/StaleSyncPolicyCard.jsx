import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStaleSyncPreview } from '../../../../hooks/useStaleSyncs';
import StaleSyncPreviewModal from './StaleSyncPreviewModal';

const StaleSyncPolicyCard = ({ localData, setLocalData, originalData, isSettingsDirty }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const policy = localData.sync.staleRun;
  const originalPolicy = originalData.sync.staleRun;
  
  const isDirty = policy.enabled !== originalPolicy.enabled || policy.timeoutMinutes !== originalPolicy.timeoutMinutes;
  
  // Checking dirty state for the whole settings page blocks preview
  const isDisabledByDirty = isSettingsDirty;
  const isDisabledByRetention = !originalPolicy.enabled; // Backend uses saved original state
  
  const { mutateAsync: fetchPreview, isPending } = useStaleSyncPreview();

  const handleEnabledChange = (e) => {
    setLocalData(prev => ({
      ...prev,
      sync: {
        ...prev.sync,
        staleRun: {
          ...prev.sync.staleRun,
          enabled: e.target.checked
        }
      }
    }));
  };

  const handleTimeoutChange = (e) => {
    const val = e.target.value;
    
    // Allow empty string temporarily for editing
    if (val === '') {
      setLocalData(prev => ({
        ...prev,
        sync: { ...prev.sync, staleRun: { ...prev.sync.staleRun, timeoutMinutes: '' } }
      }));
      setErrorMsg('Required field.');
      return;
    }

    const num = Number(val);
    let newError = null;

    if (!Number.isInteger(num) || num < 5 || num > 1440) {
      newError = 'Enter a whole number between 5 and 1440 minutes.';
    }

    setLocalData(prev => ({
      ...prev,
      sync: { ...prev.sync, staleRun: { ...prev.sync.staleRun, timeoutMinutes: val } }
    }));
    setErrorMsg(newError);
  };

  const handlePreview = async () => {
    try {
      const data = await fetchPreview();
      setPreviewData(data);
      setIsPreviewOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to check stale syncs.');
    }
  };

  const isPreviewDisabled = isDisabledByDirty || isDisabledByRetention || isPending;

  return (
    <>
      <div className={`rounded-2xl border ${isDirty ? 'border-primary/40 shadow-sm bg-base-100' : 'border-base-200 bg-base-100'} p-5 transition-all flex flex-col justify-between h-full`}>
        <div>
          <h3 className="text-lg font-semibold text-base-content">Stale Running Syncs</h3>
          <p className="text-sm text-base-content/60 mt-1 mb-5">
            Automatically mark sync runs as incomplete if they remain stuck in the running state beyond the configured timeout.
          </p>

          <div className="flex flex-col gap-5 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-sm"
                checked={policy.enabled}
                onChange={handleEnabledChange}
              />
              <span className="font-medium text-sm text-base-content">
                Auto-resolve stale running syncs
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Mark as incomplete after
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className={`input input-bordered w-full max-w-[120px] ${errorMsg ? 'input-error' : ''}`}
                  value={policy.timeoutMinutes}
                  onChange={handleTimeoutChange}
                  min="5"
                  max="1440"
                  step="1"
                />
                <span className="text-sm text-base-content/50">minutes</span>
              </div>
              {errorMsg && (
                <p className="text-xs text-error mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </p>
              )}
            </div>
            
            <p className="text-xs text-base-content/50 italic">
              Only syncs still in the Running state are affected. Completed or otherwise finalized syncs are never changed. Normal syncs typically finish within a few minutes, so 30 minutes provides a safe default.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-base-200 mt-4">
          <button 
            className="btn btn-outline rounded-xl self-start"
            onClick={handlePreview}
            disabled={isPreviewDisabled}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : null}
            {isPending ? 'Checking...' : 'Preview Stale Syncs'}
          </button>

          {/* Validation Messages */}
          {isDisabledByDirty && (
            <p className="text-xs font-medium text-warning bg-warning/10 p-2 rounded-lg border border-warning/20">
              Save your platform settings before checking stale syncs.
            </p>
          )}
          
          {!isDisabledByDirty && isDisabledByRetention && (
            <p className="text-xs font-medium text-base-content/60 bg-base-200 p-2 rounded-lg border border-base-300">
              Auto-resolution is disabled. Enable and save it first.
            </p>
          )}
        </div>
      </div>

      <StaleSyncPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        previewData={previewData} 
      />
    </>
  );
};

export default StaleSyncPolicyCard;
