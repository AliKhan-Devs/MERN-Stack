import express from 'express'
import { 
  sendMessage,
  getAllMessages
} from '../controllers/messageController.js'
import { protect } from '../middleware/authMiddleware.js'
import multer from 'multer'

const router = express.Router()

// Setup file upload with memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

router.route('/').post(protect, upload.array('files', 5), sendMessage)
router.route('/:chatId').get(protect, getAllMessages)

export default router