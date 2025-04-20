import express from 'express'
import { 
  registerUser, 
  authUser, 
  getUserProfile,
  updateUserProfile,
  searchUsers
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import multer from 'multer'

const router = express.Router()

// Setup file upload with memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
  }
})

// Routes
router.route('/register').post(upload.single('profilePic'), registerUser)
router.post('/login', authUser)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePic'), updateUserProfile)
router.route('/search').get(protect, searchUsers)

export default router