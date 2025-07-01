# 🌊 NeptuneOS - Comprehensive Setup Guide

This guide covers installation, development, and deployment of NeptuneOS for both Raspberry Pi appliances and local development environments with enhanced automation and user-friendly scripts.

---

## 🚀 Quick Start (Recommended)

### Option 1: Full Automated Installation
The **recommended** installation method with comprehensive validation, progress tracking, and error handling:

```bash
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos
sudo bash deploy/install.sh
```

**Features:**
- ✅ Interactive progress tracking with visual indicators
- ✅ Comprehensive system validation and prerequisites checking
- ✅ Automatic backup creation before installation
- ✅ Intelligent error handling and recovery suggestions
- ✅ Service verification and health checks
- ✅ Built-in monitoring and management tools

### Option 2: Quick Setup (Experienced Users)
For experienced users who want a minimal installation:

```bash
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos
sudo bash deploy/quick-setup.sh
```

### Option 3: Development Setup
For local development and testing:

```bash
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos
npm install && npm run dev  # Frontend
cd deploy && npm install && npm start  # Backend (separate terminal)
```

---

## 📋 Installation Options & Flags

### Advanced Installation Flags
The main installer supports several flags for customization:

```bash
# Skip system updates (faster but less secure)
sudo bash deploy/install.sh --skip-update

# Skip camera setup (if no camera available)
sudo bash deploy/install.sh --skip-camera

# Non-interactive mode (for automated deployments)
sudo bash deploy/install.sh --non-interactive

# Force installation (overwrite existing)
sudo bash deploy/install.sh --force

# Skip monitoring setup
sudo bash deploy/install.sh --no-monitoring

# Combine multiple flags
sudo bash deploy/install.sh --skip-update --non-interactive --skip-camera
```

### Help and Documentation
```bash
# Show all available options
sudo bash deploy/install.sh --help
```

---

## 🔧 Prerequisites & System Requirements

### Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Device** | Raspberry Pi 3B+ | Raspberry Pi 4B (4GB+) |
| **Storage** | 8GB SD Card | 32GB+ High-speed SD Card |
| **RAM** | 512MB available | 1GB+ available |
| **Network** | WiFi or Ethernet | Gigabit Ethernet |
| **Camera** | Optional | USB or Pi Camera Module |

### Software Prerequisites
- **OS**: Raspberry Pi OS (Bullseye or newer)
- **Architecture**: ARM64 or ARMv7l
- **Internet**: Stable connection for downloads
- **Access**: SSH or direct terminal access

### Pre-Installation Checklist
The installer automatically checks these, but you can verify manually:

```bash
# Check available disk space (need 2GB+)
df -h /

# Check available RAM (need 512MB+)
free -h

# Check internet connectivity
ping -c 3 google.com

# Check architecture compatibility
uname -m  # Should show: aarch64, armv7l, or armv6l
```

---

## 🎯 What Gets Installed

### System Components
1. **Core Dependencies**
   - Node.js 18.x and npm
   - Nginx web server
   - PM2 process manager
   - SQLite3 database
   - Development tools (cmake, build-essential)

2. **Camera Streaming**
   - mjpg-streamer for live video
   - Systemd service for auto-start
   - Optimized 640x480 @ 30fps streaming

3. **Web Services**
   - React frontend (production build)
   - Express.js API server
   - Nginx reverse proxy configuration
   - SSL-ready configuration

### Directory Structure
```
/home/[user]/neptuneos/
├── 📱 Frontend (React app)
│   ├── dist/                 # Production build
│   ├── src/                  # Source code
│   └── package.json
├── 🖥️ Backend (API server)
│   ├── deploy/
│   │   ├── api-server.cjs    # Main API server
│   │   ├── database.cjs      # Database handler
│   │   ├── data/            # SQLite database
│   │   └── routes/          # API endpoints
├── 🎥 Camera Streaming
│   └── mjpg-streamer/       # Camera streaming service
└── 🔧 Configuration
    ├── nginx.conf           # Web server config
    ├── ecosystem.config.cjs  # PM2 config
    └── *.service           # Systemd services
```

