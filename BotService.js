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
  }

  commandsForecast() {
    const keyboard = Keyboard.make([
      Key.callback('Додати місто', 'addSity'),
      Key.callback('Мої міста', 'addSity'),
      Key.location('Відправити мою локацію'),
    ]).reply();

    return keyboard;
  }

  commandsMyCities(cities) {
    const buttons = cities.map(el => {
      return Key.callback(el, el);
    })
    const keyboard = Keyboard.make(buttons).inline();

    return keyboard;
  }

  async botStartHandler(msg){
    const chatId = msg.chat.id;
    const username = msg.from.first_name ? msg.from.first_name : msg.from.username;

    await userService.createUser(chatId, username);

    const keyboard = this.commandsForecast();
    this.bot.sendMessage(chatId, `Вітаю ${username}. Вас вітає бот прогнозу погоди.`);
    this.bot.sendMessage(chatId, 'Виберіть наступну дію', keyboard);
  }

  async botAddCitytHandler(msg) {
    const chatId = msg.chat.id;
    this.addCityList.push(chatId);

    this.bot.sendMessage(chatId, 'Введіть назву вашого міста');
  }

  async botMyCitytHandler(msg) {
    const chatId = msg.chat.id;
    const cities = await userService.getSitiesUser(chatId);

    console.log(cities);
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

      this.sendForecastCity(chatId, city);
    }else{
      this.bot.sendMessage(chatId, 'Невідома команда');
    }
    
  }

  async sendForecastCity(chatId, city=null, location=null) {
    
    if (city) {
      await userService.addCity(chatId, city);
    }
    const forecast = await weatherService.getForecastCity(city, location);
    
    const forecastText =
      `Прогноз погоди в ${forecast.cityName}:
      ${forecast.description}
      Тепература: ${forecast.temp}С
      Вологість: ${forecast.humidity}`;

    console.log(forecast.fileName);
    const rs = fs.readFileSync(forecast.fileName);
      
    this.bot.sendPhoto(
      chatId,
      //forecast.fileName,
      rs,
      { caption: forecastText });

    const keyboard = this.commandsForecast();
    this.bot.sendMessage(chatId, 'Виберіть наступну дію', keyboard);
  }

  async botCallbackHandler(msg){
    const chatId = msg.message.chat.id;
    const city = msg.data;
      
    this.sendForecastCity(chatId, city);
  }

  async botLocationHandler(msg) {
    const chatId = msg.chat.id;
    const location = msg.location;

    this.sendForecastCity(chatId, null, location);
  }
}

module.exports = BotService;