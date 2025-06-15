
#!/bin/bash

# NeptuneOS Automated Installer for Raspberry Pi
# Enhanced with logging and error handling.

# --- Configuration & Setup ---
# Exit immediately if a command exits with a non-zero status.
set -e
LOG_FILE="$(pwd)/deploy/install.log"

# Clean up old log file and start new one
# The script is typically run with sudo, so direct write access is assumed.
echo "Starting NeptuneOS Installation Log..." > "$LOG_FILE"

# --- Logging Functions ---
log() {
    # Redirect stdout of this function to both console and log file
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
} | tee -a "$LOG_FILE"

log_info() { log "INFO: $1"; }
log_error() { log "ERROR: $1"; }
log_success() { log "SUCCESS: $1"; }

# --- Error Handling Trap ---
handle_error() {
    local exit_code=$?
    local line_no=$1
    log_error "An error occurred at line $line_no. Exit code: $exit_code"
    echo -e "\n\n❌ Installation failed. Please check the log file for details: $LOG_FILE\n"
}
trap 'handle_error $LINENO' ERR

# --- Start of Installation ---
log_info "🌊 Starting NeptuneOS Installation... Log will be saved to $LOG_FILE"

# --- Update System ---
log_info "🔄 Updating package lists and upgrading system..."
sudo apt-get update -y
sudo apt-get upgrade -y
log_success "System updated."

# --- Install Dependencies ---
log_info "📦 Installing core dependencies (git, nginx, nodejs, npm, cmake)..."
sudo apt-get install -y git nginx cmake libjpeg-dev

# Install Node.js and npm if not present
if ! command -v node &> /dev/null; then
    log_info "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    log_info "Node.js is already installed."
fi
log_success "Core dependencies installed."

# Install PM2 if not present
log_info "🚀 Installing PM2 for process management..."
if ! sudo npm list -g pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    log_info "PM2 is already installed."
fi
log_success "PM2 is ready."

# --- Frontend Setup ---
log_info "🏗️ Building the frontend... (This may take a few minutes)"
# NOTE: These commands are run as root because the script is executed with sudo.
# This might cause permission issues if you later run npm commands as a non-root user.
# If that happens, you may need to fix permissions with: sudo chown -R $(logname):$(logname) .
npm install
npm run build
log_success "Frontend built successfully."

# --- Backend Setup (with PM2) ---
log_info "⚙️ Setting up the backend API server with PM2..."
pm2 start deploy/ecosystem.config.js
log_info "Creating PM2 startup script to run on boot..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 save
log_success "Backend API server configured."

# --- Nginx Configuration ---
log_info "🌐 Configuring Nginx..."
if [ -L /etc/nginx/sites-enabled/default ]; then
    log_info "Removing default Nginx site configuration."
    sudo rm /etc/nginx/sites-enabled/default
fi
log_info "Copying NeptuneOS Nginx config..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/neptuneos
if [ ! -L /etc/nginx/sites-enabled/neptuneos ]; then
    log_info "Enabling NeptuneOS Nginx site..."
    sudo ln -s /etc/nginx/sites-available/neptuneos /etc/nginx/sites-enabled/
fi
log_info "Testing Nginx configuration..."
sudo nginx -t
log_info "Restarting Nginx..."
sudo systemctl restart nginx
log_success "Nginx configured."

# --- Camera Streaming Setup (mjpg-streamer) ---
log_info "📹 Setting up camera streaming service (mjpg-streamer)..."
if [ ! -d "mjpg-streamer" ]; then
    log_info "Cloning mjpg-streamer repository..."
    git clone https://github.com/jacksonliam/mjpg-streamer.git
    log_info "Building and installing mjpg-streamer..."
    (cd mjpg-streamer/mjpg-streamer-experimental && make && sudo make install)
else
    log_info "mjpg-streamer directory already exists. Skipping clone and build."
fi
log_info "Setting up systemd service for the camera..."
sudo cp deploy/mjpg-streamer.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mjpg-streamer.service
sudo systemctl start mjpg-streamer.service
log_success "Camera streaming service configured."

# --- Finalization ---
trap - ERR # Disable the error trap for the final success message
log_success "🎉 Installation Complete!"
echo -e "\n✅ NeptuneOS should be accessible at http://<your-pi-ip>/"
echo "A full log is available at: $LOG_FILE"
log_info "Rebooting in 10 seconds to apply all changes..."
sleep 10
sudo reboot