---

## 🎛️ Post-Installation Management

### Built-in Management Tools

After installation, you have access to these convenient commands:

```bash
# Check system status
neptune-status

# View API logs
pm2 logs neptuneos-api

# Monitor all processes
pm2 monit

# Restart API server
pm2 restart neptuneos-api

# Check service status
sudo systemctl status nginx
sudo systemctl status mjpg-streamer
```

### Access URLs
- **Main Dashboard**: `http://your-pi-ip/` or `http://neptuneos.local/`
- **Camera Stream**: `http://your-pi-ip:8080/`
- **API Endpoints**: `http://your-pi-ip/api/`

---

## 🔄 Updates & Maintenance

### Automatic Updates
Use the built-in update script for safe, automatic updates:

```bash
# Update to latest version
sudo bash deploy/update.sh
```

**Update Features:**
- ✅ Automatic backup before update
- ✅ Dependency management
- ✅ Service restart and verification
- ✅ Rollback capabilities
- ✅ Configuration migration

### Manual Updates
For development or custom deployments:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd deploy && npm install && cd ..

# Rebuild frontend
npm run build

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

---

## 🗑️ Safe Uninstallation

Remove NeptuneOS completely with automatic backup:

```bash
sudo bash deploy/uninstall.sh
```

**Uninstall Features:**
- ✅ Automatic data backup
- ✅ Complete service removal
- ✅ Configuration cleanup
- ✅ Optional dependency removal
- ✅ System restoration

---

## 🛠️ Hardware Configuration

### Temperature Sensors Setup

**DS18B20 Digital Temperature Sensors:**

1. **Enable 1-Wire Interface:**
   ```bash
   sudo nano /boot/config.txt
   # Add: dtoverlay=w1-gpio
   sudo reboot
   ```

2. **Wiring Diagram:**
   ```
   DS18B20 Sensor      Raspberry Pi
   ──────────────      ─────────────
   Pin 1 (GND)    →    Pin 6 (Ground)
   Pin 2 (Data)   →    Pin 7 (GPIO 4) + 4.7kΩ resistor to 3.3V
   Pin 3 (VDD)    →    Pin 1 (3.3V)
   ```

3. **Verify Detection:**
   ```bash
   # Check 1-Wire module
   lsmod | grep w1
   
   # List detected sensors
   ls /sys/bus/w1/devices/
   # Should show: 28-xxxxxxxxxxxx
   
   # Test sensor reading
   cat /sys/bus/w1/devices/28-*/w1_slave
   ```

### Camera Configuration

**USB Camera Setup:**
```bash
# Detect camera
lsusb | grep -i camera
ls /dev/video*

# Test camera
v4l2-ctl --list-devices
v4l2-ctl --list-formats-ext
```

**Raspberry Pi Camera Module:**
```bash
# Enable camera interface
sudo raspi-config
# Navigate: Interface Options → Camera → Enable

# Test camera
raspistill -o test.jpg
vcgencmd get_camera
```

**Troubleshooting Camera Issues:**
```bash
# Check camera service
sudo systemctl status mjpg-streamer

# View camera logs
sudo journalctl -fu mjpg-streamer

# Manual camera test
/usr/local/bin/mjpg_streamer -i "input_uvc.so -d /dev/video0" -o "output_http.so -p 8080"
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

**Installation Fails:**
```bash
# Check system requirements
df -h /              # Disk space
free -h              # Memory
ping google.com      # Internet

# Run with additional logging
sudo bash deploy/install.sh --help
```

**Services Not Starting:**
```bash
# Check service status
sudo systemctl status nginx
sudo systemctl status mjpg-streamer
pm2 status

# Check logs
sudo journalctl -fu nginx
sudo journalctl -fu mjpg-streamer
pm2 logs neptuneos-api
```

**Web Interface Not Loading:**
```bash
# Test local access
curl http://localhost
curl -I http://localhost/api/health

