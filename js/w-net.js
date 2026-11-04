/* Signal to Socket — network, transport and application labs (2D)
   ipv4 · frag · rj45 · dijkstra · dv · header · seq · cwnd · rtt · http */
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
  }

  /* ---------------- IPv4 analyser ---------------- */
  function parseIP(s) {
    var m = String(s).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\s*\/\s*(\d{1,2}))?$/);
    if (!m) return null;
    var o = [1, 2, 3, 4].map(function (i) { return +m[i]; });
    if (o.some(function (x) { return x > 255; })) return null;
    var pre = m[5] != null ? +m[5] : null;
    if (pre != null && pre > 32) return null;
    return { o: o, n: ((o[0] << 24) >>> 0) + (o[1] << 16) + (o[2] << 8) + o[3], pre: pre };
  }
  function ipStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  function ipBin(n, pre) {
    var b = (n >>> 0).toString(2).padStart(32, '0'), out = '';
    for (var i = 0; i < 32; i++) { if (i && i % 8 === 0) out += '.'; out += pre != null && i === pre ? '|' + b[i] : b[i]; }
    return out;
  }
  function maskOf(p) { return p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; }
  function classOf(f) {
    if (f < 128) return { c: 'A', bits: '0', pre: 8, range: '0–127', nets: '2⁷ = 128', hosts: '2²⁴ = 16,777,216' };
    if (f < 192) return { c: 'B', bits: '10', pre: 16, range: '128–191', nets: '2¹⁴ = 16,384', hosts: '2¹⁶ = 65,536' };
    if (f < 224) return { c: 'C', bits: '110', pre: 24, range: '192–223', nets: '2²¹ = 2,097,152', hosts: '2⁸ = 256' };
    if (f < 240) return { c: 'D', bits: '1110', pre: null, range: '224–239', nets: 'not divided', hosts: 'multicast' };
    return { c: 'E', bits: '1111', pre: null, range: '240–255', nets: 'not divided', hosts: 'reserved' };
  }
  function special(n) {
    var a = n >>> 24, b = (n >>> 16) & 255;
    if (n === 0) return 'This-host address (0.0.0.0/32): used by a host that does not yet know its own address.';
    if (n === 0xFFFFFFFF) return 'Limited broadcast (255.255.255.255/32): every host on this network.';
    if (a === 127) return 'Loopback block (127.0.0.0/8): the packet never leaves the host. 127.0.0.1 tests your own TCP/IP stack.';
    if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return 'Private address (10/8, 172.16/12 or 192.168/16): reusable inside organisations, not routed on the Internet; reaches the Internet through NAT.';
    if (a >= 224 && a <= 239) return 'Multicast block (224.0.0.0/4).';
    return '';
  }
  W.ipv4 = function (host, o) {
    var inp = U.input(o.ip || '167.199.170.82/27', 'w-l');
    var sub = el('select', { class: 'inp', id: U.uid('sub') }); [1, 2, 4, 8, 16].forEach(function (k) { sub.appendChild(el('option', { value: String(k), text: k === 1 ? 'no subnetting' : k + ' subnets' })); });
    sub.value = o.sub || '1';
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Address (optionally /prefix)', inp), U.ctrl('Split the block into', sub)]));
    presetRow(host, [['IA-1 Q7b: classify four addresses', 'ia1'], ['167.199.170.82/27', ['167.199.170.82/27', '1']], ['200.1.2.0/24 → 4 subnets', ['200.1.2.0/24', '4']], ['192.168.1.10', ['192.168.1.10', '1']]], function (p) {
      if (p === 'ia1') { showIA1(); return; }
      inp.value = p[0]; sub.value = p[1]; calc();
    });
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function showIA1() {
      out.innerHTML = '';
      var rows = ['201.20.31.65', '126.11.11.239', '193.14.56.22', '130.34.54.12'].map(function (a) { var p = parseIP(a), c = classOf(p.o[0]); return '<tr><td class="mono">' + a + '</td><td class="mono">' + ipBin(p.n).slice(0, 8) + '…</td><td class="num">' + p.o[0] + '</td><td>' + c.range + '</td><td><b>Class ' + c.c + '</b></td></tr>'; });
      out.appendChild(el('div', { class: 'table-wrap', html: '<table class="cmp"><thead><tr><th>Address</th><th>First octet (binary)</th><th class="num">First byte</th><th>Range</th><th>Class</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>' }));
      out.appendChild(el('p', { class: 'hint', text: 'Rule: look only at the first byte. 0–127 → A, 128–191 → B, 192–223 → C, 224–239 → D, 240–255 → E (or the leading bits 0, 10, 110, 1110, 1111).' }));
    }
    function calc() {
      out.innerHTML = '';
      var p = parseIP(inp.value);
      if (!p) { out.appendChild(el('p', { class: 'hint', text: 'Type an address such as 192.168.10.5 or 167.199.170.82/27.' })); return; }
      var c = classOf(p.o[0]), sp = special(p.n);
      out.appendChild(U.readout([['Dotted decimal', ipStr(p.n)], ['Hexadecimal', '0x' + (p.n >>> 0).toString(16).toUpperCase().padStart(8, '0')], ['Classful class', 'Class ' + c.c + ' (first bits ' + c.bits + ')'], ['Classful netid / hostid', c.pre ? c.pre + ' / ' + (32 - c.pre) + ' bits' : '—']]));
      out.appendChild(work(['Binary: ' + ipBin(p.n, p.pre != null ? p.pre : c.pre), 'Class ' + c.c + ': first byte range ' + c.range + ' · networks ' + c.nets + ' · addresses per network ' + c.hosts + (c.pre ? ' · default mask ' + ipStr(maskOf(c.pre)) + ' (/' + c.pre + ')' : '')]));
      if (sp) out.appendChild(el('div', { class: 'note tip', html: '<b class="tag">Special address</b><p>' + sp + '</p>' }));
      var pre = p.pre != null ? p.pre : c.pre;
      if (pre == null) return;
      var mask = maskOf(pre), first = (p.n & mask) >>> 0, N = Math.pow(2, 32 - pre), last = (first + N - 1) >>> 0;
      out.appendChild(el('h4', { text: (p.pre != null ? 'Classless block /' : 'Classful block /') + pre }));
      out.appendChild(U.readout([['Number of addresses N = 2^(32−n)', 'N = 2^' + (32 - pre) + ' = ' + N.toLocaleString('en-IN')], ['Mask', ipStr(mask)], ['First (network) address', ipStr(first) + '/' + pre], ['Last (broadcast) address', ipStr(last) + '/' + pre], ['Usable host addresses', pre <= 30 ? (N - 2).toLocaleString('en-IN') : String(N)]]));
      out.appendChild(work(['First address = address AND mask (keep the n leftmost bits, set the rest to 0)', '  ' + ipBin(p.n, pre) + '\n  ' + ipBin(mask, pre) + '  (mask)\n= ' + ipBin(first, pre) + '  → <b>' + ipStr(first) + '</b>', 'Last address = address OR (NOT mask) (set the 32 − n rightmost bits to 1) → <b>' + ipStr(last) + '</b>']));
      var k = +sub.value;
      if (k > 1) {
        var add = Math.round(U.log2(k)), np = pre + add;
        if (np > 30) { out.appendChild(el('p', { class: 'hint', text: 'Too many subnets for this block.' })); return; }
        var size = Math.pow(2, 32 - np), rows = '';
        for (var i = 0; i < k; i++) { var f = (first + i * size) >>> 0, l = (f + size - 1) >>> 0; rows += '<tr><td class="num">' + (i + 1) + '</td><td class="mono">' + ipStr(f) + '/' + np + '</td><td class="mono">' + ipStr(f + 1) + ' – ' + ipStr(l - 1) + '</td><td class="mono">' + ipStr(l) + '</td><td class="num">' + (size - 2) + '</td></tr>'; }
        out.appendChild(el('p', { html: 'Borrow log₂' + k + ' = <b>' + add + '</b> host bits → new prefix /' + np + ', mask ' + ipStr(maskOf(np)) + ', each subnet has 2^' + (32 - np) + ' = ' + size + ' addresses.' }));
        out.appendChild(el('div', { class: 'table-wrap', html: '<table class="cmp"><thead><tr><th class="num">#</th><th>Subnet (network id)</th><th>Host range</th><th>Broadcast</th><th class="num">Hosts</th></tr></thead><tbody>' + rows + '</tbody></table>' }));
      }
    }
    inp.addEventListener('input', calc); sub.addEventListener('change', calc);
    calc();
  };

  /* ---------------- IPv4 fragmentation ---------------- */
  W.frag = function (host, o) {
    var tot = U.input(o.total || '4000', 'w-s'), hl = U.input(o.hlen || '20', 'w-s'), mtu = U.input(o.mtu || '1500', 'w-s'), idn = U.input(o.id || '777', 'w-s');
    var df = el('input', { type: 'checkbox', id: U.uid('df') });
    var dfl = el('label', { class: 'small', style: 'display:flex;gap:6px;align-items:center;cursor:pointer' }, [df, el('span', { text: 'D bit set (do not fragment)' })]);
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Datagram total length (bytes)', tot), U.ctrl('Header length (bytes)', hl), U.ctrl('Outgoing link MTU (bytes)', mtu), U.ctrl('Identification', idn), dfl]));
    presetRow(host, [['Textbook: 4,000 B into MTU 1,500', ['4000', '20', '1500', '777']], ['1,500 B into MTU 576', ['1500', '20', '576', '4321']], ['Fits already: 1,000 B, MTU 1,500', ['1000', '20', '1500', '12']]], function (p) {
      tot.value = p[0]; hl.value = p[1]; mtu.value = p[2]; idn.value = p[3]; df.checked = false; calc();
    });
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      out.innerHTML = '';
      var T = Math.round(U.num(tot.value, 4000)), H = Math.round(U.num(hl.value, 20)), M = Math.round(U.num(mtu.value, 1500)), ID = Math.round(U.num(idn.value, 777));
      if (H < 20 || H > 60 || H % 4) { out.appendChild(el('p', { class: 'hint', text: 'The IPv4 header is 20 to 60 bytes, in steps of 4 (HLEN counts 4-byte words).' })); return; }
      if (T <= H || T > 65535) { out.appendChild(el('p', { class: 'hint', text: 'Total length must be larger than the header and at most 65,535 bytes.' })); return; }
      if (M < H + 8) { out.appendChild(el('p', { class: 'hint', text: 'The MTU must leave room for the header plus at least 8 data bytes.' })); return; }
      var data = T - H;
      if (T <= M) {
        out.appendChild(el('div', { class: 'note tip', html: '<b class="tag">No fragmentation</b><p>The whole datagram (' + T + ' bytes) fits in the MTU of ' + M + ' bytes, so it is sent as one piece with offset 0 and M = 0.</p>' }));
        return;
      }
      if (df.checked) {
        out.appendChild(el('div', { class: 'note warn', html: '<b class="tag">Discarded</b><p>The datagram (' + T + ' bytes) is larger than the MTU (' + M + ' bytes) but the D bit says "do not fragment". The router discards it and sends an ICMP error message back to the source.</p>' }));
        return;
      }
      var per = Math.floor((M - H) / 8) * 8, rows = '', start = 0, k = 0, frags = [];
      while (start < data) { var len = Math.min(per, data - start); frags.push({ s: start, l: len, last: start + len >= data }); start += len; }
      frags.forEach(function (f, i) {
        rows += '<tr><td class="num">' + (i + 1) + '</td><td class="num">' + (f.l + H) + '</td><td class="num">' + f.l + '</td><td class="mono">' + f.s + '–' + (f.s + f.l - 1) + '</td><td class="num"><b>' + (f.s / 8) + '</b></td><td class="num">' + (f.last ? 0 : 1) + '</td><td class="num">' + ID + '</td></tr>';
      });
      out.appendChild(U.readout([['Data (payload) bytes', T + ' − ' + H + ' = ' + data], ['Data per fragment (multiple of 8)', String(per)], ['Number of fragments', String(frags.length)], ['Offset unit', '8 bytes']]));
      out.appendChild(work([
        'Room for data in one fragment = MTU − header = ' + M + ' − ' + H + ' = ' + (M - H) + ' bytes',
        'Every fragment except the last must carry a multiple of 8 data bytes: ⌊' + (M - H) + ' / 8⌋ × 8 = <b>' + per + '</b>',
        'Offset of a fragment = (number of the first data byte it carries) ÷ 8',
        frags.map(function (f, i) { return '  fragment ' + (i + 1) + ': bytes ' + f.s + '–' + (f.s + f.l - 1) + ' → offset ' + f.s + ' / 8 = ' + (f.s / 8) + (f.last ? ', M = 0 (last fragment)' : ', M = 1 (more fragments follow)'); }).join('\n')
      ]));
      out.appendChild(el('div', { class: 'table-wrap', html: '<table class="cmp"><thead><tr><th class="num">Fragment</th><th class="num">Total length</th><th class="num">Data bytes</th><th>Data byte range</th><th class="num">Offset</th><th class="num">M flag</th><th class="num">Identification</th></tr></thead><tbody>' + rows + '</tbody></table>' }));
      out.appendChild(el('p', { class: 'hint', text: 'Every fragment copies the original header (same source, destination and identification) and gets its own total length, flags, offset and checksum. Only the destination host reassembles.' }));
    }
    [tot, hl, mtu, idn].forEach(function (x) { x.addEventListener('input', calc); }); df.addEventListener('change', calc);
    calc();
  };

  /* ---------------- RJ-45 wiring (T568A / T568B) ---------------- */
  W.rj45 = function (host, o) {
    var STD = {
      A: [['white-green', 'green', 1], ['green', 'green', 0], ['white-orange', 'orange', 1], ['blue', 'blue', 0], ['white-blue', 'blue', 1], ['orange', 'orange', 0], ['white-brown', 'brown', 1], ['brown', 'brown', 0]],
      B: [['white-orange', 'orange', 1], ['orange', 'orange', 0], ['white-green', 'green', 1], ['blue', 'blue', 0], ['white-blue', 'blue', 1], ['green', 'green', 0], ['white-brown', 'brown', 1], ['brown', 'brown', 0]]
    };
    var HEX = { green: '#1f9d55', orange: '#ef8a00', blue: '#1c64f2', brown: '#8a5a2b' };
    var ROLE = { 1: 'Tx+', 2: 'Tx−', 3: 'Rx+', 6: 'Rx−' };
    var mode = o.mode || 'straight';
    host.appendChild(U.seg([['straight', 'Straight-through (B ↔ B)'], ['cross', 'Crossover (A ↔ B)'], ['aa', 'Straight (A ↔ A)']], mode, function (v) { mode = v; draw(); }));
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var info = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(info);
    function draw() {
      var sa = mode === 'aa' ? 'A' : mode === 'cross' ? 'A' : 'B', sb = mode === 'aa' ? 'A' : 'B';
      var s2 = svg('svg', { viewBox: '0 0 640 300', role: 'img', 'aria-label': 'RJ-45 pin mapping between the two ends of the cable' });
      s2.style.maxWidth = '720px';
      var X = function (i) { return 128 + i * 56; };
      s2.appendChild(svg('text', { x: 20, y: 70, style: 'font-size:13px;font-weight:700;fill:var(--ink)', text: 'End 1 · T568' + sa }));
      s2.appendChild(svg('text', { x: 20, y: 240, style: 'font-size:13px;font-weight:700;fill:var(--ink)', text: 'End 2 · T568' + sb }));
      function pins(std, y, top) {
        STD[std].forEach(function (w, i) {
          var x = X(i), c = HEX[w[1]];
          s2.appendChild(svg('rect', { x: x - 15, y: y, width: 30, height: 46, rx: 3, style: 'fill:' + (w[2] ? '#ffffff' : c) + ';stroke:var(--ink-2);stroke-width:1' }));
          if (w[2]) s2.appendChild(svg('rect', { x: x - 5, y: y, width: 10, height: 46, style: 'fill:' + c }));
          var py = top ? y - 8 : y + 62;
          s2.appendChild(svg('text', { x: x, y: py, 'text-anchor': 'middle', class: 'mono', style: 'font-size:12px;font-weight:700;fill:' + (ROLE[i + 1] ? 'var(--accent)' : 'var(--ink-2)'), text: String(i + 1) + (ROLE[i + 1] ? ' ' + ROLE[i + 1] : '') }));
        });
      }
      pins(sa, 40, true); pins(sb, 214, false);
      STD[sa].forEach(function (w, i) {
        var j = STD[sb].findIndex(function (v) { return v[0] === w[0]; });
        var moved = i !== j, c = HEX[w[1]];
        s2.appendChild(svg('line', { x1: X(i), y1: 86, x2: X(j), y2: 214, style: 'stroke:' + c + ';stroke-width:' + (moved ? 4 : 2.5) + ';' + (w[2] ? 'stroke-dasharray:7 5;' : '') + 'opacity:' + (moved || mode !== 'cross' ? 1 : 0.55) }));
      });
      wrap.innerHTML = ''; wrap.appendChild(s2);
      var rows = [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<tr><td class="num">' + (i + 1) + '</td><td>' + STD.A[i][0] + '</td><td>' + STD.B[i][0] + '</td><td>' + (ROLE[i + 1] || 'unused at 10/100 Mbps') + '</td></tr>'; }).join('');
      info.innerHTML = '';
      info.appendChild(el('div', { class: 'note ' + (mode === 'cross' ? 'warn' : 'tip'), html: mode === 'cross' ? '<b class="tag">Crossover</b><p>One end T568A, the other T568B: pin 1 ↔ 3 and pin 2 ↔ 6 swap, so each device\'s transmit pair lands on the other\'s receive pair. Use it to connect devices with the <b>same function</b>: switch to switch (uplinks), PC to PC, PC to router, router to router without a switch.</p>' : '<b class="tag">Straight-through</b><p>Both ends use the same standard, so pin n connects to pin n. Use it to connect devices with <b>different functions</b>: router to hub or switch, server to hub or switch, workstation to hub or switch.</p>' }));
      info.appendChild(el('div', { class: 'table-wrap', html: '<table class="cmp"><thead><tr><th class="num">Pin</th><th>T568A</th><th>T568B</th><th>Signal</th></tr></thead><tbody>' + rows + '</tbody></table>' }));
    }
    draw();
  };

  /* ---------------- graphs for routing labs ---------------- */
  var GRAPHS = {
    k1: { name: 'Slide example 1 (u…z, costs up to 9)', pos: { u: [60, 170], w: [250, 170], x: [330, 50], v: [330, 290], y: [470, 170], z: [600, 170] }, e: [['u', 'w', 3], ['u', 'x', 5], ['u', 'v', 7], ['w', 'x', 4], ['w', 'v', 3], ['w', 'y', 8], ['x', 'y', 7], ['x', 'z', 9], ['v', 'y', 4], ['y', 'z', 2]] },
    k2: { name: 'Slide example 2 (u…z, classic)', pos: { u: [60, 170], v: [220, 60], w: [420, 60], x: [220, 280], y: [420, 280], z: [590, 170] }, e: [['u', 'v', 2], ['u', 'x', 1], ['u', 'w', 5], ['v', 'x', 2], ['v', 'w', 3], ['x', 'w', 3], ['x', 'y', 1], ['w', 'y', 1], ['w', 'z', 5], ['y', 'z', 2]] },
    xyz: { name: 'Three nodes x, y, z', pos: { x: [110, 250], y: [330, 60], z: [550, 250] }, e: [['x', 'y', 2], ['y', 'z', 1], ['x', 'z', 7]] },
    abcd: { name: 'Four routers A–E', pos: { A: [80, 170], B: [250, 60], C: [250, 280], D: [430, 60], E: [580, 200] }, e: [['A', 'B', 2], ['A', 'C', 5], ['B', 'C', 1], ['B', 'D', 4], ['C', 'D', 2], ['C', 'E', 6], ['D', 'E', 3]] }
  };
  function parseEdges(txt) {
    var e = [];
    txt.split(/[\n;,]+/).forEach(function (line) { var p = line.trim().split(/[\s-]+/); if (p.length >= 3 && isFinite(+p[2])) e.push([p[0], p[1], +p[2]]); });
    return e;
  }
  function layout(edges) {
    var names = []; edges.forEach(function (e) { [e[0], e[1]].forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); }); });
    var pos = {}; names.forEach(function (n, i) { var a = i / names.length * Math.PI * 2 - Math.PI / 2; pos[n] = [330 + Math.cos(a) * 240, 170 + Math.sin(a) * 125]; });
    return pos;
  }
  function graphSVG(g, hl) {
    hl = hl || {};
    var s = svg('svg', { viewBox: '0 0 660 340', role: 'img', 'aria-label': 'Network graph' });
    g.e.forEach(function (e) {
      var a = g.pos[e[0]], b = g.pos[e[1]], key = e[0] + e[1], key2 = e[1] + e[0];
      var on = hl.edges && (hl.edges[key] || hl.edges[key2]);
      s.appendChild(svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], style: 'stroke:' + (on ? 'var(--net)' : 'var(--line-2)') + ';stroke-width:' + (on ? 4 : 2) }));
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      s.appendChild(svg('rect', { x: mx - 11, y: my - 10, width: 22, height: 19, rx: 4, style: 'fill:var(--surface);stroke:var(--line)' }));
      s.appendChild(svg('text', { x: mx, y: my + 4, 'text-anchor': 'middle', class: 'mono', style: 'font-size:12px;font-weight:600;fill:var(--ink)', text: String(e[2]) }));
    });
    Object.keys(g.pos).forEach(function (n) {
      var p = g.pos[n], inSet = hl.set && hl.set[n], cur = hl.cur === n, src = hl.src === n;
      s.appendChild(svg('circle', { cx: p[0], cy: p[1], r: 19, style: 'fill:' + (cur ? 'var(--accent)' : inSet ? 'var(--net)' : 'var(--surface)') + ';stroke:' + (src ? 'var(--accent)' : 'var(--net)') + ';stroke-width:' + (src ? 4 : 2.4) }));
      s.appendChild(svg('text', { x: p[0], y: p[1] + 5, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + (inSet || cur ? 'var(--surface)' : 'var(--ink)'), text: n }));
      if (hl.dist && hl.dist[n] != null) s.appendChild(svg('text', { x: p[0], y: p[1] - 26, 'text-anchor': 'middle', class: 'mono', style: 'font-size:11px;fill:var(--muted)', text: hl.dist[n] }));
    });
    return s;
  }
  function adjOf(g) { var A = {}; Object.keys(g.pos).forEach(function (n) { A[n] = {}; }); g.e.forEach(function (e) { A[e[0]][e[1]] = e[2]; A[e[1]][e[0]] = e[2]; }); return A; }

  /* ---------------- Dijkstra ---------------- */
  function dijkstraSteps(g, src) {
    var A = adjOf(g), nodes = Object.keys(g.pos).sort(), D = {}, P = {}, Np = [src], steps = [];
    nodes.forEach(function (v) { if (v === src) return; if (A[src][v] != null) { D[v] = A[src][v]; P[v] = src; } else { D[v] = Infinity; P[v] = null; } });
    steps.push({ Np: Np.slice(), D: Object.assign({}, D), P: Object.assign({}, P), w: src, note: 'Initialisation: N′ = {' + src + '}; D(v) = c(' + src + ',v) for neighbours of ' + src + ', ∞ otherwise.' });
    while (Np.length < nodes.length) {
      var w = null;
      nodes.forEach(function (v) {
        if (Np.indexOf(v) >= 0) return;
        if (w == null || D[v] < D[w] || (D[v] === D[w] && Np.indexOf(P[v]) > Np.indexOf(P[w]))) w = v; // tie: prefer the most recently settled predecessor (matches the slide tables)
      });
      if (w == null || !isFinite(D[w])) break;
      Np.push(w);
      var upd = [];
      Object.keys(A[w]).forEach(function (v) {
        if (Np.indexOf(v) >= 0) return;
        var alt = D[w] + A[w][v];
        if (alt < D[v]) { upd.push('D(' + v + ') = min(' + (isFinite(D[v]) ? D[v] : '∞') + ', ' + D[w] + ' + ' + A[w][v] + ') = ' + alt + ' via ' + w); D[v] = alt; P[v] = w; }
        else upd.push('D(' + v + ') = min(' + D[v] + ', ' + D[w] + ' + ' + A[w][v] + ') = ' + D[v] + ' (no change)');
      });
      steps.push({ Np: Np.slice(), D: Object.assign({}, D), P: Object.assign({}, P), w: w, note: 'Pick ' + w + ' (smallest D not in N′ = ' + D[w] + '). ' + (upd.length ? upd.join('; ') + '.' : 'No neighbours left to update.') });
    }
    return { steps: steps, nodes: nodes, D: D, P: P };
  }
  W.dijkstra = function (host, o) {
    var gk = o.graph || 'k1', src = o.src || 'u', idx = 0, custom = 'A B 2\nA C 5\nB C 1\nB D 4\nC D 2\nC E 6\nD E 3';
    var row = el('div', { class: 'ctrls' });
    var gs = el('select', { class: 'inp', id: U.uid('g') });
    Object.keys(GRAPHS).forEach(function (k) { if (k !== 'xyz') gs.appendChild(el('option', { value: k, text: GRAPHS[k].name })); });
    gs.appendChild(el('option', { value: 'custom', text: 'Your own graph…' }));
    gs.value = gk;
    var ss = el('select', { class: 'inp', id: U.uid('s') });
    row.appendChild(U.ctrl('Graph', gs)); row.appendChild(U.ctrl('Source', ss));
    var prev = el('button', { type: 'button', class: 'btn ghost sm', text: '← Back' }), next = el('button', { type: 'button', class: 'btn sm', text: 'Next step →' }), all = el('button', { type: 'button', class: 'btn ghost sm', text: 'Show final answer' });
    row.appendChild(prev); row.appendChild(next); row.appendChild(all);
    host.appendChild(row);
    var ta = el('textarea', { class: 'inp', rows: '4', style: 'height:auto;width:min(100%,360px);padding:8px', id: U.uid('t'), 'aria-label': 'Edges, one per line: node node cost' });
    ta.value = custom;
    var custRow = el('div', { class: 'ctrls', hidden: true }, [U.ctrl('Edges (one per line: A B 3)', ta)]);
    host.appendChild(custRow);
    var gwrap = el('div', { class: 'canvas-wrap' }); host.appendChild(gwrap);
    var note = el('div', { class: 'workings' }); host.appendChild(note);
    var tw = el('div', { class: 'table-wrap' }); host.appendChild(tw);
    var fw = el('div'); host.appendChild(fw);
    var G, res;
    function graph() { if (gk === 'custom') { var e = parseEdges(ta.value); return { e: e, pos: layout(e) }; } return GRAPHS[gk]; }
    function setup() {
      G = graph(); var nodes = Object.keys(G.pos).sort();
      ss.innerHTML = ''; nodes.forEach(function (n) { ss.appendChild(el('option', { value: n, text: n })); });
      if (nodes.indexOf(src) < 0) src = nodes[0];
      ss.value = src; custRow.hidden = gk !== 'custom';
      res = dijkstraSteps(G, src); idx = 0; render();
    }
    function render() {
      var st = res.steps[idx], set = {}; st.Np.forEach(function (n) { set[n] = true; });
      var edges = {}; Object.keys(st.P).forEach(function (v) { if (st.P[v] && set[v]) edges[st.P[v] + v] = true; });
      var dist = {}; res.nodes.forEach(function (v) { if (v !== src) dist[v] = (isFinite(st.D[v]) ? st.D[v] : '∞') + (st.P[v] ? ',' + st.P[v] : ''); });
      gwrap.innerHTML = ''; gwrap.appendChild(graphSVG(G, { set: set, cur: idx ? st.w : null, src: src, edges: edges, dist: dist }));
      note.innerHTML = '<b>Step ' + idx + ' of ' + (res.steps.length - 1) + '.</b> ' + st.note;
      var others = res.nodes.filter(function (v) { return v !== src; });
      var h = '<table class="cmp"><thead><tr><th>Step</th><th>N′</th>' + others.map(function (v) { return '<th class="mono">D(' + v + '), p(' + v + ')</th>'; }).join('') + '</tr></thead><tbody>';
      res.steps.slice(0, idx + 1).forEach(function (s2, i) {
        h += '<tr><td class="num">' + i + '</td><td class="mono">' + s2.Np.join('') + '</td>' + others.map(function (v) {
          if (i && s2.Np.indexOf(v) >= 0) return '<td></td>'; // slide format: a column is blank from the row in which its node joins N′
          var chosen = i + 1 < res.steps.length && res.steps[i + 1].w === v && i + 1 <= idx;
          var txt = (isFinite(s2.D[v]) ? s2.D[v] : '∞') + (s2.P[v] ? ',' + s2.P[v] : '');
          return '<td class="mono">' + (chosen ? '<b class="hlb">' + txt + '</b>' : txt) + '</td>';
        }).join('') + '</tr>';
      });
      tw.innerHTML = h + '</tbody></table>';
      prev.disabled = idx === 0; next.disabled = idx >= res.steps.length - 1;
      fw.innerHTML = '';
      if (idx >= res.steps.length - 1) {
        var rows = others.map(function (v) {
          var path = [v], x = v; while (res.P[x] && res.P[x] !== src) { x = res.P[x]; path.unshift(x); }
          path.unshift(src);
          return '<tr><td class="mono">' + v + '</td><td class="num">' + (isFinite(res.D[v]) ? res.D[v] : '∞') + '</td><td class="mono">' + path.join(' → ') + '</td><td class="mono">(' + src + ', ' + path[1] + ')</td></tr>';
        });
        fw.appendChild(el('h4', { text: 'Result: shortest-path tree and forwarding table of ' + src }));
        fw.appendChild(el('div', { class: 'table-wrap', html: '<table class="cmp"><thead><tr><th>Destination</th><th class="num">Least cost</th><th>Path</th><th>Out link (next hop)</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>' }));
      }
    }
    gs.addEventListener('change', function () { gk = gs.value; setup(); });
    ss.addEventListener('change', function () { src = ss.value; res = dijkstraSteps(G, src); idx = 0; render(); });
    ta.addEventListener('input', U.debounce(setup, 300));
    prev.addEventListener('click', function () { idx = Math.max(0, idx - 1); render(); });
    next.addEventListener('click', function () { idx = Math.min(res.steps.length - 1, idx + 1); render(); });
    all.addEventListener('click', function () { idx = res.steps.length - 1; render(); });
    setup();
  };

  /* ---------------- distance vector (Bellman-Ford) ---------------- */
  W.dv = function (host, o) {
    var gk = o.graph || 'xyz', poison = false, rounds = [], ri = 0, scenario = 'converge', custom = 'A B 1\nB C 2\nA C 5';
    var row = el('div', { class: 'ctrls' });
    var gs = el('select', { class: 'inp', id: U.uid('g') });
    Object.keys(GRAPHS).forEach(function (k) { gs.appendChild(el('option', { value: k, text: GRAPHS[k].name })); });
    gs.appendChild(el('option', { value: 'custom', text: 'Your own graph…' }));
    gs.value = gk;
    row.appendChild(U.ctrl('Graph', gs));
    var scSeg = U.seg([['converge', 'Converge from scratch'], ['good', 'Cost drops: 4 → 1'], ['bad', 'Cost rises: 4 → 60']], scenario, function (v) { scenario = v; if (v !== 'converge') { gk = 'xyz'; gs.value = 'xyz'; } setup(); });
    row.appendChild(scSeg);
    host.appendChild(row);
    var row2 = el('div', { class: 'ctrls' });
    var pc = el('input', { type: 'checkbox', id: U.uid('pr') });
    pc.addEventListener('change', function () { poison = pc.checked; setup(); });
    row2.appendChild(el('label', { class: 'ctrl', for: pc.id, style: 'gap:6px;cursor:pointer' }, [pc, 'Poisoned reverse']));
    var prev = el('button', { type: 'button', class: 'btn ghost sm', text: '← Back' }), next = el('button', { type: 'button', class: 'btn sm', text: 'Next exchange →' }), last = el('button', { type: 'button', class: 'btn ghost sm', text: 'Jump to the end' });
    row2.appendChild(prev); row2.appendChild(next); row2.appendChild(last);
    host.appendChild(row2);
    var ta = el('textarea', { class: 'inp', rows: '3', style: 'height:auto;width:min(100%,360px);padding:8px', 'aria-label': 'Edges', id: U.uid('t') }); ta.value = custom;
    var custRow = el('div', { class: 'ctrls', hidden: true }, [U.ctrl('Edges (A B 3 per line)', ta)]); host.appendChild(custRow);
    var gwrap = el('div', { class: 'canvas-wrap' }); host.appendChild(gwrap);
    var note = el('div', { class: 'workings' }); host.appendChild(note);
    var tabs = el('div', { style: 'display:flex;flex-wrap:wrap;gap:10px' }); host.appendChild(tabs);
    var G;
    function run(A, nodes, init) {
      // init: map node -> {dest: [cost, nexthop]}
      var cur = init, out = [], guard = 0;
      while (guard++ < 70) {
        var nxt = {}, changed = [];
        nodes.forEach(function (x) {
          nxt[x] = {};
          nodes.forEach(function (y) {
            if (x === y) { nxt[x][y] = [0, '-']; return; }
            var best = Infinity, via = null;
            Object.keys(A[x]).forEach(function (v) {
              var adv = cur[v][y][0];
              if (poison && cur[v][y][1] === x) adv = Infinity;
              var c = A[x][v] + adv;
              if (c < best) { best = c; via = v; }
            });
            nxt[x][y] = [best, via];
            if (best !== cur[x][y][0]) changed.push(x + ':' + y);
          });
        });
        out.push({ D: nxt, changed: changed });
        cur = nxt;
        if (!changed.length) break;
      }
      return out;
    }
    function setup() {
      custRow.hidden = gk !== 'custom';
      if (gk === 'custom') { var e = parseEdges(ta.value); G = { e: e, pos: layout(e) }; }
      else if (scenario !== 'converge') G = { pos: GRAPHS.xyz.pos, e: [['x', 'y', 4], ['y', 'z', 1], ['x', 'z', 50]] };
      else G = GRAPHS[gk];
      var A = adjOf(G), nodes = Object.keys(G.pos).sort(), init = {};
      nodes.forEach(function (x) { init[x] = {}; nodes.forEach(function (y) { init[x][y] = x === y ? [0, '-'] : A[x][y] != null ? [A[x][y], y] : [Infinity, null]; }); });
      rounds = [{ D: init, changed: [], label: 'Initially each node knows only the costs to its direct neighbours.' }];
      if (scenario === 'converge') {
        run(A, nodes, init).forEach(function (r, i) { r.label = 'Exchange ' + (i + 1) + ': each node receives its neighbours\' vectors and applies Dx(y) = min over v { c(x,v) + Dv(y) }.'; rounds.push(r); });
      } else {
        var conv = run(A, nodes, init), base = conv[conv.length - 1].D;
        rounds = [{ D: base, changed: [], label: 'Converged with c(x,y) = 4, c(y,z) = 1, c(x,z) = 50. y reaches x directly (4); z goes through y (5).' }];
        var A2 = adjOf({ pos: G.pos, e: [['x', 'y', scenario === 'good' ? 1 : 60], ['y', 'z', 1], ['x', 'z', 50]] });
        G = { pos: G.pos, e: [['x', 'y', scenario === 'good' ? 1 : 60], ['y', 'z', 1], ['x', 'z', 50]] };
        run(A2, nodes, base).forEach(function (r, i) { r.label = 'After the change, exchange ' + (i + 1) + (r.changed.length ? '' : ': nothing changes, the algorithm is quiet again.'); rounds.push(r); });
      }
      ri = 0; render();
    }
    function render() {
      var r = rounds[ri], nodes = Object.keys(G.pos).sort();
      gwrap.innerHTML = ''; gwrap.appendChild(graphSVG(G, {}));
      var extra = '';
      if (scenario === 'bad' && ri === rounds.length - 1) extra = poison ? ' With poisoned reverse, z tells y that its distance to x is ∞ (because z routes through y), so y immediately sees the true picture.' : ' Bad news travels slowly: y and z keep bouncing the route between them, adding 1 or 2 each exchange, until the cost passes 50. This is the count-to-infinity problem.';
      if (scenario === 'good' && ri === rounds.length - 1) extra = ' Good news travels fast: the lower cost spreads in a couple of exchanges.';
      note.innerHTML = '<b>' + (ri === 0 ? 'Start' : 'Exchange ' + ri) + ' of ' + (rounds.length - 1) + '.</b> ' + (r.label || '') + extra;
      tabs.innerHTML = '';
      nodes.forEach(function (x) {
        var h = '<table class="cmp"><thead><tr><th>' + x + '</th>' + nodes.map(function (y) { return '<th class="mono">→' + y + '</th>'; }).join('') + '</tr></thead><tbody><tr><th>cost</th>';
        nodes.forEach(function (y) { var c = r.D[x][y], ch = r.changed.indexOf(x + ':' + y) >= 0; h += '<td class="mono">' + (ch ? '<b class="hlb">' : '') + (isFinite(c[0]) ? c[0] : '∞') + (ch ? '</b>' : '') + '</td>'; });
        h += '</tr><tr><th>via</th>'; nodes.forEach(function (y) { h += '<td class="mono">' + (r.D[x][y][1] || '–') + '</td>'; });
        tabs.appendChild(el('div', { class: 'table-wrap', style: 'flex:1 1 200px', html: h + '</tr></tbody></table>' }));
      });
      prev.disabled = ri === 0; next.disabled = ri >= rounds.length - 1;
    }
    gs.addEventListener('change', function () { gk = gs.value; scenario = 'converge'; scSeg.querySelectorAll('button').forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === 0)); }); setup(); });
    ta.addEventListener('input', U.debounce(setup, 300));
    prev.addEventListener('click', function () { ri = Math.max(0, ri - 1); render(); });
    next.addEventListener('click', function () { ri = Math.min(rounds.length - 1, ri + 1); render(); });
    last.addEventListener('click', function () { ri = rounds.length - 1; render(); });
    setup();
  };

  /* ---------------- header & frame diagrams ---------------- */
  var HDR = {
    udp: { t: 'UDP user datagram (8-byte header)', rows: [[['Source port number', 16, 'Port of the sending process. Optional (0 if unused).'], ['Destination port number', 16, 'Port of the receiving process, e.g. 53 for DNS.']], [['Total length', 16, 'Length of header + data in bytes (8 to 65,535).'], ['Checksum', 16, 'Covers the pseudoheader, header and data. Optional in IPv4 (all 0s if not used).']], [['Data (application message)', 32, 'The payload, variable length.', true]]] },
    tcp: { t: 'TCP segment header (20–60 bytes)', rows: [[['Source port address', 16, 'Port of the sending application.'], ['Destination port address', 16, 'Port of the receiving application, e.g. 80 for HTTP.']], [['Sequence number', 32, 'Number of the first data byte in this segment. During setup each side picks a random initial sequence number (ISN).']], [['Acknowledgment number', 32, 'Next byte the sender of this segment expects to receive (cumulative ACK). Valid only if the ACK flag is set.']], [['HLEN', 4, 'Header length in 4-byte words (5 to 15, i.e. 20 to 60 bytes).'], ['Reserved', 6, 'For future use.'], ['URG', 1, 'Urgent pointer field is valid.'], ['ACK', 1, 'Acknowledgment field is valid.'], ['PSH', 1, 'Push the data to the application now.'], ['RST', 1, 'Reset the connection.'], ['SYN', 1, 'Synchronise sequence numbers during connection setup.'], ['FIN', 1, 'Sender has finished sending data (terminate).'], ['Window size', 16, 'Receive window (rwnd) in bytes: how much more the receiver can accept. Used for flow control.']], [['Checksum', 16, 'Mandatory error check over pseudoheader, header and data.'], ['Urgent pointer', 16, 'Used only with URG: offset to the end of urgent data.']], [['Options and padding (0–40 bytes)', 32, 'E.g. maximum segment size, window scale, timestamps.', true]]] },
    ipv4: { t: 'IPv4 datagram header (20–60 bytes)', rows: [[['VER', 4, 'Version = 4.'], ['HLEN', 4, 'Header length in 4-byte words (5–15).'], ['Service type', 8, 'Type of service / differentiated services: priority and handling of the datagram.'], ['Total length', 16, 'Header + data in bytes, up to 65,535.']], [['Identification', 16, 'Same value in every fragment of one datagram, so the destination can reassemble it.'], ['Flags', 3, 'Reserved, D (do not fragment) and M (more fragments).'], ['Fragmentation offset', 13, 'Position of this fragment\'s data in the original datagram, in units of 8 bytes.']], [['Time-to-live', 8, 'Hop limit: each router decrements it; at 0 the datagram is discarded. Stops looping packets.'], ['Protocol', 8, 'Upper-layer protocol: 1 = ICMP, 2 = IGMP, 6 = TCP, 17 = UDP, 89 = OSPF.'], ['Header checksum', 16, 'Covers only the header; recomputed at every router because TTL changes.']], [['Source IP address', 32, '32-bit address of the original sender.']], [['Destination IP address', 32, '32-bit address of the final receiver.']], [['Options + padding', 32, 'Up to 40 bytes, used for network testing and debugging. Not required in every header, but every IP implementation must be able to process them. Some options are changed by routers, which forces a checksum recalculation.', true, '0–40 bytes']]] },
    ipv6: { t: 'IPv6 base header (fixed 40 bytes)', rows: [[['VER', 4, 'Version = 6.'], ['Traffic class (priority)', 8, 'Priority of the packet relative to others from the same source.'], ['Flow label', 20, 'Identifies packets of one flow that need the same special handling (e.g. real-time audio).']], [['Payload length', 16, 'Length of everything after the 40-byte base header.'], ['Next header', 8, 'Type of the next header: an extension header or the upper-layer protocol (TCP, UDP). Replaces options and the protocol field.'], ['Hop limit', 8, 'Same job as TTL in IPv4.']], [['Source address', 32, '16-byte (128-bit) Internet address that identifies the original source of the datagram.', true, '128 bits (4 rows)']], [['Destination address', 32, '16-byte (128-bit) Internet address that identifies the destination of the datagram.', true, '128 bits (4 rows)']]], note: 'No header checksum and no fragmentation fields: routers never fragment in IPv6; only the source does, using an extension header.' },
    dhcp: { t: 'DHCP message format', rows: [[['Opcode', 8, 'Operation code: 1 = request, 2 = reply.'], ['Htype', 8, 'Hardware type (Ethernet = 1).'], ['HLen', 8, 'Length of the hardware (physical) address in bytes.'], ['HCount', 8, 'Maximum number of hops the packet can travel.']], [['Transaction ID', 32, 'An integer set by the client and repeated by the server, so simultaneous clients can be told apart.']], [['Time elapsed', 16, 'Number of seconds since the client started to boot.'], ['Flags', 16, 'First bit: unicast (0) or multicast (1) reply; the other 15 bits are not used.']], [['Client IP address', 32, 'Set to 0 if the client does not know it.']], [['Your IP address', 32, 'The client IP address sent (offered) by the server.']], [['Server IP address', 32, 'A broadcast address if the client does not know the server.']], [['Gateway IP address', 32, 'The address of the default router.']], [['Client hardware address', 32, 'The client\'s physical (MAC) address.', true, '16 bytes']], [['Server name', 32, 'Optional server domain name.', true, '64 bytes']], [['Boot file name', 32, 'Optional file name (path) where the client can find more information.', true, '128 bytes']], [['Options', 32, 'Dual purpose: additional information or vendor-specific information. Starts with the magic cookie 99.130.83.99; then tag–length–value options. Tag 53 gives the message type (1 DISCOVER … 8 INFORM).', true, '64 bytes']]] },
    dns: { t: 'DNS message format (query and response)', rows: [[['Identification', 16, 'Chosen by the client; the response carries the same number so the client can match it to its query.'], ['Flags', 16, 'Query or response, authoritative answer, recursion desired / available, error codes.']], [['Number of question records', 16, ''], ['Number of answer records', 16, '']], [['Number of authoritative records', 16, ''], ['Number of additional records', 16, '']], [['Question section', 32, 'Name and type asked for. Present in both query and response.', true]], [['Answer section', 32, 'Resource records that answer the question (responses only).', true]], [['Authoritative section', 32, 'Records naming authoritative servers for the query.', true]], [['Additional information section', 32, 'Extra helpful records, e.g. the IP address of an authoritative server.', true]]] }
  };
  var FRAMES = {
    ppp: { t: 'PPP frame (byte-oriented)', f: [['Flag', '1 byte', '01111110: marks the start (and end) of the frame.'], ['Address', '1 byte', '11111111: constant broadcast address; may be omitted after negotiation.'], ['Control', '1 byte', '11000000: constant, since PPP has no sequence numbers or flow control.'], ['Protocol', '1–2 bytes', 'What the payload carries: user data (e.g. IP) or LCP / authentication / NCP packets.'], ['Payload', 'variable', 'User data or other information; default maximum 1500 bytes; byte-stuffed with escape 01111101.', 3], ['FCS', '2 or 4 bytes', 'Frame check sequence: a standard CRC.'], ['Flag', '1 byte', '01111110']] },
    hdlc: { t: 'HDLC frame (bit-oriented)', f: [['Flag', '8 bits', '01111110: start/end of frame and receiver synchronisation pattern.'], ['Address', '8+ bits', 'Address of the secondary station: a "to" address when sent by the primary, a "from" address when sent by a secondary.'], ['Control', '8 or 16 bits', 'Frame type plus flow/error control fields; see the three formats below.'], ['Information', 'variable', 'User data from the network layer (I-frames) or management information (U-frames).', 3], ['FCS', '16 or 32 bits', 'ITU-T CRC for error detection.'], ['Flag', '8 bits', '01111110']] },
    'hdlc-ctl': { t: 'HDLC control field formats', rows3: [['I-frame', [['0', 1, 'Type: 0 = information frame'], ['N(S)', 3, 'Sequence number of this frame'], ['P/F', 1, 'Poll (primary → secondary) or final (secondary → primary)'], ['N(R)', 3, 'Acknowledgment number, piggybacked']]], ['S-frame', [['1 0', 2, 'Type: 10 = supervisory frame'], ['Code', 2, '00 RR (receive ready) · 10 RNR (receive not ready) · 01 REJ (reject, Go-Back-N) · 11 SREJ (selective reject)'], ['P/F', 1, 'Poll / final'], ['N(R)', 3, 'ACK or NAK number depending on the code']]], ['U-frame', [['1 1', 2, 'Type: 11 = unnumbered frame'], ['Code', 2, 'Prefix of the U-frame code'], ['P/F', 1, 'Poll / final'], ['Code', 3, 'Suffix; with the prefix gives up to 32 commands: SABM, UA, DISC…']]]] },
    ssh: { t: 'SSH packet', f: [['Length', '4 bytes', 'Length of the packet, not counting the padding.'], ['Padding', '1–8 bytes', 'Random padding to make attacks on the security provision harder.'], ['Type', '1 byte', 'Which SSH protocol the packet belongs to.'], ['Data', 'variable', 'The data carried for SSH-TRANS, SSH-AUTH or SSH-CONN.', 3], ['CRC', '4 bytes', 'Error detection.']] }
  };
  W.header = function (host, o) {
    var spec = o.spec || 'udp', info = el('div', { class: 'info-panel', html: '<h4>Tap any field</h4><p>The description of the field appears here.</p>' });
    var pal = ['--net', '--dll', '--phy', '--tl', '--app', '--tip', '--tool', '--accent'];
    function show(f) { info.innerHTML = '<h4>' + f[0] + ' <span class="chip">' + (f[4] || (typeof f[1] === 'number' ? f[1] + ' bit' + (f[1] > 1 ? 's' : '') : f[1])) + '</span></h4><p>' + (f[2] || 'Counts the records in that section.') + '</p>'; }
    function cell(f, i, cols, total) {
      var b = el('button', { type: 'button', style: 'grid-column: span ' + cols + ';min-width:0;border:1px solid var(--line-2);background:color-mix(in srgb, var(' + pal[i % pal.length] + ') 13%, var(--surface));color:var(--ink);padding:8px 4px;font:600 .8rem/1.25 var(--font-body);cursor:pointer;text-align:center;border-radius:0;' + (f[3] ? 'border-style:dashed;' : '') }, [el('span', { text: f[0] }), el('br'), el('span', { class: 'mono', style: 'font-weight:500;color:var(--muted);font-size:.72rem', text: f[4] || (typeof f[1] === 'number' ? f[1] + (f[1] === 1 ? ' bit' : ' bits') : f[1]) })]);
      b.addEventListener('click', function () { show(f); });
      b.addEventListener('mouseenter', function () { show(f); });
      return b;
    }
    if (HDR[spec]) {
      var h = HDR[spec];
      host.appendChild(el('div', { class: 'small muted', text: h.t + ' · each row is 32 bits' }));
      var scale = el('div', { style: 'display:grid;grid-template-columns:repeat(32,1fr);font:500 .62rem var(--font-mono);color:var(--muted);min-width:560px' });
      [0, 4, 8, 16, 24, 31].forEach(function (b) { scale.appendChild(el('span', { style: 'grid-column:' + (b + 1) + ';', text: String(b) })); });
      var gridWrap = el('div', { class: 'canvas-wrap' });
      var inner = el('div', { style: 'min-width:560px' });
      inner.appendChild(scale);
      var ci = 0;
      h.rows.forEach(function (r) { var g = el('div', { style: 'display:grid;grid-template-columns:repeat(32,1fr);margin-top:-1px' }); r.forEach(function (f) { g.appendChild(cell(f, ci++, f[1], 32)); }); inner.appendChild(g); });
      gridWrap.appendChild(inner); host.appendChild(gridWrap);
      if (h.note) host.appendChild(el('p', { class: 'hint', text: h.note }));
    } else if (FRAMES[spec] && FRAMES[spec].f) {
      var fr = FRAMES[spec];
      host.appendChild(el('div', { class: 'small muted', text: fr.t }));
      var cw = el('div', { class: 'canvas-wrap' }), row = el('div', { style: 'display:grid;grid-template-columns:' + fr.f.map(function (f) { return (f[3] || 1) + 'fr'; }).join(' ') + ';min-width:560px' });
      fr.f.forEach(function (f, i) { row.appendChild(cell([f[0], f[1], f[2]], i, 1, 1)); });
      cw.appendChild(row); host.appendChild(cw);
    } else if (FRAMES[spec] && FRAMES[spec].rows3) {
      FRAMES[spec].rows3.forEach(function (r, ri) {
        var line = el('div', { style: 'display:grid;grid-template-columns:90px repeat(8,1fr);align-items:stretch;gap:0;margin-top:4px' });
        line.appendChild(el('div', { style: 'font:700 .85rem var(--font-display);display:flex;align-items:center', text: r[0] }));
        r[1].forEach(function (f, i) { var c = cell(f, ri * 4 + i, f[1], 8); line.appendChild(c); });
        host.appendChild(el('div', { class: 'canvas-wrap' }, [line]));
      });
    }
    host.appendChild(info);
  };

  /* ---------------- sequence diagrams ---------------- */
  var SEQ = {
    'tcp-open': { lanes: ['Client', 'Server'], states: [['CLOSED', 'LISTEN'], ['SYN-SENT', ''], ['', 'SYN-RCVD'], ['ESTABLISHED', 'ESTABLISHED']], m: [[0, 'SYN', 'seq = x (client ISN)', 'Active open. A SYN segment carries no data but consumes one sequence number.'], [1, 'SYN + ACK', 'seq = y (server ISN), ack = x + 1', 'Server accepts: it sends its own SYN and acknowledges the client\'s SYN. Also consumes one sequence number.'], [0, 'ACK', 'seq = x + 1, ack = y + 1', 'Client acknowledges the server\'s SYN. A pure ACK consumes no sequence number; it may carry the first data.']] },
    'tcp-data': { lanes: ['Client', 'Server'], m: [[0, 'Data', 'seq 8001, ack 15001 · bytes 8001–9000 (PSH)', 'Client sends its first 1000 bytes. It also acknowledges everything the server sent so far.'], [0, 'Data', 'seq 9001, ack 15001 · bytes 9001–10000', 'Second segment; sequence numbers count bytes, so it starts at 9001.'], [1, 'Data + ACK', 'seq 15001, ack 10001 · bytes 15001–17000', 'Server piggybacks a cumulative ACK (next byte expected 10001) on its own data.'], [0, 'ACK', 'seq 10001, ack 17001, rwnd 10000', 'Client acknowledges the server\'s bytes; no data, so its sequence number does not advance.']] },
    'tcp-close': { lanes: ['Client', 'Server'], states: [['ESTABLISHED', 'ESTABLISHED'], ['FIN-WAIT-1', ''], ['FIN-WAIT-2', 'CLOSE-WAIT'], ['', 'LAST-ACK'], ['TIME-WAIT → CLOSED', 'CLOSED']], m: [[0, 'FIN', 'seq = x, ack = y', 'Client has no more data and sends FIN (FIN bit = 1). It can no longer send, but can still receive.'], [1, 'ACK', 'ack = x + 1', 'Server acknowledges the FIN. It may still send data (half-close).'], [1, 'FIN', 'seq = y', 'Server finishes and sends its own FIN.'], [0, 'ACK', 'ack = y + 1', 'Client acknowledges and waits 2 × maximum segment lifetime (TIME-WAIT) before closing.']], note: 'Forouzan also shows a three-way close where the server combines its ACK and FIN into one FIN + ACK segment.' },
    'tcp-close3': { lanes: ['Client', 'Server'], m: [[0, 'FIN', 'seq = x, ack = y', 'Client closes its direction.'], [1, 'FIN + ACK', 'seq = y, ack = x + 1', 'Server acknowledges the client\'s FIN and announces its own close at the same time.'], [0, 'ACK', 'seq = x, ack = y + 1', 'Client acknowledges; the connection is closed in both directions.']] },
    smtp: { lanes: ['Client (crepes.fr)', 'Server (hamburger.edu)'], m: [[1, '220', 'hamburger.edu', 'Server greets: service ready (421 would mean not available).'], [0, 'HELO', 'crepes.fr', 'Client identifies itself with its domain name.'], [1, '250', 'Hello crepes.fr, pleased to meet you', 'Request completed.'], [0, 'MAIL FROM:', '<alice@crepes.fr>', 'Introduces the sender (return address for errors).'], [1, '250', 'alice@crepes.fr … Sender ok', ''], [0, 'RCPT TO:', '<bob@hamburger.edu>', 'Recipient; repeated for each recipient.'], [1, '250', 'bob@hamburger.edu … Recipient ok', ''], [0, 'DATA', '', 'Start of the message.'], [1, '354', 'Enter mail, end with "." on a line by itself', ''], [0, 'message lines', '"Do you like ketchup?" … "."', 'The message ends with a line holding a single period (CRLF.CRLF).'], [1, '250', 'Message accepted for delivery', ''], [0, 'QUIT', '', 'Connection termination.'], [1, '221', 'hamburger.edu closing connection', '']] },
    pop3: { lanes: ['Client (user agent)', 'POP3 server'], m: [[1, '+OK', 'POP3 server ready', 'TCP connection to port 110.'], [0, 'user bob', '', 'Authorization phase.'], [1, '+OK', '', ''], [0, 'pass hungry', '', ''], [1, '+OK', 'user successfully logged on', ''], [0, 'list', '', 'Transaction phase: list message numbers and sizes.'], [1, '1 498 · 2 912 · .', '', ''], [0, 'retr 1', '', 'Retrieve message 1.'], [1, '<message 1 contents> .', '', ''], [0, 'dele 1', '', 'Download-and-delete mode.'], [0, 'quit', '', ''], [1, '+OK', 'POP3 server signing off', 'Update phase: deleted messages are removed.']] },
    'http-np': { lanes: ['Browser', 'Web server (port 80)'], m: [[0, 'SYN', '', 'Step 1: TCP three-way handshake starts.'], [1, 'SYN + ACK', '', 'One RTT passes before the client can send.'], [0, 'ACK + HTTP request', 'GET /someDept/home.index HTTP/1.1', 'The request rides on the third handshake segment.'], [1, 'HTTP response', 'HTTP/1.1 200 OK + base HTML file', 'Second RTT, plus the time to transmit the file.'], [1, 'FIN', '', 'Non-persistent: the server closes the connection after one object. Steps repeat for each of the 10 images.']] },
    cookie: { lanes: ['Shopper\'s browser', 'BestToys web server'], m: [[0, 'GET /toys', 'first visit: no cookie', 'The shopper visits the BestToys site and asks to view toys.'], [1, '200 OK + Set-Cookie: 12343', 'toy pictures with links', 'The server creates an empty shopping cart with ID 12343 and sends the ID in a Set-Cookie header. The browser stores it in a file named BestToys.'], [0, 'GET /add?toy', 'Cookie: 12343', 'The shopper clicks a toy. The browser finds the BestToys cookie and includes it, so the server knows this is an old client.'], [1, '200 OK', 'cart updated, total price', 'The server retrieves cart 12343, adds the toy and asks for payment details.'], [0, 'POST payment', 'Cookie: 12343 + card details', 'The payment is sent with the same ID.'], [1, '200 OK', 'order confirmed', 'The server matches the ID, processes the payment and confirms the order.']], note: 'The cookie is made by the server and "eaten" by the server: the browser never reads its contents or shows them to the user.' },
    ftp: { lanes: ['FTP client', 'FTP server'], m: [[0, 'TCP to port 21', '', 'Control connection; stays open for the whole session.'], [0, 'USER / PASS', '', 'Sent as ASCII lines over the control connection.'], [1, '331 → 230', 'Username OK, password required → logged in', ''], [0, 'PORT', 'ephemeral port number', 'Client does a passive open on a new port and tells the server.'], [0, 'RETR file', '', 'Ask for a file.'], [1, 'connect from port 20', 'data connection', 'Server does an active open from port 20 to the client\'s port.'], [1, 'file data', '', 'The file flows over the data connection.'], [1, '226', 'data connection closed', 'One data connection per file; the control connection remains.']] },
    'tcp-flow': { lanes: ['Client (sender)', 'Server (receiver)'], m: [[0, 'SYN', 'seqNo = 100', 'Client requests a connection with ISN 100. The server allocates an 800-byte buffer (an assumption) and sets rwnd = 800; the next byte it expects is 101.'], [1, 'SYN + ACK', 'ackNo = 101, rwnd = 800', 'The server expects bytes from 101 and tells the client it may set an 800-byte send window.'], [0, 'ACK', 'rwnd = 2000 (other direction)', 'The client defines rwnd = 2000 for data in the other direction; it is not used here because data flows one way.'], [0, 'Data', 'seqNo = 101 · 200 bytes (101–300)', 'The process pushes 200 bytes. The client sends them; 200 bytes are now sent but not acknowledged. At the server the receive window closes: 200 bytes stored, next byte expected 301.'], [1, 'ACK', 'ackNo = 301, rwnd = 600', 'The server acknowledges bytes up to 300 and advertises rwnd = 600. The client purges the acknowledged bytes; its window is 600 and cannot open further because the receiver does not allow it.'], [0, 'Data', 'seqNo = 301 · 300 bytes (301–600)', 'The client sends 300 more bytes. Meanwhile the server process pulls 100 bytes: the receive window closes by 300 from the left and opens by 100 from the right, so it shrinks by 200 to 400.'], [1, 'ACK', 'ackNo = 601, rwnd = 400', 'The client must reduce its send window to 400: it closes from the left by 300 and opens from the right by 100.'], [1, 'ACK', 'ackNo = 601, rwnd = 600', 'The server process pulls another 200 bytes, so rwnd grows to 600. The server still expects byte 601. The client opens its window by 200 without closing it: size 600.']], note: 'Unidirectional transfer from client to server; error control is ignored (no segment is lost or corrupted).' },
    'fast-rtx': { lanes: ['Sender', 'Receiver'], m: [[0, 'Segment 1', 'seq 90 · bytes 90–99', 'Arrives safely.'], [1, 'ACK 100', 'next byte expected = 100', 'The receiver expects the second segment (byte 100).'], [0, 'Segment 2', 'seq 100 · bytes 100–109', 'This segment is lost in the network.', 'lost'], [0, 'Segment 3', 'seq 110', 'A gap: byte 100 is missing. TCP stores the out-of-order segment.'], [1, 'ACK 100', 'duplicate 1', 'The receiver still expects byte 100, so it repeats ACK 100.'], [0, 'Segment 4', 'seq 120', 'Stored out of order.'], [1, 'ACK 100', 'duplicate 2', 'Another duplicate ACK.'], [0, 'Segment 5', 'seq 130', 'Stored out of order.'], [1, 'ACK 100', 'duplicate 3', 'Original ACK plus three duplicates: four ACK 100s.'], [0, 'Segment 2 again', 'fast retransmission', 'On the third duplicate ACK the sender resends segment 2 immediately, even though its timer has not expired yet.'], [1, 'ACK 140', 'bytes 90–139 all received', 'The missing segment fills the gap; the cumulative ACK jumps to 140.']], note: 'Why wait for three duplicates? One or two duplicate ACKs may only mean that segments were reordered; three are a strong sign that a segment is really missing.' },
    dhcp: { lanes: ['New host (port 68)', 'DHCP server (port 67)'], m: [[0, 'DHCPDISCOVER', 'src 0.0.0.0 → dst 255.255.255.255', 'Only the transaction ID is set (a random number). UDP source port 68, destination port 67. The host knows neither its own address nor the server\'s, so it uses the this-host source and the broadcast destination.'], [1, 'DHCPOFFER', 'your address = offered IP · server address', 'The server (or several servers) offers an IP address. The datagram has the server as source but is broadcast, so other servers can see the offer and make a better one.'], [0, 'DHCPREQUEST', 'to the server with the best offer', 'The host selects the best offer and requests it, with the known fields filled in; same port numbers as the first message.'], [1, 'DHCPACK', 'address confirmed (or DHCPNACK)', 'If the offered address is still valid the server sends DHCPACK and the host may use it for the lease period. If the server cannot keep its offer it sends DHCPNACK and the host starts again. Also broadcast, so other servers learn the result.']] }
  };
  W.seq = function (host, o) {
    var sp = SEQ[o.spec || 'tcp-open'], shown = sp.m.length, info = el('div', { class: 'info-panel' });
    var ctr = el('div', { class: 'ctrls' });
    var play = el('button', { type: 'button', class: 'btn sm', text: 'Replay step by step' });
    var nxt = el('button', { type: 'button', class: 'btn ghost sm', text: 'Next message →' });
    ctr.appendChild(play); ctr.appendChild(nxt);
    host.appendChild(ctr);
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    host.appendChild(info);
    if (sp.note) host.appendChild(el('p', { class: 'hint', text: sp.note }));
    var timer = null;
    function draw() {
      var Wd = 640, xa = 120, xb = Wd - 120, top = 50, step = 54, Hd = top + sp.m.length * step + 40;
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'Sequence diagram' });
      s.style.maxWidth = '720px';
      var id = host.__id;
      var defs = svg('defs'); ['net', 'dll'].forEach(function (c) { var mk = svg('marker', { id: 'sq-' + c + id, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' }); mk.appendChild(svg('path', { d: 'M0 0 L10 5 L0 10 z', style: 'fill:var(--' + c + ')' })); defs.appendChild(mk); }); s.appendChild(defs);
      [[xa, sp.lanes[0]], [xb, sp.lanes[1]]].forEach(function (l) {
        s.appendChild(svg('text', { x: l[0], y: 20, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:var(--ink)', text: l[1] }));
        s.appendChild(svg('line', { x1: l[0], x2: l[0], y1: 30, y2: Hd - 10, style: 'stroke:var(--ink-2);stroke-width:2' }));
      });
      if (sp.states) sp.states.forEach(function (st, i) {
        var y = top + (i === 0 ? -8 : i * step - 14);
        if (i > shown) return;
        if (st[0]) s.appendChild(svg('text', { x: xa - 10, y: y, 'text-anchor': 'end', class: 'mono', style: 'font-size:10.5px;fill:var(--tl);font-weight:600', text: st[0] }));
        if (st[1]) s.appendChild(svg('text', { x: xb + 10, y: y, class: 'mono', style: 'font-size:10.5px;fill:var(--tl);font-weight:600', text: st[1] }));
      });
      sp.m.slice(0, shown).forEach(function (m, i) {
        var y0 = top + i * step, y1 = y0 + step * 0.72, x0 = m[0] === 0 ? xa : xb, x1 = m[0] === 0 ? xb : xa, c = m[0] === 0 ? 'net' : 'dll';
        var lost = m[4] === 'lost', f0 = lost ? 0.3 : 0.5, mx = x0 + (x1 - x0) * f0, my = y0 + (y1 - y0) * f0;
        if (lost) {
          var lx = x0 + (x1 - x0) * 0.62, ly = y0 + (y1 - y0) * 0.62;
          s.appendChild(svg('line', { x1: x0, y1: y0, x2: lx, y2: ly, style: 'stroke:var(--exam);stroke-width:2;stroke-dasharray:6 4' }));
          s.appendChild(svg('text', { x: lx + 4, y: ly + 6, class: 'mono', style: 'font-size:16px;font-weight:700;fill:var(--exam)', text: '✕ lost' }));
          c = 'exam';
        } else s.appendChild(svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, style: 'stroke:var(--' + c + ');stroke-width:2', 'marker-end': 'url(#sq-' + c + id + ')' }));
        s.appendChild(svg('text', { x: mx, y: my - 9, 'text-anchor': 'middle', class: 'mono', style: 'font-size:12.5px;font-weight:700;fill:var(--' + c + ')', text: m[1] }));
        if (m[2]) s.appendChild(svg('text', { x: mx, y: my + 17, 'text-anchor': 'middle', class: 'mono', style: 'font-size:10.5px;fill:var(--ink-2)', text: m[2] }));
      });
      s.appendChild(svg('text', { x: 14, y: Hd - 12, style: 'font-size:11px;fill:var(--muted)', text: 'time ↓' }));
      wrap.innerHTML = ''; wrap.appendChild(s);
      var cur = sp.m[Math.max(0, shown - 1)];
      info.innerHTML = '<h4>' + (shown < sp.m.length ? 'Message ' + shown + ' of ' + sp.m.length + ': ' : 'All ' + sp.m.length + ' messages · last: ') + cur[1] + '</h4><p>' + (cur[3] || cur[2] || '') + '</p>';
    }
    host.__id = U.uid('sq');
    play.addEventListener('click', function () {
      clearInterval(timer); shown = 1; draw();
      timer = setInterval(function () { if (shown >= sp.m.length) { clearInterval(timer); return; } shown++; draw(); }, U.reducedMotion() ? 2500 : 1400);
    });
    nxt.addEventListener('click', function () { clearInterval(timer); shown = shown >= sp.m.length ? 1 : shown + 1; draw(); });
    draw();
    return { destroy: function () { clearInterval(timer); } };
  };

  /* ---------------- TCP congestion window ---------------- */
  W.cwnd = function (host, o) {
    var st = { ss: 8, n: 22, variant: 'reno', events: { 8: '3dup' } };
    var row = el('div', { class: 'ctrls' });
    row.appendChild(U.seg([['tahoe', 'TCP Tahoe'], ['reno', 'TCP Reno']], st.variant, function (v) { st.variant = v; draw(); }));
    var ssIn = U.input('8', 'w-s'); ssIn.addEventListener('input', function () { st.ss = Math.max(2, Math.round(U.num(ssIn.value, 8))); draw(); });
    row.appendChild(U.ctrl('Initial ssthresh (MSS)', ssIn));
    host.appendChild(row);
    var row2 = el('div', { class: 'ctrls' });
    var rSel = el('select', { class: 'inp', id: U.uid('r') }); for (var i = 2; i <= 21; i++) rSel.appendChild(el('option', { value: String(i), text: 'round ' + i })); rSel.value = '8';
    var tSel = el('select', { class: 'inp', id: U.uid('e') }); [['3dup', 'three duplicate ACKs'], ['timeout', 'time-out'], ['', 'no event']].forEach(function (x) { tSel.appendChild(el('option', { value: x[0], text: x[1] })); });
    row2.appendChild(U.ctrl('At the end of', rSel)); row2.appendChild(U.ctrl('the sender sees', tSel));
    row2.appendChild(el('button', { type: 'button', class: 'btn sm', text: 'Add event', onclick: function () { if (tSel.value) st.events[+rSel.value] = tSel.value; else delete st.events[+rSel.value]; draw(); } }));
    row2.appendChild(el('button', { type: 'button', class: 'btn ghost sm', text: 'Clear events', onclick: function () { st.events = {}; draw(); } }));
    host.appendChild(row2);
    presetRow(host, [['Slide figure: loss at round 8', { 8: '3dup' }], ['Time-out at 10, dup ACKs at 17', { 10: 'timeout', 17: '3dup' }]], function (ev) { st.events = Object.assign({}, ev); draw(); });
    var wrap = el('div', { class: 'canvas-wrap' }); host.appendChild(wrap);
    var tw = el('details', { class: 'solution' }); host.appendChild(tw);
    function simulate() {
      var cw = 1, ss = st.ss, out = [];
      for (var r = 1; r <= st.n; r++) {
        var phase = cw < ss ? 'slow start' : 'congestion avoidance';
        out.push({ r: r, cw: cw, ss: ss, phase: phase, ev: st.events[r] || '' });
        var e = st.events[r];
        if (e === 'timeout') { ss = Math.max(2, Math.floor(cw / 2)); cw = 1; }
        else if (e === '3dup') { ss = Math.max(2, Math.floor(cw / 2)); cw = st.variant === 'reno' ? ss + 3 : 1; }
        else cw = cw < ss ? Math.min(cw * 2, ss) : cw + 1;
      }
      return out;
    }
    function draw() {
      var data = simulate(), maxW = Math.max.apply(null, data.map(function (d) { return Math.max(d.cw, d.ss); })) + 2;
      var Wd = 680, Hd = 300, l = 44, b = 40, r = 14, t = 16, X = function (k) { return l + (Wd - l - r) * (k - 1) / (st.n - 1); }, Y = function (v) { return Hd - b - (Hd - b - t) * v / maxW; };
      var s = svg('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, role: 'img', 'aria-label': 'Congestion window versus transmission round' });
      for (var v = 0; v <= maxW; v += 2) { s.appendChild(svg('line', { x1: l, x2: Wd - r, y1: Y(v), y2: Y(v), style: 'stroke:var(--line)' })); s.appendChild(svg('text', { x: l - 6, y: Y(v) + 4, 'text-anchor': 'end', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: String(v) })); }
      for (var k = 1; k <= st.n; k += (st.n > 16 ? 2 : 1)) s.appendChild(svg('text', { x: X(k), y: Hd - b + 16, 'text-anchor': 'middle', class: 'mono', style: 'font-size:10px;fill:var(--muted)', text: String(k) }));
      s.appendChild(svg('text', { x: (l + Wd) / 2, y: Hd - 6, 'text-anchor': 'middle', style: 'font-size:11px;fill:var(--muted)', text: 'transmission round (one RTT each)' }));
      s.appendChild(svg('text', { x: 6, y: t + 4, style: 'font-size:11px;fill:var(--muted)', text: 'cwnd (MSS)' }));
      var sd = ''; data.forEach(function (d, i) { sd += (i ? 'L' : 'M') + X(d.r) + ' ' + Y(d.ss) + ' '; });
      s.appendChild(svg('path', { d: sd, style: 'fill:none;stroke:var(--warn);stroke-width:1.6;stroke-dasharray:6 4' }));
      var cd = ''; data.forEach(function (d, i) { cd += (i ? 'L' : 'M') + X(d.r) + ' ' + Y(d.cw) + ' '; });
      s.appendChild(svg('path', { d: cd, style: 'fill:none;stroke:var(--tl);stroke-width:2.6' }));
      data.forEach(function (d) {
        s.appendChild(svg('circle', { cx: X(d.r), cy: Y(d.cw), r: 3.6, style: 'fill:' + (d.phase === 'slow start' ? 'var(--surface)' : 'var(--tl)') + ';stroke:var(--tl);stroke-width:2' }));
        if (d.ev) s.appendChild(svg('text', { x: X(d.r), y: Y(d.cw) - 10, 'text-anchor': 'middle', style: 'font-size:11px;font-weight:700;fill:var(--exam)', text: d.ev === 'timeout' ? 'time-out' : '3 dup ACKs' }));
      });
      wrap.innerHTML = ''; wrap.appendChild(s);
      wrap.appendChild(el('div', { class: 'legend' }, [el('span', { html: '<i style="background:var(--tl)"></i>cwnd (hollow dot = slow start, solid = congestion avoidance)' }), el('span', { html: '<i style="background:var(--warn)"></i>ssthresh' })]));
      tw.innerHTML = '<summary>Round-by-round table</summary>';
      var h = '<div class="body"><div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Round</th><th class="num">cwnd</th><th class="num">ssthresh</th><th>Phase</th><th>Event at end of round</th></tr></thead><tbody>';
      data.forEach(function (d) { h += '<tr><td class="num">' + d.r + '</td><td class="num">' + d.cw + '</td><td class="num">' + d.ss + '</td><td>' + d.phase + '</td><td>' + (d.ev === 'timeout' ? 'time-out → ssthresh = cwnd/2, cwnd = 1' : d.ev === '3dup' ? (st.variant === 'reno' ? '3 dup ACKs → fast retransmit; ssthresh = cwnd/2, cwnd = ssthresh + 3 (fast recovery)' : '3 dup ACKs → Tahoe treats it like a time-out: cwnd = 1') : '') + '</td></tr>'; });
      tw.innerHTML += h + '</tbody></table></div></div>';
    }
    draw();
  };

  /* ---------------- RTT estimation ---------------- */
  W.rtt = function (host, o) {
    var est = U.input(o.est || '100', 'w-s'), dev = U.input(o.dev || '5', 'w-s'), al = U.input('0.125', 'w-s'), be = U.input('0.25', 'w-s'), samp = U.input(o.s || '106, 120, 140, 90, 115', 'w-l');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('Initial EstimatedRTT (ms)', est), U.ctrl('Initial DevRTT (ms)', dev), U.ctrl('α', al), U.ctrl('β', be)]));
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('SampleRTT values (ms)', samp)]));
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      var E = U.num(est.value, 100), D = U.num(dev.value, 5), a = U.num(al.value, 0.125), b = U.num(be.value, 0.25);
      var S = samp.value.split(/[,\s]+/).filter(Boolean).map(Number).filter(isFinite);
      var rows = '', first = [];
      S.forEach(function (s, i) {
        var E2 = (1 - a) * E + a * s, D2 = (1 - b) * D + b * Math.abs(s - E2), TOI = E2 + 4 * D2;
        if (i === 0) first = ['EstimatedRTT = (1 − α)·EstimatedRTT + α·SampleRTT = ' + (1 - a) + ' × ' + fmt(E, 3) + ' + ' + a + ' × ' + s + ' = <b>' + fmt(E2, 3) + ' ms</b>', 'DevRTT = (1 − β)·DevRTT + β·|SampleRTT − EstimatedRTT| = ' + (1 - b) + ' × ' + fmt(D, 3) + ' + ' + b + ' × |' + s + ' − ' + fmt(E2, 3) + '| = <b>' + fmt(D2, 3) + ' ms</b>', 'TimeoutInterval = EstimatedRTT + 4·DevRTT = ' + fmt(E2, 3) + ' + 4 × ' + fmt(D2, 3) + ' = <b>' + fmt(TOI, 3) + ' ms</b>'];
        rows += '<tr><td class="num">' + (i + 1) + '</td><td class="num">' + s + '</td><td class="num">' + fmt(E2, 3) + '</td><td class="num">' + fmt(D2, 3) + '</td><td class="num"><b>' + fmt(TOI, 3) + '</b></td></tr>';
        E = E2; D = D2;
      });
      out.innerHTML = '';
      if (first.length) out.appendChild(work(['<b>First sample</b>'].concat(first)));
      out.appendChild(el('div', { class: 'table-wrap', html: '<table class="cmp"><thead><tr><th class="num">#</th><th class="num">SampleRTT</th><th class="num">EstimatedRTT</th><th class="num">DevRTT</th><th class="num">TimeoutInterval</th></tr></thead><tbody>' + rows + '</tbody></table>' }));
    }
    [est, dev, al, be, samp].forEach(function (x) { x.addEventListener('input', calc); }); calc();
  };

  /* ---------------- HTTP response time ---------------- */
  W.http = function (host, o) {
    var rtt = U.input(o.rtt || '100', 'w-s'), tb = U.input('10', 'w-s'), n = U.input('10', 'w-s'), to = U.input('10', 'w-s'), k = U.input('5', 'w-s');
    host.appendChild(el('div', { class: 'ctrls' }, [U.ctrl('RTT (ms)', rtt), U.ctrl('Base HTML transmit (ms)', tb), U.ctrl('Referenced objects', n), U.ctrl('Transmit per object (ms)', to), U.ctrl('Parallel connections', k)]));
    var out = el('div', { style: 'display:grid;gap:10px' }); host.appendChild(out);
    function calc() {
      var R = U.num(rtt.value, 100), B = U.num(tb.value, 10), N = Math.max(0, Math.round(U.num(n.value, 10))), T = U.num(to.value, 10), K = Math.max(1, Math.round(U.num(k.value, 5)));
      var base = 2 * R + B;
      var cases = [
        ['Non-persistent, one at a time', base + N * (2 * R + T), '(2RTT + t) for the base file, then (2RTT + t) for each of the ' + N + ' objects'],
        ['Non-persistent, ' + K + ' parallel connections', base + Math.ceil(N / K) * (2 * R + T), 'objects fetched in ' + Math.ceil(N / K) + ' batches of up to ' + K],
        ['Persistent, no pipelining', base + N * (R + T), 'connection stays open: 1 RTT + t per object'],
        ['Persistent with pipelining', base + R + N * T, 'all requests sent back-to-back: about one RTT for all objects']
      ];
      var mx = Math.max.apply(null, cases.map(function (c) { return c[1]; }));
      out.innerHTML = '';
      var wrap = el('div', { style: 'display:grid;gap:8px' });
      cases.forEach(function (c) {
        wrap.appendChild(el('div', { style: 'display:grid;gap:3px' }, [
          el('div', { class: 'small', html: '<b>' + c[0] + '</b> · <span class="mono">' + fmt(c[1], 1) + ' ms</span> <span class="muted">(' + c[2] + ')</span>' }),
          el('div', { class: 'bar', style: 'flex:none;width:100%;height:10px' }, [el('i', { style: 'width:' + (c[1] / mx * 100) + '%;background:var(--app)' })])
        ]));
      });
      out.appendChild(wrap);
      out.appendChild(work(['Base page: one RTT to set up TCP + one RTT for the request and first bytes + transmit time = 2 × ' + R + ' + ' + B + ' = <b>' + fmt(base, 1) + ' ms</b>', 'Non-persistent total = ' + fmt(cases[0][1], 1) + ' ms · persistent with pipelining = ' + fmt(cases[3][1], 1) + ' ms']));
    }
    [rtt, tb, n, to, k].forEach(function (x) { x.addEventListener('input', calc); }); calc();
  };
})();
