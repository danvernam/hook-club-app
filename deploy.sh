#!/bin/bash

echo "🚀 Deploying Hook Club App to Google Cloud Platform..."

# Set your project ID
PROJECT_ID="hook-club-app-2025"

# Set the project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable appengine.googleapis.com
gcloud services enable firestore.googleapis.com

# Build the Next.js app
echo "Building Next.js application..."
npm run build

# Deploy to App Engine
echo "Deploying to App Engine..."
gcloud app deploy app.yaml --quiet

# Get the app URL
echo "Getting app URL..."
APP_URL=$(gcloud app browse --no-launch-browser)
echo "✅ App deployed successfully!"
echo "🌐 Your app is available at: $APP_URL"

echo ""
echo "📋 Next steps:"
echo "1. Update your custom domain in Google Cloud Console"
echo "2. Run 'node migrate-to-firestore.js' to migrate your songs data"
echo "3. Configure authentication if needed"
