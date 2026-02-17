# Troubleshooting Guide

Common issues and their solutions.

## 🔧 Installation & Setup Issues

### Problem: `npm install` fails with permission errors

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then add to ~/.zshrc or ~/.bash_profile:
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Now try again
npm install
```

### Problem: Node.js version mismatch

**Error:** `The engine "node" is incompatible with this package`

**Solution:**
```bash
# Check Node version
node --version

# Install Node.js 18+ from:
# - Using Homebrew: brew install node@18
# - Direct: nodejs.org/en/download/
# - Using nvm: nvm install 18 && nvm use 18

# Verify
node --version  # Should output v18.x.x or higher
```

### Problem: `npm ERR! code ERR_OSSL_EVP_UNSUPPORTED`

**Cause:** Node.js version too old or OpenSSL issues

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall global packages
npm install -g serverless

# Update npm itself
npm install -g npm@latest
```

---

## ⚙️ Backend Deployment Issues

### Problem: AWS credentials not found

**Error:** `Error: AWS SDK Error: 'profile default' not found`

**Solution:**
```bash
# Configure AWS CLI
aws configure

# Enter:
# AWS Access Key ID: [Your ID]
# AWS Secret Access Key: [Your Key]
# Default region: us-east-1
# Default output format: json

# Verify credentials
aws sts get-caller-identity

# Should output your AWS account ID
```

### Problem: `serverless: command not found`

**Error:** `zsh: command not found: serverless`

**Solution:**
```bash
# Install globally
npm install -g serverless

# Or use through npm script
npx serverless deploy

# Or add to PATH
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Problem: Deployment timeout or hangs

**Error:** Deployment takes >10 minutes or stalls

**Solution:**
```bash
# Cancel the deployment (Ctrl+C)
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name <service-name>-<stage>

# Manual cleanup if stuck
aws cloudformation delete-stack --stack-name <service-name>-<stage>

# Try deployment with verbose output
serverless deploy --verbose

# Check events
serverless logs -f getProducts
serverless logs -f createOrder
```

### Problem: DynamoDB table already exists

**Error:** `ValidationException: One or more parameter values were invalid`

**Solution:**
```bash
# List existing tables
aws dynamodb list-tables

# Delete old table
aws dynamodb delete-table --table-name OrdersTable-dev

# Wait for deletion
aws dynamodb list-tables --poll

# Then redeploy
serverless deploy
```

### Problem: Lambda timeout on createOrder

**Error:** `Task timed out after 30.00 seconds`

**Cause:** DynamoDB write is slow or synthetic latency is too high

**Solution:**
```bash
# Edit handler.js, reduce latency
// From:
const simulateTrafficLatency = (minMs = 500, maxMs = 4000)
// To:
const simulateTrafficLatency = (minMs = 100, maxMs = 1000)

# Redeploy
serverless deploy

# Or increase Lambda timeout in serverless.yml
timeout: 60  # Changed from 30
```

### Problem: CORS errors in frontend

**Error:** `No 'Access-Control-Allow-Origin' header`

**Cause:** API Gateway CORS not configured

**Solution:**
```yaml
# In serverless.yml, verify cors settings:
functions:
  getProducts:
    handler: handler.getProducts
    events:
      - http:
          path: products
          method: GET
          cors: true  # ← MUST be true
```

Then redeploy:
```bash
serverless deploy
```

### Problem: Missing environment variables

**Error:** `Environment variable ORDERS_TABLE is undefined`

**Cause:** Environment variables not set in Lambda

**Solution:**
```yaml
# In serverless.yml, check provider section:
provider:
  environment:
    ORDERS_TABLE: OrdersTable-${sls:stage}
    DYNAMODB_REGION: ${aws:region}
```

Make sure it's under `provider`, not just `functions`.

---

## 🎨 Frontend Issues

### Problem: Vite dev server won't start

**Error:** `EADDRINUSE: address already in use :::5173`

**Cause:** Port 5173 already in use

**Solution:**
```bash
# Option 1: Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Option 2: Use different port
npm run dev -- --port 3000

# Option 3: Check what's using the port
lsof -i :5173
```

### Problem: Frontend can't reach backend API

**Error:** Browser console shows CORS or network error

**Solution:**
```bash
# 1. Verify .env file has correct API URL
cat frontend/.env
# Should show: VITE_API_URL=http://localhost:3001 (for dev)

# 2. Verify backend is running
curl http://localhost:3001/products
# Should return products JSON

# 3. Check browser console
# Open DevTools → Console
# Look for CORS errors or network failures

