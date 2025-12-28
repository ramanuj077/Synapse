# 🚀 SYNAPSE 3.0 - Setup Guide

## Prerequisites

### 1. Install PostgreSQL

**Windows:**
```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql

# Or use Scoop:
scoop install postgresql
```

**After Installation:**
1. PostgreSQL will run on `localhost:5432` by default
2. Default user: `postgres`
3. Set a password during installation (remember it!)

### 2. Install Redis (Optional - for job queues)

**Windows:**
```powershell
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use Chocolatey:
choco install redis-64

# Or use Docker:
docker run -d -p 6379:6379 redis:alpine
```

---

## Database Setup

### Option 1: Use PostgreSQL Locally

1. **Start PostgreSQL service:**
```powershell
# Check if running:
Get-Service postgresql*

# Start if not running:
Start-Service postgresql-x64-14  # Replace with your version
```

2. **Create database:**
```powershell
# Open psql command line:
psql -U postgres

# In psql:
CREATE DATABASE synapse_db;
\q
```

3. **Update `.env` file:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=synapse_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### Option 2: Use Cloud PostgreSQL (Recommended for Production)

**Neon.tech (Free Tier):**
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Update `.env`:
```env
DB_HOST=your-project.neon.tech
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_username
DB_PASSWORD=your_password
```

**Supabase (Free Tier):**
1. Go to https://supabase.com
2. Create project
3. Get database credentials from Settings > Database
4. Update `.env` accordingly

---

## Quick Start (Without PostgreSQL)

If you don't want to install PostgreSQL right now, the app will still work with **SQLite** (existing setup). The PostgreSQL integration is optional and can be enabled later.

To disable PostgreSQL temporarily:
1. Comment out the database lines in `server.js` (lines 83-97)
2. Keep using the existing SQLite database

---

## Installation Steps

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
# Copy example env file:
copy .env.example .env

# Edit .env and add your credentials
```

3. **Start the backend:**
```bash
node server.js
```

4. **Start the frontend:**
```bash
cd ..
npm run dev
```

---

## Testing Authentication

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get user profile (with token):
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Database Schema

### Users Table:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  subscription VARCHAR(50) DEFAULT 'free',
  api_key VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Refactoring Sessions Table:
```sql
CREATE TABLE refactoring_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'single-file',
  input_code TEXT NOT NULL,
  refactored_code TEXT,
  smell_detected VARCHAR(255),
  explanation TEXT,
  metrics JSONB,
  refactor_type VARCHAR(100),
  analysis_type VARCHAR(100),
  safety_status VARCHAR(100),
  repo_url VARCHAR(500),
  repo_data JSONB,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Troubleshooting

### PostgreSQL connection error:
```
❌ Unable to connect to PostgreSQL
```
**Solution:**
1. Check if PostgreSQL is running
2. Verify credentials in `.env`
3. Check firewall settings
4. Try connecting with `psql -U postgres`

### Port already in use:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```powershell
# Find process using port 5000:
netstat -ano | findstr :5000

# Kill the process:
taskkill /PID <process_id> /F
```

---

## Next Steps

1. ✅ Setup PostgreSQL
2. ✅ Test authentication endpoints
3. 🔄 Build login/signup UI
4. 🔄 Create dashboard
5. 🔄 Implement GitHub repo analysis

---

**Need help?** Check the logs in the terminal for detailed error messages.
