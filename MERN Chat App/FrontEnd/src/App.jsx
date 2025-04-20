import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import React from 'react'
// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ChatPage from './pages/ChatPage'
import Profile from './pages/Profile'

// Components
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated, checkAuth } = useAuth()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="h-full">
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App