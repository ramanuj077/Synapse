# 🚀 PRODUCTION DEPLOYMENT - QUICK START

## ✅ Pre-Deployment Checklist

- [ ] API Key in `backend/.env` (OPENROUTER_API_KEY or GEMINI_API_KEY)
- [ ] Database configured (PostgreSQL recommended)
- [ ] JWT_SECRET changed from default
- [ ] NODE_ENV=production set
- [ ] Debug logs removed ✅ (just done)

---

## 🔥 FASTEST DEPLOYMENT (5 minutes)

### Option 1: Render (Free Tier)

**Step 1: Backend**
1. Push code to GitHub
2. Go to https://render.com
3. New → Web Service
4. Connect repo: `SYNAPSE`
5. Settings:
   - Name: `synapse-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables:
   ```
   OPENROUTER_API_KEY=your_key
   NODE_ENV=production
   DATABASE_URL=your_postgres_url
   JWT_SECRET=random_string_here
   ```
7. Deploy!

**Step 2: Frontend**
1. Render → New → Static Site
2. Connect same repo
3. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://synapse-backend.onrender.com
   ```
5. Deploy!

**Done!** Frontend URL: `https://synapse.onrender.com`

---

### Option 2: Vercel + Railway (Also Free)

**Frontend (Vercel):**
```bash
npm install -g vercel
vercel --prod
```
- Follow prompts
- Auto-detects Vite

**Backend (Railway):**
1. https://railway.app
2. New Project → Deploy from GitHub
3. Select `SYNAPSE` repo
4. Root directory: `backend`
5. Add environment variables
6. Deploy

---

## 🔧 Required Environment Variables

### Backend (`backend/.env`):
```env
NODE_ENV=production
PORT=5000

# AI (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Database (Recommended: Supabase/Neon free tier)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security (CHANGE THIS!)
JWT_SECRET=use-openssl-rand-base64-32-to-generate
JWT_EXPIRES_IN=24h
```

### Frontend (Optional `.env`):
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 📦 Build Verification

### Test Locally First:

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
# Should start on port 5000
```

**Frontend:**
```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module"
```bash
cd backend && npm install --production
```

### Issue: "CORS Error"
Update `backend/server.js`:
```javascript
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-frontend-url.com']
}));
```

### Issue: "Database connection failed"
- Check DATABASE_URL format
- Use Supabase/Neon free tier
- Or keep SQLite for demo

### Issue: "AI API not working"
- Verify API key starts with `sk-or-v1-`
- Check OpenRouter dashboard for credits
- Test: `curl -H "Authorization: Bearer YOUR_KEY" https://openrouter.ai/api/v1/models`

---

## 🎯 Production URLs

After deployment, you'll have:
- **Frontend**: `https://synapse-your-app.vercel.app`
- **Backend**: `https://synapse-backend.onrender.com`
- **API**: `https://synapse-backend.onrender.com/api/analyze`

---

## ⚡ If You're Deploying RIGHT NOW:

1. **GitHub Push:**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Render:**
   - Go to dashboard
   - Click "Deploy latest commit"
   - Wait 3-5 minutes

3. **Test:**
   - Open frontend URL
   - Try sample code
   - Check if AI refactoring works

**That's it!** 🚀

---

## 📞 Need Help?

Deploy failing? Check:
1. Build logs in Render/Vercel dashboard
2. Environment variables are set
3. `package.json` has `start` script
4. Port is `process.env.PORT || 5000`

**Your architecture is production-ready. Just deploy it!**
