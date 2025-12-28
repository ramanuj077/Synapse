require('dotenv').config({ path: __dirname + '/.env' });

const testOpenRouter = async () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("API Key:", apiKey ? apiKey.substring(0, 15) + "..." : "MISSING");

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Synapse Test'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Say hello in JSON format: {"message": "your response"}'
                    }
                ]
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response:", text.substring(0, 500));

        if (response.ok) {
            const data = JSON.parse(text);
            console.log("\nMessage:", data.choices[0].message.content);
        }
    } catch (error) {
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);
    }
};

testOpenRouter();
