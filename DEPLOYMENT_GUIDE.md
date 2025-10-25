# Hook Club App Deployment Guide

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud SDK** installed (`gcloud` command)
3. **Node.js 18+** installed
4. **Your business domain** ready for configuration

## Step 1: Google Cloud Setup

### 1.1 Create a New Project
```bash
# Create a new project (replace with your project name)
gcloud projects create your-project-id --name="Hook Club App"

# Set the project
gcloud config set project your-project-id

# Enable billing (required for App Engine)
# Go to: https://console.cloud.google.com/billing
```

### 1.2 Enable Required APIs
```bash
gcloud services enable appengine.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable iam.googleapis.com
```

## Step 2: Firestore Database Setup

### 2.1 Create Firestore Database
1. Go to [Firestore Console](https://console.cloud.google.com/firestore)
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users)

### 2.2 Set up Service Account
```bash
# Run the service account setup script
./setup-service-account.sh

# Add the key to gitignore
echo 'service-account-key.json' >> .gitignore
```

## Step 3: Configure Environment

### 3.1 Update Configuration Files
1. **Update `app.yaml`**:
   - Replace `your-project-id` with your actual project ID

2. **Update `server.js`**:
   - Replace `your-project-id` with your actual project ID

3. **Update `migrate-to-firestore.js`**:
   - Replace `your-project-id` with your actual project ID

### 3.2 Install Dependencies
```bash
npm install
```

## Step 4: Deploy the Application

### 4.1 Build and Deploy
```bash
# Build the application
npm run build

# Deploy to App Engine
gcloud app deploy app.yaml
```

### 4.2 Migrate Your Songs Data
```bash
# Set the service account key
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"

# Run the migration
node migrate-to-firestore.js
```

## Step 5: Custom Domain Setup

### 5.1 Configure Custom Domain
1. Go to [App Engine Console](https://console.cloud.google.com/appengine)
2. Click "Settings" → "Custom Domains"
3. Click "Add Custom Domain"
4. Enter your business domain
5. Follow the DNS configuration instructions

### 5.2 SSL Certificate
- Google Cloud automatically provisions SSL certificates
- Your site will be available at `https://yourdomain.com`

## Step 6: Verify Deployment

### 6.1 Test the Application
1. Visit your deployed app URL
2. Test song editing functionality
3. Verify data persistence

### 6.2 Monitor the Application
- **App Engine Console**: Monitor performance and logs
- **Firestore Console**: View your data
- **Cloud Console**: Monitor costs and usage

## Environment Variables

Set these in your App Engine environment:

```yaml
# In app.yaml
env_variables:
  NODE_ENV: production
  GOOGLE_CLOUD_PROJECT: your-project-id
```

## Database Schema

### Songs Collection
```javascript
{
  id: "song-id",
  originalTitle: "Song Title",
  originalArtist: "Artist Name",
  thcTitle: "THC Title",
  thcArtist: "THC Artist",
  // ... other song fields
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Client Data Collection
```javascript
{
  eventId: "event-id",
  ceremonySongs: [...],
  receptionSpecialMoments: [...],
  // ... other client data
  updatedAt: Timestamp
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure service account has proper permissions
   - Check that service account key is valid

2. **Database Connection Issues**
   - Verify Firestore is enabled
   - Check project ID configuration

3. **Deployment Failures**
   - Check that all dependencies are installed
   - Verify Node.js version compatibility

### Getting Help

- **Google Cloud Documentation**: https://cloud.google.com/docs
- **App Engine Documentation**: https://cloud.google.com/appengine/docs
- **Firestore Documentation**: https://cloud.google.com/firestore/docs

## Cost Estimation

### Free Tier Limits
- **App Engine**: 28 frontend instance hours per day
- **Firestore**: 1GB storage, 50K reads, 20K writes per day

### Expected Costs (Beyond Free Tier)
- **App Engine**: ~$0.05-0.10 per day for small usage
- **Firestore**: ~$0.18 per GB storage, $0.06 per 100K reads
- **Total**: Likely under $10/month for typical usage

## Security Considerations

1. **Service Account Key**: Keep secure, never commit to git
2. **Firestore Rules**: Configure appropriate read/write rules
3. **HTTPS**: Automatically enabled with custom domain
4. **Authentication**: Consider adding user authentication for production

## Next Steps

1. **Set up monitoring** with Google Cloud Monitoring
2. **Configure backups** for your Firestore database
3. **Add user authentication** if needed
4. **Set up CI/CD** for automated deployments
