
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

# Get the actual user (not root even when running with sudo)
ACTUAL_USER=${SUDO_USER:-$(logname)}
log_info "Detected user: $ACTUAL_USER"

# --- Update System ---
log_info "🔄 Updating package lists..."
sudo apt-get update -y
log_success "Package lists updated."

log_info "🚀 Upgrading system packages. This is the longest step and may take several minutes..."
sudo apt-get upgrade -y
log_success "System updated."

# --- Install Dependencies ---
log_info "📦 Installing core dependencies (git, nginx, cmake, libjpeg-dev)..."
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
# Run npm commands and fix permissions afterward
npm install
npm run build
# Fix file permissions to prevent git pull issues
log_info "Fixing file permissions for git operations..."
sudo chown -R $ACTUAL_USER:$ACTUAL_USER node_modules package-lock.json dist 2>/dev/null || true
log_success "Frontend built successfully."

# --- Backend Setup ---
log_info "⚙️ Setting up backend dependencies..."
cd deploy
log_info "Installing backend dependencies (express, cors, sqlite3, bcrypt, jsonwebtoken)..."
npm install
# Fix permissions for backend dependencies too
sudo chown -R $ACTUAL_USER:$ACTUAL_USER node_modules package-lock.json 2>/dev/null || true

# --- Database Setup ---
log_info "🗄️ Setting up SQLite database..."
# Create database directory if it doesn't exist
mkdir -p data
# Initialize database (this will create the database and tables if they don't exist)
node -e "
const Database = require('./database.cjs');
const db = new Database();
console.log('Database initialized successfully');
process.exit(0);
" || log_error "Database initialization failed"

# Set proper permissions for database directory and files
sudo chown -R $ACTUAL_USER:$ACTUAL_USER data 2>/dev/null || true
chmod 755 data
if [ -f "data/neptuneos.db" ]; then
    chmod 644 data/neptuneos.db
    log_success "Database setup completed."
else
    log_info "Database will be created on first run."
fi

cd ..
log_success "Backend dependencies and database setup completed."

# --- Backend Setup (with PM2) ---
log_info "⚙️ Starting the backend API server with PM2..."
pm2 start deploy/ecosystem.config.cjs
log_info "Creating PM2 startup script to run on boot for user: $ACTUAL_USER..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $ACTUAL_USER --hp /home/$ACTUAL_USER
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
if [ $? -eq 0 ]; then
    log_info "Restarting Nginx..."
    sudo systemctl restart nginx
    log_success "Nginx configured and restarted successfully."
else
    log_error "Nginx configuration test failed. Please check the configuration."
    exit 1
fi

# --- Camera Streaming Setup (mjpg-streamer) ---
log_info "📹 Setting up camera streaming service (mjpg-streamer)..."
if [ ! -d "mjpg-streamer" ]; then
    log_info "Cloning mjpg-streamer repository..."
    git clone https://github.com/jacksonliam/mjpg-streamer.git
    log_info "Building and installing mjpg-streamer..."
    (cd mjpg-streamer/mjpg-streamer-experimental && make && sudo make install)
    # Fix ownership of cloned directory
    sudo chown -R $ACTUAL_USER:$ACTUAL_USER mjpg-streamer
else
    log_info "mjpg-streamer directory already exists. Skipping clone and build."
fi
log_info "Setting up systemd service for the camera with optimized resolution..."
sudo cp deploy/mjpg-streamer.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mjpg-streamer.service
sudo systemctl start mjpg-streamer.service
log_success "Camera streaming service configured with 640x480 resolution."

# --- Fix Git Repository Permissions ---
log_info "🔧 Fixing git repository permissions..."
# Ensure all files in the project are owned by the actual user
sudo chown -R $ACTUAL_USER:$ACTUAL_USER /home/$ACTUAL_USER/neptuneos
# Reset any git permission issues for main repo
cd /home/$ACTUAL_USER/neptuneos
sudo -u $ACTUAL_USER git config --global --add safe.directory /home/$ACTUAL_USER/neptuneos
# Fix mjpg-streamer git permissions thoroughly
if [ -d "mjpg-streamer" ]; then
    log_info "Fixing mjpg-streamer git repository permissions..."
    sudo chown -R $ACTUAL_USER:$ACTUAL_USER mjpg-streamer
    # Specifically fix .git directory and all its contents
    sudo find mjpg-streamer/.git -type f -exec sudo chown $ACTUAL_USER:$ACTUAL_USER {} \;
    sudo find mjpg-streamer/.git -type d -exec sudo chown $ACTUAL_USER:$ACTUAL_USER {} \;
    sudo -u $ACTUAL_USER git config --global --add safe.directory /home/$ACTUAL_USER/neptuneos/mjpg-streamer
    # Set git pull strategy to avoid merge warnings
    cd mjpg-streamer
    sudo -u $ACTUAL_USER git config pull.rebase false
    cd ..
fi
log_success "Git repository permissions fixed."

# --- Finalization ---
trap - ERR # Disable the error trap for the final success message
log_success "🎉 Installation Complete!"
echo -e "\n✅ NeptuneOS should be accessible at http://neptuneos.local/"
echo "🎥 Camera stream should be available at http://neptuneos.local:8080"
echo "🗄️ SQLite database initialized and ready"
echo "📁 A full log is available at: $LOG_FILE"
echo -e "\n💡 Git operations should now work properly as user $ACTUAL_USER"
log_info "Rebooting in 10 seconds to apply all changes..."
sleep 10
sudo reboot
