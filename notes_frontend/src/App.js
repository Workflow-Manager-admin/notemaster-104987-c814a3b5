import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { ToastProvider } from './contexts/ToastContext';
import { routes } from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Routes component using useRoutes hook
const Routes = () => {
  return useRoutes(routes);
};

// PUBLIC_INTERFACE
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <NotesProvider>
              <Routes />
            </NotesProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
