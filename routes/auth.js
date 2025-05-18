const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Soft delete user account and transactions
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, deleted: false });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Soft delete user
    user.deleted = true;
    await user.save();

    // Soft delete related transactions
    await Transaction.updateMany(
      { $or: [{ from: user._id }, { to: user._id }] },
      { $set: { deleted: true } }
    );

    res.json({ msg: 'Account and transactions soft-deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
