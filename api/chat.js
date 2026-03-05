// File: api/chat.js

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the user's message from the frontend
    const userMessage = req.body.message;
    
    // Securely pull the API key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    try {
        // Make the request to Google Gemini FROM THE SERVER
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ 
                        // The prompt instructions + the user's actual question
                        text: `You are an AI assistant for a software engineer named John David Romero. Answer the user's question briefly and professionally based on this info: John is a 19-year-old BSIT student at PUP, former top-performing customer service rep at Alorica, specializes in React, Python, C++, and database management. User's question: ${userMessage}` 
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Send the AI's response back to your frontend
        return res.status(200).json(data);

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: 'Failed to communicate with Gemini.' });
    }
}