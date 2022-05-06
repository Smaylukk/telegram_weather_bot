const User = require('../models/UserModel');

class UserService {
  
  async createUser(chatId, username){
    const candidate = await User.findOne({chatId});
    if (!candidate) {
      const user = await User.create({
        chatId,
        username,
        cities: []
      });
    }
  }

  async getSitiesUser(chatId) {
    const user = await User.findOne({ chatId });
    if (user) {
      return user.cities;
    }
    return [];
  }

  async clearAllSitiesUser(chatId) {
    const user = await User.findOneAndUpdate(
      { chatId },
      {cities: []});
  }

  async addCity(chatId, city) {
    const user = await User.findOne({ chatId });
    if (user) {
      let cities = user.cities;
      if (!cities.includes(city)) {
        cities.push(city);
        const result = User.findOneAndUpdate({chatId}, {cities})
        return result;
      }
    }else{
      throw new Error(`Не знайдено користувача з id ${chatId}`);
    }
  }
}

module.exports = new UserService();