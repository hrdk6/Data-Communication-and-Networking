/* Signal to Socket — physical-layer labs (2D)
   db · capacity · perf · baud · mesh · linecoding · pcm · modulation · fdm · tdm */
(function () {
  'use strict';
  var DCN = window.DCN, U = DCN.util, W = DCN.widgets;
  var el = U.el, svg = U.svg, fmt = U.fmt;

  function work(lines) { return el('div', { class: 'workings', html: lines.join('\n') }); }
  function presetRow(host, presets, apply) {
    var r = el('div', { class: 'ctrls' });
    r.appendChild(el('span', { class: 'hint', text: 'Load an example:' }));
    presets.forEach(function (p) { r.appendChild(el('button', { type: 'button', class: 'btn ghost sm', text: p[0], onclick: function () { apply(p[1]); } })); });
    host.appendChild(r);
    return r;
  }
  function unitIn(val, units, def) {
    var wrap = el('span', { style: 'display:inline-flex;gap:4px' });
    var i = U.input(val, 'w-s', 'text');
    var s = el('select', { class: 'inp', 'aria-label': 'unit' });
    units.forEach(function (u) { s.appendChild(el('option', { value: String(u[1]), text: u[0] })); });
    s.value = String(def);
    wrap.appendChild(i); wrap.appendChild(s);
    return { wrap: wrap, inp: i, sel: s, get: function () { return U.num(i.value, NaN) * +s.value; }, set: function (v, mul) { i.value = v; if (mul) s.value = String(mul); } };
  }
  var HZ = [['Hz', 1], ['kHz', 1e3], ['MHz', 1e6], ['GHz', 1e9]];
  var BPS = [['bps', 1], ['kbps', 1e3], ['Mbps', 1e6], ['Gbps', 1e9]];

  /* ---------------- dB / SNR ---------------- */
  W.db = function (host, o) {
    var mode = o.mode || 'ratio';
    var body = el('div', { style: 'display:grid;gap:12px' });
    host.appendChild(U.seg([['ratio', 'Gain / loss from powers'], ['chain', 'Add up a chain'], ['snr', 'SNR'], ['dbm', 'dBm']], mode, function (v) { mode = v; draw(); }));
    host.appendChild(body);
    var st = { p1: '10', p2: '5', chain: '-3, 7, -3', s: '10', sU: 1e-3, n: '1', nU: 1e-6, snrdb: '36', dbm: '-30', mw: '0.001' };
    function draw() {
      body.innerHTML = '';
      var row = el('div', { class: 'ctrls' }); body.appendChild(row);
      var out = el('div', { style: 'display:grid;gap:10px' }); body.appendChild(out);
      function calc() { out.innerHTML = ''; compute(out); }
      if (mode === 'ratio') {
        var a = U.input(st.p1, 'w-s'), b = U.input(st.p2, 'w-s');
        row.appendChild(U.ctrl('P₁ (in)', a)); row.appendChild(U.ctrl('P₂ (out, same unit)', b));
        [a, b].forEach(function (x) { x.addEventListener('input', function () { st.p1 = a.value; st.p2 = b.value; calc(); }); });
        compute = function (o2) {
          var p1 = U.num(st.p1, NaN), p2 = U.num(st.p2, NaN);
          if (!(p1 > 0 && p2 > 0)) { o2.appendChild(el('p', { class: 'hint', text: 'Enter two positive powers.' })); return; }
          var db = 10 * Math.log10(p2 / p1);
          o2.appendChild(U.readout([['Ratio P₂/P₁', fmt(p2 / p1, 4)], ['Decibels', fmt(db, 3) + ' dB'], ['Meaning', db < 0 ? 'attenuated (loss)' : db > 0 ? 'amplified (gain)' : 'no change']]));
          o2.appendChild(work(['dB = 10 log₁₀(P₂ / P₁)', '   = 10 log₁₀(' + st.p2 + ' / ' + st.p1 + ')', '   = 10 × ' + fmt(Math.log10(p2 / p1), 4), '   = <b>' + fmt(db, 3) + ' dB</b>']));
        };
      } else if (mode === 'chain') {
        var cIn = U.input(st.chain, 'w-l');
        row.appendChild(U.ctrl('dB of each stage (comma separated)', cIn));
        cIn.addEventListener('input', function () { st.chain = cIn.value; calc(); });
        compute = function (o2) {
          var parts = st.chain.split(/[,\s]+/).filter(Boolean).map(Number).filter(isFinite);
          var tot = parts.reduce(function (s, v) { return s + v; }, 0);
          o2.appendChild(U.readout([['Stages', String(parts.length)], ['Total', fmt(tot, 3) + ' dB'], ['Overall power ratio', '×' + fmt(Math.pow(10, tot / 10), 4)]]));
          o2.appendChild(work(['Decibels of cascaded stages simply add:', '   dB = ' + parts.map(function (v) { return v < 0 ? '(' + v + ')' : v; }).join(' + ') + ' = <b>' + fmt(tot, 3) + ' dB</b>']));
        };
      } else if (mode === 'snr') {
        var s = unitIn(st.s, [['W', 1], ['mW', 1e-3], ['µW', 1e-6]], st.sU), n = unitIn(st.n, [['W', 1], ['mW', 1e-3], ['µW', 1e-6]], st.nU);
        var sd = U.input(st.snrdb, 'w-s');
        row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Signal power' }), s.wrap]));
        row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Noise power' }), n.wrap]));
        var row2 = el('div', { class: 'ctrls' }); body.insertBefore(row2, out);
        row2.appendChild(U.ctrl('…or convert SNRdB →', sd));
        function upd() { st.s = s.inp.value; st.sU = +s.sel.value; st.n = n.inp.value; st.nU = +n.sel.value; st.snrdb = sd.value; calc(); }
        [s.inp, s.sel, n.inp, n.sel, sd].forEach(function (x) { x.addEventListener('input', upd); x.addEventListener('change', upd); });
        compute = function (o2) {
          var S = U.num(st.s, NaN) * st.sU, N = U.num(st.n, NaN) * st.nU, snr = S / N, sdb = 10 * Math.log10(snr);
          var g = U.num(st.snrdb, NaN), back = Math.pow(10, g / 10);
          o2.appendChild(U.readout([['SNR', isFinite(snr) ? fmt(snr, 3) : '—'], ['SNRdB', isFinite(sdb) ? fmt(sdb, 3) + ' dB' : '—'], ['SNR from ' + st.snrdb + ' dB', isFinite(back) ? fmt(back, 2) : '—']]));
          o2.appendChild(work(['SNR = average signal power / average noise power', '    = ' + U.si(S, 'W') + ' / ' + U.si(N, 'W') + ' = <b>' + fmt(snr, 3) + '</b>', 'SNRdB = 10 log₁₀ SNR = 10 log₁₀(' + fmt(snr, 3) + ') = <b>' + fmt(sdb, 3) + ' dB</b>', '', 'Reverse: SNR = 10^(SNRdB/10) = 10^(' + st.snrdb + '/10) = <b>' + fmt(back, 2) + '</b>']));
        };
      } else {
        var dIn = U.input(st.dbm, 'w-s'), mIn = U.input(st.mw, 'w-s');
        row.appendChild(U.ctrl('dBm', dIn)); row.appendChild(U.ctrl('Power in mW', mIn));
        dIn.addEventListener('input', function () { st.dbm = dIn.value; st.mw = fmt(Math.pow(10, U.num(dIn.value, 0) / 10), 6); mIn.value = st.mw; calc(); });
        mIn.addEventListener('input', function () { st.mw = mIn.value; var v = U.num(mIn.value, NaN); st.dbm = v > 0 ? fmt(10 * Math.log10(v), 3) : ''; dIn.value = st.dbm; calc(); });
        compute = function (o2) {
          var d = U.num(st.dbm, NaN), p = Math.pow(10, d / 10);
          o2.appendChild(U.readout([['dBm', fmt(d, 3)], ['Pm', U.si(p * 1e-3, 'W', 4)]]));
          o2.appendChild(work(['dBm = 10 log₁₀ Pm   (Pm in milliwatts)', '   ' + st.dbm + ' = 10 log₁₀ Pm  →  log₁₀ Pm = ' + fmt(d / 10, 4), '   Pm = 10^' + fmt(d / 10, 4) + ' = <b>' + fmt(p, 6) + ' mW</b>']));
        };
      }
      calc();
    }
    var compute = function () {};
    draw();
  };

  /* ---------------- Nyquist & Shannon ---------------- */
  W.capacity = function (host, o) {
    var B = unitIn(o.b || '3.4', HZ, o.bu ? +o.bu : 1e3);
    var L = U.input(o.l || '2', 'w-s');
    var snr = U.input(o.snr || '30', 'w-s');
    var snrKind = el('select', { class: 'inp', 'aria-label': 'SNR given as' }, [el('option', { value: 'db', text: 'dB' }), el('option', { value: 'ratio', text: 'ratio' })]);
    snrKind.value = o.snrkind || 'db';
    var tgt = unitIn(o.target || '4800', BPS, 1);
    var row = el('div', { class: 'ctrls' });
    row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Bandwidth B' }), B.wrap]));
    row.appendChild(U.ctrl('Signal levels L', L));
    row.appendChild(el('div', { class: 'ctrl' }, [el('label', { for: snr.id, text: 'SNR' }), snr, snrKind]));
    row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Target rate' }), tgt.wrap]));
    host.appendChild(row);
    presetRow(host, [
      ['IA-1 Q4b: 3.4 kHz, 30 dB', { b: '3.4', bu: 1e3, l: '2', snr: '30', k: 'db', t: '4800', tu: 1 }],
      ['4000 Hz, 4 levels', { b: '4000', bu: 1, l: '4', snr: '0', k: 'ratio', t: '16000', tu: 1 }],
      ['20 kHz for 280 kbps', { b: '20', bu: 1e3, l: '2', snr: '3162', k: 'ratio', t: '280', tu: 1e3 }],
      ['3000 Hz, SNR 3162', { b: '3000', bu: 1, l: '2', snr: '3162', k: 'ratio', t: '34000', tu: 1 }],
      ['2 MHz, 36 dB', { b: '2', bu: 1e6, l: '4', snr: '36', k: 'db', t: '20', tu: 1e6 }],
      ['1 MHz, SNR 63', { b: '1', bu: 1e6, l: '4', snr: '63', k: 'ratio', t: '4', tu: 1e6 }]
    ], function (p) { B.set(p.b, p.bu); L.value = p.l; snr.value = p.snr; snrKind.value = p.k; tgt.set(p.t, p.tu); calc(); });
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      out.innerHTML = '';
      var b = B.get(), l = U.num(L.value, NaN), sv = U.num(snr.value, NaN), t = tgt.get();
      var ratio = snrKind.value === 'db' ? Math.pow(10, sv / 10) : sv;
      var nyq = 2 * b * U.log2(l), cap = b * U.log2(1 + ratio);
      var Lneed = Math.pow(2, t / (2 * b)), snrNeed = Math.pow(2, t / b) - 1;
      out.appendChild(U.readout([['Nyquist max bit rate', U.si(nyq, 'bps')], ['Shannon capacity C', U.si(cap, 'bps')], ['Levels needed for target', fmt(Lneed, 3) + ' → use ' + Math.pow(2, Math.ceil(U.log2(Math.max(1.000001, Lneed)) - 1e-9))], ['SNR needed for target', fmt(snrNeed, 4) + ' (' + fmt(10 * Math.log10(snrNeed), 3) + ' dB)']]));
      var lines = [
        '<b>Noiseless channel — Nyquist</b>',
        'BitRate = 2 × B × log₂L = 2 × ' + fmt(b) + ' × log₂' + fmt(l) + ' = 2 × ' + fmt(b) + ' × ' + fmt(U.log2(l), 4) + ' = <b>' + fmt(nyq, 2) + ' bps</b>',
        '',
        '<b>Noisy channel — Shannon</b>'
      ];
      if (snrKind.value === 'db') lines.push('SNR = 10^(SNRdB/10) = 10^(' + fmt(sv) + '/10) = ' + fmt(ratio, 3));
      lines.push('C = B × log₂(1 + SNR) = ' + fmt(b) + ' × log₂(' + fmt(1 + ratio, 3) + ') = ' + fmt(b) + ' × ' + fmt(U.log2(1 + ratio), 4) + ' = <b>' + fmt(cap, 2) + ' bps</b>');
      lines.push('', '<b>Reverse problems for target ' + fmt(t) + ' bps</b>');
      lines.push('Levels: ' + fmt(t) + ' = 2 × ' + fmt(b) + ' × log₂L → log₂L = ' + fmt(t / (2 * b), 4) + ' → L = ' + fmt(Lneed, 4));
      lines.push('SNR:    ' + fmt(t) + ' = ' + fmt(b) + ' × log₂(1 + SNR) → 1 + SNR = 2^' + fmt(t / b, 4) + ' → SNR = ' + fmt(snrNeed, 4) + ' = ' + fmt(10 * Math.log10(snrNeed), 3) + ' dB');
      out.appendChild(work(lines));
      if (cap > 0 && isFinite(cap)) out.appendChild(el('p', { class: 'hint', html: 'Shannon gives the <b>upper limit</b>. A practical design picks a bit rate below C, then uses Nyquist to find how many signal levels that rate needs.' }));
    }
    [B.inp, B.sel, L, snr, snrKind, tgt.inp, tgt.sel].forEach(function (x) { x.addEventListener('input', calc); x.addEventListener('change', calc); });
    calc();
  };

  /* ---------------- performance: delays, BDP, bit length ---------------- */
  W.perf = function (host, o) {
    var size = unitIn(o.size || '2.5', [['bits', 1], ['bytes', 8], ['KB', 8e3], ['MB', 8e6]], o.su ? +o.su : 8e3);
    var bw = unitIn(o.bw || '1', BPS, o.bwu ? +o.bwu : 1e9);
    var dist = U.input(o.dist || '12000', 'w-s');
    var speed = U.input(o.speed || '2.4e8', 'w-s');
    var extra = U.input(o.extra || '0', 'w-s');
    var row = el('div', { class: 'ctrls' });
    row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Message size' }), size.wrap]));
    row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Bandwidth' }), bw.wrap]));
    row.appendChild(U.ctrl('Distance (km)', dist));
    row.appendChild(U.ctrl('Propagation speed (m/s)', speed));
    row.appendChild(U.ctrl('Queuing + processing (ms)', extra));
    host.appendChild(row);
    presetRow(host, [
      ['E-mail 2.5 KB on 1 Gbps', { s: '2.5', su: 8e3, b: '1', bu: 1e9, d: '12000', v: '2.4e8' }],
      ['Image 5 MB on 1 Mbps', { s: '5', su: 8e6, b: '1', bu: 1e6, d: '12000', v: '2.4e8' }],
      ['512 kbps link, 500 km', { s: '1000', su: 1, b: '512', bu: 1e3, d: '500', v: '2e8' }]
    ], function (p) { size.set(p.s, p.su); bw.set(p.b, p.bu); dist.value = p.d; speed.value = p.v; calc(); });
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      out.innerHTML = '';
      var bits = size.get(), B = bw.get(), d = U.num(dist.value, 0) * 1000, v = U.num(speed.value, 2e8), q = U.num(extra.value, 0) / 1000;
      var tt = bits / B, tp = d / v, lat = tt + tp + q, bdp = B * tp, bl = v / B;
      out.appendChild(U.readout([['Transmission time', U.time(tt)], ['Propagation time', U.time(tp)], ['Latency (total)', U.time(lat)], ['Bandwidth × delay', U.si(bdp, 'bits') + ' (one way)'], ['BDP using RTT', U.si(2 * bdp, 'bits')], ['Bit length', U.si(bl, 'm')]]));
      out.appendChild(work([
        'Transmission time = message size / bandwidth = ' + fmt(bits) + ' / ' + fmt(B) + ' = <b>' + U.time(tt) + '</b>',
        'Propagation time  = distance / propagation speed = ' + fmt(d) + ' m / ' + fmt(v) + ' = <b>' + U.time(tp) + '</b>',
        'Latency = propagation + transmission + queuing + processing = <b>' + U.time(lat) + '</b>',
        'Bandwidth-delay product = ' + fmt(B) + ' × ' + U.time(tp) + ' = <b>' + U.si(bdp, 'bits') + '</b> can be "in flight" on the link',
        'Bit length = propagation speed × bit duration = ' + fmt(v) + ' × (1/' + fmt(B) + ') = <b>' + U.si(bl, 'm') + '</b>',
        '', tt > tp ? 'Transmission time dominates: the message is large compared with the link rate.' : 'Propagation time dominates: the link is fast, so distance decides the delay.'
      ]));
    }
    [size.inp, size.sel, bw.inp, bw.sel, dist, speed, extra].forEach(function (x) { x.addEventListener('input', calc); x.addEventListener('change', calc); });
    calc();
  };

  /* ---------------- bit rate vs baud ---------------- */
  W.baud = function (host, o) {
    var N = U.input(o.n || '8000', 'w-m'), S = U.input(o.s || '1000', 'w-m');
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.ctrl('Bit rate N (bps)', N)); row.appendChild(U.ctrl('Baud rate S (baud)', S));
    host.appendChild(row);
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      out.innerHTML = '';
      var n = U.num(N.value, NaN), s = U.num(S.value, NaN), r = n / s, L = Math.pow(2, r);
      out.appendChild(U.readout([['Data elements per signal element r', fmt(r, 4)], ['Signal levels L = 2^r', isFinite(L) ? fmt(L, 3) : '—'], ['Average baud for this N (c = ½)', fmt(0.5 * n / r, 2) + ' baud']]));
      out.appendChild(work(['r = N / S = ' + fmt(n) + ' / ' + fmt(s) + ' = <b>' + fmt(r, 4) + ' bits per signal element</b>', 'L = 2^r = 2^' + fmt(r, 4) + ' = <b>' + fmt(L, 3) + ' signal levels</b>', 'Check: S = N / log₂L = ' + fmt(n) + ' / ' + fmt(U.log2(L), 4) + ' = ' + fmt(n / U.log2(L), 2) + ' baud']));
    }
    [N, S].forEach(function (x) { x.addEventListener('input', calc); });
    calc();
  };

  /* ---------------- mesh links ---------------- */
  W.mesh = function (host, o) {
    var n = U.input(o.n || '5', 'w-s');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Devices n', n)]));
    var out = el('div'); host.appendChild(out);
    function calc() {
      var v = Math.max(0, Math.round(U.num(n.value, 0)));
      out.innerHTML = '';
      out.appendChild(U.readout([['Duplex links n(n−1)/2', String(v * (v - 1) / 2)], ['Simplex links n(n−1)', String(v * (v - 1))], ['I/O ports per device', String(Math.max(0, v - 1))], ['Total ports', String(v * (v - 1))], ['Star: links needed', String(v)]]));
    }
    n.addEventListener('input', calc); calc();
  };

  /* ---------------- line coding ---------------- */
  var LC = {
    unrz: { n: 'Unipolar NRZ', rule: '1 → +V, 0 → 0 V for the whole bit.', r: '1', baud: 'N/2', dc: 'Yes', sync: 'No (long 0s or 1s)', note: 'Costly: needs twice the power of polar NRZ.' },
    nrzl: { n: 'Polar NRZ-L', rule: 'The level decides the bit: 0 → +V, 1 → −V.', r: '1', baud: 'N/2', dc: 'Yes', sync: 'No (long 0s or 1s)', note: 'Baseline wandering on long runs; a polarity reversal on the wire flips every bit.' },
    nrzi: { n: 'Polar NRZ-I', rule: 'A change of level means 1, no change means 0 (invert on 1).', r: '1', baud: 'N/2', dc: 'Yes', sync: 'Only long 0s are a problem', note: 'Immune to polarity reversal.' },
    rz: { n: 'Polar RZ', rule: '1 → +V, 0 → −V for the first half; the signal returns to 0 at mid-bit.', r: '½', baud: 'N', dc: 'No', sync: 'Yes', note: 'Three levels and two changes per bit, so it needs more bandwidth.' },
    manch: { n: 'Manchester', rule: 'Transition at the middle of every bit: 0 → high-to-low, 1 → low-to-high.', r: '½', baud: 'N', dc: 'No', sync: 'Yes (mid-bit transition)', note: 'Combines RZ and NRZ-L. Bandwidth is twice that of NRZ.' },
    dman: { n: 'Differential Manchester', rule: 'Always a mid-bit transition. At the start of the bit: 0 → transition, 1 → no transition.', r: '½', baud: 'N', dc: 'No', sync: 'Yes', note: 'Combines RZ and NRZ-I; immune to polarity reversal.' },
    ami: { n: 'Bipolar AMI', rule: '0 → 0 V; each 1 alternates between +V and −V.', r: '1', baud: 'N/2', dc: 'No', sync: 'Lost on long 0s', note: 'Energy concentrated around N/2; used for long-distance links.' },
    pseudo: { n: 'Pseudoternary', rule: '1 → 0 V; each 0 alternates between +V and −V.', r: '1', baud: 'N/2', dc: 'No', sync: 'Lost on long 1s', note: 'The mirror image of AMI.' }
  };
  function lcLevels(k, bits, start) {
    var out = [], lvl = start, last = -1;
    bits.forEach(function (b) {
      if (k === 'unrz') out.push(b ? 1 : 0, b ? 1 : 0);
      else if (k === 'nrzl') out.push(b ? -1 : 1, b ? -1 : 1);
      else if (k === 'nrzi') { if (b) lvl = -lvl; out.push(lvl, lvl); }
      else if (k === 'rz') out.push(b ? 1 : -1, 0);
      else if (k === 'manch') out.push(b ? -1 : 1, b ? 1 : -1);
      else if (k === 'dman') { var first = b ? lvl : -lvl; out.push(first, -first); lvl = -first; }
      else if (k === 'ami') { if (!b) out.push(0, 0); else { last = -last; out.push(last, last); } }
      else if (k === 'pseudo') { if (b) out.push(0, 0); else { last = -last; out.push(last, last); } }
    });
    return out;
  }
  W.linecoding = function (host, o) {
    var bitsIn = U.input(o.bits || '1011001011', 'w-l');
    var start = 1, shown = (o.show || 'unrz,nrzl,nrzi,rz,manch').split(',');
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.ctrl('Bits', bitsIn));
    row.appendChild(el('span', { class: 'hint', text: 'Line level before the first bit:' }));
    row.appendChild(U.seg([['1', 'High'], ['-1', 'Low']], '1', function (v) { start = +v; draw(); }));
    host.appendChild(row);
    var picks = el('div', { class: 'ctrls' });
    Object.keys(LC).forEach(function (k) {
      var id = U.uid('lc');
      var cb = el('input', { type: 'checkbox', id: id });
      cb.checked = shown.indexOf(k) >= 0;
      cb.addEventListener('change', function () { shown = Object.keys(LC).filter(function (kk) { return picks.querySelector('[data-k="' + kk + '"]').checked; }); draw(); });
      cb.setAttribute('data-k', k);
      picks.appendChild(el('label', { class: 'ctrl', for: id, style: 'gap:6px;cursor:pointer' }, [cb, LC[k].n]));
    });
    host.appendChild(picks);
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var tbl = el('div', { class: 'table-wrap' }); host.appendChild(tbl);
    function draw() {
      var bits = bitsIn.value.replace(/[^01]/g, '').split('').map(Number).slice(0, 32);
      wrap.innerHTML = '';
      if (!bits.length) { wrap.appendChild(el('p', { class: 'hint', text: 'Type a string of 0s and 1s.' })); return; }
      var bw = Math.max(34, Math.min(64, 640 / bits.length)), lw = 150, rowH = 78, top = 30;
      var Wd = lw + bits.length * bw + 16, Hd = top + shown.length * rowH + 8;
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, width: Wd, height: Hd, role: 'img', 'aria-label': 'Line coding waveforms for ' + bits.join('') });
      s.style.minWidth = Math.min(Wd, 520) + 'px';
      bits.forEach(function (b, i) {
        var x = lw + i * bw;
        s.appendChild(svg('text', { x: x + bw / 2, y: 18, 'text-anchor': 'middle', class: 'mono', style: 'font-size:14px;font-weight:600;fill:var(--ink)', text: String(b) }));
        s.appendChild(svg('line', { x1: x, y1: 24, x2: x, y2: Hd - 4, style: 'stroke:var(--line-2);stroke-dasharray:3 4' }));
      });
      s.appendChild(svg('line', { x1: lw + bits.length * bw, y1: 24, x2: lw + bits.length * bw, y2: Hd - 4, style: 'stroke:var(--line-2);stroke-dasharray:3 4' }));
      var palette = ['--phy', '--net', '--dll', '--tl', '--app', '--accent', '--tip', '--tool'];
      shown.forEach(function (k, ri) {
        var y0 = top + ri * rowH + rowH / 2, amp = rowH * 0.32;
        s.appendChild(svg('text', { x: 6, y: y0 - 4, style: 'font-size:13px;font-weight:600;fill:var(--ink)', text: LC[k].n }));
        s.appendChild(svg('text', { x: 6, y: y0 + 13, class: 'mono', style: 'font-size:11px;fill:var(--muted)', text: 'r = ' + LC[k].r + ' · S = ' + LC[k].baud }));
        s.appendChild(svg('line', { x1: lw, y1: y0, x2: lw + bits.length * bw, y2: y0, style: 'stroke:var(--line-2)' }));
        ['+V', '0', '−V'].forEach(function (t, j) { s.appendChild(svg('text', { x: lw - 6, y: y0 - amp + j * amp + 4, 'text-anchor': 'end', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: t })); });
        var lv = lcLevels(k, bits, start), d = '', prevY = null;
        lv.forEach(function (v, j) {
          var x0 = lw + j * bw / 2, x1 = x0 + bw / 2, y = y0 - v * amp;
          d += (prevY == null ? 'M' + x0 + ' ' + y : 'L' + x0 + ' ' + y) + ' L' + x1 + ' ' + y + ' ';
          prevY = y;
        });
        s.appendChild(svg('path', { d: d, style: 'fill:none;stroke:var(' + palette[ri % palette.length] + ');stroke-width:2.6;stroke-linejoin:round' }));
      });
      wrap.appendChild(s);
      // table
      var t = '<table class="cmp"><thead><tr><th>Scheme</th><th>Rule</th><th>r</th><th>Avg. baud</th><th>DC</th><th>Self-sync</th></tr></thead><tbody>';
      shown.forEach(function (k) { var x = LC[k]; t += '<tr><th>' + x.n + '</th><td>' + x.rule + ' <span class="muted">' + x.note + '</span></td><td class="mono">' + x.r + '</td><td class="mono">' + x.baud + '</td><td>' + x.dc + '</td><td>' + x.sync + '</td></tr>'; });
      tbl.innerHTML = t + '</tbody></table>';
    }
    bitsIn.addEventListener('input', draw);
    draw();
  };

  /* ---------------- PCM ---------------- */
  W.pcm = function (host, o) {
    var st = { sig: 'tone', fmax: 4, k: 4, L: 8, method: 'flat' };
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.seg([['tone', 'Pure tone'], ['two', 'Two tones']], st.sig, function (v) { st.sig = v; draw(); }));
    var fIn = U.input('4', 'w-s'); fIn.addEventListener('input', function () { st.fmax = U.num(fIn.value, 4); draw(); });
    row.appendChild(U.ctrl('Highest frequency (kHz)', fIn));
    host.appendChild(row);
    var row2 = el('div', { class: 'ctrls' });
    row2.appendChild(el('span', { class: 'hint', text: 'Sampling rate:' }));
    row2.appendChild(U.seg([['1', '1 × fmax'], ['1.5', '1.5 ×'], ['2', '2 × (Nyquist)'], ['4', '4 ×'], ['8', '8 ×']], '4', function (v) { st.k = +v; draw(); }));
    host.appendChild(row2);
    var row3 = el('div', { class: 'ctrls' });
    row3.appendChild(el('span', { class: 'hint', text: 'Levels L:' }));
    row3.appendChild(U.seg([['2', '2'], ['4', '4'], ['8', '8'], ['16', '16'], ['32', '32']], '8', function (v) { st.L = +v; draw(); }));
    row3.appendChild(el('span', { class: 'hint', text: 'Sampling:' }));
    row3.appendChild(U.seg([['ideal', 'Ideal'], ['natural', 'Natural'], ['flat', 'Flat-top']], 'flat', function (v) { st.method = v; draw(); }));
    host.appendChild(row3);
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function comps() { return st.sig === 'tone' ? [[1, 1, 0]] : [[0.62, 0.5, 0], [0.38, 1, 0.6]]; }
    function x(t) { return comps().reduce(function (s, c) { return s + c[0] * Math.sin(2 * Math.PI * c[1] * t + c[2]); }, 0); }
    function draw() {
      wrap.innerHTML = ''; out.innerHTML = '';
      var Wd = 720, Hd = 300, pad = 34, T = 2, V = 1.05;
      var X = function (t) { return pad + (Wd - pad - 10) * t / T; }, Y = function (v) { return Hd / 2 - v / V * (Hd / 2 - 18); };
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'PCM sampling and quantization plot' });
      var L = st.L, nb = Math.round(U.log2(L)), D = 2 / L;
      for (var q = 0; q <= L; q++) { var yv = -1 + q * D; s.appendChild(svg('line', { x1: pad, x2: Wd - 10, y1: Y(yv), y2: Y(yv), style: 'stroke:var(--line);stroke-width:1' })); }
      if (L <= 16) for (var q2 = 0; q2 < L; q2++) s.appendChild(svg('text', { x: 4, y: Y(-1 + (q2 + 0.5) * D) + 4, class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: q2.toString(2).padStart(nb, '0') }));
      s.appendChild(svg('line', { x1: pad, x2: Wd - 10, y1: Y(0), y2: Y(0), style: 'stroke:var(--line-2)' }));
      var d = ''; for (var i = 0; i <= 400; i++) { var t = T * i / 400; d += (i ? 'L' : 'M') + X(t) + ' ' + Y(x(t)) + ' '; }
      s.appendChild(svg('path', { d: d, style: 'fill:none;stroke:var(--muted);stroke-width:2' }));
      var fs = st.k; // samples per unit time where fmax = 1 per unit time
      var n = Math.floor(T * fs + 1e-9) + 1, Ts = 1 / fs, stair = '', rows = [];
      for (var k = 0; k < n; k++) {
        var tk = k * Ts, v = x(tk), zone = Math.min(L - 1, Math.max(0, Math.floor((v + 1) / D))), qv = -1 + (zone + 0.5) * D;
        rows.push({ k: k, v: v, zone: zone, qv: qv, err: qv - v });
        var w = Math.min(Ts * 0.45, 0.12);
        if (st.method === 'ideal') {
          s.appendChild(svg('line', { x1: X(tk), x2: X(tk), y1: Y(0), y2: Y(v), style: 'stroke:var(--net);stroke-width:2.5' }));
          s.appendChild(svg('circle', { cx: X(tk), cy: Y(v), r: 3.5, style: 'fill:var(--net)' }));
        } else if (st.method === 'natural') {
          var pd = 'M' + X(tk) + ' ' + Y(0); for (var j = 0; j <= 10; j++) { var tj = tk + w * j / 10; pd += ' L' + X(tj) + ' ' + Y(x(tj)); } pd += ' L' + X(tk + w) + ' ' + Y(0) + ' Z';
          s.appendChild(svg('path', { d: pd, style: 'fill:var(--net);fill-opacity:.55;stroke:var(--net)' }));
        } else {
          s.appendChild(svg('rect', { x: X(tk), y: Math.min(Y(v), Y(0)), width: Math.max(2, X(tk + w) - X(tk)), height: Math.abs(Y(v) - Y(0)), style: 'fill:var(--net);fill-opacity:.55;stroke:var(--net)' }));
        }
        var tn = Math.min(T, tk + Ts);
        stair += (k ? 'L' : 'M') + X(tk) + ' ' + Y(qv) + ' L' + X(tn) + ' ' + Y(qv) + ' ';
      }
      s.appendChild(svg('path', { d: stair, style: 'fill:none;stroke:var(--accent);stroke-width:2.4' }));
      var nyq = st.k >= 2, fsk = st.k * st.fmax;
      if (!nyq) {
        // each component folds to fa = f − fs·round(f/fs); the rebuilt wave passes through every sample
        var ad = '';
        for (var m = 0; m <= 300; m++) {
          var tm = T * m / 300, val = comps().reduce(function (acc, cc) { var fa = cc[1] - fs * Math.round(cc[1] / fs); return acc + cc[0] * Math.sin(2 * Math.PI * fa * tm + cc[2]); }, 0);
          ad += (m ? 'L' : 'M') + X(tm) + ' ' + Y(val) + ' ';
        }
        s.appendChild(svg('path', { d: ad, style: 'fill:none;stroke:var(--exam);stroke-width:2;stroke-dasharray:7 5' }));
      }
      var lg = el('div', { class: 'legend' }, [
        el('span', { html: '<i style="background:var(--muted)"></i>original analog signal' }),
        el('span', { html: '<i style="background:var(--net)"></i>samples (PAM)' }),
        el('span', { html: '<i style="background:var(--accent)"></i>quantized staircase' })
      ]);
      if (!nyq) lg.appendChild(el('span', { html: '<i style="background:var(--exam)"></i>what the receiver rebuilds (alias)' }));
      wrap.appendChild(s); wrap.appendChild(lg);
      var snrq = 6.02 * nb + 1.76;
      out.appendChild(U.readout([['Sampling rate fs', fmt(fsk, 2) + ' k samples/s'], ['Nyquist rate 2·fmax', fmt(2 * st.fmax, 2) + ' k samples/s'], ['Bits per sample nb = log₂L', String(nb)], ['Bit rate = fs × nb', U.si(fsk * 1e3 * nb, 'bps')], ['SNRdB ≈ 6.02 nb + 1.76', fmt(snrq, 2) + ' dB'], ['Min bandwidth = nb × B', U.si(nb * st.fmax * 1e3, 'Hz')]]));
      if (!nyq) out.appendChild(el('div', { class: 'note warn', html: '<b class="tag">Aliasing</b><p>fs = ' + st.k + ' × fmax is below the Nyquist rate. The samples fit a slower wave equally well, so the receiver cannot recover the original signal. Sample at least twice the highest frequency.</p>' }));
      var t2 = '<table class="cmp"><thead><tr><th class="num">Sample</th><th class="num">Value (norm.)</th><th class="num">Zone</th><th class="num">Quantized</th><th class="num">Error</th><th>Code</th></tr></thead><tbody>';
      rows.slice(0, 9).forEach(function (r) { t2 += '<tr><td class="num">' + r.k + '</td><td class="num">' + fmt(r.v, 3) + '</td><td class="num">' + r.zone + '</td><td class="num">' + fmt(r.qv, 3) + '</td><td class="num">' + fmt(r.err, 3) + '</td><td class="mono">' + r.zone.toString(2).padStart(nb, '0') + '</td></tr>'; });
      out.appendChild(el('div', { class: 'table-wrap', html: t2 + '</tbody></table>' }));
      out.appendChild(el('p', { class: 'hint', html: 'Zone height Δ = (V<sub>max</sub> − V<sub>min</sub>) / L = 2 / ' + L + ' = ' + fmt(D, 4) + ' (normalised). Each sample is replaced by the midpoint of its zone; the difference is the quantization error, at most Δ/2.' }));
    }
    draw();
  };

  /* ---------------- digital-to-analog modulation ---------------- */
  var MOD = {
    ask: { n: 'ASK (on-off keying)', r: 1, pts: [[0, 0, '0'], [1, 0, '1']] },
    fsk: { n: 'BFSK', r: 1, pts: [] },
    bpsk: { n: 'BPSK', r: 1, pts: [[-1, 0, '0'], [1, 0, '1']] },
    qpsk: { n: 'QPSK', r: 2, pts: [[1, 1, '11'], [-1, 1, '01'], [-1, -1, '00'], [1, -1, '10']] },
    qam16: { n: '16-QAM', r: 4, pts: [] }
  };
  var QL = { '00': -3, '01': -1, '11': 1, '10': 3 };
  (function () { Object.keys(QL).forEach(function (a) { Object.keys(QL).forEach(function (b) { MOD.qam16.pts.push([QL[a], QL[b], a + b]); }); }); })();
  W.modulation = function (host, o) {
    var bitsIn = U.input(o.bits || '1011001010', 'w-l');
    var scheme = o.scheme || 'ask';
    var N = U.input(o.n || '12', 'w-s'), Nu = el('select', { class: 'inp', 'aria-label': 'rate unit' });
    BPS.forEach(function (u) { Nu.appendChild(el('option', { value: String(u[1]), text: u[0] })); }); Nu.value = '1000000';
    var dIn = U.input(o.d || '0', 'w-s');
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.ctrl('Bits', bitsIn));
    row.appendChild(U.seg([['ask', 'ASK'], ['fsk', 'FSK'], ['bpsk', 'BPSK'], ['qpsk', 'QPSK'], ['qam16', '16-QAM']], scheme, function (v) { scheme = v; draw(); }));
    host.appendChild(row);
    var row2 = el('div', { class: 'ctrls' });
    row2.appendChild(el('div', { class: 'ctrl' }, [el('label', { for: N.id, text: 'Bit rate N' }), N, Nu]));
    row2.appendChild(U.ctrl('Filter factor d (0–1)', dIn));
    host.appendChild(row2);
    var grid = el('div', { class: 'split' }); host.appendChild(grid);
    var wave = el('div', { class: 'canvas-wrap' }), cons = el('div', { class: 'canvas-wrap' });
    grid.appendChild(wave); grid.appendChild(cons);
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function draw() {
      var m = MOD[scheme], bits = bitsIn.value.replace(/[^01]/g, '');
      while (bits.length % m.r) bits += '0';
      bits = bits.slice(0, 40);
      var syms = []; for (var i = 0; i < bits.length; i += m.r) syms.push(bits.slice(i, i + m.r));
      var Wd = 720, Hd = 210, lw = 10, sw = (Wd - lw - 10) / Math.max(1, syms.length), y0 = 118, A = 70;
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': m.n + ' waveform' });
      s.appendChild(svg('line', { x1: lw, x2: Wd - 10, y1: y0, y2: y0, style: 'stroke:var(--line-2)' }));
      var d = '', phase = 0, cyc = scheme === 'qam16' ? 3 : scheme === 'qpsk' ? 3 : 2;
      syms.forEach(function (sy, si) {
        var x0 = lw + si * sw;
        s.appendChild(svg('line', { x1: x0, x2: x0, y1: 22, y2: Hd - 6, style: 'stroke:var(--line);stroke-dasharray:3 4' }));
        s.appendChild(svg('text', { x: x0 + sw / 2, y: 16, 'text-anchor': 'middle', class: 'mono', style: 'font-size:13px;font-weight:600;fill:var(--ink)', text: sy }));
        for (var k = 0; k <= 60; k++) {
          var u = k / 60, t = si + u, val;
          if (scheme === 'ask') val = (sy === '1' ? 1 : 0) * Math.sin(2 * Math.PI * cyc * t);
          else if (scheme === 'bpsk') val = Math.sin(2 * Math.PI * cyc * t + (sy === '1' ? 0 : Math.PI));
          else if (scheme === 'fsk') { var f = sy === '1' ? 4 : 2; if (k > 0) phase += 2 * Math.PI * f / 60; val = Math.sin(phase); }
          else {
            var p = m.pts.find(function (q) { return q[2] === sy; }), sc = scheme === 'qpsk' ? 1 / Math.SQRT2 : 1 / (3 * Math.SQRT2);
            val = sc * (p[0] * Math.cos(2 * Math.PI * cyc * t) + p[1] * Math.sin(2 * Math.PI * cyc * t));
          }
          d += (si === 0 && k === 0 ? 'M' : 'L') + (x0 + u * sw).toFixed(1) + ' ' + (y0 - val * A).toFixed(1) + ' ';
        }
      });
      s.appendChild(svg('path', { d: d, style: 'fill:none;stroke:var(--phy);stroke-width:2.2' }));
      wave.innerHTML = ''; wave.appendChild(s);
      // constellation
      var CW = 260, C = 130, R = scheme === 'qam16' ? 30 : 80;
      var c = svg('svg', { viewBox: '0 0 ' + CW + ' ' + CW, role: 'img', 'aria-label': m.n + ' constellation diagram' });
      c.style.maxWidth = '300px'; c.style.margin = '0 auto';
      c.appendChild(svg('line', { x1: 10, x2: CW - 10, y1: C, y2: C, style: 'stroke:var(--line-2)' }));
      c.appendChild(svg('line', { x1: C, x2: C, y1: 10, y2: CW - 10, style: 'stroke:var(--line-2)' }));
      c.appendChild(svg('text', { x: CW - 14, y: C - 6, 'text-anchor': 'end', style: 'font-size:11px;fill:var(--muted)', text: 'in-phase' }));
      c.appendChild(svg('text', { x: C + 6, y: 20, style: 'font-size:11px;fill:var(--muted)', text: 'quadrature' }));
      if (scheme === 'fsk') {
        c.appendChild(svg('text', { x: C, y: C - 30, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--ink-2)', text: 'FSK changes frequency,' }));
        c.appendChild(svg('text', { x: C, y: C - 12, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--ink-2)', text: 'not amplitude or phase:' }));
        c.appendChild(svg('text', { x: C, y: C + 22, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--ink-2)', text: 'no constellation diagram.' }));
      } else {
        var used = {}; syms.forEach(function (sy) { used[sy] = 1; });
        m.pts.forEach(function (p) {
          var cx = C + p[0] * R, cy = C - p[1] * R;
          if (scheme !== 'qam16' && !(p[0] === 0 && p[1] === 0)) c.appendChild(svg('line', { x1: C, y1: C, x2: cx, y2: cy, style: 'stroke:var(--line-2);stroke-dasharray:3 3' }));
          c.appendChild(svg('circle', { cx: cx, cy: cy, r: used[p[2]] ? 7 : 5, style: 'fill:' + (used[p[2]] ? 'var(--accent)' : 'var(--surface)') + ';stroke:var(--accent);stroke-width:2' }));
          c.appendChild(svg('text', { x: cx, y: cy - 11, 'text-anchor': 'middle', class: 'mono', style: 'font-size:' + (scheme === 'qam16' ? 9 : 12) + 'px;fill:var(--ink)', text: p[2] }));
        });
      }
      cons.innerHTML = ''; cons.appendChild(c);
      // numbers
      var n = U.num(N.value, 12) * +Nu.value, dd = U.clamp(U.num(dIn.value, 0), 0, 1), r = m.r, S = n / r, B, lines = [];
      if (scheme === 'fsk') { var df2 = S; B = (1 + dd) * S + df2; lines = ['S = N / r = ' + U.si(n, 'bps') + ' / 1 = ' + U.si(S, 'baud'), 'B = (1 + d) × S + 2Δf, taking 2Δf = S (minimum for proper demodulation)', '  = (1 + ' + dd + ') × ' + U.si(S, 'Hz') + ' + ' + U.si(df2, 'Hz') + ' = <b>' + U.si(B, 'Hz') + '</b>']; }
      else { B = (1 + dd) * S; lines = ['r = ' + r + ' bit' + (r > 1 ? 's' : '') + ' per signal element (L = ' + Math.pow(2, r) + ')', 'S = N / r = ' + U.si(n, 'bps') + ' / ' + r + ' = ' + U.si(S, 'baud'), 'B = (1 + d) × S = (1 + ' + dd + ') × ' + U.si(S, 'Hz') + ' = <b>' + U.si(B, 'Hz') + '</b>']; }
      out.innerHTML = '';
      out.appendChild(U.readout([['Scheme', m.n], ['Bits per element r', String(r)], ['Baud rate S', U.si(S, 'baud')], ['Bandwidth B', U.si(B, 'Hz')]]));
      out.appendChild(work(lines));
    }
    [bitsIn, N, Nu, dIn].forEach(function (x) { x.addEventListener('input', draw); x.addEventListener('change', draw); });
    draw();
  };

  /* ---------------- FDM planner ---------------- */
  W.fdm = function (host, o) {
    var n = U.input(o.n || '5', 'w-s'), bwI = U.input(o.bw || '100', 'w-s'), g = U.input(o.g || '10', 'w-s'), f0 = U.input(o.f0 || '0', 'w-s');
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.ctrl('Channels', n)); row.appendChild(U.ctrl('Bandwidth each (kHz)', bwI)); row.appendChild(U.ctrl('Guard band (kHz)', g)); row.appendChild(U.ctrl('Link starts at (kHz)', f0));
    host.appendChild(row);
    presetRow(host, [['Ex 6.1: 3 voice channels, 20–32 kHz', ['3', '4', '0', '20']], ['Ex 6.2: 5 × 100 kHz, 10 kHz guards', ['5', '100', '10', '0']], ['Group: 12 voice channels', ['12', '4', '0', '60']]], function (p) { n.value = p[0]; bwI.value = p[1]; g.value = p[2]; f0.value = p[3]; draw(); });
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function draw() {
      var N = Math.max(1, Math.min(24, Math.round(U.num(n.value, 1)))), B = U.num(bwI.value, 1), G = U.num(g.value, 0), F0 = U.num(f0.value, 0);
      var total = N * B + (N - 1) * G, Wd = 720, Hd = 150, pad = 20, sc = (Wd - 2 * pad) / total;
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'FDM spectrum' });
      s.appendChild(svg('line', { x1: pad, x2: Wd - pad, y1: 110, y2: 110, style: 'stroke:var(--ink-2)' }));
      var cols = ['--phy', '--dll', '--net', '--tl', '--app'];
      for (var i = 0; i < N; i++) {
        var a = F0 + i * (B + G), x = pad + (a - F0) * sc;
        s.appendChild(svg('path', { d: 'M' + x + ' 110 C ' + (x + B * sc * 0.15) + ' 40, ' + (x + B * sc * 0.85) + ' 40, ' + (x + B * sc) + ' 110 Z', style: 'fill:var(' + cols[i % 5] + ');fill-opacity:.55;stroke:var(' + cols[i % 5] + ')' }));
        if (N <= 12) s.appendChild(svg('text', { x: x + B * sc / 2, y: 70, 'text-anchor': 'middle', style: 'font-size:12px;font-weight:600;fill:var(--ink)', text: 'Ch ' + (i + 1) }));
        if (N <= 8) s.appendChild(svg('text', { x: x, y: 128, 'text-anchor': 'middle', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: fmt(a, 2) }));
      }
      s.appendChild(svg('text', { x: Wd - pad, y: 128, 'text-anchor': 'end', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: fmt(F0 + total, 2) + ' kHz' }));
      if (G > 0) s.appendChild(svg('text', { x: Wd / 2, y: 146, 'text-anchor': 'middle', style: 'font-size:11px;fill:var(--muted)', text: 'gaps between bands are guard bands' }));
      wrap.innerHTML = ''; wrap.appendChild(s);
      out.innerHTML = '';
      out.appendChild(U.readout([['Channels', String(N)], ['Guard bands', String(N - 1)], ['Minimum link bandwidth', fmt(total, 3) + ' kHz'], ['Band of channel 1', fmt(F0, 2) + '–' + fmt(F0 + B, 2) + ' kHz']]));
      out.appendChild(work(['Minimum bandwidth = n × B + (n − 1) × guard', '                  = ' + N + ' × ' + B + ' + ' + (N - 1) + ' × ' + G + ' = <b>' + fmt(total, 3) + ' kHz</b>']));
    }
    [n, bwI, g, f0].forEach(function (x) { x.addEventListener('input', draw); });
    draw();
  };

  /* ---------------- synchronous TDM frame builder ---------------- */
  W.tdm = function (host, o) {
    var n = U.input(o.n || '4', 'w-s'), rate = U.input(o.rate || '1', 'w-s'), unit = U.input(o.unit || '1', 'w-s'), fb = U.input(o.fb || '0', 'w-s');
    var ru = el('select', { class: 'inp', 'aria-label': 'rate unit' }); BPS.forEach(function (u) { ru.appendChild(el('option', { value: String(u[1]), text: u[0] })); }); ru.value = o.ru || '1000';
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.ctrl('Input lines n', n));
    row.appendChild(el('div', { class: 'ctrl' }, [el('label', { for: rate.id, text: 'Rate of each line' }), rate, ru]));
    row.appendChild(U.ctrl('Bits per slot (unit)', unit));
    row.appendChild(U.ctrl('Framing bits per frame', fb));
    host.appendChild(row);
    presetRow(host, [
      ['Ex 6.7: 4 × 1 kbps, 1-bit units', ['4', '1', '1000', '1', '0']],
      ['Ex 6.9: 4 × 100 kbps, 2-bit slots', ['4', '100', '1000', '2', '0']],
      ['Ex 6.10: 4 × 250 char/s + sync bit', ['4', '2', '1000', '8', '1']],
      ['T-1 line: 24 × 64 kbps', ['24', '64', '1000', '8', '1']]
    ], function (p) { n.value = p[0]; rate.value = p[1]; ru.value = p[2]; unit.value = p[3]; fb.value = p[4]; draw(); });
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function draw() {
      var N = Math.max(1, Math.round(U.num(n.value, 1))), R = U.num(rate.value, 1) * +ru.value, u = Math.max(1, Math.round(U.num(unit.value, 1))), F = Math.max(0, Math.round(U.num(fb.value, 0)));
      var inBit = 1 / R, inSlot = u / R, frameDur = inSlot, frameRate = R / u, bitsPerFrame = N * u + F, outRate = frameRate * bitsPerFrame, outBit = 1 / outRate, outSlot = u * outBit;
      out.innerHTML = '';
      out.appendChild(U.readout([['Input bit duration', U.time(inBit)], ['Input slot (one unit)', U.time(inSlot)], ['Output slot', U.time(outSlot)], ['Frame duration', U.time(frameDur)], ['Frame rate', U.si(frameRate, 'frames/s')], ['Bits per frame', String(bitsPerFrame)], ['Output (link) rate', U.si(outRate, 'bps')], ['Output bit duration', U.time(outBit)]]));
      out.appendChild(work([
        'Frame rate = input rate / unit = ' + U.si(R, 'bps') + ' / ' + u + ' = <b>' + U.si(frameRate, 'frames/s') + '</b>  (frame duration = ' + U.time(frameDur) + ', same as one input unit)',
        'Bits per frame = n × unit + framing bits = ' + N + ' × ' + u + ' + ' + F + ' = <b>' + bitsPerFrame + '</b>',
        'Link rate = frame rate × bits per frame = ' + U.si(frameRate, '') + ' × ' + bitsPerFrame + ' = <b>' + U.si(outRate, 'bps') + '</b>' + (F ? '  (≥ n × input rate = ' + U.si(N * R, 'bps') + ' because of framing bits)' : '  (= n × input rate)'),
        'Output slot = unit / link rate = ' + U.time(outSlot) + '  ≈ input slot / n'
      ]));
      // frame picture: 3 frames
      var show = Math.min(N, 8), frames = 3, sw = 46, fw = (F ? 22 : 0) + show * sw + (N > show ? 30 : 0), Wd = frames * fw + 40, Hd = 96;
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, width: Wd, height: Hd, role: 'img', 'aria-label': 'TDM frames' });
      s.style.minWidth = Math.min(Wd, 560) + 'px';
      var cols = ['--phy', '--dll', '--net', '--tl', '--app', '--accent', '--tip', '--tool'];
      for (var f = 0; f < frames; f++) {
        var x = 20 + (frames - 1 - f) * fw;
        s.appendChild(svg('text', { x: x + fw / 2, y: 16, 'text-anchor': 'middle', style: 'font-size:12px;fill:var(--muted)', text: 'Frame ' + (f + 1) }));
        var cx = x;
        if (F) { s.appendChild(svg('rect', { x: cx, y: 26, width: 22, height: 40, style: 'fill:var(--ink-2)' })); s.appendChild(svg('text', { x: cx + 11, y: 51, 'text-anchor': 'middle', class: 'mono', style: 'font-size:11px;fill:var(--surface)', text: 'F' })); cx += 22; }
        for (var i = 0; i < show; i++) {
          s.appendChild(svg('rect', { x: cx, y: 26, width: sw - 2, height: 40, rx: 3, style: 'fill:var(' + cols[i % 8] + ');fill-opacity:.25;stroke:var(' + cols[i % 8] + ')' }));
          s.appendChild(svg('text', { x: cx + sw / 2 - 1, y: 51, 'text-anchor': 'middle', class: 'mono', style: 'font-size:12px;font-weight:600;fill:var(--ink)', text: String.fromCharCode(65 + i) + (f + 1) }));
          cx += sw;
        }
        if (N > show) s.appendChild(svg('text', { x: cx + 14, y: 51, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--muted)', text: '…' }));
      }
      s.appendChild(svg('text', { x: Wd - 20, y: 86, 'text-anchor': 'end', style: 'font-size:11px;fill:var(--muted)', text: '← direction of flow on the link' }));
      wrap.innerHTML = ''; wrap.appendChild(s);
    }
    [n, rate, ru, unit, fb].forEach(function (x) { x.addEventListener('input', draw); x.addEventListener('change', draw); });
    draw();
  };
})();
