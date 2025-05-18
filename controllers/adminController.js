const User = require('../models/User');
const Transaction = require('../models/Transaction');

// View all flagged transactions
exports.getFlaggedTransactions = async (req, res) => {
  try {
    const flagged = await Transaction.find({ flagged: true }).sort({ timestamp: -1 });
    res.json(flagged);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Aggregate total user balances
exports.getTotalBalances = async (req, res) => {
  try {
    const users = await User.find().select('username balance');

    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

    res.json({
      totalBalance,
      users: users.map(u => ({
        username: u.username,
        balance: u.balance
      }))
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Top users by balance or transaction volume
exports.getTopUsers = async (req, res) => {
  try {
    // Top 5 by balance
    const topByBalance = await User.find().sort({ balance: -1 }).limit(3);

    // Top 5 by transaction volume (count)
    const volume = await Transaction.aggregate([
      {
        $group: {
          _id: '$from',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      topByBalance,
      topByTransactionVolume: volume
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
