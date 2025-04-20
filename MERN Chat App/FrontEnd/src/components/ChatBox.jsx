import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { FiSend, FiPaperclip, FiSmile, FiArrowLeft } from 'react-icons/fi'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import EmojiPicker from 'emoji-picker-react'
import Avatar from './Avatar'
import MessageItem from './MessageItem'
import { formatDistanceToNow } from 'date-fns'

const ChatBox = () => {
  const { 
    selectedChat, 
    messages, 
    newMessage, 
    setNewMessage, 
    fetchMessages, 
    sendMessage, 
    isUserOnline,
    markMessagesAsSeen,
    typingStatus,
    updateTypingStatus
  } = useChat()
  const { user } = useAuth()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [files, setFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  
  // Get the other user in the chat
  const chatUser = selectedChat?.users?.find(u => u._id !== user?._id)
  
  // Fetch messages when chat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages()
      markMessagesAsSeen(selectedChat._id)
    }
  }, [selectedChat, fetchMessages, markMessagesAsSeen])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji)
  }
  
  const handleSendMessage = async () => {
    if ((newMessage.trim() || files.length > 0) && selectedChat) {
      await sendMessage(newMessage, files)
      setNewMessage('')
      setFiles([])
      setImagePreviews([])
      updateTypingStatus(selectedChat._id, false)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    
    // Handle typing status
    if (selectedChat) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      updateTypingStatus(selectedChat._id, true)
      
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(selectedChat._id, false)
      }, 3000)
    }
  }
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
    
    // Generate previews for images
    const previews = []
    selectedFiles.forEach(file => {
      if (file.type.match('image.*')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          previews.push(e.target.result)
          setImagePreviews([...previews])
        }
        reader.readAsDataURL(file)
      } else {
        previews.push(null)
        setImagePreviews([...previews])
      }
    })
  }
  
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})
  
  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-secondary-50 p-4">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-semibold text-secondary-700 mb-2">Select a chat to start messaging</h2>
        <p className="text-secondary-500">Choose a conversation from the sidebar or start a new chat</p>
      </div>
    )
  }
  
  return (
    <div className="flex-1 flex flex-col h-full bg-secondary-50">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white flex items-center shadow-sm">
        <button 
          className="md:hidden mr-2 p-2 rounded-full hover:bg-secondary-100"
        >
          <FiArrowLeft />
        </button>
        <Avatar user={chatUser} size="md" showStatus={true} />
        <div className="ml-3">
          <h3 className="font-medium">{chatUser?.name}</h3>
          <p className="text-xs text-secondary-500">
            {typingStatus[selectedChat._id] ? (
              'Typing...'
            ) : isUserOnline(chatUser?._id) ? (
              'Online'
            ) : chatUser?.lastSeen ? (
              `Last seen ${formatDistanceToNow(new Date(chatUser.lastSeen), { addSuffix: true })}`
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedMessages).map(([date, messagesForDate]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <div className="bg-secondary-200 text-secondary-600 text-xs px-2 py-1 rounded-full">
                {date}
              </div>
            </div>
            {messagesForDate.map((message, index) => (
              <MessageItem 
                key={message._id} 
                message={message} 
                showSender={
                  index === 0 || 
                  messagesForDate[index - 1].sender._id !== message.sender._id
                }
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* File previews */}
      {imagePreviews.length > 0 && (
        <div className="bg-white p-2 flex flex-wrap gap-2 border-t border-gray-200">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              {preview ? (
                <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded" />
              ) : (
                <div className="h-20 w-20 bg-secondary-100 flex items-center justify-center rounded">
                  <span className="text-secondary-500">File</span>
                </div>
              )}
              <button 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => handleRemoveFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="bg-white p-3 border-t border-gray-200">
        <div className="flex items-end">
          <div className="flex-1 bg-secondary-100 rounded-lg px-3 py-2 flex items-end">
            <textarea
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="w-full bg-transparent focus:outline-none resize-none max-h-32"
              rows={1}
              style={{ minHeight: '24px' }}
            />
          </div>
          
          <div className="flex ml-2">
            <div className="relative" ref={emojiPickerRef}>
              <button 
                className="p-2 rounded-full hover:bg-secondary-100 text-secondary-600"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FiSmile size={24} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            
            <button 
              className="p-2 rounded-full hover:bg-secondary-100 text-secondary-600"
              onClick={() => fileInputRef.current.click()}
            >
              <FiPaperclip size={24} />
              <input 
                type="file" 
                multiple 
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </button>
            
            <button 
              className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600"
              onClick={handleSendMessage}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBox