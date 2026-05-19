exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: 'HF_TOKEN not configured' }) };
  }

  const { topic } = JSON.parse(event.body);
  const prompt = `You are a flashcard generator. Return ONLY a JSON object with "question" and "answer" fields. No markdown, no backticks, no extra text. Questions: 1-2 sentences. Answers: 2-4 sentences, clear and educational.\n\nGenerate one flashcard about ${topic}. JSON only: {"question":"...","answer":"..."}`;

  try {
    const res = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.9
      })
    });

    const data = await res.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    const card = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate card' })
    };
  }
};
