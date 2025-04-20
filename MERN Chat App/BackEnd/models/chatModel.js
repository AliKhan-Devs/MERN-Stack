import mongoose from 'mongoose'

const chatSchema = mongoose.Schema(
  {
    // For 1-on-1 chat, only 2 users
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Latest message in the chat
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
)

const Chat = mongoose.model('Chat', chatSchema)

export default Chat