const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Proxy endpoint for OpenRouter
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model, temperature, top_p, max_tokens } = req.body;
        
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: model || 'google/gemini-2.0-flash-001',
            messages: messages,
            temperature: temperature || 0.7,
            top_p: top_p || 1,
            max_tokens: max_tokens || 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000', // Optional, for OpenRouter rankings
                'X-Title': 'Infoplant' // Optional
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error calling OpenRouter:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error?.message || 'Failed to connect to OpenRouter'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