# 4. If using production API:
echo "VITE_API_URL=https://your-api-gateway-url/dev" > frontend/.env

# 5. Restart dev server
npm run dev
```

### Problem: Products don't load on page

**Error:** Products grid is empty, no error message

**Cause:** API not called or API failed silently

**Solution:**
```bash
# 1. Check browser console for errors (F12)

# 2. Check network tab
# Open DevTools → Network tab
# Reload page
# Look for GET /products request
# Check response status and body

# 3. If getting 404:
# Backend is not running or wrong URL
# Check VITE_API_URL in .env file

# 4. If getting 500:
# Lambda error
# Check backend logs:
serverless logs -f getProducts

# 5. Test API directly
curl -X GET http://localhost:3001/products
# Should return products array
```

### Problem: "Buy Now" button doesn't work

**Error:** Button click does nothing

**Cause:** JavaScript error or cart state issue

**Solution:**
```bash
# 1. Open browser DevTools (F12)
# 2. Check Console tab for errors
# 3. Check if addToCart function exists in App.jsx
# 4. Verify cart state updates:
# In browser DevTools React tab:
# → Components → App
# → Look for cart state

# 5. Manually test:
# Click "Buy Now"
# Check cart count in navbar updates
# Open cart view
# Item should appear
```

### Problem: Styling looks wrong (colors, layout)

**Error:** Elements appear unstyled or wrong colors

**Cause:** Tailwind CSS not compiled

**Solution:**
```bash
# 1. Check Tailwind CSS is installed
npm list tailwindcss

# 2. Install if missing
npm install -D tailwindcss postcss autoprefixer

# 3. Verify tailwind.config.js content path
# Check it includes './src/**/*.{js,jsx}'

# 4. Verify index.css has Tailwind directives
cat src/index.css
# Should have:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# 5. Restart dev server
npm run dev

# 6. Clear browser cache (Ctrl+Shift+Delete)
```

### Problem: Images not loading

**Error:** Products show broken image icons

**Cause:** Image URLs are invalid or CORS blocked

**Solution:**
```javascript
// In ProductCard.jsx, images have fallback:
onError={(e) => {
  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop';
}}

// This should load a default image
// If not working:
// 1. Check your internet connection
// 2. Try different image URLs in handler.js
// 3. Use local images instead:
// Copy images to public/ folder
// Reference with: ./image-name.jpg
```

---

## 📦 DynamoDB Issues

### Problem: DynamoDB table not created

**Error:** `ResourceNotFoundException: Requested resource not found`

**Cause:** Table not created during deployment

**Solution:**
```bash
# 1. Check CloudFormation stack
aws cloudformation describe-stacks --stack-name serverless-ecommerce-spike-handler-dev

# 2. Look for DynamoDB table in resources
aws dynamodb list-tables

# 3. If table missing, redeploy
serverless deploy

# 4. Verify table created
aws dynamodb describe-table --table-name OrdersTable-dev

# 5. If creation fails, check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name serverless-ecommerce-spike-handler-dev
```

### Problem: Can't write to DynamoDB

**Error:** `User: arn:aws:iam::... is not authorized to perform: dynamodb:PutItem`

**Cause:** Lambda IAM role doesn't have permissions

**Solution:**
```yaml
# In serverless.yml, check IAM role:
provider:
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:PutItem
        - dynamodb:GetItem
        - dynamodb:Query
      Resource: arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/OrdersTable-${sls:stage}
```

Then redeploy:
```bash
serverless deploy
```

### Problem: DynamoDB throttling

**Error:** `ProvisionedThroughputExceededException`

**Cause:** On-demand capacity exceeded or billing mode wrong

**Solution:**
```yaml
# In serverless.yml, verify billing mode:
resources:
  Resources:
    OrdersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        BillingMode: PAY_PER_REQUEST  # ← Should be this
        # NOT: ProvisionedThroughput
```

---

## 🔒 Security & Permission Issues

### Problem: "Access Denied" from AWS CLI

**Error:** `An error occurred (AccessDenied) when calling the ...`

**Cause:** IAM user doesn't have required permissions

**Solution:**
```bash
# 1. Check current user
aws sts get-caller-identity

# 2. Check IAM policies attached
aws iam list-attached-user-policies --user-name serverless-deployer

# 3. Attach required policies
aws iam attach-user-policy \
  --user-name serverless-deployer \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Not recommended for production!
# Instead, attach specific policies:
# - AWSLambdaFullAccess
# - AmazonDynamoDBFullAccess
# - AmazonAPIGatewayAdministrator
# - IAMFullAccess
```

### Problem: Credentials leaked in code

**Error:** `AccessKeyId` visible in GitHub commits

**Prevention:**
```bash
# 1. Never commit .env files
echo ".env" >> .gitignore

# 2. Use .env.example instead
cp .env .env.example
# Edit .env.example to remove secrets

# 3. Revoke leaked credentials immediately
# Go to AWS Console → IAM → Users → Your user → Security credentials
# Delete the compromised access key
# Create a new one
# Update local credentials

# 4. Check git history
git log --all --full-history -- ".env"
git log --all --full-history -p -- "serverless.yml" | grep -i "key\|secret"

# 5. Clean history (if needed)
# Use BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
```

---

## 📊 Performance Issues

### Problem: Slow response times (>5 seconds)

**Error:** Website takes 5+ seconds to load products

**Cause:** Lambda cold start or DynamoDB latency

**Solution:**
```bash
# 1. Reduce synthetic latency in handler.js
const simulateTrafficLatency = (minMs = 100, maxMs = 500)
// Instead of 500-4000

# 2. Increase Lambda memory
# In serverless.yml:
createOrder:
  memorySize: 1024  # From 512

# 3. Enable Lambda warming (optional)
# Add to serverless.yml:
plugins:
  - serverless-plugin-warmup

custom:
  warmup:
    default:
      enabled: true
      concurrency: 5

# 4. Cache products on frontend
// Products rarely change
// cache them in localStorage
const [products, setProducts] = useState(() => {
  return JSON.parse(localStorage.getItem('products')) || [];
});

# 5. Redeploy
serverless deploy
npm run dev
```

### Problem: High AWS bills

**Error:** Unexpected AWS charges

**Solution:**
```bash
# 1. Check AWS billing console
# Go to Cost and Usage Reports

# 2. Identify expensive resources
# Usually: Lambda invocations, DynamoDB writes

# 3. Optimize:
# - Reduce synthetic latency
# - Use CloudFront for static assets
# - Enable DAX for DynamoDB (if needed)
# - Set DynamoDB TTL for auto-cleanup

# 4. Set billing alerts
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget.json

# 5. Use AWS Cost Explorer to visualize spending
```

---

## 🐛 Debugging Tips

### Enable Verbose Logging

**Backend:**
```bash
serverless deploy --verbose
serverless logs -f createOrder --tail
```

**Frontend:**
```javascript
// In App.jsx, add logging:
const fetchProducts = async () => {
  console.log('[FETCH] Starting product fetch');
  try {
    const response = await fetch(`${API_URL}/products`);
    console.log('[FETCH] Response:', response);
    const json = await response.json();
    console.log('[FETCH] Data:', json);
    setProducts(json.data || []);
  } catch (err) {
    console.error('[FETCH] Error:', err);
  }
}
```

### Use Browser DevTools

```
F12 → Open DevTools
→ Console Tab: Check for JavaScript errors
→ Network Tab: Check API calls, status codes
→ Application Tab: Check localStorage, cookies
→ Performance Tab: Check load times
```

### Test API Endpoints Directly

```bash
# Using curl
curl -X GET http://localhost:3001/products
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"cart":[{"id":"rtx-4090","name":"RTX 4090","price":1599.99,"quantity":1}]}'

# Or use Postman application
# https://www.postman.com/
```

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Check the error message carefully
2. ✅ Search for error in relevant documentation
3. ✅ Check CloudWatch logs (backend)
4. ✅ Check browser console (frontend)
5. ✅ Check this troubleshooting guide
6. ✅ Try the suggested solutions

### Where to Get Help

- **AWS Documentation:** https://docs.aws.amazon.com/
- **Serverless Framework:** https://www.serverless.com/framework/docs
- **React Documentation:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Stack Overflow:** Search your error message

### Reporting Issues

When asking for help, provide:

1. **Error message** (exact text)
2. **Step to reproduce** (what you clicked/did)
3. **Environment** (Node version, OS, etc.)
   ```bash
   node --version
   npm --version
   aws --version
   aws sts get-caller-identity
   git log --oneline -1
   ```
4. **Relevant code snippet** (not entire file)
5. **Screenshot** or **log excerpt** (if applicable)

---

## ✨ Success!

If you've resolved your issue, congratulations! 🎉

Consider contributing back by:
- Creating an issue on GitHub
- Sharing your solution on Stack Overflow
- Adding to this troubleshooting guide

---

**Still stuck?** Refer to the main README.md or check the ARCHITECTURE.md for deep technical details.

Good luck! ⚡
