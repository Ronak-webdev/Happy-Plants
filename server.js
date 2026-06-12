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

// Proxy endpoint for OpenRouter with automatic fallback
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, temperature, top_p, max_tokens } = req.body;
        
        // List of best free OpenRouter models to try in order
        const fallbackModels = [
            'meta-llama/llama-3.3-70b-instruct:free',
            'nousresearch/hermes-3-llama-3.1-405b:free',
            'google/gemma-4-31b-it:free',
            'qwen/qwen3-coder:free'
        ];

        let lastError = null;

        for (const currentModel of fallbackModels) {
            try {
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: currentModel,
                    messages: messages,
                    temperature: temperature || 0.7,
                    top_p: top_p || 1,
                    max_tokens: max_tokens || 1000,
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'Infoplant'
                    }
                });
                
                // If successful, return immediately
                return res.json(response.data);
            } catch (error) {
                console.warn(`Model ${currentModel} failed, trying next...`);
                lastError = error;
                continue;
            }
        }

        // If all models fail
        throw lastError;

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
