"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"


export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const [recentChats, setRecentChats] = React.useState([
    { id: 1, name: "Sarah Johnson", lastMessage: "Can we discuss the project timeline?", time: "10:30 AM", unread: 2, avatar: "/api/placeholder/40/40" },
    { id: 2, name: "David Miller", lastMessage: "I've sent you the files you requested", time: "Yesterday", unread: 0, avatar: "/api/placeholder/40/40" },
    { id: 3, name: "Alex Wong", lastMessage: "Let's schedule a meeting for next week", time: "Yesterday", unread: 3, avatar: "/api/placeholder/40/40" },
    { id: 4, name: "Emma Thompson", lastMessage: "Thanks for the update!", time: "2 days ago", unread: 0, avatar: "/api/placeholder/40/40" },
    { id: 5, name: "Michael Garcia", lastMessage: "Could you review the documentation?", time: "3 days ago", unread: 0, avatar: "/api/placeholder/40/40" }
  ]);
  const [activeChat, setActiveChat] = React.useState(1);

  const handleChatSelect = (chatId: any) => {
    setActiveChat(chatId);
    
    // Mark as read when selected
    setRecentChats(recentChats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ));
  };


  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="h-12 border-b border-accent">
        <h1 className="text-2xl font-bold">Recent Chats</h1>
      </SidebarHeader>
      <SidebarContent>
      <div>
          {recentChats.map(chat => (
            <div 
              key={chat.id}
              className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${activeChat === chat.id ? 'bg-gray-100' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="h-10 w-10 rounded-full mr-3" />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}