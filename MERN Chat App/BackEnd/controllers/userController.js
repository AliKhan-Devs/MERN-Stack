import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import fs from 'fs'

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please fill all required fields')
  }

  // Check if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Upload profile pic if provided
  let profilePic = ''
  if (req.file) {
    try {
      // Upload to cloudinary directly from buffer
      profilePic = await uploadToCloudinary(req.file.buffer, 'chat-app-profiles')
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      res.status(500)
      throw new Error('Image upload failed')
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    profilePic
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    
    if (req.body.password) {
      user.password = req.body.password
    }

    // Upload new profile picture if provided
    if (req.file) {
      try {
        // Upload to cloudinary directly from buffer
        const profilePic = await uploadToCloudinary(req.file.buffer, 'chat-app-profiles')
        user.profilePic = profilePic
      } catch (error) {
        console.error("Error uploading profile picture:", error)
        res.status(500)
        throw new Error('Image upload failed')
      }
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Search users
// @route   GET /api/users?search=
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {}

  // Find users but exclude the current user
  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
    .select('-password')

  res.json(users)
})

export { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile,
  searchUsers
}