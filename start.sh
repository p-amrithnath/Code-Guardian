#!/bin/bash

# Code Guardian - Quick Start Script
echo "🛡️  Starting Code Guardian Security Scanner..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists java; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

if ! command_exists mvn && [ ! -f "./backend/mvnw" ]; then
    echo -e "${RED}❌ Maven is not available. Please install Maven or ensure mvnw is present in backend folder.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are satisfied!${NC}"

# Start backend
echo -e "${BLUE}Starting Spring Boot backend...${NC}"
cd backend

if [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run &
else
    mvn spring-boot:run &
fi
BACKEND_PID=$!

# Return to root directory
cd ..

# Wait a moment for backend to start
sleep 5

# Check if backend started successfully
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Backend started successfully on http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Failed to start backend${NC}"
    exit 1
fi

# Start frontend
echo -e "${BLUE}Setting up and starting React frontend...${NC}"
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend started successfully on http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Failed to start frontend${NC}"
    # Kill backend if frontend failed
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Code Guardian is now running!${NC}"
echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 Backend:  http://localhost:8080${NC}"
echo -e "${BLUE}💊 Health:   http://localhost:8080/api/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for user to stop
wait 