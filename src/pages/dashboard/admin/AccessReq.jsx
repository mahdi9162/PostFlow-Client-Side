import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { formatDate } from '../../../services/formatDate';
import { Check, X } from 'lucide-react';
import Swal from 'sweetalert2';

const AccessReq = () => {
  const axiosSecure = useAxiosSecure();

  const { data: requests, refetch } = useQuery({
    queryKey: ['request'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/access-requests');
      return res.data;
    },
  });

  const hasRequests = requests?.length > 0;

  const handleApproveBtn = async (id) => {
    try {
      Swal.fire({
        title: 'Approve this request?',
        text: 'This user will get access immediately.',
        icon: 'question',
        showCancelButton: true,

        // Brand colors
        confirmButtonColor: '#2F6BFF',
        cancelButtonColor: '#1F2937',

        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axiosSecure.patch(`/api/access-requests/${id}/approve`);

          Swal.fire({
            title: 'Approved!',
            text: 'Access has been granted successfully.',
            icon: 'success',
            confirmButtonColor: '#2F6BFF',
          });

          refetch();
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Something went wrong',
        text: error?.response?.data?.message || error?.message || 'Please try again.',
        icon: 'error',
        confirmButtonColor: '#2F6BFF',
      });
    }
  };

  return (
    <div className="p-2 md:p-8 min-h-screen bg-base-200/30">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Access Requests</h1>
          <p className="mt-1 text-sm text-muted">Approve or reject users waiting for access.</p>
        </div>
        {hasRequests && (
          <div className="stats shadow-sm bg-base-100 border border-base-200">
            <div className="stat text-center py-2 px-6">
              <div className="stat-title text-[10px] font-bold uppercase tracking-widest">Pending</div>
              <div className="stat-value text-primary text-2xl">{requests.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Card Container */}
      <div className="card bg-base-100 shadow-sm border border-base-200 overflow-visible">
        <div className="p-0 overflow-visible">
          {!hasRequests ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="mb-4 text-4xl">✅</div>
              <h2 className="text-xl font-bold text-secondary">No pending requests</h2>
              <p className="mt-2 text-sm text-muted">New sign-ups will appear here for approval.</p>
            </div>
          ) : (
            /* Table Section - Removed min-h to stop large empty space */
            <div className="overflow-x-auto overflow-y-visible">
              <table className="table w-full">
                <thead className="bg-base-200/40 text-secondary uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-4 px-6">Email</th>
                    <th>Requested Role</th>
                    <th>Requested At</th>
                    <th className="text-right px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {requests.map((r) => (
                    <tr key={r._id} className="hover:bg-base-200/10 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-secondary">{r.email}</span>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-warning mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse"></span>
                            Pending
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-ghost badge-sm font-medium text-xs">{r.requestedRole}</span>
                      </td>

                      <td>
                        <span className="text-sm text-muted">{formatDate(r.createdAt)}</span>
                      </td>

                      <td className="text-right px-6">
                        <div className="flex justify-end items-center gap-2">
                          {/* Approve */}
                          <button
                            onClick={() => handleApproveBtn(r._id)}
                            className="btn btn-sm btn-success btn-square rounded-xl shadow-sm"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          {/* Reject */}
                          <button
                            className="btn btn-sm btn-square rounded-xl border border-base-200 bg-red-400/30 hover:border-error hover:bg-error/10 hover:text-error duration-500"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer Tip */}
      <div className="mt-4 px-2 text-[11px] text-muted flex items-center gap-1.5 opacity-80">
        <span>💡</span>
        <span>Tip: Approve only trusted users.</span>
      </div>
    </div>
  );
};

export default AccessReq;
