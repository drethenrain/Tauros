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

    if (player.state !== 'CONNECTED') player.connect();

    let res;

    try {
      res = await client.manager.search(search, message.member.user);
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
      // eslint-disable-next-line default-case
      switch (res.loadType) {
        case 'NO_MATCHES':
          message.reply('Música não encontrada!');
          break;
        case 'SEARCH_RESULT':
          player.queue.add(res.tracks[0]);
          message.reply(`\`${res.tracks[0].title}\` adicionada à fila.`);

          if (!player.playing) player.play();

          break;
        case 'TRACK_LOADED':
          break;

        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);
          message.reply(
            `Adicionei \`${res.tracks.length}\` músicas da playlist`
          );

          if (!player.playing) player.play();

          break;
      }
    } catch (err) {
      return message.reply({
        content: `Aconteceu um erro ao tentar buscar a música: **${err.message}**`
      });
    }
  }
};
