import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'
import React from 'react'
const ChatPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showSidebar, setShowSidebar] = useState(true)
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowSidebar(mobile ? false : true)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return (
    <div className="h-full flex">
      {/* Sidebar (hidden on mobile when chat is open) */}
      {(!isMobile || (isMobile && showSidebar)) && (
        <div className={`${isMobile ? 'w-[0%]' : 'w-1/3'} max-w-sm border-r border-gray-200`}>
          <Sidebar />
        </div>
      )}
      
      {/* Chat area (hidden on mobile when sidebar is shown) */}
      {/* {(!isMobile || (isMobile && !showSidebar)) && ( */}
        <div className="flex-1">
          <ChatBox />
        </div>
      {/* )} */}
    </div>
  )
}

export default ChatPage