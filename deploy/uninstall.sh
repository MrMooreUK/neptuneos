#!/bin/bash

# ====================================================================
# 🗑️ NeptuneOS - Uninstall Script
# ====================================================================
# Safely removes NeptuneOS and all its components
# ====================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ACTUAL_USER=${SUDO_USER:-$(logname)}
USER_HOME="/home/$ACTUAL_USER"
INSTALL_DIR="$USER_HOME/neptuneos"

echo -e "${BLUE}🗑️ NeptuneOS Uninstaller${NC}"
echo "========================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run with sudo privileges${NC}"
    exit 1
fi

# Confirmation
echo -e "${YELLOW}⚠️  This will completely remove NeptuneOS and all its data.${NC}"
echo -e "${YELLOW}   The following will be removed:${NC}"
echo "   • All application files"
echo "   • Database and user data"
echo "   • System services"
echo "   • Nginx configuration"
echo "   • PM2 processes"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${BLUE}ℹ️  Uninstall cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🗑️ Starting uninstallation...${NC}"

# Create backup before uninstalling
BACKUP_FILE="$USER_HOME/neptuneos_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${BLUE}📦 Creating backup: $BACKUP_FILE${NC}"
    tar -czf "$BACKUP_FILE" \
        --ignore-failed-read \
        "$INSTALL_DIR/deploy/data" \
        "$USER_HOME/.pm2" \
        2>/dev/null || true
    echo -e "${GREEN}✅ Backup created${NC}"
fi

# Stop and remove PM2 processes
echo -e "${BLUE}🛑 Stopping PM2 processes...${NC}"
sudo -u $ACTUAL_USER pm2 stop all 2>/dev/null || true
sudo -u $ACTUAL_USER pm2 delete all 2>/dev/null || true
sudo -u $ACTUAL_USER pm2 unstartup 2>/dev/null || true
sudo -u $ACTUAL_USER pm2 kill 2>/dev/null || true
echo -e "${GREEN}✅ PM2 processes stopped${NC}"

# Stop and remove systemd services
echo -e "${BLUE}🛑 Removing systemd services...${NC}"
systemctl stop mjpg-streamer.service 2>/dev/null || true
systemctl disable mjpg-streamer.service 2>/dev/null || true
rm -f /etc/systemd/system/mjpg-streamer.service
systemctl daemon-reload
echo -e "${GREEN}✅ Systemd services removed${NC}"

# Remove Nginx configuration
echo -e "${BLUE}🌐 Removing Nginx configuration...${NC}"
rm -f /etc/nginx/sites-enabled/neptuneos
rm -f /etc/nginx/sites-available/neptuneos
systemctl restart nginx 2>/dev/null || true
echo -e "${GREEN}✅ Nginx configuration removed${NC}"

# Remove application files
echo -e "${BLUE}📁 Removing application files...${NC}"
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo -e "${GREEN}✅ Application files removed${NC}"
else
    echo -e "${YELLOW}⚠️  Application directory not found${NC}"
fi

# Remove user data
rm -f "$USER_HOME/.neptuneos_installed"
sed -i '/neptune-status/d' "$USER_HOME/.bashrc" 2>/dev/null || true

# Optional: Remove global packages
echo ""
echo -e "${YELLOW}Optional cleanup:${NC}"
read -p "Remove PM2 globally? (y/N): " remove_pm2
if [[ $remove_pm2 =~ ^[Yy]$ ]]; then
    npm uninstall -g pm2
    echo -e "${GREEN}✅ PM2 removed${NC}"
fi

read -p "Remove Node.js and npm? (y/N): " remove_node
if [[ $remove_node =~ ^[Yy]$ ]]; then
    apt-get remove -y nodejs npm
    apt-get autoremove -y
    echo -e "${GREEN}✅ Node.js removed${NC}"
fi

read -p "Remove Nginx? (y/N): " remove_nginx
if [[ $remove_nginx =~ ^[Yy]$ ]]; then
    systemctl stop nginx
    systemctl disable nginx
    apt-get remove -y nginx
    apt-get autoremove -y
    echo -e "${GREEN}✅ Nginx removed${NC}"
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════╗${NC}"
echo -e "${GREEN}║    🎉 Uninstall Complete!       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "• NeptuneOS has been completely removed"
echo "• Backup created: $BACKUP_FILE"
echo "• All services have been stopped and disabled"
echo "• System configuration has been restored"
echo ""
echo -e "${YELLOW}Note: You may want to reboot to ensure all changes take effect.${NC}"