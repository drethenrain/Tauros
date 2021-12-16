const { MessageEmbed } = require('discord.js');
const Weather = require('../../apis/Weather');

module.exports = {
  config: {
    name: 'weather',
    aliases: ['clima']
  },
  run: async (client, message, args) => {
    if (!args[0]) return message.reply('Digite o nome da cidade');

    Weather.getData(args.join(' '))
      .then(res =>
        message.reply({
          embeds: [
            new MessageEmbed()
              .setColor('#f8f8f8')
              .setThumbnail(res.iconURL)
              .setTitle(`Tempo em ${res.city}, ${res.countryCode}`)
              .addField('Clima', res.description)
              .addField('Temperatura', `${res.temperature}°c`)
              .addField('Sensação Térmica', `${res.feelsLike}°c`)
              .addField('Humidade', `${res.humidity}%`)
              .addField(
                'Coordenadas',
                `Latitude: \`${res.coord.lat}\`\nLongitude: \`${res.coord.lon}\``
              )

              .setFooter(
                `Requisitado por ${message.author.username}`,
                message.author.displayAvatarURL()
              )
              .setTimestamp()
          ]
        })
      )
      .catch(e => message.reply('Essa cidade não existe'));
  }
};
