module.exports = {
  config: {
    name: 'shuffle',
    aliases: ['embaralhar']
  },
  run: async (client, message, args) => {
    const player = client.manager.get(message.guild.id);
    if (!player)
      return message.reply({
        content: 'Não estou tocando neste servidor.'
      });

    const memberVoiceChannel = message.member.voice.channel;
    if (!memberVoiceChannel)
      return message.reply({
        content: 'Você precisa estar em um canal de voz para usar este comando.'
      });
    if (memberVoiceChannel.id !== player.voiceChannel)
      return message.reply({
        content: 'Você precisa estar no mesmo canal de voz que eu.'
      });

    if (player.queue.length < 3)
      message.reply('Poucas músicas na lista para embaralhar');

    player.queue.shuffle();
    message.reply('Lista de músicas embaralhada');
  }
};
