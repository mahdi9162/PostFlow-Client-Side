import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Home from '../pages/public/Home';
import Snortpugs from '../pages/public/Snortpugs';
import Pugsnortz from '../pages/public/Pugsnortz';
import Pugsnuff from '../pages/public/Pugsnuff';

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
    ],
  },
]);
