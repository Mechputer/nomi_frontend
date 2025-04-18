const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON
app.use(express.json());

// Proxy endpoint to handle API requests to Nomi API
app.get('/proxy/nomis', async (req, res) => {
    const apiKey = req.headers.authorization; // Expect the API key in the request headers
    try {
        const response = await fetch('https://api.nomi.ai/v1/nomis', {
            headers: { 'Authorization': apiKey }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data); // Forward the API response to the client
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch Nomis' });
    }
});

// Proxy endpoint for chat
app.post('/proxy/chat/:nomiUuid', async (req, res) => {
    const apiKey = req.headers.authorization; // API key in headers
    const nomiUuid = req.params.nomiUuid; // Extract Nomi UUID from route params
    const messageText = req.body.messageText; // Extract message text from request body

    try {
        const response = await fetch(`https://api.nomi.ai/v1/nomis/${nomiUuid}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messageText })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data); // Forward API response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Default route to serve "index.html"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

