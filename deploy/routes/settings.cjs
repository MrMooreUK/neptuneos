
const express = require('express');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// User-specific settings endpoints
router.get('/user/settings', authenticateToken, async (req, res) => {
    try {
        const { db } = req;
        log(`User settings requested by: ${req.user.username}`);
        const settings = await db.getAllUserSettings(req.user.id);
        res.json(settings);
    } catch (error) {
        log(`User settings get error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve user settings' });
    }
});

router.post('/user/settings', authenticateToken, async (req, res) => {
    try {
        const { key, value } = req.body;
        const { db } = req;
        log(`User setting update by ${req.user.username}: ${key}`);
        await db.setUserSetting(req.user.id, key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        log(`User settings post error: ${error.message}`);
        res.status(500).json({ error: 'Failed to save user setting' });
    }
});

// Legacy settings endpoints (for backward compatibility)
router.get('/settings', async (req, res) => {
    try {
        const { db } = req;
        log('Legacy settings requested');
        const settings = await db.getAllSettings();
        res.json(settings);
    } catch (error) {
        log(`Settings get error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve settings' });
    }
});

router.get('/settings/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { db } = req;
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

router.post('/settings', async (req, res) => {
    try {
        const { key, value } = req.body;
        const { db } = req;
        log(`Legacy setting update: ${key}`);
        await db.setSetting(key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        log(`Settings post error: ${error.message}`);
        res.status(500).json({ error: 'Failed to save setting' });
    }
});

router.put('/settings/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const { db } = req;
        log(`Legacy setting update: ${key}`);
        await db.setSetting(key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        log(`Settings put error: ${error.message}`);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

module.exports = router;
