const { RefactoringSession, User } = require('../../models');
const dbConfig = require('../../config/database');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite Fallback independently here
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const sqliteDb = new sqlite3.Database(dbPath);

// Ensure table exists for SQLite fallback
sqliteDb.run(`CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    snippet TEXT,
    smell TEXT,
    original_code TEXT,
    refactored_code TEXT,
    explanation TEXT
)`);

class RefactorRepository {
    async save(result, userId = null) {
        // 1. PostgreSQL (Preferred)
        try {
            if (userId && RefactoringSession) {
                await RefactoringSession.create({
                    user_id: userId,
                    inputCode: result.original_code,
                    refactoredCode: result.refactored_code,
                    smellDetected: result.smell_detected,
                    explanation: result.explanation,
                    metrics: result.metrics,
                    refactorType: result.refactorType || 'clean-code',
                    analysisType: result.analysis_type || 'single_file',
                    safetyStatus: result.safety_status
                });
                console.log("✅ Saved to PostgreSQL");
            }
        } catch (err) {
            console.error("❌ Postgres Save Failed (Repository):", err.message);
        }

        // 2. SQLite (Fallback / Anonymous History)
        // We always save to SQLite for the "Global Live Feed" feature (history endpoint)
        return new Promise((resolve, reject) => {
            sqliteDb.run(`INSERT INTO history (id, timestamp, snippet, smell, original_code, refactored_code, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    result.id,
                    result.timestamp,
                    result.original_code.substring(0, 50) + "...",
                    result.smell_detected,
                    result.original_code,
                    result.refactored_code,
                    result.explanation
                ],
                (err) => {
                    if (err) {
                        console.error("DB Save Failed:", err.message);
                        // Don't reject, just log, as this is non-critical
                    }
                    resolve();
                }
            );
        });
    }

    // Add explicit getHistory if needed, but for now specific endpoints might query models directly
    // Ideally user wants "Persistence layer"
}

module.exports = new RefactorRepository();
