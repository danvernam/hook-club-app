# 🚀 Hook Club App - Deployment Steps

## ✅ What's Ready
- ✅ Google Cloud Project: `hook-club-app-2025`
- ✅ Firestore Database: Created and tested
- ✅ Service Account: Configured with permissions
- ✅ Application: Built successfully
- ✅ Deployment Package: `hook-club-app.zip` created

## 🎯 Next Steps for Deployment

### Option 1: Google Cloud Console (Recommended)

1. **Go to Cloud Run Console**
   - Visit: https://console.cloud.google.com/run
   - Make sure project `hook-club-app-2025` is selected

2. **Create Service**
   - Click "CREATE SERVICE"
   - Choose "Deploy one revision from an existing container image"
   - Click "SELECT" next to Container image URL
   - Choose "Upload from your computer"
   - Upload the `hook-club-app.zip` file

3. **Configure Service**
   - Service name: `hook-club-app`
   - Region: `us-central1`
   - Authentication: "Allow public access"
   - Environment variables:
     - `GOOGLE_CLOUD_PROJECT` = `hook-club-app-2025`
   - Click "CREATE"

### Option 2: Command Line (If permissions are fixed)

```bash
# First, fix IAM permissions in Google Cloud Console:
# Go to: https://console.cloud.google.com/iam-admin/iam
# Find: 245827946513-compute@developer.gserviceaccount.com
# Add roles: Cloud Build Service Account, Storage Admin, Cloud Run Admin

# Then run:
gcloud run deploy hook-club-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=hook-club-app-2025"
```

## 📊 Migrate Your Data

After deployment, run this to upload your songs:

```bash
cd /Users/dansmacbook1/Desktop/THC/hook-club-app
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
node migrate-songs-batch.js
```

## 🔄 For Frequent Updates

### Method 1: Manual Updates
```bash
# After making code changes:
./cloud-run-deploy.sh
```

### Method 2: GitHub Integration (Best for frequent updates)
1. Push your code to GitHub
2. In Cloud Run Console, set up "Continuously deploy from a repository"
3. Connect your GitHub repo
4. Every push to main branch = automatic deployment

## 🌐 Your App URL
After deployment, you'll get a URL like:
`https://hook-club-app-[random]-us-central1.a.run.app`

## 🛠️ Troubleshooting

### If deployment fails:
1. Check IAM permissions in Google Cloud Console
2. Verify billing is enabled
3. Try the Console method instead of command line

### If songs don't load:
1. Run the migration script: `node migrate-songs-batch.js`
2. Check Firestore in console: https://console.cloud.google.com/firestore

### If API calls fail:
1. Check environment variables are set
2. Verify `GOOGLE_CLOUD_PROJECT=hook-club-app-2025`

## 💰 Expected Costs
- **Free tier**: 2M requests/month, 1GB Firestore storage
- **Your estimated cost**: $0-5/month

## 🎉 Success!
Once deployed, your app will:
- ✅ Save all song edits to Firestore
- ✅ Auto-save client planning data
- ✅ Work from any device
- ✅ Handle frequent updates easily
