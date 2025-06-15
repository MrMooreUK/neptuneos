
const express = require('express');
const os = require('os');
const { exec } = require('child_process');

const router = express.Router();

const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
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

// Health check endpoint
router.get('/health', (req, res) => {
    log('Health check requested');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// System info endpoint
router.get('/system-info', async (req, res) => {
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

// Temperature endpoints
router.get('/temperature', (req, res) => {
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

router.get('/temperature/history', async (req, res) => {
    try {
        const { sensorId, limit } = req.query;
        const { db } = req;
        log('Temperature history requested');
        const history = await db.getTemperatureHistory(sensorId, limit ? parseInt(limit) : 100);
        res.json(history);
    } catch (error) {
        log(`Temperature history error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve temperature history' });
    }
});

router.post('/temperature/log', async (req, res) => {
    try {
        const { sensorId, temperature, unit } = req.body;
        const { db } = req;
        log(`Temperature logged: ${temperature}°${unit} for sensor ${sensorId}`);
        await db.addTemperatureReading(sensorId, temperature, unit);
        res.json({ success: true });
    } catch (error) {
        log(`Temperature log error: ${error.message}`);
        res.status(500).json({ error: 'Failed to log temperature' });
    }
});

module.exports = router;
