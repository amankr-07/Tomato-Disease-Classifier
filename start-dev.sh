#!/bin/bash

# Tomato Disease Classifier - Local Development Startup

echo "🍅 Tomato Disease Classifier - Local Development"
echo "=================================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.9+"
    exit 1
fi

echo "✅ Python found: $(python --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -q -r requirements.txt 2>&1 | tail -3
cd ..
echo "✅ Dependencies installed"
echo ""

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
uvicorn app:app --reload &
BACKEND_PID=$!
cd ..
echo "✅ Backend running on http://localhost:8000 (PID: $BACKEND_PID)"
echo ""

# Give backend time to start
sleep 3

# Check if backend is responding
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "⚠️  Backend may still be starting..."
fi

echo ""
echo "🎨 Frontend information:"
echo "   Navigate to: http://localhost:5000"
echo "   To serve frontend, run in another terminal:"
echo "   cd frontend && python -m http.server 5000"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "❌ To stop the backend, press Ctrl+C"
echo ""

wait $BACKEND_PID
