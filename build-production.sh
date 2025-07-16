#!/bin/bash

# Production build script for Vietnamese Bill Payment System

echo "Starting production build..."

# Step 1: Clean previous build
echo "Cleaning previous build..."
rm -rf dist server/public

# Step 2: Build frontend with Vite
echo "Building frontend..."
npx vite build

# Step 3: Build backend with esbuild
echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Step 4: Copy frontend build to server public directory
echo "Copying frontend build to server public directory..."
mkdir -p server/public
cp -r dist/public/* server/public/

# Step 5: Verify build output
echo "Verifying build output..."
if [ -f "dist/index.js" ] && [ -f "server/public/index.html" ]; then
    echo "✓ Build completed successfully!"
    echo "✓ Backend: dist/index.js"
    echo "✓ Frontend: server/public/"
    echo ""
    echo "Ready for deployment!"
else
    echo "✗ Build failed. Missing required files."
    exit 1
fi