
#!/bin/bash

# NeptuneOS Backend Startup Script
cd /home/admin/neptuneos/deploy

echo "Installing backend dependencies..."
npm install

echo "Starting backend with PM2..."
pm2 delete neptuneos-api 2>/dev/null || true
pm2 start ecosystem.config.cjs

echo "Backend status:"
pm2 status

echo "Testing backend connection..."
sleep 3
curl -s http://localhost:3001/api/health && echo " - Health check passed" || echo " - Health check failed"
