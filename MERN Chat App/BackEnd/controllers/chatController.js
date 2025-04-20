import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel.js'
import User from '../models/userModel.js'

// @desc    Create or access one-on-one chat
// @route   POST /api/chats
// @access  Private
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    res.status(400)
    throw new Error('Please provide a user ID')
  }

  // Check if chat already exists between these two users
  let chat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage')

  // Populate sender details for latestMessage
  chat = await User.populate(chat, {
    path: 'latestMessage.sender',
    select: 'name profilePic email',
  })

  // If chat exists, return it
  if (chat.length > 0) {
    res.json(chat[0])
  } else {
    // Create a new chat
    try {
      const newChat = await Chat.create({
        users: [req.user._id, userId],
      })

      // Fetch the full chat with populated user details
      const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
        'users',
        '-password'
      )

      res.status(201).json(fullChat)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }
})

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Find all chats that the user is part of
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 }) // Sort by latest message

    // Populate sender details for latestMessage
    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name profilePic email',
    })

    res.json(chats)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

export { accessChat, fetchChats }