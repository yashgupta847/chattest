import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const UserList = ({ users = [], onSelect = () => {} }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
      <h3 className="text-xl font-bold mb-4 text-center text-white">Start Chat With</h3>
      
      <div className="space-y-2">
        {users.length > 0 ? (
          users.map((user) => (
            <button 
              key={user._id} 
              onClick={() => onSelect(user)}
              className="w-full p-3 flex items-center rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <FaUserCircle className="text-2xl text-white/80 mr-3" />
              <span className="font-medium">{user.name || 'Unknown User'}</span>
            </button>
          ))
        ) : (
          <p className="text-center text-white/60">No users available</p>
        )}
      </div>
      
    </div>
  );
};

export default UserList;
