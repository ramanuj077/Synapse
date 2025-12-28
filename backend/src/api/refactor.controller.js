const pipeline = require('../pipeline/refactor.pipeline');
const repository = require('../db/refactor.repository');

class RefactorController {
    async analyze(req, res) {
        try {
            const { code, preferences, refactorType, language } = req.body;

            if (!code) {
                return res.status(400).json({ error: "Code is required" });
            }

            // Determine language (detect if missing)
            let targetLang = language || 'javascript';
            if (!language) {
                if (code.includes('import React')) targetLang = 'react';
                else if (code.includes('public class')) targetLang = 'java';
                else if (code.includes('def ')) targetLang = 'python';
            }

            // RUN PIPELINE
            // Pass preferences as options if needed
            const result = await pipeline.run(code, targetLang, refactorType, preferences);

            // SAVE TO DB
            // Check if user is authenticated (req.user populated by auth middleware)
            await repository.save(result, req.user?.id);

            res.json(result);
        } catch (error) {
            console.error("Pipeline Error:", error);
            res.status(500).json({
                error: "Refactoring Pipeline Failed",
                details: error.message
            });
        }
    }
}

module.exports = new RefactorController();
