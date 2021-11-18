/* eslint-disable indent */
module.exports = {
  config: {
    name: 'play',
    description: 'Tocar música',
    options: [
      {
        name: 'música',
        type: 'STRING',
        description: 'Nome da música para ser tocada',
        required: true
      }
    ]
  },
  run: async (client, interaction) => {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        content:
          'Você precisa estar em um canal de voz para utilizar este comando!'
      });
    if (
      interaction.guild.me.voice.channel &&
      interaction.guild.me.voice.channel.id !==
        interaction.member.voice.channel.id
    )
      return interaction.reply({
        content:
          'Você precisa estar no mesmo canal de voz que eu para utilizar este comando!'
      });

    const search = interaction.options.getString('música');

    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: true
    });

    if (player.state !== 'CONNECTED') player.connect();

    let res;

    try {
      res = await client.manager.search(search, interaction.member.user);
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
      // eslint-disable-next-line default-case
      switch (res.loadType) {
        case 'NO_MATCHES':
          interaction.reply('Música não encontrada!');
          break;
        case 'SEARCH_RESULT':
          player.queue.add(res.tracks[0]);
          interaction.reply(`\`${res.tracks[0].title}\` adicionada à fila.`);

          if (!player.playing) player.play();

          break;
        case 'TRACK_LOADED':
          break;

        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);
          interaction.reply(
            `Adicionei \`${res.tracks.length}\` músicas da playlist`
          );

          if (!player.playing) player.play();

          break;
      }
    } catch (err) {
      return interaction.reply({
        content: `Aconteceu um erro ao tentar buscar a música: **${err.message}**`
      });
    }
  }
};
