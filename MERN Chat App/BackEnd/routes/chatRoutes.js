import express from 'express'
import { 
  accessChat,
  fetchChats
} from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(protect, accessChat)  // Create or access 1-on-1 chat
  .get(protect, fetchChats)   // Get all chats for a user

export default router