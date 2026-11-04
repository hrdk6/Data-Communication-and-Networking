/* Signal to Socket — study assistant engine (retrieval-augmented generation over this guide)
   corpus   every chapter and toolkit page split into ~190-word passages (text, worked examples,
            model answers, practice, labs, code, self-test items), each tied to a section anchor
   index    tokenizer (unicode folding, joined forms like csmacd, light stemming) → BM25F postings
            with title boosts, bigrams, and random-indexing context vectors for related wording
   query    spell correction against the notes' vocabulary, acronym/synonym expansion, intent
            detection, follow-up context from the previous question
   ranking  BM25F ⊕ vector similarity fused by reciprocal rank, intent priors, MMR for diversity
   answer   Claude through the artifact `sample` capability (optionally agentic, with search
            tools), or an extractive answer that quotes the notes when Claude is unavailable */
(function () {
  'use strict';
  const DCN = window.DCN;
  if (!DCN) return;
  const R = DCN.rag = {};

  /* ---------------------------------------------------------------- text */
  const SUPSUB = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n', 'ₘ': 'm', 'ᵢ': 'i' };
  function fold(s) {
    return String(s || '').toLowerCase()
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ₀₁₂₃₄₅₆₇₈₉ₙₘᵢ]/g, c => SUPSUB[c] || '')
      .replace(/×/g, ' x ').replace(/[−‐]/g, '-').replace(/[–—…·•→←↔⇒≈≤≥″]/g, ' ')
      .replace(/µ/g, 'u').replace(/[′’']/g, '');
  }
  const STOP = new Set(('a an and are as at be been being but by can could did do does doing each for from had has have having how i if in into is it its itself may might more most must no nor not of on or our out over same shall should so some such than that the their them then there these they this those through to too under up us very was we were what when where which while who whom why will with would you your yours also only both any all about after again against before below between during further here just once other own few now use used using uses give gives given get gets show shows tell me please explain describe discuss write note notes briefly detail details neat diagram marks mark question answer example examples whats hows whys wat pls plz kindly key point points important main topic topics summary summarise summarize revision revise quick overview basics').split(' '));
  function stem(w) {
    if (w.length < 4 || /\d/.test(w)) return w;
    if (w.length > 4 && w.endsWith('ies')) w = w.slice(0, -3) + 'y';
    else if (w.endsWith('sses')) w = w.slice(0, -2);
    else if (w.endsWith('s') && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
    if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
    else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
    if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
    return w;
  }
  const isNum = s => /^\d+$/.test(s);
  function tokens(s) {
    const out = [], t = fold(s), re = /[a-z0-9]+(?:[-./][a-z0-9]+)*/g;
    let m;
    while ((m = re.exec(t))) {
      const w = m[0];
      if (w.length > 40) continue;
      if (/[-./]/.test(w)) {
        const parts = w.split(/[-./]+/).filter(Boolean);
        if (parts.every(isNum)) {
          if (/^\d+\.\d+$/.test(w)) out.push(w); else parts.forEach(p => out.push(p));
          continue;
        }
        const joined = parts.join('');
        if (!STOP.has(joined)) out.push(stem(joined));
        parts.forEach(p => { if ((p.length > 1 || isNum(p)) && !STOP.has(p)) out.push(stem(p)); });
      } else if ((w.length > 1 || isNum(w)) && !STOP.has(w)) out.push(stem(w));
    }
    return out;
  }
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  function words(s) { const m = clean(s).match(/\S+/g); return m ? m.length : 0; }
  function trimWords(s, n) {
    const w = clean(s).split(' ');
    return w.length <= n ? clean(s) : w.slice(0, n).join(' ') + ' …';
  }
  const ABBR = /\b(i\.e|e\.g|vs|etc|Fig|fig|approx|No|no|Eq|eq|max|min|ch|Ch|sec)\.(?=\s)/g;
  function sentences(text) {
    const out = [];
    String(text || '').split(/\n+|\s•\s/).forEach(line => {
      line = line.replace(/^[•\-\s]+/, '').trim();
      if (!line) return;
      line.replace(ABBR, '$1\u0002').replace(/([.!?])\s+(?=[A-Z0-9“"(])/g, '$1\u0001').split('\u0001').forEach(p => { p = p.replace(/\u0002/g, '.').trim(); if (p.length > 2) out.push(p); });
    });
    return out;
  }
  R.util = { fold, tokens, stem, sentences, trimWords, clean };

  /* ---------------------------------------------------------------- corpus */
  const BLOCK = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'TR', 'TABLE', 'THEAD', 'TBODY', 'SECTION', 'FIGURE', 'FIGCAPTION', 'DETAILS', 'SUMMARY', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'BLOCKQUOTE']);
  function blockText(node) {
    const out = [];
    (function walk(n) {
      if (n.nodeType === 3) { out.push(n.data); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag.toLowerCase() === 'svg' || tag === 'BUTTON') return;
      if (tag === 'BR') { out.push('\n'); return; }
      if (tag === 'SUP') { const t = clean(n.textContent); out.push(t.length > 1 && !/^\w+$/.test(t) ? '^(' + t + ')' : '^' + t); return; }
      if (tag === 'TD' || tag === 'TH') out.push(' · ');
      if (tag === 'LI') out.push('\n• '); else if (BLOCK.has(tag)) out.push('\n');
      for (let c = n.firstChild; c; c = c.nextSibling) walk(c);
      if (BLOCK.has(tag)) out.push('\n');
    })(node);
    return out.join('').replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').replace(/^ ?· /gm, '').trim();
  }
  function tableRows(tb) {
    const head = tb.querySelector('thead tr');
    const hdr = head ? Array.from(head.children).map(c => clean(blockText(c))) : null;
    const rows = [];
    Array.from(tb.querySelectorAll('tr')).forEach(r => {
      if (r === head) return;
      const cells = Array.from(r.children).map(c => clean(blockText(c)));
      if (cells.some(Boolean)) rows.push(cells);
    });
    return { hdr, rows };
  }
  function rowLine(hdr, cells) {
    if (hdr && hdr.length === cells.length && hdr.length > 1) return cells.map((v, i) => i === 0 ? v : (hdr[i] ? hdr[i] + ': ' : '') + v).filter(Boolean).join(' · ');
    return cells.filter(Boolean).join(' · ');
  }
  const TYPE_NAME = { text: 'Notes', example: 'Worked example', answer: 'Model answer', practice: 'Practice', lab: 'Interactive lab', code: 'Program', quiz: 'Self-test', table: 'Table' };
  R.typeName = t => TYPE_NAME[t] || 'Notes';
  function where(c) { return (c.part === 'X' ? c.chTitle : 'Ch ' + c.chNum + ' · ' + c.chShort) + ' › ' + c.secTitle + (c.subTitle && c.subTitle !== c.secTitle ? ' › ' + c.subTitle : ''); }
  R.where = where;
  const MAXW = 190, MINW = 55;
  const SKIP = new Set(['assistant', 'quiz']);
  function corpus() {
    const chunks = [];
    DCN.ordered().forEach(ch => {
      if (SKIP.has(ch.id)) return;
      const tpl = document.createElement('template');
      tpl.innerHTML = ch.html || '';
      const base = { ch: ch.id, chNum: ch.num, chTitle: ch.title, chShort: ch.short || ch.title, part: ch.part, layer: ch.layer };
      tpl.content.querySelectorAll('section.topic[id]').forEach(sec => {
        const h2 = sec.querySelector('h2');
        const secTitle = h2 ? clean(h2.textContent) : sec.id;
        let sub = null, cur = null;
        const make = (type, text, extra) => {
          text = String(text || '').trim();
          if (!text) return;
          const c = Object.assign({}, base, { id: chunks.length, sec: sec.id, secTitle, sub: sub && sub.id, subTitle: sub && sub.title, anchor: (sub && sub.id) || sec.id, type, text }, extra || {});
          c.hot = /\bIA-[12]\b|\bVTU\b|marks\b/.test(text);
          chunks.push(c);
        };
        const flush = () => { if (cur && cur.w) make(cur.type, cur.parts.join('\n')); cur = null; };
        const add = (text, type) => {
          if (!text) return;
          const w = words(text);
          if (w > MAXW * 1.4) { // a very long block: split by sentence groups
            flush();
            let buf = [], bw = 0;
            sentences(text).forEach(s => { const sw = words(s); if (bw + sw > MAXW && bw > MINW) { make(type || 'text', buf.join(' ')); buf = []; bw = 0; } buf.push(s); bw += sw; });
            if (buf.length) make(type || 'text', buf.join(' '));
            return;
          }
          if (!cur) cur = { type: type || 'text', parts: [], w: 0 };
          if (cur.w + w > MAXW && cur.w > MINW) { flush(); cur = { type: type || 'text', parts: [], w: 0 }; }
          cur.parts.push(text); cur.w += w;
        };
        const own = (type, text) => {
          // a self-contained block (example, model answer, table, code): its own passage(s), split by lines if long
          flush();
          const lines = String(text).split('\n');
          let buf = [], bw = 0;
          lines.forEach(l => { const lw = words(l); if (bw + lw > MAXW * 1.25 && bw > MINW) { make(type, buf.join('\n')); buf = []; bw = 0; } buf.push(l); bw += lw; });
          if (buf.length) make(type, buf.join('\n'));
        };
        const table = tb => {
          // tables keep their cells, so an answer can show the comparison as a table
          flush();
          const { hdr, rows } = tableRows(tb);
          let buf = [], bw = 0;
          const emit = () => { if (!buf.length) return; make('table', (hdr ? hdr.join(' · ') + '\n' : '') + buf.map(r => rowLine(hdr, r)).join('\n'), { rows: hdr ? [hdr].concat(buf) : buf.slice() }); buf = []; bw = 0; };
          rows.forEach(r => { const lw = words(rowLine(hdr, r)); if (bw + lw > MAXW * 1.25 && bw > MINW) emit(); buf.push(r); bw += lw; });
          emit();
        };
        Array.from(sec.children).forEach(el => {
          const tag = el.tagName;
          if (tag === 'H2') return;
          if (tag === 'H3' || tag === 'H4') { flush(); sub = { id: el.id || null, title: clean(el.textContent) }; return; }
          if (el.matches('figure.lab, [data-widget], [data-scene]')) {
            const ttl = el.querySelector('.ttl'), cap = el.querySelector('.cap');
            make('lab', 'Interactive lab: ' + clean(ttl ? ttl.textContent : '') + '. ' + clean(cap ? cap.textContent : ''), { lab: true });
            return;
          }
          if (el.matches('figure.fig')) {
            const svgEl = el.querySelector('svg'), fc = el.querySelector('figcaption');
            add('[Diagram] ' + clean((svgEl && svgEl.getAttribute('aria-label')) || '') + (fc ? '. ' + clean(fc.textContent) : ''));
            return;
          }
          if (el.matches('div.example')) { own('example', 'Worked example. ' + blockText(el)); return; }
          if (el.matches('details.answer')) {
            const sm = el.querySelector('summary'), body = el.querySelector('.body');
            own('answer', 'Model answer: ' + clean(sm ? sm.textContent : '') + '\n' + blockText(body || el)); return;
          }
          if (el.matches('details.solution')) {
            const sm = el.querySelector('summary'), body = el.querySelector('.body');
            own('practice', 'Practice: ' + clean(sm ? sm.textContent : '') + '\n' + blockText(body || el)); return;
          }
          if (tag === 'PRE') { own('code', 'Program code:\n' + el.textContent.replace(/\n{3,}/g, '\n\n').trim()); return; }
          if (el.matches('div.table-wrap') || tag === 'TABLE') {
            const tb = tag === 'TABLE' ? el : el.querySelector('table');
            if (tb) { table(tb); return; }
          }
          if (el.matches('.note')) {
            const tg = el.querySelector('.tag');
            const label = tg ? clean(tg.textContent) : 'Note';
            const tmp = el.cloneNode(true); const t2 = tmp.querySelector('.tag'); if (t2) t2.remove();
            add('[' + label + '] ' + clean(blockText(tmp)));
            return;
          }
          if (el.matches('.formula')) {
            const f = el.querySelector('.f'), wh = el.querySelector('.where');
            add('Formula: ' + clean(f ? blockText(f) : blockText(el)) + (wh ? ' (' + clean(blockText(wh)) + ')' : ''));
            return;
          }
          if (el.matches('.fgrid')) {
            el.querySelectorAll('.formula').forEach(fe => { const f = fe.querySelector('.f'), wh = fe.querySelector('.where'); add('Formula: ' + clean(f ? blockText(f) : '') + (wh ? ' (' + clean(blockText(wh)) + ')' : '')); });
            return;
          }
          add(blockText(el));
        });
        flush();
      });
      (ch.quiz || []).forEach((q, i) => {
        chunks.push(Object.assign({}, base, { id: chunks.length, sec: ch.id + '-selftest', secTitle: 'Self-test', sub: null, subTitle: null, anchor: ch.id + '-selftest', type: 'quiz', quiz: i, text: 'Self-test: ' + clean(q.q.replace(/<[^>]+>/g, '')) + ' Answer: ' + clean(String(q.o[q.a]).replace(/<[^>]+>/g, '')) + '. ' + clean(q.why || ''), hot: false }));
      });
    });
    return chunks;
  }

  /* ---------------------------------------------------------------- synonyms & acronyms */
  const GROUPS = [
    ['dhcp', 'dynamic host configuration protocol'], ['nat', 'network address translation'], ['arq', 'automatic repeat request'],
    ['gbn', 'go-back-n', 'go back n'], ['selective repeat', 'sr arq'], ['ack', 'acknowledgment', 'acknowledgement'], ['nak', 'negative acknowledgment'],
    ['crc', 'cyclic redundancy check', 'cyclic code'], ['fdm', 'frequency-division multiplexing', 'frequency division multiplexing'],
    ['tdm', 'time-division multiplexing', 'time division multiplexing'], ['wdm', 'wavelength-division multiplexing'], ['pcm', 'pulse code modulation'],
    ['ask', 'amplitude shift keying'], ['fsk', 'frequency shift keying'], ['psk', 'phase shift keying'], ['qam', 'quadrature amplitude modulation'],
    ['qpsk', 'quadrature phase shift keying'], ['snr', 'signal-to-noise ratio', 'signal to noise ratio'], ['bdp', 'bandwidth-delay product', 'bandwidth delay product'],
    ['osi', 'open systems interconnection', 'osi model'], ['tcp', 'transmission control protocol'], ['udp', 'user datagram protocol'], ['ip', 'internet protocol'],
    ['http', 'hypertext transfer protocol', 'web'], ['https', 'http over ssl'], ['ftp', 'file transfer protocol'], ['smtp', 'simple mail transfer protocol', 'email', 'e-mail', 'mail'],
    ['pop3', 'post office protocol', 'pop'], ['imap', 'imap4', 'internet mail access protocol'], ['mime', 'multipurpose internet mail extensions'],
    ['dns', 'domain name system', 'name server', 'resolver'], ['ssh', 'secure shell'], ['telnet', 'remote login'], ['rip', 'routing information protocol'],
    ['ospf', 'open shortest path first'], ['bgp', 'border gateway protocol'], ['ebgp', 'external bgp'], ['ibgp', 'internal bgp'], ['mospf', 'multicast open shortest path first', 'multicast routing'],
    ['lsa', 'link-state advertisement'], ['lsp', 'link-state packet', 'ls packet'], ['lsdb', 'link-state database'], ['link state', 'link-state', 'ls routing', 'dijkstra'],
    ['distance vector', 'distance-vector', 'dv routing', 'bellman-ford', 'bellman ford'], ['path vector', 'path-vector'], ['autonomous system', 'asn'],
    ['cidr', 'classless interdomain routing', 'classless addressing', 'slash notation'], ['classful', 'classful addressing', 'class a', 'class b', 'class c'],
    ['mtu', 'maximum transmission unit'], ['ttl', 'time-to-live', 'time to live', 'hop limit'], ['mss', 'maximum segment size'], ['rtt', 'round-trip time', 'round trip time'],
    ['rto', 'retransmission time-out', 'retransmission timeout'], ['cwnd', 'congestion window'], ['rwnd', 'receive window', 'receiver window', 'window size'],
    ['ssthresh', 'slow-start threshold', 'threshold'], ['aimd', 'additive increase multiplicative decrease'], ['slow start', 'slow-start'], ['fast retransmit', 'fast retransmission', 'three duplicate acks', 'duplicate ack'],
    ['csma', 'carrier sense multiple access'], ['csma/cd', 'csmacd', 'collision detection'], ['csma/ca', 'csmaca', 'collision avoidance'], ['cdma', 'code-division multiple access', 'chip sequence', 'walsh'],
    ['fdma', 'frequency-division multiple access'], ['tdma', 'time-division multiple access'], ['aloha', 'pure aloha', 'slotted aloha'], ['mac', 'media access control', 'medium access control', 'multiple access'],
    ['lan', 'local area network'], ['wan', 'wide area network'], ['man', 'metropolitan area network'], ['isp', 'internet service provider'],
    ['nrz', 'non-return-to-zero', 'non return to zero'], ['rz', 'return-to-zero'], ['ami', 'alternate mark inversion', 'bipolar'], ['manchester', 'biphase', 'differential manchester'],
    ['line coding', 'line code', 'encoding scheme'], ['utp', 'unshielded twisted pair', 'twisted pair'], ['stp', 'shielded twisted pair'], ['coax', 'coaxial cable', 'coaxial'],
    ['fiber', 'fibre', 'optical fiber', 'optical fibre', 'fiber optic'], ['vc', 'virtual circuit', 'virtual-circuit'], ['vci', 'virtual circuit identifier', 'label'],
    ['datagram approach', 'datagram network', 'connectionless'], ['hdlc', 'high-level data link control'], ['ppp', 'point-to-point protocol', 'point to point protocol'],
    ['lcp', 'link control protocol'], ['ncp', 'network control protocol'], ['icmp', 'internet control message protocol'], ['arp', 'address resolution protocol'],
    ['nvt', 'network virtual terminal'], ['sws', 'silly window syndrome', 'nagle'], ['sack', 'selective acknowledgment'], ['ns2', 'ns-2', 'network simulator', 'tcl'],
    ['rj45', 'rj-45', 'crimping', 'crimp', 't568a', 't568b', 'straight cable', 'cross cable'], ['ipv4', 'ip address', 'ipv4 address'], ['ipv6', 'next generation ip', 'ipng'],
    ['subnet', 'subnetting', 'subnetwork'], ['mask', 'subnet mask', 'address mask', 'netmask'], ['handshake', 'three-way handshake', 'connection establishment', 'syn'],
    ['termination', 'connection termination', 'teardown', 'fin', 'close connection'], ['latency', 'delay', 'propagation time', 'transmission time'],
    ['shortest path', 'least cost', 'least-cost'], ['flow control', 'sliding window'], ['congestion', 'congestion control'], ['error detection', 'parity', 'checksum', 'hamming distance'],
    ['bit stuffing', 'byte stuffing', 'framing', 'flag'], ['nyquist', 'noiseless channel', 'bit rate limit'], ['shannon', 'channel capacity', 'noisy channel'],
    ['attenuation', 'impairment', 'distortion', 'noise'], ['topology', 'mesh', 'star', 'bus', 'ring'], ['client-server', 'client server'], ['p2p', 'peer-to-peer', 'peer to peer'],
    ['socket', 'socket programming', 'socket address'], ['port', 'port number'], ['cookie', 'cookies', 'set-cookie'], ['proxy', 'web cache', 'web caching'],
    ['ia-1', 'ia1', 'internal assessment 1'], ['ia-2', 'ia2', 'internal assessment 2'], ['tunnel', 'tunneling', 'tunnelling', 'dual stack'], ['fragmentation', 'fragment', 'offset', 'reassembly']
  ];
  let SYN = null; // folded form → group index
  function synIndex() {
    if (SYN) return SYN;
    SYN = new Map();
    GROUPS.forEach((g, i) => g.forEach(f => SYN.set(fold(f).replace(/\s+/g, ' '), i)));
    return SYN;
  }

  /* ---------------------------------------------------------------- index */
  const K1 = 1.2, B = 0.72, DIM = 128, NNZ = 8, WIN = 3;
  let IX = null;
  function hash(s) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h || 1; }
  function xs(h) { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; return h >>> 0; }
  function trigrams(w) { const s = '#' + w + '#', g = []; for (let i = 0; i < s.length - 2; i++) g.push(s.slice(i, i + 3)); return g; }
  function norm(v, off, n) { let s = 0; for (let i = 0; i < n; i++) s += v[off + i] * v[off + i]; s = Math.sqrt(s) || 1; for (let i = 0; i < n; i++) v[off + i] /= s; }
  function build() {
    const t0 = performance.now();
    const chunks = corpus();
    const vocab = new Map(), terms = [], dfA = [], pD = [], pT = [];
    const lens = new Float32Array(chunks.length), seqs = [];
    const surf = new Map();
    chunks.forEach((c, d) => {
      const body = tokens(c.text);
      seqs.push(body);
      const tf = new Map(), addT = (t, w) => tf.set(t, (tf.get(t) || 0) + w);
      body.forEach(t => addT(t, 1));
      tokens(c.subTitle || '').forEach(t => addT(t, 3));
      tokens(c.secTitle).forEach(t => addT(t, 2));
      tokens(c.chShort + (c.part === 'X' ? ' ' + c.chTitle : '')).forEach(t => addT(t, 1));
      const ids = [], fs = [];
      let L = 0;
      tf.forEach((v, t) => {
        let id = vocab.get(t);
        if (id == null) { id = terms.length; vocab.set(t, id); terms.push(t); dfA.push(0); pD.push([]); pT.push([]); }
        dfA[id]++; pD[id].push(d); pT[id].push(v); ids.push(id); fs.push(v); L += v;
      });
      c._t = Int32Array.from(ids); c._f = Float32Array.from(fs); lens[d] = L;
      const bg = new Set(); for (let i = 1; i < body.length; i++) bg.add(body[i - 1] + ' ' + body[i]); c._bg = bg;
      // what the passage is about: its headings, or the question a model answer or example answers
      const lead = c.type === 'answer' || c.type === 'practice' || c.type === 'example' ? c.text.split('\n')[0].slice(0, 220) : '';
      c._tt = new Set(tokens((c.subTitle || '') + ' ' + c.secTitle + ' ' + lead));
      (fold(c.text + ' ' + c.secTitle + ' ' + (c.subTitle || '')).match(/[a-z]{3,}/g) || []).forEach(w => surf.set(w, (surf.get(w) || 0) + 1));
    });
    const N = chunks.length, V = terms.length;
    let avg = 0; for (let d = 0; d < N; d++) avg += lens[d]; avg /= N || 1;
    const idf = new Float32Array(V);
    for (let i = 0; i < V; i++) idf[i] = Math.log(1 + (N - dfA[i] + 0.5) / (dfA[i] + 0.5));
    // random indexing: each term gets a sparse ±1 index vector; its context vector sums the index
    // vectors of its neighbours, so terms used in similar company end up with similar vectors
    const ipos = new Uint8Array(V * NNZ), isg = new Int8Array(V * NNZ);
    for (let i = 0; i < V; i++) { let h = hash(terms[i]); for (let k = 0; k < NNZ; k++) { h = xs(h); ipos[i * NNZ + k] = h % DIM; h = xs(h); isg[i * NNZ + k] = (h & 1) ? 1 : -1; } }
    const ctx = new Float32Array(V * DIM);
    seqs.forEach(seq => {
      const ids = seq.map(t => vocab.get(t));
      for (let p = 0; p < ids.length; p++) {
        const a = ids[p], base = a * DIM;
        for (let q = Math.max(0, p - WIN); q <= Math.min(ids.length - 1, p + WIN); q++) {
          if (q === p) continue;
          const b = ids[q]; if (b === a) continue;
          const w = idf[b] / Math.abs(q - p);
          for (let k = 0; k < NNZ; k++) ctx[base + ipos[b * NNZ + k]] += w * isg[b * NNZ + k];
        }
      }
    });
    for (let i = 0; i < V; i++) norm(ctx, i * DIM, DIM);
    const cv = new Float32Array(N * DIM);
    chunks.forEach((c, d) => {
      const off = d * DIM;
      for (let j = 0; j < c._t.length; j++) {
        const t = c._t[j], w = (1 + Math.log(c._f[j])) * idf[t], tb = t * DIM;
        for (let k = 0; k < DIM; k++) cv[off + k] += w * ctx[tb + k];
      }
      norm(cv, off, DIM);
    });
    const sw = [], sf = [], tri = new Map();
    surf.forEach((f, w) => { const i = sw.length; sw.push(w); sf.push(f); trigrams(w).forEach(g => { let l = tri.get(g); if (!l) tri.set(g, l = []); l.push(i); }); });
    IX = { chunks, vocab, terms, df: Int32Array.from(dfA), pD, pT, lens, avg, N, idf, ctx, cv, surf, sw, sf, tri, ms: Math.round(performance.now() - t0) };
    R.stats = { passages: N, terms: V, words: sw.length, ms: IX.ms };
    return IX;
  }
  R.ensure = () => IX || build();
  R.chunk = id => R.ensure().chunks[id];

  /* ---------------------------------------------------------------- query analysis */
  function dl(a, b, max) { // Damerau-Levenshtein with early exit
    const n = a.length, m = b.length;
    if (Math.abs(n - m) > max) return max + 1;
    const d = []; for (let i = 0; i <= n; i++) { d[i] = [i]; }
    for (let j = 1; j <= m; j++) d[0][j] = j;
    for (let i = 1; i <= n; i++) {
      let rowMin = Infinity;
      for (let j = 1; j <= m; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
        d[i][j] = v; if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
    }
    return d[n][m];
  }
  function correctWord(w) {
    const ix = R.ensure();
    if (w.length < 4 || ix.surf.has(w) || synIndex().has(w) || /\d/.test(w) || STOP.has(w)) return null;
    const g = trigrams(w), cand = new Map();
    g.forEach(x => (ix.tri.get(x) || []).forEach(i => cand.set(i, (cand.get(i) || 0) + 1)));
    const need = Math.max(2, Math.floor(g.length * 0.3)), max = w.length >= 7 ? 2 : 1;
    let best = null;
    cand.forEach((cnt, i) => {
      if (cnt < need) return;
      const s = ix.sw[i]; if (Math.abs(s.length - w.length) > max) return;
      const d = dl(w, s, max); if (d > max) return;
      const f = ix.sf[i];
      if (!best || d < best.d || (d === best.d && f > best.f)) best = { w: s, d, f };
    });
    return best ? best.w : null;
  }
  const INTENT = {
    define: /\b(what is|what are|whats|define|definition|meaning of|stands? for|full form)\b/,
    compare: /\b(differen\w*|compare|comparison|versus|vs\.?|distinguish|contrast|advantages? of .* over)\b/,
    numeric: /\b(calculate|compute|find the|solve|how many|how much|numerical|problem on|problems on)\b|\d+(\.\d+)?\s*(k|m|g)?(bps|hz|bytes?|bits?|ms|us|db|%|km)\b/,
    exam: /\b(\d+\s*marks?|explain|describe|discuss|short note|neat diagram|elaborate|illustrate|with diagram)\b/,
    howto: /\b(how does|how do|how is|how are|steps|procedure|working|operation of|process of|mechanism)\b/,
    lab: /\b(lab|labs|command|commands|ns2|ns-2|tcl|crimp\w*|rj-?45|ipconfig|ping|netstat|tracert|nslookup|survey|campus|cable|program)\b/,
    code: /\b(java|program|code|socket programming|tcl|ns2)\b/,
    quiz: /\b(quiz|mcq|test me|question me)\b/
  };
  const FOLLOW = /\b(it|its|this|that|these|those|they|them|their|above|same|again|previous|last one)\b|^(and|but|why|how about|what about|then|also)\b/;
  R.analyze = function (q, opt) {
    opt = opt || {};
    const ix = R.ensure(), syn = synIndex();
    const raw = clean(q), low = fold(raw);
    const intent = {};
    // spell correction on surface words
    const corrected = [];
    const fixed = low.replace(/[a-z]{4,}/g, w => { const c = correctWord(w); if (c && c !== w) { corrected.push({ from: w, to: c }); return c; } return w; });
    Object.keys(INTENT).forEach(k => { if (INTENT[k].test(low) || INTENT[k].test(fixed)) intent[k] = true; });
    if (opt.mode === 'exam') intent.exam = true;
    if (opt.mode === 'numerical') intent.numeric = true;
    if (opt.mode === 'quiz') intent.quiz = true;
    if (intent.compare) delete intent.define; // "what is the difference" is a comparison
    const wl = fixed.match(/[a-z0-9]+(?:[-./][a-z0-9]+)*/g) || [];
    const W = new Map(), add = (t, w) => { if (STOP.has(t)) return; const id = ix.vocab.get(t); if (id == null) return; W.set(id, Math.max(W.get(id) || 0, w)); };
    tokens(fixed).forEach(t => add(t, 1));
    // acronym / synonym expansion over 1–4 word phrases
    const expanded = [];
    const seenG = new Set();
    const expand = ph => {
      const gi = syn.get(ph);
      if (gi == null || seenG.has(gi)) return;
      seenG.add(gi);
      GROUPS[gi].forEach(f => { if (fold(f) !== ph) { expanded.push(f); tokens(f).forEach(t => add(t, 0.45)); } });
    };
    for (let n = 4; n >= 1; n--) for (let i = 0; i + n <= wl.length; i++) expand(wl.slice(i, i + n).join(' '));
    // compound words such as csma/cd or go-back-n: their parts and joined form name topics too
    wl.forEach(w => { if (/[-./]/.test(w)) { expand(w.replace(/[-./]+/g, '')); w.split(/[-./]+/).forEach(p => { if (p.length > 1) expand(p); }); } });
    // follow-up questions borrow the previous question's terms
    let ctxFrom = null;
    const content = tokens(fixed).filter(t => ix.vocab.has(t));
    if (opt.prev && (content.length <= 2 || (FOLLOW.test(low) && content.length < 7))) {
      ctxFrom = opt.prev;
      tokens(fold(opt.prev)).slice(0, 8).forEach(t => add(t, 0.5));
    }
    const terms = Array.from(W, ([t, w]) => ({ t, w }));
    const core = Array.from(new Set(tokens(fixed).filter(t => ix.vocab.has(t))));
    // words the notes never use: if they are most of the question, the topic is outside the syllabus
    const unknown = Array.from(new Set((fixed.match(/[a-z][a-z0-9]{2,}/g) || []).filter(w => !STOP.has(w) && !syn.has(w) && !tokens(w).some(t => ix.vocab.has(t)))));
    const contentN = new Set(tokens(fixed)).size;
    const oos = unknown.length > 0 && contentN > 0 && unknown.length / contentN > 0.5;
    const bigrams = [];
    const qt = tokens(fixed);
    for (let i = 1; i < qt.length; i++) bigrams.push(qt[i - 1] + ' ' + qt[i]);
    return { q: raw, fixed, corrected, expanded: expanded.slice(0, 10), intent, terms, core, unknown, oos, bigrams, ctxFrom, scope: opt.scope || 'all', mode: opt.mode || 'explain' };
  };

  /* ---------------------------------------------------------------- retrieval */
  function inScope(c, scope) {
    if (!scope || scope === 'all') return true;
    if (scope === 'A' || scope === 'B' || scope === 'X') return c.part === scope;
    return c.ch === scope;
  }
  function prior(c, an) {
    const it = an.intent;
    let p = 1;
    if (c.type === 'quiz') p *= an.mode === 'quiz' || it.quiz ? 1.6 : 0.6;
    if (c.type === 'lab') p *= it.lab ? 1.15 : 0.75;
    if (c.type === 'code') p *= it.code ? 1.4 : 0.7;
    if (c.type === 'answer') p *= it.exam ? 1.35 : 1.05;
    if (c.type === 'example' || c.type === 'practice') p *= it.numeric ? 1.45 : 1;
    if (c.type === 'table' && it.compare) p *= 1.3;
    if (it.lab && c.ch === 'lab') p *= 1.3;
    if (c.ch === 'questions' && !it.exam) p *= 0.85;
    if (c.ch === 'formulas') p *= it.numeric ? 1.1 : 0.8;
    return p;
  }
  R.search = function (q, opt) {
    const ix = R.ensure();
    const t0 = performance.now();
    const an = typeof q === 'string' ? R.analyze(q, opt) : q;
    const N = ix.N, scope = an.scope;
    // sparse: BM25F with bigram bonus
    const bm = new Float32Array(N);
    an.terms.forEach(({ t, w }) => {
      const idf = ix.idf[t], D = ix.pD[t], F = ix.pT[t];
      for (let i = 0; i < D.length; i++) {
        const d = D[i], tf = F[i];
        bm[d] += w * idf * tf * (K1 + 1) / (tf + K1 * (1 - B + B * ix.lens[d] / ix.avg));
      }
    });
    if (an.bigrams.length) {
      for (let d = 0; d < N; d++) {
        if (!bm[d]) continue;
        const bg = ix.chunks[d]._bg;
        for (const b of an.bigrams) if (bg.has(b)) bm[d] += 1.2;
      }
    }
    // dense: random-indexing query vector against passage vectors
    const qv = new Float32Array(DIM);
    an.terms.forEach(({ t, w }) => { const base = t * DIM, s = w * ix.idf[t]; for (let k = 0; k < DIM; k++) qv[k] += s * ix.ctx[base + k]; });
    norm(qv, 0, DIM);
    const vs = new Float32Array(N);
    if (an.terms.length) for (let d = 0; d < N; d++) { let s = 0; const off = d * DIM; for (let k = 0; k < DIM; k++) s += qv[k] * ix.cv[off + k]; vs[d] = s; }
    // rank each signal inside the scope, fuse by reciprocal rank, apply intent priors
    const ids = []; for (let d = 0; d < N; d++) if (inScope(ix.chunks[d], scope)) ids.push(d);
    const byBm = ids.filter(d => bm[d] > 0).sort((a, b) => bm[b] - bm[a]).slice(0, 80);
    // meaning-only matches count only when the question has words the notes know, and only if close enough
    const byV = an.terms.length ? ids.filter(d => vs[d] >= 0.18).sort((a, b) => vs[b] - vs[a]).slice(0, 80) : [];
    const rb = new Map(), rv = new Map();
    byBm.forEach((d, i) => rb.set(d, i)); byV.forEach((d, i) => rv.set(d, i));
    const cand = new Set(byBm.concat(byV.slice(0, 40)));
    const out = [];
    const core = an.core || [];
    cand.forEach(d => {
      const c = ix.chunks[d];
      let s = (rb.has(d) ? 1 / (60 + rb.get(d)) : 0) + 0.7 * (rv.has(d) ? 1 / (60 + rv.get(d)) : 0);
      s *= prior(c, an);
      if (core.length) { let hit = 0; core.forEach(t => { if (c._tt.has(t)) hit++; }); s *= 1 + (c.type === 'answer' && !an.intent.exam ? 0.25 : 0.45) * hit / core.length; }
      out.push({ c, score: s, bm: bm[d], vec: vs[d], rb: rb.has(d) ? rb.get(d) + 1 : null, rv: rv.has(d) ? rv.get(d) + 1 : null });
    });
    out.sort((a, b) => b.score - a.score);
    an.results = out.slice(0, 40);
    an.ms = Math.round(performance.now() - t0);
    return an;
  };
  function cos(a, b) { const ix = IX; let s = 0; const oa = a * DIM, ob = b * DIM; for (let k = 0; k < DIM; k++) s += ix.cv[oa + k] * ix.cv[ob + k]; return s; }
  R.select = function (an, k, lambda) {
    // maximal marginal relevance: relevant, but not five passages that say the same thing
    lambda = lambda == null ? 0.72 : lambda;
    const pool = an.results.slice(0, 24);
    if (!pool.length) return [];
    const top = pool[0].score, chosen = [];
    while (chosen.length < k && pool.length) {
      let bi = 0, bv = -Infinity;
      pool.forEach((r, i) => {
        let red = 0;
        chosen.forEach(x => { let s = cos(r.c.id, x.c.id); if (x.c.anchor === r.c.anchor) s = Math.max(s, 0.85); if (s > red) red = s; });
        const v = lambda * (r.score / top) - (1 - lambda) * red;
        if (v > bv) { bv = v; bi = i; }
      });
      chosen.push(pool.splice(bi, 1)[0]);
    }
    return chosen;
  };

  /* ---------------------------------------------------------------- sources registry */
  function registry(list) {
    const reg = { list: [], byId: new Map() };
    reg.add = c => { if (reg.byId.has(c.id)) return reg.byId.get(c.id); const x = { label: 'S' + (reg.list.length + 1), c }; reg.list.push(x); reg.byId.set(c.id, x); return x; };
    reg.addAll = cs => cs.map(c => reg.add(c.c || c));
    (list || []).forEach(r => reg.add(r.c || r));
    return reg;
  }
  R.registry = registry;

  /* ---------------------------------------------------------------- extractive answers (no model) */
  const DEF = /\b(is|are|means|refers to|is called|are called|defined as|stands for|adds|provides|allows|lets|uses)\b/;
  const LEAD = /^(Worked example\.|Model answer:|Practice:|Program code:|Self-test:)\s*/;
  function mdTable(rows, maxR, maxC) {
    const cut = v => trimWords(String(v || '').replace(/\|/g, '/'), 24) || ' ';
    const r = rows.slice(0, maxR + 1).map(x => x.slice(0, maxC).map(cut));
    const n = Math.max.apply(null, r.map(x => x.length));
    const pad = x => { while (x.length < n) x.push(' '); return x; };
    const out = ['| ' + pad(r[0]).join(' | ') + ' |', '|' + ' --- |'.repeat(n)];
    r.slice(1).forEach(x => out.push('| ' + pad(x).join(' | ') + ' |'));
    return out.join('\n');
  }
  R.mdTable = mdTable;
  function answerTitle(c) { return clean(c.text.split('\n')[0].replace(LEAD, '')); }
  R.answerTitle = answerTitle;
  R.title = c => c.type === 'answer' || c.type === 'practice' || c.type === 'example' ? trimWords(answerTitle(c), 14) : (c.subTitle || c.secTitle);
  R.compose = function (an, sources) {
    const ix = R.ensure(), W = new Map(an.terms.map(x => [x.t, x.w])), core = new Set(an.core || []);
    const it = an.intent, mode = an.mode;
    const lab = i => '[' + sources[i].label + ']';
    const units = [];
    sources.forEach((x, si) => {
      const c = x.c;
      if (c.type === 'quiz' || c.type === 'lab' || c.type === 'code' || c.type === 'table' || c.type === 'example' || c.type === 'practice') return;
      if (c.type === 'answer' && (it.exam || mode === 'exam')) return; // shown as the model answer below
      let text = c.text;
      if (c.type === 'answer' || c.type === 'practice') text = text.split('\n').slice(1).join('\n');
      sentences(text).forEach((s, pos) => {
        s = s.replace(LEAD, '');
        if (s.length < 14 || /^·/.test(s) || (s.match(/·/g) || []).length > 3) return;
        const toks = new Set(tokens(s));
        let sc = 0, hit = 0;
        toks.forEach(t => { const id = ix.vocab.get(t); if (id != null && W.has(id)) sc += W.get(id) * ix.idf[id]; if (core.has(t)) hit++; });
        if (!sc || (si >= 3 && hit < Math.min(2, core.size))) return;
        sc /= Math.sqrt(6 + toks.size);
        if (words(s) < 6) sc *= 0.6;
        if ((s.match(/→/g) || []).length >= 3) sc *= 0.6;
        if (/^\[Diagram\]/.test(s)) sc *= 0.7;
        // a defining sentence starts with the topic and then says what it is, or is a labelled definition
        let def = false;
        if (c.type === 'text') {
          const lb = s.match(/^\[([^\]]{2,60})\]/);
          if (lb && core.size) { const lt = new Set(tokens(lb[1])); let h = 0; core.forEach(t => { if (lt.has(t)) h++; }); def = h / core.size >= 0.6; }
          if (!def && pos < 3) { const first = tokens(s)[0], fid = first != null ? ix.vocab.get(first) : null; def = fid != null && W.has(fid) && DEF.test(s.split(/\s+/).slice(0, 16).join(' ')); }
        }
        if (def && c._tt) { let th = 0; core.forEach(t => { if (c._tt.has(t)) th++; }); if (th) sc *= 1.25; }
        if (it.define && def) sc *= 1.4;
        sc *= 1 - Math.min(si, 8) * 0.05;
        units.push({ s, si, pos, sc, toks, def });
      });
    });
    units.sort((a, b) => b.sc - a.sc);
    if (units.length) { const floor = units[0].sc * 0.32; for (let i = units.length - 1; i >= 0; i--) if (units[i].sc < floor && !units[i].def) units.splice(i, 1); }
    const md = [];
    // 1 · lead with the clearest defining sentence from the best sources
    let lead = null;
    if (!(mode === 'exam' || mode === 'numerical')) lead = units.find(u => u.def && u.si <= 4) || null;
    const bold = t => t.replace(/^\[([^\]]+)\]\s*/, '**$1:** ');
    if (lead) md.push(bold(lead.s) + ' ' + lab(lead.si));
    // 2 · a comparison table, when the question compares and the notes have one
    const ti = sources.findIndex((x, i) => i <= 3 && x.c.type === 'table' && x.c.rows && x.c.rows.length > 1);
    const wantTable = ti >= 0 && (it.compare || mode === 'revise' || ti === 0);
    if (wantTable) {
      const c = sources[ti].c;
      md.push('', '**' + (c.subTitle || c.secTitle) + '** ' + lab(ti), '', mdTable(c.rows, 9, 5));
    }
    // 3 · the strongest points, grouped under the heading they come from
    const N = mode === 'revise' || mode === 'exam' ? 10 : wantTable ? 5 : 7, per = new Map(), picked = [];
    const similar = (a, b) => { let i = 0; a.toks.forEach(t => { if (b.toks.has(t)) i++; }); return i / Math.max(1, Math.min(a.toks.size, b.toks.size)) > 0.7; };
    for (const cap of [2, 3]) {
      for (const u of units) {
        if (picked.length >= N) break;
        if (u === lead || picked.includes(u) || (per.get(u.si) || 0) >= cap || (lead && similar(lead, u)) || picked.some(p => similar(p, u))) continue;
        picked.push(u); per.set(u.si, (per.get(u.si) || 0) + 1);
      }
    }
    picked.sort((a, b) => a.si - b.si || a.pos - b.pos);
    const groups = [];
    picked.forEach(u => {
      const c = sources[u.si].c, title = c.type === 'answer' ? 'From the model answer' : (c.subTitle || c.secTitle);
      let g = groups.find(x => x.title === title);
      if (!g) groups.push(g = { title, items: [] });
      g.items.push(u);
    });
    groups.forEach(g => {
      if (groups.length > 1 || lead || wantTable) md.push('', '**' + g.title + '**');
      g.items.forEach(u => md.push('- ' + bold(u.s) + ' ' + lab(u.si)));
    });
    // 4 · exam answers, numericals and labs
    const ai = sources.findIndex(x => x.c.type === 'answer');
    if ((it.exam || mode === 'exam') && ai >= 0) {
      const lines = sources[ai].c.text.split('\n').slice(1).map(clean).filter(l => l.length > 2).slice(0, 8);
      md.push('', '### Model answer · ' + answerTitle(sources[ai].c), ...lines.map(l => '- ' + l.replace(/^[•\-]\s*/, '') + ' ' + lab(ai)));
    }
    const ei = sources.findIndex(x => x.c.type === 'example' || x.c.type === 'practice');
    if ((it.numeric || mode === 'numerical') && ei >= 0) {
      const lines = String(sources[ei].c.text).split('\n').map(l => clean(l.replace(LEAD, ''))).filter(l => l.length > 1).slice(0, 10);
      md.push('', '### Worked example', ...lines.map(l => '- ' + l.replace(/^[•\-]\s*/, '') + ' ' + lab(ei)));
    }
    const li = sources.findIndex(x => x.c.type === 'lab');
    const said = md.some(l => l && !/^(\*\*|###)/.test(l));
    if (!said) return 'I could not find this in your notes. Try the words your notes use, or open one of the topics below.';
    if (li >= 0) md.push('', '_Try it:_ ' + sources[li].c.text.replace(/^Interactive lab:\s*/, '') + ' ' + lab(li));
    return md.join('\n').replace(/^\n+/, '');
  };
  const NOFU = /exam questions|exam corner|ia-1 solved|ia-2|self-test|likely|question bank/i;
  R.followups = function (an, sources) {
    const seen = new Set(sources.slice(0, 2).map(x => x.c.subTitle || x.c.secTitle)), out = [];
    (an.results || []).forEach(r => {
      const c = r.c, t = (c.subTitle || c.secTitle || '').replace(/[.:]$/, '');
      if (out.length >= 3 || !t || seen.has(t) || c.type === 'quiz' || NOFU.test(t) || NOFU.test(c.secTitle)) return;
      seen.add(t);
      out.push(c.type === 'table' && /\b(vs\.?|versus|and)\b/i.test(t) ? 'Compare ' + t : c.type === 'example' ? 'Solve a numerical on ' + t : 'Explain ' + t);
    });
    return out;
  };

  /* ---------------------------------------------------------------- LLM Runtime: Groq (with Claude fallback) */
  const GROQ_MODELS = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
    { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
  ];

  R.groq = {
    state: 'checking',
    models: GROQ_MODELS,
    model: 'llama-3.3-70b-versatile',
    modelName: 'Llama 3.3 70B',
    reason: ''
  };
  R.claude = { state: 'checking', sample: null, tools: false, tiers: null, reason: '' };

  function status() {
    try {
      document.dispatchEvent(new CustomEvent('dcn:assistant-status', {
        detail: { groq: R.groq, claude: R.claude }
      }));
    } catch (e) { /* ignore */ }
  }

  async function initLLM() {
    // 1. Check local key stored in browser
    const localKey = (localStorage.getItem('dcn-groq-key') || '').trim();
    if (localKey) {
      R.groq.state = 'ready';
      R.groq.reason = 'Using Groq API key from browser settings';
      status();
      return;
    }

    // 2. Check /api/chat (Vercel Serverless Function)
    try {
      const resp = await fetch('/api/chat', { method: 'GET' });
      if (resp.ok) {
        const data = await resp.json();
        if (data.hasKey) {
          R.groq.state = 'ready';
          R.groq.reason = 'Using GROQ_API_KEY from environment';
          status();
          return;
        }
      }
    } catch (e) {
      // /api/chat not running (e.g. file:// or static server)
    }

    // 3. Check Claude.ai artifact runtime
    const w = window.claude;
    if (w && typeof w.use === 'function') {
      try {
        const s = await w.use('sample');
        if (s) {
          R.claude.sample = s;
          R.claude.state = 'ready';
          if (typeof s.limits === 'function') {
            s.limits().then(l => {
              R.claude.tools = !!(l && l.tools);
              R.claude.tiers = (l && l.modelTiers) || null;
              status();
            }).catch(() => {});
          }
          status();
          return;
        }
      } catch (e) {}
    }

    // Fallback: No key configured yet
    R.groq.state = 'no_key';
    R.groq.reason = 'No GROQ_API_KEY found in .env or settings.';
    status();
  }
  R.initLLM = initLLM;

  async function callGroqStream(o, reg) {
    const messages = turns(o, reg);
    const localKey = (localStorage.getItem('dcn-groq-key') || '').trim();
    const headers = { 'Content-Type': 'application/json' };
    if (localKey) headers['x-groq-key'] = localKey;

    let res;
    if (window.location.protocol === 'file:' && localKey) {
      res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: R.groq.model || 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.2,
          stream: true
        }),
        signal: o.signal
      });
    } else {
      res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages,
          model: R.groq.model || 'llama-3.3-70b-versatile',
          stream: true,
          mode: o.mode,
          marks: o.marks
        }),
        signal: o.signal
      });
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { code: err.error || 'groq_error', note: err.message || ('Groq API error (' + res.status + ')') };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';
    let buf = '';
    let activeModel = R.groq.modelName;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') break;
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.meta && data.model) {
              const matched = GROQ_MODELS.find(m => m.id === data.model);
              activeModel = matched ? matched.name : data.model;
              if (o.onStatus) o.onStatus('Answering with ' + activeModel + '…');
            } else if (data.choices && data.choices[0] && data.choices[0].delta) {
              const delta = data.choices[0].delta.content || '';
              if (delta) {
                text += delta;
                if (o.onText) o.onText(text);
              }
            }
          } catch (e) {}
        }
      }
    }

    return { text, modelName: activeModel };
  }
  const PERMANENT = new Set(['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed']);
  const ERR = {
    not_granted: 'Claude is not allowed for this page, so this answer comes straight from your notes.',
    sampling_disabled: 'Claude is not available on this account, so this answer comes straight from your notes.',
    not_declared: 'This copy of the page cannot use Claude, so this answer comes straight from your notes.',
    capability_disabled: 'Claude cannot be used in this view, so this answer comes straight from your notes.',
    capability_removed: 'This viewer cannot run Claude here, so this answer comes straight from your notes.',
    rate_limited: 'Claude is busy or a usage limit was reached. Wait a little, then press Retry.',
    session_expired: 'Your Claude session has expired. Sign in again, then press Retry.',
    refused: 'Claude declined this request. Try asking it a different way.',
    empty_completion: 'No answer came back. Try a shorter or simpler question.',
    prompt_too_large: 'That was too much to send at once. Ask about one topic at a time.',
    invalid_json: 'The quiz came back in a form I could not read. Press Retry.',
    upstream_error: 'The connection dropped before the answer finished. Press Retry.'
  };
  R.errorText = code => ERR[code] || ERR.upstream_error;
  const TIERS = ['quick', 'default', 'complex'];
  function tierFor(want) { const t = R.claude.tiers; if (!want || !TIERS.includes(want)) return 'default'; return !t || t.includes(want) ? want : 'default'; }

  function rules(deep) {
    return [
      'You are the study assistant inside "Signal to Socket", a study guide for Data Communication and Networking (VTU BCS502, taught at BMSIT&M). The student revises only from this guide, and the guide was written only from their syllabus files, so stay inside it.',
      '',
      'Rules:',
      '1. Use only the SOURCES passages' + (deep ? ' and the passages you fetch with search_notes or read_section' : '') + '. Do not add facts, protocols, numbers or examples that are not in them. If they do not cover the question, say so in one sentence, name the closest topic they do cover, and stop.',
      '2. Cite the source label after every sentence or bullet that uses it, in square brackets: [S2] or [S1][S4]. Use only labels you were given. Never invent a label.',
      '3. Write for an engineering student preparing for an internal test or the VTU exam: exact terms, short sentences, no filler, no greetings.',
      '4. Format with Markdown: short paragraphs, "-" bullets or numbered lists, **bold** key terms, a table for comparisons. Use "###" headings only for exam answers. No HTML, no links, no emoji.',
      '5. Formulas inline with plain symbols, for example S = G × e^(−2G) or N = 2^(32 − n). For numericals: formula, then substitution with units, then the boxed answer in bold.',
      '6. Where a diagram is expected, give a labelled step list or a small ASCII sketch in a ``` code block, and mention the guide\'s lab or figure if a source names one.',
      '7. If a source has a "Heads-up" that corrects the student\'s notes, follow the correction and point it out.',
      '8. End with one line that starts with "Follow-ups:" and gives two or three short follow-up questions separated by " | ".',
      deep ? '9. You may call search_notes (several focused queries in the guide\'s own terms, one per part of the question) and read_section (when a passage is cut short) before answering. Use at most four tool calls, then answer.' : ''
    ].filter(Boolean).join('\n');
  }
  function modeLine(mode, marks) {
    switch (mode) {
      case 'exam': return 'Write a ' + (marks || 6) + '-mark exam answer: a one-line definition, then ### sections as the examiner expects (working or steps, diagram description, key points or table, conclusion). About ' + (35 * (marks || 6)) + ' words. Cite every point.';
      case 'revise': return 'Give quick revision notes: 6–10 crisp bullets, key formulas, and any mnemonic or exam tip from the sources. No long paragraphs.';
      case 'numerical': return 'Solve it as a numerical: list what is given, the formula, the substitution with units, and the answer in bold. If numbers are missing, explain the method using the worked example in the sources.';
      default: return 'Explain clearly in 120–250 words: first in plain language, then the exact exam terms. Cite every point.';
    }
  }
  function sourcesText(list) {
    return list.map(x => '[' + x.label + '] ' + where(x.c) + ' (' + R.typeName(x.c.type) + '; section id: ' + x.c.sec + ')\n' + trimWords(x.c.text, 240)).join('\n\n');
  }
  function turns(o, reg) {
    // strictly alternating turns: the rules ride on the first user turn, earlier answers stay for context
    const t = [];
    const user = c => { const last = t[t.length - 1]; if (last && last.role === 'user') last.content += '\n\n' + c; else t.push({ role: 'user', content: c }); };
    user(rules(o.deep));
    (o.history || []).slice(-3).forEach(h => {
      if (!h.q || !h.a) return;
      user('EARLIER QUESTION: ' + h.q);
      t.push({ role: 'assistant', content: h.a.slice(0, 1800) });
    });
    user('SOURCES:\n\n' + sourcesText(reg.list) + '\n\nMODE: ' + modeLine(o.mode, o.marks) + '\n\nQUESTION: ' + o.q);
    return t;
  }
  function searchTools(o, reg) {
    const pass = list => list.map(x => ({ label: x.label, where: where(x.c), kind: R.typeName(x.c.type), section_id: x.c.sec, text: trimWords(x.c.text, 220) }));
    return [{
      name: 'search_notes',
      description: 'Search the student\'s DCN study guide (13 chapters, worked examples, model answers, labs, IA questions). Returns up to 5 passages, each with a label such as S7, where it is in the guide, and its text. Use short, specific queries in the guide\'s own terms; search again for each part of a multi-part question.',
      inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'What to look for, for example "CSMA/CD minimum frame size".' }, chapter: { type: 'string', description: 'Optional: search one chapter only, by id (c1 … c13, lab, questions, formulas).' } }, required: ['query'] },
      execute: async input => {
        const q = String(input && input.query || '').slice(0, 200);
        if (!q.trim()) throw new Error('query is empty');
        if (o.onStatus) o.onStatus('Searching your notes: “' + q + '”');
        const ch = input && input.chapter ? String(input.chapter) : o.scope;
        const an = R.search(q, { scope: DCN.byId(ch) || ['A', 'B', 'X', 'all'].includes(ch) ? ch : 'all' });
        const got = reg.addAll(R.select(an, 5));
        return { passages: pass(got) };
      }
    }, {
      name: 'read_section',
      description: 'Read one whole section of the guide by its section id (given with every passage, for example c12-conn). Use it when a passage is cut short or you need the rest of a topic. Returns that section\'s passages with labels.',
      inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'Section id, for example c10-dhcp.' } }, required: ['id'] },
      execute: async input => {
        const id = String(input && input.id || '').replace(/^#/, '').trim();
        const list = R.ensure().chunks.filter(c => c.sec === id || c.anchor === id).slice(0, 8);
        if (!list.length) throw new Error('No section with id ' + id);
        if (o.onStatus) o.onStatus('Reading “' + list[0].secTitle + '”');
        return { passages: pass(reg.addAll(list)) };
      }
    }];
  }
  R.ask = async function (o) {
    // o: {q, mode, marks, scope, deep, tier, history, prev, signal, onText, onStatus, onSources}
    R.ensure();
    const an = R.search(o.q, { scope: o.scope, mode: o.mode, prev: o.prev });
    if (an.oos && !o.deep) {
      const near = R.followups(an, []);
      return { text: 'Your notes do not cover **' + an.unknown.slice(0, 4).join(', ') + '**. This guide holds only your DCN syllabus, so there is nothing to answer from.' + (near.length ? ' The closest topics it does cover are below.' : ''), via: 'notes', note: '', sources: [], an, followups: near, oos: true };
    }
    const picked = R.select(an, o.mode === 'exam' ? 8 : o.mode === 'revise' ? 7 : 6);
    const reg = registry(picked);
    if (o.onSources) o.onSources(reg.list, an);
    const offline = note => ({ text: R.compose(an, reg.list, o), via: 'notes', note: note || '', sources: reg.list, an, followups: R.followups(an, reg.list) });
    // 1. Prefer Groq LLM if ready
    if (R.groq.state === 'ready') {
      if (o.onStatus) o.onStatus('Reading ' + reg.list.length + ' passages with Groq (' + R.groq.modelName + ')…');
      try {
        const res = await callGroqStream(o, reg);
        return { text: res.text, model: res.modelName, via: 'groq', sources: reg.list, an };
      } catch (e) {
        if (e && e.code === 'cancelled') return { text: '', via: 'groq', cancelled: true, sources: reg.list, an };
        console.warn('[RAG] Groq error, falling back to Notes Mode:', e);
        return offline(e.note || 'Groq error. Assembled from notes:');
      }
    }

    // 2. Claude runtime (if available in claude.ai artifact)
    const cl = R.claude;
    if (!cl.sample || cl.state !== 'ready') return offline(cl.state === 'declined' ? cl.reason : '');
    if (!reg.list.length && !o.deep) return offline();
    const opts = { signal: o.signal, modelTier: tierFor(o.tier), onText: u => { if (o.onText) o.onText(u.text); } };
    if (o.deep && cl.tools) opts.tools = searchTools(o, reg); else opts.cache = false;
    if (o.onStatus) o.onStatus(o.deep && cl.tools ? 'Claude is planning which notes to read…' : 'Claude is reading ' + reg.list.length + ' passages from your notes…');
    try {
      const res = await cl.sample(turns(o, reg), opts);
      return { text: res.text, truncated: res.truncated, tier: res.modelTierApplied, via: 'claude', sources: reg.list, an };
    } catch (e) {
      const code = e && e.code;
      if (code === 'cancelled') return { text: (e.text || '').trim(), via: 'claude', cancelled: true, sources: reg.list, an };
      if (PERMANENT.has(code)) { cl.state = 'declined'; cl.reason = R.errorText(code); status(); return offline(R.errorText(code)); }
      if (code === 'refused') return { text: '', via: 'claude', error: code, note: R.errorText(code), sources: reg.list, an };
      return { text: (e && e.text) || '', via: 'claude', error: code || 'upstream_error', note: R.errorText(code), sources: reg.list, an };
    }
  };
  R.quiz = async function (o) {
    R.ensure();
    const an = R.search(o.q, { scope: o.scope, mode: 'quiz' });
    const cl = R.claude;
    const offline = note => {
      const qs = an.results.filter(r => r.c.type === 'quiz').slice(0, 5).map(r => DCN.byId(r.c.ch).quiz[r.c.quiz]);
      const reg = registry(an.results.filter(r => r.c.type === 'quiz').slice(0, 5));
      return { questions: qs, html: true, via: 'notes', note: note || '', sources: reg.list, an };
    };
    if (!cl.sample || cl.state !== 'ready') return offline(cl.state === 'declined' ? cl.reason : '');
    // Try Groq LLM for dynamic quiz generation
    if (R.groq.state === 'ready') {
      const reg = registry(R.select(Object.assign({}, an, { results: an.results.filter(r => r.c.type !== 'quiz') }), 6));
      if (o.onSources) o.onSources(reg.list, an);
      if (o.onStatus) o.onStatus('Groq is generating questions from ' + reg.list.length + ' passages…');
      const prompt = rules(false).split('\n8.')[0] + '\n\nSOURCES:\n\n' + sourcesText(reg.list) + '\n\nTASK: Write 4 multiple-choice questions that test understanding (not trivia) of: ' + o.q + '. Use only the sources. Reply with only a valid JSON array of objects, with NO markdown backticks or commentary, each {"q": string, "options": [four strings], "answer": index 0-3 of correct option, "why": one sentence ending with source label like [S2]}.';

      try {
        const localKey = (localStorage.getItem('dcn-groq-key') || '').trim();
        const headers = { 'Content-Type': 'application/json' };
        if (localKey) headers['x-groq-key'] = localKey;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            model: R.groq.model || 'llama-3.3-70b-versatile',
            stream: false
          }),
          signal: o.signal
        });

        if (!res.ok) throw new Error('quiz request failed');
        const data = await res.json();
        const rawText = (data.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawText);
        const qs = (Array.isArray(parsed) ? parsed : []).filter(x => x && typeof x.q === 'string' && Array.isArray(x.options) && x.options.length >= 2 && Number.isInteger(+x.answer))
          .slice(0, 6).map(x => ({ q: String(x.q), o: x.options.map(s => String(s)), a: +x.answer, why: String(x.why || '') }));
        if (qs.length) return { questions: qs, html: false, via: 'groq', model: data.model, sources: reg.list, an };
      } catch (e) {
        console.warn('[RAG] Quiz generation failed, using chapter self-test:', e);
      }
    }

    const reg = registry(R.select(Object.assign({}, an, { results: an.results.filter(r => r.c.type !== 'quiz') }), 6));
    if (o.onSources) o.onSources(reg.list, an);
    if (o.onStatus) o.onStatus('Claude is writing questions from ' + reg.list.length + ' passages…');
    const prompt = rules(false).split('\n8.')[0] + '\n\nSOURCES:\n\n' + sourcesText(reg.list) + '\n\nTASK: Write 4 multiple-choice questions that test understanding (not trivia) of: ' + o.q + '. Use only the sources. Reply with only a JSON array of objects, each {"q": string, "options": [four strings], "answer": index 0-3 of the correct option, "why": one sentence ending with its source label like [S2]}.';
    try {
      const data = await cl.sample.json(prompt, { signal: o.signal, modelTier: tierFor(o.tier), cache: false });
      const qs = (Array.isArray(data) ? data : []).filter(x => x && typeof x.q === 'string' && Array.isArray(x.options) && x.options.length >= 2 && Number.isInteger(+x.answer) && +x.answer >= 0 && +x.answer < x.options.length)
        .slice(0, 6).map(x => ({ q: String(x.q), o: x.options.map(s => String(s)), a: +x.answer, why: String(x.why || '') }));
      if (!qs.length) throw { code: 'invalid_json' };
      return { questions: qs, html: false, via: 'claude', sources: reg.list, an };
    } catch (e) {
      const code = e && e.code;
      if (code === 'cancelled') return { questions: [], via: 'claude', cancelled: true, sources: reg.list, an };
      if (PERMANENT.has(code)) { cl.state = 'declined'; cl.reason = R.errorText(code); status(); return offline(R.errorText(code)); }
      return { questions: [], via: 'claude', error: code || 'upstream_error', note: R.errorText(code), sources: reg.list, an };
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLLM); else initLLM();
})();
