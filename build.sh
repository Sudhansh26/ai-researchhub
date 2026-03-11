#!/usr/bin/env bash
# Build script for Render backend deployment
set -e

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt

echo "Creating required directories..."
mkdir -p uploads vector_db

echo "Build complete!"
