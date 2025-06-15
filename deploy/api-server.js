
const express = require('express');
const cors = require('cors');
const os = require('os');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper to get local IP Address
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

// Helper to get disk usage
const getDiskUsage = (path = '/') => {
    return new Promise((resolve, reject) => {
        exec(`df -B1 ${path}`, (error, stdout, stderr) => {
            if (error) return reject(error);
            const lines = stdout.trim().split('\n');
            if (lines.length < 2) return resolve({ used: 0, total: 0 });
            const parts = lines[1].split(/\s+/);
            const total = parseInt(parts[1], 10) / (1024 ** 3); // to GB
            const used = parseInt(parts[2], 10) / (1024 ** 3); // to GB
            resolve({ used, total });
        });
    });
};

app.get('/api/system-info', async (req, res) => {
    try {
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
        res.json(info);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve system information.' });
    }
});

app.get('/api/temperature', (req, res) => {
    // Placeholder for real sensor data
    res.json({
        sensor1: 25.5 + Math.random(),
        sensor2: 26.0 + Math.random(),
        average: 25.75 + Math.random(),
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🌊 NeptuneOS API running on port ${PORT}`);
});
