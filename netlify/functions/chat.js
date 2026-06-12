const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages, temperature, max_tokens } = JSON.parse(event.body);
    const apiKey = process.env.OPENROUTER_API_KEY;

    const fallbackModels = [
        'google/gemini-2.0-flash-lite-preview-02-05:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen-2.5-vl-72b-instruct:free',
        'google/gemini-2.0-pro-exp-02-05:free'
    ];

    let lastError = null;

    for (const currentModel of fallbackModels) {
        try {
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: currentModel,
                messages,
                temperature,
                max_tokens
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://happy-plants-ai.netlify.app',
                    'X-Title': 'Happy Plants AI',
                    'Content-Type': 'application/json'
                }
            });
            return {
                statusCode: 200,
                body: JSON.stringify(response.data)
            };
        } catch (error) {
            console.warn(`Model ${currentModel} failed, trying next...`);
            lastError = error;
            continue;
        }
    }

    throw lastError;

  } catch (error) {
    console.error('Netlify Function Error:', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.response ? error.response.data : error.message })
    };
  }
};
