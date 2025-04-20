import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import io from 'socket.io-client'
import React from 'react'

export const ChatContext = createContext()

export function useChat() {
  return useContext(ChatContext)
}

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [newMessage, setNewMessage] = useState('')
  const [typingStatus, setTypingStatus] = useState({})
  const [messageStatus, setMessageStatus] = useState({})
  const lastFetchRef = useRef({})
  const selectedChatRef = useRef(null)
  const onlineUsersRef = useRef(new Set())
  
  const API_URL = 'https://chatapp-backend-60uk.onrender.com/api'

  const updateOnlineUsers = useCallback((users) => {
    const newOnlineUsers = new Set(users)
    onlineUsersRef.current = newOnlineUsers
    setOnlineUsers(newOnlineUsers)
  }, [])

  // Initial chat fetch
  useEffect(() => {
    if (user) {
      fetchChats()
    }
  }, [user])

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId || !user) return
    
    // Prevent frequent refetches for the same chat
    const now = Date.now()
    if (lastFetchRef.current[chatId] && (now - lastFetchRef.current[chatId]) < 2000) {
      return
    }
    
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      
      const response = await axios.get(`${API_URL}/messages/${chatId}`, config)
      setMessages(response.data)
      lastFetchRef.current[chatId] = now
      
      // Initialize message status
      const status = {}
      response.data.forEach(message => {
        if (message.sender._id === user._id) {
          status[message._id] = {
            delivered: message.delivered || false,
            seen: message.seen || false,
            seenBy: message.seenBy,
            seenAt: message.seenAt,
            timestamp: message.createdAt
          }
        }
      })
      setMessageStatus(status)
      
      // Join the chat room
      if (socket) {
        socket.emit('join_chat', chatId)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [user, socket])

  const fetchChats = useCallback(async () => {
    if (!user) return
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      
      const response = await axios.get(`${API_URL}/chats`, config)
      setChats(response.data)
    } catch (error) {
      console.error('Error fetching chats:', error)
      toast.error('Failed to load chats')
    }
  }, [user])

  // Handle chat selection with debounce
  const handleSelectChat = useCallback((chat) => {
    if (!chat || selectedChatRef.current === chat._id) return
    
    selectedChatRef.current = chat._id
    setSelectedChat(chat)
    setMessages([]) // Clear messages immediately
    
    // Fetch messages for the new chat
    fetchMessages(chat._id)
  }, [fetchMessages])

  // Update chat locally without fetching
  const updateChatLocally = useCallback((chatId, lastMessage) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(c => c._id === chatId)
      if (chatIndex === -1) return prevChats
      
      // If the chat is already at the top with the same message, don't update
      if (chatIndex === 0 && prevChats[0].lastMessage?._id === lastMessage?._id) {
        return prevChats
      }
      
      const updatedChats = [...prevChats]
      const chat = { ...updatedChats[chatIndex] }
      
      if (lastMessage) {
        chat.lastMessage = lastMessage
      }
      
      // Remove chat from current position and add to front
      updatedChats.splice(chatIndex, 1)
      updatedChats.unshift(chat)
      
      return updatedChats
    })
  }, [])

  useEffect(() => {
    if (!user) return

    const newSocket = io('https://chatapp-backend-60uk.onrender.com', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket']
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
      setSocket(newSocket)
      newSocket.emit('setup', user._id)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    return () => {
      if (newSocket) {
        newSocket.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    if (!socket || !user) return

    socket.on('online_users', (users) => {
      updateOnlineUsers(users)
    })

    socket.on('message_received', (newMessage) => {
      if (!newMessage) return

      // Check if message already exists to prevent duplicates
      setMessages(prev => {
        const messageExists = prev.some(msg => msg._id === newMessage._id)
        if (messageExists) return prev
        
        // If the message is for the current chat, add it to messages
        if (selectedChat?._id === newMessage.chat) {
          return [...prev, newMessage]
        }
        
        // If message is for a different chat, update the chat list
        updateChatLocally(newMessage.chat, newMessage)
        return prev
      })

      // Update message status for the new message
      setMessageStatus(prev => ({
        ...prev,
        [newMessage._id]: { 
          delivered: true, 
          seen: false,
          timestamp: newMessage.createdAt
        }
      }))

      // Show notification only if the message is not from the current user
      // and not in the current chat
      if (selectedChat?._id !== newMessage.chat && newMessage.sender._id !== user._id) {
        toast.info(`New message from ${newMessage.sender?.name || 'Unknown'}`)
      }
    })

    socket.on('message_delivered', ({ messageId }) => {
      setMessageStatus(prev => ({
        ...prev,
        [messageId]: { 
          ...prev[messageId],
          delivered: true
        }
      }))
    })

    socket.on('message_error', ({ messageId, error }) => {
      console.error('Message delivery error:', error)
      setMessageStatus(prev => ({
        ...prev,
        [messageId]: { 
          ...prev[messageId],
          error: true
        }
      }))
    })

    socket.on('message_seen_update', ({ messageId, seenBy, timestamp }) => {
      setMessageStatus(prev => ({
        ...prev,
        [messageId]: { 
          ...prev[messageId],
          seen: true, 
          seenBy, 
          seenAt: timestamp 
        }
      }))
    })

    socket.on('typing', ({ chatId, userId }) => {
      if (selectedChat?._id === chatId) {
        setTypingStatus(prev => ({
          ...prev,
          [chatId]: userId
        }))
      }
    })

    socket.on('stop_typing', ({ chatId }) => {
      if (selectedChat?._id === chatId) {
        setTypingStatus(prev => {
          const newStatus = { ...prev }
          delete newStatus[chatId]
          return newStatus
        })
      }
    })

    socket.on('user_connected', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.add(userId)
        onlineUsersRef.current = newSet
        return newSet
      })
    })

    socket.on('user_disconnected', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        onlineUsersRef.current = newSet
        return newSet
      })
    })

    // Request online users list when connecting
    socket.emit('get_online_users')

    return () => {
      socket.off('online_users')
      socket.off('message_received')
      socket.off('message_delivered')
      socket.off('message_error')
      socket.off('message_seen_update')
      socket.off('typing')
      socket.off('stop_typing')
      socket.off('user_connected')
      socket.off('user_disconnected')
    }
  }, [socket, user, selectedChat, updateChatLocally, updateOnlineUsers])

  const sendMessage = async (content, files = []) => {
    if (!selectedChat || (!content.trim() && files.length === 0)) return
    
    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('chatId', selectedChat._id)
      
      files.forEach(file => {
        formData.append('files', file)
      })
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await axios.post(`${API_URL}/messages`, formData, config)
      
      // Add message to state immediately for sender
      setMessages(prev => [...prev, response.data])
      setMessageStatus(prev => ({
        ...prev,
        [response.data._id]: { 
          delivered: false, 
          seen: false,
          timestamp: response.data.createdAt
        }
      }))
      
      // Emit message through socket
      if (socket) {
        socket.emit('new_message', response.data)
      }
      
      setNewMessage('')
      setFiles([])
      setImagePreviews([])
      updateTypingStatus(selectedChat._id, false)
      
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      // Only show error if it's a network or server error
      if (error.response?.status >= 400) {
        toast.error('Failed to send message')
      }
      return null
    }
  }

  const markMessagesAsSeen = useCallback((chatId) => {
    if (!socket || !user || !chatId) return

    try {
      // Get unread messages for this chat
      const unreadMessages = messages.filter(
        message => 
          message.chat === chatId && 
          message.sender._id !== user._id && 
          !messageStatus[message._id]?.seen
      )

      // Mark each unread message as seen
      unreadMessages.forEach(message => {
        socket.emit('message_seen', {
          messageId: message._id,
          chatId,
          userId: user._id
        })
      })
    } catch (error) {
      console.error('Error marking messages as seen:', error)
    }
  }, [socket, user, messages, messageStatus])

  const updateTypingStatus = useCallback((chatId, isTyping) => {
    if (!socket || !user || !chatId) return

    try {
      if (isTyping) {
        socket.emit('typing', { chatId, userId: user._id })
      } else {
        socket.emit('stop_typing', { chatId, userId: user._id })
      }
    } catch (error) {
      console.error('Error setting typing status:', error)
    }
  }, [socket, user])

  const searchUsers = async (search) => {
    if (!user || !search) return []
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      
      const response = await axios.get(`${API_URL}/users/search?search=${search}`, config)
      return response.data
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Error searching users')
      return []
    }
  }

  const isUserOnline = useCallback((userId) => {
    if (!userId) return false
    return onlineUsers.has(userId)
  }, [onlineUsers])

  const createChat = async (userId) => {
    if (!user) return null
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      
      const response = await axios.post(`${API_URL}/chats`, { userId }, config)
      
      if (response.data) {
        // Add the new chat to the chats list
        setChats(prev => [response.data, ...prev])
        return response.data
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      toast.error('Failed to create chat')
      return null
    }
  }

  const value = useMemo(() => ({
    selectedChat,
    setSelectedChat: handleSelectChat,
    chats,
    messages,
    loading,
    newMessage,
    setNewMessage,
    fetchChats,
    fetchMessages,
    sendMessage,
    isUserOnline,
    typingStatus,
    updateTypingStatus,
    messageStatus,
    markMessagesAsSeen,
    searchUsers,
    createChat
  }), [
    selectedChat,
    chats,
    messages,
    loading,
    newMessage,
    handleSelectChat,
    fetchChats,
    fetchMessages,
    sendMessage,
    isUserOnline,
    typingStatus,
    updateTypingStatus,
    messageStatus,
    markMessagesAsSeen,
    searchUsers,
    createChat
  ])

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}