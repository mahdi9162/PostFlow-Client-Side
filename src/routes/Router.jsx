import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Home from '../pages/public/home/Home';
import AccountPage from '../pages/public/account/AccountPage';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import PrivateRoute from './PrivateRoute';
import CheckEmail from '../pages/public/checkEmail/CheckEmail';
import DashboardHome from '../pages/dashboard/dashboardHome/DashboardHome';
import CreatePost from '../pages/dashboard/posts/CreatePost';
import ForgotPassword from '../pages/public/forgotPass/ForgotPassword';
import PendingApproval from '../pages/public/pendingApproval/PendingApproval';
import AuthOnlyRoute from './AuthOnlyRoute';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import AccessReq from '../pages/dashboard/admin/AccessReq';
import AccountHashtagsManager from '../pages/dashboard/admin/AccountHashtagsManager';
import AccountManager from '../pages/dashboard/admin/accountManager/AccountManager';

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
        path: ':accountSlug',
        element: (
          <PrivateRoute>
            <AccountPage />
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
      {
        path: '/dashboard/AccessReq',
        element: (
          <PrivateRoute>
            <AccessReq />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/hashtags-manager',
        Component: AccountHashtagsManager,
      },
      {
        path: '/dashboard/hastags-manager',
        element: <Navigate to="/dashboard/hashtags-manager" replace />,
      },
      {
        path: '/dashboard/account-manager',
        Component: AccountManager,
      },
    ],
  },
]);
