const express = require('express');
const cors = require('cors');
const { authenticate, getCurrentUser, login, signup } = require('./auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: false,
}));
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/signup', (req, res, next) => {
  signup(req, res).catch(next);
});

app.post('/api/auth/login', (req, res, next) => {
  login(req, res).catch(next);
});

app.get('/api/auth/me', authenticate, getCurrentUser);

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Something went wrong on the SmartShop server.',
  });
});

module.exports = app;
