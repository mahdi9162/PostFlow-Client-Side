import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccounts } from '../../../../hooks/useAccounts';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { Users, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const INTERVAL_PRESETS = [
  { value: 15, label: '15 Minutes' },
  { value: 30, label: '30 Minutes' },
  { value: 60, label: '1 Hour (60 min)' },
  { value: 120, label: '2 Hours (120 min)' },
  { value: 180, label: '3 Hours (180 min)' },
  { value: 240, label: '4 Hours (240 min)' },
  { value: 360, label: '6 Hours (360 min)' },
  { value: 720, label: '12 Hours (720 min)' },
  { value: 1440, label: '24 Hours (1440 min)' },
];

const AccountLeadRow = ({ account, onUpdateAccount, isUpdating }) => {
  const lf = account.leadFinder || {
    enabled: false,
    dailyLeadTarget: 20,
    releaseBatchSize: 10,
    releaseIntervalMinutes: 180,
  };

  const [localLf, setLocalLf] = useState(lf);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalLf(
      account.leadFinder || {
        enabled: false,
        dailyLeadTarget: 20,
        releaseBatchSize: 10,
        releaseIntervalMinutes: 180,
      }
    );
  }, [account]);

  const isDirty =
    localLf.enabled !== lf.enabled ||
    localLf.dailyLeadTarget !== lf.dailyLeadTarget ||
    localLf.releaseBatchSize !== lf.releaseBatchSize ||
    localLf.releaseIntervalMinutes !== lf.releaseIntervalMinutes;

  const validate = () => {
    const target = Number(localLf.dailyLeadTarget);
    const batch = Number(localLf.releaseBatchSize);
    const interval = Number(localLf.releaseIntervalMinutes);

    if (!Number.isInteger(target) || target < 0 || target > 500) {
      return 'Daily lead target must be an integer between 0 and 500.';
    }
    if (!Number.isInteger(batch) || batch < 1 || batch > 100) {
      return 'Release batch size must be an integer between 1 and 100.';
    }
    if (target > 0 && batch > target) {
      return 'Release batch size cannot exceed daily lead target.';
    }
    if (!Number.isInteger(interval) || interval < 15 || interval > 1440) {
      return 'Release interval must be between 15 and 1440 minutes.';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setError(null);

    await onUpdateAccount(account._id, {
      leadFinder: {
        enabled: localLf.enabled,
        dailyLeadTarget: Number(localLf.dailyLeadTarget),
        releaseBatchSize: Number(localLf.releaseBatchSize),
        releaseIntervalMinutes: Number(localLf.releaseIntervalMinutes),
      },
    });
  };

  return (
    <tr className={`hover:bg-base-200/20 transition-colors ${isDirty ? 'bg-primary/5' : ''}`}>
      {/* Account Info */}
      <td className="py-4 px-6">
        <div className="font-semibold text-base-content text-sm">{account.displayName}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="badge badge-ghost font-mono text-xs">{account.slug}</span>
          {!account.isActive && (
            <span className="badge badge-warning badge-xs text-[10px]">Inactive Account</span>
          )}
        </div>
      </td>

      {/* Enabled Toggle */}
      <td className="py-4 px-4 text-center">
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-sm"
          checked={localLf.enabled}
          onChange={(e) => setLocalLf((prev) => ({ ...prev, enabled: e.target.checked }))}
        />
      </td>

      {/* Daily Lead Target */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1 max-w-[130px]">
          <input
            type="number"
            min="0"
            max="500"
            className="input input-bordered input-sm rounded-xl font-medium w-full"
            value={localLf.dailyLeadTarget}
            onChange={(e) =>
              setLocalLf((prev) => ({ ...prev, dailyLeadTarget: e.target.value }))
            }
          />
          <span className="text-[10px] text-base-content/50">
            {Number(localLf.dailyLeadTarget) === 0 ? '0 = Disabled' : 'leads/day'}
          </span>
        </div>
      </td>

      {/* Release Batch Size */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1 max-w-[120px]">
          <input
            type="number"
            min="1"
            max="100"
            className="input input-bordered input-sm rounded-xl font-medium w-full"
            value={localLf.releaseBatchSize}
            onChange={(e) =>
              setLocalLf((prev) => ({ ...prev, releaseBatchSize: e.target.value }))
            }
          />
          <span className="text-[10px] text-base-content/50">per release</span>
        </div>
      </td>

      {/* Release Interval */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1 min-w-[150px]">
          <select
            className="select select-bordered select-sm rounded-xl font-medium w-full text-xs"
            value={localLf.releaseIntervalMinutes}
            onChange={(e) =>
              setLocalLf((prev) => ({
                ...prev,
                releaseIntervalMinutes: parseInt(e.target.value, 10),
              }))
            }
          >
            {INTERVAL_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
            {!INTERVAL_PRESETS.some((p) => p.value === Number(localLf.releaseIntervalMinutes)) && (
              <option value={localLf.releaseIntervalMinutes}>
                {localLf.releaseIntervalMinutes} min (Custom)
              </option>
            )}
          </select>
          <span className="text-[10px] text-base-content/50">interval in minutes</span>
        </div>
      </td>

      {/* Save Action */}
      <td className="py-4 px-6 text-right">
        {isDirty ? (
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="btn btn-primary btn-sm rounded-xl gap-1 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        ) : (
          <span className="text-xs text-base-content/40 inline-flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Saved
          </span>
        )}
        {error && (
          <p className="text-[10px] text-error mt-1 flex items-center justify-end gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </td>
    </tr>
  );
};

const LeadTargetAccountsSection = () => {
  const { accounts, isLoading, isError } = useAccounts();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdateAccount = async (id, payload) => {
    setUpdatingId(id);
    try {
      await axiosSecure.patch(`/api/accounts/${id}`, payload);
      toast.success('Account lead settings saved.');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update account settings.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4 mt-10">
      <div className="flex flex-col gap-1 border-b border-base-200 pb-4">
        <h2 className="text-xl font-semibold text-base-content flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Target Instagram Accounts Lead Limits
        </h2>
        <p className="text-sm text-base-content/60">
          Configure independent lead generation quotas, release batch sizes, and pacing intervals for every managed Instagram account.
        </p>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="p-8 text-center text-base-content/60">Loading target accounts...</div>
        ) : isError ? (
          <div className="p-8 text-center text-error">Failed to load target accounts.</div>
        ) : !accounts || accounts.length === 0 ? (
          <div className="p-8 text-center text-base-content/60">
            No Instagram accounts found. Register an account in Account Manager to configure lead settings.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/40 text-base-content uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-4 px-6">Account</th>
                  <th className="py-4 px-4 text-center">Lead Finder</th>
                  <th className="py-4 px-4">Daily Target</th>
                  <th className="py-4 px-4">Batch Size</th>
                  <th className="py-4 px-4">Release Interval</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {accounts.map((acc) => (
                  <AccountLeadRow
                    key={acc._id}
                    account={acc}
                    onUpdateAccount={handleUpdateAccount}
                    isUpdating={updatingId === acc._id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTargetAccountsSection;
