const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false }, // for fraud
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
