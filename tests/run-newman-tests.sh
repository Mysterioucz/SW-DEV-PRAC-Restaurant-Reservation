#!/bin/bash

# Restaurant Reservation API - Newman Test Runner
# This script runs the complete test suite using Newman

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Restaurant Reservation API Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Newman is installed
if ! command -v newman &> /dev/null
then
    echo -e "${RED}Newman is not installed!${NC}"
    echo -e "${YELLOW}Installing Newman globally...${NC}"
    npm install -g newman
    npm install -g newman-reporter-htmlextra
fi

# Check if server is running
echo -e "${YELLOW}Checking if server is running on http://localhost:3000...${NC}"
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${RED}Error: Server is not running on http://localhost:3000${NC}"
    echo -e "${YELLOW}Please start the development server first:${NC}"
    echo -e "  ${BLUE}pnpm dev${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Create reports directory
REPORTS_DIR="tests/reports"
mkdir -p "$REPORTS_DIR"

# Get timestamp for report naming
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_NAME="test-report-${TIMESTAMP}"

echo -e "${YELLOW}Running Newman tests...${NC}"
echo ""

# Run Newman with collection and environment
newman run tests/restaurant-api.postman_collection.json \
  -e tests/environment.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export "$REPORTS_DIR/${REPORT_NAME}.html" \
  --reporter-json-export "$REPORTS_DIR/${REPORT_NAME}.json" \
  --color on \
  --timeout-request 10000 \
  --bail \
  --verbose

# Check exit code
EXIT_CODE=$?

echo ""
echo -e "${BLUE}========================================${NC}"

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed successfully!${NC}"
    echo -e "${BLUE}HTML Report: ${REPORTS_DIR}/${REPORT_NAME}.html${NC}"
    echo -e "${BLUE}JSON Report: ${REPORTS_DIR}/${REPORT_NAME}.json${NC}"
else
    echo -e "${RED}✗ Tests failed with exit code: $EXIT_CODE${NC}"
    echo -e "${YELLOW}Check the reports for details:${NC}"
    echo -e "${BLUE}  - ${REPORTS_DIR}/${REPORT_NAME}.html${NC}"
    echo -e "${BLUE}  - ${REPORTS_DIR}/${REPORT_NAME}.json${NC}"
fi

echo -e "${BLUE}========================================${NC}"

exit $EXIT_CODE
