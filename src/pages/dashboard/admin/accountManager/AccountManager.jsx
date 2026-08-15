import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import { Check, X, Edit, Power, PowerOff, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useMe } from '../../../../hooks/useMe';
import LoadingState from '../../../../components/common/LoadingState';
import ErrorState from '../../../../components/common/ErrorState';
import { useAccounts } from '../../../../hooks/useAccounts';
import AccountModal from './AccountModal';

const AccountManager = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const modalRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { isAdmin, isLoading: roleLoading, isError: roleError } = useMe();
  const { accounts: fetchedAccounts, isLoading, isError } = useAccounts();

  if (roleLoading) {
    return <LoadingState />;
  }

  if (roleError) {
    return <ErrorState message="Failed to load user permissions." />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const accounts = fetchedAccounts || [];
  const activeCount = accounts.filter(a => a.isActive).length;

  const openAddModal = () => {
    setModalMode('add');
    setSelectedAccount(null);
    modalRef.current?.showModal();
  };

  const openEditModal = (account) => {
    setModalMode('edit');
    setSelectedAccount(account);
    modalRef.current?.showModal();
  };

  const handleToggleStatus = async (account) => {
    try {
      const newStatus = !account.isActive;
      await axiosSecure.patch(`/api/accounts/${account._id}`, { isActive: newStatus });
      toast.success(`Account ${newStatus ? 'activated' : 'deactivated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update account status');
    }
  };

  const handleDelete = async (account) => {
    try {
      Swal.fire({
        title: 'Delete this account?',
        text: 'This action cannot be undone. If it is in use, it will be rejected.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E11D48',
        cancelButtonColor: '#1F2937',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosSecure.delete(`/api/accounts/${account._id}`);
            Swal.fire({
              title: 'Deleted!',
              text: 'Account has been deleted successfully.',
              icon: 'success',
              confirmButtonColor: '#2F6BFF',
            });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
          } catch (deleteError) {
            Swal.fire({
              title: 'Cannot Delete',
              text: deleteError?.response?.data?.message || 'Failed to delete account.',
              icon: 'error',
              confirmButtonColor: '#2F6BFF',
            });
          }
        }
      });
    } catch {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="p-2 md:p-8 min-h-screen bg-base-200/30">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content">Account Manager</h1>
          <p className="mt-1 text-sm text-muted">Manage the global PostFlow Instagram accounts registry.</p>
        </div>
        <div className="flex gap-4">
          <div className="stats shadow-sm bg-base-100 border border-base-200">
            <div className="stat text-center py-2 px-6">
              <div className="stat-title text-[10px] font-bold uppercase tracking-widest">Active Accounts</div>
              <div className="stat-value text-primary text-2xl">{activeCount}</div>
            </div>
          </div>
          <button onClick={openAddModal} className="btn btn-primary h-auto py-2">
            ＋ Add Account
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="card bg-base-100 shadow-sm border border-base-200 overflow-visible">
        <div className="p-0 overflow-visible">
          {isLoading ? (
            <div className="p-10 text-center text-muted">Loading accounts...</div>
          ) : isError ? (
            <div className="p-10 text-center text-error">Failed to load accounts. <button onClick={() => queryClient.invalidateQueries({ queryKey: ['accounts'] })} className="underline">Retry</button></div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="mb-4 text-4xl">📱</div>
              <h2 className="text-xl font-bold text-base-content">No accounts found</h2>
              <p className="mt-2 text-sm text-muted">Click Add Account to register the first Instagram account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200/40 text-base-content uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-4 px-6">Display Name</th>
                    <th>Slug</th>
                    <th>Drive Folder</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th className="text-right px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {accounts.map((acc) => (
                    <tr key={acc._id} className="hover:bg-base-200/10 transition-colors group">
                      <td className="py-4 px-6 font-semibold text-base-content">{acc.displayName}</td>
                      <td><span className="font-mono text-xs badge badge-ghost">{acc.slug}</span></td>
                      <td className="text-sm text-base-content/80 truncate max-w-[150px]">{acc.driveFolderName}</td>
                      <td className="text-sm font-semibold">{acc.order}</td>
                      <td>
                        <span className={`badge badge-sm font-medium text-xs ${acc.isActive ? 'badge-primary' : 'badge-ghost'}`}>
                          {acc.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right px-6">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(acc)}
                            className={`btn btn-sm btn-square rounded-xl shadow-sm ${acc.isActive ? 'btn-ghost text-base-content/60 hover:text-warning hover:bg-warning/10' : 'btn-success text-white'}`}
                            title={acc.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {acc.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => openEditModal(acc)}
                            className="btn btn-sm btn-square rounded-xl shadow-sm btn-ghost hover:bg-primary/10 hover:text-primary"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(acc)}
                            className="btn btn-sm btn-square rounded-xl border border-base-200 bg-red-400/10 hover:border-error hover:bg-error/10 hover:text-error duration-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <AccountModal 
        modalRef={modalRef} 
        mode={modalMode} 
        account={selectedAccount} 
      />
    </div>
  );
};

export default AccountManager;
