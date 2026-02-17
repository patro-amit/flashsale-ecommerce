# AWS Configuration Guide

Complete step-by-step guide to configure your AWS environment for this serverless project.

## 🔑 Step 1: Create AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Provide email, password, and account name
4. Choose "Business" account type
5. Add payment information
6. Verify your identity (phone or email)
7. Choose a support plan (Free tier eligible for 12 months)

## 👤 Step 2: Create IAM User with Programmatic Access

### Why?
Don't use your root AWS account credentials. Create an IAM user instead (security best practice).

### How?

1. **Login to AWS Console** as root user
2. **Navigate to IAM Service**
   - Search for "IAM" in the AWS console
   - Click on "Users" in the left sidebar

3. **Create New User**
   - Click "Create user" button
   - User name: `serverless-deployer`
   - ✅ Check "Provide user access to the AWS Management Console"
   - ✅ Check "I want to create an IAM user"
   - Custom password: Enter a strong password
   - ✅ "Users must create a new password on next sign-in"
   - Click "Next"

4. **Add Permissions**
   - Select "Attach policies directly"
   - Search for and attach:
     - [ ] `AWSLambdaFullAccess`
     - [ ] `AmazonDynamoDBFullAccess`
     - [ ] `AmazonAPIGatewayAdministrator`
     - [ ] `IAMFullAccess`
     - [ ] `CloudWatchFullAccess`
     - [ ] `CloudFormationFullAccess`
   - Click "Next"

5. **Review and Create**
   - Review settings
   - Click "Create user"

6. **Generate Access Keys**
   - Click on the newly created user: `serverless-deployer`
   - Click on "Security credentials" tab
   - Under "Access keys": Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - ✅ Check confirmation
   - Click "Next"
   - Click "Create access key"
   - **⚠️ SAVE THESE IMMEDIATELY!**
     - Access Key ID
     - Secret Access Key
   - Store in a password manager or secure location
   - **NEVER commit these to git or share publicly!**

## 🔧 Step 3: Configure AWS CLI

### Install AWS CLI (if not already installed)

**macOS with Homebrew:**
```bash
brew install awscli
```

**Or use the official installer:**
- Download from: https://aws.amazon.com/cli/
- Follow installation instructions

### Verify Installation
```bash
aws --version
# Should output: aws-cli/2.x.x Python/3.x...
```

### Configure Credentials

```bash
aws configure
```

You'll be prompted for:
```
AWS Access Key ID [None]: ✏️ PASTE_YOUR_ACCESS_KEY_ID
AWS Secret Access Key [None]: ✏️ PASTE_YOUR_SECRET_ACCESS_KEY
Default region name [None]: us-east-1
Default output format [None]: json
```

### Verify Configuration

```bash
aws sts get-caller-identity
```

Should output:
```json
{
    "UserId": "AIDAI...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/serverless-deployer"
}
```

If you see your account info, you're good to go! ✅

## 📋 Step 4: Prepare AWS Account for Serverless Framework

### Enable Required Services

All services should be enabled by default, but verify:

1. **Lambda**
   - Search for "Lambda" in AWS console
   - Click into it (should work)

2. **DynamoDB**
   - Search for "DynamoDB" in AWS console
   - Click into it (should work)

3. **API Gateway**
   - Search for "API Gateway" in AWS console
   - Click into it (should work)

4. **CloudFormation**
   - Required by Serverless Framework
   - Search for "CloudFormation" in AWS console
   - Click into it (should work)

### Set Default Region (Optional)

Edit `~/.aws/config`:

```ini
[default]
region = us-east-1
output = json
```

## 🛠️ Step 5: Install Serverless Framework CLI

```bash
npm install -g serverless
```

Verify installation:
```bash
serverless --version
# Should output: Framework Core: 3.x.x...
```

## ✅ Step 6: Verify Everything Works

### Create a Test Deployment

```bash
cd backend

# Deploy a test function to verify AWS access
serverless deploy --stage test

# Look for successful output:
# ✓ Service deployed successfully

# Get your API Gateway URL
serverless info --stage test

# Clean up test deployment
serverless remove --stage test
```

