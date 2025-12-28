# 🚀 SYNAPSE 3.0 - Enhancement Roadmap

## Current Status ✅
- ✅ Single file code refactoring working
- ✅ OpenRouter API integration (Gemini 2.0 Flash)
- ✅ Self-healing AI engine
- ✅ SQLite local database for history

---

## 🎯 Phase 1: GitHub Repository Analysis

### Feature: Complete Repository Refactoring
**Goal:** Allow users to paste a GitHub repository URL and analyze/refactor the entire codebase

#### Implementation Steps:

1. **GitHub API Integration**
   - Use GitHub REST API to fetch repository structure
   - Clone/download repository contents
   - Parse directory tree and identify all code files

2. **Multi-File Processing**
   - Create batch processing queue
   - Analyze files in parallel (with rate limiting)
   - Generate dependency graph
   - Identify cross-file code smells

3. **Repository Dashboard**
   - Show repository structure tree
   - Display analysis progress
   - Show metrics per file and overall
   - Generate comprehensive report

4. **Smart File Selection**
   - Auto-detect file types (JS, TS, Python, Java, etc.)
   - Ignore node_modules, build folders
   - Allow user to select specific files/folders

#### Technical Requirements:
```javascript
// New endpoints needed:
POST /api/analyze-repo
  - Input: GitHub URL
  - Output: Job ID

GET /api/repo-status/:jobId
  - Output: Progress, files analyzed, results

GET /api/repo-results/:jobId
  - Output: Full analysis results
```

---

## 🗄️ Phase 2: Database Migration (SQLite → MongoDB)

### Why MongoDB?
- ✅ **Scalability:** Handle millions of refactoring sessions
- ✅ **Cloud-Ready:** Easy deployment to MongoDB Atlas
- ✅ **Flexible Schema:** Store complex nested data (repo analysis)
- ✅ **User Authentication:** Better user session management
- ✅ **Analytics:** Query patterns, popular code smells, etc.

### Migration Plan:

1. **Setup MongoDB**
   ```bash
   npm install mongodb mongoose
   ```

2. **Schema Design**
   ```javascript
   // User Schema
   {
     _id: ObjectId,
     email: String,
     password: String (hashed),
     createdAt: Date,
     subscription: { type: String, enum: ['free', 'pro'] }
   }

   // Refactoring Session Schema
   {
     _id: ObjectId,
     userId: ObjectId,
     type: String, // 'single-file' | 'repository'
     timestamp: Date,
     inputCode: String,
     refactoredCode: String,
     smell_detected: String,
     metrics: Object,
     repoUrl: String (optional),
     files: Array (for repo analysis)
   }
   ```

3. **Migration Script**
   - Export existing SQLite data
   - Transform to MongoDB format
   - Import to MongoDB

4. **Environment Setup**
   ```env
   MONGODB_URI=mongodb://localhost:27017/synapse
   # Or for production:
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/synapse
   ```

---

## 🎨 Phase 3: UI/UX Overhaul + Authentication

### Design Inspiration: Refactoring.guru
**Key Elements:**
- Clean, educational design
- Card-based layouts
- Clear typography
- Intuitive navigation
- Code smell catalog
- Before/after comparisons

### New Pages & Components:

#### 1. **Landing Page** (Public)
- Hero section with value proposition
- Feature showcase
- Code smell examples
- Pricing tiers
- CTA: "Start Refactoring Free"

#### 2. **Authentication System**
- Sign Up / Sign In pages
- OAuth integration (Google, GitHub)
- JWT token-based auth
- Protected routes

#### 3. **Dashboard** (Authenticated)
```
┌─────────────────────────────────────────┐
│  SYNAPSE Dashboard                      │
├─────────────────────────────────────────┤
│  📊 Overview                            │
│    - Total refactorings: 47             │
│    - Code smells fixed: 128             │
│    - Lines optimized: 3,421             │
│                                         │
│  📁 Recent Projects                     │
│    [Card] GitHub Repo: myapp           │
│    [Card] Single File: utils.js        │
│                                         │
│  🎯 Quick Actions                       │
│    [Button] Analyze Repository          │
│    [Button] Refactor Code               │
│    [Button] View History                │
└─────────────────────────────────────────┘
```

#### 4. **Code Smell Catalog**
- Browse all detectable code smells
- Examples and explanations
- Refactoring techniques
- Interactive demos

