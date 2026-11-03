/* Signal to Socket — data-link labs (2D)
   hamming · parity · crc · checksum · stuffing · arq · aloha · csmacd · cdma · sweff */
(function () {
  'use strict';
  var DCN = window.DCN, U = DCN.util, W = DCN.widgets;
  var el = U.el, svg = U.svg, fmt = U.fmt;
  function work(lines) { return el('div', { class: 'workings', html: lines.join('\n') }); }
  function bitsOf(s) { return String(s).replace(/[^01]/g, ''); }
  function xor(a, b) { var r = ''; for (var i = 0; i < a.length; i++) r += a[i] === b[i] ? '0' : '1'; return r; }
  function weight(s) { return s.split('').filter(function (c) { return c === '1'; }).length; }
  function presetRow(host, presets, apply) {
    var r = el('div', { class: 'ctrls' });
    r.appendChild(el('span', { class: 'hint', text: 'Load an example:' }));
    presets.forEach(function (p) { r.appendChild(el('button', { type: 'button', class: 'btn ghost sm', text: p[0], onclick: function () { apply(p[1]); } })); });
    host.appendChild(r);
  }

  /* ---------------- Hamming distance & dmin ---------------- */
  W.hamming = function (host, o) {
    var a = U.input(o.a || '10101', 'w-m'), b = U.input(o.b || '11110', 'w-m');
    var code = U.input(o.code || '000, 011, 101, 110', 'w-l');
    var row = el('div', { class: 'ctrls' }); row.appendChild(U.ctrl('Word x', a)); row.appendChild(U.ctrl('Word y', b)); host.appendChild(row);
    var out1 = el('div'); host.appendChild(out1);
    var row2 = el('div', { class: 'ctrls' }); row2.appendChild(U.ctrl('Valid codewords', code)); host.appendChild(row2);
    presetRow(host, [['C(3,2) parity code', '000, 011, 101, 110'], ['C(5,2) code', '00000, 01011, 10101, 11110'], ['C(5,4) sample', '00000, 00011, 10111, 11000']], function (p) { code.value = p; calc(); });
    var out2 = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out2);
    function calc() {
      var x = bitsOf(a.value), y = bitsOf(b.value);
      out1.innerHTML = '';
      if (x.length !== y.length || !x.length) out1.appendChild(el('p', { class: 'hint', text: 'Both words must have the same number of bits.' }));
      else {
        var z = xor(x, y);
        out1.appendChild(work(['  ' + x, '⊕ ' + y, '  ' + '─'.repeat(x.length), '  ' + z.replace(/1/g, '<b>1</b>') + '   → number of 1s = <b>d(' + x + ', ' + y + ') = ' + weight(z) + '</b>']));
      }
      out2.innerHTML = '';
      var cw = code.value.split(/[,\s]+/).map(bitsOf).filter(Boolean);
      if (cw.length < 2 || cw.some(function (w) { return w.length !== cw[0].length; })) { out2.appendChild(el('p', { class: 'hint', text: 'Enter at least two codewords of equal length.' })); return; }
      var dmin = Infinity, pairs = [];
      for (var i = 0; i < cw.length; i++) for (var j = i + 1; j < cw.length; j++) { var d = weight(xor(cw[i], cw[j])); pairs.push('d(' + cw[i] + ', ' + cw[j] + ') = ' + d); dmin = Math.min(dmin, d); }
      var set = {}; cw.forEach(function (w) { set[w] = 1; });
      var linear = cw.every(function (p) { return cw.every(function (q) { return set[xor(p, q)]; }); });
      var minW = Math.min.apply(null, cw.filter(function (w) { return w.indexOf('1') >= 0; }).map(weight));
      out2.appendChild(U.readout([['Minimum distance dmin', String(dmin)], ['Guaranteed detection', 'up to ' + (dmin - 1) + ' error' + (dmin - 1 === 1 ? '' : 's')], ['Linear block code?', linear ? 'Yes (XOR of any two is a codeword)' : 'No'], ['Min weight of non-zero codeword', isFinite(minW) ? String(minW) : '—']]));
      out2.appendChild(work(pairs.concat(['', 'dmin = smallest distance = <b>' + dmin + '</b>. To detect s errors we need dmin = s + 1, so s = ' + (dmin - 1) + '.', linear ? 'For a linear code, dmin also equals the smallest number of 1s in a non-zero codeword (' + minW + ').' : ''])));
    }
    [a, b, code].forEach(function (x) { x.addEventListener('input', calc); });
    calc();
  };

  /* ---------------- simple parity check C(5,4) ---------------- */
  W.parity = function (host, o) {
    var dIn = U.input(o.data || '1011', 'w-s');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Dataword (4 bits)', dIn), el('span', { class: 'hint', text: 'Then click bits of the received word to corrupt them.' })]));
    var enc = el('div'); host.appendChild(enc);
    var rx = el('div', { class: 'ctrls' }); host.appendChild(rx);
    var out = el('div'); host.appendChild(out);
    var recv = '';
    function code() { var d = bitsOf(dIn.value).slice(0, 4).padEnd(4, '0'); return d + (weight(d) % 2); }
    function render() {
      var cw = code();
      if (recv.length !== 5) recv = cw;
      enc.innerHTML = '';
      enc.appendChild(work(['r₀ = a₃ + a₂ + a₁ + a₀ (mod 2) = ' + cw.slice(0, 4).split('').join(' + ') + ' = <b>' + cw[4] + '</b>', 'Codeword sent = dataword + parity = <b>' + cw + '</b> (even number of 1s)']));
      rx.innerHTML = '';
      rx.appendChild(el('span', { class: 'hint', text: 'Received:' }));
      recv.split('').forEach(function (bit, i) {
        rx.appendChild(el('button', { type: 'button', class: 'btn sm ' + (bit === cw[i] ? 'ghost' : ''), text: bit, 'aria-label': 'Flip bit ' + (i + 1), onclick: function () { recv = recv.slice(0, i) + (bit === '1' ? '0' : '1') + recv.slice(i + 1); render(); } }));
      });
      rx.appendChild(el('button', { type: 'button', class: 'btn ghost sm', text: 'Reset', onclick: function () { recv = cw; render(); } }));
      var s0 = weight(recv) % 2, errs = weight(xor(recv, cw));
      out.innerHTML = '';
      out.appendChild(U.readout([['Bits corrupted', String(errs)], ['Syndrome s₀', String(s0)], ['Decision', s0 ? 'Error detected → discard' : (errs ? 'Accepted (error missed!)' : 'Accepted')]]));
      if (errs === 2 || errs === 4) out.appendChild(el('p', { class: 'hint', html: 'An <b>even</b> number of flipped bits keeps the parity even, so the simple parity check cannot see it. That is why dmin = 2 guarantees detection of only a single error.' }));
    }
    dIn.addEventListener('input', function () { recv = ''; render(); });
    render();
  };

  /* ---------------- CRC long division ---------------- */
  function polyToBits(s) {
    s = s.replace(/\s/g, '').toLowerCase();
    if (/^[01]+$/.test(s)) return s;
    var terms = s.split('+'), max = 0, pw = [];
    terms.forEach(function (t) { var p = t === '1' ? 0 : t === 'x' ? 1 : parseInt(t.replace('x^', '').replace('x', ''), 10); if (isFinite(p)) { pw.push(p); max = Math.max(max, p); } });
    var b = ''; for (var i = max; i >= 0; i--) b += pw.indexOf(i) >= 0 ? '1' : '0';
    return b;
  }
  function crcDivide(dividend, divisor) {
    var r = divisor.length, cur = dividend.slice(0, r), steps = [], q = '';
    for (var i = r; i <= dividend.length; i++) {
      var useDiv = cur[0] === '1', sub = useDiv ? divisor : '0'.repeat(r);
      q += useDiv ? '1' : '0';
      var res = xor(cur, sub).slice(1);
      steps.push({ at: i - r, cur: cur, sub: sub, res: res });
      if (i < dividend.length) cur = res + dividend[i]; else cur = res;
    }
    return { q: q, rem: cur, steps: steps };
  }
  function divisionText(dividend, divisor, res) {
    var pad = divisor.length + 3, lines = [];
    lines.push(' '.repeat(pad + divisor.length - 1) + '<b>' + res.q + '</b>   ← quotient (discarded)');
    lines.push(' '.repeat(pad - 1) + '┌' + '─'.repeat(dividend.length + 1));
    lines.push(divisor + ' '.repeat(pad - divisor.length - 1) + '│ ' + dividend);
    res.steps.forEach(function (s, i) {
      var ind = ' '.repeat(pad + 1 + s.at);
      if (i > 0) lines.push(ind + s.cur);
      lines.push(ind + '<span style="color:var(--' + (s.sub[0] === '1' ? 'net' : 'muted') + ')">' + s.sub + '</span>' + (s.sub[0] === '1' ? '' : '   (leftmost bit 0 → use 0000…)'));
      lines.push(ind + '─'.repeat(divisor.length));
    });
    var last = res.steps[res.steps.length - 1];
    lines.push(' '.repeat(pad + 2 + last.at) + '<b style="color:var(--accent)">' + res.rem + '</b>   ← remainder');
    return lines;
  }
  W.crc = function (host, o) {
    var dIn = U.input(o.data || '1010', 'w-m'), gIn = U.input(o.div || '1011', 'w-m');
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.ctrl('Dataword', dIn)); row.appendChild(U.ctrl('Divisor (bits or x^3+x+1)', gIn));
    host.appendChild(row);
    presetRow(host, [['IA-1 Q3a: 1010 ÷ 1011', ['1010', '1011']], ['Notes: 1001 ÷ 1011', ['1001', '1011']], ['CRC-8 style', ['11010011101100', 'x^3+x+1']]], function (p) { dIn.value = p[0]; gIn.value = p[1]; rxIn.value = ''; calc(); });
    var enc = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(enc);
    var rxRow = el('div', { class: 'ctrls' });
    var rxIn = U.input('', 'w-l');
    rxRow.appendChild(U.ctrl('Received codeword (edit to corrupt it)', rxIn));
    host.appendChild(el('h4', { text: 'Receiver side: check the codeword' }));
    host.appendChild(rxRow);
    var dec = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(dec);
    function calc() {
      var d = bitsOf(dIn.value), g = polyToBits(gIn.value);
      enc.innerHTML = ''; dec.innerHTML = '';
      if (!d || g.length < 2 || g[0] !== '1') { enc.appendChild(el('p', { class: 'hint', text: 'Enter a dataword and a divisor that starts with 1 (at least 2 bits).' })); return; }
      var r = g.length - 1, aug = d + '0'.repeat(r), res = crcDivide(aug, g), cw = d + res.rem;
      enc.appendChild(U.readout([['k (dataword bits)', String(d.length)], ['Divisor bits (n−k+1)', String(g.length)], ['Augmented dataword', aug], ['Remainder', res.rem], ['Codeword sent', cw]]));
      enc.appendChild(work(['Append n − k = ' + r + ' zeros: ' + d + ' → ' + aug, 'Divide by ' + g + ' using modulo-2 (XOR) division:', ''].concat(divisionText(aug, g, res)).concat(['', 'Codeword = dataword + remainder = ' + d + ' + ' + res.rem + ' = <b>' + cw + '</b>'])));
      if (!rxIn.value || bitsOf(rxIn.value).length !== cw.length) rxIn.value = cw;
      var rx = bitsOf(rxIn.value), rr = crcDivide(rx, g), ok = /^0+$/.test(rr.rem);
      dec.appendChild(U.readout([['Syndrome', rr.rem], ['Decision', ok ? 'Accept: syndrome is all 0s' : 'Discard: error detected'], ['Bits differing from sent', String(weight(xor(rx.padEnd(cw.length, '0'), cw)))]]));
      dec.appendChild(work(['Receiver divides the whole received codeword ' + rx + ' by ' + g + ':', ''].concat(divisionText(rx, g, rr)).concat(['', ok ? 'Syndrome = ' + rr.rem + ' → no error detected, dataword ' + rx.slice(0, d.length) + ' accepted.' : 'Syndrome = ' + rr.rem + ' ≠ 0 → codeword corrupted, discarded.'])));
    }
    [dIn, gIn].forEach(function (x) { x.addEventListener('input', function () { rxIn.value = ''; calc(); }); });
    rxIn.addEventListener('input', calc);
    calc();
  };

  /* ---------------- checksum ---------------- */
  W.checksum = function (host, o) {
    var mode = o.mode || 'trad';
    var body = el('div', { style: 'display:grid;gap:10px' });
    host.appendChild(U.seg([['trad', 'Traditional (4-bit, decimal)'], ['inet', 'Internet checksum (16-bit)']], mode, function (v) { mode = v; draw(); }));
    host.appendChild(body);
    var trad = o.nums || '7, 11, 12, 0, 6', inet = o.words || '1110011001100110, 1101010101010101';
    function draw() {
      body.innerHTML = '';
      var inp = U.input(mode === 'trad' ? trad : inet, 'w-l');
      body.appendChild(el('div', { class: 'ctrls' }, [U.ctrl(mode === 'trad' ? 'Numbers (0–15)' : '16-bit words (binary or 0x hex)', inp)]));
      var out = el('div', { style: 'display:grid;gap:10px' }); body.appendChild(out);
      function calc() {
        out.innerHTML = '';
        var m = mode === 'trad' ? 4 : 16, mask = Math.pow(2, m) - 1;
        if (mode === 'trad') trad = inp.value; else inet = inp.value;
        var vals = inp.value.split(/[,\s]+/).filter(Boolean).map(function (t) {
          if (mode === 'trad') return parseInt(t, 10);
          return /^0x/i.test(t) ? parseInt(t, 16) : parseInt(bitsOf(t), 2);
        }).filter(function (v) { return isFinite(v) && v >= 0 && v <= mask; });
        if (!vals.length) { out.appendChild(el('p', { class: 'hint', text: 'Enter at least one value.' })); return; }
        var sum = vals.reduce(function (s, v) { return s + v; }, 0), wrapped = sum, wraps = [];
        while (wrapped > mask) { var hi = Math.floor(wrapped / (mask + 1)), lo = wrapped & mask; wraps.push(wrapped.toString(2) + ' → ' + lo.toString(2).padStart(m, '0') + ' + ' + hi.toString(2) + ' = ' + (lo + hi).toString(2).padStart(m, '0')); wrapped = lo + hi; }
        var cks = mask - wrapped, rsum = sum + cks, rw = rsum; while (rw > mask) rw = (rw & mask) + Math.floor(rw / (mask + 1));
        var b = function (v) { return v.toString(2).padStart(m, '0'); };
        out.appendChild(U.readout([['Sum', mode === 'trad' ? String(sum) : '0x' + sum.toString(16)], ['Wrapped sum', mode === 'trad' ? wrapped + ' (' + b(wrapped) + ')' : b(wrapped)], ['Checksum = complement', mode === 'trad' ? cks + ' (' + b(cks) + ')' : b(cks)], ['Receiver result', mode === 'trad' ? String(mask - rw) : b(mask - rw)]]));
        var lines = ['<b>Sender</b>'];
        vals.forEach(function (v) { lines.push('  ' + b(v) + (mode === 'trad' ? '  (' + v + ')' : '')); });
        lines.push('  ' + '─'.repeat(m + 2), '  sum = ' + sum.toString(2) + (mode === 'trad' ? ' (' + sum + ')' : ''));
        wraps.forEach(function (w) { lines.push('  wrap extra bits: ' + w); });
        lines.push('  checksum = complement of ' + b(wrapped) + ' = <b>' + b(cks) + '</b>' + (mode === 'trad' ? ' = ' + cks + ' (= 15 − ' + wrapped + ')' : ''));
        lines.push('', '<b>Receiver</b> adds all items including the checksum: wrapped sum = ' + b(rw) + ', complement = <b>' + b(mask - rw) + '</b>');
        lines.push(mask - rw === 0 ? '  → all 0s: accept the data.' : '  → not zero: reject.');
        out.appendChild(work(lines));
      }
      inp.addEventListener('input', calc); calc();
    }
    draw();
  };

  /* ---------------- byte & bit stuffing ---------------- */
  W.stuffing = function (host, o) {
    var mode = o.mode || 'bit';
    var body = el('div', { style: 'display:grid;gap:10px' });
    host.appendChild(U.seg([['bit', 'Bit stuffing (bit-oriented)'], ['byte', 'Byte stuffing (character-oriented)']], mode, function (v) { mode = v; draw(); }));
    host.appendChild(body);
    function draw() {
      body.innerHTML = '';
      if (mode === 'bit') {
        var inp = U.input(o.bits || '0001111111001111101000', 'w-l');
        body.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Data bits', inp)]));
        var out = el('div', { style: 'display:grid;gap:10px' }); body.appendChild(out);
        var calc = function () {
          var d = bitsOf(inp.value), res = '', html = '', ones = 0, n = 0;
          for (var i = 0; i < d.length; i++) {
            res += d[i]; html += d[i];
            ones = d[i] === '1' ? ones + 1 : 0;
            if (ones === 5) { res += '0'; html += '<span class="hlb" title="stuffed">0</span>'; ones = 0; n++; }
          }
          out.innerHTML = '';
          out.appendChild(U.readout([['Stuffed bits added', String(n)], ['Frame length', (res.length + 16) + ' bits incl. 2 flags']]));
          out.appendChild(el('div', { class: 'workings', html: 'Data sent:   ' + d + '\nAfter stuff: ' + html + '\nFrame:       <b>01111110</b> ' + html + ' <b>01111110</b>\n\nRule: after a 0 followed by five 1s, insert an extra 0, so the flag pattern 01111110 can never appear inside the data. The receiver removes a 0 that follows five 1s.' }));
        };
        inp.addEventListener('input', calc); calc();
      } else {
        var inp2 = U.input(o.bytes || 'Data Flag Data ESC Data', 'w-l');
        body.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Bytes (words: Data, Flag, ESC)', inp2)]));
        var out2 = el('div', { style: 'display:grid;gap:10px' }); body.appendChild(out2);
        var calc2 = function () {
          var toks = inp2.value.split(/\s+/).filter(Boolean), outT = [], n = 0;
          toks.forEach(function (t) { var u = t.toLowerCase(); if (u === 'flag' || u === 'esc') { outT.push('<span class="hlb">ESC</span>'); n++; } outT.push(u === 'flag' ? 'Flag' : u === 'esc' ? 'ESC' : t); });
          out2.innerHTML = '';
          out2.appendChild(U.readout([['Escape bytes added', String(n)]]));
          out2.appendChild(el('div', { class: 'workings', html: 'Data:   ' + toks.join(' ') + '\nFrame:  <b>Flag</b> Header ' + outT.join(' ') + ' Trailer <b>Flag</b>\n\nRule: whenever a flag or an ESC character appears in the data, insert an extra ESC before it. The receiver deletes the ESC and treats the next byte as data. PPP uses the escape byte 01111101.' }));
        };
        inp2.addEventListener('input', calc2); calc2();
      }
    }
    draw();
  };

  /* ---------------- ARQ simulator ---------------- */
  function simulate(p) {
    var D = 1, gap = 0.34, TO = p.proto === 'sw' ? 2.6 : p.proto === 'gbn' ? 3.4 : 4.4, n = p.n, modN = Math.pow(2, p.m), ev = [], log = [];
    var lossF = p.lossF, lossA = p.lossA;
    function seq(i) { return i % modN; }
    if (p.proto === 'sw') {
      var t = 0, k = 0, Rn = 0, tries = {}, acked = {}, guard = 0;
      while (k < n && guard++ < 60) {
        tries[k] = (tries[k] || 0) + 1;
        var first = tries[k] === 1, lostF = first && lossF === k;
        ev.push({ kind: 'data', lab: 'Frame ' + (k % 2), t0: t, t1: t + D, lost: lostF, resend: !first });
        log.push('t=' + fmt(t, 2) + ': sender ' + (first ? 'sends' : 're-sends') + ' Frame ' + (k % 2) + ', keeps a copy and starts the timer' + (lostF ? ' — frame is lost' : ''));
        if (lostF) { ev.push({ kind: 'timeout', t: t + TO }); log.push('t=' + fmt(t + TO, 2) + ': timer expires, no ACK → resend Frame ' + (k % 2)); t += TO; continue; }
        var isNew = k === Rn; if (isNew) Rn++;
        var firstAck = !acked[k]; acked[k] = true;
        var lostA = firstAck && lossA === k;
        ev.push({ kind: 'ack', lab: 'ACK ' + (Rn % 2), t0: t + D, t1: t + 2 * D, lost: lostA, note: isNew ? 'accept, deliver' : 'duplicate → discard, ACK again' });
        log.push('t=' + fmt(t + D, 2) + ': receiver ' + (isNew ? 'accepts Frame ' + (k % 2) + ', sends ACK ' + (Rn % 2) + ' (next frame expected)' : 'gets a duplicate, discards it and resends ACK ' + (Rn % 2)) + (lostA ? ' — ACK is lost' : ''));
        if (lostA) { ev.push({ kind: 'timeout', t: t + TO }); log.push('t=' + fmt(t + TO, 2) + ': timer expires (ACK never came) → resend the same frame'); t += TO; continue; }
        log.push('t=' + fmt(t + 2 * D, 2) + ': ACK arrives, timer stops, copy discarded');
        t += 2 * D + 0.2; k++;
      }
      return { ev: ev, log: log, end: t };
    }
    // GBN and SR: event driven
    var now = 0, Sf = 0, Sn = 0, R = 0, lastTx = -1, Q = [], txc = {}, ackc = {}, timer = null, timers = {}, ackedSR = {}, buf = {}, nakSent = false, g2 = 0;
    var Ws = p.ws;
    function send(i, re) {
      var tt = Math.max(now, lastTx + gap); lastTx = tt;
      txc[i] = (txc[i] || 0) + 1;
      var first = txc[i] === 1, lost = first && lossF === i;
      ev.push({ kind: 'data', lab: 'Frame ' + seq(i), t0: tt, t1: tt + D, lost: lost, resend: !first });
      log.push('t=' + fmt(tt, 2) + ': ' + (first ? 'send' : 'resend') + ' Frame ' + seq(i) + (lost ? ' — lost' : '') + '  [Sf=' + seq(Sf) + ', Sn=' + seq(Math.max(Sn, i + 1)) + ']');
      if (!lost) Q.push({ t: tt + D, kind: 'frame', i: i });
      if (p.proto === 'gbn') { if (timer == null) timer = { t: tt + TO }; }
      else timers[i] = tt + TO;
    }
    function ackOut(a, kind, srcI, note) {
      ackc[srcI] = (ackc[srcI] || 0) + 1;
      var lost = kind === 'ack' && ackc[srcI] === 1 && lossA === srcI;
      ev.push({ kind: kind, lab: (kind === 'nak' ? 'NAK ' : 'ACK ') + seq(a), t0: now, t1: now + D, lost: lost, note: note });
      log.push('t=' + fmt(now, 2) + ': receiver ' + note + ' → ' + (kind === 'nak' ? 'NAK ' : 'ACK ') + seq(a) + (lost ? ' — lost' : ''));
      if (!lost) Q.push({ t: now + D, kind: kind, a: a });
    }
    while (g2++ < 600) {
      var canSend = Sn < n && Sn - Sf < Ws;
      var tSend = canSend ? Math.max(now, lastTx + gap) : Infinity;
      Q.sort(function (x, y) { return x.t - y.t; });
      var tArr = Q.length ? Q[0].t : Infinity;
      var tTim = Infinity, timK = null;
      if (p.proto === 'gbn') { if (timer) tTim = timer.t; }
      else Object.keys(timers).forEach(function (k2) { if (timers[k2] < tTim) { tTim = timers[k2]; timK = +k2; } });
      var tn = Math.min(tSend, tArr, tTim);
      if (!isFinite(tn)) break;
      if (tArr === tn) {
        var a = Q.shift(); now = a.t;
        if (a.kind === 'frame') {
          if (p.proto === 'gbn') {
            if (a.i === R) { R++; ackOut(R, 'ack', a.i, 'accepts Frame ' + seq(a.i)); }
            else if (a.i < R) { ackOut(R, 'ack', a.i, 'discards duplicate Frame ' + seq(a.i)); }
            else { ev.push({ kind: 'drop', t: now, lab: 'discard ' + seq(a.i) }); log.push('t=' + fmt(now, 2) + ': receiver expects Frame ' + seq(R) + ', so it discards out-of-order Frame ' + seq(a.i) + ' (no ACK)'); }
          } else {
            if (a.i < R) { ackOut(R, 'ack', a.i, 'discards duplicate Frame ' + seq(a.i)); }
            else if (a.i < R + Ws) {
              buf[a.i] = true;
              if (a.i === R) { while (buf[R]) { delete buf[R]; R++; } nakSent = false; ackOut(R, 'ack', a.i, 'delivers up to Frame ' + seq(R - 1)); }
              else { ev.push({ kind: 'drop', t: now, lab: 'buffer ' + seq(a.i), buf: true }); log.push('t=' + fmt(now, 2) + ': receiver buffers out-of-order Frame ' + seq(a.i)); if (!nakSent) { nakSent = true; ackOut(R, 'nak', a.i, 'is missing Frame ' + seq(R)); } }
            }
          }
        } else if (a.kind === 'ack') {
          if (a.a > Sf) {
            if (p.proto === 'sr') for (var x = Sf; x < a.a; x++) { ackedSR[x] = true; delete timers[x]; }
            Sf = a.a;
            log.push('t=' + fmt(now, 2) + ': sender gets ACK ' + seq(a.a) + ' → window slides, Sf = ' + seq(Sf));
            if (p.proto === 'gbn') timer = Sf < Sn ? { t: now + TO } : null;
          } else log.push('t=' + fmt(now, 2) + ': sender ignores old ACK ' + seq(a.a));
        } else if (a.kind === 'nak') {
          if (!ackedSR[a.a] && a.a < Sn) { log.push('t=' + fmt(now, 2) + ': sender gets NAK ' + seq(a.a) + ' → resends only that frame'); send(a.a, true); }
        }
      } else if (tTim === tn) {
        now = tn;
        if (p.proto === 'gbn') {
          ev.push({ kind: 'timeout', t: now }); log.push('t=' + fmt(now, 2) + ': timer for Frame ' + seq(Sf) + ' expires → go back and resend Frames ' + seq(Sf) + '…' + seq(Sn - 1));
          timer = null; lastTx = Math.max(lastTx, now - gap);
          for (var y = Sf; y < Sn; y++) send(y, true);
        } else {
          ev.push({ kind: 'timeout', t: now }); log.push('t=' + fmt(now, 2) + ': timer for Frame ' + seq(timK) + ' expires → resend only Frame ' + seq(timK));
          delete timers[timK]; lastTx = Math.max(lastTx, now - gap); send(timK, true);
        }
      } else {
        now = tn; send(Sn, false); Sn++;
      }
      if (Sf >= n && !Q.length) break;
    }
    return { ev: ev, log: log, end: now };
  }
  W.arq = function (host, o) {
    var st = { proto: o.proto || 'gbn', scen: o.scen || 'frame', n: +(o.n || 6), m: +(o.m || 2), k: +(o.k || 2) };
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.seg([['sw', 'Stop-and-Wait ARQ'], ['gbn', 'Go-Back-N'], ['sr', 'Selective Repeat']], st.proto, function (v) { st.proto = v; run(); }));
    host.appendChild(row);
    var row2 = el('div', { class: 'ctrls' });
    row2.appendChild(U.seg([['none', 'All frames arrive'], ['frame', 'A frame is lost'], ['ack', 'An ACK is lost']], st.scen, function (v) { st.scen = v; run(); }));
    var kSel = el('select', { class: 'inp', id: U.uid('k') }); for (var i = 0; i < 8; i++) kSel.appendChild(el('option', { value: String(i), text: 'frame #' + i }));
    kSel.value = String(st.k); kSel.addEventListener('change', function () { st.k = +kSel.value; run(); });
    row2.appendChild(U.ctrl('Which one', kSel));
    var mSel = el('select', { class: 'inp', id: U.uid('m') }); [2, 3].forEach(function (m) { mSel.appendChild(el('option', { value: String(m), text: 'm = ' + m + ' bits' })); });
    mSel.value = String(st.m); mSel.addEventListener('change', function () { st.m = +mSel.value; run(); });
    row2.appendChild(U.ctrl('Sequence field', mSel));
    host.appendChild(row2);
    var info = el('div', { class: 'readout' }); host.appendChild(info);
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var logEl = el('details', { class: 'solution' }); host.appendChild(logEl);
    function run() {
      var ws = st.proto === 'sw' ? 1 : st.proto === 'gbn' ? Math.pow(2, st.m) - 1 : Math.pow(2, st.m - 1);
      var n = st.proto === 'sw' ? 4 : st.n;
      mSel.disabled = st.proto === 'sw';
      var k = Math.min(st.k, n - 1);
      var res = simulate({ proto: st.proto, n: n, m: st.proto === 'sw' ? 1 : st.m, ws: ws, lossF: st.scen === 'frame' ? k : -1, lossA: st.scen === 'ack' ? k : -1 });
      info.innerHTML = '';
      [['Protocol', { sw: 'Stop-and-Wait ARQ', gbn: 'Go-Back-N ARQ', sr: 'Selective Repeat ARQ' }[st.proto]], ['Sequence numbers', st.proto === 'sw' ? '0, 1 (mod 2)' : '0 … ' + (Math.pow(2, st.m) - 1) + ' (mod ' + Math.pow(2, st.m) + ')'], ['Send window', ws + (st.proto === 'gbn' ? ' (≤ 2^m − 1)' : st.proto === 'sr' ? ' (≤ 2^(m−1))' : '')], ['Receive window', st.proto === 'sr' ? String(ws) : '1'], ['Frames transmitted', String(res.ev.filter(function (e) { return e.kind === 'data'; }).length) + ' for ' + n + ' frames']].forEach(function (p) { info.appendChild(el('div', { class: 'r' }, [el('span', { text: p[0] }), el('b', { text: p[1] })])); });
      // draw
      var Wd = 640, xs = 130, xr = Wd - 130, top = 46, sc = 40, Hd = top + (res.end + 1.2) * sc + 20;
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'ARQ timeline' });
      s.style.maxWidth = '760px';
      var defs = svg('defs');
      ['net', 'dll', 'exam'].forEach(function (c) { var mk = svg('marker', { id: 'ah-' + c + host.__id, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' }); mk.appendChild(svg('path', { d: 'M0 0 L10 5 L0 10 z', style: 'fill:var(--' + c + ')' })); defs.appendChild(mk); });
      s.appendChild(defs);
      [[xs, 'Sender'], [xr, 'Receiver']].forEach(function (l) {
        s.appendChild(svg('text', { x: l[0], y: 22, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--ink)', text: l[1] }));
        s.appendChild(svg('line', { x1: l[0], x2: l[0], y1: 32, y2: Hd - 10, style: 'stroke:var(--ink-2);stroke-width:2' }));
      });
      s.appendChild(svg('text', { x: 12, y: Hd - 14, style: 'font-size:11px;fill:var(--muted)', text: 'time ↓' }));
      function Y(t) { return top + t * sc; }
      res.ev.forEach(function (e) {
        if (e.kind === 'timeout') {
          s.appendChild(svg('circle', { cx: xs - 16, cy: Y(e.t), r: 7, style: 'fill:none;stroke:var(--exam);stroke-width:2' }));
          s.appendChild(svg('path', { d: 'M' + (xs - 16) + ' ' + (Y(e.t) - 4) + ' V' + Y(e.t) + ' H' + (xs - 12), style: 'fill:none;stroke:var(--exam);stroke-width:1.6' }));
          s.appendChild(svg('text', { x: xs - 28, y: Y(e.t) + 4, 'text-anchor': 'end', style: 'font-size:11px;font-weight:600;fill:var(--exam)', text: 'time-out' }));
          return;
        }
        if (e.kind === 'drop') {
          s.appendChild(svg('text', { x: xr + 10, y: Y(e.t) + 4, style: 'font-size:11px;fill:' + (e.buf ? 'var(--tl)' : 'var(--exam)'), text: e.lab }));
          return;
        }
        var data = e.kind === 'data', x0 = data ? xs : xr, x1 = data ? xr : xs, y0 = Y(e.t0), y1 = Y(e.t1);
        var c = data ? 'net' : e.kind === 'nak' ? 'exam' : 'dll';
        if (e.lost) {
          var xm = x0 + (x1 - x0) * 0.55, ym = y0 + (y1 - y0) * 0.55;
          s.appendChild(svg('line', { x1: x0, y1: y0, x2: xm, y2: ym, style: 'stroke:var(--' + c + ');stroke-width:2;stroke-dasharray:6 4' }));
          s.appendChild(svg('path', { d: 'M' + (xm - 7) + ' ' + (ym - 7) + ' L' + (xm + 7) + ' ' + (ym + 7) + ' M' + (xm + 7) + ' ' + (ym - 7) + ' L' + (xm - 7) + ' ' + (ym + 7), style: 'stroke:var(--exam);stroke-width:2.6' }));
          s.appendChild(svg('text', { x: xm + (data ? 10 : -10), y: ym + 16, 'text-anchor': data ? 'start' : 'end', style: 'font-size:11px;font-weight:600;fill:var(--exam)', text: 'lost' }));
        } else {
          s.appendChild(svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, style: 'stroke:var(--' + c + ');stroke-width:2', 'marker-end': 'url(#ah-' + c + host.__id + ')' }));
        }
        var lx = x0 + (x1 - x0) * 0.22, ly = y0 + (y1 - y0) * 0.22 - 6;
        s.appendChild(svg('text', { x: lx, y: ly, 'text-anchor': 'middle', class: 'mono', style: 'font-size:12px;font-weight:600;fill:var(--' + c + ')', text: e.lab + (e.resend ? ' (resent)' : '') }));
        if (!data && e.note) s.appendChild(svg('text', { x: xr + 10, y: y0 + 4, style: 'font-size:11px;fill:var(--muted)', text: e.note }));
      });
      wrap.innerHTML = ''; wrap.appendChild(s);
      logEl.innerHTML = '';
      logEl.appendChild(el('summary', { text: 'Step-by-step explanation (' + res.log.length + ' events)' }));
      var b = el('div', { class: 'body' }); var ol = el('ol');
      res.log.forEach(function (l) { ol.appendChild(el('li', { class: 'small', text: l })); });
      b.appendChild(ol); logEl.appendChild(b);
    }
    host.__id = U.uid('arq');
    run();
  };

  /* ---------------- ALOHA ---------------- */
  function rng(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  W.aloha = function (host, o) {
    var G = 0.5;
    var gIn = el('input', { type: 'range', min: '0', max: '3', step: '0.05', value: String(G), id: U.uid('g') });
    var gOut = el('b', { class: 'mono', text: G.toFixed(2) });
    host.appendChild(el('div', { class: 'ctrls' }, [el('div', { class: 'ctrl' }, [el('label', { for: gIn.id, text: 'Offered load G (frames per frame-time)' }), gIn, gOut])]));
    var chart = el('div', { class: 'canvas-wrap' }); host.appendChild(chart);
    var ro = el('div'); host.appendChild(ro);
    host.appendChild(el('h4', { text: 'Calculator: frames on a shared channel' }));
    var fsz = U.input(o.frame || '200', 'w-s'), bw = U.input(o.bw || '200', 'w-s'), fps = U.input(o.fps || '1000', 'w-s');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Frame size (bits)', fsz), U.ctrl('Bandwidth (kbps)', bw), U.ctrl('Frames produced per second', fps)]));
    var calcOut = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(calcOut);
    host.appendChild(el('h4', { text: 'Watch collisions happen' }));
    var simMode = 'pure', seed = 7;
    var simRow = el('div', { class: 'ctrls' });
    simRow.appendChild(U.seg([['pure', 'Pure ALOHA'], ['slotted', 'Slotted ALOHA']], 'pure', function (v) { simMode = v; sim(); }));
    simRow.appendChild(el('button', { type: 'button', class: 'btn ghost sm', text: 'New random traffic', onclick: function () { seed = (seed * 48271) % 2147483647; sim(); } }));
    host.appendChild(simRow);
    var simWrap = el('div', { class: 'canvas-wrap' }); host.appendChild(simWrap);
    var simOut = el('p', { class: 'hint' }); host.appendChild(simOut);
    function drawChart() {
      var Wd = 640, Hd = 260, l = 46, b = 36, r = 16, t = 14, gx = function (g) { return l + (Wd - l - r) * g / 3; }, sy = function (v) { return Hd - b - (Hd - b - t) * v / 0.4; };
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'Throughput versus offered load for pure and slotted ALOHA' });
      for (var v = 0; v <= 0.4001; v += 0.1) { s.appendChild(svg('line', { x1: l, x2: Wd - r, y1: sy(v), y2: sy(v), style: 'stroke:var(--line)' })); s.appendChild(svg('text', { x: l - 6, y: sy(v) + 4, 'text-anchor': 'end', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: v.toFixed(1) })); }
      for (var g = 0; g <= 3; g += 0.5) s.appendChild(svg('text', { x: gx(g), y: Hd - b + 16, 'text-anchor': 'middle', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: g.toFixed(1) }));
      s.appendChild(svg('text', { x: (l + Wd) / 2, y: Hd - 4, 'text-anchor': 'middle', style: 'font-size:11px;fill:var(--muted)', text: 'G (offered load)' }));
      s.appendChild(svg('text', { x: 12, y: t + 6, style: 'font-size:11px;fill:var(--muted)', text: 'S' }));
      [['pure', 'var(--phy)', function (g) { return g * Math.exp(-2 * g); }], ['slotted', 'var(--net)', function (g) { return g * Math.exp(-g); }]].forEach(function (c) {
        var d = ''; for (var i = 0; i <= 300; i++) { var gg = 3 * i / 300; d += (i ? 'L' : 'M') + gx(gg) + ' ' + sy(c[2](gg)) + ' '; }
        s.appendChild(svg('path', { d: d, style: 'fill:none;stroke:' + c[1] + ';stroke-width:2.6' }));
      });
      s.appendChild(svg('circle', { cx: gx(0.5), cy: sy(0.184), r: 4, style: 'fill:var(--phy)' }));
      s.appendChild(svg('text', { x: gx(0.5) + 8, y: sy(0.184) - 6, style: 'font-size:11px;fill:var(--phy);font-weight:600', text: 'pure max 0.184 at G = ½' }));
      s.appendChild(svg('circle', { cx: gx(1), cy: sy(0.368), r: 4, style: 'fill:var(--net)' }));
      s.appendChild(svg('text', { x: gx(1) + 8, y: sy(0.368) - 6, style: 'font-size:11px;fill:var(--net);font-weight:600', text: 'slotted max 0.368 at G = 1' }));
      s.appendChild(svg('line', { x1: gx(G), x2: gx(G), y1: t, y2: Hd - b, style: 'stroke:var(--accent);stroke-width:1.6;stroke-dasharray:5 4' }));
      chart.innerHTML = ''; chart.appendChild(s);
      chart.appendChild(el('div', { class: 'legend' }, [el('span', { html: '<i style="background:var(--phy)"></i>Pure ALOHA S = G·e<sup>−2G</sup>' }), el('span', { html: '<i style="background:var(--net)"></i>Slotted ALOHA S = G·e<sup>−G</sup>' })]));
      ro.innerHTML = '';
      ro.appendChild(U.readout([['G', G.toFixed(2)], ['Pure S', fmt(G * Math.exp(-2 * G), 4) + ' (' + fmt(100 * G * Math.exp(-2 * G), 2) + '%)'], ['Slotted S', fmt(G * Math.exp(-G), 4) + ' (' + fmt(100 * G * Math.exp(-G), 2) + '%)']]));
    }
    function calc() {
      var L = U.num(fsz.value, 200), B = U.num(bw.value, 200) * 1e3, f = U.num(fps.value, 1000), Tfr = L / B, g = f * Tfr, Sp = g * Math.exp(-2 * g), Ss = g * Math.exp(-g);
      calcOut.innerHTML = '';
      calcOut.appendChild(U.readout([['Frame time Tfr', U.time(Tfr)], ['Vulnerable time (pure) = 2 Tfr', U.time(2 * Tfr)], ['Vulnerable time (slotted) = Tfr', U.time(Tfr)], ['G = frames/s × Tfr', fmt(g, 4)], ['Pure: successful frames/s', fmt(f * Math.exp(-2 * g), 1)], ['Slotted: successful frames/s', fmt(f * Math.exp(-g), 1)]]));
      calcOut.appendChild(work(['Tfr = frame size / bandwidth = ' + L + ' / ' + fmt(B) + ' = ' + U.time(Tfr), 'G = ' + f + ' frames/s × ' + U.time(Tfr) + ' = <b>' + fmt(g, 4) + '</b> frames per frame-time', 'Pure:    S = G e^(−2G) = ' + fmt(g, 4) + ' × e^(' + fmt(-2 * g, 4) + ') = <b>' + fmt(Sp, 4) + '</b> → ' + fmt(Sp * 100, 2) + '% → about ' + Math.round(Sp / g * f) + ' frames/s survive', 'Slotted: S = G e^(−G)  = ' + fmt(g, 4) + ' × e^(' + fmt(-g, 4) + ') = <b>' + fmt(Ss, 4) + '</b> → about ' + Math.round(Ss / g * f) + ' frames/s survive']));
    }
    function sim() {
      var R = rng(seed), NS = 5, span = 14, frames = [], s = 0, Gsim = Math.max(0.15, G);
      for (var st = 0; st < NS; st++) { var t = 0; while (true) { t += -Math.log(1 - R() * 0.999) / (Gsim / NS); if (t > span - 1) break; var t0 = simMode === 'slotted' ? Math.ceil(t) : t; if (t0 > span - 1) break; frames.push({ st: st, t0: t0, t1: t0 + 1 }); } }
      frames.forEach(function (f) { f.col = frames.some(function (g) { return g !== f && g.t0 < f.t1 - 1e-9 && g.t1 > f.t0 + 1e-9; }); if (!f.col) s++; });
      var Wd = 680, l = 70, rowH = 30, Hd = 30 + NS * rowH + 18, X = function (t) { return l + (Wd - l - 10) * t / span; };
      var sv = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'Random access timeline' });
      for (var k = 0; k <= span; k++) { sv.appendChild(svg('line', { x1: X(k), x2: X(k), y1: 20, y2: Hd - 14, style: 'stroke:var(--line);' + (simMode === 'slotted' ? '' : 'stroke-dasharray:2 5') })); }
      sv.appendChild(svg('text', { x: l, y: 12, style: 'font-size:11px;fill:var(--muted)', text: simMode === 'slotted' ? 'slot boundaries (frames may start only here)' : 'time in frame-times (frames may start anywhere)' }));
      for (var r2 = 0; r2 < NS; r2++) sv.appendChild(svg('text', { x: 8, y: 30 + r2 * rowH + 17, style: 'font-size:12px;fill:var(--ink-2)', text: 'Station ' + (r2 + 1) }));
      frames.forEach(function (f) { sv.appendChild(svg('rect', { x: X(f.t0), y: 30 + f.st * rowH + 3, width: X(f.t1) - X(f.t0), height: rowH - 8, rx: 3, style: 'fill:' + (f.col ? 'var(--exam)' : 'var(--ok)') + ';fill-opacity:' + (f.col ? '.75' : '.8') })); });
      simWrap.innerHTML = ''; simWrap.appendChild(sv);
      simWrap.appendChild(el('div', { class: 'legend' }, [el('span', { html: '<i style="background:var(--ok)"></i>delivered' }), el('span', { html: '<i style="background:var(--exam)"></i>collided (any overlap destroys both frames)' })]));
      simOut.textContent = frames.length + ' frames attempted, ' + s + ' got through. ' + (simMode === 'pure' ? 'A frame is safe only if nobody else starts within one frame-time before or after it: vulnerable time 2 × Tfr.' : 'Frames that share a slot collide completely; there is no partial overlap, so the vulnerable time halves to Tfr.');
    }
    gIn.addEventListener('input', function () { G = +gIn.value; gOut.textContent = G.toFixed(2); drawChart(); sim(); });
    [fsz, bw, fps].forEach(function (x) { x.addEventListener('input', calc); });
    drawChart(); calc(); sim();
  };

  /* ---------------- CSMA/CD minimum frame ---------------- */
  W.csmacd = function (host, o) {
    var bw = U.input(o.bw || '10', 'w-s'), tp = U.input(o.tp || '25.6', 'w-s');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Bandwidth (Mbps)', bw), U.ctrl('Max propagation time Tp (µs)', tp)]));
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      var B = U.num(bw.value, 10) * 1e6, T = U.num(tp.value, 25.6) * 1e-6, tfr = 2 * T, bits = B * tfr;
      out.innerHTML = '';
      out.appendChild(U.readout([['Minimum Tfr = 2 × Tp', U.time(tfr)], ['Minimum frame size', fmt(bits, 1) + ' bits = ' + fmt(bits / 8, 2) + ' bytes']]));
      out.appendChild(work(['The sender must still be transmitting when news of a collision returns, so Tfr ≥ 2 × Tp.', 'Tfr = 2 × ' + U.time(T) + ' = ' + U.time(tfr), 'Frame size = B × Tfr = ' + U.si(B, 'bps') + ' × ' + U.time(tfr) + ' = <b>' + fmt(bits, 1) + ' bits (' + fmt(bits / 8, 2) + ' bytes)</b>']));
    }
    [bw, tp].forEach(function (x) { x.addEventListener('input', calc); }); calc();
  };

  /* ---------------- CDMA with Walsh codes ---------------- */
  function walsh(n) { var Wm = [[1]]; while (Wm.length < n) { var m = Wm.length, N2 = []; for (var i = 0; i < 2 * m; i++) { N2.push([]); for (var j = 0; j < 2 * m; j++) N2[i].push(i < m ? Wm[i][j % m] : (j < m ? Wm[i - m][j] : -Wm[i - m][j - m])); } Wm = N2; } return Wm; }
  W.cdma = function (host, o) {
    var codes = walsh(4), data = ['0', '0', 's', '1'], listen = 1;
    var row = el('div', { class: 'ctrls' }); host.appendChild(row);
    var tbl = el('div', { class: 'table-wrap' }); host.appendChild(tbl);
    var dec = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(dec);
    var wt = el('details', { class: 'solution' }); host.appendChild(wt);
    function sg(v) { return (v > 0 ? '+' : v < 0 ? '−' : ' ') + Math.abs(v); }
    function seqStr(a) { return '[' + a.map(sg).join(' ') + ']'; }
    function draw() {
      row.innerHTML = '';
      data.forEach(function (d, i) {
        row.appendChild(el('div', { class: 'ctrl' }, [el('label', { text: 'Station ' + (i + 1) }), U.seg([['0', 'sends 0'], ['1', 'sends 1'], ['s', 'silent']], d, function (v) { data[i] = v; draw(); })]));
      });
      var dv = data.map(function (d) { return d === '1' ? 1 : d === '0' ? -1 : 0; });
      var rows = codes.map(function (c, i) { return c.map(function (x) { return x * dv[i]; }); });
      var sum = [0, 1, 2, 3].map(function (j) { return rows.reduce(function (s, r) { return s + r[j]; }, 0); });
      var h = '<table class="cmp"><thead><tr><th>Station</th><th>Data → d</th><th>Chip code c</th><th>d × c</th></tr></thead><tbody>';
      codes.forEach(function (c, i) { h += '<tr><th>' + (i + 1) + '</th><td class="mono">' + (data[i] === 's' ? 'silent → 0' : data[i] + ' → ' + sg(dv[i])) + '</td><td class="mono">' + seqStr(c) + '</td><td class="mono">' + seqStr(rows[i]) + '</td></tr>'; });
      h += '<tr><th colspan="3">Signal on the channel (sum)</th><td class="mono"><b>' + seqStr(sum) + '</b></td></tr></tbody></table>';
      tbl.innerHTML = h;
      dec.innerHTML = '';
      var lr = el('div', { class: 'ctrls' }, [el('span', { class: 'hint', text: 'Decode the channel for:' }), U.seg([['0', 'Station 1'], ['1', 'Station 2'], ['2', 'Station 3'], ['3', 'Station 4']], String(listen), function (v) { listen = +v; draw(); })]);
      dec.appendChild(lr);
      var c = codes[listen], ip = sum.reduce(function (s, v, j) { return s + v * c[j]; }, 0), bit = ip / 4;
      dec.appendChild(el('div', { class: 'workings', html: 'Inner product = ' + seqStr(sum) + ' · ' + seqStr(c) + '\n              = ' + sum.map(function (v, j) { return '(' + sg(v) + ')(' + sg(c[j]) + ')'; }).join(' + ') + ' = ' + ip + '\nDivide by N = 4 → ' + ip + ' / 4 = <b>' + bit + '</b>  →  ' + (bit === 1 ? '<b>bit 1</b>' : bit === -1 ? '<b>bit 0</b>' : '<b>station was silent</b>') + '\n\nOther stations\' contributions cancel because different Walsh codes are orthogonal (their inner product is 0).' }));
      wt.innerHTML = '<summary>How the chip codes are generated (Walsh table)</summary>';
      var b = el('div', { class: 'body' });
      b.appendChild(el('p', { html: 'Start with W₁ = [+1]. Build W<sub>2N</sub> from W<sub>N</sub> by copying it three times and negating the bottom-right copy: W<sub>2N</sub> = [ W<sub>N</sub> W<sub>N</sub> ; W<sub>N</sub> −W<sub>N</sub> ]. The number of sequences must be a power of 2.' }));
      var txt = [1, 2, 4, 8].map(function (n) { return 'W' + n + ':\n' + walsh(n).map(function (r) { return '  ' + r.map(sg).join(' '); }).join('\n'); }).join('\n\n');
      b.appendChild(el('div', { class: 'workings', text: txt }));
      wt.appendChild(b);
    }
    draw();
  };

  /* ---------------- link utilisation ---------------- */
  W.sweff = function (host, o) {
    var L = U.input(o.l || '1000', 'w-s'), B = U.input(o.b || '1', 'w-s'), rtt = U.input(o.rtt || '20', 'w-s'), Wn = U.input(o.w || '1', 'w-s');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Frame size (bits)', L), U.ctrl('Bandwidth (Mbps)', B), U.ctrl('Round-trip time (ms)', rtt), U.ctrl('Frames sent per round trip (window)', Wn)]));
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      var l = U.num(L.value, 1000), b = U.num(B.value, 1) * 1e6, r = U.num(rtt.value, 20) / 1000, w = Math.max(1, U.num(Wn.value, 1));
      var bdp = b * r, tt = l / b, tp = r / 2, a = tp / tt, simple = Math.min(1, w * l / bdp), exact = Math.min(1, w * tt / (tt + 2 * tp));
      out.innerHTML = '';
      out.appendChild(U.readout([['Bandwidth-delay product', fmt(bdp, 1) + ' bits'], ['Tt (transmission)', U.time(tt)], ['a = Tp / Tt', fmt(a, 3)], ['Utilisation (textbook)', fmt(simple * 100, 2) + '%'], ['Utilisation (exact cycle)', fmt(exact * 100, 2) + '%'], ['Throughput', U.si(exact * b, 'bps')]]));
      out.appendChild(work(['BDP = bandwidth × RTT = ' + U.si(b, 'bps') + ' × ' + U.time(r) + ' = <b>' + fmt(bdp) + ' bits</b>: the link could carry this many bits during one round trip.', 'Textbook utilisation = bits actually sent per RTT / BDP = ' + w + ' × ' + l + ' / ' + fmt(bdp) + ' = <b>' + fmt(simple * 100, 2) + '%</b>', 'Exact (counting the frame time too): η = W·Tt / (Tt + 2Tp) = W / (1 + 2a) = ' + w + ' / (1 + 2 × ' + fmt(a, 3) + ') = ' + fmt(exact * 100, 2) + '%', 'Throughput = η × B = <b>' + U.si(exact * b, 'bps') + '</b>']));
    }
    [L, B, rtt, Wn].forEach(function (x) { x.addEventListener('input', calc); }); calc();
  };
})();
