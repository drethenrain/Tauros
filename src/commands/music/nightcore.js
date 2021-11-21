module.exports = {
  config: {
    name: 'nightcore',
    aliases: []
  },
  run: async (client, message, args) => {
    const player = client.manager.get(message.guild.id);
    if (!player)
      return message.reply({
        content: 'Não estou tocando neste servidor.'
      });

    const { enabled } = player.nightcore
      ? { enabled: false }
      : { enabled: true };

    player.nightcore = enabled;

    message.reply(
      `Nightcore foi definido como ${enabled ? '`ligado`' : '`desligado`'}`
    );
  }
};
