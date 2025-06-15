
#!/bin/bash

# NeptuneOS Backend Startup Script
cd /home/admin/neptuneos/deploy

echo "Installing backend dependencies..."
npm install

echo "Setting up database..."
# Create data directory if it doesn't exist
mkdir -p data

# Initialize database if it doesn't exist
if [ ! -f "data/neptuneos.db" ]; then
    echo "Initializing SQLite database..."
    node -e "
    const Database = require('./database.cjs');
    const db = new Database();
    console.log('Database initialized successfully');
    process.exit(0);
    " || echo "Database initialization failed"
else
    echo "Database already exists, skipping initialization"
fi

# Set proper permissions for database
chmod 755 data
if [ -f "data/neptuneos.db" ]; then
    chmod 644 data/neptuneos.db
fi

echo "Starting backend with PM2..."
pm2 delete neptuneos-api 2>/dev/null || true
pm2 start ecosystem.config.cjs

echo "Backend status:"
pm2 status

echo "Testing backend connection..."
sleep 3
curl -s http://localhost:3001/api/health && echo " - Health check passed" || echo " - Health check failed"

echo "Database status:"
if [ -f "data/neptuneos.db" ]; then
    echo " - SQLite database: ✓ Available"
    ls -la data/neptuneos.db
else
    echo " - SQLite database: ✗ Not found"
fi
