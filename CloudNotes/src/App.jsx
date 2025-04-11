import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;