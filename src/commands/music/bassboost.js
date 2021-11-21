module.exports = {
  config: {
    name: 'bassboost',
    aliases: []
  },
  run: async (client, message, args) => {
    const player = client.manager.get(message.guild.id);
    if (!player)
      return message.reply({
        content: 'Não estou tocando neste servidor.'
      });

    const { enabled } = player.bassboost
      ? { enabled: false }
      : { enabled: true };

    player.bassboost = enabled;

    message.reply(
      `Bassboost foi definido como ${enabled ? '`ligado`' : '`desligado`'}`
    );
  }
};
