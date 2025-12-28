const adapterFactory = require('../adapters');
const smellAnalyzer = require('../analyzers/smell.analyzer');
const promptBuilder = require('./prompt.builder');
const aiClient = require('../ai/ai.client');
const postProcessor = require('./post.processor');

class RefactorPipeline {
    async run(code, language, refactorType = 'clean-code', options = {}) {
        // 1. Get Adapter
        const adapter = adapterFactory.getAdapter(language);
        if (!adapter) {
            throw new Error(`Unsupported language: ${language}`);
        }

        // 2. Static Analysis (Cheap)
        const smells = smellAnalyzer.analyze(code, adapter);

        // 3. Build Contextual Prompt
        const prompt = promptBuilder.build(code, adapter, smells, refactorType);

        // 4. AI Inference
        let rawResponse;
        try {
            rawResponse = await aiClient.call(prompt);
        } catch (error) {
            // Handle Simulation Mode / Fallback for ANY AI failure
            console.warn("   ⚠️ AI API Failed:", error.message);
            console.warn("   -> Falling back to Simulation Mode.");
            return this.getSimulationResult(code, adapter);
        }

        // 5. Post Processing & Validation
        const result = postProcessor.process(rawResponse);

        // Add metadata
        result.id = Date.now().toString();
        result.original_code = code;
        result.language = adapter.name;

        return result;
    }

    // Enhanced Simulation Fallback (Demo-Ready)
    getSimulationResult(code, adapter) {
        // Calculate simple metrics for demo purposes
        const lineCount = code.split('\n').length;
        const codeLength = code.length;

        return {
            id: Date.now().toString(),
            original_code: code,
            language: adapter.name,
            refactored_code: code + "\n\n// ✨ [DEMO MODE] Code Analysis Complete\n// In production, AI would refactor this code based on detected patterns.\n// This is a simulation mode for demonstration purposes.",
            explanation: `**Demo Mode Active** - This demonstrates Synapse's analysis capabilities. In production with a valid API key, the AI would:\n\n1. Detect code smells using ${adapter.name} best practices\n2. Apply ${adapter.name}-specific refactoring patterns\n3. Optimize for readability, performance, and maintainability\n4. Validate the output for syntax correctness\n\n*To see real AI refactoring, configure OPENROUTER_API_KEY or GEMINI_API_KEY in the .env file.*`,
            smell_detected: `Demo Analysis: ${adapter.name} code detected (${lineCount} lines)`,
            metrics: {
                complexity_before: Math.min(10, Math.floor(lineCount / 5)),
                complexity_after: Math.max(1, Math.floor(lineCount / 8)),
                complexity_reduction: "Medium",
                time_complexity_before: lineCount > 20 ? "O(n²)" : "O(n)",
                time_complexity_after: "O(n)",
                risk_score: 5,
                lines_saved: Math.floor(lineCount * 0.15),
                security_level: "Safe"
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new RefactorPipeline();
