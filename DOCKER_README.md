# 🐳 Nextute - Docker Setup

## What's Included

✅ **Frontend** - React + Vite + Nginx  
✅ **Backend** - Node.js + Express  
✅ **Database** - PostgreSQL 15  
✅ **Auto-migrations** - Prisma  
✅ **Health checks** - All services  
✅ **Production ready** - Optimized builds  

---

## Prerequisites

Install Docker Desktop:
- Windows: https://www.docker.com/products/docker-desktop
- Mac: https://www.docker.com/products/docker-desktop
- Linux: `curl -fsSL https://get.docker.com | sh`

---

## Setup (3 Steps)

### 1. Configure Environment
```bash
copy .env.example .env
notepad .env
```

Add your credentials:
- Database password
- JWT secret
- Email credentials
- Razorpay keys
- Gemini API key

### 2. Start Docker
```bash
docker-start.bat
```

Wait 30 seconds for services to initialize.

### 3. Open Browser
```
http://localhost
```

Done! 🎉

---

## File Structure

```
Nextute-main/
├── Dockerfile.backend          # Backend container
├── Dockerfile.frontend         # Frontend container  
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production
├── nginx.conf                  # Web server config
├── .env.example               # Template
└── docker-*.bat               # Scripts
```

---

## Commands

```bash
docker-start.bat       # Start
docker-stop.bat        # Stop
docker-logs.bat        # Logs
docker-rebuild.bat     # Rebuild
```

---

## Ports

- **80** - Frontend (Nginx)
- **8080** - Backend API
- **5432** - PostgreSQL

---

## Production

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Benefits

✅ **Consistent** - Same environment everywhere  
✅ **Isolated** - No conflicts with other apps  
✅ **Portable** - Deploy anywhere  
✅ **Scalable** - Easy to scale services  
✅ **Fast** - Quick setup and deployment  

---

## Support

Check these files for help:
- `DOCKER_GUIDE.md` - Detailed guide
- `DOCKER_DEPLOYMENT.md` - Full documentation
- `.env.example` - Configuration template

---

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Nginx     │ :80
│  (Frontend) │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Node.js   │ :8080
│  (Backend)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ PostgreSQL  │ :5432
│ (Database)  │
└─────────────┘
```

---

## Quick Tips

### View Logs
```bash
docker-compose logs -f
```

### Check Status
```bash
docker-compose ps
```

### Restart Service
```bash
docker-compose restart backend
```

### Access Database
```bash
docker-compose exec postgres psql -U nextute -d nextute_db
```

### Clean Everything
```bash
docker-compose down -v
docker system prune -a
```

---

## Troubleshooting

**Port already in use?**
```bash
# Change port in docker-compose.yml
ports:
  - "8080:80"  # Change first number
```

**Database won't start?**
```bash
docker-compose logs postgres
docker-compose restart postgres
```

**Frontend not loading?**
```bash
docker-compose logs frontend
docker-compose build frontend --no-cache
```

---

## Next Steps

1. ✅ Setup complete
2. Test all features
3. Configure production .env
4. Deploy to server
5. Setup SSL certificates
6. Configure domain

---

**Your Nextute website is now containerized and ready to deploy! 🚀**
