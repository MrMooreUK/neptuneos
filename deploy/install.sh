#!/bin/bash

# ====================================================================
# 🌊 NeptuneOS - Comprehensive Automated Installer for Raspberry Pi
# ====================================================================
# This script provides a complete, automated setup of NeptuneOS with
# enhanced error handling, progress tracking, and user interaction.
# ====================================================================

# --- Configuration & Global Variables ---
set -e  # Exit on any error
readonly SCRIPT_VERSION="2.0.0"
readonly MIN_DISK_SPACE_GB=2
readonly MIN_RAM_MB=512
readonly REQUIRED_ARCH="armv7l|aarch64"
readonly LOG_FILE="$(pwd)/deploy/install.log"
readonly BACKUP_DIR="$(pwd)/deploy/backup"
readonly PID_FILE="/tmp/neptuneos_install.pid"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color

# User detection
ACTUAL_USER=${SUDO_USER:-$(logname)}
USER_HOME="/home/$ACTUAL_USER"
INSTALL_DIR="$USER_HOME/neptuneos"

# Installation options (can be overridden by command line)
SKIP_SYSTEM_UPDATE=false
SKIP_CAMERA_SETUP=false
INTERACTIVE_MODE=true
FORCE_INSTALL=false
ENABLE_MONITORING=true

# --- Utility Functions ---
cleanup() {
    rm -f "$PID_FILE" 2>/dev/null || true
}
trap cleanup EXIT

show_banner() {
    clear
    echo -e "${CYAN}"
    cat << 'EOF'
    ╔═══════════════════════════════════════════════════════════════╗
    ║                    🌊 NeptuneOS Installer                    ║
    ║              Aquarium Monitoring System Setup               ║
    ║                                                              ║
    ║    Professional-grade automated installation for RPi        ║
    ╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo -e "${WHITE}Version: $SCRIPT_VERSION${NC}"
    echo -e "${WHITE}Target User: $ACTUAL_USER${NC}"
    echo -e "${WHITE}Install Path: $INSTALL_DIR${NC}"
    echo ""
}

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    
    # Color coding for different log levels
    case "$level" in
        "INFO")  echo -e "${BLUE}ℹ${NC}  ${message}" ;;
        "SUCCESS") echo -e "${GREEN}✅${NC} ${message}" ;;
        "WARN")  echo -e "${YELLOW}⚠${NC}  ${message}" ;;
        "ERROR") echo -e "${RED}❌${NC} ${message}" ;;
        "DEBUG") echo -e "${PURPLE}🔍${NC} ${message}" ;;
    esac
    
    # Always log to file with timestamp
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

progress_bar() {
    local current=$1
    local total=$2
    local description=$3
    local width=50
    local percentage=$((current * 100 / total))
    local filled=$((width * current / total))
    local empty=$((width - filled))
    
    printf "\r${CYAN}[${NC}"
    printf "%*s" $filled | tr ' ' '='
    printf "%*s" $empty | tr ' ' '-'
    printf "${CYAN}]${NC} %d%% %s" $percentage "$description"
    
    if [ $current -eq $total ]; then
        echo ""
    fi
}

ask_yes_no() {
    local question="$1"
    local default="${2:-y}"
    
    if [ "$INTERACTIVE_MODE" = false ]; then
        return 0
    fi
    
    while true; do
        if [ "$default" = "y" ]; then
            echo -ne "${YELLOW}$question [Y/n]: ${NC}"
        else
            echo -ne "${YELLOW}$question [y/N]: ${NC}"
        fi
        
        read -r response
        response=${response:-$default}
        
        case "$response" in
            [Yy]|[Yy][Ee][Ss]) return 0 ;;
            [Nn]|[Nn][Oo]) return 1 ;;
            *) echo -e "${RED}Please answer yes or no.${NC}" ;;
        esac
    done
}

