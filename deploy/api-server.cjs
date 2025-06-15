const express = require('express');
const cors = require('cors');
const os = require('os');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('./database.cjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'neptuneos-jwt-secret-key-change-in-production';
const db = new Database();

// Enhanced logging
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

app.use(cors());
app.use(express.json());

// Initialize database connection
db.connect().then(() => {
  log('Database initialized successfully');
}).catch((err) => {
  log(`Database initialization failed: ${err.message}`);
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await db.getSessionByToken(token);
    
    if (!session) {
      return res.status(403).json({ error: 'Invalid or expired session' });
    }

    req.user = {
      id: session.user_id,
      username: session.username,
      role: session.role
    };
    next();
  } catch (error) {
    log(`Authentication error: ${error.message}`);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Helper functions
const getIpAddress = () => {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1';
};

const getDiskUsage = (path = '/') => {
    return new Promise((resolve, reject) => {
        exec(`df -B1 ${path}`, (error, stdout, stderr) => {
            if (error) {
                log(`Disk usage error: ${error.message}`);
                return reject(error);
            }
            const lines = stdout.trim().split('\n');
            if (lines.length < 2) return resolve({ used: 0, total: 0 });
            const parts = lines[1].split(/\s+/);
            const total = parseInt(parts[1], 10) / (1024 ** 3); // to GB
            const used = parseInt(parts[2], 10) / (1024 ** 3); // to GB
            resolve({ used, total });
        });
    });
};

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await db.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await db.createUser(username, email, hashedPassword, role);
        
        log(`User registered: ${username}`);
        res.json({ success: true, userId, username });
    } catch (error) {
        log(`Registration error: ${error.message}`);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get user
        const user = await db.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session token
        const sessionToken = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Store session in database
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await db.createSession(user.id, sessionToken, expiresAt);

        log(`User logged in: ${username}`);
        res.json({
            success: true,
            token: sessionToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        log(`Login error: ${error.message}`);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
            await db.deleteSession(token);
        }
        
        log(`User logged out: ${req.user.username}`);
        res.json({ success: true });
    } catch (error) {
        log(`Logout error: ${error.message}`);
        res.status(500).json({ error: 'Logout failed' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        log(`Get user error: ${error.message}`);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// User-specific settings endpoints
app.get('/api/user/settings', authenticateToken, async (req, res) => {
    try {
        log(`User settings requested by: ${req.user.username}`);
        const settings = await db.getAllUserSettings(req.user.id);
        res.json(settings);
    } catch (error) {
        log(`User settings get error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve user settings' });
    }
});

app.post('/api/user/settings', authenticateToken, async (req, res) => {
    try {
        const { key, value } = req.body;
        log(`User setting update by ${req.user.username}: ${key}`);
        await db.setUserSetting(req.user.id, key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        log(`User settings post error: ${error.message}`);
        res.status(500).json({ error: 'Failed to save user setting' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    log('Health check requested');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/system-info', async (req, res) => {
    try {
        log('System info requested');
        const storage = await getDiskUsage();
        const memUsed = (os.totalmem() - os.freemem()) / (1024 ** 2); // MB
        const memTotal = os.totalmem() / (1024 ** 2); // MB

        const info = {
            uptime: os.uptime(),
            cpuUsage: os.loadavg()[0] * 100 / os.cpus().length, // Approximation
            memory: { used: memUsed, total: memTotal },
            storage: { used: storage.used, total: storage.total },
            ipAddress: getIpAddress(),
        };
        log('System info response sent');
        res.json(info);
    } catch (error) {
        log(`System info error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve system information.' });
    }
});

app.get('/api/temperature', (req, res) => {
    log('Temperature data requested');
    // Placeholder for real sensor data
    const data = {
        sensor1: 25.5 + Math.random(),
        sensor2: 26.0 + Math.random(),
        average: 25.75 + Math.random(),
        timestamp: new Date().toISOString()
    };
    log('Temperature data response sent');
    res.json(data);
});

// Legacy settings endpoints (for backward compatibility)
app.get('/api/settings', async (req, res) => {
    try {
        log('Legacy settings requested');
        const settings = await db.getAllSettings();
        res.json(settings);
    } catch (error) {
        log(`Settings get error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve settings' });
    }
});

app.get('/api/settings/:key', async (req, res) => {
    try {
        const { key } = req.params;
        log(`Legacy setting requested: ${key}`);
        const value = await db.getSetting(key);
        if (value !== null) {
            res.json({ key, value });
        } else {
            res.status(404).json({ error: 'Setting not found' });
        }
    } catch (error) {
        log(`Setting get error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve setting' });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { key, value } = req.body;
        log(`Legacy setting update: ${key}`);
        await db.setSetting(key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        log(`Settings post error: ${error.message}`);
        res.status(500).json({ error: 'Failed to save setting' });
    }
});

app.put('/api/settings/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        log(`Legacy setting update: ${key}`);
        await db.setSetting(key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        log(`Settings put error: ${error.message}`);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

// Temperature history endpoints
app.get('/api/temperature/history', async (req, res) => {
    try {
        const { sensorId, limit } = req.query;
        log('Temperature history requested');
        const history = await db.getTemperatureHistory(sensorId, limit ? parseInt(limit) : 100);
        res.json(history);
    } catch (error) {
        log(`Temperature history error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve temperature history' });
    }
});

app.post('/api/temperature/log', async (req, res) => {
    try {
        const { sensorId, temperature, unit } = req.body;
        log(`Temperature logged: ${temperature}°${unit} for sensor ${sensorId}`);
        await db.addTemperatureReading(sensorId, temperature, unit);
        res.json({ success: true });
    } catch (error) {
        log(`Temperature log error: ${error.message}`);
        res.status(500).json({ error: 'Failed to log temperature' });
    }
});

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
