
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'neptuneos-jwt-secret-key-change-in-production';

const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        const { db } = req;
        
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

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const { db } = req;
        
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

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const { db } = req;
        
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

// Get current user endpoint
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const { db } = req;
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

module.exports = router;
