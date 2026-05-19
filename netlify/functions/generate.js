exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const OPENAI_KEY = process.env.OPENAI_KEY;
  if (!OPENAI_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_KEY not configured' }) };
  }

  const { topic } = JSON.parse(event.body);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a flashcard generator. Always respond with ONLY a valid JSON object with "question" and "answer" fields. No markdown, no backticks, no explanation.' },
          { role: 'user', content: `Generate one flashcard about ${topic}. JSON only: {"question":"...","answer":"..."}` }
        ],
        max_tokens: 300,
        temperature: 0.9
      })
    });

    const raw = await res.json();
    console.log('OpenAI raw:', JSON.stringify(raw));

    if (raw.error) {
      return { statusCode: 500, body: JSON.stringify({ error: raw.error.message }) };
    }

    const text = raw.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const card = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
