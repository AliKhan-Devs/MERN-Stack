import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useChat } from '../contexts/ChatContext'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import { useNavigate } from 'react-router-dom'

const Chat = () => {
  const { user, isAuthenticated } = useAuth()
  const { selectedChat } = useChat()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed md:static
        w-full md:w-80 lg:w-96
        h-full
        transform transition-transform duration-300 ease-in-out
        ${selectedChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        z-20
      `}>
        <Sidebar />
      </div>

      {/* Chat Window */}
      <div className={`
        flex-1
        w-full
        ${selectedChat ? 'block' : 'hidden md:block'}
      `}>
        {selectedChat ? (
          <ChatWindow />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center text-gray-500">
              <p className="text-lg">Select a chat to start messaging</p>
              <p className="text-sm mt-2">Or start a new conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat 