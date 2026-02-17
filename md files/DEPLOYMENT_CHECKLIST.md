# Deployment Checklist

Use this checklist to track your deployment progress and ensure nothing is missed.

## ✅ Pre-Deployment Setup

### Local Environment
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed and configured
- [ ] Serverless Framework CLI installed (`serverless --version`)
- [ ] AWS CLI installed (`aws --version`)

### AWS Account Setup
- [ ] AWS Account created
- [ ] IAM user with programmatic access created
- [ ] Access Key ID and Secret Access Key generated
- [ ] AWS credentials configured (`aws configure`)
- [ ] Correct AWS region selected (us-east-1 recommended)

## 📦 Backend Deployment

### Development Setup
- [ ] Navigate to `backend` directory
- [ ] Run `npm install` to install dependencies
- [ ] Copy `.env.example` to `.env` (optional)
- [ ] Installed `serverless-offline` and `serverless-dynamodb-local`
- [ ] DynamoDB local installed (`npm run dynamodb:install`)
- [ ] Backend runs locally (`npm run offline:start`)

### Production Deployment
- [ ] Reviewed `serverless.yml` configuration
- [ ] Verified IAM role permissions are correct
- [ ] Updated environment variables if needed
- [ ] Deployed to AWS (`npm run deploy:prod`)
- [ ] **🔑 Saved the API Gateway URL** (required for frontend!)
  - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`
- [ ] Tested `/products` endpoint in browser or Postman
- [ ] Tested `/orders` endpoint with POST request
- [ ] Set up CloudWatch monitoring (optional)
- [ ] Enabled API Gateway logging (optional)

## 🎨 Frontend Deployment

### Development Setup
- [ ] Navigate to `frontend` directory
- [ ] Run `npm install` to install dependencies
- [ ] Created `.env` file with `VITE_API_URL`
  - For local: `VITE_API_URL=http://localhost:3001`
  - For production: `VITE_API_URL=https://your-api-gateway-url/prod`
- [ ] Started development server (`npm run dev`)
- [ ] Verified app loads at `http://localhost:5173`
- [ ] Tested all features locally:
  - [ ] View products
  - [ ] Add to cart
  - [ ] Remove from cart
  - [ ] Update quantities
  - [ ] Proceed to checkout
  - [ ] See loading overlay
  - [ ] View order confirmation

### Production Build
- [ ] Updated `.env` with production API Gateway URL
- [ ] Built production bundle (`npm run build`)
- [ ] Preview build locally (`npm run preview`)
- [ ] Tested all features in preview

### Frontend Hosting Options

#### Option 1: AWS S3 + CloudFront
- [ ] Created S3 bucket for frontend
- [ ] Enabled static website hosting
- [ ] Uploaded `dist/` files to S3
- [ ] Created CloudFront distribution
- [ ] Updated DNS to CloudFront domain
- [ ] Set up HTTPS/SSL certificate
- [ ] Configured cache policies

#### Option 2: AWS Amplify
- [ ] Connected GitHub repository
- [ ] Configured build settings in Amplify
- [ ] Set environment variables in Amplify console
- [ ] Deployed via Amplify console
- [ ] Tested production URL

#### Option 3: Vercel/Netlify
- [ ] Connected Git repository
- [ ] Set `VITE_API_URL` environment variable
- [ ] Deployed platform handles build
- [ ] Verified domain is accessible

#### Option 4: Your Own Hosting
- [ ] Uploaded `dist/` to your server
- [ ] Configured web server (nginx/Apache)
- [ ] Set up HTTPS
- [ ] Configured CORS if needed

## 🧪 Testing Checklist

### Functional Testing
- [ ] Homepage loads without errors
- [ ] Products display correctly with images
- [ ] Prices show with discounts
- [ ] Stock levels display ("Only 5 left!", etc.)
- [ ] "Buy Now" buttons are large and prominent
- [ ] Cart icon shows correct item count
- [ ] Add to cart works
- [ ] Cart view displays items correctly
- [ ] Can update quantities (+ and - buttons)
- [ ] Can remove items from cart
- [ ] Order total calculates correctly (with tax)
- [ ] Checkout button shows loading overlay
- [ ] Loading overlay has status messages
- [ ] Order confirmation modal appears with Order ID
- [ ] Order ID can be copied to clipboard

