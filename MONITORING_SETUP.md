# 📊 Production Monitoring & Observability Setup

## Overview

This guide helps you set up comprehensive monitoring for your production deployment.

## 🎯 Key Metrics to Monitor

### 1. Application Health
- **Uptime**: Is the service accessible?
- **Response Time**: How fast are requests?
- **Error Rate**: How many requests fail?
- **Throughput**: Requests per second

### 2. Infrastructure
- **CPU Usage**: Should stay <70%
- **Memory Usage**: Should stay <80%
- **Disk Space**: Alert at 80% full
- **Network I/O**: Monitor for spikes

### 3. Database
- **Connection Pool**: Active vs available
- **Query Performance**: Slow query log
- **Database Size**: Growth rate
- **Lock Contention**: Blocking queries

### 4. Business Metrics
- **User Signups**: Daily/weekly trends
- **Login Success Rate**: Should be >95%
- **Institute Registrations**: Track growth
- **Payment Success Rate**: Critical for revenue

## 🛠️ Recommended Tools

### Free/Low-Cost Options

#### 1. **UptimeRobot** (Free tier: 50 monitors)
**Purpose:** Basic uptime monitoring

**Setup:**
1. Sign up at uptimerobot.com
2. Add monitors:
   - `https://www.nextute.com` (every 5 min)
   - `https://api.nextute.com/test` (every 5 min)
3. Configure alerts (email/SMS)

**Monitors to create:**
```
Frontend: https://www.nextute.com
Backend Health: https://api.nextute.com/test
Mentors API: https://api.nextute.com/api/mentorship/mentors
```

#### 2. **Sentry** (Free tier: 5K errors/month)
**Purpose:** Error tracking and performance monitoring

**Setup:**
```bash
# Backend
npm install @sentry/node @sentry/profiling-node

# Frontend
npm install @sentry/react
```

**Backend Integration** (`backend/server.js`):
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
});

// Add after app creation
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Add before error handler
app.use(Sentry.Handlers.errorHandler());
```

**Frontend Integration** (`frontend/src/main.jsx`):
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
});
```

#### 3. **LogTail** (Free tier: 1GB/month)
**Purpose:** Centralized log management

**Setup:**
```bash
npm install @logtail/node @logtail/winston
```

**Integration:**
```javascript
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logtail = new Logtail("YOUR_LOGTAIL_TOKEN");

const logger = winston.createLogger({
  transports: [
    new LogtailTransport(logtail),
    // ... existing transports
  ],
});
```

#### 4. **Better Stack** (Free tier available)
**Purpose:** Uptime + incident management

**Features:**
- Status pages
- Incident management
- On-call scheduling
- Integrations (Slack, Discord, etc.)

### Enterprise Options (If Budget Allows)

#### 1. **Datadog**
- Full-stack observability
- APM (Application Performance Monitoring)
- Infrastructure monitoring
- Log management
- ~$15/host/month

#### 2. **New Relic**
- Application monitoring
- Infrastructure monitoring
- Browser monitoring
- Free tier available

#### 3. **Grafana Cloud**
- Metrics, logs, traces
- Free tier: 10K series, 50GB logs
- Great for custom dashboards

## 📈 Quick Monitoring Setup (No Code Changes)

### 1. Server-Side Monitoring Script

Create `monitor-health.sh`:
```bash
#!/bin/bash
# Run this via cron every 5 minutes

BACKEND_URL="https://api.nextute.com"
LOG_FILE="/var/log/nextute-health.log"

# Check backend
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/test")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BACKEND_URL/test")

# Log results
echo "$(date '+%Y-%m-%d %H:%M:%S') | Status: $STATUS | Response: ${RESPONSE_TIME}s" >> $LOG_FILE

# Alert if down
if [ "$STATUS" != "200" ]; then
    # Send alert (email, webhook, etc.)
    curl -X POST https://hooks.slack.com/YOUR_WEBHOOK \
         -H 'Content-Type: application/json' \
         -d "{\"text\":\"🚨 Backend is down! Status: $STATUS\"}"
fi
```

**Add to crontab:**
```bash
*/5 * * * * /path/to/monitor-health.sh
```

### 2. Database Monitoring

Create `monitor-db.sh`:
```bash
#!/bin/bash
# Monitor database connections and performance

# Check connection count (adjust for your DB)
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;" >> /var/log/db-connections.log

# Check slow queries
psql $DATABASE_URL -c "SELECT query, query_start FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 seconds';" >> /var/log/slow-queries.log
```

### 3. Disk Space Monitoring

```bash
#!/bin/bash
# Alert if disk usage > 80%

USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt 80 ]; then
    echo "⚠️ Disk usage at ${USAGE}%"
    # Send alert
fi
```

