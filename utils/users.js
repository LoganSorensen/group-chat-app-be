const users = [];

// Add user to channel
function userJoin(id, username, channel) {
  const user = { id, username, channel };

  // console.log("user", user);

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// Remove user from channel
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get channel users
function getRoomUsers(channel) {
  return users.filter((user) => user.channel === channel);
}

module.exports = { users, userJoin, getCurrentUser, userLeave, getRoomUsers };
