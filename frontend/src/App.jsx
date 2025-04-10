import React, { useState } from 'react';
import { FaComment, FaPaperPlane } from 'react-icons/fa';
import ChatPage from './ChatPage'; // Make sure this is imported

const App = () => {
  const [myId, setMyId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [room, setRoom] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const joinRoom = () => {
    if (myId && friendId) {
      const sortedRoom = [myId, friendId].sort().join("_");
      setRoom(sortedRoom);
      setChatStarted(true);
      setError("");
    } else {
      setError("Please enter both IDs");
    }
  };

  if (chatStarted) {
    return <ChatPage room={room} myId={myId} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <FaComment className="text-5xl text-gradient bg-gradient-to-r from-purple-500 to-pink-500" />
          <h1 className="text-3xl font-bold ml-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">ChatVibe</h1>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Join the conversation</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center text-white">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Your ID</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="input-field"
              onChange={(e) => setMyId(e.target.value)}
              value={myId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Friend's ID</label>
            <input
              type="text"
              placeholder="Who do you want to chat with?"
              className="input-field"
              onChange={(e) => setFriendId(e.target.value)}
              value={friendId}
            />
          </div>

          <button
            className="btn btn-primary w-full mt-6 flex items-center justify-center"
            onClick={joinRoom}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center">
                Start Chat <FaPaperPlane className="ml-2" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;