check_prerequisites() {
    log "INFO" "🔍 Checking system prerequisites..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        log "ERROR" "This script must be run with sudo privileges"
        echo -e "${RED}Please run: sudo bash deploy/install.sh${NC}"
        exit 1
    fi
    
    # Check architecture
    local arch=$(uname -m)
    if ! echo "$arch" | grep -qE "$REQUIRED_ARCH"; then
        log "WARN" "Architecture '$arch' may not be fully supported"
        if ! ask_yes_no "Continue anyway?"; then
            exit 1
        fi
    fi
    
    # Check available disk space
    local available_space=$(df / | tail -1 | awk '{print $4}')
    local available_gb=$((available_space / 1024 / 1024))
    
    if [ $available_gb -lt $MIN_DISK_SPACE_GB ]; then
        log "ERROR" "Insufficient disk space. Available: ${available_gb}GB, Required: ${MIN_DISK_SPACE_GB}GB"
        exit 1
    fi
    
    # Check available RAM
    local available_ram=$(free -m | grep '^Mem:' | awk '{print $2}')
    if [ $available_ram -lt $MIN_RAM_MB ]; then
        log "WARN" "Low RAM detected: ${available_ram}MB (recommended: ${MIN_RAM_MB}MB+)"
        if ! ask_yes_no "Continue anyway?"; then
            exit 1
        fi
    fi
    
    # Check internet connectivity
    if ! ping -c 1 -W 5 google.com &>/dev/null; then
        log "ERROR" "No internet connection detected"
        echo -e "${RED}Please check your network connection and try again${NC}"
        exit 1
    fi
    
    # Check if already installed
    if [ -f "$USER_HOME/.neptuneos_installed" ] && [ "$FORCE_INSTALL" = false ]; then
        log "WARN" "NeptuneOS appears to be already installed"
        if ask_yes_no "Do you want to continue with reinstallation?"; then
            FORCE_INSTALL=true
        else
            exit 0
        fi
    fi
    
    log "SUCCESS" "Prerequisites check completed"
}

create_backup() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
    fi
    
    local backup_timestamp=$(date +'%Y%m%d_%H%M%S')
    local backup_file="$BACKUP_DIR/neptuneos_backup_$backup_timestamp.tar.gz"
    
    log "INFO" "Creating backup of existing configuration..."
    
    # Backup existing configurations
    tar -czf "$backup_file" \
        --ignore-failed-read \
        /etc/nginx/sites-available/neptuneos \
        /etc/systemd/system/mjpg-streamer.service \
        "$USER_HOME/.pm2" \
        "$INSTALL_DIR/deploy/data" \
        2>/dev/null || true
    
    log "SUCCESS" "Backup created: $backup_file"
}

install_system_dependencies() {
    local step=1
    local total_steps=6
    
    log "INFO" "📦 Installing system dependencies..."
    
    if [ "$SKIP_SYSTEM_UPDATE" = false ]; then
        progress_bar $step $total_steps "Updating package lists..."
        apt-get update -y &>/dev/null
        ((step++))
        
        progress_bar $step $total_steps "Upgrading system packages..."
        apt-get upgrade -y &>/dev/null
        ((step++))
    else
        step=$((step + 2))
    fi
    
    progress_bar $step $total_steps "Installing core dependencies..."
    apt-get install -y \
        git nginx cmake libjpeg-dev \
        curl software-properties-common \
        build-essential python3-dev \
        sqlite3 htop iotop \
        &>/dev/null
    ((step++))
    
    # Install Node.js
    progress_bar $step $total_steps "Installing Node.js..."
    if ! command -v node &>/dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash - &>/dev/null
        apt-get install -y nodejs &>/dev/null
    fi
    ((step++))
    
    # Install PM2
    progress_bar $step $total_steps "Installing PM2..."
    if ! npm list -g pm2 &>/dev/null; then
        npm install -g pm2 &>/dev/null
    fi
    ((step++))
    
    progress_bar $step $total_steps "System dependencies installed"
    
    # Verify installations
    local node_version=$(node --version 2>/dev/null || echo "NOT FOUND")
    local npm_version=$(npm --version 2>/dev/null || echo "NOT FOUND")
    local pm2_version=$(pm2 --version 2>/dev/null || echo "NOT FOUND")
    
    log "SUCCESS" "Node.js: $node_version, npm: $npm_version, PM2: $pm2_version"
}

setup_frontend() {
    log "INFO" "🏗️ Setting up frontend application..."
    
    cd "$INSTALL_DIR"
    
    # Check package.json
    if [ ! -f "package.json" ]; then
        log "ERROR" "package.json not found in $INSTALL_DIR"
        exit 1
    fi
    
    log "INFO" "Installing frontend dependencies..."
    sudo -u "$ACTUAL_USER" npm install
    
    log "INFO" "Building production frontend..."
    sudo -u "$ACTUAL_USER" npm run build
    
    # Verify build
    if [ ! -d "dist" ]; then
        log "ERROR" "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    log "SUCCESS" "Frontend built successfully"
}

