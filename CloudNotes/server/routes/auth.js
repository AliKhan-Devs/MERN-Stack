import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser);

export default router;