const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/admin', require('./routes/admin'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const cron = require('node-cron');
const scanForFraud = require('./utils/fraudScanner');

// Run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('⏰ Running daily fraud scan...');
  scanForFraud();
});