setup_backend() {
    log "INFO" "⚙️ Setting up backend services..."
    
    cd "$INSTALL_DIR/deploy"
    
    # Install backend dependencies
    log "INFO" "Installing backend dependencies..."
    sudo -u "$ACTUAL_USER" npm install
    
    # Setup database
    log "INFO" "Initializing database..."
    mkdir -p data
    chown -R "$ACTUAL_USER:$ACTUAL_USER" data
    
    # Initialize database
    sudo -u "$ACTUAL_USER" node -e "
        const Database = require('./database.cjs');
        const db = new Database();
        console.log('Database initialized successfully');
        process.exit(0);
    " || log "ERROR" "Database initialization failed"
    
    # Update PM2 ecosystem config with correct user
    local ecosystem_config="ecosystem.config.cjs"
    sed -i "s|/home/admin/|$USER_HOME/|g" "$ecosystem_config"
    sed -i "s|admin|$ACTUAL_USER|g" "$ecosystem_config"
    
    # Start backend with PM2
    log "INFO" "Starting backend API server..."
    sudo -u "$ACTUAL_USER" pm2 start "$ecosystem_config"
    
    # Setup PM2 startup script
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u "$ACTUAL_USER" --hp "$USER_HOME"
    sudo -u "$ACTUAL_USER" pm2 save
    
    cd "$INSTALL_DIR"
    log "SUCCESS" "Backend services configured"
}

setup_nginx() {
    log "INFO" "🌐 Configuring Nginx web server..."
    
    # Backup existing configuration
    if [ -f "/etc/nginx/sites-enabled/default" ]; then
        cp /etc/nginx/sites-enabled/default "$BACKUP_DIR/nginx_default_backup" 2>/dev/null || true
        rm -f /etc/nginx/sites-enabled/default
    fi
    
    # Update nginx config with correct paths
    local nginx_config="$INSTALL_DIR/deploy/nginx.conf"
    sed -i "s|/home/admin/|$USER_HOME/|g" "$nginx_config"
    
    # Copy and enable configuration
    cp "$nginx_config" /etc/nginx/sites-available/neptuneos
    
    if [ ! -L /etc/nginx/sites-enabled/neptuneos ]; then
        ln -s /etc/nginx/sites-available/neptuneos /etc/nginx/sites-enabled/
    fi
    
    # Test configuration
    if nginx -t &>/dev/null; then
        systemctl restart nginx
        systemctl enable nginx
        log "SUCCESS" "Nginx configured and restarted"
    else
        log "ERROR" "Nginx configuration test failed"
        nginx -t
        exit 1
    fi
}

setup_camera() {
    if [ "$SKIP_CAMERA_SETUP" = true ]; then
        log "INFO" "📹 Skipping camera setup as requested"
        return 0
    fi
    
    log "INFO" "📹 Setting up camera streaming service..."
    
    cd "$INSTALL_DIR"
    
    # Check if camera is connected
    local camera_device=""
    if [ -e "/dev/video0" ]; then
        camera_device="/dev/video0"
        log "SUCCESS" "USB camera detected at /dev/video0"
    elif [ -e "/dev/video1" ]; then
        camera_device="/dev/video1"
        log "SUCCESS" "Camera detected at /dev/video1"
    else
        log "WARN" "No camera device detected"
        if ask_yes_no "Continue without camera setup?"; then
            return 0
        else
            exit 1
        fi
    fi
    
    # Clone and build mjpg-streamer if not exists
    if [ ! -d "mjpg-streamer" ]; then
        log "INFO" "Downloading mjpg-streamer..."
        sudo -u "$ACTUAL_USER" git clone https://github.com/jacksonliam/mjpg-streamer.git
        
        log "INFO" "Building mjpg-streamer..."
        cd mjpg-streamer/mjpg-streamer-experimental
        make &>/dev/null && make install &>/dev/null
        cd "$INSTALL_DIR"
    fi
    
    # Update service file with correct user and paths
    local service_file="$INSTALL_DIR/deploy/mjpg-streamer.service"
    sed -i "s|admin|$ACTUAL_USER|g" "$service_file"
    sed -i "s|/home/admin/|$USER_HOME/|g" "$service_file"
    sed -i "s|/dev/video0|$camera_device|g" "$service_file"
    
    # Install and start service
    cp "$service_file" /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable mjpg-streamer.service
    
    # Test camera before starting service
    if sudo -u "$ACTUAL_USER" timeout 5s /usr/local/bin/mjpg_streamer \
        -i "input_uvc.so -d $camera_device -r 640x480 -f 15" \
        -o "output_http.so -p 8080" &>/dev/null; then
        systemctl start mjpg-streamer.service
        log "SUCCESS" "Camera streaming service started"
    else
        log "WARN" "Camera test failed, but service installed"
    fi
}

