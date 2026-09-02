import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import LoadingState from '../components/common/LoadingState';
import { useMe } from '../hooks/useMe';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { me, isLoading: meLoading, isError: meError } = useMe();

  // 1) firebase auth loading
  if (loading) return <LoadingState fullScreen={true} />;

  // 2) Not logged in
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // 3) Not verified
  if (!user.emailVerified) return <Navigate to="/check-email" replace />;

  if (meLoading && !me) return <LoadingState fullScreen={true} />;
  if (meError) return <Navigate to="/login" replace />;

  const status = me?.status || 'pending';

  if (status === 'pending') return <Navigate to="/pending-approval" replace />;
  if (status === 'rejected') return <Navigate to="/access-denied" replace />;

  return children;
};

export default PrivateRoute;
