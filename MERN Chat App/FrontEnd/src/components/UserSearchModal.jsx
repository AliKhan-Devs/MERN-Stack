import { useState, useEffect, useRef } from 'react'
import { FiX, FiSearch, FiUser } from 'react-icons/fi'
import { useChat } from '../contexts/ChatContext'
import Avatar from './Avatar'
import React from 'react'
import { toast } from 'react-hot-toast'

const UserSearchModal = ({ isOpen, onClose }) => {
  const { searchUsers, createChat, setSelectedChat } = useChat()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const modalRef = useRef(null)
  
  // Modal open/close handling
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSearchResults([])
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])
  
  // Search when query changes
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }
      
      setLoading(true)
      try {
        const results = await searchUsers(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchUsers])
  
  const handleUserSelect = async (userId) => {
    try {
      const chat = await createChat(userId)
      if (chat) {
        setSelectedChat(chat)
        onClose()
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      toast.error('Failed to create chat')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">New Chat</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input 
              type="text" 
              placeholder="Search users by name or email"
              className="w-full pl-10 pr-4 py-2 bg-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        
        {/* Results */}
        <div className="overflow-y-auto max-h-60">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div 
                key={user._id}
                className="flex items-center p-3 border-b border-gray-200 hover:bg-secondary-50 cursor-pointer transition-colors"
                onClick={() => handleUserSelect(user._id)}
              >
                <Avatar user={user} size="md" />
                <div className="ml-3">
                  <h3 className="font-medium text-secondary-900">{user.name}</h3>
                  <p className="text-sm text-secondary-600">{user.email}</p>
                </div>
              </div>
            ))
          ) : searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center h-24 text-secondary-500 p-4 text-center">
              <FiUser size={24} className="mb-2 text-secondary-400" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-secondary-500 p-4 text-center">
              <FiSearch size={24} className="mb-2 text-secondary-400" />
              <p>Search for users to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSearchModal