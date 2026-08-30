import React from 'react';

const AutoSyncPolicyCard = ({ localData, setLocalData, originalData }) => {
  const policy = localData.autoSync;
  const originalPolicy = originalData.autoSync;
  
  const isDirty = policy.enabled !== originalPolicy.enabled;

  const handleEnabledChange = (e) => {
    setLocalData(prev => ({
      ...prev,
      autoSync: {
        ...prev.autoSync,
        enabled: e.target.checked
      }
    }));
  };

  return (
    <div className={`rounded-2xl border ${isDirty ? 'border-primary/40 shadow-sm bg-base-100' : 'border-base-200 bg-base-100'} p-5 transition-all flex flex-col h-full`}>
      <h3 className="text-lg font-semibold text-base-content">Auto Sync</h3>
      <p className="text-sm text-base-content/60 mt-1 mb-5">
        Automatically check and prepare scheduled posts on the background schedule.
      </p>

      <div className="flex flex-col gap-5">
        <label className="flex items-center gap-3 cursor-pointer w-max">
          <input 
            type="checkbox" 
            className="toggle toggle-primary toggle-sm"
            checked={policy.enabled}
            onChange={handleEnabledChange}
          />
          <span className="font-medium text-sm text-base-content">
            Enable automatic sync
          </span>
        </label>

        <div className="p-3 rounded-lg bg-base-200/50 border border-base-200/60 mt-2">
          {policy.enabled ? (
            <p className="text-sm font-medium text-base-content/80">
              Automatic scheduled sync is active.
            </p>
          ) : (
            <p className="text-sm text-base-content/70">
              Automatic scheduled sync is paused. Manual Sync / Prepare Posts still works.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoSyncPolicyCard;
