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
    if (!search) return message.reply('digite o nome da música');

    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id
    });

    if (player.state !== 'CONNECTED') player.connect();

    let res;

    try {
      res = await client.manager.search(search, message.member.user);

      // eslint-disable-next-line default-case
      switch (res.loadType) {
        case 'LOAD_FAILED':
          if (!player.queue.current) player.destroy();
          throw res.exception;
        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);

          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length
          )
            player.play();
          break;
      }
    } catch (err) {
      return message.reply({
        content: `Aconteceu um erro ao tentar buscar a música: **${err.message}**`
      });
    }

    if (!res?.tracks?.[0])
      return message.reply({
        content: 'Música não encontrada!'
      });

    player.queue.add(res.tracks[0]);
    if (!player.playing && !player.paused) player.play();

    return message.reply({
      content: `\`${res.tracks[0].title}\` adicionada à fila.`
    });
  }
};
