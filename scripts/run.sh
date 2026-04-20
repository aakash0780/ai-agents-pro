#!/bin/bash
# Script to run the AI Agents Website project

echo "Checking if pnpm is installed..."
if ! command -v pnpm &> /dev/null; then
    echo "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "Installing dependencies..."
pnpm install

echo "Starting development server..."
pnpm dev

