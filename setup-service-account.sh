#!/bin/bash

echo "🔧 Setting up Google Cloud Service Account..."

# Set your project ID
PROJECT_ID="hook-club-app-2025"

# Create service account
echo "Creating service account..."
gcloud iam service-accounts create hook-club-app \
    --display-name="Hook Club App Service Account" \
    --description="Service account for Hook Club App"

# Grant necessary permissions
echo "Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:hook-club-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:hook-club-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/firestore.user"

# Create and download service account key
echo "Creating service account key..."
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=hook-club-app@$PROJECT_ID.iam.gserviceaccount.com

echo "✅ Service account setup complete!"
echo "📁 Service account key saved to: ./service-account-key.json"
echo ""
echo "⚠️  IMPORTANT: Add service-account-key.json to your .gitignore file!"
echo "   echo 'service-account-key.json' >> .gitignore"
