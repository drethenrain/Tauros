const { default: axios } = require('axios');
const { normalize, capitalize } = require('../utils');
const Base = require('./BaseAPIWrapper');

class Weather extends Base {
  constructor() {
    super({
      name: 'OpenWeather',
      url: 'https://api.openweathermap.org/data/2.5/weather'
    });
  }

  async getData(city) {
    const { data } = await axios(this.url, {
      params: {
        appid: process.env.WEATHER_ID,
        units: 'metric',
        lang: 'pt_br',
        q: normalize(city)
      }
    });

    return {
      city: data.name,
      coord: data.coord,
      countryCode: data.sys.country,
      description: capitalize(data.weather[0].description),
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      iconURL: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
      temperature: data.main.temp
    };
  }
}

module.exports = new Weather();
