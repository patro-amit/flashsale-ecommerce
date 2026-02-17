# 🚀 Getting Started - FlashSale E-Commerce Platform

Welcome! This guide helps you run the application **instantly** on any of your devices.

---

## ⚡ Quick Start (5 minutes)

### Option A: macOS/Linux (Easiest)

```bash
# Navigate to project folder
cd "Cloud Computing Project"

# Make startup script executable
chmod +x start.sh

# Run both servers in one command
./start.sh
```

Then open your browser to:
- **Local**: http://localhost:5173/app.html
- **Any device on WiFi**: http://YOUR_IP:5173/app.html (displayed by start.sh)

### Option B: Windows

1. Double-click `start.bat` 
2. Two command windows will open (Backend & Frontend)
3. Open browser to: http://localhost:5173/app.html

### Option C: Manual Setup

**Terminal 1 - Backend API:**
```bash
cd backend
node -e "const http = require('http'); const server = http.createServer(...); server.listen(3001);"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python3 -m http.server 5173
```

**Then visit:**
- http://localhost:5173/app.html

---

## 🔧 Configure API for Your Device

**Important:** If you're accessing from a different device or the app can't reach the backend:

1. Click **⚙️ Settings** button in the top navbar
2. Enter your API URL:
   - **Localhost**: `http://localhost:3001`
   - **Same WiFi**: `http://192.168.X.X:3001` (e.g., `http://192.168.1.100:3001`)
   - **Remote server**: `https://your-api.com`
3. Click **Save** - settings persist automatically

---

## 📱 Access from Other Devices

### Same WiFi Network
1. Find your computer's IP address:
   - **macOS/Linux**: Run `ifconfig | grep "inet "` → look for 192.168.x.x
   - **Windows**: Run `ipconfig` → look for IPv4 Address
2. On other device, visit: `http://YOUR_IP:5173/app.html`
3. Use Settings (⚙️) to configure API: `http://YOUR_IP:3001`

### Different Network / Cloud
- Deploy using [AWS_SETUP.md](md%20files/AWS_SETUP.md)
- Or follow [MULTI_DEVICE_SETUP.md](MULTI_DEVICE_SETUP.md) for GitHub sync

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](md%20files/QUICKSTART.md) | Quick reference commands |
| [MULTI_DEVICE_SETUP.md](MULTI_DEVICE_SETUP.md) | **Use GitHub/Cloud to sync across devices** |
| [AWS_SETUP.md](md%20files/AWS_SETUP.md) | Deploy to AWS (Lambda, DynamoDB) |
| [ARCHITECTURE.md](md%20files/ARCHITECTURE.md) | Technical architecture details |
| [TROUBLESHOOTING.md](md%20files/TROUBLESHOOTING.md) | Fix common issues |

---

## ✨ Features

- ✅ **6 Featured Products** with images, prices, stock tracking
- ✅ **Real Shopping Cart** with quantity adjustment
- ✅ **Stock Validation** - prevents buying out-of-stock items
- ✅ **Traffic Simulation** - realistic order processing delay (500-4000ms)
- ✅ **Order Confirmation** - copyable Order ID
- ✅ **Responsive Design** - works on desktop, tablet, mobile
- ✅ **Dynamic API Configuration** - works with any backend URL

---

## 🛠️ Requirements

- **Node.js** 14+ (for backend)
- **Python** 3 (for frontend server)
- **Browser** (Safari, Chrome, Firefox, Edge)
- **WiFi** (to access from other devices on same network)

Download Node.js: https://nodejs.org

---

## 🔑 Key Commands

```bash
# Start everything at once (recommended)
./start.sh              # macOS/Linux
start.bat              # Windows

# Or start manually:
cd backend && node api.js        # Start API on port 3001
cd frontend && python3 -m http.server 5173  # Start UI on port 5173

# Test API
curl http://localhost:3001/products

# Kill process on specific port (macOS/Linux)
lsof -ti:3001 | xargs kill -9
```

---

## 🚦 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Can't access app** | Make sure both servers are running (check start.sh output) |
| **API shows "Not found"** | Click Settings (⚙️) and verify API URL is correct |
| **Can't access from other device** | Use your actual IP (e.g., 192.168.X.X), not localhost |
| **Port 3001 already in use** | Kill the process: `lsof -ti:3001 \| xargs kill -9` |
| **Python not found** | Install Python 3 from python.org |

---

## 📖 Next Steps

1. **Run the app** → `./start.sh` (macOS/Linux) or `start.bat` (Windows)
2. **Test locally** → Visit http://localhost:5173/app.html
3. **Access from another device** → Use your IP address (see above)
4. **Deploy to AWS** → Follow [AWS_SETUP.md](md%20files/AWS_SETUP.md)
5. **Share code** → Use [MULTI_DEVICE_SETUP.md](MULTI_DEVICE_SETUP.md)

---

## 📞 Questions?

- Check [TROUBLESHOOTING.md](md%20files/TROUBLESHOOTING.md) for common issues
- Review [ARCHITECTURE.md](md%20files/ARCHITECTURE.md) for technical details
- Read [MULTI_DEVICE_SETUP.md](MULTI_DEVICE_SETUP.md) for cloud/GitHub syncing

---

**Happy coding! 🎉**

For detailed information, see the [full README](md%20files/README.md).
