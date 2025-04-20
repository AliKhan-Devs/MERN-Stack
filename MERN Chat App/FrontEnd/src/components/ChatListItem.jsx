import React, { memo } from 'react'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from './Avatar'

const ChatListItem = memo(({ chat, onClick }) => {
  const { user } = useAuth()
  const { selectedChat, isUserOnline } = useChat()
  
  const otherUser = chat.users.find(u => u._id !== user._id)
  const isOnline = isUserOnline(otherUser._id)
  const isSelected = selectedChat?._id === chat._id
  
  const lastMessage = chat.latestMessage
    ? chat.latestMessage.content.length > 50
      ? chat.latestMessage.content.substring(0, 47) + '...'
      : chat.latestMessage.content
    : 'No messages yet'

  const timeAgo = chat.latestMessage
    ? formatDistanceToNow(new Date(chat.latestMessage.createdAt), { addSuffix: true })
    : ''

  return (
    <div
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 relative
        ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={() => onClick(chat)}
    >
      <div className="relative">
        <Avatar
          src={otherUser.avatar}
          alt={otherUser.name}
          className="w-12 h-12 rounded-full"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-900 truncate">
            {otherUser.name}
          </h3>
          {timeAgo && (
            <span className="text-sm text-gray-500">
              {timeAgo}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 truncate">
          {lastMessage}
        </p>
      </div>
      
      {chat.unreadCount > 0 && (
        <span className="ml-2 bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
          {chat.unreadCount}
        </span>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.chat._id === nextProps.chat._id &&
    prevProps.chat.latestMessage?._id === nextProps.chat.latestMessage?._id &&
    prevProps.chat.unreadCount === nextProps.chat.unreadCount
  )
})

ChatListItem.displayName = 'ChatListItem'

export default ChatListItem