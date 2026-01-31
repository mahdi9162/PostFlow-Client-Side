import React from 'react';

const DashHomeAdmin = () => {
  return (
    <div className="p-6">
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
            <span className="badge badge-warning badge-sm">Queue</span>
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">—</div>
          <p className="mt-2 text-xs text-base-content/50">Users waiting for approval</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">Today posts</p>
            <span className="badge badge-success badge-sm">Daily</span>
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">—</div>
          <p className="mt-2 text-xs text-base-content/50">Posts marked as posted today</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">Accounts</p>
            <span className="badge badge-primary badge-sm">Active</span>
          </div>
          <div className="mt-3 text-3xl font-semibold text-base-content">3</div>
          <p className="mt-2 text-xs text-base-content/50">snortpugs • pugsnortz • pugsnuff</p>
        </div>
      </div>

      {/* Quick actions + Accounts */}
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
        </div>

        {/* Accounts */}
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-base-content">Accounts</h2>
            <button className="btn btn-ghost btn-sm rounded-xl">Manage</button>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { name: 'snortpugs', note: 'Primary', badge: 'badge-primary' },
              { name: 'pugsnortz', note: 'Secondary', badge: 'badge-ghost' },
              { name: 'pugsnuff', note: 'Secondary', badge: 'badge-ghost' },
            ].map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-xl border border-base-200 p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-base-content">@{a.name}</p>
                  <p className="text-xs text-base-content/50">{a.note}</p>
                </div>
                <span className={`badge ${a.badge}`}>Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHomeAdmin;
