# 🚀 Quick Deployment Guide

## **Current Issue:**
The command line deployment is hitting permission/configuration issues. Let's use the Google Cloud Console instead.

## **Step-by-Step Console Deployment:**

### **1. Go to Cloud Run Console**
- Visit: https://console.cloud.google.com/run
- Make sure project `hook-club-app-2025` is selected

### **2. Create Service**
- Click "CREATE SERVICE"
- Choose **"Continuously deploy from a repository (source or function)"** (GitHub card)
- Click "SET UP WITH CLOUD BUILD"

### **3. Connect GitHub**
- Click "Authenticate" next to "Currently not authenticated"
- Sign in to GitHub and authorize Google Cloud
- Select your repository (you'll need to create one first)

### **4. Alternative: Use Cloud Shell**
If the above doesn't work, try Cloud Shell:

1. **Open Cloud Shell**: https://console.cloud.google.com/cloudshell
2. **Upload your code**:
   ```bash
   # Upload the hook-club-app.zip file to Cloud Shell
   # Then extract it:
   unzip hook-club-app.zip
   cd hook-club-app
   ```

3. **Deploy from Cloud Shell**:
   ```bash
   gcloud run deploy hook-club-app \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="GOOGLE_CLOUD_PROJECT=hook-club-app-2025"
   ```

## **After Deployment:**

### **Migrate Your Songs:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
node migrate-songs-batch.js
```

## **For Frequent Updates:**
Once deployed, you can update by:
1. Making code changes locally
2. Running the same deployment command
3. Or setting up GitHub integration for automatic updates

## **Expected Result:**
- Your app will be live at: `https://hook-club-app-[random]-us-central1.a.run.app`
- All song edits will save to Firestore
- Client planning data will auto-save
- Ready for frequent updates

**Try the Cloud Shell method first - it often works better than local command line!**
