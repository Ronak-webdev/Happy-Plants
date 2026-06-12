const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages, temperature, max_tokens } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      model: 'gemini-1.5-flash',
      messages,
      temperature,
      max_tokens
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Netlify Function Error:', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.response ? error.response.data : error.message })
    };
  }
};
