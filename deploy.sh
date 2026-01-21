#!/bin/bash

echo "🚀 Starting deployment..."

echo "📦 Building frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "📁 Creating deployment package..."
cd ..
mkdir -p deployment
cp -r frontend/dist deployment/

echo "📝 Updating README..."
# Add your README update logic here

echo "✅ Deployment package ready!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Vercel will auto-deploy frontend"
echo "3. Check deployment at: https://job-tracker-ai.vercel.app"