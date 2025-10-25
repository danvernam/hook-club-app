#!/bin/bash

echo "🚀 Deploying Hook Club App to Google Cloud Run..."

# Set your project ID
PROJECT_ID="hook-club-app-2025"
SERVICE_NAME="hook-club-app"
REGION="us-central1"

# Set the project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Build and deploy to Cloud Run
echo "Building and deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
  --quiet

echo "✅ App deployed successfully!"
echo "🌐 Your app is available at: https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app"

echo ""
echo "📋 Next steps:"
echo "1. Run 'node migrate-to-firestore.js' to migrate your songs data"
echo "2. Configure authentication if needed"
