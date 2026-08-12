import React from 'react';
import useAuth from '../hooks/useAuth';
import LoadingState from '../components/common/LoadingState';
import { Navigate } from 'react-router';

const AuthOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState fullScreen={true} />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthOnlyRoute;