fix_permissions() {
    log "INFO" "🔧 Fixing file permissions and ownership..."
    
    # Fix ownership of entire project
    chown -R "$ACTUAL_USER:$ACTUAL_USER" "$INSTALL_DIR"
    
    # Fix git permissions
    sudo -u "$ACTUAL_USER" git config --global --add safe.directory "$INSTALL_DIR"
    
    if [ -d "$INSTALL_DIR/mjpg-streamer" ]; then
        sudo -u "$ACTUAL_USER" git config --global --add safe.directory "$INSTALL_DIR/mjpg-streamer"
        cd "$INSTALL_DIR/mjpg-streamer"
        sudo -u "$ACTUAL_USER" git config pull.rebase false
        cd "$INSTALL_DIR"
    fi
    
    # Set proper permissions for sensitive directories
    chmod 755 "$INSTALL_DIR/deploy/data" 2>/dev/null || true
    chmod 644 "$INSTALL_DIR/deploy/data/"*.db 2>/dev/null || true
    
    log "SUCCESS" "Permissions fixed"
}

setup_monitoring() {
    if [ "$ENABLE_MONITORING" = false ]; then
        return 0
    fi
    
    log "INFO" "📊 Setting up system monitoring..."
    
    # Create monitoring script
    cat > "$INSTALL_DIR/deploy/monitor.sh" << 'EOF'
#!/bin/bash
# Simple monitoring script for NeptuneOS
echo "=== NeptuneOS System Status ===" 
echo "Date: $(date)"
echo "Uptime: $(uptime -p)"
echo "Memory: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
echo "Temperature: $(vcgencmd measure_temp 2>/dev/null || echo 'N/A')"
echo ""
echo "=== Service Status ==="
systemctl is-active --quiet nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
systemctl is-active --quiet mjpg-streamer && echo "✅ Camera: Running" || echo "❌ Camera: Stopped"
pm2 describe neptuneos-api &>/dev/null && echo "✅ API: Running" || echo "❌ API: Stopped"
EOF
    
    chmod +x "$INSTALL_DIR/deploy/monitor.sh"
    chown "$ACTUAL_USER:$ACTUAL_USER" "$INSTALL_DIR/deploy/monitor.sh"
    
    # Add to user's PATH
    echo "alias neptune-status='$INSTALL_DIR/deploy/monitor.sh'" >> "$USER_HOME/.bashrc"
    
    log "SUCCESS" "Monitoring setup completed"
}

verify_installation() {
    log "INFO" "🔍 Verifying installation..."
    
    local errors=0
    
    # Check services
    if ! systemctl is-active --quiet nginx; then
        log "ERROR" "Nginx is not running"
        ((errors++))
    fi
    
    if ! sudo -u "$ACTUAL_USER" pm2 describe neptuneos-api &>/dev/null; then
        log "ERROR" "API server is not running"
        ((errors++))
    fi
    
    # Check files
    if [ ! -f "$INSTALL_DIR/dist/index.html" ]; then
        log "ERROR" "Frontend build files missing"
        ((errors++))
    fi
    
    if [ ! -f "$INSTALL_DIR/deploy/data/neptuneos.db" ]; then
        log "WARN" "Database file not found (will be created on first run)"
    fi
    
    # Test HTTP endpoints
    local local_ip=$(hostname -I | awk '{print $1}')
    if curl -s "http://localhost" &>/dev/null; then
        log "SUCCESS" "Web interface accessible at http://localhost"
        log "SUCCESS" "Also accessible at http://$local_ip"
    else
        log "ERROR" "Web interface not accessible"
        ((errors++))
    fi
    
    if [ $errors -eq 0 ]; then
        log "SUCCESS" "Installation verification completed successfully"
        return 0
    else
        log "ERROR" "Installation verification failed with $errors errors"
        return 1
    fi
}

