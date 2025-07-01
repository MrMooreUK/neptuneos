#!/bin/bash

# ====================================================================
# 🔄 NeptuneOS - Update Script
# ====================================================================
# Safely updates NeptuneOS to the latest version
# ====================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

ACTUAL_USER=${SUDO_USER:-$(logname)}
USER_HOME="/home/$ACTUAL_USER"
INSTALL_DIR="$USER_HOME/neptuneos"
BACKUP_DIR="$INSTALL_DIR/deploy/backup"

echo -e "${CYAN}🔄 NeptuneOS Updater${NC}"
echo "==================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run with sudo privileges${NC}"
    exit 1
fi

# Check if NeptuneOS is installed
if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "${RED}❌ NeptuneOS installation not found${NC}"
    echo "Please install NeptuneOS first using: sudo bash deploy/install.sh"
    exit 1
fi

cd "$INSTALL_DIR"

# Create backup
echo -e "${BLUE}📦 Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/pre_update_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=mjpg-streamer \
    . 2>/dev/null || true
echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes in the repository${NC}"
    echo "Would you like to:"
    echo "1. Stash changes and continue"
    echo "2. Cancel update"
    read -p "Enter choice (1/2): " choice
    
    case $choice in
        1)
            sudo -u $ACTUAL_USER git stash push -m "Pre-update stash $(date)"
            echo -e "${GREEN}✅ Changes stashed${NC}"
            ;;
        *)
            echo -e "${BLUE}ℹ️  Update cancelled${NC}"
            exit 0
            ;;
    esac
fi

# Fetch latest changes
echo -e "${BLUE}⬇️ Fetching latest changes...${NC}"
sudo -u $ACTUAL_USER git fetch origin

# Show available updates
CURRENT_COMMIT=$(git rev-parse HEAD)
LATEST_COMMIT=$(git rev-parse origin/main)

if [ "$CURRENT_COMMIT" = "$LATEST_COMMIT" ]; then
    echo -e "${GREEN}✅ NeptuneOS is already up to date!${NC}"
    exit 0
fi

echo -e "${YELLOW}📋 Available updates:${NC}"
git log --oneline --graph $CURRENT_COMMIT..$LATEST_COMMIT | head -10

echo ""
read -p "Proceed with update? (y/N): " proceed
if [[ ! $proceed =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}ℹ️  Update cancelled${NC}"
    exit 0
fi

# Stop services
echo -e "${BLUE}🛑 Stopping services...${NC}"
sudo -u $ACTUAL_USER pm2 stop all 2>/dev/null || true
systemctl stop mjpg-streamer.service 2>/dev/null || true

# Pull latest code
echo -e "${BLUE}⬇️ Updating code...${NC}"
sudo -u $ACTUAL_USER git pull origin main

# Update dependencies
echo -e "${BLUE}📦 Updating dependencies...${NC}"

# Frontend dependencies
if [ -f "package.json" ]; then
    echo "  • Frontend dependencies"
    sudo -u $ACTUAL_USER npm install
fi

# Backend dependencies
if [ -f "deploy/package.json" ]; then
    echo "  • Backend dependencies"
    cd deploy
    sudo -u $ACTUAL_USER npm install
    cd ..
fi

# Rebuild frontend
echo -e "${BLUE}🏗️ Rebuilding frontend...${NC}"
sudo -u $ACTUAL_USER npm run build

# Database migration (if needed)
echo -e "${BLUE}🗄️ Checking database...${NC}"
cd deploy
sudo -u $ACTUAL_USER node -e "
const Database = require('./database.cjs');
const db = new Database();
console.log('Database check completed');
process.exit(0);
" || echo -e "${YELLOW}⚠️  Database check failed${NC}"
cd ..

# Update service configurations
echo -e "${BLUE}⚙️ Updating service configurations...${NC}"

# Update PM2 config
if [ -f "deploy/ecosystem.config.cjs" ]; then
    sed -i "s|/home/admin/|$USER_HOME/|g" "deploy/ecosystem.config.cjs"
    sed -i "s|admin|$ACTUAL_USER|g" "deploy/ecosystem.config.cjs"
fi

# Update systemd service
if [ -f "deploy/mjpg-streamer.service" ]; then
    sed -i "s|admin|$ACTUAL_USER|g" "deploy/mjpg-streamer.service"
    sed -i "s|/home/admin/|$USER_HOME/|g" "deploy/mjpg-streamer.service"
    cp "deploy/mjpg-streamer.service" /etc/systemd/system/
    systemctl daemon-reload
fi

# Update Nginx config
if [ -f "deploy/nginx.conf" ]; then
    sed -i "s|/home/admin/|$USER_HOME/|g" "deploy/nginx.conf"
    cp "deploy/nginx.conf" /etc/nginx/sites-available/neptuneos
    nginx -t && systemctl reload nginx
fi

# Restart services
echo -e "${BLUE}🚀 Restarting services...${NC}"
cd deploy
sudo -u $ACTUAL_USER pm2 restart all 2>/dev/null || sudo -u $ACTUAL_USER pm2 start ecosystem.config.cjs
cd ..
systemctl start mjpg-streamer.service 2>/dev/null || true

# Fix permissions
echo -e "${BLUE}🔧 Fixing permissions...${NC}"
chown -R $ACTUAL_USER:$ACTUAL_USER "$INSTALL_DIR"

# Verify update
echo -e "${BLUE}🔍 Verifying update...${NC}"
sleep 5

# Check services
errors=0
if ! systemctl is-active --quiet nginx; then
    echo -e "${RED}❌ Nginx is not running${NC}"
    ((errors++))
fi

if ! sudo -u $ACTUAL_USER pm2 describe neptuneos-api &>/dev/null; then
    echo -e "${RED}❌ API server is not running${NC}"
    ((errors++))
fi

if ! curl -s "http://localhost" &>/dev/null; then
    echo -e "${RED}❌ Web interface not accessible${NC}"
    ((errors++))
fi

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All services are running correctly${NC}"
else
    echo -e "${YELLOW}⚠️  Some services may need manual attention${NC}"
fi

# Show version info
CURRENT_VERSION=$(git describe --tags --always)
echo ""
echo -e "${GREEN}╔═══════════════════════════════════╗${NC}"
echo -e "${GREEN}║      🎉 Update Complete!         ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Update Summary:${NC}"
echo "  📅 Date: $(date)"
echo "  📦 Version: $CURRENT_VERSION"
echo "  💾 Backup: $BACKUP_FILE"
echo "  👤 User: $ACTUAL_USER"
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo "  🌐 Dashboard: http://$(hostname -I | awk '{print $1}')"
echo "  📹 Camera: http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo -e "${YELLOW}Quick Commands:${NC}"
echo "  📊 Status: neptune-status"
echo "  📋 Logs: pm2 logs neptuneos-api"
echo "  🔧 Monitor: pm2 monit"
echo ""

if [ $errors -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Update completed with warnings. Check service status:${NC}"
    echo "  sudo systemctl status nginx"
    echo "  pm2 status"
    echo "  sudo systemctl status mjpg-streamer"
fi