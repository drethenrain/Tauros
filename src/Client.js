const { Client, Collection } = require('discord.js');
const { connect } = require('mongoose');
const Manager = require('./Manager');

module.exports = class extends Client {
  constructor(options) {
    super({
      intents: '32767',
      allowedMentions: {
        repliedUser: false
      },
      ...options
    });

    this.config = { nodes: [] };
    this.loadHandlers();

    if (process.env.LAVALINK_HOST) {
      this.config.nodes.push({
        identifier: 'Node Main',
        host: process.env.LAVALINK_HOST,
        password: process.env.LAVALINK_PASSWORD,
        port: Number(process.env.LAVALINK_PORT),
        retryAmount: 10,
        retryDelay: 3000
      });
    } else {
      this.config.nodes.push({
        identifier: 'Node Helper',
        host: 'lava.link',
        password: 'anything as a password',
        port: 80,
        retryAmount: 10,
        retryDelay: 3000
      });
    }

    this.manager = Manager(this);
  }

  loadHandlers() {
    ['commands', 'aliases', 'slash'].forEach(f => (this[f] = new Collection()));
    ['commands', 'events', 'slash'].forEach(f =>
      require(`./handlers/${f}`)(this)
    );
  }

  connectDatabase() {
    return connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }

  login() {
    super.login(process.env.TOKEN);
  }
};
