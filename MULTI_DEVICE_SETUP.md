# Multi-Device Setup Guide

This guide explains how to access and run the Serverless E-Commerce Flash Sale application on your other devices using the same account.

## Table of Contents
1. [Option 1: GitHub Sync (Recommended)](#option-1-github-sync-recommended)
2. [Option 2: Cloud Storage Sync](#option-2-cloud-storage-sync)
3. [Option 3: Local Network Access](#option-3-local-network-access)
4. [Configuring API for Different Devices](#configuring-api-for-different-devices)

---

## Option 1: GitHub Sync (Recommended)

### Step 1: Push Project to GitHub

On your primary device (where the project is currently):

```bash
cd "/Users/shyampatro/Cloud Computing Project"

# Add all files
git add .

# Commit
git commit -m "Initial project setup"

# Create a new private repo on GitHub named 'flashsale-ecommerce'
# Then add the remote and push:
git remote add origin https://github.com/YOUR_USERNAME/flashsale-ecommerce.git
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Clone on Other Devices

On any other device, install Git and Node.js, then:

```bash
# Clone the repository
git remote clone https://github.com/YOUR_USERNAME/flashsale-ecommerce.git
cd flashsale-ecommerce

# The project is ready to run!
```

### Step 3: Keep Code in Sync

Pull latest changes on any device:
```bash
git pull origin main
```

Push local changes back:
```bash
git add .
git commit -m "Your changes description"
git push origin main
```

**Benefits:**
✅ Syncs all code changes automatically
✅ Version control & backup
✅ Easy to share with team members
✅ No file size limits (unlike Dropbox free tier)

---

## Option 2: Cloud Storage Sync

### Using iCloud Drive (macOS/iOS)

1. Move project folder to `~/Library/Mobile Documents/com~apple~CloudDocs/`
2. On other macOS devices, it auto-syncs through iCloud
3. On iOS devices, use the Files app to access files

### Using Google Drive

1. Move project to Google Drive folder
2. On other devices, install Google Drive app and sync the folder

### Using Dropbox

1. Move project to Dropbox folder
2. On other devices, install Dropbox and access the synced folder

**Note:** Run the application from a local copy, not directly from the cloud folder for better performance.

---

## Option 3: Local Network Access

Access the application from other devices on the **same WiFi network** without syncing the code.

### Step 1: Find Your Computer's IP Address

On the primary device (macOS):
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for the IP address like `192.168.1.100` (not `127.0.0.1`)

### Step 2: Configure Firewall (if needed)

macOS:
- System Preferences → Security & Privacy → Firewall → Firewall Options
- Add Node.js to allowed apps

### Step 3: Start Backend with Network Access

Instead of `localhost:3001`, start the backend to listen on all interfaces:

```bash
cd "/Users/shyampatro/Cloud Computing Project/backend"
node -e "
const http = require('http');
const PRODUCTS = [
  { id: 'rtx-4090', name: 'RTX 4090 GPU', price: 1599.99, originalPrice: 1999.99, description: 'Flagship GPU', stock: 12, image: 'https://images.unsplash.com/photo-1587829191301-f7c7af6c77f8?w=400&h=300&fit=crop', discount: 20 },
  { id: 'macbook-pro', name: 'MacBook Pro M3', price: 1999.00, originalPrice: 2499.00, description: 'Powerful laptop', stock: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', discount: 20 },
  { id: 'ps5', name: 'PlayStation 5', price: 499.99, originalPrice: 649.99, description: 'Gaming console', stock: 15, image: 'https://images.unsplash.com/photo-1605901287835-b5f7a80a2d3f?w=400&h=300&fit=crop', discount: 23 },
  { id: 'iphone-15', name: 'iPhone 15 Pro Max', price: 1099.00, originalPrice: 1399.00, description: 'Latest iPhone', stock: 20, image: 'https://images.unsplash.com/photo-1592286927505-1fed6a0ce0e5?w=400&h=300&fit=crop', discount: 21 },
  { id: 'airpods', name: 'AirPods Pro 3rd Gen', price: 249.00, originalPrice: 349.00, description: 'Wireless earbuds', stock: 50, image: 'https://images.unsplash.com/photo-1606841838e12-8facc6dcde92?w=400&h=300&fit=crop', discount: 29 },
  { id: 'samsung-tv', name: '85\" Samsung QLED TV', price: 1799.99, originalPrice: 2299.99, description: '4K QLED TV', stock: 6, image: 'https://images.unsplash.com/photo-1593642532400-2682a8a8fca9?w=400&h=300&fit=crop', discount: 22 }
];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200); res.end(); return;
  }
  
  if (req.method === 'GET' && req.url === '/products') {
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: PRODUCTS }));
    }, Math.random() * 800 + 200);
  } else if (req.method === 'POST' && req.url === '/orders') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      setTimeout(() => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        res.end(JSON.stringify({ success: true, data: { orderId, totalAmount: 1500, status: 'CONFIRMED' } }));
      }, Math.random() * 3500 + 500);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3001, '0.0.0.0', () => console.log('🚀 API Server running on http://0.0.0.0:3001'));
"
```

### Step 4: Access from Other Devices

1. On other device, open a browser
2. Go to: `http://YOUR_IP_ADDRESS:5173/app.html` (e.g., `http://192.168.1.100:5173/app.html`)
3. The app loads (no API configured yet)
4. Click **⚙️ Settings** in the top-left
5. Enter API URL: `http://YOUR_IP_ADDRESS:3001` (e.g., `http://192.168.1.100:3001`)
6. Click **Save**

**Benefits:**
✅ Works for devices on same WiFi
✅ No setup needed on other devices
❌ Only works locally (not on mobile data)
❌ Frontend files must be hosted somewhere

---

## Configuring API for Different Devices

The app now supports dynamic API configuration through the **Settings button** (⚙️) in the top navigation.

### How to Use Settings:

1. **Click Settings button** (⚙️) in navbar
2. **Enter your API URL:**
   - **Local**: `http://localhost:3001`
   - **LAN**: `http://192.168.1.100:3001`
   - **Cloud**: `https://api.yourdomain.com`
3. **Click Save** - settings persist in browser storage

### Automatically Detected URLs:

When you access from a device, the app tries to auto-detect:
- **If on localhost**: Uses `http://localhost:3001`
- **If on network**: Uses `http://[device-ip]:3001`

---

## Recommended Setup Workflow

### For Development (Same Computer):
```bash
# Terminal 1: Backend API
cd backend && node -e "..."

# Terminal 2: Frontend
cd frontend && python3 -m http.server 5173

# Browser: http://localhost:5173/app.html
```

### For Multiple Devices:
1. **Use GitHub** to sync code across devices
2. **Use Settings button** to configure API URL for each device
3. **One device runs the backend** (accessible to others)
4. **Other devices access via network IP**

---

## Hardware Requirements by Device

### macOS
- Node.js 14+ (https://nodejs.org)
- Python 3 (usually pre-installed)
- Terminal/iTerm2

### Windows
- Node.js 14+ (https://nodejs.org)
- Python 3 (https://python.org)
- PowerShell or Command Prompt

### Linux
- Node.js 14+: `sudo apt install nodejs npm`
- Python 3: `sudo apt install python3`
- Terminal/Bash

### iOS/Android
- No local setup needed
- Just open Safari/Chrome and visit the app URL
- Use Settings to configure API

---

## Troubleshooting

### Can't access from other device?
- ✅ Verify both devices on same WiFi
- ✅ Verify firewall allows port 3001, 5173
- ✅ Use actual IP address (run `ipconfig` or `ifconfig`)
- ✅ Try `http://` not `https://` for local network

### API returns "Not found"
- ✅ Backend must be running on any device
- ✅ Check Settings for correct API URL
- ✅ Make sure IP and port are correct

### Code changes not syncing?
- ✅ If using Git: Run `git pull` regularly
- ✅ If using cloud storage: Wait for sync to complete
- ✅ Restart the application to load new files

### Port already in use?
- ✅ Change port in startup command (e.g., `:3002`)
- ✅ Kill process: `lsof -ti:3001 | xargs kill -9` (macOS/Linux)

---

## Security Notes

- ⚠️ **Local Network Only**: Don't expose apps to internet without HTTPS
- ⚠️ **Private Network**: Make sure your WiFi has password protection
- ⚠️ **GitHub Secret**: Use a private repository, never commit `.env` with secrets
- ⚠️ **API Keys**: When deploying to AWS, use IAM roles (not hardcoded keys)

---

For questions or updates, refer to the main [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md).
