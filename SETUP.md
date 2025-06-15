
# 🌊 NeptuneOS - Setup, Development & Deployment Guide

This guide provides comprehensive instructions for setting up NeptuneOS, whether you're deploying it as a Raspberry Pi appliance or developing on it locally.

---

## 1. 🚀 Automated Installation (Recommended for Raspberry Pi)

For the fastest setup, run this one-line command on your Raspberry Pi terminal. This will download and execute the installation script, which automates all the necessary steps to turn your Pi into a NeptuneOS appliance.

```bash
curl -sL https://raw.githubusercontent.com/lovable-community/neptuneos/main/deploy/install.sh | sudo bash
```

### What the Automated Script Does:
- ✅ Updates and upgrades your Raspberry Pi OS.
- ✅ Installs necessary software: `git`, `nginx`, `nodejs`, `npm`, and `pm2`.
- ✅ Clones the NeptuneOS repository from GitHub.
- ✅ Builds the React frontend for production.
- ✅ Configures `nginx` as a reverse proxy for the frontend, backend API, and camera stream.
- ✅ Sets up the backend API server to run automatically on boot using `pm2`.
- ✅ Installs and configures `mjpg-streamer` for the camera feed and runs it as a systemd service.
- ✅ Reboots the system to apply all changes.

After rebooting, you can access the NeptuneOS dashboard by navigating to your Raspberry Pi's IP address in a web browser.

---

## 2. 🖥️ Development Environment Setup

If you wish to contribute to NeptuneOS or run it in a local development environment, follow these steps.

### Prerequisites
- **Node.js**: v16 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Local Installation
```bash
# 1. Clone the repository
git clone https://github.com/lovable-community/neptuneos.git
cd neptuneos

# 2. Install dependencies
npm install
```

### Running the Development Server
```bash
# Start the Vite development server
npm run dev

# The application will be available at http://localhost:5173
```
### Environment Variables (Optional)
For local development, you can create a `.env` file in the root directory to override default API endpoints if your backend is not running on the same machine or you want to connect to a live Pi.

```env
# Example .env file for local development
VITE_API_BASE_URL=http://<your-pi-ip-address>
VITE_CAMERA_STREAM_URL=http://<your-pi-ip-address>:8080/?action=stream
```

### Recommended VS Code Setup
**Extensions:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

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

## 3. ⚙️ Hardware Configuration (for Raspberry Pi)

This section details how to connect and configure hardware like temperature sensors and cameras.

### Temperature Sensors (DS18B20)
**Wiring:**
- **Sensor Pin 1 (Ground)** -> Pi Ground (Pin 6)
- **Sensor Pin 2 (Data)** -> Pi GPIO 4 (Pin 7) with a 4.7kΩ pull-up resistor to 3.3V
- **Sensor Pin 3 (Power)** -> Pi 3.3V (Pin 1)

**Enable 1-Wire Interface:**
1.  Edit Raspberry Pi config: `sudo nano /boot/config.txt`
2.  Add this line: `dtoverlay=w1-gpio`
3.  Reboot: `sudo reboot`
4.  Verify sensors appear: `ls /sys/bus/w1/devices/` (You should see directories named `28-xxxxxxxxxxxx`)

### Camera Setup
The system is configured to work with a standard USB camera or the Raspberry Pi camera module. `mjpg-streamer` is used for streaming.

**For USB Camera:**
1.  Plug the camera into a USB port.
2.  Verify it's detected: `ls /dev/video*`

**For Raspberry Pi Camera Module:**
1.  Enable the camera using `sudo raspi-config` under `Interface Options`.
2.  Reboot when prompted.

The automated installer (`install.sh`) handles the installation and configuration of `mjpg-streamer`. The service will automatically start streaming from `/dev/video0`.

---

## 4. 🌐 Advanced Deployment & Manual Setup

This section is for users who want to understand the deployment process or set it up manually.

### Backend API Server
The backend is a simple Express.js server located at `deploy/api-server.js`. It serves system information and sensor data.

**PM2 Process Management (Recommended):**
The `install.sh` script uses PM2 to manage the API server.
- **Start:** `pm2 start deploy/ecosystem.config.js`
- **Monitor:** `pm2 monit`
- **Startup on Boot:** `pm2 startup` and `pm2 save`

### Nginx Reverse Proxy
Nginx is crucial for routing traffic correctly. The configuration is at `deploy/nginx.conf`. It handles:
- Serving the built React app (from the `/dist` folder).
- Proxying `/api` requests to the Node.js backend on port 3001.
- Proxying `/stream` requests to the `mjpg-streamer` on port 8080.

### Network Configuration (Optional)
For a stable setup, you may want to configure a static IP.

**Set Static IP:**
1.  Edit the DHCP configuration: `sudo nano /etc/dhcpcd.conf`
2.  Add the following lines, adjusted for your network:
    ```
    interface wlan0
    static ip_address=192.168.1.100/24
    static routers=192.168.1.1
    static domain_name_servers=192.168.1.1 8.8.8.8
    ```

---

## 5. 🔧 Troubleshooting

### Temperature Sensors Not Detected
- Double-check your wiring, especially the pull-up resistor.
- Ensure the 1-Wire interface is enabled in `/boot/config.txt`.
- Run `lsmod | grep w1` to see if the kernel modules are loaded.

### Camera Not Streaming
- Verify the camera is detected with `ls /dev/video0`.
- Check the `mjpg-streamer` service status: `sudo systemctl status mjpg-streamer.service`
- Check the service logs for errors: `sudo journalctl -fu mjpg-streamer.service`

### Web Interface Not Loading
- Ensure Nginx is running: `sudo systemctl status nginx`
- Ensure the API server is running: `pm2 status`
- Check your browser's developer console for network errors.

---
For further help, please refer to the support channels listed in the main [README.md](./README.md).
