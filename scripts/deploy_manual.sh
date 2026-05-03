#!/bin/bash

# VoteWise Manual Deployment Script
# This script automates the steps outlined in the manual deployment guide.

set -e

# Configuration
REGION="us-central1"
PROJECT_ID=$(gcloud config get-value project)

echo "🚀 Starting manual deployment for project: $PROJECT_ID in region: $REGION"

# 1. Build and Push Backend
echo "📦 Building backend image..."
docker build -t gcr.io/$PROJECT_ID/votewise-backend -f backend/Dockerfile .
echo "📤 Pushing backend image..."
docker push gcr.io/$PROJECT_ID/votewise-backend

# 2. Deploy Backend
echo "🌐 Deploying backend to Cloud Run..."
gcloud run deploy votewise-backend \
  --image gcr.io/$PROJECT_ID/votewise-backend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated

# Get backend URL
BACKEND_URL=$(gcloud run services describe votewise-backend --region $REGION --format='value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 3. Update Frontend with Backend URL
echo "🔧 Updating frontend with backend URL..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|REPLACE_WITH_YOUR_BACKEND_URL|$BACKEND_URL|g" frontend/js/main.js
else
  sed -i "s|REPLACE_WITH_YOUR_BACKEND_URL|$BACKEND_URL|g" frontend/js/main.js
fi

# 4. Build and Push Frontend
echo "📦 Building frontend image..."
docker build -t gcr.io/$PROJECT_ID/votewise-frontend -f frontend/Dockerfile .
echo "📤 Pushing frontend image..."
docker push gcr.io/$PROJECT_ID/votewise-frontend

# 5. Deploy Frontend
echo "🌐 Deploying frontend to Cloud Run..."
gcloud run deploy votewise-frontend \
  --image gcr.io/$PROJECT_ID/votewise-frontend \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated

FRONTEND_URL=$(gcloud run services describe votewise-frontend --region $REGION --format='value(status.url)')
echo "🎉 Deployment complete!"
echo "🔗 Frontend URL: $FRONTEND_URL"
echo "🔗 Backend URL: $BACKEND_URL"
