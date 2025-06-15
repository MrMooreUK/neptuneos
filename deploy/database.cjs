const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, 'neptuneos.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async initializeTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        `CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS user_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          session_token TEXT UNIQUE NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`,
        `CREATE TABLE IF NOT EXISTS user_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, key)
        )`,
        `CREATE TABLE IF NOT EXISTS sensor_configs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          type TEXT NOT NULL,
          address TEXT,
          calibration_offset REAL DEFAULT 0,
          min_threshold REAL,
          max_threshold REAL,
          enabled BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS temperature_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sensor_id INTEGER,
          temperature REAL NOT NULL,
          unit TEXT DEFAULT 'C',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sensor_id) REFERENCES sensor_configs (id)
        )`,
        `CREATE TABLE IF NOT EXISTS system_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          data TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS camera_assignments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          camera_url TEXT NOT NULL,
          name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )`
      ];

      let completed = 0;
      tables.forEach((sql) => {
        this.db.run(sql, (err) => {
          if (err) {
            reject(err);
          } else {
            completed++;
            if (completed === tables.length) {
              this.createDefaultAdmin().then(resolve).catch(reject);
            }
          }
        });
      });
    });
  }

  async createDefaultAdmin() {
    return new Promise((resolve, reject) => {
      // Check if admin user exists
      this.db.get('SELECT id FROM users WHERE username = ?', ['admin'], async (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          // Create admin user
          const hashedPassword = await bcrypt.hash('password', 10);
          this.db.run(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@neptuneos.com', hashedPassword, 'admin'],
            function(err) {
              if (err) {
                reject(err);
              } else {
                console.log('Default admin user created (username: admin, password: password)');
                resolve();
              }
            }
          );
        } else {
          resolve();
        }
      });
    });
  }

  // User management methods
  createUser(username, email, hashedPassword, role = 'user') {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  createSession(userId, sessionToken, expiresAt) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
        [userId, sessionToken, expiresAt],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getSessionByToken(sessionToken) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT s.*, u.id as user_id, u.username, u.role FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ? AND s.expires_at > datetime("now")',
        [sessionToken],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  deleteSession(sessionToken) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM user_sessions WHERE session_token = ?', [sessionToken], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // User-specific settings
  getUserSetting(userId, key) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value FROM user_settings WHERE user_id = ? AND key = ?', [userId, key], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? JSON.parse(row.value) : null);
        }
      });
    });
  }

  setUserSetting(userId, key, value) {
    return new Promise((resolve, reject) => {
      const jsonValue = JSON.stringify(value);
      this.db.run(
        'INSERT OR REPLACE INTO user_settings (user_id, key, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
        [userId, key, jsonValue],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getAllUserSettings(userId) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT key, value FROM user_settings WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const settings = {};
          rows.forEach(row => {
            settings[row.key] = JSON.parse(row.value);
          });
          resolve(settings);
        }
      });
    });
  }

  getSetting(key) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value FROM settings WHERE key = ?', [key], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? JSON.parse(row.value) : null);
        }
      });
    });
  }

  setSetting(key, value) {
    return new Promise((resolve, reject) => {
      const jsonValue = JSON.stringify(value);
      this.db.run(
        'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, jsonValue],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getAllSettings() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT key, value FROM settings', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const settings = {};
          rows.forEach(row => {
            settings[row.key] = JSON.parse(row.value);
          });
          resolve(settings);
        }
      });
    });
  }

  addTemperatureReading(sensorId, temperature, unit = 'C') {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO temperature_history (sensor_id, temperature, unit) VALUES (?, ?, ?)',
        [sensorId, temperature, unit],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getTemperatureHistory(sensorId, limit = 100) {
    return new Promise((resolve, reject) => {
      const sql = sensorId 
        ? 'SELECT * FROM temperature_history WHERE sensor_id = ? ORDER BY timestamp DESC LIMIT ?'
        : 'SELECT * FROM temperature_history ORDER BY timestamp DESC LIMIT ?';
      const params = sensorId ? [sensorId, limit] : [limit];
      
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;
