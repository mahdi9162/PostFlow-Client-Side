import React from 'react';
import StatusBadge from '../../../components/common/StatusBadge';
import { useMe } from '../../../hooks/useMe';
import { useAccounts } from '../../../hooks/useAccounts';
import PreparePostsCard from '../../../components/sync/PreparePostsCard';

const DashHomeAdmin = () => {
  const { isAdmin, isCreator, isLoading } = useMe();
  const { accounts, isLoading: isAccountsLoading } = useAccounts();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-base-content">Welcome Admin</h1>
        <p className="text-sm text-base-content/60">PostFlow workspace • Admin overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">Pending requests</p>
            <StatusBadge status="queue" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">—</div>
          <p className="mt-2 text-xs text-base-content/50">Users waiting for approval</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">Today posts</p>
            <StatusBadge status="daily" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">—</div>
          <p className="mt-2 text-xs text-base-content/50">Posts marked as posted today</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">Accounts</p>
            <StatusBadge status="active" />
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">{isAccountsLoading ? '—' : accounts.length}</div>
          <p className="mt-2 text-xs text-base-content/50 truncate w-full" title={accounts.map(a => a.displayName).join(' • ')}>
            {isAccountsLoading ? 'Loading accounts...' : (accounts.map(a => a.displayName).join(' • ') || 'No accounts')}
          </p>
        </div>
      </div>

      {/* Quick actions + Accounts + Sync */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-base-content">Quick actions</h2>
              <p className="mt-1 text-sm text-base-content/60">Jump to the most used admin tasks.</p>
            </div>

            <span className="badge badge-ghost">Admin</span>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-primary rounded-xl">Review access requests</button>
            <button className="btn btn-outline rounded-xl">View today’s posts</button>
          </div>

          <div className="mt-5 rounded-xl border border-base-200 bg-base-200/40 p-4">
            <p className="text-sm text-base-content">
              <span className="font-medium">Tip:</span> Keep approvals tight. Only approved users should see protected tools.
            </p>
          </div>
          
          <div className="mt-6">
            {!isLoading && (isAdmin || isCreator) && <PreparePostsCard />}
          </div>
        </div>

        {/* Accounts */}
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-base-content">Accounts</h2>
            <button className="btn btn-ghost btn-sm rounded-xl">Manage</button>
          </div>

          <div className="mt-4 space-y-3">
            {isAccountsLoading ? (
              <div className="p-3 text-sm text-base-content/50 text-center">Loading accounts...</div>
            ) : accounts.length === 0 ? (
              <div className="p-3 text-sm text-base-content/50 text-center">No accounts found</div>
            ) : (
              accounts.map((a) => (
                <div key={a.slug} className="flex items-center justify-between rounded-xl border border-base-200 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-base-content">@{a.slug}</p>
                    <p className="text-xs text-base-content/50">{a.displayName}</p>
                  </div>
                  <span className={`badge ${a.isActive ? 'badge-primary' : 'badge-ghost'}`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHomeAdmin;
