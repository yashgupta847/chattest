import React from 'react';
const UserList = ({ users, onSelect }) => {
  return (
    <div>
      <h3>Start Chat With:</h3>
      {users.map((user) => (
        <button key={user._id} onClick={() => onSelect(user)}>
          {user.name}
        </button>
      ))}
    </div>
  );
};

export default UserList;
