const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Try loading .env with debug
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath, debug: true });

if (result.error) {
    console.error("⚠️ dotenv error:", result.error);
}

console.log("🔍 DEBUG: dotenv parsed keys:", result.parsed);
console.log("🔍 DEBUG: process.env.GEMINI_API_KEY =", JSON.stringify(process.env.GEMINI_API_KEY));

// Fallback: If dotenv failed or returned empty, read manually
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
    try {
        const fs = require('fs');
        if (fs.existsSync(envPath)) {
            let content = fs.readFileSync(envPath, 'utf8');
            // Strip BOM
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            const lines = content.split(/\r?\n|\r/);

            console.log(`📂 Manual Parse: Read ${lines.length} lines.`);

            for (const line of lines) {
                const cleanLine = line.trim();
                // Skip empty or comments
                if (!cleanLine || cleanLine.startsWith('#')) continue;

                const eqIdx = cleanLine.indexOf('=');
                if (eqIdx > 0) {
                    const key = cleanLine.substring(0, eqIdx).trim();
                    let value = cleanLine.substring(eqIdx + 1).trim();

                    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                        value = value.replace(/^"|"$/g, '');
                    }

                    if (key === 'GEMINI_API_KEY') {
                        process.env[key] = value;
                        console.log(`✅ FORCE SET: GEMINI_API_KEY matched! (Len: ${value.length})`);
                    } else {
                        process.env[key] = value;
                    }
                } else {
                    console.log(`⚠️ Ignored (No =): [${cleanLine}]`);
                }
            }
            console.log("✅ Manual .env parsing completed.");
        }
    } catch (e) {
        console.error("❌ Manual .env parse failed:", e);
    }
}
const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
console.log("🔑 API Key Status:", apiKey ? "Loaded (" + apiKey.substring(0, 10) + "...)" : "❌ MISSING");
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const parser = require("@babel/parser");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();
const PORT = 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174']
}));
app.use(bodyParser.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// ---------------------------------------------------------
// 1. AI SETUP (OpenRouter API)
// ---------------------------------------------------------
const callOpenRouter = async (prompt) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            throw new Error('NO_API_KEY');
        }

        console.log("🤖 Calling OpenRouter API with key:", apiKey.substring(0, 10) + "...");
        console.log("📝 Prompt length:", prompt.length, "characters");

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Synapse 3.0'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free', // Free model via OpenRouter
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        console.log("📡 OpenRouter Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ OpenRouter Error Response:", errorText);
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ OpenRouter Response received, choices:", data.choices?.length);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("❌ Invalid response structure:", JSON.stringify(data).substring(0, 200));
            throw new Error("Invalid response structure from OpenRouter");
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("❌ callOpenRouter FATAL ERROR:", error.message);
        console.error("Stack:", error.stack);
        throw error;
    }
};

// ---------------------------------------------------------
// 2. DATABASE SETUP
// ---------------------------------------------------------
const db = new sqlite3.Database('./history.db', (err) => {
    if (err) console.error('DB Error:', err.message);
    else console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    snippet TEXT,
    smell TEXT,
    original_code TEXT,
    refactored_code TEXT,
    explanation TEXT
)`);

// ---------------------------------------------------------
// 3. CORE LOGIC
// ---------------------------------------------------------

const SYSTEM_PROMPT = `
You are Synapse 2.0, an Advanced Autonomous AI Engineering Architect.
Your mission is to radically transform legacy code into "State-of-the-Art" production-ready software.

ANALYSIS MODE:
1. DETECT Language and Framework (React, Node, Python, C++, Rust, etc.)
2. IDENTIFY Hidden Bugs, Memory Leaks, Race Conditions, and O(n^2)+ inefficiencies.
3. REFACTOR with "Aggressive Optimization":
   - Convert loops to vector/map/reduce operations.
   - Implement memoization/caching where logical.
   - Enforce strict typing (if TS/Python types).
   - Modernize syntax (e.g., var to const, callbacks to async/await).

OUTPUT SCHEMA (JSON ONLY):
{
  "explanation": "Expert-level engineering breakdown of changes.",
  "smell_detected": "The most critical anti-pattern found (e.g., 'Callback Hell', 'Global Mutation').",
  "refactored_code": "The complete, optimized code block.",
  "metrics": {
      "complexity_before": number (Cyclomatic),
      "complexity_after": number (Cyclomatic),
      "time_complexity_before": "Big O string",
      "time_complexity_after": "Big O string",
      "risk_score": number (0-100),
      "maintainability_rating": "S/A/B/C/F",
      "lines_saved": number
  }
}
`;

app.post('/api/analyze', async (req, res) => {
    const { code, preferences, refactorType = "clean-code" } = req.body;

    if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Invalid input' });

    console.log(`🚀 Synapse 3.0 Self-Healing Engine: ${refactorType}`);

    try {
        let sourceCode = code;

        // 1. GITHUB IMPORT SUPPORT
        if (code.startsWith('http')) {
            try {
                let fetchUrl = code;
                if (code.includes('github.com') && code.includes('/blob/')) {
                    fetchUrl = code.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                }
                const fetchRes = await fetch(fetchUrl);
                if (!fetchRes.ok) throw new Error("Failed to fetch remote code");
                sourceCode = await fetchRes.text();
            } catch (fetchError) {
                return res.status(400).json({ error: `GitHub Import Failed: ${fetchError.message}` });
            }
        }


        const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey === 'YOUR_OPENROUTER_KEY_HERE') {
            return res.json(getSimulationResult(sourceCode, preferences));
        }

        // --- SELF-HEALING LOOP ---
        const finalResult = await processWithSelfHealing(sourceCode, preferences, refactorType, 2);

        // Save to DB
        db.run(`INSERT INTO history (id, timestamp, snippet, smell, original_code, refactored_code, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [finalResult.id, finalResult.timestamp, sourceCode.substring(0, 50) + "...", finalResult.smell_detected, finalResult.original_code, finalResult.refactored_code, finalResult.explanation],
            (err) => { if (err) console.error("DB Save Failed:", err.message); }
        );

        res.json(finalResult);

    } catch (error) {
        console.error("🔥 Synapse 3.0 Error:", error);
        res.status(500).json({ error: "Synapse Core Failure: " + error.message });
    }
});