## 🔔 Alert Configuration

### Critical Alerts (Immediate Response)
- Backend down (>2 min)
- Database connection failures
- Error rate >5%
- Disk space >90%

### Warning Alerts (Review Within 1 Hour)
- Response time >3s
- Error rate >1%
- Memory usage >80%
- Disk space >80%

### Info Alerts (Daily Review)
- Unusual traffic patterns
- New error types
- Performance degradation

## 📊 Dashboard Setup

### Simple HTML Dashboard

Create `public/health-dashboard.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Nextute Health Dashboard</title>
    <meta http-equiv="refresh" content="30">
    <style>
        body { font-family: Arial; padding: 20px; }
        .metric { padding: 15px; margin: 10px; border-radius: 5px; }
        .healthy { background: #d4edda; }
        .warning { background: #fff3cd; }
        .critical { background: #f8d7da; }
    </style>
</head>
<body>
    <h1>🏥 Nextute Health Dashboard</h1>
    <div id="metrics"></div>
    
    <script>
        async function checkHealth() {
            const metrics = document.getElementById('metrics');
            
            // Backend check
            try {
                const start = Date.now();
                const res = await fetch('https://api.nextute.com/test');
                const time = Date.now() - start;
                
                const status = res.ok ? 'healthy' : 'critical';
                metrics.innerHTML += `
                    <div class="metric ${status}">
                        <h3>Backend API</h3>
                        <p>Status: ${res.status}</p>
                        <p>Response Time: ${time}ms</p>
                    </div>
                `;
            } catch (e) {
                metrics.innerHTML += `
                    <div class="metric critical">
                        <h3>Backend API</h3>
                        <p>Status: DOWN</p>
                        <p>Error: ${e.message}</p>
                    </div>
                `;
            }
        }
        
        checkHealth();
    </script>
</body>
</html>
```

## 🧪 Load Testing

### Using Apache Bench (ab)
```bash
# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 https://api.nextute.com/test

# With authentication
ab -n 100 -c 5 -H "Authorization: Bearer TOKEN" https://api.nextute.com/api/mentorship/mentors
```

### Using Artillery (More Advanced)
```bash
npm install -g artillery

# Create test-load.yml
artillery quick --count 10 --num 100 https://api.nextute.com/test
```

**Test Scenarios:**
```yaml
# load-test.yml
config:
  target: "https://api.nextute.com"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Sustained load"
    - duration: 60
      arrivalRate: 50
      name: "Spike test"

scenarios:
  - name: "Browse mentors"
    flow:
      - get:
          url: "/api/mentorship/mentors"
      - think: 2
      - get:
          url: "/api/mentorship/mentors/1"
```

Run: `artillery run load-test.yml`

## 📝 Log Analysis

### Useful Log Queries

**Find errors in last hour:**
```bash
tail -n 10000 backend/error.log | grep "$(date -d '1 hour ago' '+%Y-%m-%d %H')"
```

**Count errors by type:**
```bash
grep "error" backend/combined.log | awk '{print $5}' | sort | uniq -c | sort -rn
```

**Find slow requests (>2s):**
```bash
grep "time_total" backend/combined.log | awk '$NF > 2000'
```

## 🎯 Action Items

### Immediate (Today)
- [ ] Set up UptimeRobot monitors
- [ ] Run post-deployment-health-check.sh
- [ ] Test all critical user flows manually
- [ ] Document baseline metrics (response times, error rates)

### This Week
- [ ] Set up Sentry for error tracking
- [ ] Configure log rotation
- [ ] Create monitoring cron jobs
- [ ] Set up Slack/email alerts

### This Month
- [ ] Implement custom metrics dashboard
- [ ] Set up database monitoring
- [ ] Configure automated load testing
- [ ] Create runbooks for common issues

## 🚨 Incident Response Checklist

When alerts fire:

1. **Assess Severity**
   - Is the site down?
   - Are users affected?
   - Is data at risk?

2. **Immediate Actions**
   - Check server status
   - Review recent deployments
   - Check error logs
   - Verify database connectivity

3. **Communication**
   - Notify team
   - Update status page (if you have one)
   - Prepare user communication if needed

4. **Resolution**
   - Apply fix
   - Verify fix in production
   - Monitor for 30 minutes

5. **Post-Mortem**
   - Document what happened
   - Identify root cause
   - Implement preventive measures

## 📞 Support Contacts

**Critical Issues:**
- Database: Neon support
- Hosting: VPS provider support
- DNS: Domain registrar

**Escalation Path:**
1. On-call developer (immediate)
2. Tech lead (within 30 min)
3. CTO/Management (if user-facing outage >1 hour)

---

**Last Updated:** November 23, 2025  
**Next Review:** December 23, 2025
