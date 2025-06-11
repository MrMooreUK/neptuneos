
# 🛠️ NeptuneOS Setup Guide

## 🚀 Quick Start Installation

### Prerequisites Checklist
- ✅ **Node.js** v16 or higher ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** for version control
- ✅ **Modern browser** (Chrome, Firefox, Safari, Edge)

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or with yarn
yarn install
```

### 2️⃣ Environment Configuration

Create a `.env` file in the project root:

```env
# 🌐 API Configuration
VITE_API_BASE_URL=http://192.168.1.100:3001
VITE_CAMERA_STREAM_URL=http://192.168.1.100:8080/stream

# 🎛️ Feature Flags
VITE_ENABLE_CAMERA=true
VITE_ENABLE_FUTURE_FEATURES=false
VITE_AUTO_REFRESH_DEFAULT=true
VITE_DEFAULT_REFRESH_INTERVAL=30

# 🌡️ Temperature Settings
VITE_TEMP_UNIT_DEFAULT=C
VITE_TEMP_COLD_THRESHOLD=24
VITE_TEMP_HOT_THRESHOLD=28

# 🎨 Theme Configuration
VITE_DEFAULT_THEME=light
VITE_ENABLE_THEME_SWITCHING=true
```

### 3️⃣ Start Development Server

```bash
# Start the development server
npm run dev
# or with yarn
yarn dev

# Server will start at http://localhost:5173
```

## 🖥️ Development Environment

### Recommended VS Code Extensions
- 🔧 **ES7+ React/Redux/React-Native snippets**
- 🎨 **Tailwind CSS IntelliSense**
- 📘 **TypeScript Importer**
- 🎯 **Auto Rename Tag**
- 🔍 **Bracket Pair Colorizer**
- 📝 **Prettier - Code formatter**
- 🧹 **ESLint**

### VS Code Settings
Add to your `.vscode/settings.json`:

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

## 🔧 Hardware Setup

### 🌡️ Temperature Sensors

#### DS18B20 Sensors (Recommended)
```bash
# Raspberry Pi GPIO pins
Sensor 1: GPIO 4 (Pin 7)
Sensor 2: GPIO 17 (Pin 11)
Power: 3.3V (Pin 1)
Ground: Ground (Pin 6)
```

#### Wiring Diagram
```
DS18B20 Sensor
┌─────────────┐
│ 1  2  3     │  1: Ground (Black)
│ │  │  │     │  2: Data (Yellow)
│ │  │  │     │  3: Power (Red)
└─┼──┼──┼─────┘
  │  │  │
  │  │  └── 3.3V (Pin 1)
  │  └───── GPIO 4 (Pin 7) + 4.7kΩ pullup resistor
  └──────── Ground (Pin 6)
```

#### Enable 1-Wire Interface
```bash
# Edit Raspberry Pi config
sudo nano /boot/config.txt

# Add this line
dtoverlay=w1-gpio

# Reboot
sudo reboot

