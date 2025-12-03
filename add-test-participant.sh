#!/bin/bash

# Add Test Participant - Ashutosh

echo "========================================"
echo "  ADDING TEST PARTICIPANT"
echo "========================================"
echo ""

echo "Name: Ashutosh"
echo "Roll No: 2312res192"
echo "Team: Akatsuki"
echo ""

echo "Submitting to API..."
echo ""

curl -X POST http://localhost:8080/api/tech-hunt/claim \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ashutosh",
    "rollNumber": "2312res192",
    "teamName": "Akatsuki"
  }'

echo ""
echo ""
echo "========================================"
echo "  DONE!"
echo "========================================"
echo ""
