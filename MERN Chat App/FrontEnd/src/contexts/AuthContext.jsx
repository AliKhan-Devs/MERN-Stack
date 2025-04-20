import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import React from 'react'
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const API_URL = 'https://chatapp-backend-60uk.onrender.com/api'

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      if (response.data) {
        localStorage.setItem('chatAppUser', JSON.stringify(response.data))
        setUser(response.data)
        setIsAuthenticated(true)
        toast.success('Account created successfully')
        return true
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password })
      
      if (response.data) {
        localStorage.setItem('chatAppUser', JSON.stringify(response.data))
        setUser(response.data)
        setIsAuthenticated(true)
        toast.success('Logged in successfully')
        return true
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('chatAppUser')
    setUser(null)
    setIsAuthenticated(false)
    toast.info('Logged out successfully')
  }

  const updateProfile = async (userData) => {
    setLoading(true)
    try {
      const token = user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }

      const response = await axios.put(`${API_URL}/users/profile`, userData, config)
      
      if (response.data) {
        const updatedUser = { ...user, ...response.data }
        localStorage.setItem('chatAppUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
        toast.success('Profile updated successfully')
        return true
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = useCallback(() => {
    const userFromStorage = localStorage.getItem('chatAppUser')
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage))
      setIsAuthenticated(true)
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateProfile,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}