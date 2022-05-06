const axios = require('axios').default;
const path = require('path');
const fs = require('fs');
const tokens = require('./env');

class WeatherService {
  constructor(){
    this.token = tokens.WEATHER_TOKEN;
  }

  async getCoordCity(city){
    let res = {
      lat: 0,
      lon: 0
    };

    let url = encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.token}`);
    try {
      let resCoord = await axios.get(url);
      if (resCoord.status == 200) {
        res.lat = resCoord.data.coord.lat;
        res.lon = resCoord.data.coord.lon;
      }  
    } catch (error) {
      console.log(error);
    }    

    return res;
  }

  async getForecastCity(city, location){
    let url = '';
    let lat = 0;
    let lon = 0;
    const result = [];
    
    if (city) {
      const coord = await this.getCoordCity(city);
      lat = coord.lat;
      lon = coord.lon;
    }else{
      lat = location.lat;
      lon = location.lon;
    }

    if (lon === 0 && lat === 0) {
      return result;
    }

    url = encodeURI(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.token}&lang=ua&units=metric&exclude=hourly,minutely`);

    const res = await axios.get(url);
    const forecast = res.data;
    
    const iconId = forecast.current.weather[0].id;
    const description = forecast.current.weather[0].description;
    const temp = forecast.current.temp;
    const humidity = forecast.current.humidity;    

    forecast.daily.forEach(element => {
      const day = new Date(element.dt * 1000).toLocaleDateString();
      result.push({
        day: day,
        description: element.weather[0].description,
        temp_day: element.temp.day,
        temp_night: element.temp.night,
        iconId: element.weather[0].id
      });
    });

    return result;
  }
}

module.exports = new WeatherService();