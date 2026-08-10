require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getDatabase } = require('./config/database');
const messageRoutes = require('./routes/messageRoutes');
const { initChatSocket } = require('./sockets/chatSocket');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Socket.io initialization with CORS configuration
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Attach Socket.io instance to Express requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/messages', messageRoutes);

// Socket.io Event Handlers Setup
initChatSocket(io);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize DB and start server
getDatabase()
  .then(() => {
    console.log('✅ SQLite Database connected & initialized.');
    server.listen(PORT, () => {
      console.log(`🚀 Pulse Chat Server running on port ${PORT}`);
      console.log(`📡 Socket.io endpoint listening for connections.`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
