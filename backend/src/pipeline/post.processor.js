class PostProcessor {
    process(rawOutput) {
        let cleanOutput = rawOutput.trim();

        // Remove markdown code fence if present
        if (cleanOutput.startsWith('```json')) {
            cleanOutput = cleanOutput.replace(/^```json/, '').replace(/```$/, '');
        } else if (cleanOutput.startsWith('```')) {
            cleanOutput = cleanOutput.replace(/^```/, '').replace(/```$/, '');
        }

        try {
            const parsed = JSON.parse(cleanOutput);

            // Validate Schema
            if (!parsed.refactored_code) {
                // If AI hallucinates and returns partial objects, we define a fallback
                throw new Error("Missing refactored_code in AI response");
            }
            if (!parsed.explanation) {
                parsed.explanation = "Code refactored for better performance and readability.";
            }

            // Normalization
            parsed.timestamp = new Date().toISOString();

            return parsed;

        } catch (error) {
            console.error("JSON Parsing Error:", error);
            // Fallback: If JSON is broken, we return a failure object so the frontend doesn't crash
            return {
                refactored_code: "",
                explanation: "Failed to parse AI response. The model output was invalid JSON.",
                smell_detected: "AI Error",
                error: true,
                raw_output: rawOutput
            };
        }
    }
}

module.exports = new PostProcessor();
