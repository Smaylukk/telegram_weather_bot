const {Schema, model} = require('mongoose');

const schema = new Schema({
  chatId: Number,
  username: String,
  cities: []  
});

const User = model('User', schema);

module.exports = User;