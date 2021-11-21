/* eslint-disable indent */
module.exports = {
  config: {
    name: 'play',
    aliases: ['tocar']
  },
  run: async (client, message, args) => {
    if (!message.member.voice.channel)
      return message.reply({
        content:
          'Você precisa estar em um canal de voz para utilizar este comando!'
      });
    if (
      message.guild.me.voice.channel &&
      message.guild.me.voice.channel.id !== message.member.voice.channel.id
    )
      return message.reply({
        content:
          'Você precisa estar no mesmo canal de voz que eu para utilizar este comando!'
      });

    const search = args.join(' ');
    if (!search)
      return message.reply(
        'Tente novamente com o nome/link da música ou o link de uma playlist'
      );

    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true
    });

    try {
      if (player.state !== 'CONNECTED') player.connect();

      const { loadType, tracks, exception } = await player.search(
        search,
        message.member.user
      );

      if (loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        message.reply(
          `Aconteceu um erro ao tentar tocar a musica: ${exception?.message}`
        );
      } else if (loadType === 'NO_MATCHES') {
        message.reply('Música não encontrada!');
      }

      switch (loadType) {
        case 'PLAYLIST_LOADED':
          player.queue.add(tracks);
          if (!player.playing) player.play();

          message.reply(`Adicionei \`${tracks.length}\` músicas da playlist`);
          break;
        default:
          player.queue.add(tracks[0]);
          if (!player.playing) player.play();

          message.reply(`\`${tracks[0].title}\` adicionada à fila.`);
          break;
      }
    } catch (err) {
      return message.reply({
        content: `Aconteceu um erro ao tentar buscar a música: **${err.message}**`
      });
    }
  }
};
