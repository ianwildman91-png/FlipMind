export async function onRequestPost(context) {
  const GROQ_KEY = context.env.GROQ_KEY;
  if (!GROQ_KEY) {
    return new Response(JSON.stringify({ error: 'GROQ_KEY not configured' }), { status: 500 });
  }

  const { topic } = await context.request.json();

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a flashcard generator. Always respond with ONLY a valid JSON object with "question" and "answer" fields. No markdown, no backticks, no explanation.' },
        { role: 'user', content: `Generate one flashcard about ${topic}. JSON only: {"question":"...","answer":"..."}` }
      ],
      max_tokens: 300,
      temperature: 0.9
    })
  });

  const raw = await res.json();
  if (raw.error) {
    return new Response(JSON.stringify({ error: raw.error.message }), { status: 500 });
  }

  const text = raw.choices[0].message.content;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const card = JSON.parse(jsonMatch[0]);

  return new Response(JSON.stringify(card), {
    headers: { 'Content-Type': 'application/json' }
  });
}
