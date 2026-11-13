#!/bin/bash
gcloud run deploy bailarn-website \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --project bailarn-website
