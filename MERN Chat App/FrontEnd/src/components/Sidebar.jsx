import React, { memo, useCallback, useState, useMemo } from 'react'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import { FiLogOut, FiUser, FiSearch, FiUsers, FiMenu } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import UserSearchModal from './UserSearchModal'

// Memoized ChatListItem component
const ChatListItem = memo(({ chat, onClick, isOnline, currentUser }) => {
  const otherUser = chat.isGroupChat ? null : chat.users.find(u => u._id !== currentUser?._id)

  const handleClick = useCallback((e) => {
    e.preventDefault()
    onClick(chat)
  }, [chat, onClick])

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200
        ${chat.unreadCount ? 'bg-gray-50' : ''}`}
    >
      <div className="relative">
        {chat.isGroupChat ? (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 text-lg">
              {chat.chatName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        ) : (
          <div className="relative">
            <img
              src={otherUser?.profilePic || '/default-avatar.png'}
              alt={otherUser?.name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">
            {chat.isGroupChat ? chat.chatName : otherUser?.name}
          </h3>
          {chat.lastMessage && (
            <span className="text-xs text-gray-500">
              {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {chat.lastMessage?.content || 'No messages yet'}
        </p>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.chat._id === nextProps.chat._id &&
    prevProps.chat.lastMessage?._id === nextProps.chat.lastMessage?._id &&
    prevProps.isOnline === nextProps.isOnline &&
    prevProps.currentUser?._id === nextProps.currentUser?._id
  )
})

// Memoized ChatList component
const ChatList = memo(({ chats, loading, onChatSelect, isUserOnline, currentUser }) => {
  const memoizedChats = useMemo(() => {
    return chats.map(chat => ({
      ...chat,
      isOnline: isUserOnline(chat.users.find(u => u._id !== currentUser?._id)?._id)
    }))
  }, [chats, isUserOnline, currentUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (memoizedChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-secondary-500 p-4 text-center">
        <FiUsers size={48} className="mb-4 text-secondary-400" />
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Start a chat by searching for users</p>
      </div>
    )
  }

  return (
    <>
      {memoizedChats.map((chat) => (
        <ChatListItem
          key={chat._id}
          chat={chat}
          onClick={onChatSelect}
          isOnline={chat.isOnline}
          currentUser={currentUser}
        />
      ))}
    </>
  )
}, (prevProps, nextProps) => {
  // Only re-render if chats array changes or loading state changes
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.chats.length === nextProps.chats.length &&
    prevProps.chats.every((chat, index) => 
      chat._id === nextProps.chats[index]._id &&
      chat.lastMessage?._id === nextProps.chats[index].lastMessage?._id
    )
  )
})

const Sidebar = () => {
  const { user, logout } = useAuth()
  const { chats, loading, selectedChat, setSelectedChat, isUserOnline } = useChat()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  
  const handleUserClick = useCallback((chat) => {
    if (selectedChat?._id !== chat._id) {
      setSelectedChat(chat)
      // Close sidebar on mobile when chat is selected
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
  }, [selectedChat, setSelectedChat])
  
  const handleProfileClick = () => {
    navigate('/profile')
    // Close sidebar on mobile when navigating to profile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }
  
  const openSearchModal = () => {
    setIsSearchModalOpen(true)
  }
  
  const closeSearchModal = () => {
    setIsSearchModalOpen(false)
  }

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static top-0 left-0 h-full w-full md:w-auto
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40
      `}>
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar user={user} size="md" />
              <h2 className="font-semibold">{user?.name || 'User'}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={openSearchModal}
                className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-full transition-colors"
                title="New chat"
              >
                <FiUsers size={20} />
              </button>
              <button 
                onClick={handleProfileClick}
                className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-full transition-colors"
                title="Profile"
              >
                <FiUser size={20} />
              </button>
              <button 
                onClick={logout}
                className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-full transition-colors"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input 
                type="text" 
                placeholder="Search or start a new chat"
                className="w-full pl-10 pr-4 py-2 bg-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={openSearchModal}
                readOnly
              />
            </div>
          </div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <ChatList
              chats={chats}
              loading={loading}
              onChatSelect={handleUserClick}
              isUserOnline={isUserOnline}
              currentUser={user}
            />
          </div>
        </div>
      </div>
      
      <UserSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal} 
      />
    </>
  )
}

export default memo(Sidebar)