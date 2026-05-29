require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection
db.connect().then(() => {
  // Define Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/tasks', require('./routes/taskRoutes'));

  // Default Route for backend health checks
  app.get('/', (req, res) => {
    res.json({
      name: 'PlanIQ API',
      status: 'Online',
      database: db.isMongoMode() ? 'MongoDB' : 'Local JSON DB'
    });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Something went wrong on the server' });
  });

  // Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server due to database initialization failure', err);
});
