import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaArrowLeft, FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

const ChatPage = ({ room, myId, friendId, onBack }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);
    socket.emit("user_connected", myId); // ✅ Notify server this user is online
    socket.emit("check_online_status", friendId); // ✅ Check friend status

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
      setIsTyping(false);
    });

    socket.on("user_online", (id) => {
      if (id === friendId) setIsOnline(true);
    });

    socket.on("user_offline", (id) => {
      if (id === friendId) setIsOnline(false);
    });

    const handleBeforeUnload = () => {
      socket.emit("user_disconnected", myId); // ✅ Emit on tab close
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.emit("user_disconnected", myId); // ✅ Emit on component unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("receive_message");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [room, myId, friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (message.trim()) {
      const data = { room, message, sender: myId, timestamp: new Date().toISOString() };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="p-4 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center">
        <button 
          onClick={onBack}
          className="mr-3 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div className="flex items-center">
          <div className="relative">
            <FaUserCircle className="text-3xl text-white/80" />
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'} border-2 border-indigo-900`}></div>
          </div>
          <div className="ml-3">
            <h2 className="font-bold">{friendId || 'Friend'}</h2>
            <p className="text-xs text-white/60">{isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </div>

      <div 
        ref={messageContainerRef}
        className="flex-1 p-4 overflow-y-auto" 
        style={{ backgroundImage: 'url("https://transparenttextures.com/patterns/cubes.png")' }}
      >
        <div className="space-y-3 px-2">
          {chat.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.sender === myId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`message-bubble ${
                  msg.sender === myId 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                    : 'bg-white/20 backdrop-blur-sm'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex flex-col">
                  <span className="mb-1">{msg.message}</span>
                  <span className="text-xs opacity-70 text-right">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="message-bubble bg-white/20 backdrop-blur-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex items-center">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="input-field py-2 min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <button 
            onClick={sendMessage}
            className="ml-2 p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
