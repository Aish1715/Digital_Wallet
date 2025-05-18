const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// All routes protected by auth (assumes only admin uses this in your case)
router.get('/flagged-transactions', auth, adminController.getFlaggedTransactions);
router.get('/total-balances', auth, adminController.getTotalBalances);
router.get('/top-users', auth, adminController.getTopUsers);

module.exports = router;