// A Recursive Correction Engine
async function processWithSelfHealing(code, preferences, refactorType, retriesLeft, previousError = null) {
    const isCorrection = retriesLeft < 2;
    console.log(isCorrection
        ? `🚑 Self-Healing Attempt (${2 - retriesLeft}/2): Fixing Syntax...`
        : `🧠 Initial Generation...`);

    const contextPrompt = isCorrection
        ? `\n[CRITICAL ERROR CORRECTION] 
           The previous code you generated failed validation.
           Syntax Error: "${previousError}"
           MISSION: Fix the syntax error while preserving the refactored logic. Return JSON only.`
        : `Refactor Focus: ${refactorType}`;

    // Sanitize strings to ensure valid UTF-8
    const sanitize = (str) => {
        if (!str) return '';
        // Remove any non-printable characters except newlines and tabs
        return str.replace(/[^\x20-\x7E\n\r\t]/g, '');
    };

    const sanitizedCode = sanitize(code);
    const sanitizedContext = sanitize(contextPrompt);

    const prompt = `
    ${SYSTEM_PROMPT}
    User Preferences: ${JSON.stringify(preferences)}
    
    ${sanitizedContext}
    
    [INPUT CODE]
    ${sanitizedCode}
    
    [INSTRUCTION]
    Output only valid JSON. No Markdown.
    `;


    let result;
    try {
        console.log("🤖 Calling OpenRouter API...");
        const text = await callOpenRouter(prompt);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let aiData;
        try {
            aiData = JSON.parse(jsonStr);
        } catch (e) {
            // If JSON itself is broken, we recurse if possible
            if (retriesLeft > 0) return processWithSelfHealing(code, preferences, refactorType, retriesLeft - 1, "Invalid JSON Response");
            throw new Error("AI returned invalid JSON structure.");
        }

        result = aiData;
    } catch (apiError) {
        if (apiError.message === 'NO_API_KEY') {
            throw apiError; // Let it bubble up to use simulation mode
        }
        console.error("❌ OpenRouter API Error:", {
            message: apiError.message,
            stack: apiError.stack
        });
        throw apiError;
    }

    // VALIDATION PHASE
    try {
        // Only validate strict structure if it looks like JS/TS
        if (aiData.refactored_code && (aiData.refactored_code.includes('function') || aiData.refactored_code.includes('const'))) {
            parser.parse(aiData.refactored_code, { sourceType: "module", plugins: ["jsx", "typescript"] });
        }

        // If we get here, it passed!
        return {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            original_code: code,
            analysis_type: isCorrection ? "Synapse 3.0 (Self-Healed)" : "Synapse 3.0 (First Pass)",
            safety_status: "verified_strict",
            metrics: { ...aiData.metrics, healing_attempts: 2 - retriesLeft },
            ...aiData
        };

    } catch (parseError) {
        console.warn(`⚠️ Validation Failed: ${parseError.message}`);

        if (retriesLeft > 0) {
            // RECURSIVE CALL with error context
            return processWithSelfHealing(code, preferences, refactorType, retriesLeft - 1, parseError.message);
        } else {
            // Give up and return what we have, marked as warning
            return {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                original_code: code,
                analysis_type: "Synapse 3.0 (Correction Failed)",
                safety_status: "syntax_warning",
                metrics: { ...aiData.metrics, healing_attempts: 2 },
                ...aiData
            };
        }
    }
}

// --- SIMULATION MODE (Offline Fallback) ---
function getSimulationResult(code, preferences) {
    // Advanced Regex Heuristics for Demo
    const isPython = code.includes('def ') || code.includes('print(');

    return {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        original_code: code,
        explanation: "Running in Simulation Mode (Add API Key for Real Intelligence). Optimizations applied based on static heuristics.",
        smell_detected: "Simulation/Demo Logic",
        refactored_code: isPython
            ? "# Synapse 2.0 Simulation\n" + code.replace(/print/g, '# print removed').replace(/for .*:/, '# vectorized operation')
            : "// Synapse 2.0 Simulation\n" + code.replace(/console\.log/g, '// console.log').replace(/var /g, 'const '),
        analysis_type: "simulation",
        metrics: {
            complexity_before: 5, complexity_after: 1,
            time_complexity_before: "O(n)", time_complexity_after: "O(1)",
            risk_score: 0,
            maintainability_rating: "B", lines_saved: 2
        }
    };
}


app.get('/api/history', (req, res) => {
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
