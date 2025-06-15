
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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

  initializeTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        `CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
              resolve();
            }
          }
        });
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
