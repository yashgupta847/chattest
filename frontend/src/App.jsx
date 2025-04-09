import React, { useState } from 'react';
import ChatPage from './ChatPage';

const App = () => {
  const [myId, setMyId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [room, setRoom] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const joinRoom = () => {
    if (myId && friendId) {
      const sortedRoom = [myId, friendId].sort().join("_");
      setRoom(sortedRoom);
      setChatStarted(true);
    }
  };

  if (chatStarted) {
    return <ChatPage room={room} myId={myId} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Enter Chat IDs</h2>
      <input placeholder="Your ID" onChange={(e) => setMyId(e.target.value)} />
      <br /><br />
      <input placeholder="Friend's ID" onChange={(e) => setFriendId(e.target.value)} />
      <br /><br />
      <button onClick={joinRoom}>Start Chat</button>
    </div>
  );
};

export default App;
