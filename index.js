const { default: mongoose } = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const tokens = require('./services/env');
const BotService = require('./services/BotService');

const bot = new TelegramBot(tokens.TELEGRAM_TOKEN, { polling: true });
const botService = new BotService(bot);

const start = async () => {
  mongoose.connect(tokens.MONGO_URL, (err) => {
    if (err) {
      console.log(`Помилка при підключенні${err}`);
    } else {
      console.log(`Підключення до БД встановлено`);
    }
  });

  

  bot.setMyCommands([
    { command: '/start', description: 'Старт' },
  ])

  bot.on('text', async (msg) => {

    try {
      //console.log('text', msg);
      
      switch (msg.text) {
        case '/start':
          botService.botStartHandler(msg); 
          break;
        case 'Додати місто':
          botService.botAddCitytHandler(msg);
          break;
        case 'Прогноз':
          botService.botForecastHandler(msg);
          break;
        case 'Мої міста':
          botService.botMyCitytHandler(msg);
          break;
        default:
          botService.botTextHandler(msg);
          break;
      }
      
    } catch (error) {
      console.log(error);
    }

  });

  bot.on('callback_query', async (msg) => {

    try {
      //console.log('callback', msg);
      botService.botCallbackHandler(msg);

    } catch (error) {
      console.log(error);
    }

  });

  bot.on('location', async (msg) => {

    try {
      //console.log('location', msg);
      botService.botLocationHandler(msg);

    } catch (error) {
      console.log(error);
    }

  });
}
//bot.sendPhoto('', '', {}, {contentType:''})
start();