## 🔐 Step 7: Security Best Practices

### Local Machine Security
```bash
# Set restrictive permissions on AWS config
chmod 600 ~/.aws/config
chmod 600 ~/.aws/credentials
```

### Never Commit Credentials
Create `.gitignore` entries:
```
.env
.env.local
.env.*.local
~/.aws/
serverless/.env*
```

### Rotate Access Keys Regularly
- Monthly or quarterly access key rotation
- In IAM console → Users → Your user → Security credentials
- Delete old key after new one is working

### Enable MFA on Root Account
- In AWS console, go to Account settings
- Enable Multi-Factor Authentication (MFA)
- Use authenticator app or hardware key

## 📊 Step 8: Set Up Billing Alerts

1. Go to **Billing Dashboard**
   - Click your account name (top right) → Billing and Cost Management
   
2. **Create a Budget**
   - Click "Budgets" in left menu
   - Click "Create budget"
   - Budget type: "Cost"
   - Name: `Monthly_Limit`
   - Amount: `$10` (or your desired limit)
   - Set alert threshold: 80% of budget
   - Add email for notifications
   - Click "Create budget"

3. **Enable Cost Explorer**
   - This shows you spending over time
   - Helps identify cost drivers

## 💬 Step 9: Set Up Support (Optional)

For production apps, consider AWS Support:
- **Basic** (Free) - Documentation, forums, AWS Trusted Advisor
- **Developer** ($29+) - Email support, <24hr response
- **Business** ($100+) - Phone support, <1hr response
- **Enterprise** (Custom) - TAM, 15min support

For this prototype, **Basic** is sufficient.

## 🚀 Step 10: Ready to Deploy!

Everything is configured! Now:

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Deploy to AWS
npm run deploy:dev

# 4. Note the API Gateway URL from output
# Example: https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev

# 5. Configure frontend
cd ../frontend
echo "VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev" > .env
npm install
npm run dev

# 6. Visit http://localhost:5173
```

## 🔍 Monitoring Your AWS Resources

### CloudWatch Console
- **Lambda Metrics:**
  - Duration
  - Errors
  - Concurrent Executions
  - Memory Used

- **DynamoDB Metrics:**
  - Read/Write Capacity
  - Throttled Requests
  - Item Count

- **API Gateway Metrics:**
  - Requests
  - Latency
  - Error Rate

### Setting CloudWatch Alarms

**Example: Alert if Lambda errors exceed 5 per minute:**

1. Go to CloudWatch → Alarms → Create alarm
2. Select Lambda metric → Errors
3. Condition: Sum ≥ 5 (in 1 minute)
4. Action: SNS notification to your email
5. Create alarm

## 💂 Troubleshooting AWS Setup

### "Access Denied" Error
- ✓ Verify Access Key ID and Secret are correct
- ✓ Ensure IAM user has required permissions
- ✓ Run `aws sts get-caller-identity` to verify
- ✓ Try creating new access key pair

### "Resource Already Exists"
- Lambda function or API Gateway endpoint exists
- Solution: Delete old one first or use different stage name
```bash
serverless remove --stage dev
```

### "Quota Exceeded"
- Hit Lambda concurrency limit
- Go to Lambda → Application → Concurrent executions
- Request quota increase from AWS
- Or verify you're not in a loop creating functions

### "DynamoDB Validation Exception"
- Table name might conflict with existing table
- Check DynamoDB console for existing tables
- Delete old table or use different name in `serverless.yml`

### "CORS Error in Frontend"
- API Gateway CORS not configured
- Check `serverless.yml` CORS settings
- Ensure `cors: true` is set on your functions
- Redeploy: `serverless deploy --stage dev`

## 📚 Additional Resources

- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/)
- [Serverless Framework AWS Guide](https://www.serverless.com/framework/docs/getting-started)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

## ✨ You're All Set!

Your AWS environment is now configured and ready for:
- ✅ Lambda deployments
- ✅ DynamoDB tables
- ✅ API Gateway endpoints
- ✅ CloudWatch monitoring
- ✅ Automatic scaling

**Next:** Follow QUICKSTART.md to deploy your application!