show_completion_summary() {
    local install_duration=$(($(date +%s) - $INSTALL_START_TIME))
    local minutes=$((install_duration / 60))
    local seconds=$((install_duration % 60))
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                  🎉 Installation Complete!                  ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${WHITE}Installation Summary:${NC}"
    echo -e "  ⏱️  Duration: ${minutes}m ${seconds}s"
    echo -e "  👤 User: $ACTUAL_USER"
    echo -e "  📁 Location: $INSTALL_DIR"
    echo -e "  📊 Log file: $LOG_FILE"
    echo ""
    echo -e "${WHITE}Access URLs:${NC}"
    echo -e "  🌐 Dashboard: ${CYAN}http://$(hostname -I | awk '{print $1}')${NC}"
    echo -e "  🌐 Local: ${CYAN}http://neptuneos.local${NC}"
    echo -e "  📹 Camera: ${CYAN}http://$(hostname -I | awk '{print $1}'):8080${NC}"
    echo ""
    echo -e "${WHITE}Quick Commands:${NC}"
    echo -e "  📊 Status: ${YELLOW}neptune-status${NC}"
    echo -e "  🔄 Restart: ${YELLOW}pm2 restart neptuneos-api${NC}"
    echo -e "  📋 Logs: ${YELLOW}pm2 logs neptuneos-api${NC}"
    echo -e "  🔧 Monitor: ${YELLOW}pm2 monit${NC}"
    echo ""
    
    if ask_yes_no "Would you like to reboot now to complete the installation?"; then
        log "INFO" "Rebooting system in 5 seconds..."
        sleep 5
        reboot
    else
        echo -e "${YELLOW}Please reboot manually when convenient to complete the installation.${NC}"
    fi
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-update)
                SKIP_SYSTEM_UPDATE=true
                shift
                ;;
            --skip-camera)
                SKIP_CAMERA_SETUP=true
                shift
                ;;
            --non-interactive)
                INTERACTIVE_MODE=false
                shift
                ;;
            --force)
                FORCE_INSTALL=true
                shift
                ;;
            --no-monitoring)
                ENABLE_MONITORING=false
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                log "ERROR" "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

show_help() {
    cat << EOF
🌊 NeptuneOS Installer v$SCRIPT_VERSION

Usage: sudo bash deploy/install.sh [OPTIONS]

Options:
  --skip-update       Skip system package updates
  --skip-camera       Skip camera setup
  --non-interactive   Run without user prompts
  --force            Force installation even if already installed
  --no-monitoring    Skip monitoring setup
  --help, -h         Show this help message

Examples:
  sudo bash deploy/install.sh
  sudo bash deploy/install.sh --skip-update --non-interactive
  sudo bash deploy/install.sh --force --skip-camera

For more information, visit: https://github.com/lovable-community/neptuneos
EOF
}

# --- Main Installation Flow ---
main() {
    # Record start time
    INSTALL_START_TIME=$(date +%s)
    
    # Create PID file
    echo $$ > "$PID_FILE"
    
    # Initialize log file
    echo "NeptuneOS Installation Log - $(date)" > "$LOG_FILE"
    echo "Arguments: $*" >> "$LOG_FILE"
    echo "----------------------------------------" >> "$LOG_FILE"
    
    # Parse command line arguments
    parse_arguments "$@"
    
    # Show banner
    show_banner
    
    # Main installation steps
    check_prerequisites
    create_backup
    install_system_dependencies
    setup_frontend
    setup_backend
    setup_nginx
    setup_camera
    fix_permissions
    setup_monitoring
    
    # Verification and completion
    if verify_installation; then
        # Mark as installed
        echo "$(date)" > "$USER_HOME/.neptuneos_installed"
        show_completion_summary
    else
        log "ERROR" "Installation completed with errors. Please check the log file."
        echo -e "${RED}Installation log: $LOG_FILE${NC}"
        exit 1
    fi
}

# --- Error Handling ---
handle_error() {
    local exit_code=$?
    local line_no=$1
    
    log "ERROR" "Installation failed at line $line_no with exit code $exit_code"
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════╗${NC}"
    echo -e "${RED}║        ❌ Installation Failed        ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${WHITE}Error Details:${NC}"
    echo -e "  📍 Line: $line_no"
    echo -e "  🔢 Exit Code: $exit_code"
    echo -e "  📋 Log File: $LOG_FILE"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. Check the log file for detailed error information"
    echo -e "  2. Ensure you have a stable internet connection"
    echo -e "  3. Verify you have sufficient disk space and RAM"
    echo -e "  4. Try running with --skip-update if updates are causing issues"
    echo -e "  5. Join our Discord for support: https://discord.gg/lovable"
    echo ""
    
    cleanup
    exit $exit_code
}

trap 'handle_error $LINENO' ERR

# Run main installation
main "$@"
