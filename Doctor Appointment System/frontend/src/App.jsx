import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorRegister from './pages/DoctorRegister';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import useAuthStore from './store/authStore';

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const DashboardRoute = () => {
  const { user } = useAuthStore();

  if (user?.role === 'doctor') {
    return <Navigate to="/dashboard/doctor" />;
  }
  return <Navigate to="/dashboard/patient" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardRoute />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/patient" 
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/doctor" 
            element={
              <PrivateRoute>
                <DoctorDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;