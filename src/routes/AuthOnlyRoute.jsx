import React from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading/Loading';
import { Navigate } from 'react-router';

const AuthOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthOnlyRoute;
