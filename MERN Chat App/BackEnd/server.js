import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { initializeSocket } from './socket.js'

// Config
dotenv.config()
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

// Initialize Socket.io
initializeSocket(server)

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})