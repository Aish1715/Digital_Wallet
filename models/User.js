const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);


