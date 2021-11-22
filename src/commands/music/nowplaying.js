const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'nowplaying',
    aliases: ['np']
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

    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle('Tocando Agora')
          .setThumbnail(player.queue.current.displayThumbnail('maxresdefault'))
          .setColor('#ffffff')
          .addField('Título:', `\`${player.queue.current.title}\``)
          .addField('Autor:', player.queue.current.author)
          .addField('Requisitado por:', `${player.queue.current.requester}`)
      ]
    });
  }
};
