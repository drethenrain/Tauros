module.exports = {
  config: {
    name: '8d',
    aliases: []
  },
  run: async (client, message, args) => {
    const player = client.manager.get(message.guild.id);
    if (!player)
      return message.reply({
        content: 'Não estou tocando neste servidor.'
      });

    const { enabled } = player.eightD ? { enabled: false } : { enabled: true };

    player.eightD = enabled;

    message.reply(
      `Áudio 8D foi definido como ${enabled ? '`ligado`' : '`desligado`'}`
    );
  }
};