### Performance Testing
- [ ] Frontend loads in < 3 seconds on 4G
- [ ] Products load within 1-2 seconds
- [ ] Checkout completes within 5-10 seconds
- [ ] No console errors in browser DevTools
- [ ] Network requests are efficient (no waterfall loading)

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Mobile Responsiveness
- [ ] Navbar displays correctly on mobile
- [ ] Product grid stacks on small screens
- [ ] Buttons are touch-friendly (min 44x44px)
- [ ] Cart works on mobile
- [ ] Modal displays correctly on mobile
- [ ] No horizontal scrolling

### API Testing
- [ ] GET `/products` returns 200 status
- [ ] Response contains all 6 products
- [ ] Each product has required fields
- [ ] POST `/orders` returns 201 status
- [ ] Order ID is included in response
- [ ] Error handling works (invalid requests)
- [ ] CORS headers are present
- [ ] API handles concurrent requests

### Security Testing
- [ ] CORS headers prevent unauthorized origins
- [ ] Environment variables don't leak to frontend
- [ ] API URL is not hardcoded in code
- [ ] No sensitive data in browser console
- [ ] DynamoDB is not directly accessible
- [ ] IAM role has minimal permissions

## 📊 Monitoring Setup

### CloudWatch
- [ ] Lambda function metrics visible
- [ ] Error logs accessible
- [ ] Custom metrics created (optional)
- [ ] Alarms set up for errors

### DynamoDB
- [ ] Table metrics visible
- [ ] Read/write capacity monitored
- [ ] Item count tracked

### API Gateway
- [ ] Request count monitored
- [ ] Latency metrics visible
- [ ] Error rate tracked

## 🔐 Security Hardening (Optional)

- [ ] Enable API Gateway authentication (API Key or OAuth)
- [ ] Add WAF rules to API Gateway
- [ ] Enable VPC endpoints for DynamoDB (private)
- [ ] Add encryption key rotation policy
- [ ] Set up request logging
- [ ] Enable API Gateway caching for `/products`
- [ ] Add rate limiting per API key

## 💰 Cost Optimization

- [ ] DynamoDB is on-demand billing (auto-scaling)
- [ ] Lambda has appropriate memory allocation (512MB)
- [ ] Lambda timeout is reasonable (30s)
- [ ] Removed test/unused Lambda functions
- [ ] CloudWatch logs retention set to 14-30 days
- [ ] Checked for unused API Gateway stages
- [ ] Enabled DynamoDB TTL to auto-delete old records
- [ ] Set up billing alerts in AWS

## 🚀 Production Go-Live

### Pre-Launch
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Backup of current stable version
- [ ] Rollback plan documented

### Launch Day
- [ ] Monitor CloudWatch metrics closely
- [ ] Be ready to scale Lambda concurrency if needed
- [ ] Have support team on standby
- [ ] Test with real load (load testing tool optional)
- [ ] Monitor error rates

### Post-Launch
- [ ] Monitor for 24+ hours
- [ ] Gather user feedback
- [ ] Fix any critical issues
- [ ] Document lessons learned
- [ ] Plan next iteration

## 📝 Post-Deployment Documentation

- [ ] API Gateway URL documented
- [ ] Frontend URL documented
- [ ] Admin access credentials secured
- [ ] Runbook created for operations team
- [ ] Known limitations documented
- [ ] Scaling guidelines documented
- [ ] Cost projections updated

## 🧹 Cleanup (if removing project)

- [ ] Run `npm run remove` in backend (deletes all AWS resources)
- [ ] Manually delete S3 buckets (if used)
- [ ] Manually delete CloudFront distributions (if used)
- [ ] Delete CloudWatch log groups manually
- [ ] Verify all resources deleted from AWS Console
- [ ] Remove local files and directories

---

## ✨ Success! Your deployment is complete!

You now have a **production-grade serverless e-commerce platform** capable of:
- ✅ Handling unlimited concurrent traffic
- ✅ Scaling automatically based on demand
- ✅ Processing orders in milliseconds
- ✅ Storing data safely in DynamoDB
- ✅ Providing a beautiful user experience

**Next Steps:**
1. Monitor performance metrics
2. Gather user feedback
3. Optimize based on real-world usage
4. Plan additional features (payment integration, user accounts, etc.)
5. Consider geographic distribution (multi-region deployment)

---

**Questions?** Refer to the main README.md for detailed information about each component.
