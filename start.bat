@echo off
REM FlashSale Startup Script for Windows

setlocal enabledelayedexpansion

echo.
echo ========================================
echo FlashSale - E-Commerce Application
echo ========================================
echo.

REM Get the project directory
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo Starting Backend API Server...
cd backend

REM Start Node.js backend in a new window
start "FlashSale Backend" node -e "
const http = require('http');

const PRODUCTS = [
  { id: 'rtx-4090', name: 'RTX 4090 GPU', price: 1599.99, originalPrice: 1999.99, description: 'Flagship GPU', stock: 12, image: 'https://images.unsplash.com/photo-1587829191301-f7c7af6c77f8?w=400x300' },
  { id: 'macbook-pro', name: 'MacBook Pro M3', price: 1999.00, originalPrice: 2499.00, description: 'Powerful laptop', stock: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400x300' },
  { id: 'ps5', name: 'PlayStation 5', price: 499.99, originalPrice: 649.99, description: 'Gaming console', stock: 15, image: 'https://images.unsplash.com/photo-1605901287835-b5f7a80a2d3f?w=400x300' },
  { id: 'iphone-15', name: 'iPhone 15 Pro Max', price: 1099.00, originalPrice: 1399.00, description: 'Latest iPhone', stock: 20, image: 'https://images.unsplash.com/photo-1592286927505-1fed6a0ce0e5?w=400x300' },
  { id: 'airpods', name: 'AirPods Pro 3rd Gen', price: 249.00, originalPrice: 349.00, description: 'Wireless earbuds', stock: 50, image: 'https://images.unsplash.com/photo-1606841838e12-8facc6dcde92?w=400x300' },
  { id: 'samsung-tv', name: '85 Samsung QLED TV', price: 1799.99, originalPrice: 2299.99, description: '4K QLED TV', stock: 6, image: 'https://images.unsplash.com/photo-1593642532400-2682a8a8fca9?w=400x300' }
];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
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

echo.
echo Backend started! Moving to frontend...
echo.

timeout /t 2

cd ..
cd frontend

echo Starting Frontend Server on port 5173...
start "FlashSale Frontend" python -m http.server 5173

echo.
echo ========================================
echo Application is ready!
echo.
echo Access the application:
echo   * Local:   http://localhost:5173/app.html
echo   * Find your IP with: ipconfig
echo   * Network: http://[YOUR_IP]:5173/app.html
echo.
echo Close this window to stop the servers.
echo ========================================
echo.

pause
