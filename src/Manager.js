const { Manager } = require('erela.js');
const Filters = require('erela.js-filters');
const { default: Spotify } = require('better-erela.js-spotify');
const Deezer = require('erela.js-deezer');

module.exports = client =>
  new Manager({
    nodes: client.config.nodes,
    autoPlay: true,
    plugins: [
      new Filters(),
      new Spotify({
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        strategy: 'API'
      }),
      new Deezer()
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  })
    .on('nodeConnect', node =>
      console.log(`[LAVALINK] ${node.options.identifier} conectado.`)
    )
    .on('nodeError', (node, error) =>
      console.log(
        `Node "${node.options.identifier}" encountered an error: ${error.message}.`
      )
    )
    .on('trackStart', (player, track) => {
      const channel = client.channels.cache.get(player.textChannel);
      channel.send(
        `Tocando agora: \`${track.title}\`, solicitado por ${track.requester.username}.`
      );
    })
    .on('queueEnd', player => {
      const channel = client.channels.cache.get(player.textChannel);
      channel.send('A fila de músicas acabou.');
      player.destroy();
    });