#### 5. **Repository Analysis Page**
```
┌─────────────────────────────────────────┐
│  Repository: facebook/react             │
├─────────────────────────────────────────┤
│  📂 File Tree        │  📊 Metrics      │
│  ├─ src/            │  Complexity: 8.2  │
│  │  ├─ index.js ⚠️  │  Smells: 23       │
│  │  └─ utils.js ✅  │  Coverage: 87%    │
│  └─ tests/          │                   │
│                     │  [View Report]    │
└─────────────────────────────────────────┘
```

#### 6. **Settings & Profile**
- API key management
- Refactoring preferences
- Subscription management
- Usage statistics

### UI Component Library:
```
components/
├─ auth/
│  ├─ LoginForm.jsx
│  ├─ SignupForm.jsx
│  └─ ProtectedRoute.jsx
├─ dashboard/
│  ├─ DashboardHome.jsx
│  ├─ StatsCard.jsx
│  └─ RecentProjects.jsx
├─ repository/
│  ├─ RepoInput.jsx
│  ├─ FileTree.jsx
│  ├─ AnalysisProgress.jsx
│  └─ RepoReport.jsx
└─ catalog/
   ├─ SmellCard.jsx
   └─ TechniqueCard.jsx
```

---

## 🛠️ Technical Stack Updates

### Backend:
```json
{
  "new-dependencies": [
    "mongoose",           // MongoDB ODM
    "bcryptjs",          // Password hashing
    "jsonwebtoken",      // JWT auth
    "express-validator", // Input validation
    "octokit",          // GitHub API client
    "bull",             // Job queue for repo analysis
    "redis"             // Queue backend
  ]
}
```

### Frontend:
```json
{
  "new-dependencies": [
    "react-query",       // Data fetching
    "zustand",          // State management
    "react-hook-form",  // Form handling
    "zod",              // Validation
    "lucide-react",     // Icons
    "recharts",         // Analytics charts
    "react-syntax-highlighter" // Code display
  ]
}
```

---

## 📋 Implementation Priority

### Sprint 1 (Week 1-2): Authentication & Database
- [ ] Setup MongoDB (local + Atlas)
- [ ] Create user schema & auth endpoints
- [ ] Build Login/Signup UI
- [ ] Implement JWT authentication
- [ ] Migrate existing data

### Sprint 2 (Week 3-4): Dashboard & UI Overhaul
- [ ] Design new landing page
- [ ] Build dashboard layout
- [ ] Create stats cards & charts
- [ ] Implement protected routes
- [ ] Add user profile page

### Sprint 3 (Week 5-6): GitHub Repository Analysis
- [ ] GitHub API integration
- [ ] Multi-file processing engine
- [ ] Repository analysis UI
- [ ] File tree component
- [ ] Batch processing queue

### Sprint 4 (Week 7-8): Code Smell Catalog & Polish
- [ ] Build smell catalog pages
- [ ] Add interactive examples
- [ ] Refactoring technique guides
- [ ] Performance optimization
- [ ] Testing & bug fixes

---

## 🎨 Design System

### Color Palette (Inspired by Refactoring.guru)
```css
:root {
  /* Primary */
  --primary: #6366f1;      /* Indigo */
  --primary-dark: #4f46e5;
  
  /* Semantic */
  --success: #10b981;      /* Green - Clean code */
  --warning: #f59e0b;      /* Amber - Code smells */
  --danger: #ef4444;       /* Red - Critical issues */
  
  /* Neutrals */
  --bg-primary: #0a0a0f;
  --bg-secondary: #18181b;
  --text-primary: #ffffff;
  --text-muted: #a1a1aa;
  --border: #27272a;
}
```

### Typography
```css
/* Headings */
font-family: 'Inter', system-ui, sans-serif;

/* Code */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

---

## 🚀 Deployment Strategy

### Development
- Frontend: Vite dev server (localhost:5173)
- Backend: Node.js (localhost:5000)
- Database: MongoDB local (localhost:27017)

### Production
- Frontend: Vercel / Netlify
- Backend: Railway / Render
- Database: MongoDB Atlas
- CDN: Cloudflare

---

## 📊 Success Metrics

- **User Engagement:** Daily active users
- **Code Quality:** Average complexity reduction
- **Performance:** Analysis time per file
- **Satisfaction:** User feedback score

---

## 🔐 Security Considerations

1. **Authentication:**
   - Bcrypt password hashing (10 rounds)
   - JWT with 24h expiration
   - Refresh token rotation

2. **API Security:**
   - Rate limiting (100 req/15min)
   - Input validation & sanitization
   - CORS configuration
   - Helmet.js security headers

3. **Data Privacy:**
   - Encrypt sensitive data at rest
   - HTTPS only in production
   - User data deletion on request

---

**Next Steps:** Choose which phase to start with!