# Check nginx configuration
sudo nginx -t
sudo systemctl reload nginx

# Check firewall
sudo ufw status
```

**Camera Not Working:**
```bash
# Check camera detection
ls /dev/video*
v4l2-ctl --list-devices

# Test mjpg-streamer manually
sudo systemctl stop mjpg-streamer
/usr/local/bin/mjpg_streamer -i "input_uvc.so -d /dev/video0" -o "output_http.so -p 8080"
```

**Git Permission Issues:**
```bash
# Fix repository permissions
sudo chown -R $USER:$USER ~/neptuneos
git config --global --add safe.directory ~/neptuneos
```

### Performance Optimization

**System Performance:**
```bash
# Monitor resources
htop                 # CPU and memory
iotop               # Disk I/O
nethogs             # Network usage

# Optimize camera settings
# Edit /etc/systemd/system/mjpg-streamer.service
# Reduce resolution: -r 320x240
# Lower framerate: -f 15
# Adjust quality: -q 80
```

**Memory Management:**
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# PM2 memory management
pm2 show neptuneos-api
pm2 restart neptuneos-api
```

---

## 🧪 Development Environment

### Local Development Setup

**Requirements:**
- Node.js 18+ and npm
- Git
- Modern web browser

**Quick Start:**
```bash
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos

# Install dependencies
npm install
cd deploy && npm install && cd ..

# Start development servers
npm run dev          # Frontend (http://localhost:5173)
# In another terminal:
cd deploy && npm start  # Backend (http://localhost:3001)
```

**Environment Configuration:**
Create `.env` in the root directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_CAMERA_STREAM_URL=http://your-pi-ip:8080/?action=stream

# Feature Flags
VITE_ENABLE_CAMERA=true
VITE_ENABLE_FUTURE_FEATURES=false
VITE_DEBUG_MODE=true

# Development Settings
VITE_HOT_RELOAD=true
VITE_MOCK_DATA=false
```

### VS Code Setup
**Recommended Extensions:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```

---

## 🔐 Security Considerations

### Network Security
```bash
# Configure firewall
sudo ufw enable
sudo ufw allow 22     # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443    # HTTPS (future)
sudo ufw allow 8080   # Camera stream
```

### SSL/HTTPS Setup (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (requires domain)
sudo certbot --nginx -d your-domain.com

# Automatic renewal
sudo systemctl enable certbot.timer
```

### Access Control
- Change default SSH port
- Use SSH key authentication
- Configure fail2ban for brute force protection
- Regular system updates

---

## 📊 Monitoring & Logging

### System Monitoring
```bash
# Built-in status command
neptune-status

# Detailed service monitoring
pm2 monit
systemctl status --all

# Log aggregation
sudo journalctl -f    # All system logs
pm2 logs --lines 100  # Application logs
```

### Performance Metrics
- **CPU Usage**: Monitor with `htop`
- **Memory Usage**: Track with `free -h`
- **Disk I/O**: Monitor with `iotop`
- **Network**: Check with `nethogs`
- **Temperature**: Use `vcgencmd measure_temp`

---

## 🤝 Contributing & Support

### Getting Help
- 📚 **Documentation**: This comprehensive setup guide
- 💬 **Discord**: [Community Support](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🐛 **Issues**: GitHub issue tracker
- 📺 **Tutorials**: [Video guides](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Feedback
Your feedback helps improve NeptuneOS! Please report:
- Installation issues
- Performance problems
- Feature requests
- Documentation gaps

---

## 📜 Changelog & Version History

### Latest Version Features
- ✅ **Comprehensive installer** with progress tracking
- ✅ **Automatic updates** with backup and rollback
- ✅ **Safe uninstallation** with data preservation
- ✅ **Built-in monitoring** and management tools
- ✅ **Enhanced error handling** and recovery
- ✅ **Multiple installation methods** for different user levels

---

**🌊 Ready to dive in? Start with the automated installer: `sudo bash deploy/install.sh` 🚀**
