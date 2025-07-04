import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AuthPage from '../components/AuthPage';
import NotesApp from '../components/NotesApp';
import ProtectedRoute from '../components/ProtectedRoute';

// PUBLIC_INTERFACE
export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/notes" replace />
      },
      {
        path: 'notes',
        element: <NotesApp />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];
