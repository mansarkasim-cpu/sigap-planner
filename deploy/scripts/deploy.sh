#!/bin/bash

# Quick Deploy Script untuk SigapPlanner
# Run this script untuk deploy code terbaru dengan satu command

set -e  # Exit on error

DEPLOY_DIR="/home/deploy/apps/sigap-planner"
BACKEND_DIR="$DEPLOY_DIR/backend"

echo "=========================================="
echo "SigapPlanner Production Deployment"
echo "=========================================="
echo ""

# Verify we're in the right directory
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ Error: Deployment directory not found at $DEPLOY_DIR"
    exit 1
fi

cd "$DEPLOY_DIR"

echo "📍 Current directory: $(pwd)"
echo ""

# Check current branch and latest commit
echo "📦 Git Status:"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
LATEST_COMMIT=$(git log --oneline -1)
echo "   Branch: $CURRENT_BRANCH"
echo "   Latest: $LATEST_COMMIT"
echo ""

# Pull latest code
echo "🔄 Pulling latest code..."
git pull origin $CURRENT_BRANCH || {
    echo "❌ Git pull failed"
    exit 1
}
echo "✅ Code pulled successfully"
echo ""

# Install and build backend
echo "🔨 Building backend..."
cd "$BACKEND_DIR"
npm install || {
    echo "❌ npm install failed"
    exit 1
}
npm run build || {
    echo "❌ npm build failed"
    exit 1
}
echo "✅ Backend built successfully"
echo ""

# Stop backend service
echo "⏹️  Stopping backend service..."
sudo systemctl stop sigap-web.service || {
    echo "⚠️  Warning: Could not stop service (continue anyway)"
}
sleep 2

# Start backend service
echo "▶️  Starting backend service..."
sudo systemctl start sigap-web.service || {
    echo "❌ Failed to start service"
    exit 1
}
sleep 3

# Check service status
echo "🔍 Checking service status..."
SERVICE_STATUS=$(sudo systemctl is-active sigap-web.service)
if [ "$SERVICE_STATUS" = "active" ]; then
    echo "✅ Service is running"
else
    echo "❌ Service is not running. Check logs:"
    sudo systemctl status sigap-web.service
    exit 1
fi
echo ""

# Fix old files permissions (optional)
echo "🔐 Would you like to fix permissions on old uploaded files? (y/n)"
read -r FIX_PERMS
if [ "$FIX_PERMS" = "y" ] || [ "$FIX_PERMS" = "Y" ]; then
    echo "Running fix-uploads-permissions.sh..."
    cd "$DEPLOY_DIR/deploy/scripts"
    chmod +x fix-uploads-permissions.sh
    ./fix-uploads-permissions.sh
    echo "✅ Permissions fixed"
fi
echo ""

# Run basic health check
echo "🏥 Running health check..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/auth/me || echo "000")
if [ "$HEALTH_CHECK" = "401" ] || [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Backend responding normally (HTTP $HEALTH_CHECK)"
else
    echo "⚠️  Backend health check returned HTTP $HEALTH_CHECK (expected 200 or 401)"
fi
echo ""

echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📋 Post-Deployment Checklist:"
echo "   [ ] Check backend logs for errors: sudo journalctl -u sigap-web.service -n 50"
echo "   [ ] Test API endpoint with valid token"
echo "   [ ] Test upload new photo and verify accessible"
echo "   [ ] Test old photos can be accessed (no 403 errors)"
echo "   [ ] Check mobile app connects successfully"
echo "   [ ] Check web dashboard works"
echo ""
echo "For more info: cat $DEPLOY_DIR/deploy/DEPLOY-GUIDE.md"
