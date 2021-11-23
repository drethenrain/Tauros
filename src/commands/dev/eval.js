module.exports = {
  config: {
    name: 'eval',
    aliases: []
  },
  run: async (client, message, args) => {
    if (message.author.id !== '557216693676408832')
      return message.reply('❌ Você não tem permissão para usar esse comando.');

    const code = args.join(' ');

    if (!code)
      return message.reply('Especifique o codigo que você deseja executar.');

    try {
      // eslint-disable-next-line no-eval
      let evaled = eval(code);
      evaled = clean(evaled);

      if (evaled.length < 2000) {
        message.reply(
          `🎈 Tipo: ${getType(
            evaled
          )}\n📥 Resultado: \n \`\`\`js\n${evaled}\`\`\``
        );
      } else {
        message.reply({
          content: `🎈 Tipo: ${getType(evaled)}\n📥 Resultado:`,
          files: [
            {
              name: 'eval.js',
              attachment: Buffer.from(evaled)
            }
          ]
        });
      }
    } catch (err) {
      message.reply(`📤 Erro: \n \`\`\`js\n${err}\`\`\``);
    }
  }
};

const clean = text => {
  if (typeof text !== 'string')
    text = require('util').inspect(text, {
      depth: 0
    });

  text = text
    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
    .replace(/@/g, `@${String.fromCharCode(8203)}`)
    .replace(process.env.TOKEN, '😃');

  return text;
};

const getType = text => {
  if (text === null) return 'null';

  return text?.constructor?.name ?? typeof text;
};
