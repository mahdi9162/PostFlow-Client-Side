import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import Loading from '../../../components/Loading/Loading';

const PendingApproval = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, userSignOut } = useAuth();

  // 🔹 Fetch my status from server
  const {
    data: me,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['me', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users/me');
      return res.data;
    },
    enabled: !!user,
    staleTime: 0,
    retry: 1,
  });

  // 🔹 Handle approved / rejected
  if (me?.status === 'approved') {
    toast.success('Access granted 🎉');
    navigate('/', { replace: true });
    return null;
  }

  if (me?.status === 'rejected') {
    toast.error('Request rejected. Contact admin.');
  }

  const backToHome = () => navigate('/', { replace: true });

  const logoutAndRetry = async () => {
    try {
      await userSignOut();
    } finally {
      toast('Logged out. Now sign up again with the correct email/role.');
      navigate('/signup', { replace: true });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="card bg-base-100 border border-base-200 p-6 max-w-md w-full">
        <h2 className="text-xl font-bold">Approval Pending</h2>
        <p className="mt-2 text-base-content/60">Your access request is waiting for admin approval.</p>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-base-content/60">Email</span>
            <span className="font-medium">{me?.email || '—'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-base-content/60">Requested role</span>
            <span className="font-medium">{me?.requestedRole || '—'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-base-content/60">Status</span>
            <span className="badge badge-warning text-white">{me?.status || 'pending'}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button className="btn btn-primary" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Checking...' : 'Check status now'}
          </button>

          <button className="btn btn-ghost" onClick={backToHome}>
            Back to home
          </button>

          <button className="btn btn-outline" onClick={logoutAndRetry}>
            Wrong email/role? Try again
          </button>
        </div>

        <p className="mt-4 text-xs text-base-content/50">
          Tip: After the admin approves your request, click “Check status now” to enter the app.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
