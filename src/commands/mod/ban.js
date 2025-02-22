const { Permissions } = require('discord.js');

module.exports = {
  config: {
    name: 'ban',
    aliases: ['banir']
  },
  run: async (client, message, args) => {
    const member = message.mentions.members.first();

    if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply('Não tenho permissão de `Banir Membros`');

    if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply('Você não tem a permissão de `Banir Membros`');

    if (!member) return message.reply('Mencione um membro para ser banido');

    if (member) {
      if (member.user === message.author)
        return message.reply('Você não pode banir a si mesmo');

      if (
        member.roles.highest.rawPosition >=
        message.guild.me.roles.highest.rawPosition
      ) {
        message.reply('Esse membro tem um cargo maior que o meu');
      } else {
        message.react('✅');
        member.ban();
        message.reply(`Sucesso em banir o membro: \`${member.user.tag}\``);
      }
    }
  }
};
