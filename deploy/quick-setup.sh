#!/bin/bash

# ====================================================================
# 🚀 NeptuneOS - Quick Setup Script
# ====================================================================
# Minimal installation for experienced users
# ====================================================================

set -e

echo "🌊 NeptuneOS Quick Setup"
echo "======================="
echo "This is a minimal installation script for experienced users."
echo "For full installation with progress tracking, use: sudo bash deploy/install.sh"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run with sudo privileges"
    exit 1
fi

ACTUAL_USER=${SUDO_USER:-$(logname)}
echo "Installing for user: $ACTUAL_USER"

# System dependencies
echo "📦 Installing system dependencies..."
apt-get update -y && apt-get upgrade -y
apt-get install -y git nginx cmake libjpeg-dev curl nodejs npm

# Global packages
echo "🔧 Installing global packages..."
npm install -g pm2

# Frontend build
echo "🏗️ Building frontend..."
npm install && npm run build
chown -R $ACTUAL_USER:$ACTUAL_USER node_modules package-lock.json dist

# Backend setup
echo "⚙️ Setting up backend..."
cd deploy
npm install
mkdir -p data
chown -R $ACTUAL_USER:$ACTUAL_USER data node_modules package-lock.json

# Start services
echo "🚀 Starting services..."
sudo -u $ACTUAL_USER pm2 start ecosystem.config.cjs
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $ACTUAL_USER --hp /home/$ACTUAL_USER
sudo -u $ACTUAL_USER pm2 save

# Nginx
echo "🌐 Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default
cp nginx.conf /etc/nginx/sites-available/neptuneos
ln -sf /etc/nginx/sites-available/neptuneos /etc/nginx/sites-enabled/
systemctl restart nginx

# Camera (optional)
if [ -e "/dev/video0" ]; then
    echo "📹 Setting up camera..."
    if [ ! -d "../mjpg-streamer" ]; then
        cd ..
        sudo -u $ACTUAL_USER git clone https://github.com/jacksonliam/mjpg-streamer.git
        cd mjpg-streamer/mjpg-streamer-experimental && make && make install
        cd ../../deploy
    fi
    cp mjpg-streamer.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable mjpg-streamer.service
    systemctl start mjpg-streamer.service
else
    echo "⚠️  No camera detected, skipping camera setup"
fi

# Fix permissions
echo "🔧 Fixing permissions..."
chown -R $ACTUAL_USER:$ACTUAL_USER /home/$ACTUAL_USER/neptuneos

echo ""
echo "✅ Quick setup complete!"
echo "🌐 Access: http://$(hostname -I | awk '{print $1}')"
echo "📹 Camera: http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "For detailed installation with monitoring and validation, use:"
echo "sudo bash deploy/install.sh"