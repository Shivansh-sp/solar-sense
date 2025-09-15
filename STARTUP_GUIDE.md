# 🚀 SolarSense Startup Guide

This guide explains how to start the complete SolarSense application with both frontend and backend running together.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivansh-sp/solar-sense.git
   cd solar-sense
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

## 🚀 Starting the Application

### Option 1: Node.js Script (Recommended)
```bash
npm run start:full
```
This will start both frontend and backend with proper process management.

### Option 2: Windows Batch File
```bash
npm run start:windows
```
This opens separate windows for frontend and backend.

### Option 3: PowerShell Script
```bash
npm run start:powershell
```
This provides better process management on Windows.

### Option 4: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

Once started, you can access:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 🛑 Stopping the Application

- **Node.js Script:** Press `Ctrl+C`
- **Windows Batch:** Close the command windows
- **PowerShell:** Press `Ctrl+C`
- **Manual:** Press `Ctrl+C` in each terminal

## 🔧 Troubleshooting

### Port Already in Use
If you get "address already in use" errors:

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID_NUMBER> /F
```

### Database Connection Issues
The backend will continue to work even if the database is not connected. Some features may be limited.

### Frontend Build Issues
```bash
cd frontend
npm run build
```

## 📁 Project Structure

```
solarsense/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend API
├── start.js          # Node.js startup script
├── start.ps1         # PowerShell startup script
├── start.bat         # Windows batch startup script
└── package.json      # Main package configuration
```

## 🎯 Features

- **Automatic Process Management:** Handles both frontend and backend startup
- **Error Handling:** Graceful shutdown and error recovery
- **Cross-Platform:** Works on Windows, macOS, and Linux
- **Real-time Monitoring:** Shows output from both servers
- **Environment Validation:** Checks for required files and directories

## 📞 Support

If you encounter any issues:

1. Check the console output for error messages
2. Ensure all dependencies are installed
3. Verify that ports 3000 and 5000 are available
4. Check the troubleshooting section above

## 🔄 Development

For development, you can also run:

```bash
# Backend only
npm run dev

# Frontend only
cd frontend
npm run dev

# Build frontend
npm run build
```

---

**Happy coding! 🌟**
