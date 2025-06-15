
# 🌊 NeptuneOS - Aquarium Monitoring System

<div align="center">
  <img src="public/lovable-uploads/7a639741-946c-4ffe-83f1-6db4098f2d5b.png" alt="NeptuneOS Logo" width="200"/>
  
  **A modern, responsive aquarium monitoring dashboard built with React & TypeScript**
  
  [![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
  [![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
</div>

---

## 🐠 Overview

NeptuneOS is a sophisticated aquarium monitoring system that provides real-time temperature readings, live camera feeds, and comprehensive system management. Built with modern web technologies, it offers an intuitive interface for aquarium enthusiasts to monitor their aquatic environments.

## ✨ Features

### 🌡️ Temperature Monitoring
- **Dual Sensor Support** - Monitor temperature from two independent sensors
- **Real-time Updates** - Configurable auto-refresh intervals (5s, 10s, 30s, 60s)
- **Temperature Units** - Switch between Celsius and Fahrenheit
- **Smart Alerts** - Visual indicators for optimal, too cold, or too hot conditions
- **Average Calculation** - Automatic averaging of sensor readings

### 📹 Live Camera Feed
- **HD Video Stream** - High-definition live camera feed display via mjpg-streamer
- **Responsive Layout** - Adapts to different screen sizes
- **Status Indicators** - Connection status and feed quality badges
- **Auto-configuration** - Works with USB cameras and Raspberry Pi camera module

### 🎨 Customizable Interface
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Aquatic Theme** - Beautiful ocean-inspired color palette
- **Smooth Animations** - Engaging transitions and hover effects

### ⚙️ System Management
- **Network Configuration** - WiFi setup and monitoring
- **System Information** - CPU, memory, storage, and uptime tracking
- **Backup & Recovery** - Export/import system configurations
- **System Controls** - Reboot and factory reset functionality
- **Service Management** - PM2 and systemd service monitoring

### 🔒 Security Features
- **Secure Communication** - HTTPS/WSS protocols ready
- **Access Logging** - Security event tracking
- **Safe Repository Management** - Git permission handling

## 🚀 Quick Start

### Automated Installation (Recommended)
For Raspberry Pi deployment:

```bash
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos
sudo bash deploy/install.sh
```

### Local Development
```bash
git clone https://github.com/YOUR_USERNAME/neptuneos.git
cd neptuneos
npm install
npm run dev
```

For detailed setup instructions, see **[SETUP.md](./SETUP.md)**

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| ⚛️ **React** | Frontend Framework | 18.3.1 |
| 📘 **TypeScript** | Type Safety | Latest |
| 🎨 **Tailwind CSS** | Styling | Latest |
| 🧩 **shadcn/ui** | UI Components | Latest |
| ⚡ **Vite** | Build Tool | Latest |
| 🔄 **React Query** | State Management | 5.56.2 |
| 🧭 **React Router** | Navigation | 6.26.2 |
| 📊 **Recharts** | Data Visualization | 2.12.7 |
| 🎯 **Lucide React** | Icons | 0.462.0 |
| 🖥️ **Express.js** | Backend API | 4.21.2 |
| 🎥 **mjpg-streamer** | Camera Streaming | Latest |
| 🔄 **PM2** | Process Management | Latest |
| 🌐 **Nginx** | Web Server & Proxy | Latest |

## 📁 Project Structure

```
├── 📱 src/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard components
│   │   ├── settings/           # Settings page components
│   │   └── ui/                 # Reusable UI components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route components
│   ├── utils/                  # Utility functions
│   └── lib/                    # Core libraries
├── 🚀 deploy/
│   ├── install.sh              # Automated installer
│   ├── api-server.cjs          # Backend API server
│   ├── nginx.conf              # Web server configuration
│   └── ecosystem.config.cjs    # PM2 configuration
└── 📖 docs/
    ├── SETUP.md                # Setup & deployment guide
    ├── FEATURES.md             # Feature documentation
    └── CONTRIBUTING.md         # Contribution guidelines
```

## 🎯 API Integration

### Temperature API
```typescript
interface TemperatureData {
  sensor1: number;    // °C
  sensor2: number;    // °C
  average: number;    // °C
  timestamp: string;  // ISO string
}
```

### System Information API
```typescript
interface SystemInfo {
  uptime: string;
  cpu: number;      // Usage percentage
  memory: number;   // Usage percentage
  storage: number;  // Usage percentage
  network: string;  // IP address
}
```

## ⚙️ Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_CAMERA_STREAM_URL=http://localhost:8080/?action=stream

# Feature Flags
VITE_ENABLE_CAMERA=true
VITE_ENABLE_FUTURE_FEATURES=false
```

### Hardware Configuration
- **Temperature Sensors**: DS18B20 on GPIO 4 with 4.7kΩ pull-up
- **Camera**: USB camera or Raspberry Pi camera module
- **Network**: Ethernet or WiFi connectivity

## 🚀 Deployment Architecture

NeptuneOS uses a multi-service architecture:

1. **Frontend**: React app served by Nginx
2. **Backend API**: Express.js server managed by PM2
3. **Camera Stream**: mjpg-streamer systemd service
4. **Reverse Proxy**: Nginx routing all services

All services auto-start on boot and include health monitoring.

## 📱 Responsive Design

- 🖥️ **Desktop** (1024px+): Full dashboard layout
- 📱 **Tablet** (768px+): Optimized grid layout  
- 📱 **Mobile** (320px+): Stacked layout with touch-friendly controls

## 🤝 Contributing

We welcome contributions! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- 📚 [Setup Guide](./SETUP.md)
- 🎯 [Feature Documentation](./FEATURES.md)
- 💬 [Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 📺 [Video Tutorials](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

## 🙏 Acknowledgments

- Built with ❤️ using [Lovable](https://lovable.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">
  <strong>🌊 Dive into the future of aquarium monitoring with NeptuneOS! 🐠</strong>
</div>
