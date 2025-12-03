#!/bin/bash

# Post-Deployment Health Check Script
# Run this after each deployment to verify system health

echo "🏥 POST-DEPLOYMENT HEALTH CHECK"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="https://api.nextute.com"
FRONTEND_URL="https://www.nextute.com"
VPS_IP="72.60.218.219"

echo "📍 Target URLs:"
echo "   Backend: $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""

# 1. BASIC CONNECTIVITY
echo "1️⃣  BASIC CONNECTIVITY CHECKS"
echo "─────────────────────────────"

# Backend health
echo -n "   Backend /test endpoint: "
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/test" || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK (200)${NC}"
else
    echo -e "${RED}❌ FAILED (Status: $BACKEND_STATUS)${NC}"
fi

# Frontend health
echo -n "   Frontend homepage: "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK (200)${NC}"
else
    echo -e "${RED}❌ FAILED (Status: $FRONTEND_STATUS)${NC}"
fi

echo ""

# 2. HTTPS & SECURITY
echo "2️⃣  HTTPS & SECURITY CHECKS"
echo "─────────────────────────────"

# Check HTTPS redirect
echo -n "   HTTP → HTTPS redirect: "
HTTP_REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" -L "http://www.nextute.com" | head -n 1)
if [[ "$HTTP_REDIRECT" == "301" ]] || [[ "$HTTP_REDIRECT" == "308" ]]; then
    echo -e "${GREEN}✅ Redirecting${NC}"
else
    echo -e "${YELLOW}⚠️  Check redirect configuration${NC}"
fi

# Check SSL certificate
echo -n "   SSL certificate: "
SSL_CHECK=$(curl -s --head "$FRONTEND_URL" | grep -i "HTTP" | awk '{print $2}')
if [ "$SSL_CHECK" = "200" ]; then
    echo -e "${GREEN}✅ Valid${NC}"
else
    echo -e "${YELLOW}⚠️  Verify SSL setup${NC}"
fi

# Check security headers
echo -n "   Security headers: "
HEADERS=$(curl -s -I "$BACKEND_URL/test")
if echo "$HEADERS" | grep -qi "x-frame-options\|x-content-type-options"; then
    echo -e "${GREEN}✅ Present (Helmet active)${NC}"
else
    echo -e "${YELLOW}⚠️  Some headers missing${NC}"
fi

echo ""

# 3. API ENDPOINTS
echo "3️⃣  API ENDPOINT CHECKS"
echo "─────────────────────────────"

# Test public endpoints
endpoints=(
    "/test:Public health check"
    "/api/students/login:Student login (should reject without data)"
    "/api/institutes/login:Institute login (should reject without data)"
    "/api/mentorship/mentors:Mentors list"
    "/api/chat/message:Chatbot (should reject without data)"
)

for endpoint_info in "${endpoints[@]}"; do
    IFS=':' read -r endpoint description <<< "$endpoint_info"
    echo -n "   $endpoint: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$endpoint" || echo "000")
    
    # 400/401 are acceptable for protected endpoints
    if [[ "$STATUS" == "200" ]] || [[ "$STATUS" == "400" ]] || [[ "$STATUS" == "401" ]]; then
        echo -e "${GREEN}✅ Responding ($STATUS)${NC}"
    else
        echo -e "${RED}❌ Issue ($STATUS)${NC}"
    fi
done

echo ""

# 4. CORS CONFIGURATION
echo "4️⃣  CORS CONFIGURATION"
echo "─────────────────────────────"

echo -n "   CORS headers from frontend: "
CORS_CHECK=$(curl -s -H "Origin: https://www.nextute.com" -I "$BACKEND_URL/test" | grep -i "access-control-allow-origin")
if [ -n "$CORS_CHECK" ]; then
    echo -e "${GREEN}✅ Configured${NC}"
    echo "      $CORS_CHECK"
else
    echo -e "${RED}❌ Missing CORS headers${NC}"
fi

echo ""

# 5. AUTHENTICATION FLOW
echo "5️⃣  AUTHENTICATION CHECKS"
echo "─────────────────────────────"

# Test protected endpoint without auth
echo -n "   Protected endpoint (no auth): "
PROTECTED_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/students/profile" || echo "000")
if [ "$PROTECTED_STATUS" = "401" ]; then
    echo -e "${GREEN}✅ Properly protected (401)${NC}"
