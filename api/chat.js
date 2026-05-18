export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body || {};
    if (!body.model) body.model = 'claude-sonnet-4-5';
    if (!body.max_tokens) body.max_tokens = 1024;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.error) {
      console.error('Anthropic error:', data.error);
      return res.status(500).json({ error: data.error.message || 'Anthropic API error' });
    }
    if (data.content && data.content[0] && data.content[0].text) {
      let t = data.content[0].text;
      const obj = t.match(/\{[\s\S]*\}/);
      const arr = t.match(/\[[\s\S]*\]/);
      if (arr && (!obj || arr[0].length > obj[0].length)) t = arr[0];
      else if (obj) t = obj[0];
      data.content[0].text = t;
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('Function error:', err);
    return res.status(500).json({ error: err.message });
  }
}
