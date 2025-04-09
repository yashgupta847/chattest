import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

const ChatPage = ({ room, myId }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
      console.log("message is recieved", data)
    });

    return () => {
      socket.off("receive_message");
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      const data = { room, message, sender: myId };
      socket.emit("send_message", data);
      setChat((prev) => [...prev, data]);
      setMessage("");
      console.log("message is sent",data)
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room: {room}</h2>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid gray", padding: 10 }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ margin: "8px 0", textAlign: msg.sender === myId ? "right" : "left" }}>
            <strong>{msg.sender}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message"
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
