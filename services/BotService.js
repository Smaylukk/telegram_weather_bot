const TelegramBot = require('node-telegram-bot-api/src/telegram');
const {Keyboard, Key } = require('telegram-keyboard')
const userService = require('./userService');
const weatherService = require('./weatherService');
const tokens = require('./env');
const fs = require('fs');

class BotService {

  constructor(bot){
    this.bot = bot || new TelegramBot(tokens.TELEGRAM_TOKEN, { polling: true });
    this.addCityList = [];
    this.forecastList = [];
  }

  commandsForecast() {
    const keyboard = Keyboard.make([
      Key.callback('Прогноз', 'forecast'),
      Key.callback('Додати місто', 'addSity'),
      Key.callback('Мої міста', 'addSity'),
      Key.location('Відправити мою локацію')], 
      {columns: 3}).reply();

    return keyboard;
  }

  commandsMyCities(cities) {
    const buttons = cities.map(el => {
      return Key.callback(el, el);
    })

    buttons.unshift(Key.callback('Очистити список', 'clearAll'));
    const keyboard = Keyboard.make(buttons, {columns: 1}).inline();

    return keyboard;
  }  

  async botStartHandler(msg){
    const chatId = msg.chat.id;
    const username = msg.from.first_name ? msg.from.first_name : msg.from.username;

    try {
      await userService.createUser(chatId, username);
    } catch (error) {
      console.log(error);
    }    

    const keyboard = this.commandsForecast();
    this.bot.sendMessage(chatId, `Вітаю ${username}. Вас вітає бот прогнозу погоди.`);
    this.bot.sendMessage(chatId, 'Виберіть наступну дію', keyboard);
  }

  async botAddCitytHandler(msg) {
    const chatId = msg.chat.id;
    this.addCityList.push(chatId);

    this.bot.sendMessage(chatId, 'Введіть назву вашого міста');
  }

  async botForecastHandler(msg) {
    const chatId = msg.chat.id;
    this.forecastList.push(chatId);

    this.bot.sendMessage(chatId, 'Введіть назву вашого міста');
  }

  async botMyCitytHandler(msg) {
    const chatId = msg.chat.id;
    let cities = [];
    try {
      cities = await userService.getSitiesUser(chatId);
    } catch (error) {
      console.log(error);
    }

    const keyboard = this.commandsMyCities(cities);
    this.bot.sendMessage(chatId, 'Виберіть ваше місто', keyboard);
  }

  async botTextHandler(msg) {
    const chatId = msg.chat.id;
    const city = msg.text;
    if (this.addCityList.includes(chatId)) {
      this.addCityList = this.addCityList.filter((val) => {
        val !== chatId;
      });

      if (city) {
        try {
          await userService.addCity(chatId, city);
        } catch (error) {
          console.log(error);
        }
      }

      this.sendForecastCity(chatId, city);
    } else if (this.forecastList.includes(chatId)) {
      this.forecastList = this.forecastList.filter((val) => {
        val !== chatId;
      });

      this.sendForecastCity(chatId, city);
    } else {
      this.bot.sendMessage(chatId, 'Невідома команда');
    }    
  }

  async sendForecastCity(chatId, city=null, location=null) {
    const forecast = await weatherService.getForecastCity(city, location);
    
    if (forecast.length) {
      let forecastText = `Прогноз погоди ${forecast.cityName === null ? 'за вашими координатами' : ' в ' + city}:`;
      forecast.forEach(element => {
        let emo = this.getWeatherEmo(element.iconId);

        forecastText += `
      📅 ${element.day} - ${emo} ${Math.round(element.temp_day)}/${Math.round(element.temp_night)}°C - ${element.description}`;
      })

      this.bot.sendMessage(chatId, forecastText);
    } else {
      this.bot.sendMessage(chatId, `Місто ${city} не знайдено`);
    }

    const keyboard = this.commandsForecast();
    this.bot.sendMessage(chatId, 'Виберіть наступну дію', keyboard);
  }

  getWeatherEmo(code) {
    if (code >= 200 && code <= 232) {
      return '⛈';
    } else if (code >= 300 && code <= 321) {
      return '🌧';
    } else if (code >= 500 && code <= 504) {
      return '🌦';
    } else if (code === 511) {
      return '❄';
    } else if (code >= 520 && code <= 531) {
      return '🌧';
    } else if (code >= 600 && code <= 622) {
      return '❄';
    } else if (code >= 701 && code <= 781) {
      return '🌫';
    } else if (code === 800) {
      return '🌞';
    } else if (code === 801) {
      return '⛅';
    } else if (code >= 802 && code <= 804) {
      return '☁';
    } else {
      return '';
    }
  }

  async clearAllCities(chatId){
    try {
      await userService.clearAllSitiesUser(chatId);

      this.bot.sendMessage(chatId, 'Список ваших міст очищено');
    } catch (error) {
      this.bot.sendMessage(chatId, 'Виникла помилка під час операції');
      console.log(error);
    }

    const keyboard = this.commandsForecast();
    this.bot.sendMessage(chatId, 'Виберіть наступну дію', keyboard);
  }

  async botCallbackHandler(msg){
    const chatId = msg.message.chat.id;
    const city = msg.data;

    if (city === 'clearAll') {
      this.clearAllCities(chatId);
    }else{
      this.sendForecastCity(chatId, city);
    }
  }

  async botLocationHandler(msg) {
    const chatId = msg.chat.id;
    const location = msg.location;

    this.sendForecastCity(chatId, null, location);
  }
}

module.exports = BotService;