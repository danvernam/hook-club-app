# Hook Club App - Manual Deployment Guide

## ✅ What's Already Done

1. **Google Cloud Project**: `hook-club-app-2025` is created
2. **Billing**: Enabled and linked
3. **Firestore Database**: Created in `us-central1`
4. **Service Account**: Created with proper permissions
5. **Application**: Built successfully
6. **Backend Code**: Ready to deploy

## 🚀 Manual Deployment Steps

### Option 1: Deploy via Google Cloud Console (Easiest)

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/
   - Select project: `hook-club-app-2025`

2. **Enable Cloud Run API**
   - Go to: https://console.cloud.google.com/apis/library/run.googleapis.com
   - Click "ENABLE"

3. **Grant Build Permissions**
   - Go to: https://console.cloud.google.com/iam-admin/iam
   - Find: `245827946513-compute@developer.gserviceaccount.com`
   - Click "Edit" (pencil icon)
   - Add roles:
     - Cloud Build Service Account
     - Storage Admin
     - Cloud Run Admin
   - Click "SAVE"

4. **Deploy to Cloud Run**
   - Go to: https://console.cloud.google.com/run
   - Click "CREATE SERVICE"
   - Select "Continuously deploy from a repository (source-based)"
   - Click "SET UP WITH CLOUD BUILD"
   - Connect your GitHub repository OR upload your code
   - Settings:
     - Service name: `hook-club-app`
     - Region: `us-central1`
     - Authentication: Allow unauthenticated invocations
     - Environment variables:
       - `GOOGLE_CLOUD_PROJECT` = `hook-club-app-2025`
   - Click "CREATE"

### Option 2: Deploy via Command Line (After Fixing Permissions)

After granting the permissions above, run:

```bash
cd /Users/dansmacbook1/Desktop/THC/hook-club-app

# Deploy to Cloud Run
gcloud run deploy hook-club-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=hook-club-app-2025"
```

## 📊 Migrate Your Data

After deployment, migrate your songs to Firestore:

```bash
cd /Users/dansmacbook1/Desktop/THC/hook-club-app
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
node migrate-songs-batch.js
```

**If migration times out**, run it multiple times - it will merge existing data.

## 🌐 Your App URL

After deployment, your app will be available at:
- Cloud Run: `https://hook-club-app-[RANDOM]-us-central1.a.run.app`
- You'll see the exact URL in the Cloud Run console

## 🔧 Troubleshooting

### If songs don't load:
1. Check Firestore in console: https://console.cloud.google.com/firestore
2. Run migration script again
3. Check service account permissions

### If deployment fails:
1. Verify billing is enabled
2. Check IAM permissions for compute service account
3. Try deploying through console instead of command line

### If API calls fail:
1. Check environment variables are set
2. Verify GOOGLE_CLOUD_PROJECT is correct
3. Check Firestore rules allow reads/writes

##Next Steps

1. Fix IAM permissions in Google Cloud Console
2. Deploy via Console or command line
3. Migrate data
4. Test the app
5. (Optional) Set up custom domain

## 💰 Expected Costs

- **Cloud Run**: Free for first 2 million requests/month
- **Firestore**: Free for first 1GB storage, 50K reads/day
- **Your estimated cost**: $0-5/month for typical usage

## 📞 Need Help?

If you encounter any issues:
1. Check the Cloud Build logs in the Console
2. Verify all IAM permissions are set
3. Make sure billing is active
4. Try the Console deployment method first
