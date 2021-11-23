const { exec } = require('child_process');

module.exports = {
  config: {
    name: 'shell',
    aliases: ['sh']
  },
  run: async (client, message, args) => {
    if (message.author.id !== '557216693676408832')
      return message.reply('❌ Você não tem permissão para usar esse comando.');

    const code = args.join(' ');

    if (!code)
      return message.reply('Especifique o codigo que você deseja executar.');

    exec(code, async (err, stdout, stderr) => {
      if (!stdout && !stderr) message.reply('Sem resultado');

      const res = stdout || stderr;

      if (res.length < 2000) {
        if (stderr) {
          message.reply(`📥 Erro:\n \`\`\`sh\n${res}\`\`\``);
        } else {
          message.reply(`📥 Resultado:\n \`\`\`sh\n${res}\`\`\``);
        }
      } else if (stderr) {
        message.reply({
          content: '📥 Erro:',
          files: [
            {
              name: 'shell.sh',
              attachment: Buffer.from(res)
            }
          ]
        });
      } else {
        message.reply({
          content: '📥 Resultado:',
          files: [
            {
              name: 'shell.sh',
              attachment: Buffer.from(res)
            }
          ]
        });
      }
    });
  }
};
