import { createBrowserRouter } from 'react-router-dom';
import React from 'react';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public Pages
import { FormPengajuan } from '../pages/public/FormPengajuan';
import { TrackStatus } from '../pages/public/TrackStatus';

// Admin Pages
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/admin/Dashboard';
import { AntreanSurat } from '../pages/admin/AntreanSurat';

// Mock Pages (Temporary placeholders removed)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <FormPengajuan />
      },
      {
        path: 'track',
        element: <TrackStatus />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'pengajuan',
        element: <AntreanSurat />
      }
    ]
  }
]);
