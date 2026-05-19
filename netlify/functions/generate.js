exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: 'HF_TOKEN not configured' }) };
  }

  const { topic } = JSON.parse(event.body);

  try {
    const res = await fetch('https://api-inference.huggingface.co/models/google/gemma-2-2b-it/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`
      },
      body: JSON.stringify({
        model: 'google/gemma-2-2b-it',
        messages: [
          { role: 'user', content: `Generate a flashcard about ${topic}. Respond with ONLY this JSON format, nothing else: {"question":"your question here","answer":"your answer here"}` }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await res.json();
    console.log('Response:', JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      console.log('Bad response:', JSON.stringify(data));
      return { statusCode: 500, body: JSON.stringify({ error: 'Model error', detail: data }) };
    }

    const text = data.choices[0].message.content;
    console.log('Text:', text);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No JSON found', text }) };
    }

    const card = JSON.parse(jsonMatch[0]);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    };
  } catch (e) {
    console.log('Catch error:', e.message);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
