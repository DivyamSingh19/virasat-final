"use client";
import React from "react";

export default function ChatPage() {
  const [recentChats, setRecentChats] = React.useState([
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Can we discuss the project timeline?",
      time: "10:30 AM",
      unread: 2,
      avatar: "https://avatar.iran.liara.run/username?username=Sarah+Johnson",
    },
    {
      id: 2,
      name: "David Miller",
      lastMessage: "I've sent you the files you requested",
      time: "Yesterday",
      unread: 0,
      avatar: `https://avatar.iran.liara.run/username?username=David+Miller`,
    },
    {
      id: 3,
      name: "Alex Wong",
      lastMessage: "Let's schedule a meeting for next week",
      time: "Yesterday",
      unread: 3,
      avatar: "https://avatar.iran.liara.run/username?username=David+Miller",
    },
    {
      id: 4,
      name: "Emma Thompson",
      lastMessage: "Thanks for the update!",
      time: "2 days ago",
      unread: 0,
      avatar: "https://avatar.iran.liara.run/username?username=David+Miller",
    },
    {
      id: 5,
      name: "Michael Garcia",
      lastMessage: "Could you review the documentation?",
      time: "3 days ago",
      unread: 0,
      avatar: "https://avatar.iran.liara.run/public",
    },
    {
        id: 6,
        name: "Michael Garcia",
        lastMessage: "Could you review the documentation?",
        time: "3 days ago",
        unread: 0,
        avatar: "https://avatar.iran.liara.run/public",
      },
      {
        id: 7,
        name: "Michael Garcia",
        lastMessage: "Could you review the documentation?",
        time: "3 days ago",
        unread: 0,
        avatar: "https://avatar.iran.liara.run/public",
      },
      {
        id: 8,
        name: "Michael Garcia",
        lastMessage: "Could you review the documentation?",
        time: "3 days ago",
        unread: 0,
        avatar: "https://avatar.iran.liara.run/public",
      },
      {
        id: 9,
        name: "Michael Garcia",
        lastMessage: "Could you review the documentation?",
        time: "3 days ago",
        unread: 0,
        avatar: "https://avatar.iran.liara.run/public",
      },
      {
        id: 10,
        name: "Michael Garcia",
        lastMessage: "Could you review the documentation?",
        time: "3 days ago",
        unread: 0,
        avatar: "https://avatar.iran.liara.run/public",
      },
  ]);

  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: 1,
      text: "Hi there! How's the dashboard coming along?",
      time: "10:15 AM",
    },
    {
      id: 2,
      sender: 0,
      text: "It's going well! I'm working on the chat interface now.",
      time: "10:20 AM",
    },
    {
      id: 3,
      sender: 1,
      text: "That sounds great! Can we discuss the project timeline?",
      time: "10:30 AM",
    },
  ]);
  const [activeChat, setActiveChat] = React.useState(1);
  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: 0, // 0 represents the current user
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleChatSelect = (chatId: any) => {
    setActiveChat(chatId);

    // Mark as read when selected
    setRecentChats(
      recentChats.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  const currentChat = recentChats.find((chat) => chat.id === activeChat);

  return (
    <div>
      <h1 className="text-3xl font-semibold">My Chats</h1>
        <div className="flex gap-2 mt-5">
        <div className="">
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
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white p-4 shadow flex items-center">
          <img
            src={currentChat?.avatar}
            alt={currentChat?.name}
            className="h-10 w-10 rounded-full mr-3"
            />
          <div>
            <h2 className="text-lg font-semibold">{currentChat?.name}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
              <div
              key={message.id}
              className={`flex ${
                  message.sender === 0 ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    message.sender === 0
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                      message.sender === 0 ? "text-blue-100" : "text-gray-500"
                    }`}
                    >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="bg-white p-4 border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
              onClick={handleSendMessage}
              >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
