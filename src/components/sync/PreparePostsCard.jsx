import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { getTodayDateBd } from '../../utils/getTodayDateBd';
import { getTomorrowDateBd } from '../../utils/getTomorrowDateBd';
import { useLatestSync } from '../../hooks/useLatestSync';
import LatestSyncCard from './LatestSyncCard';

const PreparePostsCard = () => {
  const [targetDate, setTargetDate] = useState(getTodayDateBd());
  const axiosSecure = useAxiosSecure();

  const queryClient = useQueryClient();
  const { data: latestSyncData } = useLatestSync();

  const latestRun = latestSyncData?.runs?.[0];
  const isSyncRunning = latestRun?.status === 'running';

  const syncMutation = useMutation({
    mutationFn: async (dateToSync) => {
      const response = await axiosSecure.post('/api/sync/prepare', { targetDate: dateToSync });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestSync'] });
    }
  });

  const handleSync = () => {
    if (!targetDate || isSyncRunning) return;
    syncMutation.mutate(targetDate);
  };

  const handleSyncTomorrow = () => {
    if (isSyncRunning) return;
    const tomorrow = getTomorrowDateBd();
    syncMutation.mutate(tomorrow);
  };

  const isPending = syncMutation.isPending;
  const isError = syncMutation.isError;
  const isSuccess = syncMutation.isSuccess;
  const error = syncMutation.error;
  const data = syncMutation.data;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <h2 className="card-title">Prepare Posts</h2>
        <p className="text-sm text-base-content/70 mb-4">
          Prepare scheduled posts through the PostFlow automation workflow.
        </p>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Select Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full max-w-xs"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isPending || isSyncRunning}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="btn btn-primary"
            onClick={handleSync}
            disabled={isPending || isSyncRunning || !targetDate}
          >
            {isPending ? <span className="loading loading-spinner"></span> : null}
            {isPending ? 'Preparing...' : isSyncRunning ? 'Sync in Progress...' : 'Sync / Prepare Posts'}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={handleSyncTomorrow}
            disabled={isPending || isSyncRunning}
          >
            Sync Tomorrow's Posts
          </button>
        </div>

        {/* Status Messages */}
        <div className="mt-4">
          {isSuccess && data && (
            <div className="alert alert-success shadow-sm">
              <div>
                <h3 className="font-bold">{data.message || 'Sync request received'}</h3>
                <div className="text-xs">{data.targetDate}</div>
              </div>
            </div>
          )}

          {isError && (
            <div className="alert alert-error shadow-sm">
              <span>{error?.response?.data?.message || 'Could not prepare posts. Please try again.'}</span>
            </div>
          )}
        </div>

        <LatestSyncCard />
      </div>
    </div>
  );
};

export default PreparePostsCard;
