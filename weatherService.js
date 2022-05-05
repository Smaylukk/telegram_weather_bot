const axios = require('axios').default;
const path = require('path');
const fs = require('fs');
const tokens = require('./env');

class WeatherService {
  constructor(){
    this.token = tokens.WEATHER_TOKEN;
  }

  async getForecastCity(city, location){
    let url = '';
    if (city) {
      url = encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.token}&lang=ua&units=metric`);
    }else{
      url = encodeURI(`http://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${this.token}&lang=ua&units=metric`);
    }

    const res = await axios.get(url);
    const forecast = res.data;
    
    const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    const iconName = `${forecast.weather[0].icon}.png`;
    const fileName = path.resolve(__dirname, 'files', iconName)
    await this.downloadFile(iconUrl, fileName);

    const description = forecast.weather[0].description;
    const temp = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const cityName = forecast.name;

    return{
      description,
      iconUrl,
      iconName,
      temp,
      humidity,
      cityName,
      fileName
    }

  }

  async downloadFile(url, fileName) {
    const ws = fs.createWriteStream(fileName);
    axios.get(url, {responseType: 'stream'})
    .then((res) => {
      res.data.pipe(ws);
    }, rej => {
      console.log(rej.data);
    })
  }
}

module.exports = new WeatherService();