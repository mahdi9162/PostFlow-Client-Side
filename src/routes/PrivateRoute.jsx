import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading/Loading';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const {
    data: me,
    isLoading: meLoading,
    isError: meError,
  } = useQuery({
    queryKey: ['me', user?.email], // user change হলে refetch
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users/me');
      return res.data;
    },
    enabled: !!user && !!user?.emailVerified, // ✅ only fetch when allowed
    staleTime: 10_000,
    retry: 1,
  });

  // 1) firebase auth loading
  if (loading) return <Loading />;

  // 2) Not logged in
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // 3) Not verified
  if (!user.emailVerified) return <Navigate to="/check-email" replace />;

  if (meLoading) return <Loading />;
  if (meError) return <Navigate to="/login" replace />;

  const status = me?.status || 'pending';

  if (status === 'pending') return <Navigate to="/pending-approval" replace />;
  if (status === 'rejected') return <Navigate to="/access-denied" replace />;

  return children;
};

export default PrivateRoute;
