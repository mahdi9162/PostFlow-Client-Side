import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import AccountTagGroupsPanel from './components/AccountTagGroupsPanel';
import HashtagGroupModal from './components/HashtagGroupModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMe } from '../../../hooks/useMe';
import LoadingState from '../../../components/common/LoadingState';
import ErrorState from '../../../components/common/ErrorState';

const accounts = [
  { value: 'snortpugs', label: 'Snortpugs' },
  { value: 'pugsnortz', label: 'Pugsnortz' },
  { value: 'pugsnuff', label: 'Pugsnuff' },
];

const AccountHashtagsManager = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const addModalRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const { isAdmin, isLoading: roleLoading, isError: roleError } = useMe();

  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['hashtagGroups', selectedAccount],
    enabled: Boolean(selectedAccount),
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/hashtagGroups?accountId=${selectedAccount}`);
      return res.data;
    },
  });

  if (roleLoading) {
    return <LoadingState />;
  }

  if (roleError) {
    return <ErrorState message="Failed to load user permissions." />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const statsUnavailable = isLoading || isError;
  const totalGroups = statsUnavailable ? '—' : groups.length;
  const enabledGroups = statsUnavailable ? '—' : groups.filter((g) => g.enabled).length;

  const openAddModal = () => {
    addModalRef.current?.showModal();
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 min-h-screen bg-base-200/30">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">Hashtag Groups Manager</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted max-w-[58ch] leading-relaxed">
            Manage saved hashtag groups per account. The system will automatically rotate through enabled groups.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-base-100 p-2 sm:p-3 rounded-2xl border border-base-200 shadow-sm">
          <select
            className="select select-bordered select-sm sm:select-md rounded-xl text-sm min-w-[160px] font-semibold"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Account
            </option>
            {accounts.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          
          {selectedAccount && (
            <button onClick={openAddModal} className="btn btn-primary btn-sm sm:btn-md rounded-xl px-6">
              ＋ Add Group
            </button>
          )}
        </div>
      </div>

      {selectedAccount ? (
        <>
          <div className="mb-4 flex items-center justify-between px-2">
            <p className="text-sm font-semibold text-base-content/70">
              <span className="text-base-content font-bold">{totalGroups}</span> Groups · <span className="text-success font-bold">{enabledGroups}</span> Enabled
            </p>
          </div>

          <AccountTagGroupsPanel 
            selectedAccount={selectedAccount} 
            groups={groups} 
            isLoading={isLoading} 
            isError={isError} 
            accounts={accounts}
          />
        </>
      ) : (
        <div className="mt-10 bg-base-100 rounded-3xl p-10 text-center shadow-sm border border-base-200 flex flex-col items-center justify-center">
          <span className="text-4xl mb-4 opacity-50">📱</span>
          <h3 className="text-xl font-bold text-base-content">No account selected</h3>
          <p className="text-base-content/60 mt-2 max-w-sm">
            Select an account from the top right to manage its hashtag groups.
          </p>
        </div>
      )}

      <HashtagGroupModal key={`add-${selectedAccount}`} modalRef={addModalRef} mode="add" account={selectedAccount} accounts={accounts} />
    </div>
  );
};

export default AccountHashtagsManager;
