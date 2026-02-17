#!/bin/zsh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}FlashSale - E-Commerce Application${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to get local IP
get_local_ip() {
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
}

LOCAL_IP=$(get_local_ip)

echo -e "${GREEN}✓ Found Local IP: ${YELLOW}$LOCAL_IP${NC}\n"

# Start Backend API Server
echo -e "${BLUE}Starting Backend API Server...${NC}"
cd "$PROJECT_DIR/backend"

node -e "
const http = require('http');

const PRODUCTS = [
  { id: 'rtx-4090', name: 'RTX 4090 GPU', price: 1599.99, originalPrice: 1999.99, description: 'Flagship GPU', stock: 12, image: 'https://images.unsplash.com/photo-1587829191301-f7c7af6c77f8?w=400&h=300&fit=crop', discount: 20 },
  { id: 'macbook-pro', name: 'MacBook Pro M3', price: 1999.00, originalPrice: 2499.00, description: 'Powerful laptop', stock: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', discount: 20 },
  { id: 'ps5', name: 'PlayStation 5', price: 499.99, originalPrice: 649.99, description: 'Gaming console', stock: 15, image: 'https://images.unsplash.com/photo-1605901287835-b5f7a80a2d3f?w=400&h=300&fit=crop', discount: 23 },
  { id: 'iphone-15', name: 'iPhone 15 Pro Max', price: 1099.00, originalPrice: 1399.00, description: 'Latest iPhone', stock: 20, image: 'https://images.unsplash.com/photo-1592286927505-1fed6a0ce0e5?w=400&h=300&fit=crop', discount: 21 },
  { id: 'airpods', name: 'AirPods Pro 3rd Gen', price: 249.00, originalPrice: 349.00, description: 'Wireless earbuds', stock: 50, image: 'https://images.unsplash.com/photo-1606841838e12-8facc6dcde92?w=400&h=300&fit=crop', discount: 29 },
  { id: 'samsung-tv', name: '85\\\" Samsung QLED TV', price: 1799.99, originalPrice: 2299.99, description: '4K QLED TV', stock: 6, image: 'https://images.unsplash.com/photo-1593642532400-2682a8a8fca9?w=400&h=300&fit=crop', discount: 22 }
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

server.listen(3001, '0.0.0.0', () => {
  console.log('🚀 API Server running on http://0.0.0.0:3001');
  console.log('📱 Accessible from: http://localhost:3001 or http://$LOCAL_IP:3001');
});
" &

BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a moment for backend to start
sleep 2

# Start Frontend Server
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd "$PROJECT_DIR/frontend"

python3 -m http.server 5173 > /dev/null 2>&1 &

FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}\n"

# Display access information
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Application is ready!${NC}\n"

echo -e "${YELLOW}Access the application:${NC}"
echo -e "  • Local:   ${BLUE}http://localhost:5173/app.html${NC}"
echo -e "  • Network: ${BLUE}http://$LOCAL_IP:5173/app.html${NC}\n"

echo -e "${YELLOW}API Configuration in Settings (⚙️):${NC}"
echo -e "  • Local:   ${BLUE}http://localhost:3001${NC}"
echo -e "  • Network: ${BLUE}http://$LOCAL_IP:3001${NC}\n"

echo -e "${YELLOW}To stop the servers, press Ctrl+C${NC}"
echo -e "${BLUE}========================================\n${NC}"

# Wait for interrupt
wait
