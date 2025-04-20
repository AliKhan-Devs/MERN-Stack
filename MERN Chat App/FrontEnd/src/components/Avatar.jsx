import { useMemo } from 'react'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useChat } from '../contexts/ChatContext'

const Avatar = ({ user, size = 'md', showStatus = false }) => {
  const { isUserOnline } = useChat()
  const { name, profilePic, lastSeen } = user || {}
  const isOnline = isUserOnline(user?._id)
  
  const getSize = () => {
    switch(size) {
      case 'xs': return 'w-8 h-8';
      case 'sm': return 'w-10 h-10';
      case 'md': return 'w-12 h-12';
      case 'lg': return 'w-16 h-16';
      case 'xl': return 'w-24 h-24';
      default: return 'w-12 h-12';
    }
  }
  
  const getStatusSize = () => {
    switch(size) {
      case 'xs': return 'w-2 h-2 -right-0.5 -bottom-0.5';
      case 'sm': return 'w-2.5 h-2.5 -right-0.5 -bottom-0.5';
      case 'md': return 'w-3 h-3 -right-1 -bottom-1';
      case 'lg': return 'w-4 h-4 -right-1 -bottom-1';
      case 'xl': return 'w-5 h-5 -right-1 -bottom-1';
      default: return 'w-3 h-3 -right-1 -bottom-1';
    }
  }
  
  const getStatusColor = () => {
    if (isOnline) return 'bg-green-500';
    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const minutesAgo = Math.floor((new Date() - lastSeenDate) / 60000);
      if (minutesAgo < 5) return 'bg-yellow-500';
    }
    return 'bg-gray-400';
  }
  
  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (lastSeen) {
      return `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`;
    }
    return 'Offline';
  }
  
  const initials = useMemo(() => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }, [name]);
  
  const backgroundColor = useMemo(() => {
    if (!name) return 'bg-secondary-500';
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  }, [name]);

  return (
    <div className="relative group">
      {profilePic ? (
        <img 
          src={profilePic} 
          alt={name || 'User'} 
          className={`${getSize()} rounded-full object-cover border-2 border-white`}
        />
      ) : (
        <div className={`${getSize()} ${backgroundColor} rounded-full flex items-center justify-center text-white font-semibold`}>
          {initials}
        </div>
      )}
      
      {showStatus && (
        <>
          <div 
            className={`absolute ${getStatusSize()} rounded-full border-2 border-white ${getStatusColor()} animate-pulse`}
            title={getStatusText()}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {getStatusText()}
          </div>
        </>
      )}
    </div>
  )
}

export default Avatar