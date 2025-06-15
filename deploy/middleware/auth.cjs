
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'neptuneos-jwt-secret-key-change-in-production';

const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { db } = req;
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

module.exports = { authenticateToken };
