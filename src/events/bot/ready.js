module.exports = async client => {
  console.log(`[BOT] ${client.user.tag} está online`);

  client.manager.init(client.user.id);
  client
    .connectDatabase()
    .then(() => console.log('[DATABASE] Conectado ao Mongo'))
    .catch(console.log);
  client.application.commands.set([...client.slash.map(i => i.config)]);
};
