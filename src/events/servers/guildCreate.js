const Guild = require('../../models/Guild');

module.exports = async (client, guild) =>
  Guild.create({
    _id: guild.id
  });
