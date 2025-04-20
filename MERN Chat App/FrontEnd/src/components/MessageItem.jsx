import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'
import { formatMessageTime } from '../utils/dateUtils'
import { FiCheck, FiCheckCircle } from 'react-icons/fi'
import { useChat } from '../contexts/ChatContext'

const MessageItem = ({ message, showSender = false }) => {
  const { user } = useAuth()
  const isSender = message.sender._id === user._id
  const { updateTypingStatus, markMessagesAsSeen, messageStatus, typingStatus } = useChat()
  
  // Format message time
  const time = formatMessageTime(new Date(message.createdAt))
  
  // Mark messages as seen when they come into view
  useEffect(() => {
    if (!isSender && message.chat) {
      markMessagesAsSeen(message.chat._id)
    }
  }, [isSender, message.chat, markMessagesAsSeen])
  
  const getMessageStatus = () => {
    if (!isSender) return null;
    
    const status = messageStatus[message._id]
    if (!status) return null;
    
    if (status.seen) {
      return (
        <div className="flex items-center text-primary-500">
          <FiCheckCircle size={16} />
        </div>
      );
    }
    
    if (status.delivered) {
      return (
        <div className="flex items-center text-secondary-500">
          <FiCheck size={16} />
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-secondary-400">
        <FiCheck size={16} />
      </div>
    );
  }
  
  return (
    <div className={`mb-4 flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      {!isSender && showSender && (
        <div className="mr-2 self-end mb-1">
          <Avatar user={message.sender} size="xs" />
        </div>
      )}
      
      <div className={isSender ? 'message-sent' : 'message-received'}>
        {!isSender && showSender && (
          <div className="text-xs text-primary-700 font-medium mb-1">
            {message.sender.name}
          </div>
        )}
        
        {/* Message files */}
        {message.files && message.files.length > 0 && (
          <div className="mb-2">
            {message.files.map((file, index) => (
              <div key={index} className="mb-2">
                {file.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={file} 
                      alt="Attachment" 
                      className="max-w-full rounded-md max-h-60 object-contain"
                    />
                  </a>
                ) : (
                  <a 
                    href={file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-secondary-100 rounded-md hover:bg-secondary-200 transition-colors"
                  >
                    <span className="text-secondary-700">
                      📎 Attachment
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Message content */}
        {message.content && (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        )}
        
        {/* Message time and status */}
        <div className={`flex items-center mt-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
          <div className={`text-xs ${isSender ? 'text-secondary-500' : 'text-secondary-500'}`}>
            {time}
          </div>
          {isSender && (
            <div className="ml-1">
              {getMessageStatus()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem