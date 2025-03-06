// server/src/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Create Express app
const app = express();
const server = http.createServer(app);

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Setup SignalR (placeholder - will implement later)
// setupSignalR(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
