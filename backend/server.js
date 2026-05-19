const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const probabilityRoutes = require('./routes/probability');
const priceRoutes = require('./routes/price');
const strategyRoutes = require('./routes/strategy');
const matchesRoutes = require('./routes/matches');

// Use routes
app.use('/api/probability', probabilityRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/matches', matchesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Send initial data
  socket.emit('connected', { message: 'Connected to Matches Analyzer server' });

  // Listen for client events
  socket.on('start_analysis', (data) => {
    console.log('Analysis started:', data);
    io.emit('analysis_started', { timestamp: new Date() });
  });

  socket.on('stop_analysis', (data) => {
    console.log('Analysis stopped:', data);
    io.emit('analysis_stopped', { timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate live data updates
setInterval(() => {
  const probability = generateProbabilities();
  const price = generatePrice();
  
  io.emit('live_update', {
    probability,
    price,
    timestamp: new Date()
  });
}, 2000); // Update every 2 seconds

// Utility functions
function generateProbabilities() {
  const probs = {};
  for (let i = 0; i < 10; i++) {
    probs[i] = (Math.random() * 10 + 4.1).toFixed(1); // Range 4.1% to 15%
  }
  return probs;
}

function generatePrice() {
  return (Math.random() * 100 + 10).toFixed(5);
}

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Matches Analyzer Server running on port ${PORT}`);
  console.log(`📊 Live updates enabled via WebSocket`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});
