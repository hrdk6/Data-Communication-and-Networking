// Vercel serverless function: Groq chat completions for the study assistant.
//
// - Picks models from a preference list, keeping only those the key can use right now
//   (GET /openai/v1/models, cached), so a retired model never breaks the assistant.
// - Falls back to the next model on rate limits (429), oversized requests (413), retired or
//   unknown models (400/404) and server errors (5xx). A rate-limited model rests until its
//   retry-after time passes.
// - A bad key stops at once with a clear message instead of trying every model.
// - Streams Server-Sent Events back to the page, starting with {meta, model}.

const API = 'https://api.groq.com/openai/v1';

// Strongest first. Only models the key can see are used; unknown ones are skipped.
const QUALITY = [
  'openai/gpt-oss-120b',
  'moonshotai/kimi-k2-instruct-0905',
  'moonshotai/kimi-k2-instruct',
  'llama-3.3-70b-versatile',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'qwen/qwen3-32b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant'
];
// Small, quick models for rewriting a follow-up question into a search query.
const FAST = [
  'llama-3.1-8b-instant',
  'openai/gpt-oss-20b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.3-70b-versatile'
];
// Never chat models.
const NOT_CHAT = /whisper|tts|playai|orpheus|guard|prompt-guard|compound|distil|embed|vision-preview/i;

// Extra parameters some model families accept, to keep their hidden reasoning short.
function extras(model) {
  if (/^openai\/gpt-oss/.test(model)) return { reasoning_effort: 'low' };
  if (/qwen3/.test(model)) return { reasoning_effort: 'none' };
  return {};
}

// Per-instance memory (survives while the function stays warm).
const cache = { models: null, at: 0, key: '' };
const resting = new Map(); // model -> time it may be used again
const retired = new Set();

async function available(key) {
  const now = Date.now();
  if (cache.models && cache.key === key && now - cache.at < 10 * 60 * 1000) return cache.models;
  try {
    const r = await fetch(API + '/models', { headers: { Authorization: 'Bearer ' + key } });
    if (r.status === 401 || r.status === 403) return { badKey: true };
    if (!r.ok) return null;
    const data = await r.json();
    const ids = (data.data || []).filter(m => m && m.id && m.active !== false).map(m => m.id);
    cache.models = ids; cache.at = now; cache.key = key;
    return ids;
  } catch (e) {
    return null; // unknown: fall back to the static list
  }
}

function chain(prefList, ids, preferred) {
  let list = prefList.slice();
  if (Array.isArray(ids)) {
    const have = new Set(ids);
    list = list.filter(m => have.has(m));
    // any other chat model the key has, as a last resort
    ids.filter(m => !list.includes(m) && !NOT_CHAT.test(m)).sort().forEach(m => list.push(m));
  }
  if (preferred && list.includes(preferred)) list = [preferred].concat(list.filter(m => m !== preferred));
  const now = Date.now();
  const ready = list.filter(m => !retired.has(m) && !(resting.get(m) > now));
  const waiting = list.filter(m => !retired.has(m) && resting.get(m) > now).sort((a, b) => resting.get(a) - resting.get(b));
  return ready.concat(waiting); // rested models last, soonest-ready first
}

function retryAfter(res, text) {
  const h = Number(res.headers.get('retry-after'));
  if (h > 0) return h * 1000;
  const m = /try again in ([\d.]+)(ms|s|m)/i.exec(text || '');
  if (m) return Number(m[1]) * (m[2] === 'ms' ? 1 : m[2] === 'm' ? 60000 : 1000);
  return 20000;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') { try { return Promise.resolve(JSON.parse(req.body)); } catch (e) { return Promise.resolve({}); } }
  return new Promise(resolve => {
    let s = '';
    req.on('data', c => { s += c; if (s.length > 400000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(s || '{}')); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  const key = String(process.env.GROQ_API_KEY || req.headers['x-groq-key'] || '').trim();

  if (req.method === 'GET') {
    if (!key) return res.status(200).json({ status: 'ok', hasKey: false });
    const ids = await available(key);
    if (ids && ids.badKey) return res.status(200).json({ status: 'bad_key', hasKey: true, badKey: true });
    const models = chain(QUALITY, ids);
    return res.status(200).json({ status: 'ok', hasKey: true, models, primary: models[0] || null });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!key) return res.status(401).json({ error: 'no_api_key', message: 'No Groq API key is set. Add GROQ_API_KEY in the Vercel project settings, then redeploy.' });

  const body = await readBody(req);
  const messages = Array.isArray(body.messages) ? body.messages.filter(m => m && typeof m.content === 'string' && ['system', 'user', 'assistant'].includes(m.role)) : [];
  if (!messages.length) return res.status(400).json({ error: 'bad_request', message: 'messages are required' });
  const size = messages.reduce((n, m) => n + m.content.length, 0);
  if (size > 120000) return res.status(413).json({ error: 'too_large', message: 'That question carried too much text. Ask about one topic at a time.' });

  const fast = body.task === 'rewrite';
  const stream = body.stream !== false && !fast;
  const maxTokens = Math.min(Number(body.max_tokens) || (fast ? 80 : 1800), 4000);
  const temperature = body.temperature != null ? Number(body.temperature) : (fast ? 0 : 0.2);

  const ids = await available(key);
  if (ids && ids.badKey) return res.status(401).json({ error: 'bad_key', message: 'Groq rejected the API key. Check GROQ_API_KEY in the Vercel project settings.' });
  const models = chain(fast ? FAST : QUALITY, ids, body.model);
  const tried = [];

  for (const model of models) {
    let extra = extras(model);
    for (let attempt = 0; attempt < 2; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      let r;
      try {
        r = await fetch(API + '/chat/completions', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ model, messages, temperature, stream, max_completion_tokens: maxTokens }, extra)),
          signal: ctrl.signal
        });
      } catch (e) {
        clearTimeout(timer);
        tried.push({ model, status: 'network', detail: String(e && e.message || e).slice(0, 120) });
        break;
      }
      clearTimeout(timer);

      if (r.ok) {
        if (!stream) {
          const data = await r.json();
          const msg = (data.choices && data.choices[0] && data.choices[0].message) || {};
          return res.status(200).json({ text: msg.content || '', model, usage: data.usage, tried });
        }
        res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Model-Used': model });
        res.write('data: ' + JSON.stringify({ meta: true, model, tried: tried.map(t => t.model) }) + '\n\n');
        const reader = r.body.getReader();
        const dec = new TextDecoder();
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(dec.decode(value, { stream: true }));
          }
        } catch (e) {
          res.write('data: ' + JSON.stringify({ error: 'stream_broken' }) + '\n\n');
        }
        return res.end();
      }

      const text = await r.text().catch(() => '');
      if (r.status === 401 || r.status === 403) {
        return res.status(401).json({ error: 'bad_key', message: 'Groq rejected the API key. Check GROQ_API_KEY in the Vercel project settings.' });
      }
      // a parameter this model does not take: retry once without extras
      if (r.status === 400 && attempt === 0 && Object.keys(extra).length && /reasoning|unsupported|not supported|property/i.test(text)) { extra = {}; continue; }
      if (r.status === 429) resting.set(model, Date.now() + retryAfter(r, text));
      if ((r.status === 400 || r.status === 404) && /decommission|deprecat|not exist|not found|model_not_found|does not exist/i.test(text)) retired.add(model);
      tried.push({ model, status: r.status, detail: text.slice(0, 160) });
      break; // next model
    }
  }

  const all429 = tried.length && tried.every(t => t.status === 429);
  const tooBig = tried.some(t => t.status === 413);
  return res.status(503).json({
    error: all429 ? 'rate_limited' : tooBig ? 'too_large' : 'all_failed',
    message: !models.length ? 'Groq has no chat models available for this key.'
      : all429 ? 'Every Groq model is rate-limited right now. Wait about a minute, then press Retry.'
        : tooBig ? 'The question and its notes were too long for the free Groq limits. Ask about one topic at a time.'
          : 'Groq could not answer (' + tried.map(t => t.model.split('/').pop() + ': ' + t.status).join(', ') + '). Press Retry.',
    tried
  });
};
