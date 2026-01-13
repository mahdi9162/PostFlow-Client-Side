import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading/Loading';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!user.emailVerified) return <Navigate to="/check-email" replace />;

  return children;
};

export default PrivateRoute;
