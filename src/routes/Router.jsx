import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Home from '../pages/public/home/Home';
import Snortpugs from '../pages/public/snortpugs/Snortpugs';
import Pugsnortz from '../pages/public/pugsnortz/Pugsnortz';
import Pugsnuff from '../pages/public/pugsnuff/Pugsnuff';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';

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
        Component: Snortpugs,
      },
      {
        path: 'pugsnortz',
        Component: Pugsnortz,
      },
      {
        path: 'pugsnuff',
        Component: Pugsnuff,
      },
      {
        path: 'signup',
        Component: Signup,
      },
      {
        path: 'login',
        Component: Login,
      },
    ],
  },
]);
