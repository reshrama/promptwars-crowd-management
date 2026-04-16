#!/bin/bash

# Configuration
PROJECT_ID="pr0mptwar-cr0wd-mgmt"
REGION="us-central1"
SERVICE_NAME="crowdsync"

echo "🚀 Starting deployment of CrowdSync to Google Cloud Run..."

# 1. Build and Submit to Google Cloud Build
echo "📦 Building and pushing container image..."
# Using modern Artifact Registry format: REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME/IMAGE_NAME
IMAGE_PATH="$REGION-docker.pkg.dev/$PROJECT_ID/crowdsync-repo/$SERVICE_NAME"

# Read API Key from .env if present
GEMINI_KEY=$(grep VITE_GEMINI_API_KEY .env | cut -d '=' -f2)

if ! gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_IMAGE_PATH=$IMAGE_PATH,_VITE_GEMINI_API_KEY=$GEMINI_KEY; then
  echo "❌ Build failed. Please check the logs in the GCP Console."
  exit 1
fi

# 2. Deploy to Cloud Run
echo "🌍 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_PATH \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

echo "✅ Deployment complete!"
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
