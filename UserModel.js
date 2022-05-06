const {Schema, model} = require('mongoose');

const schema = new Schema({
  chatId: Number,
  username: String,
  cities: [],
  sunscribe: String
});

const User = model('User', schema);

module.exports = User;