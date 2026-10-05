#!/bin/bash
# deploy.sh - Deploy FoodFlux to Oracle Cloud
# Run this on your Oracle Cloud instance

set -e

echo "🚀 Deploying FoodFlux to Oracle Cloud..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Copy .env.example to .env and fill in values:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    exit 1
fi

# Load environment variables
source .env

# Validate required vars
if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "your-super-secret-key-here-min-32-chars" ]; then
    echo "❌ NEXTAUTH_SECRET not set in .env"
    exit 1
fi

if [ -z "$NEXTAUTH_URL" ] || [ "$NEXTAUTH_URL" = "http://your-oracle-ip:3000" ]; then
    echo "❌ NEXTAUTH_URL not set in .env"
    exit 1
fi

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your-gemini-api-key" ]; then
    echo "⚠️  GEMINI_API_KEY not set - AI food entry will not work"
fi

echo "📦 Building and starting containers..."
docker compose pull
docker compose build --no-cache
docker compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️  Running database migrations..."
docker compose exec -T app npx prisma migrate deploy

echo "✅ Deployment complete!"
echo ""
echo "🌐 App running at: $NEXTAUTH_URL"
echo ""
echo "📋 Useful commands:"
echo "   View logs:     docker compose logs -f app"
echo "   View db logs:  docker compose logs -f db"
echo "   Restart:       docker compose restart"
echo "   Stop:          docker compose down"
echo "   Update:        git pull && ./deploy.sh"