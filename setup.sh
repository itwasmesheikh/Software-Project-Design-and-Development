#!/bin/bash
set -euo pipefail


echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi

echo "Building backend..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error building backend"
    exit 1
fi

cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi

echo "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error building frontend"
    exit 1
fi

cd ..

echo "Setup completed successfully!"
echo "To start the development servers:"
echo "  1. Open a terminal and run: cd backend && npm run dev"
echo "  2. Open another terminal and run: cd frontend && npm run dev"