#!/bin/bash
gcloud run deploy bailarn-website \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --service-account bailarn-run-sa@bailarn-website.iam.gserviceaccount.com \
  --max-instances 1 \
  --memory 128Mi \
  --cpu 1 \
  --project bailarn-website
