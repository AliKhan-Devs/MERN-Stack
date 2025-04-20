import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiMessageSquare } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import React from 'react'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'
    
    if (!password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      const success = await login(email, password)
      if (success) {
        navigate('/')
      }
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <FiMessageSquare size={32} className="text-primary-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Welcome Back</h1>
          <p className="text-secondary-600">Login to access your chats</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-secondary-700">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-500">
                <FiMail />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input pl-10 ${errors.email ? 'border-error focus:ring-error' : ''}`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-secondary-700">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-500">
                <FiLock />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input pl-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
                placeholder="********"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2">Logging in</span>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-secondary-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login