/* Signal to Socket — study assistant interface
   One conversation, shown in a drawer on every page and full width on #assistant. Answers stream
   from Claude with clickable source chips, or are assembled from the notes when Claude is not
   available. Every answer lists its sources, a grounding check and how it was found. */
(function () {
  'use strict';
  const DCN = window.DCN;
  if (!DCN || !DCN.rag) return;
  const R = DCN.rag, U = DCN.util, el = U.el, clean = R.util.clean;
  const KEY = 'dcn-assistant-v1';
  const MODES = [
    ['explain', 'Explain', 'A clear explanation in your notes’ terms'],
    ['exam', 'Exam answer', 'Sized to the marks, in the order examiners expect'],
    ['revise', 'Revise', 'Short bullet notes and formulas'],
    ['numerical', 'Numerical', 'Given, formula, substitution, answer'],
    ['quiz', 'Quiz me', 'Multiple-choice questions on a topic']
  ];
  const MODE_NAME = Object.fromEntries(MODES.map(m => [m[0], m[1]]));
  const TIERS = [['quick', 'Fast'], ['default', 'Standard'], ['complex', 'Thorough']];
  const SUGGEST = [
    { k: 'Exam answer · 10 marks', q: 'Explain TCP connection establishment, data transfer and termination', mode: 'exam', marks: 10 },
    { k: 'Explain', q: 'What is the difference between pure and slotted ALOHA?', mode: 'explain' },
    { k: 'Numerical', q: 'A telephone line has a bandwidth of 3.4 kHz. Find the Shannon capacity for SNR = 30 dB', mode: 'numerical' },
    { k: 'Explain', q: 'How does DNS resolve a name? Recursive vs iterative', mode: 'explain' },
    { k: 'Revise', q: 'Line coding: NRZ-L, NRZ-I, RZ and Manchester', mode: 'revise' },
    { k: 'Quiz me', q: 'Error detection: CRC and checksum', mode: 'quiz' }
  ];

  /* ------------------------------------------------------------ state */
  const saved = U.store.get(KEY, null) || {};
  const S = {
    msgs: Array.isArray(saved.msgs) ? saved.msgs.filter(m => m && m.id && m.role).slice(-40) : [],
    mode: MODE_NAME[saved.mode] ? saved.mode : 'explain',
    marks: [4, 6, 8, 10].includes(saved.marks) ? saved.marks : 6,
    scope: typeof saved.scope === 'string' ? saved.scope : 'all',
    deep: !!saved.deep,
    tier: TIERS.some(t => t[0] === saved.tier) ? saved.tier : 'default',
    busy: null
  };
  S.msgs.forEach(m => { if (m.pending) { m.pending = false; if (m.role === 'ai' && !m.text && !m.quiz) { m.error = 'upstream_error'; m.note = 'This answer did not finish. Press Retry.'; } } });
  function slim(m) {
    const o = Object.assign({}, m);
    delete o.pending;
    if (o.text && o.text.length > 14000) o.text = o.text.slice(0, 14000);
    return o;
  }
  function save() { U.store.set(KEY, { msgs: S.msgs.slice(-40).map(slim), mode: S.mode, marks: S.marks, scope: S.scope, deep: S.deep, tier: S.tier }); }
  let seq = 0;
  const uid = () => 'm' + Date.now().toString(36) + (seq++).toString(36);

  /* ------------------------------------------------------------ markdown (escaped first, then formatted) */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  const CITE = /\[(S\d{1,2}(?:\s*[,;]\s*S\d{1,2})*)\]/g;
  function citeHtml(l, ctx) {
    const x = ctx && ctx.byLabel && ctx.byLabel.get(l);
    if (!x) { if (ctx && ctx.stats) ctx.stats.bad++; return '<span class="cite bad" title="Not one of this answer’s sources">' + esc(l) + '?</span>'; }
    return '<a class="cite" href="#' + esc(x.anchor) + '" data-s="' + esc(l) + '" aria-label="Source ' + esc(l.slice(1)) + ': ' + esc(x.title) + '">' + esc(l.slice(1)) + '</a>';
  }
  function inline(src, ctx) {
    const codes = [];
    let s = String(src == null ? '' : src).replace(/`([^`\n]+)`/g, (m, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = esc(s);
    s = s.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^\w*])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*(?!\w)/g, '$1<em>$2</em>')
      .replace(/(^|[^\w])_([^_\n]+?)_(?!\w)/g, '$1<em>$2</em>')
      .replace(/\^\(([^()\n]{1,40})\)/g, '<sup>$1</sup>')
      .replace(/\^([−\-]?[0-9A-Za-z]{1,6})/g, '<sup>$1</sup>');
    s = s.replace(CITE, (m, inner) => inner.split(/\s*[,;]\s*/).map(l => citeHtml(l, ctx)).join(''));
    return s.replace(/\u0000(\d+)\u0000/g, (m, i) => '<code>' + esc(codes[+i]) + '</code>');
  }
  function labelsIn(raw) { const out = []; String(raw).replace(CITE, (m, inner) => { inner.split(/\s*[,;]\s*/).forEach(l => out.push(l)); return m; }); return out; }
  function claim(raw, html, ctx) {
    // grounding check: does this point cite a source, and does the cited text actually contain its words?
    if (!ctx || !ctx.check) return html;
    const plain = String(raw).replace(CITE, ' ').replace(/[*_`]/g, '');
    if ((plain.match(/[A-Za-z]{2,}/g) || []).length < 5 || /:\s*$/.test(plain.trim())) return html;
    ctx.stats.claims++;
    const labels = labelsIn(raw).filter(l => ctx.byLabel.has(l));
    if (!labels.length) return html;
    ctx.stats.cited++;
    const ct = new Set(R.util.tokens(plain));
    if (ct.size < 5) return html;
    const st = new Set();
    labels.forEach(l => { const t = ctx.text(l); if (t) R.util.tokens(t).forEach(x => st.add(x)); });
    if (!st.size) return html;
    let h = 0; ct.forEach(t => { if (st.has(t)) h++; });
    if (h / ct.size < 0.34) { ctx.stats.weak++; return '<span class="weak" title="Check this point: its wording is not clearly in the cited notes.">' + html + '</span>'; }
    return html;
  }
  function md(src, ctx) {
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    const out = [];
    let para = [], list = null, i = 0;
    const flushPara = () => { if (para.length) { const raw = para.join('\n'); out.push('<p>' + claim(raw, para.map(l => inline(l, ctx)).join('<br>'), ctx) + '</p>'); para = []; } };
    const itemHtml = it => claim(it.raw, inline(it.raw, ctx), ctx) + (it.sub.length ? '<ul>' + it.sub.map(x => '<li>' + claim(x, inline(x, ctx), ctx) + '</li>').join('') + '</ul>' : '');
    const flushList = () => { if (list) { out.push('<' + list.type + (list.type === 'ol' && list.start > 1 ? ' start="' + list.start + '"' : '') + '>' + list.items.map(it => '<li>' + itemHtml(it) + '</li>').join('') + '</' + list.type + '>'); list = null; } };
    const cells = l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    while (i < lines.length) {
      const line = lines[i];
      let m;
      if (/^\s*```/.test(line)) {
        flushPara(); flushList();
        const buf = []; i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push('<pre class="code">' + esc(buf.join('\n')) + '</pre>');
        continue;
      }
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        flushPara(); flushList();
        const head = cells(line), rows = [];
        i += 2;
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
        out.push('<div class="table-wrap"><table class="cmp"><thead><tr>' + head.map(h => '<th>' + inline(h, ctx) + '</th>').join('') + '</tr></thead><tbody>' +
          rows.map(r => '<tr>' + r.map((c, j) => j === 0 ? '<th>' + inline(c, ctx) + '</th>' : '<td>' + inline(c, ctx) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
        continue;
      }
      if ((m = line.match(/^\s*(#{1,6})\s+(.*)$/))) { flushPara(); flushList(); const h = m[1].length <= 3 ? 'h4' : 'h5'; out.push('<' + h + '>' + inline(m[2].replace(/\s*#+\s*$/, ''), ctx) + '</' + h + '>'); i++; continue; }
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flushPara(); flushList(); out.push('<hr>'); i++; continue; }
      if ((m = line.match(/^\s*>\s?(.*)$/))) { flushPara(); flushList(); out.push('<blockquote>' + inline(m[1], ctx) + '</blockquote>'); i++; continue; }
      if ((m = line.match(/^(\s*)([-*•]|\d{1,2}[.)])\s+(.*)$/))) {
        flushPara();
        const type = /\d/.test(m[2]) ? 'ol' : 'ul', indent = m[1].replace(/\t/g, '  ').length;
        if (indent >= 2 && list && list.items.length) { list.items[list.items.length - 1].sub.push(m[3]); i++; continue; }
        if (!list || list.type !== type) { flushList(); list = { type, items: [], start: type === 'ol' ? parseInt(m[2], 10) || 1 : 1 }; }
        list.items.push({ raw: m[3], sub: [] });
        i++; continue;
      }
      if (!line.trim()) { flushPara(); if (list && !(i + 1 < lines.length && /^\s*([-*•]|\d{1,2}[.)])\s+/.test(lines[i + 1]))) flushList(); i++; continue; }
      if (list && /^\s{2,}\S/.test(line)) { list.items[list.items.length - 1].raw += ' ' + line.trim(); i++; continue; }
      flushList();
      para.push(line.trim());
      i++;
    }
    flushPara(); flushList();
    return out.join('');
  }
  function splitFU(text) {
    const lines = String(text || '').split('\n');
    const re = /^\s*[*_]*\s*follow[- ]?ups?\s*[*_]*\s*:\s*[*_]*/i;
    let idx = -1;
    for (let i = lines.length - 1; i >= 0; i--) if (re.test(lines[i])) { idx = i; break; }
    if (idx < 0) {
      const last = lines[lines.length - 1].trim().toLowerCase().replace(/[*_]/g, '');
      if (last.length >= 3 && 'follow-ups:'.startsWith(last)) return { body: lines.slice(0, -1).join('\n').replace(/\s+$/, ''), fu: [] };
      return { body: text, fu: [] };
    }
    const rest = [lines[idx].replace(re, '')].concat(lines.slice(idx + 1)).join('\n');
    const fu = rest.split(/\s+\|\s+|\n+/).map(s => s.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(CITE, '').replace(/[*_`]/g, '').trim()).filter(s => s.length > 3).slice(0, 4);
    return { body: lines.slice(0, idx).join('\n').replace(/\s+$/, ''), fu };
  }

  /* ------------------------------------------------------------ sources */
  const LEAD = /^(Model answer:|Worked example\.|Practice:|Interactive lab:|Program code:?|Self-test:)\s*/;
  function srcView(x) {
    const c = x.c;
    return {
      label: x.label, id: c.id, anchor: c.anchor, ch: c.ch, layer: c.layer, type: c.type,
      title: R.util.trimWords(R.title(c), 16),
      where: R.where(c),
      snip: R.util.trimWords(c.text.replace(LEAD, '').replace(/\n/g, ' '), 48)
    };
  }
  function ctxFor(m, check) {
    const byLabel = new Map((m.sources || []).map(s => [s.label, s]));
    return {
      byLabel, check: !!check, stats: { claims: 0, cited: 0, weak: 0, bad: 0 },
      text: l => { const s = byLabel.get(l); if (!s) return ''; const c = R.stats ? R.chunk(s.id) : null; return c && c.anchor === s.anchor ? c.text : s.snip; }
    };
  }

  /* ------------------------------------------------------------ DOM */
  let ui = null, drawer = null, lastFocus = null, pendingOpen = false;
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M12 6.6l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="currentColor" stroke="none"/></svg>';
  function scopeOptions() {
    const o = [['all', 'All chapters'], ['A', 'Part A · Data communication'], ['B', 'Part B · Networking'], ['X', 'Toolkit pages']];
    DCN.ordered().forEach(c => { if (c.id === 'assistant' || c.id === 'quiz') return; o.push([c.id, c.part === 'X' ? (c.short || c.title) : 'Ch ' + c.num + ' · ' + (c.short || c.title)]); });
    return o;
  }
  function scopeName(sc) { const f = scopeOptions().find(o => o[0] === sc); return f ? f[1] : 'All chapters'; }
  function build() {
    const root = el('div', { class: 'ai', role: 'region', 'aria-label': 'Study assistant' });
    const pill = el('button', { type: 'button', class: 'ai-pill', id: 'ai-pill', 'data-s': 'checking', text: 'Connecting…', style: 'cursor:pointer; background:none; border:none; padding:0;' });
    pill.addEventListener('click', () => {
      const cur = localStorage.getItem('dcn-groq-key') || '';
      const entered = window.prompt('Enter your Groq API Key (starts with gsk_):\n\n(Leave blank to use GROQ_API_KEY from .env / Vercel)', cur);
      if (entered !== null) {
        if (entered.trim()) localStorage.setItem('dcn-groq-key', entered.trim());
        else localStorage.removeItem('dcn-groq-key');
        if (R.initLLM) R.initLLM();
      }
    });
    const head = el('header', { class: 'ai-head' }, [
      el('div', { class: 'ai-title' }, [el('span', { class: 'ai-mark', html: ICON }), el('div', {}, [el('b', { text: 'Study assistant' }), pill])]),
      el('div', { class: 'ai-head-btns' }, [
        el('button', { type: 'button', class: 'icon-btn sm', 'data-act': 'new', title: 'New conversation', 'aria-label': 'Start a new conversation', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span class="lbl-new">New</span>' }),
        el('a', { class: 'icon-btn sm', href: '#assistant', 'data-act': 'page', title: 'Open the assistant page', 'aria-label': 'Open the assistant page', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-8 8M10 5H5v14h14v-5"/></svg>' }),
        el('button', { type: 'button', class: 'icon-btn sm', 'data-act': 'close', 'aria-label': 'Close the assistant', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' })
      ])
    ]);
    const log = el('div', { class: 'ai-log', role: 'log', 'aria-label': 'Conversation' });
    const modes = el('div', { class: 'ai-modes', role: 'group', 'aria-label': 'Answer style' });
    MODES.forEach(m => {
      const b = el('button', { type: 'button', 'data-mode': m[0], 'aria-pressed': String(m[0] === S.mode), title: m[2], text: m[1] });
      b.addEventListener('click', () => setMode(m[0]));
      modes.appendChild(b);
    });
    const ta = el('textarea', { rows: '1', 'aria-label': 'Your question', placeholder: 'Ask about any topic in your syllabus…', spellcheck: 'true' });
    const send = el('button', { type: 'submit', class: 'btn ai-send', text: 'Ask' });
    const box = el('div', { class: 'ai-box' }, [ta, send]);
    const scope = el('select', { 'aria-label': 'Search in' });
    const marks = el('select', { 'aria-label': 'Marks' });
    [4, 6, 8, 10].forEach(n => marks.appendChild(el('option', { value: String(n), text: n + ' marks' })));
    marks.value = String(S.marks);
    const tier = el('select', { 'aria-label': 'Answer depth' });
    TIERS.forEach(t => tier.appendChild(el('option', { value: t[0], text: t[1] })));
    tier.value = S.tier;
    const deepIn = el('input', { type: 'checkbox' });
    deepIn.checked = S.deep;
    const deep = el('label', { class: 'ai-deep', title: 'Claude runs its own searches through your notes before answering. Slower; better for long or multi-part questions.' }, [deepIn, el('span', { text: 'Deep search' })]);
    const marksWrap = el('label', { class: 'ai-opt', hidden: S.mode !== 'exam' }, [marks]);
    const tierWrap = el('label', { class: 'ai-opt', hidden: true, title: 'How much effort Claude puts in' }, [el('span', { text: 'Depth' }), tier]);
    const row2 = el('div', { class: 'ai-row2' }, [el('label', { class: 'ai-opt' }, [el('span', { text: 'In' }), scope]), marksWrap, tierWrap, deep]);
    deep.hidden = true;
    const fine = el('p', { class: 'ai-fine' });
    const form = el('form', { class: 'ai-compose' }, [modes, box, row2, fine]);
    const live = el('div', { class: 'sr-only', 'aria-live': 'polite' });
    root.appendChild(head); root.appendChild(log); root.appendChild(form); root.appendChild(live);
    const u = { root, pill, log, modes, ta, send, scope, marks, marksWrap, tier, tierWrap, deep, deepIn, fine, live, form };
    fillScope(u);
    // events
    form.addEventListener('submit', e => { e.preventDefault(); if (S.busy) { stop(); return; } ask(ta.value); });
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (!S.busy) ask(ta.value); } });
    ta.addEventListener('input', () => grow(u));
    ta.addEventListener('focus', idleIndex, { once: true });
    scope.addEventListener('change', () => { S.scope = scope.value; save(); });
    marks.addEventListener('change', () => { S.marks = +marks.value; save(); });
    tier.addEventListener('change', () => { S.tier = tier.value; save(); });
    deepIn.addEventListener('change', () => { S.deep = deepIn.checked; save(); });
    head.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const a = b.getAttribute('data-act');
      if (a === 'close') closeDrawer();
      else if (a === 'new') { if (S.busy) stop(); S.msgs = []; save(); renderAll(); ta.focus(); }
      else if (a === 'page') closeDrawer(true);
    });
    log.addEventListener('click', onLogClick);
    log.addEventListener('mouseover', onPeek);
    log.addEventListener('mouseout', e => { if (e.target.closest && e.target.closest('.cite')) hidePeek(); });
    log.addEventListener('focusin', onPeek);
    log.addEventListener('focusout', hidePeek);
    log.addEventListener('scroll', hidePeek, { passive: true });
    return u;
  }
  function fillScope(u) {
    u.scope.innerHTML = '';
    scopeOptions().forEach(o => u.scope.appendChild(el('option', { value: o[0], text: o[1] })));
    u.scope.value = scopeOptions().some(o => o[0] === S.scope) ? S.scope : 'all';
  }
  function grow(u) { u.ta.style.height = 'auto'; u.ta.style.height = Math.min(168, u.ta.scrollHeight) + 'px'; }
  function setMode(m) {
    S.mode = m; save();
    if (!ui) return;
    ui.modes.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === m)));
    ui.marksWrap.hidden = m !== 'exam';
    ui.ta.placeholder = m === 'quiz' ? 'Which topic should the quiz cover?' : m === 'numerical' ? 'Paste the numerical, with its values…' : m === 'exam' ? 'Paste the exam question…' : 'Ask about any topic in your syllabus…';
  }
  function ensureUI() {
    if (ui) return ui;
    ui = build();
    drawer = el('aside', { class: 'ai-drawer', id: 'ai-drawer', 'aria-label': 'Study assistant', tabindex: '-1' });
    drawer.appendChild(ui.root);
    document.body.appendChild(drawer);
    setMode(S.mode);
    statusUI();
    renderAll();
    return ui;
  }

  /* ------------------------------------------------------------ status */
  function statusUI() {
    if (!ui) return;
    const g = R.groq, c = R.claude;
    if (g && g.state === 'ready') {
      ui.pill.setAttribute('data-s', 'ready');
      ui.pill.textContent = (g.modelName || 'Groq') + ' · Groq';
      const backups = (g.models || []).slice(1, 4).map(R.prettyModel);
      ui.pill.title = 'Answers are written by ' + (g.modelName || 'Groq') + (backups.length ? ', with ' + backups.join(', ') + ' as backups when it is busy' : '') + '. Click to use your own Groq key.';
      ui.tierWrap.hidden = true;
      ui.deep.hidden = true;
      ui.fine.innerHTML = 'Answers come only from this guide\u2019s passages, with a source for every point. If a model is busy or rate-limited, the next one takes over automatically.';
      return;
    }
    if (g && g.state === 'checking' && c.state === 'checking') {
      ui.pill.setAttribute('data-s', 'checking'); ui.pill.textContent = 'Connecting…'; ui.fine.textContent = 'Answers use only this guide.';
      return;
    }
    if (g && g.state === 'bad_key' && !(c && c.state === 'ready')) {
      ui.pill.setAttribute('data-s', 'offline'); ui.pill.textContent = 'Groq key rejected';
      ui.pill.title = g.reason || 'Groq rejected the API key. Click to enter another key.';
      ui.tierWrap.hidden = true; ui.deep.hidden = true;
      ui.fine.innerHTML = '<b>Notes mode</b>: Groq rejected the API key, so answers are quoted from your notes. Fix <code>GROQ_API_KEY</code> in Vercel, or click the badge to use your own key.';
      return;
    }
    if (c && c.state === 'ready') {
      ui.pill.setAttribute('data-s', 'ready');
      ui.pill.textContent = 'Claude · from your notes';
      ui.pill.title = 'Claude writes each answer using only passages from this guide, and cites them.';
      ui.tierWrap.hidden = false;
      if (c.tiers) Array.from(ui.tier.options).forEach(o => { o.disabled = !c.tiers.includes(o.value); });
      ui.deep.hidden = !c.tools;
      ui.fine.innerHTML = 'Claude answers only from this guide’s passages and cites each point.';
      return;
    }
    ui.pill.setAttribute('data-s', 'offline');
    ui.pill.textContent = 'Notes mode';
    ui.pill.title = 'Notes mode. Click here to enter your Groq API key (starts with gsk_).';
    ui.tierWrap.hidden = true;
    ui.deep.hidden = true;
    ui.fine.innerHTML = '<b>Notes mode</b>: Answers are quoted from notes. Click <b>Notes mode</b> above to enter your Groq API key, or add <code>GROQ_API_KEY</code> in <code>.env</code>.';
  }
  document.addEventListener('dcn:assistant-status', statusUI);
  function waitReady(ms) {
    const settled = () => R.groq.state !== 'checking' && (R.groq.state === 'ready' || R.claude.state !== 'checking');
    if (settled()) return Promise.resolve();
    return new Promise(res => {
      const t = setTimeout(done, ms);
      function check() { if (settled()) done(); }
      function done() { clearTimeout(t); document.removeEventListener('dcn:assistant-status', check); res(); }
      document.addEventListener('dcn:assistant-status', check);
    });
  }
  function idle(fn) { (window.requestIdleCallback || (f => setTimeout(f, 300)))(fn, { timeout: 1500 }); }
  function idleIndex() { if (!R.stats) idle(() => { try { R.ensure(); } catch (e) { if (window.console) console.error(e); } }); }

  /* ------------------------------------------------------------ rendering */
  function renderAll() {
    if (!ui) return;
    hidePeek();
    ui.root.classList.toggle('has-msgs', S.msgs.length > 0);
    ui.log.innerHTML = '';
    if (!S.msgs.length) { ui.log.appendChild(emptyState()); return; }
    S.msgs.forEach(m => ui.log.appendChild(m.role === 'user' ? userNode(m) : aiNode(m)));
    requestAnimationFrame(() => { ui.log.scrollTop = ui.log.scrollHeight; });
  }
  function emptyState() {
    const ch = DCN.byId(DCN.currentChapter && DCN.currentChapter());
    const wrap = el('div', { class: 'ai-empty' });
    wrap.appendChild(el('h3', { text: 'Ask your notes anything' }));
    wrap.appendChild(el('p', { class: 'muted', html: 'The assistant searches all 13 chapters, every model answer, worked example and lab in this guide, then answers from those passages only. Each point links to its source, so you can check it and read more.' }));
    const sugs = el('div', { class: 'ai-sugs' });
    const list = SUGGEST.slice();
    if (ch && ch.part !== 'X') {
      list.unshift({ k: 'Quiz me · Ch ' + ch.num, q: ch.short || ch.title, mode: 'quiz', scope: ch.id });
      list.unshift({ k: 'Revise · Ch ' + ch.num, q: 'Quick revision of ' + (ch.short || ch.title), mode: 'revise', scope: ch.id });
    }
    list.slice(0, 6).forEach(s => {
      const b = el('button', { type: 'button', class: 'ai-sug' }, [el('span', { class: 'k', text: s.k }), el('span', { class: 'q', text: s.q })]);
      b.addEventListener('click', () => { if (s.marks) { S.marks = s.marks; ui.marks.value = String(s.marks); } setMode(s.mode); ask(s.q, { scope: s.scope }); });
      sugs.appendChild(b);
    });
    wrap.appendChild(sugs);
    return wrap;
  }
  function metaText(m) {
    const p = [MODE_NAME[m.mode] || 'Explain'];
    if (m.mode === 'exam') p.push(m.marks + ' marks');
    if (m.scope && m.scope !== 'all') p.push(scopeName(m.scope));
    return p.join(' · ');
  }
  function userNode(m) {
    return el('div', { class: 'ai-msg user', 'data-id': m.id }, [el('div', { class: 'bubble', text: m.q }), el('div', { class: 'meta', text: metaText(m) })]);
  }
  function aiNode(m) {
    const n = el('article', { class: 'ai-msg bot', 'data-id': m.id });
    n.__eye = el('div', { class: 'ai-eyebrow' });
    n.__status = el('div', { class: 'ai-status', hidden: true });
    n.__body = el('div', { class: 'md ai-body' });
    n.__extra = el('div', { class: 'ai-extra' });
    n.appendChild(n.__eye); n.appendChild(n.__status); n.appendChild(n.__body); n.appendChild(n.__extra);
    paint(n, m, !m.pending);
    return n;
  }
  function nodeFor(m) { return ui && ui.log.querySelector('[data-id="' + m.id + '"]'); }
  function eyebrow(m) {
    if (m.pending) return '<span class="ai-via">' + (m.mode === 'quiz' ? 'Writing your quiz' : 'Working') + '</span>';
    const n = (m.sources || []).length;
    if (m.error && !m.text) return '<span class="ai-via err">Could not answer</span>';
    if (m.via === 'chat') return '<span class="ai-via">Study assistant</span>';
    if (m.quiz) return '<span class="ai-via' + (m.via === 'notes' ? ' notes' : '') + '">Quiz · ' + m.quiz.questions.length + ' questions</span><span>' + (m.via === 'notes' ? 'from your self-tests' : 'by ' + esc(m.via === 'groq' ? (m.model || 'Groq') : 'Claude') + ' from ' + n + ' passages') + '</span>';
    if (m.via === 'groq') return '<span class="ai-via">' + esc(m.model || 'Groq') + '</span><span>' + n + ' passages · via Groq</span>';
    if (m.via === 'notes') return '<span class="ai-via notes">From your notes</span><span>' + n + ' passages · notes mode</span>';
    const tn = (TIERS.find(t => t[0] === (m.tier || 'default')) || TIERS[1])[1];
    return '<span class="ai-via">Claude</span><span>' + n + ' passages · ' + esc(tn) + (m.deep ? ' · deep search' : '') + '</span>';
  }
  function paint(n, m, final) {
    n.className = 'ai-msg bot' + (m.pending ? ' pending' : '') + (m.error ? ' err' : '');
    n.__eye.innerHTML = eyebrow(m);
    if (m.pending && m.status) { n.__status.hidden = false; n.__status.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>' + esc(m.status); }
    else n.__status.hidden = true;
    const ctx = ctxFor(m, final && (m.via === 'claude' || m.via === 'groq') && !m.quiz && !!R.stats);
    if (m.quiz) { n.__body.innerHTML = ''; n.__body.appendChild(quizNode(m, ctx)); }
    else {
      const sp = splitFU(m.text || '');
      n.__body.innerHTML = md(sp.body, ctx);
      if (final && (m.via === 'claude' || m.via === 'groq')) { m.followups = sp.fu.length ? sp.fu : (m.followups || []); if (ctx.check) m.check = ctx.stats; }
    }
    if (!final) return;
    n.__extra.innerHTML = '';
    const x = n.__extra;
    if (m.cancelled) x.appendChild(el('p', { class: 'ai-note', text: 'Stopped before the end.' }));
    if (m.truncated) x.appendChild(el('p', { class: 'ai-note', text: 'This answer reached its length limit. Ask for the rest, or ask a narrower question.' }));
    if (m.note) {
      const p = el('p', { class: 'ai-note' + (m.error ? ' bad' : ''), text: m.note });
      if (m.error && m.error !== 'refused') p.appendChild(retryBtn(m, 'Retry'));
      x.appendChild(p);
    }
    if (m.check && m.check.claims) x.appendChild(checkNode(m.check));
    if (m.followups && m.followups.length && !m.quiz) {
      const fu = el('div', { class: 'ai-fu', role: 'group', 'aria-label': 'Follow-up questions' });
      m.followups.forEach(q => { const b = el('button', { type: 'button', text: q }); b.addEventListener('click', () => ask(q, { scope: m.scope, mode: m.mode === 'quiz' ? 'explain' : m.mode })); fu.appendChild(b); });
      x.appendChild(fu);
    }
    if (m.sources && m.sources.length) x.appendChild(sourcesNode(m));
    if (m.trace) x.appendChild(traceNode(m));
    const act = el('div', { class: 'ai-actions' });
    if (m.text && !m.quiz) {
      const cp = el('button', { type: 'button', text: 'Copy' });
      cp.addEventListener('click', () => copy(m, cp));
      act.appendChild(cp);
    }
    if (!m.error && (m.via === 'claude' || m.quiz)) act.appendChild(retryBtn(m, m.quiz ? 'New questions' : 'Regenerate'));
    if (act.childNodes.length) x.appendChild(act);
  }
  function retryBtn(m, label) {
    const b = el('button', { type: 'button', class: 'ai-retry', text: label });
    b.addEventListener('click', () => { if (!S.busy) run(m); });
    return b;
  }
  function checkNode(st) {
    const ok = st.cited === st.claims && !st.weak && !st.bad;
    const p = el('p', { class: 'ai-check' + (ok ? ' ok' : ' mixed') });
    let t = st.cited + ' of ' + st.claims + ' points cite your notes';
    if (st.weak) t += ' · ' + st.weak + ' loosely supported (dotted underline)';
    if (st.bad) t += ' · ' + st.bad + ' unknown source label' + (st.bad > 1 ? 's' : '');
    p.appendChild(el('span', { class: 'ico', 'aria-hidden': 'true', text: ok ? '✓' : '!' }));
    p.appendChild(el('span', { text: 'Grounding check: ' + t + '.' }));
    return p;
  }
  function sourcesNode(m) {
    const wrap = el('div', { class: 'ai-srcs' });
    wrap.appendChild(el('div', { class: 'ai-srcs-h', text: 'Sources in your notes · ' + m.sources.length }));
    const list = el('div', { class: 'ai-src-list' });
    const used = new Set(m.quiz || m.via === 'notes' ? m.sources.map(s => s.label) : labelsIn(m.text || ''));
    const show = m.sources.filter(s => used.has(s.label)).concat(m.sources.filter(s => !used.has(s.label)));
    show.forEach((s, i) => {
      const a = el('a', { class: 'src-row layer-' + (s.layer || 'tool') + (used.has(s.label) ? '' : ' unused'), href: '#' + s.anchor, 'data-s': s.label, hidden: i >= 4 });
      a.appendChild(el('span', { class: 'lbl', text: s.label }));
      a.appendChild(el('span', { class: 't', text: s.title }));
      a.appendChild(el('span', { class: 'w' }, [el('span', { class: 'ty', text: R.typeName(s.type) }), document.createTextNode(' · ' + s.where)]));
      list.appendChild(a);
    });
    wrap.appendChild(list);
    if (show.length > 4) {
      const more = el('button', { type: 'button', class: 'ai-more', text: 'Show all ' + show.length + ' sources' });
      more.addEventListener('click', () => { list.querySelectorAll('[hidden]').forEach(x => { x.hidden = false; }); more.remove(); });
      wrap.appendChild(more);
    }
    return wrap;
  }
  function traceNode(m) {
    const t = m.trace;
    const d = el('details', { class: 'ai-trace' });
    d.appendChild(el('summary', { text: 'How this answer was found' }));
    const body = el('div', { class: 'body' });
    const ol = el('ol');
    const und = [];
    if (t.corrected && t.corrected.length) und.push('fixed spelling: ' + t.corrected.map(c => '“' + c.from + '” → “' + c.to + '”').join(', '));
    if (t.expanded && t.expanded.length) und.push('also searched: ' + t.expanded.slice(0, 6).join(', '));
    if (t.intent && t.intent.length) und.push('question type: ' + t.intent.join(', '));
    if (t.rewritten) und.push('read the follow-up as “' + R.util.trimWords(t.rewritten, 16) + '”');
    if (t.ctxFrom) und.push('treated as a follow-up to “' + R.util.trimWords(t.ctxFrom, 12) + '”');
    ol.appendChild(el('li', { html: '<b>Understood</b> ' + esc(und.length ? und.join('; ') : 'the question as written') + '.' }));
    ol.appendChild(el('li', { html: '<b>Searched</b> ' + (t.N || '') + ' passages in ' + (t.ms || 0) + ' ms: keyword ranking (BM25F, headings count extra) and meaning vectors, fused by rank' + (t.scope && t.scope !== 'all' ? ', only in ' + esc(scopeName(t.scope)) : '') + '.' }));
    ol.appendChild(el('li', { html: '<b>Picked</b> ' + (m.sources || []).length + ' passages that cover the question without repeating each other (maximal marginal relevance).' }));
    if (t.steps && t.steps.length) ol.appendChild(el('li', { html: '<b>Deep search</b> ' + t.steps.map(esc).join(' · ') }));
    ol.appendChild(el('li', { html: '<b>Wrote</b> ' + (m.quiz ? (m.via === 'notes' ? 'a quiz from the chapter self-tests.' : 'questions with ' + (m.via === 'groq' ? esc(m.model || 'Groq') : 'Claude') + ', from those passages only.') : m.via === 'notes' ? 'the answer by quoting the closest sentences (notes mode).' : 'the answer with ' + (m.via === 'groq' ? esc(m.model || 'Groq') + ' on Groq' : 'Claude') + ', from those passages only.') }));
    if (m.check && m.check.claims) ol.appendChild(el('li', { html: '<b>Checked</b> ' + m.check.cited + ' of ' + m.check.claims + ' points cite a source; ' + m.check.weak + ' loosely supported.' }));
    body.appendChild(ol);
    if (t.top && t.top.length) {
      const tw = el('div', { class: 'table-wrap' });
      const tb = el('table', { class: 'cmp trace-tab' });
      tb.innerHTML = '<thead><tr><th>#</th><th>Passage</th><th class="num">Keyword</th><th class="num">Meaning</th><th>Used</th></tr></thead>';
      const tbody = el('tbody');
      t.top.forEach((r, i) => {
        tbody.appendChild(el('tr', { html: '<td class="num">' + (i + 1) + '</td><td><b>' + esc(r.title || '') + '</b><br><span class="muted">' + esc(R.typeName(r.type)) + ' · ' + esc(r.where) + '</span></td><td class="num">' + (r.rb || '—') + '</td><td class="num">' + (r.rv || '—') + '</td><td>' + (r.label ? '<b>' + esc(r.label) + '</b>' : '') + '</td>' }));
      });
      tb.appendChild(tbody); tw.appendChild(tb); body.appendChild(tw);
    }
    d.appendChild(body);
    return d;
  }
  function quizNode(m, ctx) {
    const qs = m.quiz.questions, trusted = m.quiz.html;
    const wrap = el('div', { class: 'ai-quiz' });
    const sc = el('div', { class: 'ai-quiz-score', text: 'Score 0 / ' + qs.length });
    wrap.appendChild(sc);
    let score = 0, done = 0;
    qs.forEach((q, qi) => {
      const card = el('div', { class: 'qcard' });
      card.appendChild(el('div', { class: 'qn', text: 'Question ' + (qi + 1) }));
      card.appendChild(el('div', { class: 'qq', html: trusted ? q.q : inline(q.q, ctx) }));
      const os = el('div', { class: 'qopts' }), why = el('div', { class: 'qwhy', hidden: true });
      q.o.forEach((o, oi) => {
        const b = el('button', { type: 'button', class: 'qopt' }, [el('span', { class: 'k', text: String.fromCharCode(65 + oi) }), el('span', { html: trusted ? o : inline(o, ctx) })]);
        b.addEventListener('click', () => {
          if (card.__done) return;
          card.__done = true; done++;
          const ok = oi === q.a;
          if (ok) score++;
          os.querySelectorAll('.qopt').forEach((y, yi) => { y.disabled = true; if (yi === q.a) y.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          why.hidden = false;
          const src = trusted && m.sources[qi] ? ' ' + citeHtml(m.sources[qi].label, ctx) : '';
          why.innerHTML = '<b>' + (ok ? 'Correct.' : 'Not quite: the answer is ' + String.fromCharCode(65 + q.a) + '.') + '</b> ' + (trusted ? (q.why || '') : inline(q.why || '', ctx)) + src;
          sc.textContent = 'Score ' + score + ' / ' + qs.length + (done === qs.length ? ' · finished' : '');
        });
        os.appendChild(b);
      });
      card.appendChild(os); card.appendChild(why);
      wrap.appendChild(card);
    });
    return wrap;
  }

  /* ------------------------------------------------------------ asking */
  function history(before) {
    const out = [];
    for (let i = 0; i < S.msgs.length; i++) {
      const m = S.msgs[i];
      if (m === before) break;
      if (m.role === 'ai' && m.text && !m.error && !m.quiz && m.via !== 'chat') out.push({ q: m.q, a: splitFU(m.text).body.replace(CITE, '').replace(/[ \t]+\n/g, '\n') });
    }
    return out.slice(-3);
  }
  function prevQuestion(before) {
    // the question asked before this answer's own question
    const qs = [];
    for (const m of S.msgs) { if (m === before) break; if (m.role === 'user') qs.push(m.q); }
    return qs.length >= 2 ? qs[qs.length - 2] : null;
  }
  function ask(text, o) {
    o = o || {};
    text = clean(text).slice(0, 2000);
    ensureUI();
    if (!text || S.busy) return;
    const mode = o.mode && MODE_NAME[o.mode] ? o.mode : S.mode;
    const scope = o.scope && scopeOptions().some(x => x[0] === o.scope) ? o.scope : S.scope;
    ui.ta.value = ''; grow(ui);
    const base = { q: text, mode, marks: S.marks, scope, ts: Date.now() };
    const um = Object.assign({ role: 'user', id: uid() }, base);
    const am = Object.assign({ role: 'ai', id: uid() }, base);
    if (!S.msgs.length) ui.log.innerHTML = '';
    S.msgs.push(um, am);
    ui.root.classList.add('has-msgs');
    const un = userNode(um);
    ui.log.appendChild(un);
    run(am, un);
  }
  async function run(am, anchorNode) {
    ensureUI();
    if (S.busy) return;
    Object.assign(am, { pending: true, text: '', quiz: null, via: null, note: '', error: null, cancelled: false, truncated: false, check: null, followups: [], sources: [], trace: null, status: R.stats ? 'Searching your notes…' : 'Indexing your notes (first time only)…', deep: !!(S.deep && R.claude.tools && R.claude.state === 'ready'), tier: S.tier });
    let n = nodeFor(am);
    if (!n) { n = aiNode(am); ui.log.appendChild(n); } else { n.__extra.innerHTML = ''; paint(n, am, false); }
    const top = (anchorNode || n.previousElementSibling || n);
    requestAnimationFrame(() => { ui.log.scrollTop = Math.max(0, top.offsetTop - 10); });
    const ctrl = new AbortController();
    S.busy = { ctrl, am };
    busyUI(true);
    const steps = [];
    let raf = 0;
    const onText = t => { am.text = t; am.status = ''; if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (am.pending) paint(n, am, false); }); };
    const onStatus = s => { am.status = s; if (steps.length < 8 && !/^Claude is/.test(s)) steps.push(s); if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (am.pending) paint(n, am, false); }); };
    const onSources = list => { am.sources = list.map(srcView); };
    try {
      if (!R.stats) { paint(n, am, false); await new Promise(r => setTimeout(r, 40)); R.ensure(); }
      await waitReady(4000);
      const common = { q: am.q, scope: am.scope, tier: am.tier, signal: ctrl.signal, onStatus, onSources };
      let r;
      if (am.mode === 'quiz') r = await R.quiz(common);
      else r = await R.ask(Object.assign(common, { mode: am.mode, marks: am.marks, deep: am.deep, history: history(am), prev: prevQuestion(am), onText }));
      am.sources = (r.sources || []).map(srcView);
      am.via = r.via; am.model = r.model || ''; am.note = r.note || ''; am.error = r.error || null; am.cancelled = !!r.cancelled; am.truncated = !!r.truncated;
      if (r.questions) {
        if (r.questions.length) am.quiz = { questions: r.questions, html: !!r.html };
        else if (!am.error && !am.cancelled) { am.note = 'No self-test questions matched this topic. Try a chapter name, for example “error detection”.'; }
      } else { am.text = r.text || ''; am.followups = r.followups || []; }
      if (r.tier) am.tier = r.tier;
      const an = r.an;
      if (an) {
        const lab = new Map((r.sources || []).map(x => [x.c.id, x.label]));
        am.trace = { rewritten: an.rewritten || '', corrected: an.corrected, expanded: an.expanded, intent: Object.keys(an.intent || {}), ctxFrom: an.ctxFrom, ms: an.ms, N: R.stats && R.stats.passages, scope: an.scope, steps, top: (an.results || []).slice(0, 8).map(x => ({ title: R.title(x.c), where: R.where(x.c), type: x.c.type, rb: x.rb, rv: x.rv, label: lab.get(x.c.id) || '' })) };
      }
    } catch (e) {
      am.error = 'upstream_error'; am.note = 'Something went wrong while answering' + (e && e.message ? ' (' + e.message + ')' : '') + '. Press Retry.';
      if (window.console) console.error(e);
    } finally {
      if (raf) cancelAnimationFrame(raf);
      am.pending = false; am.status = '';
      S.busy = null;
      busyUI(false);
      paint(n, am, true);
      save();
      if (ui) ui.live.textContent = am.error ? 'The answer could not be completed.' : 'Answer ready, with ' + (am.sources || []).length + ' sources.';
    }
  }
  function stop() { if (S.busy) S.busy.ctrl.abort(); }
  function busyUI(on) {
    if (!ui) return;
    ui.send.textContent = on ? 'Stop' : 'Ask';
    ui.send.classList.toggle('stop', on);
    ui.send.setAttribute('aria-label', on ? 'Stop the answer' : 'Ask');
    ui.root.classList.toggle('busy', on);
  }
  function copy(m, btn) {
    const body = splitFU(m.text || '').body;
    const srcs = (m.sources || []).map(s => s.label + ' · ' + s.where).join('\n');
    const txt = 'Q: ' + m.q + '\n\n' + body + (srcs ? '\n\nSources (Signal to Socket):\n' + srcs : '');
    const done = ok => { btn.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(() => { btn.textContent = 'Copy'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => done(true), () => done(fallback(txt)));
    else done(fallback(txt));
  }
  function fallback(t) {
    try { const a = el('textarea', { style: 'position:fixed;opacity:0' }); a.value = t; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; }
  }

  /* ------------------------------------------------------------ citations: peek and navigate */
  let peek = null;
  function msgOf(node) { const n = node.closest('.ai-msg'); return n && S.msgs.find(m => m.id === n.getAttribute('data-id')); }
  function onPeek(e) {
    const c = e.target.closest && e.target.closest('.cite[data-s]');
    if (!c || (e.type === 'mouseover' && !matchMedia('(hover: hover)').matches)) return;
    const m = msgOf(c), s = m && (m.sources || []).find(x => x.label === c.getAttribute('data-s'));
    if (!s) return;
    if (!peek) { peek = el('div', { class: 'ai-peek', role: 'tooltip' }); document.body.appendChild(peek); }
    peek.innerHTML = '<span class="lbl">' + esc(s.label) + ' · ' + esc(R.typeName(s.type)) + '</span><b>' + esc(s.where) + '</b><span>' + esc(s.snip) + '</span>';
    peek.style.display = 'grid';
    const r = c.getBoundingClientRect(), w = Math.min(340, window.innerWidth - 24);
    peek.style.width = w + 'px';
    const left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2));
    const ph = peek.offsetHeight;
    const topPos = r.bottom + 8 + ph < window.innerHeight ? r.bottom + 8 : Math.max(8, r.top - ph - 8);
    peek.style.left = left + 'px'; peek.style.top = topPos + 'px';
  }
  function hidePeek() { if (peek) peek.style.display = 'none'; }
  function onLogClick(e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    hidePeek();
    const narrow = window.innerWidth < 1100;
    if (ui.root.classList.contains('in-page')) { pendingOpen = !narrow; return; }
    if (narrow) closeDrawer(true);
  }

  /* ------------------------------------------------------------ drawer and page */
  function isOpen() { return document.body.classList.contains('ai-open'); }
  function openDrawer() {
    ensureUI();
    if (ui.root.classList.contains('in-page')) { ui.ta.focus(); return; }
    if (!isOpen()) lastFocus = document.activeElement;
    document.body.classList.add('ai-open');
    setBtn(true);
    idleIndex();
    requestAnimationFrame(() => { ui.log.scrollTop = ui.log.scrollHeight; try { ui.ta.focus({ preventScroll: true }); } catch (e) { ui.ta.focus(); } });
  }
  function closeDrawer(quiet) {
    if (!isOpen()) return;
    document.body.classList.remove('ai-open');
    setBtn(false);
    hidePeek();
    if (!quiet && lastFocus && document.body.contains(lastFocus)) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  function setBtn(on) { document.querySelectorAll('[data-open-assistant]').forEach(b => b.setAttribute('aria-expanded', String(on))); }
  function open(o) {
    o = o || {};
    openDrawer();
    if (o.marks && [4, 6, 8, 10].includes(o.marks)) { S.marks = o.marks; ui.marks.value = String(o.marks); }
    // a question sent from elsewhere on the page wants an answer, not a quiz, unless it says so
    if (o.q && o.send) { if (!S.busy) ask(o.q, { mode: o.mode || (S.mode === 'quiz' ? 'explain' : S.mode), scope: o.scope }); return; }
    if (o.mode && MODE_NAME[o.mode]) setMode(o.mode);
    if (o.scope && scopeOptions().some(x => x[0] === o.scope)) { ui.scope.value = o.scope; S.scope = o.scope; save(); }
    if (o.q) { ui.ta.value = o.q; grow(ui); }
  }
  function mountPage(host) {
    ensureUI();
    closeDrawer(true);
    host.appendChild(ui.root);
    ui.root.classList.add('in-page');
    fillScope(ui);
    if (!S.msgs.length) renderAll();
    idleIndex();
    requestAnimationFrame(() => { ui.log.scrollTop = ui.log.scrollHeight; });
  }
  function unmountPage() {
    if (!ui || !ui.root.classList.contains('in-page')) return;
    ui.root.classList.remove('in-page');
    drawer.appendChild(ui.root);
  }
  DCN.assistant = { open, close: closeDrawer, mountPage, unmountPage, ask: (q, o) => { openDrawer(); ask(q, o); }, state: S, md, splitFU };

  /* ------------------------------------------------------------ entry points around the guide */
  document.addEventListener('dcn:route', e => {
    const id = e.detail && e.detail.id;
    hideSel();
    if (pendingOpen) { pendingOpen = false; if (id !== 'assistant') setTimeout(openDrawer, 60); }
    if (ui && !S.msgs.length) renderAll();
    const ch = DCN.byId(id);
    if (!ch || ch.part === 'X') return;
    document.querySelectorAll('#view section.topic[id] > .topic-foot').forEach(foot => {
      if (foot.querySelector('.ask-topic')) return;
      const h2 = foot.parentNode.querySelector('h2');
      if (!h2) return;
      const title = clean(h2.textContent);
      const b = el('button', { type: 'button', class: 'ask-topic', html: ICON + '<span>Ask about this</span>', 'aria-label': 'Ask the assistant to explain ' + title });
      b.addEventListener('click', () => open({ q: 'Explain ' + title, scope: id, mode: 'explain', send: true }));
      foot.insertBefore(b, foot.firstChild);
    });
  });
  // select text in a chapter → ask about it
  let selBtn = null;
  function hideSel() { if (selBtn) selBtn.hidden = true; }
  function onSel() {
    const s = window.getSelection && window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) return hideSel();
    const txt = clean(s.toString()), nw = txt ? txt.split(' ').length : 0;
    if (txt.length < 12 || nw < 2 || nw > 90) return hideSel();
    const range = s.getRangeAt(0);
    let anc = range.commonAncestorContainer;
    if (anc.nodeType !== 1) anc = anc.parentNode;
    if (!anc || !anc.closest || !anc.closest('#view .prose') || anc.closest('.ai, .lab, .qcard, input, textarea, select')) return hideSel();
    const r = range.getBoundingClientRect();
    if (!r || (!r.width && !r.height)) return hideSel();
    if (!selBtn) {
      selBtn = el('button', { type: 'button', class: 'sel-ask', hidden: true, html: ICON + '<span>Ask about this</span>' });
      selBtn.addEventListener('mousedown', e => e.preventDefault());
      selBtn.addEventListener('click', () => {
        const t = R.util.trimWords(selBtn.__text || '', 60);
        hideSel();
        open({ q: 'Explain this from my notes: “' + t + '”', mode: 'explain', scope: 'all', send: true });
      });
      document.body.appendChild(selBtn);
    }
    selBtn.__text = txt;
    selBtn.hidden = false;
    const touch = matchMedia('(pointer: coarse)').matches;
    const bw = selBtn.offsetWidth || 150, bh = selBtn.offsetHeight || 34;
    const x = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left + r.width / 2 - bw / 2));
    const above = r.top - bh - 10;
    const y = touch || above < 70 ? r.bottom + 12 : above;
    selBtn.style.left = (x + window.scrollX) + 'px';
    selBtn.style.top = (y + window.scrollY) + 'px';
  }
  document.addEventListener('selectionchange', U.debounce(onSel, 220));
  window.addEventListener('scroll', U.debounce(() => { if (selBtn && !selBtn.hidden) onSel(); }, 120), { passive: true });
  document.addEventListener('keydown', e => {
    // Esc inside the search dialog belongs to the search box, not the assistant
    if (e.key === 'Escape' && isOpen() && !document.querySelector('.search-dlg.open') && !(e.target.closest && e.target.closest('.search-dlg'))) closeDrawer();
  });
  function boot() {
    ensureUI();
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('[data-open-assistant], [data-ask]');
      if (!t) return;
      e.preventDefault();
      if (t.hasAttribute('data-open-assistant')) { if (isOpen()) closeDrawer(); else openDrawer(); return; }
      open({ q: t.getAttribute('data-ask'), mode: t.getAttribute('data-mode') || undefined, scope: t.getAttribute('data-scope') || undefined, send: true });
    });
    document.addEventListener('submit', e => {
      const f = e.target.closest && e.target.closest('form[data-ask-form]');
      if (!f) return;
      e.preventDefault();
      const inp = f.querySelector('input, textarea');
      const q = inp ? inp.value : '';
      if (inp) inp.value = '';
      if (!clean(q)) openDrawer(); else open({ q, send: true });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
