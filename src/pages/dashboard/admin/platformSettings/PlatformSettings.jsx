import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlatformSettings } from '../../../../hooks/usePlatformSettings';
import { useMe } from '../../../../hooks/useMe';
import CleanupPolicyCard from './CleanupPolicyCard';
import StaleSyncPolicyCard from './StaleSyncPolicyCard';
import LatestMaintenanceCard from './LatestMaintenanceCard';
import DriveAutomationPolicyCard from './DriveAutomationPolicyCard';

const RetentionPolicyCard = ({ title, description, targetType, localData, setLocalData, originalData }) => {
  const [errorMsg, setErrorMsg] = useState(null);

  const policy = localData.retention[targetType];
  const originalPolicy = originalData.retention[targetType];
  
  const isDirty = policy.enabled !== originalPolicy.enabled || policy.retentionDays !== originalPolicy.retentionDays;

  const handleEnabledChange = (e) => {
    setLocalData(prev => ({
      ...prev,
      retention: {
        ...prev.retention,
        [targetType]: {
          ...prev.retention[targetType],
          enabled: e.target.checked
        }
      }
    }));
  };

  const handleDaysChange = (e) => {
    const val = e.target.value;
    
    // Allow empty string temporarily for editing
    if (val === '') {
      setLocalData(prev => ({
        ...prev,
        retention: { ...prev.retention, [targetType]: { ...prev.retention[targetType], retentionDays: '' } }
      }));
      setErrorMsg('Required field.');
      return;
    }

    const num = Number(val);
    let newError = null;

    if (!Number.isInteger(num) || num < 1 || num > 3650) {
      newError = 'Enter a whole number between 1 and 3650 days.';
    }

    setLocalData(prev => ({
      ...prev,
      retention: { ...prev.retention, [targetType]: { ...prev.retention[targetType], retentionDays: val } }
    }));
    setErrorMsg(newError);
  };

  return (
    <div className={`rounded-2xl border ${isDirty ? 'border-primary/40 shadow-sm bg-base-100' : 'border-base-200 bg-base-100'} p-5 transition-all`}>
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      <p className="text-sm text-base-content/60 mt-1 mb-5">{description}</p>

      <div className="flex flex-col gap-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="toggle toggle-primary toggle-sm"
            checked={policy.enabled}
            onChange={handleEnabledChange}
          />
          <span className="font-medium text-sm text-base-content">
            {targetType === 'syncHistory' ? 'Auto-delete old sync history' : 'Auto-delete old posted posts'}
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-base-content/80 mb-2">
            Keep {targetType === 'syncHistory' ? 'sync history' : 'posted posts'} for (days)
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              className={`input input-bordered w-full max-w-[120px] ${errorMsg ? 'input-error' : ''}`}
              value={policy.retentionDays}
              onChange={handleDaysChange}
              min="1"
              max="3650"
              step="1"
            />
            <span className="text-sm text-base-content/50">days</span>
          </div>
          {errorMsg && (
            <p className="text-xs text-error mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const PlatformSettings = () => {
  const { isAdmin, isCreator } = useMe();
  const { data: serverData, isLoading, isError, updateSettingsAsync, isUpdating } = usePlatformSettings();
  const [localData, setLocalData] = useState(null);

  // Initialize local data when server data arrives
  useEffect(() => {
    if (serverData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalData({
        retention: {
          syncHistory: {
            enabled: serverData.retention?.syncHistory?.enabled ?? false,
            retentionDays: serverData.retention?.syncHistory?.retentionDays ?? 90,
          },
          posts: {
            enabled: serverData.retention?.posts?.enabled ?? false,
            retentionDays: serverData.retention?.posts?.retentionDays ?? 90,
          },
        },
        sync: {
          staleRun: {
            enabled: serverData.sync?.staleRun?.enabled ?? true,
            timeoutMinutes: serverData.sync?.staleRun?.timeoutMinutes ?? 30,
          }
        },
        driveAutomation: {
          enabled: serverData.driveAutomation?.enabled ?? true,
          prepareDaysAhead: serverData.driveAutomation?.prepareDaysAhead ?? 30,
          cleanupEnabled: serverData.driveAutomation?.cleanupEnabled ?? true,
          deleteFoldersOlderThanDays: serverData.driveAutomation?.deleteFoldersOlderThanDays ?? 7,
        }
      });
    }
  }, [serverData]);

  if (!isAdmin && !isCreator) {
    return <div className="p-6 text-center text-error">You do not have permission to view platform settings.</div>;
  }

  if (isLoading || !localData) {
    return (
      <div className="w-full space-y-6">
        <div className="h-8 bg-base-200 animate-pulse rounded w-1/4"></div>
        <div className="h-4 bg-base-200 animate-pulse rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-base-200 animate-pulse rounded-2xl"></div>
          <div className="h-48 bg-base-200 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-error">
        <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
        <h2 className="text-xl font-semibold">Unable to load platform settings.</h2>
      </div>
    );
  }

  const getNormalizedData = () => {
    return {
      retention: {
        syncHistory: {
          enabled: Boolean(localData.retention.syncHistory.enabled),
          retentionDays: Number(localData.retention.syncHistory.retentionDays),
        },
        posts: {
          enabled: Boolean(localData.retention.posts.enabled),
          retentionDays: Number(localData.retention.posts.retentionDays),
        },
      },
      sync: {
        staleRun: {
          enabled: Boolean(localData.sync.staleRun.enabled),
          timeoutMinutes: Number(localData.sync.staleRun.timeoutMinutes),
        }
      },
      driveAutomation: {
        enabled: Boolean(localData.driveAutomation.enabled),
        prepareDaysAhead: Number(localData.driveAutomation.prepareDaysAhead),
        cleanupEnabled: Boolean(localData.driveAutomation.cleanupEnabled),
        deleteFoldersOlderThanDays: Number(localData.driveAutomation.deleteFoldersOlderThanDays),
      }
    };
  };

  const isFormValid = () => {
    const s = Number(localData.retention.syncHistory.retentionDays);
    const p = Number(localData.retention.posts.retentionDays);
    const t = Number(localData.sync.staleRun.timeoutMinutes);
    const pd = Number(localData.driveAutomation.prepareDaysAhead);
    const cd = Number(localData.driveAutomation.deleteFoldersOlderThanDays);
    return Number.isInteger(s) && s >= 1 && s <= 3650 &&
           Number.isInteger(p) && p >= 1 && p <= 3650 &&
           Number.isInteger(t) && t >= 5 && t <= 1440 &&
           Number.isInteger(pd) && pd >= 1 && pd <= 90 &&
           Number.isInteger(cd) && cd >= 1 && cd <= 90;
  };

  // Derive original normalized data to detect dirtiness safely
  const originalData = {
    retention: {
      syncHistory: {
        enabled: serverData.retention?.syncHistory?.enabled ?? false,
        retentionDays: serverData.retention?.syncHistory?.retentionDays ?? 90,
      },
      posts: {
        enabled: serverData.retention?.posts?.enabled ?? false,
        retentionDays: serverData.retention?.posts?.retentionDays ?? 90,
      }
    },
    sync: {
      staleRun: {
        enabled: serverData.sync?.staleRun?.enabled ?? true,
        timeoutMinutes: serverData.sync?.staleRun?.timeoutMinutes ?? 30,
      }
    },
    driveAutomation: {
      enabled: serverData.driveAutomation?.enabled ?? true,
      prepareDaysAhead: serverData.driveAutomation?.prepareDaysAhead ?? 30,
      cleanupEnabled: serverData.driveAutomation?.cleanupEnabled ?? true,
      deleteFoldersOlderThanDays: serverData.driveAutomation?.deleteFoldersOlderThanDays ?? 7,
    }
  };

  const isDirty = JSON.stringify(getNormalizedData()) !== JSON.stringify(originalData);
  const canSave = isDirty && isFormValid() && !isUpdating;

  const handleSave = async () => {
    if (!canSave) return;
    
    try {
      const payload = getNormalizedData();
      await updateSettingsAsync(payload);
      toast.success('Platform settings updated.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save platform settings.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-base-200 pb-5">
        <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Platform Settings
        </h1>
        <p className="text-sm text-base-content/60">
          Manage PostFlow platform-level retention preferences.
        </p>
        <div className="mt-2 text-xs bg-primary/5 text-primary px-3 py-2 rounded-lg inline-flex items-center w-fit border border-primary/10">
          Automatic cleanup only runs when a retention policy is enabled.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RetentionPolicyCard 
          title="Sync History Retention"
          description="Automatically remove old finalized sync history records after the configured retention period. Only finalized sync runs are eligible. Running syncs are never deleted."
          targetType="syncHistory"
          localData={localData}
          setLocalData={setLocalData}
          originalData={originalData}
        />

        <RetentionPolicyCard 
          title="Post Retention"
          description="Automatically remove old posted post records after the configured retention period. Only posts already marked as Posted are eligible. Pending posts are never deleted."
          targetType="posts"
          localData={localData}
          setLocalData={setLocalData}
          originalData={originalData}
        />

        <StaleSyncPolicyCard 
          localData={localData}
          setLocalData={setLocalData}
          originalData={originalData}
          isSettingsDirty={isDirty}
        />
      </div>

      {/* Data Cleanup Section */}
      <div className="flex flex-col gap-2 border-b border-base-200 pb-5 mt-10">
        <h2 className="text-xl font-semibold text-base-content">Data Cleanup</h2>
        <p className="text-sm text-base-content/60">
          Manually preview and run the currently saved retention policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CleanupPolicyCard 
          title="Sync History Cleanup"
          description="Preview and remove finalized sync history older than the configured retention period."
          targetType="syncHistory"
          isRetentionDirty={isDirty}
          isRetentionEnabled={originalData.retention.syncHistory.enabled}
        />

        <CleanupPolicyCard 
          title="Posted Posts Cleanup"
          description="Preview and remove posted PostFlow records older than the configured retention period."
          targetType="posts"
          isRetentionDirty={isDirty}
          isRetentionEnabled={originalData.retention.posts.enabled}
        />
      </div>

      {/* Drive Automation Section */}
      <div className="flex flex-col gap-2 border-b border-base-200 pb-5 mt-10">
        <h2 className="text-xl font-semibold text-base-content">Drive Automation</h2>
        <p className="text-sm text-base-content/60">
          Settings and logs for automated Google Drive folder maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DriveAutomationPolicyCard 
          localData={localData}
          setLocalData={setLocalData}
          originalData={originalData}
        />
        <LatestMaintenanceCard />
      </div>

      {/* Footer Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100/90 backdrop-blur border-t border-base-200 p-4 shadow-lg z-50 flex items-center justify-between lg:pl-72">
        <div className="text-sm font-medium">
          {isDirty ? (
            <span className="text-warning flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Unsaved changes
            </span>
          ) : (
            <span className="text-base-content/50">Settings are up to date</span>
          )}
        </div>
        <button 
          className="btn btn-primary min-w-[140px]"
          onClick={handleSave}
          disabled={!canSave}
        >
          {isUpdating ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;
