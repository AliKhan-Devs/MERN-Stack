import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiImage, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import React from 'react'
const Profile = () => {
  const { user, updateProfile, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPreviewImage(user.profilePic || null)
    }
  }, [user])
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      setProfilePic(file)
      
      // Create a preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) newErrors.name = 'Name is required'
    
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'
    
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (profilePic && profilePic.size > 5 * 1024 * 1024) {
      newErrors.profilePic = 'Image size should be less than 5MB'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (password) {
        formData.append('password', password)
      }
      if (profilePic) {
        formData.append('profilePic', profilePic)
      }
      
      const success = await updateProfile(formData)
      if (success) {
        setPassword('')
        setConfirmPassword('')
        setProfilePic(null)
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/')}
          className="mb-4 flex items-center text-secondary-700 hover:text-secondary-900"
        >
          <FiArrowLeft className="mr-1" /> Back to Chat
        </button>
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-secondary-900 mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="mb-6 text-center">
              <div className="mx-auto w-24 h-24 mb-3 relative">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile Preview" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-secondary-200 flex items-center justify-center border-2 border-dashed border-secondary-300">
                    <FiUser size={40} className="text-secondary-400" />
                  </div>
                )}
                <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-primary-500 text-white p-1 rounded-full cursor-pointer">
                  <FiImage size={16} />
                </label>
                <input 
                  type="file" 
                  id="profilePic" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </div>
              <p className="text-sm text-secondary-600 mb-1">Change Profile Picture</p>
              {errors.profilePic && <p className="mt-1 text-sm text-error">{errors.profilePic}</p>}
            </div>
            
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-secondary-700">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-500">
                  <FiUser />
                </span>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`input pl-10 ${errors.name ? 'border-error focus:ring-error' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
            </div>
            
            {/* Email */}
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
            
            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-secondary-700">
                New Password <span className="text-secondary-500 text-xs">(Leave blank to keep current)</span>
              </label>
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
            
            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-secondary-700">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-500">
                  <FiLock />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input pl-10 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
                  placeholder="********"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2">Updating Profile</span>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                </span>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile