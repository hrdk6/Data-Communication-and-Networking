// Vercel Serverless Function for Groq LLM RAG Streaming with Multi-Model Fallback
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 1. Primary: Llama 3.3 70B (State-of-the-art open model, 128k context)
// 2. Backup 1: DeepSeek R1 Distill 70B (Extraordinary step-by-step reasoning)
// 3. Backup 2: Llama 3.1 8B Instant (Ultra-fast ~800 tokens/sec, very high rate limits)
// 4. Backup 3: Gemma 2 9B (Google's concise and robust model)
const MODELS = [
  'llama-3.3-70b-versatile',
  'deepseek-r1-distill-llama-70b',
  'llama-3.1-8b-instant',
  'gemma2-9b-it'
];

module.exports = async function handler(req, res) {
  // CORS & Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-groq-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = (process.env.GROQ_API_KEY || req.headers['x-groq-key'] || '').trim();

  // Health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      hasKey: !!apiKey,
      models: MODELS
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(401).json({
      error: 'no_api_key',
      message: 'GROQ_API_KEY is not configured in .env or Vercel Environment Variables.'
    });
  }

  const body = req.body || {};
  const messages = body.messages || [];
  const temperature = body.temperature != null ? body.temperature : 0.2;
  const wantStream = body.stream !== false;
  const preferredModel = body.model;

  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Order models starting with preferred model if provided, followed by fallback list
  const modelChain = [];
  if (preferredModel && MODELS.includes(preferredModel)) {
    modelChain.push(preferredModel);
  }
  MODELS.forEach(m => {
    if (!modelChain.includes(m)) modelChain.push(m);
  });

  let lastError = null;

  for (const model of modelChain) {
    try {
      const groqReqBody = {
        model,
        messages,
        temperature,
        stream: wantStream
      };

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groqReqBody)
      });

      if (response.status === 429 || response.status >= 500) {
        const errText = await response.text();
        console.warn(`[Groq] Model ${model} returned ${response.status} (Rate limit/busy). Falling back... Details: ${errText.slice(0, 200)}`);
        lastError = { status: response.status, model, details: errText };
        continue; // Try next model in chain
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API returned ${response.status}: ${errText}`);
      }

      // If non-streaming requested:
      if (!wantStream) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '';
        return res.status(200).json({
          text: content,
          model,
          usage: data?.usage
        });
      }

      // Streaming response
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'x-model-used': model
      });

      // Send initial metadata event with model used
      res.write(`data: ${JSON.stringify({ meta: true, model })}\n\n`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }

      return res.end();
    } catch (err) {
      console.warn(`[Groq] Exception with ${model}:`, err.message);
      lastError = { message: err.message, model };
    }
  }

  // If all models in the chain failed:
  return res.status(503).json({
    error: 'rate_limited_all_models',
    message: 'All Groq models are currently rate-limited or busy. Please try again shortly.',
    lastError
  });
};
