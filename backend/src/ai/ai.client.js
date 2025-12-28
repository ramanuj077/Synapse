const dotenv = require('dotenv');
// Ensure environment variables are loaded
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class AIClient {
    async call(prompt, model = 'google/gemini-2.0-flash-exp:free') {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('YOUR_')) {
            throw new Error('NO_API_KEY');
        }

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "You are an expert Senior code refactoring engine. Output ONLY valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.2, // Low temperature for deterministic code work
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            // Handle different provider response structures if needed, strictly compliant with OpenAI format for OpenRouter
            const content = data.choices[0]?.message?.content;
            if (!content) throw new Error("Empty response from AI Provider");

            return content;
        } catch (error) {
            console.error("AI Client Failure:", error);
            throw error;
        }
    }
}

module.exports = new AIClient();