else
    echo -e "${YELLOW}⚠️  Unexpected status: $PROTECTED_STATUS${NC}"
fi

echo ""

# 6. DATABASE CONNECTIVITY
echo "6️⃣  DATABASE & DATA CHECKS"
echo "─────────────────────────────"

echo -n "   Mentors data endpoint: "
MENTORS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/mentorship/mentors" || echo "000")
if [ "$MENTORS_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Database connected${NC}"
    MENTOR_COUNT=$(curl -s "$BACKEND_URL/api/mentorship/mentors" | grep -o '"id"' | wc -l)
    echo "      Found $MENTOR_COUNT mentors"
else
    echo -e "${RED}❌ Database issue ($MENTORS_STATUS)${NC}"
fi

echo ""

# 7. RESPONSE TIME
echo "7️⃣  PERFORMANCE CHECKS"
echo "─────────────────────────────"

echo -n "   Backend response time: "
BACKEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BACKEND_URL/test")
echo "${BACKEND_TIME}s"
if (( $(echo "$BACKEND_TIME < 1.0" | bc -l) )); then
    echo -e "      ${GREEN}✅ Fast${NC}"
elif (( $(echo "$BACKEND_TIME < 3.0" | bc -l) )); then
    echo -e "      ${YELLOW}⚠️  Acceptable${NC}"
else
    echo -e "      ${RED}❌ Slow - investigate${NC}"
fi

echo -n "   Frontend response time: "
FRONTEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$FRONTEND_URL")
echo "${FRONTEND_TIME}s"
if (( $(echo "$FRONTEND_TIME < 2.0" | bc -l) )); then
    echo -e "      ${GREEN}✅ Fast${NC}"
elif (( $(echo "$FRONTEND_TIME < 5.0" | bc -l) )); then
    echo -e "      ${YELLOW}⚠️  Acceptable${NC}"
else
    echo -e "      ${RED}❌ Slow - investigate${NC}"
fi

echo ""

# 8. ERROR RATE CHECK
echo "8️⃣  ERROR MONITORING"
echo "─────────────────────────────"

echo "   Checking for recent errors in logs..."
if [ -f "backend/error.log" ]; then
    ERROR_COUNT=$(tail -n 100 backend/error.log 2>/dev/null | wc -l)
    echo "      Last 100 lines in error.log: $ERROR_COUNT entries"
    if [ "$ERROR_COUNT" -gt 50 ]; then
        echo -e "      ${RED}⚠️  High error rate - review logs${NC}"
    else
        echo -e "      ${GREEN}✅ Normal${NC}"
    fi
else
    echo -e "      ${YELLOW}⚠️  No error.log found${NC}"
fi

echo ""

# 9. ENVIRONMENT CONFIGURATION
echo "9️⃣  ENVIRONMENT CHECKS"
echo "─────────────────────────────"

# Check if debug routes are disabled in production
echo -n "   Debug routes disabled: "
DEBUG_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/debug/auth-status" || echo "000")
if [ "$DEBUG_STATUS" = "404" ]; then
    echo -e "${GREEN}✅ Not accessible (good)${NC}"
else
    echo -e "${RED}❌ DEBUG ROUTES EXPOSED! ($DEBUG_STATUS)${NC}"
fi

echo ""

# 10. SUMMARY
echo "🎯 HEALTH CHECK SUMMARY"
echo "─────────────────────────────"

ISSUES=0

if [ "$BACKEND_STATUS" != "200" ]; then ((ISSUES++)); fi
if [ "$FRONTEND_STATUS" != "200" ]; then ((ISSUES++)); fi
if [ "$DEBUG_STATUS" != "404" ]; then ((ISSUES++)); fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo "✨ System is healthy and ready for users"
else
    echo -e "${RED}❌ Found $ISSUES critical issue(s)${NC}"
    echo ""
    echo "⚠️  Review the issues above before allowing user traffic"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "   1. Review any warnings or errors above"
echo "   2. Check application logs: tail -f backend/combined.log"
echo "   3. Monitor error logs: tail -f backend/error.log"
echo "   4. Test user flows manually (signup, login, browse)"
echo "   5. Enable monitoring/alerting if not already active"
echo ""
echo "🔗 Quick Links:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend Health: $BACKEND_URL/test"
echo "   Mentors: $BACKEND_URL/api/mentorship/mentors"
echo ""
