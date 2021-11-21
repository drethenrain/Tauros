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

    try {
      if (player.state !== 'CONNECTED') player.connect();

      const { loadType, tracks, exception } = await player.search(
        search,
        interaction.member.user
      );

      if (loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        interaction.reply(
          `Aconteceu um erro ao tentar tocar a musica: ${exception?.message}`
        );
      } else if (loadType === 'NO_MATCHES') {
        interaction.reply('Música não encontrada!');
      }

      switch (loadType) {
        case 'PLAYLIST_LOADED':
          player.queue.add(tracks);
          if (!player.playing) player.play();

          interaction.reply(
            `Adicionei \`${tracks.length}\` músicas da playlist`
          );
          break;
        default:
          player.queue.add(tracks[0]);
          if (!player.playing) player.play();

          interaction.reply(`\`${tracks[0].title}\` adicionada à fila.`);
          break;
      }
    } catch (err) {
      return interaction.reply({
        content: `Aconteceu um erro ao tentar buscar a música: **${err.message}**`
      });
    }
  }
};
