export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const userMessage = req.body.message || "Hello";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(400).json({ error: 'Vercel cannot find the API key. Ensure it is saved in Environment Variables and you clicked Redeploy.' });
    }

    try {
        // gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ 
                        text: `You are an AI assistant for a software engineer named John David Romero. Answer the user's question briefly and professionally based on this info: John is a 19-year-old BSIT student at PUP, former top-performing customer service rep at Alorica, specializes in React, Python, C++, and database management. User's question: ${userMessage}` 
                    }]
                }]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'Failed to reach Google servers: ' + error.message });
    }
}