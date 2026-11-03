DCN.register({
  id: 'quiz', num: 22, part: 'X', layer: 'tool',
  title: 'Mixed Test',
  short: 'Mixed test',
  summary: 'A shuffled test drawn from every chapter\'s self-test. Choose the chapters and the length, answer, and read the reasoning after each question. Best scores are kept in this browser.',
  sources: ['Self-tests of Chapters 1–13'],
  keywords: 'quiz test mcq multiple choice practice mixed revision self-test score',
  html: `
<section class="topic" id="quiz-setup">
<h2>Build a test</h2>
<p>Questions come from the self-tests at the end of each chapter. The options are shuffled every time, so you cannot rely on remembering the letter.</p>
<div id="mq-ctrls" class="ctrls"></div>
<div id="mq-pick" class="ctrls" hidden></div>
<div id="mq-host"></div>
</section>
<section class="topic" id="quiz-scores">
<h2>Your chapter scores</h2>
<p class="muted">Best scores from each chapter's own self-test. Open a chapter's self-test to improve a weak one.</p>
<div id="mq-scores"></div>
</section>
`,
  init: function (view) {
    var U = DCN.util, el = U.el;
    var chapters = DCN.ordered().filter(function (c) { return c.part !== 'X' && c.quiz && c.quiz.length; });
    var ctrls = view.querySelector('#mq-ctrls'), pick = view.querySelector('#mq-pick'), host = view.querySelector('#mq-host'), scores = view.querySelector('#mq-scores');
    if (!ctrls || !host) return null;
    var scope = 'all', count = '20', chosen = {};
    chapters.forEach(function (c) { chosen[c.id] = true; });
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function pool() {
      var out = [];
      chapters.forEach(function (c) {
        var ok = scope === 'all' || (scope === 'A' && c.part === 'A') || (scope === 'B' && c.part === 'B') || (scope === 'ch' && chosen[c.id]);
        if (!ok) return;
        c.quiz.forEach(function (q) { out.push({ q: q, ch: c }); });
      });
      return out;
    }
    function make() {
      var p = shuffle(pool()), n = count === 'all' ? p.length : Math.min(p.length, +count);
      var qs = p.slice(0, n).map(function (x) {
        var idx = shuffle(x.q.o.map(function (_, i) { return i; }));
        return { q: x.q.q, o: idx.map(function (i) { return x.q.o[i]; }), a: idx.indexOf(x.q.a), why: x.q.why, ch: x.ch };
      });
      host.innerHTML = '';
      if (!qs.length) { host.appendChild(el('p', { class: 'hint', text: 'Pick at least one chapter.' })); return; }
      DCN.renderQuiz(host, qs, { id: 'mixed-' + scope + '-' + (count === 'all' ? 'all' : n), label: function (q, i) { return 'Question ' + (i + 1) + ' · Ch ' + q.ch.num + ' · ' + q.ch.short; } });
    }
    function group(label, seg) { return el('div', { class: 'ctrl' }, [el('span', { class: 'muted', text: label }), seg]); }
    ctrls.appendChild(group('Chapters', U.seg([['all', 'All'], ['A', 'Part A'], ['B', 'Part B'], ['ch', 'Choose…']], scope, function (v) { scope = v; pick.hidden = v !== 'ch'; make(); })));
    ctrls.appendChild(group('Questions', U.seg([['10', '10'], ['20', '20'], ['40', '40'], ['all', 'All']], count, function (v) { count = v; make(); })));
    ctrls.appendChild(el('button', { type: 'button', class: 'btn sm', text: 'New shuffle', onclick: make }));
    chapters.forEach(function (c) {
      var cb = el('input', { type: 'checkbox', id: U.uid('mq') });
      cb.checked = true;
      cb.addEventListener('change', function () { chosen[c.id] = cb.checked; make(); });
      pick.appendChild(el('label', { class: 'ctrl', for: cb.id, style: 'gap:6px;cursor:pointer' }, [cb, 'Ch ' + c.num + ' · ' + c.short]));
    });
    var total = 0, rows = chapters.map(function (c) {
      var best = U.store.get('dcn-quiz-' + c.id, null);
      total += c.quiz.length;
      var pct = best == null ? null : Math.round(best / c.quiz.length * 100);
      return '<tr><td>Ch ' + c.num + '</td><td><a href="#' + c.id + '-selftest">' + c.title + '</a></td><td class="num">' + c.quiz.length + '</td><td class="num">' + (best == null ? '—' : best + ' (' + pct + '%)') + '</td></tr>';
    }).join('');
    scores.innerHTML = '<div class="table-wrap"><table class="cmp"><thead><tr><th>#</th><th>Chapter</th><th class="num">Questions</th><th class="num">Your best</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="small muted">' + total + ' questions in all.</p>';
    make();
    return null;
  }
});
