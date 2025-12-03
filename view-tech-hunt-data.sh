#!/bin/bash

# View Tech Hunt Participant Data
# Run this on VPS to view data

echo "========================================="
echo "  TECH HUNT PARTICIPANT DATA"
echo "========================================="
echo ""

cd /root/Nextute-main/backend || exit

echo "📊 Statistics:"
echo "─────────────"
curl -s http://localhost:8080/api/tech-hunt/stats | jq '.'
echo ""

echo "👥 Recent Participants (Last 10):"
echo "──────────────────────────────────"
curl -s http://localhost:8080/api/tech-hunt/participants | jq '.data[:10]'
echo ""

echo "📈 Total Count:"
echo "───────────────"
curl -s http://localhost:8080/api/tech-hunt/participants | jq '.count'
echo ""

echo "========================================="
echo "  OPTIONS"
echo "========================================="
echo ""
echo "1. View all data:"
echo "   curl http://localhost:8080/api/tech-hunt/participants | jq '.'"
echo ""
echo "2. Export to file:"
echo "   curl http://localhost:8080/api/tech-hunt/participants > participants.json"
echo ""
echo "3. Open Prisma Studio:"
echo "   npx prisma studio"
echo ""
echo "4. Count by team:"
echo "   curl http://localhost:8080/api/tech-hunt/participants | jq '.data | group_by(.teamName) | map({team: .[0].teamName, count: length})'"
echo ""
