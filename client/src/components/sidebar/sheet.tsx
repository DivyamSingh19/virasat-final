"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function SheetSidebar() {
    const [recentChats, setRecentChats] = useState([
        { id: 1, name: "Sarah Johnson", lastMessage: "Can we discuss the project timeline?", time: "10:30 AM", unread: 2, avatar: "/api/placeholder/40/40" },
        { id: 2, name: "David Miller", lastMessage: "I've sent you the files you requested", time: "Yesterday", unread: 0, avatar: "/api/placeholder/40/40" },
        { id: 3, name: "Alex Wong", lastMessage: "Let's schedule a meeting for next week", time: "Yesterday", unread: 3, avatar: "/api/placeholder/40/40" },
        { id: 4, name: "Emma Thompson", lastMessage: "Thanks for the update!", time: "2 days ago", unread: 0, avatar: "/api/placeholder/40/40" },
        { id: 5, name: "Michael Garcia", lastMessage: "Could you review the documentation?", time: "3 days ago", unread: 0, avatar: "/api/placeholder/40/40" }
      ]);
    
      // State for current active chat
      const [activeChat, setActiveChat] = useState(1);
      
      // Sample messages for the current chat
      const [messages, setMessages] = useState([
        { id: 1, sender: 1, text: "Hi there! How's the dashboard coming along?", time: "10:15 AM" },
        { id: 2, sender: 0, text: "It's going well! I'm working on the chat interface now.", time: "10:20 AM" },
        { id: 3, sender: 1, text: "That sounds great! Can we discuss the project timeline?", time: "10:30 AM" }
      ]);
      
      // State for new message input
      const [newMessage, setNewMessage] = useState("");
      
      // Handle sending a new message
      const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        
        const newMsg = {
          id: messages.length + 1,
          sender: 0, // 0 represents the current user
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...messages, newMsg]);
        setNewMessage("");
      };
      
      // Handle chat selection
      const handleChatSelect = (chatId: any) => {
        setActiveChat(chatId);
        
        // Mark as read when selected
        setRecentChats(recentChats.map(chat => 
          chat.id === chatId ? { ...chat, unread: 0 } : chat
        ));
      };
      
      // Get current chat details
      const currentChat = recentChats.find(chat => chat.id === activeChat);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
            <MessageCircle />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">Recent Chats</SheetTitle>
        </SheetHeader>
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
        <SheetFooter>
          <SheetClose asChild>
            <Button asChild>
                <Link href="/chat">Open Chats</Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
