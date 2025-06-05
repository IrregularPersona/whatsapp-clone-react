require('dotenv').config();
const { initDatabase } = require('./database/schema');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./http/routes/auth');
const chatRoutes = require('./http/routes/chats');
const notificationRoutes = require('./http/routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting server initialization...');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
console.log('Checking data directory:', dataDir);

if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Data directory created successfully');
} else {
  console.log('Data directory already exists');
}

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory...');
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Public directory created successfully');
}

// Serve static files
app.use(express.static(publicDir));

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialized successfully');

    // Routes
    console.log('Setting up routes...');
    app.use('/api/auth', authRoutes);
    app.use('/api/chats', chatRoutes);
    app.use('/api/notifications', notificationRoutes);
    console.log('Routes configured successfully');

    // Basic health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Server is ready to accept connections');
      console.log(`Test client available at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error details:', error.stack);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

console.log('Starting server...');
startServer(); 