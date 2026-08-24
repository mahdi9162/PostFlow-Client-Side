import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const DriveAutomationPolicyCard = ({ localData, setLocalData, originalData }) => {
  const [prepareErrorMsg, setPrepareErrorMsg] = useState(null);
  const [cleanupErrorMsg, setCleanupErrorMsg] = useState(null);

  const policy = localData.driveAutomation;
  const originalPolicy = originalData.driveAutomation;
  
  const isDirty = 
    policy.enabled !== originalPolicy.enabled || 
    policy.prepareDaysAhead !== originalPolicy.prepareDaysAhead ||
    policy.cleanupEnabled !== originalPolicy.cleanupEnabled ||
    policy.deleteFoldersOlderThanDays !== originalPolicy.deleteFoldersOlderThanDays;

  const handleEnabledChange = (e) => {
    setLocalData(prev => ({
      ...prev,
      driveAutomation: {
        ...prev.driveAutomation,
        enabled: e.target.checked
      }
    }));
  };

  const handleCleanupEnabledChange = (e) => {
    setLocalData(prev => ({
      ...prev,
      driveAutomation: {
        ...prev.driveAutomation,
        cleanupEnabled: e.target.checked
      }
    }));
  };

  const handlePrepareDaysChange = (e) => {
    const val = e.target.value;
    
    if (val === '') {
      setLocalData(prev => ({
        ...prev,
        driveAutomation: { ...prev.driveAutomation, prepareDaysAhead: '' }
      }));
      setPrepareErrorMsg('Required field.');
      return;
    }

    const num = Number(val);
    let newError = null;

    if (!Number.isInteger(num) || num < 1 || num > 90) {
      newError = 'Enter a whole number between 1 and 90.';
    }

    setLocalData(prev => ({
      ...prev,
      driveAutomation: { ...prev.driveAutomation, prepareDaysAhead: val }
    }));
    setPrepareErrorMsg(newError);
  };

  const handleCleanupDaysChange = (e) => {
    const val = e.target.value;
    
    if (val === '') {
      setLocalData(prev => ({
        ...prev,
        driveAutomation: { ...prev.driveAutomation, deleteFoldersOlderThanDays: '' }
      }));
      setCleanupErrorMsg('Required field.');
      return;
    }

    const num = Number(val);
    let newError = null;

    if (!Number.isInteger(num) || num < 1 || num > 90) {
      newError = 'Enter a whole number between 1 and 90.';
    }

    setLocalData(prev => ({
      ...prev,
      driveAutomation: { ...prev.driveAutomation, deleteFoldersOlderThanDays: val }
    }));
    setCleanupErrorMsg(newError);
  };

  return (
    <div className={`rounded-2xl border ${isDirty ? 'border-primary/40 shadow-sm bg-base-100' : 'border-base-200 bg-base-100'} p-5 transition-all flex flex-col justify-between h-full`}>
      <div>
        <h3 className="text-lg font-semibold text-base-content">Google Drive Automation</h3>
        <p className="text-sm text-base-content/60 mt-1 mb-5">
          Configure how far ahead daily and account folders are prepared, and when old empty folders are cleaned up.
        </p>

        <div className="flex flex-col gap-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="toggle toggle-primary toggle-sm"
              checked={policy.enabled}
              onChange={handleEnabledChange}
            />
            <span className="font-medium text-sm text-base-content">
              Enable Drive Automation
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-2">
              Prepare folders ahead
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                className={`input input-bordered w-full max-w-[120px] ${prepareErrorMsg ? 'input-error' : ''}`}
                value={policy.prepareDaysAhead}
                onChange={handlePrepareDaysChange}
                disabled={!policy.enabled}
                min="1"
                max="90"
                step="1"
              />
              <span className="text-sm text-base-content/50">days</span>
            </div>
            {prepareErrorMsg && (
              <p className="text-xs text-error mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {prepareErrorMsg}
              </p>
            )}
          </div>

          <div className="border-t border-base-200 pt-5 mt-2">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-sm"
                checked={policy.cleanupEnabled}
                onChange={handleCleanupEnabledChange}
                disabled={!policy.enabled}
              />
              <span className={`font-medium text-sm ${!policy.enabled ? 'text-base-content/40' : 'text-base-content'}`}>
                Enable old folder cleanup
              </span>
            </label>

            <div>
              <label className={`block text-sm font-medium mb-2 ${!policy.enabled || !policy.cleanupEnabled ? 'text-base-content/40' : 'text-base-content/80'}`}>
                Delete folders older than
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className={`input input-bordered w-full max-w-[120px] ${cleanupErrorMsg ? 'input-error' : ''}`}
                  value={policy.deleteFoldersOlderThanDays}
                  onChange={handleCleanupDaysChange}
                  disabled={!policy.enabled || !policy.cleanupEnabled}
                  min="1"
                  max="90"
                  step="1"
                />
                <span className={`text-sm ${!policy.enabled || !policy.cleanupEnabled ? 'text-base-content/30' : 'text-base-content/50'}`}>
                  days
                </span>
              </div>
              {cleanupErrorMsg && (
                <p className="text-xs text-error mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {cleanupErrorMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveAutomationPolicyCard;