# Verify sensors
cat /sys/bus/w1/devices/*/w1_slave
```

### 📹 Camera Setup

#### USB Camera
```bash
# List available cameras
lsusb | grep -i camera

# Test camera
cheese  # GUI camera test
# or
ffplay /dev/video0  # Command line test
```

#### Raspberry Pi Camera
```bash
# Enable camera interface
sudo raspi-config
# Navigate to Interface Options > Camera > Enable

# Test camera
raspistill -o test.jpg  # Take photo
raspivid -t 10000 -o test.h264  # Record video
```

#### Streaming Setup
```bash
# Install mjpg-streamer
sudo apt update
sudo apt install cmake libjpeg-dev

git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install

# Start streaming
mjpg_streamer -i "input_uvc.so -d /dev/video0 -r 1280x720 -f 30" -o "output_http.so -p 8080 -w ./www"
```

## 🌐 Network Configuration

### WiFi Setup
```bash
# Configure WiFi on Raspberry Pi
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

# Add network configuration
network={
    ssid="YourNetworkName"
    psk="YourPassword"
}

# Apply changes
sudo systemctl restart networking
```

### Static IP Configuration
```bash
# Edit DHCP configuration
sudo nano /etc/dhcpcd.conf

# Add static IP configuration
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

### Firewall Rules
```bash
# Allow HTTP traffic
sudo ufw allow 80
sudo ufw allow 443

# Allow camera stream
sudo ufw allow 8080

# Allow API access
sudo ufw allow 3001

# Enable firewall
sudo ufw enable
```

## 🖥️ Backend API Setup

### Express.js Server Example
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Temperature endpoint
app.get('/api/temperature', (req, res) => {
  try {
    // Read DS18B20 sensors
    const sensor1Path = '/sys/bus/w1/devices/28-xxxxxxxxxxxx/w1_slave';
    const sensor2Path = '/sys/bus/w1/devices/28-yyyyyyyyyyyy/w1_slave';
    
    const temp1 = readTemperature(sensor1Path);
    const temp2 = readTemperature(sensor2Path);
    const average = (temp1 + temp2) / 2;
    
    res.json({
      sensor1: temp1,
      sensor2: temp2,
      average: average,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read sensors' });
  }
});

function readTemperature(sensorPath) {
  const data = fs.readFileSync(sensorPath, 'utf8');
  const tempMatch = data.match(/t=(-?\d+)/);
  return tempMatch ? parseInt(tempMatch[1]) / 1000 : null;
}

app.listen(PORT, () => {
  console.log(`🌊 NeptuneOS API running on port ${PORT}`);
});
```

### Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/neptuneos-api.service
```

```ini
[Unit]
Description=NeptuneOS API Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/neptuneos-api
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable neptuneos-api
sudo systemctl start neptuneos-api
sudo systemctl status neptuneos-api
```

## 🚀 Production Deployment

### Build for Production
```bash
# Create optimized build
npm run build
# or
yarn build

# Files will be in the 'dist' directory
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/neptuneos
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/neptuneos/dist;
    index index.html;
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Camera stream proxy
    location /stream {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Troubleshooting

### Common Issues

#### 🌡️ Temperature Sensors Not Detected
```bash
# Check 1-wire interface
lsmod | grep w1
# Should show: w1_gpio, w1_therm

# Check device tree
ls /sys/bus/w1/devices/
# Should show sensor IDs like 28-xxxxxxxxxxxx

# Check sensor data
cat /sys/bus/w1/devices/28-*/w1_slave
# Should show temperature data
```

#### 📹 Camera Not Working
```bash
# Check camera connection
lsusb | grep -i camera
v4l2-ctl --list-devices

# Check permissions
sudo usermod -a -G video $USER
# Logout and login again

# Test camera
cheese  # GUI test
ffplay /dev/video0  # Command line test
```

#### 🌐 Network Issues
```bash
# Check network status
ip addr show
iwconfig  # WiFi status

# Test connectivity
ping google.com
curl -I http://localhost:3001/api/temperature

# Check firewall
sudo ufw status
```

#### 💻 Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update

# Check Node.js version
node --version  # Should be v16+
```

### Performance Optimization

#### Memory Usage
```bash
# Monitor memory
free -h
top -p $(pgrep node)

# Increase swap (if needed)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### CPU Usage
```bash
# Monitor CPU
htop
iostat 1

# Optimize Node.js
export NODE_OPTIONS="--max-old-space-size=512"
```

## 📞 Support & Resources

### Getting Help
- 📚 **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- 💬 **Discord**: [Community Support](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🎥 **Tutorials**: [YouTube Playlist](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)
- 🐛 **Issues**: GitHub Issues section

### Useful Commands
```bash
# System information
uname -a                    # System info
cat /proc/cpuinfo          # CPU info
cat /proc/meminfo          # Memory info
df -h                      # Disk usage
vcgencmd measure_temp      # Pi temperature

# Service management
sudo systemctl status service-name
sudo systemctl restart service-name
sudo journalctl -f -u service-name

# Network debugging
netstat -tlnp              # Open ports
ss -tulpn                  # Socket statistics
nmap localhost             # Port scan
```

---

🎉 **Congratulations!** You should now have NeptuneOS running successfully. If you encounter any issues, refer to the troubleshooting section or reach out to the community for support.
