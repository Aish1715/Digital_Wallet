const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Deposit
exports.deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ msg: 'Invalid deposit amount' });

  const user = await User.findById(req.user.id);
  user.balance += amount;
  await user.save();

  await Transaction.create({ type: 'deposit', to: user._id, amount });
  res.json({ msg: 'Deposit successful', balance: user.balance });
};

// Withdraw
exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user.id);
  if (amount <= 0 || amount > user.balance) return res.status(400).json({ msg: 'Invalid withdrawal' });

  user.balance -= amount;
  await user.save();

  await Transaction.create({ type: 'withdraw', from: user._id, amount });
  res.json({ msg: 'Withdrawal successful', balance: user.balance });
};

// Transfer with basic fraud detection
exports.transfer = async (req, res) => {
  const { toUsername, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ msg: 'Invalid transfer amount' });

  const sender = await User.findById(req.user.id);
  const receiver = await User.findOne({ username: toUsername,deleted: false });

  if (!receiver) return res.status(404).json({ msg: 'Recipient not found' });
  if (sender._id.equals(receiver._id)) return res.status(400).json({ msg: 'Cannot transfer to self' });
  if (sender.balance < amount) return res.status(400).json({ msg: 'Insufficient balance' });

  // === Fraud Detection Logic ===
  let flagged = false;

  // Rule 1: Large transfer
  if (amount > 1000) {
    console.log('⚠️ Fraud Alert: Large transfer detected');
    flagged = true;
  }
  if (flagged) {
  console.log(`📧 Mock Email: Alert — suspicious transfer of ${amount} by ${sender.username}`);
  }
  // Rule 2: Too many recent transfers (3+ in last minute)
  const recentTransfers = await Transaction.find({
    from: sender._id,
    type: 'transfer',
    timestamp: { $gte: new Date(Date.now() - 60 * 1000) }
  });

  if (recentTransfers.length >= 3) {
    console.log('⚠️ Fraud Alert: Multiple rapid transfers detected');
    flagged = true;
  }

  // Update balances
  sender.balance -= amount;
  receiver.balance += amount;

  await sender.save();
  await receiver.save();

  await Transaction.create({
    type: 'transfer',
    from: sender._id,
    to: receiver._id,
    amount,
    flagged
  });

  res.json({ msg: 'Transfer successful', balance: sender.balance, flagged });
};

// Get user transactions
exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ from: req.user.id }, { to: req.user.id }]
  }).sort({ timestamp: -1 });

  res.json(transactions);
};
