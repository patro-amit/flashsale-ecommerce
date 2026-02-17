# Quick Start Guide

Get your serverless e-commerce platform running in **5 minutes**!

## 🚀 Super Quick Start (Local Development)

### 1. Install Serverless Framework
```bash
npm install -g serverless
```

### 2. Navigate to Backend
```bash
cd "Cloud Computing Project"/backend
npm install
```

### 3. Start Local API (in Terminal 1)
```bash
npm run dynamodb:install
npm run dynamodb:start &    # Starts in background
npm run offline:start       # Starts API on localhost:3001
```

### 4. Start Frontend (in Terminal 2)
```bash
cd ../frontend
npm install
npm run dev
```

### 5. Open Browser
Visit **http://localhost:5173** and start shopping! 🛍️

---

## 🌐 Deploy to AWS (Production)

### Prerequisites
```bash
# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Format (json)
```

### Deploy Backend
```bash
cd backend
npm run deploy:prod

# 📝 Copy the API Gateway URL from the output
# Example: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

### Deploy Frontend
```bash
cd ../frontend

# Update .env with your API URL
echo "VITE_API_URL=https://your-api-url/prod" > .env

# Build
npm run build

# Deploy to S3 (optional)
aws s3 mb s3://my-ecommerce-frontend --region us-east-1
aws s3 sync dist/ s3://my-ecommerce-frontend/
aws s3 website s3://my-ecommerce-frontend/ --index-document index.html --error-document index.html
```

---

## 📊 Project Files Created

### Backend (8 files)
- ✅ `serverless.yml` - Infrastructure configuration
- ✅ `handler.js` - Lambda functions
- ✅ `package.json` - Dependencies
- ✅ `.env.example` - Environment template
- ✅ `.gitignore` - Git exclusions

### Frontend (13 files)
- ✅ `App.jsx` - Main component
- ✅ `Navbar.jsx` - Top navigation
- ✅ `Hero.jsx` - Landing section
- ✅ `ProductGrid.jsx` - Product listing
- ✅ `ProductCard.jsx` - Product display
- ✅ `Cart.jsx` - Shopping cart
- ✅ `LoadingOverlay.jsx` - Traffic queue UI
- ✅ `OrderModal.jsx` - Confirmation modal
- ✅ `package.json` - Dependencies
- ✅ `vite.config.js` - Build config
- ✅ `tailwind.config.js` - Styling
- ✅ `index.html` - HTML template
- ✅ `.env` - Local configuration

### Documentation (2 files)
- ✅ `README.md` - Complete guide
- ✅ `QUICKSTART.md` - This file

---

## 🎯 Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | Fetch all products |
| POST | `/orders` | Create new order |

---

## 💡 Tips for Testing

### Simulate Heavy Traffic
Edit `handler.js` and increase latency in the `simulateTrafficLatency()` function:
```javascript
const simulateTrafficLatency = (minMs = 2000, maxMs = 8000) => {
  // Will now simulate delays of 2-8 seconds
```

### Test with Multiple Products
Add more products to the `PRODUCTS` array in `handler.js`

### Monitor DynamoDB
```bash
aws dynamodb scan --table-name OrdersTable-dev
```

---

## 🧹 Cleanup

### Remove AWS Resources
```bash
cd backend
npm run remove
```

### Clean Local Installation
```bash
rm -rf node_modules .serverless dist
npm cache clean --force
```

---

## ❓ Need Help?

Check the main **README.md** for:
- Detailed architecture diagram
- Production deployment guide
- Troubleshooting section
- Scaling recommendations
- Security best practices

Happy building! ⚡
