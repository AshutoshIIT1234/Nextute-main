# 🐳 Docker Deployment Guide

## Quick Start

### 1. Setup Environment
```bash
copy .env.example .env
# Edit .env with your credentials
```

### 2. Start Services
```bash
docker-start.bat
```

### 3. Access
- Frontend: http://localhost
- Backend: http://localhost:8080

---

## Management Commands

```bash
docker-start.bat      # Start all services
docker-stop.bat       # Stop all services
docker-logs.bat       # View logs
docker-rebuild.bat    # Rebuild everything
```

---

## Services

### Frontend (Port 80)
- React + Vite + Nginx
- Auto-proxies API to backend
- Gzip compression enabled

### Backend (Port 8080)
- Node.js + Express
- Auto-runs migrations
- Health checks enabled

### Database (Port 5432)
- PostgreSQL 15
- Persistent data storage
- Auto-initialization

---

## Production Deployment

```bash
# Use production config
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Service
```bash
docker-compose restart backend
```

### Access Database
```bash
docker-compose exec postgres psql -U nextute -d nextute_db
```

### Clean Rebuild
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## Environment Variables

Required in `.env`:
- POSTGRES_PASSWORD
- JWT_SECRET
- EMAIL_USER / EMAIL_PASS
- RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
- GEMINI_API_KEY

---

## Backup Database

```bash
docker-compose exec postgres pg_dump -U nextute nextute_db > backup.sql
```

## Restore Database

```bash
docker-compose exec -T postgres psql -U nextute nextute_db < backup.sql
```

---

## Health Checks

```bash
# Backend
curl http://localhost:8080/api/health

# Frontend
curl http://localhost/

# All services
docker-compose ps
```

---

## Updates

```bash
git pull origin main
docker-rebuild.bat
```

---

## Complete!

Your Nextute website is now fully dockerized and ready to deploy anywhere! 🚀
