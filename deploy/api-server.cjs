
const express = require('express');
const cors = require('cors');
const Database = require('./database.cjs');
const authRoutes = require('./routes/auth.cjs');
const settingsRoutes = require('./routes/settings.cjs');
const systemRoutes = require('./routes/system.cjs');
const { log } = require('./utils/logger.cjs');

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database();

app.use(cors());
app.use(express.json());

// Database middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Initialize database connection
db.connect().then(() => {
  log('Database initialized successfully');
}).catch((err) => {
  log(`Database initialization failed: ${err.message}`);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', settingsRoutes);
app.use('/api', systemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    log(`Unhandled error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    log(`🌊 NeptuneOS API running on port ${PORT}`);
    log(`Server listening on all interfaces (0.0.0.0:${PORT})`);
});

// Graceful shutdown
const gracefulShutdown = () => {
    log('Shutting down gracefully');
    server.close(() => {
        db.close().then(() => {
            log('Server and database closed');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
