/* Signal to Socket — core runtime (classic script; works from file://)
   Registry · router · nav · TOC · progress · theme · search · quiz · mounting */
(function () {
  'use strict';
  var DCN = window.DCN = window.DCN || {};
  DCN.chapters = DCN.chapters || [];
  DCN.widgets = DCN.widgets || {};
  DCN.scenes = DCN.scenes || {};

  var LAYERS = {
    found: { name: 'Foundations', sub: 'spans every layer' },
    phy: { name: 'Physical layer', sub: 'signals · media · multiplexing' },
    dll: { name: 'Data link layer', sub: 'frames · errors · access' },
    net: { name: 'Network layer', sub: 'IP · addressing · routing' },
    tl: { name: 'Transport layer', sub: 'UDP · TCP · congestion' },
    app: { name: 'Application layer', sub: 'HTTP · mail · DNS · SSH' },
    tool: { name: 'Toolkit', sub: 'revise · practise · test' }
  };
  DCN.LAYERS = LAYERS;

  DCN.register = function (ch) {
    var i = DCN.chapters.findIndex(function (c) { return c.id === ch.id; });
    if (i >= 0) DCN.chapters[i] = ch; else DCN.chapters.push(ch);
  };
  function ordered(part) {
    return DCN.chapters.filter(function (c) { return !part || c.part === part; })
      .sort(function (a, b) { return (a.num || 0) - (b.num || 0); });
  }
  DCN.ordered = ordered;
  function byId(id) { return DCN.chapters.find(function (c) { return c.id === id; }); }
  DCN.byId = byId;

  /* ---------------- utilities ---------------- */
  var U = DCN.util = {};
  U.el = function (tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  };
  var SVGNS = 'http://www.w3.org/2000/svg';
  U.svg = function (tag, attrs, kids) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null) return;
      if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  };
  U.css = function (name, el) { return getComputedStyle(el || document.documentElement).getPropertyValue(name).trim(); };
  U.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  U.log2 = function (x) { return Math.log(x) / Math.LN2; };
  U.round = function (v, d) { var p = Math.pow(10, d == null ? 3 : d); return Math.round(v * p) / p; };
  U.fmt = function (v, d) {
    if (!isFinite(v)) return v > 0 ? '∞' : '—';
    var r = U.round(v, d == null ? 3 : d);
    return Math.abs(r) >= 1e4 ? r.toLocaleString('en-IN', { maximumFractionDigits: d == null ? 3 : d }) : String(r);
  };
  U.si = function (v, unit, d) {
    if (!isFinite(v)) return '∞ ' + unit;
    var a = Math.abs(v), pre = [[1e12, 'T'], [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n']];
    if (a === 0) return '0 ' + unit;
    for (var i = 0; i < pre.length; i++) if (a >= pre[i][0] * 0.9999) return U.fmt(v / pre[i][0], d == null ? 3 : d) + ' ' + pre[i][1] + unit;
    return U.fmt(v, 6) + ' ' + unit;
  };
  U.time = function (s, d) { return U.si(s, 's', d); };
  U.num = function (input, def) { var v = parseFloat(String(input).replace(/,/g, '')); return isFinite(v) ? v : def; };
  U.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  U.uid = (function () { var n = 0; return function (p) { n += 1; return (p || 'u') + n; }; })();
  U.debounce = function (fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); }; };
  U.reducedMotion = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  U.seg = function (options, value, onChange) {
    var wrap = U.el('div', { class: 'seg', role: 'group' });
    options.forEach(function (o) {
      var b = U.el('button', { type: 'button', 'aria-pressed': String(o[0] === value), text: o[1] });
      b.addEventListener('click', function () {
        wrap.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onChange(o[0]);
      });
      wrap.appendChild(b);
    });
    return wrap;
  };
  U.ctrl = function (label, input) {
    var id = input.id || U.uid('in');
    input.id = id;
    return U.el('div', { class: 'ctrl' }, [U.el('label', { for: id, text: label }), input]);
  };
  U.input = function (value, cls, type) {
    return U.el('input', { class: 'inp ' + (cls || 'w-m'), type: type || 'text', value: value, autocomplete: 'off', spellcheck: 'false', id: U.uid('in') });
  };
  U.readout = function (pairs) {
    var w = U.el('div', { class: 'readout' });
    pairs.forEach(function (p) { w.appendChild(U.el('div', { class: 'r' }, [U.el('span', { text: p[0] }), U.el('b', { html: p[1] })])); });
    return w;
  };
  // Theme change hook for canvases / 3D scenes
  U.onTheme = function (cb) { document.addEventListener('dcn:theme', cb); return function () { document.removeEventListener('dcn:theme', cb); }; };
  U.canvas = function (wrap, h) {
    var c = U.el('canvas');
    wrap.appendChild(c);
    var ctx = c.getContext('2d');
    function size() {
      var w = Math.max(280, wrap.clientWidth), dpr = Math.min(2, window.devicePixelRatio || 1);
      var hh = typeof h === 'function' ? h(w) : h;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      c.style.height = hh + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: hh };
    }
    return { c: c, ctx: ctx, size: size };
  };

  /* ---------------- theme ---------------- */
  var root = document.documentElement;
  function applyTheme(t) {
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    var btn = document.getElementById('theme-btn');
    if (btn) btn.setAttribute('aria-label', 'Theme: ' + (t || 'system') + ' (click to change)');
    var lab = document.getElementById('theme-label');
    if (lab) lab.textContent = t === 'light' ? 'Light' : t === 'dark' ? 'Dark' : 'Auto';
    document.dispatchEvent(new CustomEvent('dcn:theme'));
  }
  DCN.isDark = function () {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  };

  /* ---------------- progress ---------------- */
  var PKEY = 'dcn-progress-v1';
  var progress = U.store.get(PKEY, {}) || {};
  DCN.isDone = function (sid) { return !!progress[sid]; };
  DCN.setDone = function (sid, v) {
    if (v) progress[sid] = 1; else delete progress[sid];
    U.store.set(PKEY, progress);
    updateProgressUI();
  };
  var sectionIndex = {}; // sectionId -> chapterId
  var chapterSections = {}; // chapterId -> [ {id, title} ]
  function indexSections() {
    DCN.chapters.forEach(function (ch) {
      var list = [];
      var re = /<section class="topic[^"]*" id="([^"]+)"[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>/g, m;
      while ((m = re.exec(ch.html || ''))) { list.push({ id: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() }); sectionIndex[m[1]] = ch.id; }
      var re2 = /\sid="([a-z0-9][a-z0-9-]*)"/g;
      while ((m = re2.exec(ch.html || ''))) { if (!sectionIndex[m[1]]) sectionIndex[m[1]] = ch.id; }
      chapterSections[ch.id] = list;
    });
  }
  function chapterProgress(id) {
    var list = chapterSections[id] || [];
    if (!list.length) return 0;
    var d = list.filter(function (s) { return progress[s.id]; }).length;
    return d / list.length;
  }
  DCN.chapterProgress = chapterProgress;
  function updateProgressUI() {
    document.querySelectorAll('[data-prog]').forEach(function (bar) {
      var p = chapterProgress(bar.getAttribute('data-prog'));
      var i = bar.querySelector('i'); if (i) i.style.width = Math.round(p * 100) + '%';
    });
    var total = 0, done = 0;
    ordered().forEach(function (c) { if (c.part === 'X') return; var l = chapterSections[c.id] || []; total += l.length; done += l.filter(function (s) { return progress[s.id]; }).length; });
    document.querySelectorAll('[data-overall]').forEach(function (e) { e.textContent = total ? Math.round(done / total * 100) + '%' : '0%'; });
    document.querySelectorAll('[data-overall-count]').forEach(function (e) { e.textContent = done + ' / ' + total; });
    document.querySelectorAll('.toc a[data-sid]').forEach(function (a) { a.classList.toggle('done', !!progress[a.getAttribute('data-sid')]); });
  }

  /* ---------------- nav ---------------- */
  function navItem(ch, href) {
    var a = U.el('a', { class: 'nav-item layer-' + ch.layer, href: href || ('#' + ch.id), 'data-nav': ch.id });
    a.appendChild(U.el('span', { class: 'nav-dot', 'aria-hidden': 'true' }));
    var t = U.el('span', {});
    if (ch.num && ch.part !== 'X') t.appendChild(U.el('span', { class: 'nav-num', text: String(ch.num).padStart(2, '0') }));
    t.appendChild(document.createTextNode(ch.short || ch.title));
    a.appendChild(t);
    if (ch.part !== 'X') a.appendChild(U.el('span', { class: 'nav-prog', 'data-prog': ch.id, 'aria-hidden': 'true' }, [U.el('i')]));
    else a.appendChild(U.el('span'));
    return a;
  }
  function buildNav() {
    var nav = document.getElementById('sidenav');
    if (!nav) return;
    nav.innerHTML = '';
    var g0 = U.el('div', { class: 'nav-group' });
    g0.appendChild(U.el('div', { class: 'nav-label', text: 'Start here' }));
    g0.appendChild(navItem({ id: 'home', layer: 'tool', short: 'Home · syllabus map', part: 'X' }, '#home'));
    nav.appendChild(g0);
    [['A', 'Part A · Data communication'], ['B', 'Part B · Networking'], ['X', 'Toolkit']].forEach(function (g) {
      var list = ordered(g[0]);
      if (!list.length) return;
      var grp = U.el('div', { class: 'nav-group' });
      grp.appendChild(U.el('div', { class: 'nav-label', text: g[1] }));
      list.forEach(function (ch) { grp.appendChild(navItem(ch)); });
      nav.appendChild(grp);
    });
    var hint = U.el('p', { class: 'small muted', style: 'padding:0 10px', html: 'Progress is saved in this browser. Tick <b>Mark revised</b> at the end of each topic.' });
    nav.appendChild(hint);
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });
  }
  function setCurrentNav(id) {
    document.querySelectorAll('.nav-item').forEach(function (a) {
      if (a.getAttribute('data-nav') === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------------- mounting widgets & scenes ---------------- */
  var mounted = [];
  var sceneObserver = null;
  function mountWidgets(scope) {
    scope.querySelectorAll('[data-widget]').forEach(function (fig) {
      if (fig.__mounted) return;
      fig.__mounted = true;
      var name = fig.getAttribute('data-widget');
      var fn = DCN.widgets[name];
      var host = fig;
      if (fig.classList.contains('lab')) { host = U.el('div', { class: 'lab-body' }); fig.appendChild(host); }
      if (!fn) { host.appendChild(U.el('p', { class: 'hint', text: 'This lab is still loading. Refresh the page if it does not appear.' })); return; }
      try {
        var inst = fn(host, Object.assign({}, fig.dataset), fig);
        if (inst) mounted.push(inst);
      } catch (err) {
        host.appendChild(U.el('p', { class: 'hint', text: 'This lab could not start in this browser (' + err.message + ').' }));
        if (window.console) console.error(name, err);
      }
    });
  }
  function webglOK() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
  }
  function prepScene(fig) {
    // reserve the stage's space at once, so lazy mounting never shifts the page
    if (fig.__prepped) return;
    fig.__prepped = true;
    var body = U.el('div', { class: 'lab-body' });
    var stage = U.el('div', { class: 'stage' + (fig.dataset.tall ? ' tall' : '') });
    body.appendChild(stage);
    fig.appendChild(body);
    fig.__body = body; fig.__stage = stage;
  }
  function mountScene(fig) {
    if (fig.__mounted) return;
    fig.__mounted = true;
    prepScene(fig);
    var name = fig.getAttribute('data-scene');
    var body = fig.__body, stage = fig.__stage;
    if (!window.THREE || !webglOK() || !DCN.scenes[name]) {
      stage.appendChild(U.el('div', { class: 'fallback', html: '3D needs WebGL, which this browser has turned off. The notes around this lab cover the same idea.' }));
      return;
    }
    try {
      var inst = DCN.scenes[name](stage, Object.assign({}, fig.dataset), body, fig);
      if (inst) mounted.push(inst);
    } catch (err) {
      stage.appendChild(U.el('div', { class: 'fallback', text: '3D scene failed to start (' + err.message + ').' }));
      if (window.console) console.error(name, err);
    }
  }
  function mountScenes(scope) {
    var figs = scope.querySelectorAll('[data-scene]');
    if (!figs.length) return;
    figs.forEach(prepScene);
    if (!('IntersectionObserver' in window)) { figs.forEach(mountScene); return; }
    sceneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { mountScene(en.target); sceneObserver.unobserve(en.target); } });
    }, { rootMargin: '300px 0px' });
    figs.forEach(function (f) { sceneObserver.observe(f); });
  }
  function unmountAll() {
    mounted.forEach(function (m) { try { (m.destroy || m.dispose || function () {})(); } catch (e) { /* ignore */ } });
    mounted = [];
    if (sceneObserver) { sceneObserver.disconnect(); sceneObserver = null; }
    if (spyObserver) { spyObserver.disconnect(); spyObserver = null; }
  }
  DCN.mount = function (scope) { mountWidgets(scope); mountScenes(scope); };

  /* ---------------- quiz ---------------- */
  DCN.renderQuiz = function (host, qs, opts) {
    opts = opts || {};
    var key = 'dcn-quiz-' + (opts.id || 'x');
    var best = U.store.get(key, null);
    var wrap = U.el('div', { class: 'quiz' });
    var score = 0, answered = 0;
    var bar = U.el('div', { class: 'qscore' });
    var big = U.el('span', { class: 'big tnum', text: '0 / ' + qs.length });
    var bestEl = U.el('span', { class: 'muted small', text: best != null ? 'Best: ' + best + ' / ' + qs.length : 'Answer all questions to record a best score.' });
    var reset = U.el('button', { class: 'btn ghost sm', type: 'button', text: 'Reset quiz' });
    bar.appendChild(big); bar.appendChild(bestEl); bar.appendChild(reset);
    wrap.appendChild(bar);
    var cards = U.el('div', { class: 'quiz' });
    wrap.appendChild(cards);
    function build() {
      cards.innerHTML = ''; score = 0; answered = 0; big.textContent = '0 / ' + qs.length;
      qs.forEach(function (q, qi) {
        var card = U.el('div', { class: 'qcard' });
        card.appendChild(U.el('div', { class: 'qn', text: (opts.label ? opts.label(q, qi) : 'Question ' + (qi + 1)) }));
        card.appendChild(U.el('div', { class: 'qq', html: q.q }));
        var os = U.el('div', { class: 'qopts' });
        var why = U.el('div', { class: 'qwhy', hidden: true, html: (q.why || '') });
        q.o.forEach(function (opt, oi) {
          var b = U.el('button', { type: 'button', class: 'qopt' }, [U.el('span', { class: 'k', text: String.fromCharCode(65 + oi) }), U.el('span', { html: opt })]);
          b.addEventListener('click', function () {
            if (card.__done) return;
            card.__done = true; answered += 1;
            var ok = oi === q.a;
            if (ok) score += 1;
            os.querySelectorAll('.qopt').forEach(function (x, xi) { x.disabled = true; if (xi === q.a) x.classList.add('right'); });
            if (!ok) b.classList.add('wrong');
            why.hidden = false;
            why.innerHTML = '<b>' + (ok ? 'Correct.' : 'Not quite — answer ' + String.fromCharCode(65 + q.a) + '.') + '</b> ' + (q.why || '');
            big.textContent = score + ' / ' + qs.length;
            if (answered === qs.length) {
              if (best == null || score > best) { best = score; U.store.set(key, best); }
              bestEl.textContent = 'Done — you scored ' + score + '. Best: ' + best + ' / ' + qs.length;
            }
          });
          os.appendChild(b);
        });
        card.appendChild(os); card.appendChild(why);
        cards.appendChild(card);
      });
    }
    reset.addEventListener('click', build);
    build();
    host.appendChild(wrap);
    return wrap;
  };

  /* ---------------- TOC + scrollspy ---------------- */
  var spyObserver = null;
  function buildToc(ch, view) {
    var toc = document.getElementById('toc');
    var secs = view.querySelectorAll('section.topic[id]');
    toc.innerHTML = '';
    if (!secs.length) return;
    toc.appendChild(U.el('h5', { text: 'On this page' }));
    var links = {};
    secs.forEach(function (s) {
      var h = s.querySelector('h2');
      var a = U.el('a', { href: '#' + s.id, 'data-sid': s.id, text: h ? h.textContent : s.id });
      toc.appendChild(a); links[s.id] = a;
    });
    if ('IntersectionObserver' in window) {
      spyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
            if (links[en.target.id]) links[en.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      secs.forEach(function (s) { spyObserver.observe(s); });
    }
    updateProgressUI();
  }

  /* ---------------- views ---------------- */
  function renderHome(view) {
    var tpl = document.getElementById('tpl-home');
    view.className = 'view view-wide';
    view.innerHTML = tpl ? tpl.innerHTML : '<h1>Signal to Socket</h1>';
    // stack map
    var map = view.querySelector('#stackmap');
    if (map) {
      ['app', 'tl', 'net', 'dll', 'phy', 'found'].forEach(function (L) {
        var list = ordered().filter(function (c) { return c.layer === L && c.part !== 'X'; });
        if (!list.length) return;
        var row = U.el('div', { class: 'stack-row layer-' + L });
        row.appendChild(U.el('div', { class: 'lname' }, [U.el('b', { text: LAYERS[L].name }), U.el('span', { text: LAYERS[L].sub })]));
        var chs = U.el('div', { class: 'chs' });
        list.forEach(function (c) {
          var a = U.el('a', { class: 'ch-card', href: '#' + c.id });
          a.appendChild(U.el('span', { class: 'n', text: 'Ch ' + c.num + ' · ' + c.unit }));
          a.appendChild(U.el('span', { class: 't', text: c.title }));
          a.appendChild(U.el('span', { class: 'bar', 'data-prog': c.id }, [U.el('i')]));
          chs.appendChild(a);
        });
        row.appendChild(chs);
        map.appendChild(row);
      });
    }
    var cnt = view.querySelector('[data-topic-count]');
    if (cnt) { var n = 0; Object.keys(chapterSections).forEach(function (k) { var c = byId(k); if (c && c.part !== 'X') n += chapterSections[k].length; }); cnt.textContent = n; }
    document.getElementById('toc').innerHTML = '';
    document.querySelector('.shell').classList.remove('has-toc');
    DCN.mount(view);
    updateProgressUI();
  }

  function renderChapter(ch, view) {
    view.className = 'view layer-' + ch.layer + (ch.wide ? ' view-wide' : '');
    view.innerHTML = '';
    var head = U.el('header', { class: 'chapter-head' });
    var eb = U.el('div', { class: 'eyebrow' });
    if (ch.part !== 'X') eb.appendChild(U.el('span', { text: 'Chapter ' + ch.num }));
    if (ch.unit) eb.appendChild(U.el('span', { text: '· ' + ch.unit }));
    eb.appendChild(U.el('span', { class: 'layer-pill', text: (eb.childNodes.length ? '· ' : '') + (LAYERS[ch.layer] ? LAYERS[ch.layer].name : '') }));
    head.appendChild(eb);
    var h1 = U.el('h1', { tabindex: '-1', text: ch.title });
    head.appendChild(h1);
    if (ch.summary) head.appendChild(U.el('p', { class: 'summary', html: ch.summary }));
    if (ch.hot && ch.hot.length) {
      var hr = U.el('div', { class: 'chip-row' });
      ch.hot.forEach(function (h) { hr.appendChild(U.el('span', { class: 'chip hot', text: h })); });
      head.appendChild(hr);
    }
    if (ch.sources && ch.sources.length) {
      var sr = U.el('div', { class: 'chip-row', 'aria-label': 'Built from these files' });
      ch.sources.forEach(function (s) { sr.appendChild(U.el('span', { class: 'chip src', text: s })); });
      head.appendChild(sr);
    }
    if (ch.part !== 'X') {
      var hp = U.el('div', { class: 'head-progress' });
      hp.appendChild(U.el('span', { class: 'bar', 'data-prog': ch.id }, [U.el('i')]));
      var cntText = U.el('span', { class: 'tnum', text: '' });
      hp.appendChild(cntText);
      head.appendChild(hp);
      head.__cnt = cntText;
    }
    view.appendChild(head);
    // inline toc (small screens)
    var secs = chapterSections[ch.id] || [];
    if (secs.length > 1) {
      var det = U.el('details', { class: 'toc-inline' });
      det.appendChild(U.el('summary', { text: 'On this page · ' + secs.length + ' topics' }));
      var ol = U.el('ol');
      secs.forEach(function (s) { ol.appendChild(U.el('li', {}, [U.el('a', { href: '#' + s.id, text: s.title })])); });
      det.appendChild(ol);
      view.appendChild(det);
    }
    var prose = U.el('div', { class: 'prose', html: ch.html || '' });
    view.appendChild(prose);
    // mark-revised buttons
    if (ch.part !== 'X') prose.querySelectorAll('section.topic[id]').forEach(function (s) {
      var sid = s.id;
      var b = U.el('button', { type: 'button', class: 'done-btn', 'aria-pressed': String(DCN.isDone(sid)), text: DCN.isDone(sid) ? 'Revised' : 'Mark revised' });
      b.addEventListener('click', function () {
        var v = !DCN.isDone(sid);
        DCN.setDone(sid, v);
        b.setAttribute('aria-pressed', String(v)); b.textContent = v ? 'Revised' : 'Mark revised';
        updateCount();
      });
      s.appendChild(U.el('div', { class: 'topic-foot' }, [b]));
    });
    function updateCount() {
      if (!head.__cnt) return;
      var d = secs.filter(function (s) { return DCN.isDone(s.id); }).length;
      head.__cnt.textContent = d + ' of ' + secs.length + ' topics revised';
    }
    updateCount();
    // chapter quiz
    if (ch.quiz && ch.quiz.length) {
      var qs = U.el('section', { class: 'topic', id: ch.id + '-selftest' });
      qs.appendChild(U.el('h2', { text: 'Self-test · ' + ch.quiz.length + ' questions' }));
      qs.appendChild(U.el('p', { class: 'muted', text: 'Pick an answer to see the reasoning. Your best score is kept in this browser.' }));
      DCN.renderQuiz(qs, ch.quiz, { id: ch.id });
      prose.appendChild(qs);
    }
    // pager
    var all = ordered().filter(function (c) { return c.part === ch.part || (ch.part !== 'X' && c.part !== 'X'); });
    if (ch.part !== 'X') all = ordered().filter(function (c) { return c.part !== 'X'; });
    var i = all.indexOf(ch);
    var pg = U.el('nav', { class: 'pager', 'aria-label': 'Chapter navigation' });
    var prev = all[i - 1], next = all[i + 1];
    pg.appendChild(prev ? U.el('a', { class: 'prev', href: '#' + prev.id }, [U.el('span', { text: '← Previous' }), U.el('b', { text: prev.title })]) : U.el('span'));
    pg.appendChild(next ? U.el('a', { class: 'next', href: '#' + next.id }, [U.el('span', { text: 'Next →' }), U.el('b', { text: next.title })]) : U.el('a', { class: 'next', href: '#questions' }, [U.el('span', { text: 'Then →' }), U.el('b', { text: 'Exam question bank' })]));
    view.appendChild(pg);
    document.querySelector('.shell').classList.add('has-toc');
    buildToc(ch, view);
    if (typeof ch.init === 'function') { try { var inst = ch.init(view); if (inst) mounted.push(inst); } catch (e) { if (window.console) console.error(e); } }
    DCN.mount(view);
    updateProgressUI();
    return h1;
  }

  var currentChapter = null;
  function route() {
    var hash = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    var view = document.getElementById('view');
    var target = null, chId = hash || 'home';
    if (chId !== 'home' && !byId(chId)) {
      if (sectionIndex[chId]) { target = chId; chId = sectionIndex[chId]; }
      else chId = 'home';
    }
    if (chId === currentChapter && target) { scrollToId(target); return; }
    unmountAll();
    currentChapter = chId;
    setCurrentNav(chId);
    var focusEl = null;
    if (chId === 'home') { renderHome(view); document.title = 'Signal to Socket'; }
    else { var ch = byId(chId); focusEl = renderChapter(ch, view); document.title = (ch.short || ch.title) + ' · Signal to Socket'; }
    if (target) { setTimeout(function () { scrollToId(target); }, 30); }
    else {
      window.scrollTo(0, 0);
      if (focusEl) { try { focusEl.focus({ preventScroll: true }); } catch (e) { focusEl.focus(); } }
    }
    try { document.dispatchEvent(new CustomEvent('dcn:route', { detail: { id: chId, target: target } })); } catch (e) { /* old browser */ }
  }
  DCN.currentChapter = function () { return currentChapter; };
  var settleTimers = [];
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'start', behavior: U.reducedMotion() ? 'auto' : 'smooth' });
    el.classList.remove('anchor-hl'); void el.offsetWidth; el.classList.add('anchor-hl');
    // labs above the target may still grow while they mount: re-align once, unless the reader has scrolled
    settleTimers.forEach(clearTimeout); settleTimers = [];
    var touched = false, mark = function () { touched = true; };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, mark, { once: true, passive: true }); });
    [900, 1800].forEach(function (ms) {
      settleTimers.push(setTimeout(function () {
        if (touched || !document.body.contains(el)) return;
        var want = parseFloat(getComputedStyle(el).scrollMarginTop) || 0, top = el.getBoundingClientRect().top;
        if (Math.abs(top - want) > 12) el.scrollIntoView({ block: 'start', behavior: 'auto' });
      }, ms));
    });
  }
  DCN.go = function (hash) { if (location.hash === '#' + hash) route(); else location.hash = hash; };

  /* ---------------- search ---------------- */
  var searchIndex = null;
  function buildSearch() {
    searchIndex = [];
    var tmp = document.createElement('div');
    ordered().forEach(function (ch) {
      tmp.innerHTML = ch.html || '';
      tmp.querySelectorAll('figure,[data-widget],[data-scene],script,style').forEach(function (n) { n.remove(); });
      var secs = tmp.querySelectorAll('section.topic[id]');
      searchIndex.push({ ch: ch, id: ch.id, title: ch.title, text: (ch.summary || '').replace(/<[^>]+>/g, '') + ' ' + (ch.keywords || ''), lvl: 0 });
      secs.forEach(function (s) {
        var h = s.querySelector('h2');
        var title = h ? h.textContent.trim() : s.id;
        searchIndex.push({ ch: ch, id: s.id, title: title, text: s.textContent.replace(/\s+/g, ' '), lvl: 1 });
        s.querySelectorAll('h3[id],h4[id]').forEach(function (hh) {
          var txt = '', n = hh.nextElementSibling, k = 0;
          while (n && k < 4 && !/^H[234]$/.test(n.tagName)) { txt += ' ' + n.textContent; n = n.nextElementSibling; k++; }
          searchIndex.push({ ch: ch, id: hh.id, title: title + ' › ' + hh.textContent.trim(), text: txt.replace(/\s+/g, ' '), lvl: 2 });
        });
      });
    });
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function doSearch(q) {
    if (!searchIndex) buildSearch();
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];
    var terms = q.split(/\s+/).filter(Boolean);
    var out = [];
    searchIndex.forEach(function (e) {
      var t = e.title.toLowerCase(), x = e.text.toLowerCase(), sc = 0, ok = true;
      terms.forEach(function (w) {
        var inT = t.indexOf(w) >= 0, inX = x.indexOf(w) >= 0;
        if (!inT && !inX) ok = false;
        sc += (inT ? 10 : 0) + (inX ? 2 + Math.min(4, x.split(w).length - 1) : 0);
      });
      if (ok) { sc += e.lvl === 1 ? 2 : e.lvl === 2 ? 3 : 0; out.push({ e: e, sc: sc }); }
    });
    out.sort(function (a, b) { return b.sc - a.sc; });
    return out.slice(0, 40).map(function (r) {
      var x = r.e.text, lx = x.toLowerCase(), p = lx.indexOf(terms[0]);
      var snip = p >= 0 ? (p > 60 ? '…' : '') + x.slice(Math.max(0, p - 60), p + 140) + '…' : x.slice(0, 160);
      return { e: r.e, snip: snip, terms: terms };
    });
  }
  function hl(s, terms) {
    var h = esc(s);
    terms.forEach(function (w) { if (w.length < 2) return; h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return h;
  }
  function setupSearch() {
    var dlg = document.getElementById('search-dlg');
    var inp = document.getElementById('search-input');
    var res = document.getElementById('search-results');
    var sel = -1;
    function open() { dlg.classList.add('open'); inp.value = ''; res.innerHTML = '<div class="search-empty">Search every chapter: try <b>shannon</b>, <b>bit stuffing</b>, <b>slow start</b>, <b>MX record</b>…</div>'; setTimeout(function () { inp.focus(); }, 10); }
    function close() { dlg.classList.remove('open'); }
    DCN.openSearch = open;
    document.querySelectorAll('[data-open-search]').forEach(function (b) { b.addEventListener('click', open); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    inp.addEventListener('input', U.debounce(function () {
      var r = doSearch(inp.value); sel = -1;
      var askRow = null;
      if (DCN.assistant && inp.value.trim().length >= 3) {
        var qv = inp.value.trim();
        askRow = U.el('a', { href: '#assistant', class: 'ask-row' });
        askRow.innerHTML = '<span class="where">Study assistant</span><span class="t">Ask: “' + esc(qv) + '”</span><span class="s">Get an answer written from your notes, with sources.</span>';
        askRow.addEventListener('click', function (ev) { ev.preventDefault(); close(); DCN.assistant.open({ q: qv, send: true }); });
      }
      if (!r.length) { res.innerHTML = '<div class="search-empty">' + (inp.value.trim().length < 2 ? 'Type at least two letters.' : 'No match. Try a shorter word, e.g. <b>crc</b> or <b>aloha</b>, or ask the assistant.') + '</div>'; if (askRow) res.insertBefore(askRow, res.firstChild); return; }
      res.innerHTML = '';
      // a question goes to the assistant first; a keyword search lists topics first
      var asksQ = askRow && (/\?\s*$/.test(inp.value) || /^(what|why|how|when|which|who|explain|describe|define|difference|compare|list|write|solve|find|calculate|derive)\b/i.test(inp.value.trim()) || inp.value.trim().split(/\s+/).length >= 4);
      if (asksQ) res.appendChild(askRow);
      r.forEach(function (x) {
        var a = U.el('a', { href: '#' + x.e.id, class: 'layer-' + x.e.ch.layer });
        a.innerHTML = '<span class="where">' + esc(x.e.ch.part === 'X' ? x.e.ch.title : 'Ch ' + x.e.ch.num + ' · ' + x.e.ch.short) + '</span><span class="t">' + hl(x.e.title, x.terms) + '</span><span class="s">' + hl(x.snip, x.terms) + '</span>';
        a.addEventListener('click', close);
        res.appendChild(a);
      });
      if (askRow && !asksQ) res.appendChild(askRow);
    }, 120));
    inp.addEventListener('keydown', function (e) {
      var items = res.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        sel = U.clamp(sel + (e.key === 'ArrowDown' ? 1 : -1), 0, items.length - 1);
        items.forEach(function (a, i) { a.classList.toggle('sel', i === sel); });
        if (items[sel]) items[sel].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') { var t = items[Math.max(0, sel)]; if (t) { if (t.classList.contains('ask-row')) t.click(); else { location.hash = t.getAttribute('href').slice(1); close(); } } }
      else if (e.key === 'Escape') close();
    });
    document.addEventListener('keydown', function (e) {
      var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
      else if (e.key === 'Escape' && dlg.classList.contains('open')) close();
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    applyTheme(U.store.get('dcn-theme', 'system'));
    var tb = document.getElementById('theme-btn');
    if (tb) tb.addEventListener('click', function () {
      var cur = U.store.get('dcn-theme', 'system');
      var nxt = cur === 'system' ? (DCN.isDark() ? 'light' : 'dark') : cur === 'light' ? 'dark' : 'system';
      U.store.set('dcn-theme', nxt); applyTheme(nxt);
    });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var f = function () { if (!root.getAttribute('data-theme')) document.dispatchEvent(new CustomEvent('dcn:theme')); };
      if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f);
    }
    var mb = document.getElementById('menu-btn');
    if (mb) mb.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
    var scrim = document.getElementById('scrim');
    if (scrim) scrim.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    indexSections();
    buildNav();
    setupSearch();
    window.addEventListener('hashchange', route);
    route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
