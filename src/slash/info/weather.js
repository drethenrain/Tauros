const { MessageEmbed } = require('discord.js');
const Weather = require('../../apis/Weather');

module.exports = {
  config: {
    name: 'clima',
    description: 'Clima de uma cidade',
    options: [
      {
        name: 'cidade',
        type: 'STRING',
        description: 'Nome da cidade',
        required: true
      }
    ]
  },
  run: async (client, interaction) => {
    const city = interaction.options.getString('cidade');
    Weather.getData(city)
      .then(res =>
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('#f8f8f8')
              .setThumbnail(res.iconURL)
              .setTitle(`Tempo em ${res.city}`)
              .addField('Clima', res.description)
              .addField('Temperatura', `${res.temperature}°c`)
              .addField('Sensação', `${res.feelsLike}°c`)
              .addField('Humidade', `${res.humidity}%`)
              .addField(
                'Coordenadas',
                `Latitude: \`${res.coord.lat}\`\nLongitude: \`${res.coord.lon}\``
              )

              .setFooter(
                `Requisitado por ${interaction.user.username}`,
                interaction.user.displayAvatarURL()
              )
              .setTimestamp()
          ]
        })
      )
      .catch(e => interaction.reply('Essa cidade não existe'));
  }
};
