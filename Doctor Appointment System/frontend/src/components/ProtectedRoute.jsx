import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (user && user.role !== role) {
      navigate('/');
    }
  }, [token, user, role, navigate]);

  if (!token) return <Navigate to="/login" />;
  if (user && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;