DCN.register({
  id: 'assistant', num: 19, part: 'X', layer: 'tool',
  title: 'Study Assistant',
  short: 'Study assistant',
  summary: 'Ask anything in your syllabus. The assistant searches every chapter, model answer, worked example and lab in this guide, answers in the form your exam needs, and links every point to the notes it came from.',
  sources: ['Every chapter and toolkit page of this guide'],
  keywords: 'assistant ask question doubt chat tutor explain claude ai rag retrieval search sources citations exam answer revise numerical quiz',
  html: `
<section class="topic" id="ai-chat">
<h2>Ask your notes</h2>
<p>Type a question the way you would ask a friend or the way it is printed in the question paper. Pick <b>Exam answer</b> for an answer sized to the marks, <b>Numerical</b> for given, formula, substitution and result, <b>Revise</b> for quick bullets, or <b>Quiz me</b> to test yourself.</p>
<div id="ai-page-host" class="ai-page-host"></div>
</section>

<section class="topic" id="ai-how">
<h2>How it finds an answer</h2>
<p>This is retrieval-augmented generation: the assistant first finds the passages of this guide that answer your question, then writes only from them. It never answers from general knowledge, so it cannot drift outside your syllabus.</p>
<div class="ai-pipe">
  <div class="st"><b>Understand</b><span>Fixes spelling against the words your notes use (shanon → shannon), expands acronyms and synonyms (CSMA/CD → collision detection), spots the question type, and links a follow-up to the question before it.</span></div>
  <div class="st"><b>Retrieve</b><span>Scores <span data-ai-stat="passages">about a thousand</span> passages two ways: keyword ranking (BM25F, where headings count extra) and meaning vectors that match related wording. The two rankings are fused by rank.</span></div>
  <div class="st"><b>Select</b><span>Keeps the passages that add something new (maximal marginal relevance), favouring model answers for exam questions and worked examples for numericals.</span></div>
  <div class="st"><b>Write</b><span>Claude writes the answer from those passages only and labels each point with its source, such as [S2]. Without Claude, the assistant quotes the closest sentences instead.</span></div>
  <div class="st"><b>Check</b><span>Counts how many points cite a source and flags any point whose words are not clearly in the cited passage, so you know what to double-check.</span></div>
</div>
<p class="muted small" data-ai-stats>The search index is built in your browser the first time you ask.</p>
</section>

<section class="topic" id="ai-inspect">
<h2>Retrieval inspector</h2>
<p>See the first two steps for yourself. Type any question and watch how it is read and which passages would be sent to Claude.</p>
<figure class="lab" id="ai-inspector">
  <figcaption><span class="ttl">Retrieval inspector</span><span class="cap">Try a typo, an acronym or a vague question</span></figcaption>
  <div class="lab-body">
    <div class="insp-bar">
      <label class="sr-only" for="insp-q">Question to inspect</label>
      <input class="inp" id="insp-q" type="text" value="whats the diffrence between go back n and selective repeat" autocomplete="off" spellcheck="false">
      <select class="inp" id="insp-mode" aria-label="Answer style"><option value="explain">Explain</option><option value="exam">Exam answer</option><option value="numerical">Numerical</option><option value="revise">Revise</option></select>
    </div>
    <div class="insp-meta" id="insp-meta"></div>
    <div class="table-wrap"><table class="cmp insp-tab"><thead><tr><th class="num">#</th><th>Passage</th><th class="num">Keyword</th><th class="num">Meaning</th><th>Fused score</th><th>Sent as</th></tr></thead><tbody id="insp-rows"></tbody></table></div>
    <p class="hint" id="insp-foot"></p>
  </div>
</figure>
</section>

<section class="topic" id="ai-tips">
<h2>Getting exam-ready answers</h2>
<div class="duo">
  <div class="card"><h4>Ask like the paper</h4><ul><li>Paste the question with its marks: “Explain CSMA/CD with a flow chart (8 marks)”.</li><li>For numericals, give every value: “bandwidth 3.4 kHz, SNR 30 dB”.</li><li>Ask follow-ups such as “why is it 2Tp?”; the assistant remembers the last few questions.</li></ul></div>
  <div class="card"><h4>Trust, then verify</h4><ul><li>Every point carries a source chip. Hover it to preview the passage; click it to open the topic.</li><li>The grounding check under each answer tells you if any point is not clearly backed by your notes.</li><li>If your notes do not cover a question, the assistant says so instead of guessing.</li></ul></div>
  <div class="card"><h4>Where it works</h4><ul><li>Opened on claude.ai, Claude writes the answers. The first question asks your permission.</li><li>Opened from GitHub or as a file, it runs in notes mode: it finds the same passages and quotes them, with sources.</li><li>Your conversation is kept only in this browser. Questions go to Claude only when you press <b>Ask</b>.</li></ul></div>
</div>
<div class="note tip"><span class="tag">Shortcuts</span><p>Select any sentence in a chapter and press <b>Ask about this</b>. Every topic also ends with an <b>Ask about this</b> button, and the search box (<kbd>/</kbd>) offers to send your search to the assistant.</p></div>
</section>
`,
  init: function (view) {
    var R = DCN.rag, U = DCN.util, el = U.el;
    var host = view.querySelector('#ai-page-host');
    if (host && DCN.assistant) DCN.assistant.mountPage(host);
    var q = view.querySelector('#insp-q'), mode = view.querySelector('#insp-mode'), meta = view.querySelector('#insp-meta'), rows = view.querySelector('#insp-rows'), foot = view.querySelector('#insp-foot');
    function stats() {
      if (!R || !R.stats) return;
      var st = view.querySelector('[data-ai-stats]');
      if (st) st.textContent = 'Index: ' + R.stats.passages.toLocaleString('en-IN') + ' passages, ' + R.stats.terms.toLocaleString('en-IN') + ' distinct terms, built in your browser in ' + R.stats.ms + ' ms.';
      var p = view.querySelector('[data-ai-stat="passages"]');
      if (p) p.textContent = R.stats.passages.toLocaleString('en-IN');
    }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function chip(txt, cls) { return el('span', { class: 'chip' + (cls ? ' ' + cls : ''), text: txt }); }
    function inspect() {
      if (!R || !q) return;
      var text = q.value.trim();
      meta.innerHTML = ''; rows.innerHTML = '';
      if (text.length < 2) { foot.textContent = 'Type a question.'; return; }
      R.ensure(); stats();
      var an = R.search(text, { mode: mode.value });
      var picked = R.select(an, mode.value === 'exam' ? 8 : mode.value === 'revise' ? 7 : 6);
      var lab = new Map(); picked.forEach(function (r, i) { lab.set(r.c.id, 'S' + (i + 1)); });
      (an.corrected || []).forEach(function (c) { meta.appendChild(chip('spelling: ' + c.from + ' → ' + c.to, 'hot')); });
      (an.expanded || []).slice(0, 6).forEach(function (x) { meta.appendChild(chip('+ ' + x)); });
      Object.keys(an.intent || {}).forEach(function (k) { meta.appendChild(chip('type: ' + k, 'lay')); });
      if (!meta.childNodes.length) meta.appendChild(chip('read as written'));
      var top = an.results.slice(0, 10), max = top.length ? top[0].score : 1;
      top.forEach(function (r, i) {
        var tr = el('tr', { class: lab.has(r.c.id) ? 'picked' : '' });
        tr.innerHTML = '<td class="num">' + (i + 1) + '</td><td><a href="#' + esc(r.c.anchor) + '">' + esc(R.title(r.c)) + '</a><br><span class="muted small">' + esc(R.typeName(r.c.type)) + ' · ' + esc(R.where(r.c)) + '</span></td><td class="num">' + (r.rb || '—') + '</td><td class="num">' + (r.rv || '—') + '</td><td><span class="sbar"><i style="width:' + Math.round(100 * r.score / max) + '%"></i></span></td><td>' + (lab.has(r.c.id) ? '<b>' + lab.get(r.c.id) + '</b>' : '') + '</td>';
        rows.appendChild(tr);
      });
      if (!top.length) rows.appendChild(el('tr', { html: '<td colspan="6" class="muted">Nothing in the notes matches. The assistant would say the topic is not covered.</td>' }));
      foot.textContent = 'Searched ' + R.stats.passages.toLocaleString('en-IN') + ' passages in ' + an.ms + ' ms. Keyword and Meaning show each passage’s rank in the two searches (— means it was not in the top 80). Rows in bold are the passages that would be sent, labelled S1, S2 … as in the answers.';
    }
    if (q) {
      q.addEventListener('input', U.debounce(inspect, 220));
      mode.addEventListener('change', inspect);
      var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) { if (en.some(function (e) { return e.isIntersecting; })) { io.disconnect(); inspect(); } }, { rootMargin: '200px' }) : null;
      if (io) io.observe(view.querySelector('#ai-inspector')); else setTimeout(inspect, 600);
    }
    stats();
    var onStat = function () { stats(); };
    document.addEventListener('dcn:assistant-status', onStat);
    return { destroy: function () { if (io) io.disconnect(); document.removeEventListener('dcn:assistant-status', onStat); if (DCN.assistant) DCN.assistant.unmountPage(); } };
  }
});
