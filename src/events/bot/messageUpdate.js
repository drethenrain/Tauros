module.exports = async (client, oldMessage, newMessage) => {
  if (!oldMessage || !newMessage || oldMessage === newMessage) return;
  client.emit('messageCreate', newMessage);
};
