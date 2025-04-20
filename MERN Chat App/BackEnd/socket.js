import { Server } from 'socket.io'

// Store online users with their socket IDs and last seen timestamps
const onlineUsers = new Map() // userId -> { socketId, lastSeen }

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket']
  })

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)

    // Setup user (when they come online)
    socket.on('setup', (userId) => {
      if (!userId) {
        console.error('Invalid userId in setup event')
        return
      }

      try {
        // Add user to online users with current timestamp
        onlineUsers.set(userId, {
          socketId: socket.id,
          lastSeen: new Date()
        })
        
        // Join user's personal room for direct messages
        socket.join(userId)
        
        // Broadcast online users to all connected clients
        io.emit('online_users', Array.from(onlineUsers.keys()))
        
        console.log('User online:', userId)
      } catch (error) {
        console.error('Error in setup event:', error)
      }
    })

    // Join a chat room
    socket.on('join_chat', (chatId) => {
      if (!chatId) {
        console.error('Invalid chatId in join_chat event')
        return
      }

      try {
        socket.join(chatId)
        console.log('User joined chat:', chatId)
      } catch (error) {
        console.error('Error joining chat:', error)
      }
    })

    // Send a new message
    socket.on('new_message', (message) => {
      if (!message || !message.chat) {
        console.error('Invalid message in new_message event')
        return
      }

      try {
        const chat = message.chat
        
        // Update sender's last seen
        if (message.sender && message.sender._id) {
          const userData = onlineUsers.get(message.sender._id)
          if (userData) {
            onlineUsers.set(message.sender._id, {
              ...userData,
              lastSeen: new Date()
            })
          }
        }
        
        // First, emit to the sender to confirm message was received
        io.to(message.sender._id).emit('message_received', message)
        
        // Then emit to all other users in the chat room
        socket.to(chat).emit('message_received', message)
        
        // Mark message as delivered for sender
        io.to(message.sender._id).emit('message_delivered', {
          messageId: message._id
        })

        // Mark message as delivered for all recipients
        socket.to(chat).emit('message_delivered', {
          messageId: message._id
        })
      } catch (error) {
        console.error('Error handling new message:', error)
        // Send error back to sender
        io.to(message.sender._id).emit('message_error', {
          messageId: message._id,
          error: 'Failed to deliver message'
        })
      }
    })

    // Message seen status
    socket.on('message_seen', ({ messageId, chatId, userId }) => {
      if (!messageId || !chatId || !userId) {
        console.error('Invalid data in message_seen event')
        return
      }

      try {
        io.to(chatId).emit('message_seen_update', {
          messageId,
          seenBy: userId,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Error handling message seen:', error)
      }
    })

    // Typing indicators
    socket.on('typing', ({ chatId, userId }) => {
      if (!chatId || !userId) {
        console.error('Invalid data in typing event')
        return
      }

      try {
        socket.to(chatId).emit('typing', { chatId, userId })
      } catch (error) {
        console.error('Error handling typing event:', error)
      }
    })

    socket.on('stop_typing', ({ chatId, userId }) => {
      if (!chatId || !userId) {
        console.error('Invalid data in stop_typing event')
        return
      }

      try {
        socket.to(chatId).emit('stop_typing', { chatId, userId })
      } catch (error) {
        console.error('Error handling stop typing event:', error)
      }
    })

    // User activity (for last seen updates)
    socket.on('user_activity', (userId) => {
      if (!userId) {
        console.error('Invalid userId in user_activity event')
        return
      }

      try {
        const userData = onlineUsers.get(userId)
        if (userData) {
          onlineUsers.set(userId, {
            ...userData,
            lastSeen: new Date()
          })
        }
      } catch (error) {
        console.error('Error handling user activity:', error)
      }
    })

    // Disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      
      try {
        // Find and remove the disconnected user
        let disconnectedUserId = null
        for (const [userId, data] of onlineUsers.entries()) {
          if (data.socketId === socket.id) {
            disconnectedUserId = userId
            break
          }
        }

        if (disconnectedUserId) {
          onlineUsers.delete(disconnectedUserId)
          // Broadcast updated online users
          io.emit('online_users', Array.from(onlineUsers.keys()))
        }
      } catch (error) {
        console.error('Error handling disconnect:', error)
      }
    })
  })

  return io
} 