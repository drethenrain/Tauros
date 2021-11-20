const Guild = require('../../models/Guild');

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === 'dm') return;

  const guild = await Guild.findOne({ _id: message.guild.id });
  const prefix = guild.prefix || process.env.PREFIX;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (message.content === `<@!${client.user.id}>`)
    message.reply(`O meu prefixo aqui é \`${prefix}\``);

  if (!message.content.startsWith(prefix)) return;

  const commandInfo =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));

  if (commandInfo) {
    commandInfo.run(client, message, args);
  }
};
