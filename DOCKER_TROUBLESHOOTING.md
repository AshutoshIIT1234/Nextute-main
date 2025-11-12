# 🔧 Docker Troubleshooting - I/O Error Fix

## Issue
Getting "input/output error" when trying to pull/build Docker images.

## Cause
Docker Desktop storage corruption or disk space issues on Windows.

## Solutions

### Solution 1: Reset Docker Desktop (Recommended)
1. Open Docker Desktop
2. Go to Settings (gear icon)
3. Click "Troubleshoot" tab
4. Click "Clean / Purge data"
5. Click "Reset to factory defaults"
6. Restart Docker Desktop
7. Try again: `docker-compose up -d`

### Solution 2: Increase Docker Resources
1. Open Docker Desktop
2. Go to Settings → Resources
3. Increase:
   - CPUs: 4+
   - Memory: 8GB+
   - Disk image size: 64GB+
4. Apply & Restart
5. Try again

### Solution 3: Change Docker Storage Location
1. Close Docker Desktop
2. Open: `%APPDATA%\Docker\settings.json`
3. Add: `"dataFolder": "D:\\DockerData"`
4. Move existing data to new location
5. Restart Docker Desktop

### Solution 4: Run Without Docker (Quick Fix)
Since Docker is having issues, run directly:

```bash
# Terminal 1: Start Database (if you have PostgreSQL installed)
# Or use your existing Neon database

# Terminal 2: Start Backend
cd backend
npm install
npx prisma generate
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm install
npm run dev
```

Access at: http://localhost:5173

## Alternative: Use Your Existing Setup
Your website already works without Docker:
- Backend runs on port 8080
- Frontend runs on port 5173
- Database is on Neon (cloud)

Docker is optional - it just makes deployment easier!

## When Docker Works Again
```bash
cd Nextute-main
docker-compose up -d
```

## Check Docker Status
```bash
docker info
docker system df
```
