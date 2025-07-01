# 🚀 NeptuneOS Deployment Scripts

This directory contains all the scripts and configuration files needed to deploy NeptuneOS on a Raspberry Pi.

## 📜 Available Scripts

### 🌊 Main Installation Scripts

| Script | Purpose | Users | Features |
|--------|---------|-------|----------|
| **`install.sh`** | Full automated installation | All users | Progress tracking, validation, monitoring |
| **`quick-setup.sh`** | Minimal installation | Experienced users | Fast deployment, basic setup |
| **`update.sh`** | Update existing installation | All users | Safe updates with backup |
| **`uninstall.sh`** | Complete removal | All users | Safe removal with backup |

### 🔧 Usage Examples

```bash
# Recommended: Full installation with all features
sudo bash deploy/install.sh

# Quick installation for experienced users
sudo bash deploy/quick-setup.sh

# Update existing installation
sudo bash deploy/update.sh

# Safely remove NeptuneOS
sudo bash deploy/uninstall.sh
```

### 🎛️ Installation Options

The main installer supports these flags:

```bash
# Installation customization
sudo bash deploy/install.sh --skip-update      # Skip system updates
sudo bash deploy/install.sh --skip-camera      # Skip camera setup
sudo bash deploy/install.sh --non-interactive  # No user prompts
sudo bash deploy/install.sh --force           # Overwrite existing
sudo bash deploy/install.sh --no-monitoring   # Skip monitoring

# Get help
sudo bash deploy/install.sh --help
```

## 📁 Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| **`nginx.conf`** | Web server configuration | Reverse proxy setup |
| **`ecosystem.config.cjs`** | PM2 process management | API server config |
| **`mjpg-streamer.service`** | Camera service | Systemd service |
| **`package.json`** | Backend dependencies | Express.js API |
| **`api-server.cjs`** | Main API server | Backend application |
| **`database.cjs`** | Database handler | SQLite management |

## 🔍 Monitoring & Logs

After installation, use these commands:

```bash
# Check system status
neptune-status

# Monitor processes
pm2 monit

# View logs
pm2 logs neptuneos-api
sudo journalctl -fu mjpg-streamer
sudo journalctl -fu nginx

# Service management
sudo systemctl status nginx
sudo systemctl status mjpg-streamer
pm2 status
```

## 🛠️ Manual Operations

### Start/Stop Services
```bash
# PM2 (API server)
pm2 start/stop/restart neptuneos-api

# System services
sudo systemctl start/stop/restart nginx
sudo systemctl start/stop/restart mjpg-streamer
```

### Database Operations
```bash
cd deploy
node -e "const db = require('./database.cjs'); new db();"
```

### Backup Operations
```bash
# Manual backup
tar -czf backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=mjpg-streamer \
  /home/$USER/neptuneos
```

## 🔧 Troubleshooting

### Common Issues

**Permission Errors:**
```bash
sudo chown -R $USER:$USER ~/neptuneos
chmod +x deploy/*.sh
```

**Service Not Starting:**
```bash
# Check logs
sudo journalctl -fu service-name
pm2 logs

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

**Port Conflicts:**
```bash
# Check what's using ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :8080
```

### Reset Installation
```bash
# Complete reset (careful!)
sudo bash deploy/uninstall.sh
sudo bash deploy/install.sh --force
```

## 📋 System Requirements

- **Hardware**: Raspberry Pi 3B+ or newer
- **OS**: Raspberry Pi OS (Bullseye+)
- **Storage**: 2GB+ free space
- **RAM**: 512MB+ available
- **Network**: Internet connection required

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| **Install** | `sudo bash deploy/install.sh` |
| **Update** | `sudo bash deploy/update.sh` |
| **Status** | `neptune-status` |
| **Logs** | `pm2 logs neptuneos-api` |
| **Monitor** | `pm2 monit` |
| **Restart** | `pm2 restart neptuneos-api` |
| **Remove** | `sudo bash deploy/uninstall.sh` |

## 🌐 Access Points

After successful installation:

- **Dashboard**: `http://your-pi-ip/`
- **Camera**: `http://your-pi-ip:8080/`
- **API**: `http://your-pi-ip/api/`

---

For detailed documentation, see the main [SETUP.md](../SETUP.md) file.