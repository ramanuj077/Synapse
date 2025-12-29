# 🚀 Synapse - AI-Powered Code Refactoring Engine

<div align="center">

![Synapse Banner](https://img.shields.io/badge/Synapse-Code%20Intelligence-6366f1?style=for-the-badge&logo=react)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit%20Now-10b981?style=for-the-badge)](https://synapserefactor.vercel.app/)
[![Backend API](https://img.shields.io/badge/🔌_API-Running-6366f1?style=for-the-badge)](https://synapse-ns5r.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Transform messy code into production-ready masterpieces with  context-aware AI refactoring**

[Try Live Demo](https://synapserefactor.vercel.app/) • [API Docs](#api) • [Architecture](#architecture) • [Features](#features)

</div>

---

## 🎯 What is Synapse?

Synapse is an intelligent code refactoring engine that learns from your repository's patterns and coding style to provide **context-aware, production-safe refactoring suggestions**. Unlike generic AI tools, Synapse understands your codebase's unique DNA.

## ✨ Core Features

### 🧠 **Repository-Aware Intelligence**
- **Pattern Learning**: Analyzes your existing codebase to understand coding conventions
- **Style Enforcement**: Automatically matches indentation, naming, and structure
- **Context Understanding**: Adapts suggestions based on file type and project architecture

### 🔍 **Advanced Code Analysis**
- **40+ Rule-Based Detections**: Fast, deterministic smell detection
- **AI-Powered Deep Analysis**: Context-aware refactoring powered by OpenRouter/Gemini
- **Hybrid Approach**: Combines rule-based and AI analysis for maximum accuracy

### 🎨 **Production-Ready UX**
- **Code Health Score**: Visual before/after quality metrics (A-D grading)
- **Risk-Aware Refactoring**: Every change tagged with risk level (Low/Medium/High)
- **GitHub-Style Diffs**: Side-by-side comparison with syntax highlighting
- **One-Click Safe Apply**: Automatically filters and applies low-risk changes

### 📊 **Explainable AI**
- **Why It Changed**: Each refactor includes detailed explanations
- **Smell Identification**: Clear description of detected anti-patterns
- **Impact Metrics**: Shows complexity reduction, time savings, code lines saved

### 🔄 **Feedback-Driven Learning Loop**
- **User Feedback**: Thumbs up/down on suggestions
- **Pattern Memory**: Remembers rejected/accepted patterns
- **Adaptive Suggestions**: Continuously improves based on preferences

---

## 🚀 Live Demo

### Try it now: **[synapserefactor.vercel.app](https://synapserefactor.vercel.app)**

**Sample Workflow:**
1. **Paste code** or **GitHub URL**
2. **Select optimization mode** (Clean Code, Performance, Security, Readability)
3. **Choose language** (Auto-detect, JavaScript, React, Python, Java)
4. Click **"ANALYZE & REFACTOR"**
5. View **stunning results** with metrics & diff

---

## 🏆 Why Synapse Wins Hackathons

| Feature | Synapse | ChatGPT | SonarQube |
|---------|---------|---------|-----------|
| **Context-Aware** | ✅ Learns from your repo | ❌ Generic | ⚠️ Rule-based only |
| **Multi-Language** | ✅ JS, React, Python, Java | ✅ Yes | ⚠️ Limited |
| **Risk Assessment** | ✅ Low/Medium/High tags | ❌ No | ❌ No |
| **Explainability** | ✅ Detailed "why" | ⚠️ Sometimes | ❌ No |
| **GitHub Integration** | ✅ Direct repo analysis | ❌ No | ✅ Plugin |
| **Real-Time Diff** | ✅ Side-by-side | ❌ No | ⚠️ Separate UI |
| **Feedback Loop** | ✅ Learning from usage | ❌ No | ❌ No |

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** + **Vite** - Lightning-fast development
- **Monaco Editor** - Professional code editing
- **Lucide React** - Beautiful icons
- **Custom CSS** - Premium dark mode UI

### **Backend**
- **Node.js** + **Express** - Robust API server
- **Modular Pipeline** - Extensible architecture
- **OpenRouter/Gemini** - Multi-model AI support
- **PostgreSQL + SQLite** - Dual persistence strategy

### **Deployment**
- **Frontend**: Vercel (CDN, auto-deploy)
- **Backend**: Render (auto-scale, always-on)
- **Database**: Supabase (managed PostgreSQL)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Request                           │
│           (Code/URL + Language + Preferences)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Language Adapter Factory                     │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ JS/React │  Python  │   Java   │   Auto   │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Static Smell Analyzer (Fast)                    │
│    • 40+ Rule-Based Checks                                  │
│    • Language-Agnostic + Language-Specific                  │
│    • O(n) Complexity                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Prompt Builder                               │
│    • Dynamic JSON Schema                                    │
│    • Language Constraints                                   │
│    • Context Injection                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Client                                   │
│    • OpenRouter (multi-model)                               │
│    • Gemini (fast, free tier)                               │
│    • Fallback to Simulation Mode                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Post Processor & Validator                      │
│    • JSON Parsing                                           │
│    • Safety Validation                                      │
│    • Error Recovery                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Refactor Repository                          │
│    • SQLite (anonymous users)                               │
│    • PostgreSQL (authenticated users)                       │
│    • Dual Persistence                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Display                           │
│    • Code Health Score                                      │
│    • Metrics Dashboard                                      │
│    • Diff Viewer                                            │
│    • Feedback Loop                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### **Prerequisites:**
- Node.js 18+
- Git
- (Optional) PostgreSQL database

### **1. Clone Repository**
```bash
git clone https://github.com/ramanuj077/Synapse.git
cd Synapse
```

### **2. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### **3. Configure Environment**

Create `backend/.env`:
```env
# AI API (Choose one)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
# OR
GEMINI_API_KEY=xxxxx

# Database (Optional - SQLite used by default)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### **4. Run Development Servers**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev
```

### **5. Open Browser**
```
http://localhost:5173
```

---

## 🔌 API Usage

### **Analyze Code (Single File)**
```bash
POST /api/analyze
Content-Type: application/json

{
  "code": "function calculateTotal(items) { ... }",
  "language": "javascript",
  "refactorType": "clean-code"
}
```

**Response:**
```json
{
  "id": "1735123456789",
  "refactored_code": "const calculateTotal = (items) => { ... }",
  "smell_detected": "var usage detected (ES6+ uses const/let)",
  "explanation": "Refactored to modern ES6+ syntax...",
  "metrics": {
    "complexity_before": 5,
    "complexity_after": 2,
    "time_complexity_before": "O(n²)",
    "time_complexity_after": "O(n)",
    "risk_score": 2,
    "lines_saved": 3
  }
}
```

### **Analyze GitHub Repository**
```bash
POST /api/repo/analyze
Content-Type: application/json

{
  "repoUrl": "https://github.com/facebook/react"
}
```

---

## 🎯 Roadmap

### **Phase 1: Core Engine** ✅ **COMPLETE**
- [x] Modular pipeline architecture
- [x] Language adapters (JS, React, Python, Java)
- [x] Rule-based smell detection
- [x] AI integration (OpenRouter/Gemini)
- [x] Dual persistence (PostgreSQL + SQLite)

### **Phase 2: Production Features** ✅ **COMPLETE**
- [x] GitHub repository analysis
- [x] Interactive diff viewer
- [x] Code health scoring
- [x] Risk-aware refactoring
- [x] Feedback loop UI

### **Phase 3: Enterprise** 🚧 **IN PROGRESS**
- [ ] VS Code extension
- [ ] IntelliJ plugin
- [ ] Pre-commit hooks
- [ ] Team dashboards
- [ ] Custom rule definitions

### **Phase 4: Intelligence** 📅 **PLANNED**
- [ ] Natural language refactoring ("make this safer")
- [ ] Multi-file dependency analysis
- [ ] Performance benchmarking
- [ ] Auto-generated documentation

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🌟 Star History

If Synapse helps you write better code, give us a star! ⭐

---

<div align="center">

**Built with ❤️ for developers who care about code quality**

[⬆ Back to Top](#-synapse---ai-powered-code-refactoring-engine)

</div>
