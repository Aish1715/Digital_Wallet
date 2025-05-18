# Digital Wallet Backend 
A RESTful Node.js/Express backend for a digital wallet system with user authentication, wallet operations, fraud detection, and admin reporting features.


## Features 

### User & Authentication
- Register and login using JWT-based authentication
- Soft delete support for users

### Wallet Operations
- Deposit and withdraw virtual cash
- Transfer money between users
- View transaction history

### Fraud Detection & Logging
- Flags large transfers and rapid repeated transfers
- Daily scheduled scan for anomalies
- Mock email alerts for suspicious activity

### Admin APIs
- View all flagged transactions
- View all user balances and total balance
- Get top users by balance and transaction volume

---

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs, jsonwebtoken
- node-cron (for daily tasks)
- Postman for testing

