import React from 'react';

const SyncStatusBadge = ({ status }) => {
  switch (status) {
    case 'running':
      return <span className="badge badge-primary">Running</span>;
    case 'completed':
      return <span className="badge badge-success text-white">Completed</span>;
    case 'partial_success':
      return <span className="badge badge-warning text-white">Partial Success</span>;
    case 'failed':
      return <span className="badge badge-error text-white">Failed</span>;
    case 'incomplete':
      return <span className="badge badge-ghost border-warning/50 text-warning">Incomplete</span>;
    default:
      return <span className="badge badge-ghost">{status || 'Unknown'}</span>;
  }
};

export default SyncStatusBadge;
