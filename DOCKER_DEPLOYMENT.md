# 🐳 Docker Deployment Guide

## Overview

Your Nextute website is now fully dockerized with:
- ✅ Frontend (React + Vite + Nginx)
- ✅ Backend (Node.js + Express)
- ✅ Database (PostgreSQL)
- ✅ Auto-migrations
- ✅ Health checks
- ✅ Production-ready

---

## 📋 Prerequisites

### Install Docker:
- **Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: `curl -fsSL https://get.docker.com | sh`
- **Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Verify Installation:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start (Development)

### Step 1: Setup Environment
```bash
# Copy example env file
copy .env.example .env

# Edit .env with your credentials
notepad .env
```

### Step 2: Start Services
```bash
# Windows
docker-start.bat

# Linux/Mac
docker-compose up -d
```

### Step 3: Access Application
- **Frontend**: http://localhost
- **Backend**: http://localhost:8080
- **Database**: localhost:5432

---

## 📁 Docker Files Structure

```
Nextute-main/
├── Dockerfile.backend          # Backend container
├── Dockerfile.frontend         # Frontend container
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── nginx.conf                  # Nginx configuration
├── .dockerignore              # Files to exclude
├── .env.example               # Environment template
└── docker-*.bat               # Management scripts
```

---

## 🔧 Management Commands

### Windows (Batch Scripts):
```bash
docker-start.bat      # Start all services
docker-stop.bat       # Stop all services
docker-logs.bat       # View logs
docker-rebuild.bat    # Rebuild from scratch
```

### Linux/Mac:
```bash
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f            # View logs
docker-compose build --no-cache   # Rebuild
docker-compose ps                 # Check status
docker-compose restart            # Restart services
```

---

## 🌐 Production Deployment

### Step 1: Update Environment
```bash
# Edit .env for production
POSTGRES_PASSWORD=strong_password_here
JWT_SECRET=your_32_char_secret
VITE_BACKEND_BASE_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Step 2: Deploy with Production Config
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Step 3: Setup SSL (Optional)
```bash
# Create ssl directory
mkdir ssl

# Add your SSL certificates
# ssl/cert.pem
# ssl/key.pem
```

---

## 📊 Service Details

### Frontend Container:
- **Image**: nginx:alpine
- **Port**: 80 (HTTP), 443 (HTTPS)
- **Build**: Multi-stage (Node build + Nginx serve)
- **Features**: Gzip, caching, API proxy

### Backend Container:
- **Image**: node:20-alpine
- **Port**: 8080
- **Features**: Auto-migrations, health checks
- **Volumes**: Uploads directory

### Database Container:
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: Persistent data storage
- **Features**: Health checks, auto-init

---

## 🔍 Monitoring & Debugging

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Check Status:
```bash
docker-compose ps
```

### Execute Commands in Container:
```bash
# Backend shell
docker-compose exec backend sh

# Database shell
docker-compose exec postgres psql -U nextute -d nextute_db

# Frontend shell
docker-compose exec frontend sh
```

### Health Checks:
```bash
# Backend health
curl http://localhost:8080/api/health

# Frontend health
curl http://localhost/

# Database health
docker-compose exec postgres pg_isready
```

---

## 🗄️ Database Management

### Access Database:
```bash
docker-compose exec postgres psql -U nextute -d nextute_db
```

### Run Migrations:
```bash
docker-compose exec backend npx prisma migrate deploy
```

### Seed Data:
```bash
docker-compose exec backend node prisma/seed-mentors.js
```

### Backup Database:
```bash
docker-compose exec postgres pg_dump -U nextute nextute_db > backup.sql
```

### Restore Database:
```bash
docker-compose exec -T postgres psql -U nextute nextute_db < backup.sql
```

---

## 🔄 Updates & Maintenance

### Update Code:
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Update Dependencies:
```bash
# Backend
docker-compose exec backend npm update

# Frontend (requires rebuild)
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Clean Up:
```bash
# Remove stopped containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

---

## 🐛 Troubleshooting

### Issue: Port already in use
**Solution:**
```bash
# Check what's using the port
netstat -ano | findstr :80
netstat -ano | findstr :8080

# Stop the process or change port in docker-compose.yml
```

### Issue: Database connection failed
**Solution:**
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Issue: Frontend not loading
**Solution:**
```bash
# Check nginx logs
docker-compose logs frontend

# Verify build completed
docker-compose exec frontend ls /usr/share/nginx/html

# Rebuild frontend
docker-compose build frontend --no-cache
```

### Issue: Backend crashes
**Solution:**
```bash
# View backend logs
docker-compose logs backend

# Check environment variables
docker-compose exec backend env

# Restart backend
docker-compose restart backend
```

---

## 📈 Performance Optimization

### Production Optimizations:
1. **Enable Gzip** (already configured in nginx.conf)
2. **Cache static assets** (already configured)
3. **Use CDN** for static files
4. **Enable HTTP/2** in nginx
5. **Add Redis** for caching (optional)

### Resource Limits:
Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## 🔐 Security Best Practices

### 1. Environment Variables:
- ✅ Never commit .env to git
- ✅ Use strong passwords
- ✅ Rotate secrets regularly

### 2. Network Security:
- ✅ Use internal networks
- ✅ Expose only necessary ports
- ✅ Enable SSL/TLS

### 3. Container Security:
- ✅ Use official base images
- ✅ Run as non-root user
- ✅ Keep images updated

### 4. Database Security:
- ✅ Strong passwords
- ✅ Regular backups
- ✅ Limit connections

---

## 📊 Monitoring Setup

### Add Monitoring (Optional):
```yaml
# Add to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push
        run: |
          docker-compose build
          docker-compose push
      
      - name: Deploy to server
        run: |
          ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

---

## 📝 Environment Variables Reference

### Required:
```env
POSTGRES_USER=nex