
# 🌊 NeptuneOS - Setup, Development & Deployment Guide

This comprehensive guide covers installation, development, and deployment of NeptuneOS for both Raspberry Pi appliances and local development environments.

---

## 1. 🚀 Automated Installation (Raspberry Pi)

The recommended way to deploy NeptuneOS on a Raspberry Pi with full automation.

### Prerequisites
- Raspberry Pi 4B or newer with Raspberry Pi OS
- Internet connection (Ethernet or WiFi)
- SD card with at least 8GB storage
- USB camera or Raspberry Pi camera module (optional)

### Step 1: Fork and Clone Repository

1. **Fork** the [NeptuneOS repository](https://github.com/lovable-community/neptuneos) to your GitHub account
2. **Connect** to your Raspberry Pi via SSH or directly with monitor/keyboard
3. **Clone** your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/neptuneos.git
   cd neptuneos
   ```

### Step 2: Run Automated Installer

Execute the installation script with administrative privileges:

```bash
sudo bash deploy/install.sh
```

### What the Installer Does

The automated installer performs these operations:

✅ **System Updates**
- Updates package lists and upgrades system packages
- Installs essential dependencies (git, nginx, cmake, libjpeg-dev)

✅ **Node.js & Package Management**
- Installs Node.js 18.x and npm
- Installs PM2 for process management
- Sets up startup scripts for auto-boot

✅ **Frontend Build**
- Runs `npm install` and `npm run build`
- Fixes file permissions for git operations

✅ **Backend Configuration**
- Installs backend dependencies
- Configures PM2 ecosystem for API server
- Sets up auto-start on system boot

✅ **Web Server Setup**
- Configures Nginx as reverse proxy
- Routes frontend, API, and camera streams
- Enables HTTPS-ready configuration

✅ **Camera Streaming**
- Clones and builds mjpg-streamer
- Creates systemd service for camera
- Configures optimized 640x480 streaming

✅ **Security & Permissions**
- Fixes git repository permissions
- Configures safe directories for git operations
- Sets proper ownership for all files

### Post-Installation

After successful installation and reboot:
- Access dashboard at: `http://neptuneos.local/`
- Camera stream available at: `http://neptuneos.local:8080`
- All services auto-start on boot

---

## 2. 🖥️ Local Development Setup

For contributors and developers wanting to run NeptuneOS locally.

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v8 or higher  
- **Git**: Latest version
- **Modern browser**: Chrome, Firefox, Safari, or Edge

### Installation Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd deploy
npm install
cd ..

# 4. Start development servers
npm run dev          # Frontend (Vite dev server)
# In another terminal:
cd deploy && npm start  # Backend API server
```

### Environment Configuration

Create `.env` file in root directory for custom configuration:

```env
# Development API endpoints
VITE_API_BASE_URL=http://localhost:3001
VITE_CAMERA_STREAM_URL=http://your-pi-ip:8080/?action=stream

# Feature toggles
VITE_ENABLE_CAMERA=true
VITE_ENABLE_FUTURE_FEATURES=false
VITE_DEBUG_MODE=true
```

### Development URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

### Recommended VS Code Setup

**Extensions:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- TypeScript Importer

**`.vscode/settings.json`:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```

---

## 3. ⚙️ Hardware Configuration

### Temperature Sensors (DS18B20)

**Required Components:**
- DS18B20 temperature sensors (1-2 units)
- 4.7kΩ resistor (pull-up)
- Breadboard and jumper wires

**Wiring Diagram:**
```
DS18B20 Pin 1 (GND)  -> Pi Ground (Pin 6)
DS18B20 Pin 2 (Data) -> Pi GPIO 4 (Pin 7) + 4.7kΩ resistor to 3.3V
DS18B20 Pin 3 (VDD)  -> Pi 3.3V (Pin 1)
```

**Software Configuration:**
1. Enable 1-Wire interface:
   ```bash
   sudo nano /boot/config.txt
   # Add: dtoverlay=w1-gpio
   sudo reboot
   ```

2. Verify sensor detection:
   ```bash
   ls /sys/bus/w1/devices/
   # Should show: 28-xxxxxxxxxxxx directories
   ```

### Camera Setup

**USB Camera:**
1. Connect camera to USB port
2. Verify detection: `ls /dev/video*`
3. Test with: `mjpg_streamer -i "input_uvc.so -d /dev/video0" -o "output_http.so -p 8080"`

**Raspberry Pi Camera Module:**
1. Enable camera interface:
   ```bash
   sudo raspi-config
   # Navigate to: Interface Options > Camera > Enable
   sudo reboot
   ```

2. Verify camera: `vcgencmd get_camera`

### Network Configuration

**Static IP Setup (Optional):**
```bash
sudo nano /etc/dhcpcd.conf

# Add these lines:
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

---

## 4. 🌐 Manual Deployment & Advanced Configuration

### Backend API Server

The Express.js backend serves system information and sensor data.

**Manual PM2 Setup:**
```bash
# Install PM2 globally
npm install -g pm2

# Start API server
pm2 start deploy/ecosystem.config.cjs

# Configure auto-start
pm2 startup
pm2 save

# Monitor processes
pm2 monit
pm2 logs neptuneos-api
```

**API Endpoints:**
- `GET /api/temperature` - Temperature sensor data
- `GET /api/system` - System information
- `GET /api/health` - Health check

### Nginx Configuration

The reverse proxy configuration handles all routing:

**Configuration File:** `deploy/nginx.conf`
- Serves React app from `/dist` folder
- Proxies `/api/*` to backend on port 3001
- Proxies `/stream` to mjpg-streamer on port 8080
- Includes security headers and caching

**Manual Nginx Setup:**
```bash
# Copy configuration
sudo cp deploy/nginx.conf /etc/nginx/sites-available/neptuneos

# Enable site
sudo ln -s /etc/nginx/sites-available/neptuneos /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Camera Streaming Service

**Manual mjpg-streamer Setup:**
```bash
# Clone and build
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental
make && sudo make install

# Create systemd service
sudo cp /path/to/deploy/mjpg-streamer.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mjpg-streamer.service
sudo systemctl start mjpg-streamer.service
```

---

## 5. 🔧 Troubleshooting

### Common Issues

**Temperature Sensors Not Detected:**
- Verify 1-Wire is enabled: `lsmod | grep w1`
- Check wiring and pull-up resistor
- Test sensor manually: `cat /sys/bus/w1/devices/28-*/w1_slave`

**Camera Not Streaming:**
- Check camera detection: `ls /dev/video*`
- Verify mjpg-streamer service: `sudo systemctl status mjpg-streamer.service`
- Check service logs: `sudo journalctl -fu mjpg-streamer.service`

**Web Interface Not Loading:**
- Verify Nginx status: `sudo systemctl status nginx`
- Check API server: `pm2 status`
- Review Nginx logs: `sudo tail -f /var/log/nginx/error.log`

**Git Permission Issues:**
```bash
# Fix repository permissions
sudo chown -R $USER:$USER ~/neptuneos
git config --global --add safe.directory ~/neptuneos
```

**Service Auto-start Issues:**
```bash
# Check PM2 startup
pm2 startup
pm2 save

# Verify systemd services
sudo systemctl is-enabled nginx mjpg-streamer.service
```

### Performance Optimization

**Camera Stream Optimization:**
- Reduce resolution: `-r 320x240` in mjpg-streamer command
- Lower framerate: `-f 15` for reduced bandwidth
- Adjust quality: `-q 80` for balance of quality/performance

**System Resource Management:**
- Monitor with: `htop`, `iotop`, `free -h`
- Adjust PM2 memory limits in ecosystem config
- Configure Nginx worker processes based on CPU cores

### Debug Mode

Enable debug logging for troubleshooting:

```bash
# Frontend debug
VITE_DEBUG_MODE=true npm run dev

# Backend debug  
DEBUG=neptuneos:* npm start

# PM2 debug
pm2 logs --lines 100
```

---

## 6. 🔄 Updates & Maintenance

### Updating NeptuneOS

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd deploy && npm install && cd ..

# Rebuild frontend
npm run build

# Restart services
pm2 restart neptuneos-api
sudo systemctl restart nginx
```

### Backup & Recovery

**System Backup:**
```bash
# Create backup
tar -czf neptuneos-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  ~/neptuneos

# Database backup (if applicable)
pm2 save  # Saves PM2 process list
```

**Configuration Backup:**
- Export settings via web interface
- Save `/etc/nginx/sites-available/neptuneos`
- Save `/etc/systemd/system/mjpg-streamer.service`

---

For additional support, please refer to our [troubleshooting documentation](https://docs.lovable.dev/tips-tricks/troubleshooting) or visit our [Discord community](https://discord.com/channels/1119885301872070706/1280461670979993613).
