#!/bin/bash

# Lumio Development Startup Script

echo "🚀 Starting Lumio Development Environment"
echo

# Check if Redis is running
echo "📡 Checking Redis connection..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Please start Redis first:"
    echo "   - macOS (Homebrew): brew services start redis"
    echo "   - Ubuntu/Debian: sudo systemctl start redis-server"
    echo "   - Docker: docker run -d -p 6379:6379 redis:7-alpine"
    exit 1
fi
echo "✅ Redis is running"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration (especially GEMINI_API_KEY)"
    echo "   Then run this script again."
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "^GEMINI_API_KEY=.*[^=]" .env; then
    echo "❌ GEMINI_API_KEY not set in .env file"
    echo "📝 Please add your Google Gemini Pro API key to .env file"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🎯 Starting development servers..."
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001"
echo
echo "Press Ctrl+C to stop all servers"

# Start both frontend and backend
npm run dev