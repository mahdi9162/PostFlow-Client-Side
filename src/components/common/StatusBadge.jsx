import React from 'react';

const statusConfig = {
  pending: { label: 'Pending', className: 'badge-soft badge-warning' },
  posted: { label: 'Posted', className: 'badge-soft badge-success' },
  done: { label: 'Done', className: 'badge-soft badge-success' },
  approved: { label: 'Approved', className: 'badge-soft badge-success' },
  active: { label: 'Active', className: 'badge-soft badge-primary' },
  queue: { label: 'Queue', className: 'badge-soft badge-warning' },
  daily: { label: 'Daily', className: 'badge-soft badge-success' },
  default: { label: 'Unknown', className: 'badge-soft badge-ghost' },
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  const config = statusConfig[normalizedStatus] || { label: status || 'Unknown', className: 'badge-ghost' };

  return (
    <span className={`badge badge-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
