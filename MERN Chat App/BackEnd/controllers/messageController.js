import asyncHandler from 'express-async-handler'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import fs from 'fs'

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body

  if (!chatId) {
    res.status(400)
    throw new Error('Please provide a chat ID')
  }

  // No content is allowed if files are provided
  if (!content && (!req.files || req.files.length === 0)) {
    res.status(400)
    throw new Error('Please provide a message content or files')
  }

  // Upload files if provided
  let fileUrls = []
  if (req.files && req.files.length > 0) {
    try {
      for (const file of req.files) {
        const fileUrl = await uploadToCloudinary(file.buffer, 'chat-app-messages')
        fileUrls.push(fileUrl)
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      res.status(500)
      throw new Error('File upload failed')
    }
  }

  // Create message
  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content || '',
      chat: chatId,
      files: fileUrls,
    })

    // Populate user details
    message = await message.populate('sender', 'name profilePic')
    message = await message.populate('chat')
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name profilePic email',
    })

    // Update latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message })

    res.json(message)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name profilePic email')
      .populate('chat')

    res.json(messages)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

export { sendMessage, getAllMessages }