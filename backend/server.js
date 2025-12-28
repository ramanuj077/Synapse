const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load .env if available (local development)
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath, debug: false });
// Ignore errors in production (env vars set via platform dashboard)

const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const parser = require("@babel/parser");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialize SQLite Legacy Connection
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("SQLite Connection Error:", err.message);
    else console.log("✅ SQLite Connected (Legacy Dashboard)");
});



const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://synapserefactor.vercel.app'
    ],
    credentials: true
}));
app.use(bodyParser.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// ---------------------------------------------------------
// AUTH MIDDLEWARE HELPER
// ---------------------------------------------------------
let optionalAuth = (req, res, next) => next();
try {
    const authMiddleware = require('./middleware/auth');
    optionalAuth = authMiddleware.optionalAuth;
} catch (e) { /* ignore */ }

// ---------------------------------------------------------
// DATABASE SETUP (PostgreSQL - Optional)
// ---------------------------------------------------------
let User, RefactoringSession, sequelize;
let dbAvailable = false;

try {
    const dbConfig = require('./config/database');
    const models = require('./models');

    sequelize = dbConfig.sequelize;
    User = models.User;
    RefactoringSession = models.RefactoringSession;

    // Test connection
    dbConfig.testConnection().then(() => {
        dbAvailable = true;
        // Sync database models
        sequelize.sync()
            .then(() => console.log('✅ PostgreSQL: Database models synchronized'))
            .catch(err => console.error('❌ PostgreSQL sync error:', err));
    }).catch((err) => {
        // Silently fall back to SQLite for demo mode
        console.log('ℹ️  Running in SQLite mode (offline/demo ready)');
        dbAvailable = false;
    });

    // ---------------------------------------------------------
    // AUTHENTICATION ROUTES (Only if DB available)
    // ---------------------------------------------------------
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
} catch (error) {
    console.log('⚠️  PostgreSQL not configured - Authentication disabled (using SQLite for refactoring history)');
    dbAvailable = false;
}

// ---------------------------------------------------------
// REPOSITORY ROUTES (Phase 1)
// ---------------------------------------------------------
const repoRoutes = require('./routes/repo');
app.use('/api/repo', repoRoutes);

const refactorController = require('./src/api/refactor.controller');

// Use the new Controller
app.post('/api/analyze', optionalAuth, (req, res) => refactorController.analyze(req, res));






app.get('/api/dashboard/stats', optionalAuth, async (req, res) => {
    try {
        let stats = {
            totalAnalyses: 0,
            smellsFixed: 0,
            timeSaved: 0,
            recentProjects: []
        };

        // 1. PostgreSQL Strategy (Authenticated User)
        if (dbAvailable && req.user) {
            const { Op } = require('sequelize');

            const count = await RefactoringSession.count({ where: { user_id: req.user.id } });

            const smells = await RefactoringSession.count({
                where: {
                    user_id: req.user.id,
                    smellDetected: { [Op.not]: null }
                }
            });

            const recent = await RefactoringSession.findAll({
                where: { user_id: req.user.id },
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            stats.totalAnalyses = count;
            stats.smellsFixed = smells;
            stats.timeSaved = (count * 0.25).toFixed(1);

            stats.recentProjects = recent.map(r => ({
                id: r.id,
                type: r.repoUrl ? 'repo' : 'code',
                title: r.repoUrl ? r.repoUrl.split('/').pop() : 'Code Snippet',
                date: r.createdAt,
                status: 'Completed',
                smells: r.smellDetected ? 1 : 0
            }));
        }
        // 2. SQLite Strategy (Fallback / Anonymous)
        else {
            return new Promise((resolve, reject) => {
                db.all("SELECT * FROM history ORDER BY timestamp DESC LIMIT 5", [], (err, rows) => {
                    if (err) {
                        console.error("SQLite Stats Error", err);
                        // resolve with empty stats to avoid hanging
                        resolve(res.json(stats));
                    } else {
                        stats.totalAnalyses = rows.length;
                        stats.recentProjects = rows.map(r => ({
                            id: r.id,
                            type: 'code',
                            title: 'Anonymous Snippet',
                            date: r.timestamp,
                            status: 'Completed',
                            smells: r.smell ? 1 : 0
                        }));
                        resolve(res.json(stats));
                    }
                });
            });
        }

        res.json(stats);
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

app.get('/api/history', optionalAuth, async (req, res) => {
    // 1. Try PostgreSQL if user is logged in
    if (dbAvailable && req.user) {
        try {
            const sessions = await RefactoringSession.findAll({
                where: { user_id: req.user.id },
                order: [['createdAt', 'DESC']],
                limit: 50
            });

            // Map to match frontend expectations
            const history = sessions.map(s => ({
                id: s.id,
                timestamp: s.createdAt,
                snippet: s.inputCode.substring(0, 100) + '...',
                smell: s.smellDetected,
                original_code: s.inputCode,
                refactored_code: s.refactoredCode,
                explanation: s.explanation,
                metrics: s.metrics
            }));

            return res.json(history);
        } catch (error) {
            console.error("PostgreSQL History Fetch Error:", error);
            // Fallback to SQLite not ideal here as it mixes data, but let's just return error or empty
        }
    }

    // 2. Fallback to SQLite (Global History / Anonymous)
    db.all("SELECT * FROM history ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});


app.post('/api/set-key', (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey || apiKey.length < 10) return res.status(400).json({ error: "Invalid Key" });

    process.env.GEMINI_API_KEY = apiKey;
    console.log("🔑 API Key updated dynamically to:", apiKey.substring(0, 5) + "...");
    res.json({ success: true, message: "API Key Updated" });
});

app.listen(PORT, () => {
    console.log(`Synapse Backend (Gemini Powered) running on http://localhost:${PORT}`);
});
