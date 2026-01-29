import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Home from '../pages/public/home/Home';
import Snortpugs from '../pages/public/snortpugs/Snortpugs';
import Pugsnortz from '../pages/public/pugsnortz/Pugsnortz';
import Pugsnuff from '../pages/public/pugsnuff/Pugsnuff';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import PrivateRoute from './PrivateRoute';
import CheckEmail from '../pages/public/checkEmail/CheckEmail';
import DashboardLayout from '../layouts/DashboardLayout/dashboardLayout';
import DashboardHome from '../pages/dashboard/dashboardHome/DashboardHome';
import CreatePost from '../pages/dashboard/posts/CreatePost';
import ForgotPassword from '../pages/public/forgotPass/ForgotPassword';
import PendingApproval from '../pages/public/pendingApproval/pendingApproval';
import AuthOnlyRoute from './AuthOnlyRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'snortpugs',
        element: (
          <PrivateRoute>
            <Snortpugs />
          </PrivateRoute>
        ),
      },
      {
        path: 'pugsnortz',
        element: (
          <PrivateRoute>
            <Pugsnortz />
          </PrivateRoute>
        ),
      },
      {
        path: 'pugsnuff',
        element: (
          <PrivateRoute>
            <Pugsnuff />
          </PrivateRoute>
        ),
      },
      {
        path: 'signup',
        Component: Signup,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'check-email',
        Component: CheckEmail,
      },
      {
        path: '/pending-approval',
        element: (
          <AuthOnlyRoute>
            <PendingApproval />
          </AuthOnlyRoute>
        ),
      },
      {
        path: 'forgot-password',
        Component: ForgotPassword,
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: '/dashboard/create-post',
        Component: CreatePost,
      },
    ],
  },
]);
