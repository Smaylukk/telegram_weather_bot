const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  WEATHER_TOKEN: process.env.WEATHER_TOKEN,
  MONGO_URL: process.env.MONGO_URL
}