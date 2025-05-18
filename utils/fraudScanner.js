const Transaction = require('../models/Transaction');

async function scanForFraud() {
  const suspicious = await Transaction.find({
    $or: [
      { amount: { $gt: 1000 } },
      {
        timestamp: { $gte: new Date(Date.now() - 60 * 1000) },
        type: 'transfer'
      }
    ],
    flagged: false
  });

  for (const tx of suspicious) {
    tx.flagged = true;
    await tx.save();
    console.log(`🔍 Daily Fraud Scan: Flagged transaction ${tx._id}`);
  }
}

module.exports = scanForFraud;
