#!/bin/bash

# Tech Hunt API Testing Script
# Test all endpoints with sample data

echo "🧪 Tech Hunt API Testing"
echo "========================"
echo ""

# Configuration
if [ "$1" == "prod" ]; then
    BASE_URL="https://www.nextute.com"
    echo "🌐 Testing PRODUCTION: $BASE_URL"
else
    BASE_URL="http://localhost:8080"
    echo "💻 Testing LOCAL: $BASE_URL"
fi

echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Get Stats
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: GET /api/tech-hunt/stats"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/tech-hunt/stats")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Success (200)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${RED}❌ Failed ($HTTP_CODE)${NC}"
    echo "$BODY"
fi

echo ""
echo ""

# Test 2: Claim Reward (First Time)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: POST /api/tech-hunt/claim (New)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TIMESTAMP=$(date +%s)
TEST_DATA='{
  "name": "Test User '$TIMESTAMP'",
  "rollNumber": "TEST'$TIMESTAMP'",
  "teamName": "Test Team",
  "email": "test'$TIMESTAMP'@example.com",
  "phone": "+91 9876543210",
  "college": "Test College"
}'

echo "Request Body:"
echo "$TEST_DATA" | jq '.'
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$BASE_URL/api/tech-hunt/claim")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "201" ]; then
    echo -e "${GREEN}✅ Success (201 Created)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${RED}❌ Failed ($HTTP_CODE)${NC}"
    echo "$BODY" | jq '.'
fi

echo ""
echo ""

# Test 3: Claim Reward (Duplicate)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: POST /api/tech-hunt/claim (Duplicate)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Submitting same data again..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$BASE_URL/api/tech-hunt/claim")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "409" ]; then
    echo -e "${GREEN}✅ Correctly rejected duplicate (409 Conflict)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${YELLOW}⚠️  Unexpected response ($HTTP_CODE)${NC}"
    echo "$BODY" | jq '.'
fi

echo ""
echo ""

# Test 4: Validation Error (Missing Fields)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: POST /api/tech-hunt/claim (Invalid)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

INVALID_DATA='{
  "name": "Test User",
  "rollNumber": ""
}'

echo "Request Body (missing teamName):"
echo "$INVALID_DATA" | jq '.'
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$INVALID_DATA" \
  "$BASE_URL/api/tech-hunt/claim")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✅ Correctly rejected invalid data (400 Bad Request)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${YELLOW}⚠️  Unexpected response ($HTTP_CODE)${NC}"
    echo "$BODY" | jq '.'
fi

echo ""
echo ""

# Test 5: Get All Participants
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: GET /api/tech-hunt/participants"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/tech-hunt/participants")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Success (200)${NC}"
    COUNT=$(echo "$BODY" | jq '.count')
    echo "Total Participants: $COUNT"
    echo ""
    echo "Last 3 participants:"
    echo "$BODY" | jq '.data[:3]'
else
    echo -e "${RED}❌ Failed ($HTTP_CODE)${NC}"
    echo "$BODY"
fi

echo ""
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ All tests completed!"
echo ""
echo "Next steps:"
echo "  1. Visit the page: $BASE_URL/tech-hunt"
echo "  2. Test the UI manually"
echo "  3. Verify duplicate prevention"
echo "  4. Check mobile responsiveness"
echo ""
