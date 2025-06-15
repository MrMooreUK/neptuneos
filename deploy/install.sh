
#!/bin/bash

# NeptuneOS Automated Installer for Raspberry Pi
# This script installs all necessary dependencies, sets up the API server,
# and configures the system to run NeptuneOS on boot.

echo "🌊 Starting NeptuneOS Installation..."

# --- Update System ---
echo "🔄 Updating package lists..."
sudo apt-get update
sudo apt-get upgrade -y

# --- Install Dependencies ---
echo "📦 Installing core dependencies (git, nginx, nodejs, npm)..."
sudo apt-get install -y git nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "🚀 Installing PM2 for process management..."
sudo npm install -g pm2

# --- Clone Repository ---
# Note: In a real one-liner curl | bash scenario, you might want to cd to /home/pi
if [ ! -d "neptuneos" ]; then
    echo "Cloning NeptuneOS repository..."
    # IMPORTANT: Replace with your actual repository URL
    git clone https://github.com/lovable-community/neptuneos.git 
    cd neptuneos
else
    echo "NeptuneOS directory already exists. Pulling latest changes..."
    cd neptuneos
    git pull
fi

# --- Frontend Setup ---
echo "🏗️ Building the frontend..."
npm install
npm run build

# --- Backend Setup (with PM2) ---
echo "⚙️ Setting up the backend API server with PM2..."
# This uses the ecosystem.config.js file in the deploy directory
pm2 start deploy/ecosystem.config.js
# Create a startup script for PM2 to run on boot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 save

# --- Nginx Configuration ---
echo "🌐 Configuring Nginx..."
# Remove default site if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi
# Copy our nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/neptuneos
# Enable our site
if [ ! -L /etc/nginx/sites-enabled/neptuneos ]; then
    sudo ln -s /etc/nginx/sites-available/neptuneos /etc/nginx/sites-enabled/
fi
sudo nginx -t # Test config
sudo systemctl restart nginx

# --- Camera Streaming Setup (mjpg-streamer) ---
echo "📹 Setting up camera streaming service (mjpg-streamer)..."
sudo apt-get install -y cmake libjpeg-dev
if [ ! -d "mjpg-streamer" ]; then
    git clone https://github.com/jacksonliam/mjpg-streamer.git
    (cd mjpg-streamer/mjpg-streamer-experimental && make && sudo make install)
fi
# Set up systemd service for the camera
sudo cp deploy/mjpg-streamer.service /etc/systemd/system/
sudo systemctl enable mjpg-streamer.service
sudo systemctl start mjpg-streamer.service

echo "🎉 Installation Complete! NeptuneOS should be accessible at http://<your-pi-ip>/"
echo "Rebooting in 10 seconds to apply all changes..."
sleep 10
sudo reboot
