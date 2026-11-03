/* Signal to Socket — 3D scenes (three.js r128, global THREE)
   stack · topology · fiber · signal · mux · dns · journey */
(function () {
  'use strict';
  var DCN = window.DCN, U = DCN.util;
  if (!window.THREE) return;
  var T = window.THREE;

  /* ---------- shared helpers ---------- */
  function colors() {
    var g = function (n, d) { return U.css(n) || d; };
    return {
      ink: g('--ink', '#0E1628'), ink2: g('--ink-2', '#33415A'), muted: g('--muted', '#5F6B82'),
      surface: g('--surface', '#FFFFFF'), surface2: g('--surface-2', '#EBEFF6'), line: g('--line', '#D6DDE8'), line2: g('--line-2', '#C5CEDC'),
      accent: g('--accent', '#D24E1A'), phy: g('--phy', '#CF5A22'), dll: g('--dll', '#0A8C61'), net: g('--net', '#2459D8'),
      tl: g('--tl', '#7A42D1'), app: g('--app', '#C9255F'), found: g('--found', '#4A5872'), ok: g('--ok', '#0C7F4E'),
      exam: g('--exam', '#C21F3A'), tip: g('--tip', '#1F66C9'), tool: g('--tool', '#9A5B05'), dark: DCN.isDark()
    };
  }
  function col(c) { return new T.Color(c); }
  function mix(a, b, t) { return col(a).lerp(col(b), t); }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function labelTexture(text, o) {
    var fs = o.size || 46;
    var font = (o.weight || 600) + ' ' + fs + 'px ' + (o.mono ? '"IBM Plex Mono", ui-monospace, monospace' : '"IBM Plex Sans", "Segoe UI", Arial, sans-serif');
    var c = document.createElement('canvas'), ctx = c.getContext('2d');
    ctx.font = font;
    var lines = String(text).split('\n');
    var w = Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; }));
    var padX = o.bg ? fs * 0.55 : 6, padY = o.bg ? fs * 0.32 : 4, lh = fs * 1.22;
    c.width = Math.ceil(w + padX * 2); c.height = Math.ceil(lh * lines.length + padY * 2);
    ctx.font = font;
    if (o.bg) { roundRect(ctx, 1.5, 1.5, c.width - 3, c.height - 3, fs * 0.36); ctx.fillStyle = o.bg; ctx.fill(); if (o.border) { ctx.lineWidth = 3; ctx.strokeStyle = o.border; ctx.stroke(); } }
    ctx.fillStyle = o.color || '#000'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    lines.forEach(function (l, i) { ctx.fillText(l, c.width / 2, padY + lh * (i + 0.5)); });
    var tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
    return { tex: tex, aspect: c.width / c.height };
  }
  function label(text, o) {
    o = o || {};
    var lt = labelTexture(text, o);
    var mat = new T.SpriteMaterial({ map: lt.tex, transparent: true, depthTest: o.depthTest !== false, depthWrite: false });
    var s = new T.Sprite(mat);
    var h = o.height || 0.32;
    s.scale.set(h * lt.aspect, h, 1);
    s.renderOrder = o.renderOrder || 10;
    s.userData.label = { text: text, o: o };
    s.setText = function (t, o2) {
      if (t === s.userData.label.text && !o2) return;
      var oo = Object.assign({}, s.userData.label.o, o2 || {});
      var n = labelTexture(t, oo);
      if (mat.map) mat.map.dispose();
      mat.map = n.tex; mat.needsUpdate = true;
      s.scale.set((oo.height || 0.32) * n.aspect, oo.height || 0.32, 1);
      s.userData.label = { text: t, o: oo };
    };
    return s;
  }
  function faceLabel(text, o) {
    var lt = labelTexture(text, o), h = o.height || 0.3;
    var m = new T.Mesh(new T.PlaneGeometry(h * lt.aspect, h), new T.MeshBasicMaterial({ map: lt.tex, transparent: true, depthWrite: false }));
    m.renderOrder = 5;
    return m;
  }
  function makeOrbit(camera, dom, o) {
    var st = { theta: o.theta == null ? 0.6 : o.theta, phi: o.phi == null ? 1.15 : o.phi, r: o.r || 12, target: o.target || new T.Vector3(), minR: o.minR || 3, maxR: o.maxR || 40, auto: o.auto || 0, dragging: false };
    var home = { theta: st.theta, phi: st.phi, r: st.r };
    var pts = new Map(), last = null, moved = 0, pinch0 = 0, r0 = 0;
    function apply() {
      var sp = Math.sin(st.phi);
      camera.position.set(st.target.x + st.r * sp * Math.sin(st.theta), st.target.y + st.r * Math.cos(st.phi), st.target.z + st.r * sp * Math.cos(st.theta));
      camera.lookAt(st.target);
    }
    function down(e) {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { last = { x: e.clientX, y: e.clientY }; moved = 0; st.dragging = true; }
      else if (pts.size === 2) { var p = Array.from(pts.values()); pinch0 = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); r0 = st.r; }
    }
    function move(e) {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) { var p = Array.from(pts.values()), d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); if (pinch0 > 0 && d > 0) { st.r = U.clamp(r0 * pinch0 / d, st.minR, st.maxR); apply(); } moved += 10; return; }
      if (!last) return;
      var dx = e.clientX - last.x, dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY }; moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 4 && dom.setPointerCapture) { try { dom.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } }
      st.theta -= dx * 0.008; st.phi = U.clamp(st.phi - dy * 0.006, 0.18, 1.52); apply();
    }
    function up(e) {
      var wasClick = pts.size === 1 && moved < 6;
      pts.delete(e.pointerId);
      if (pts.size === 0) { st.dragging = false; last = null; if (wasClick && e.type === 'pointerup' && o.onClick) o.onClick(e); }
    }
    function wheel(e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); st.r = U.clamp(st.r * Math.pow(1.0018, e.deltaY), st.minR, st.maxR); apply();
    }
    dom.addEventListener('pointerdown', down); dom.addEventListener('pointermove', move);
    dom.addEventListener('pointerup', up); dom.addEventListener('pointercancel', up);
    dom.addEventListener('wheel', wheel, { passive: false });
    apply();
    return {
      st: st, apply: apply,
      zoom: function (f) { st.r = U.clamp(st.r * f, st.minR, st.maxR); apply(); },
      reset: function () { st.theta = home.theta; st.phi = home.phi; st.r = home.r; apply(); },
      to: function (theta, phi, r) { st.theta = theta; st.phi = phi; if (r) st.r = r; apply(); },
      update: function (dt) { if (st.auto && !st.dragging) { st.theta += st.auto * dt; apply(); } },
      dispose: function () {
        dom.removeEventListener('pointerdown', down); dom.removeEventListener('pointermove', move);
        dom.removeEventListener('pointerup', up); dom.removeEventListener('pointercancel', up); dom.removeEventListener('wheel', wheel);
      }
    };
  }
  function makeStage(stage, o) {
    o = o || {};
    var renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = T.sRGBEncoding;
    stage.appendChild(renderer.domElement);
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(o.fov || 38, 1.6, 0.1, 400);
    var hemi = new T.HemisphereLight(0xffffff, 0x667788, 0.95); scene.add(hemi);
    var dl = new T.DirectionalLight(0xffffff, 0.7); dl.position.set(6, 12, 9); scene.add(dl);
    var frameFns = [], running = false, visible = true, raf = 0, lastT = 0, disposed = false;
    var ray = new T.Raycaster(), mouse = new T.Vector2(), pickables = [], onPick = null;
    var reduced = U.reducedMotion();
    var orbit = makeOrbit(camera, renderer.domElement, Object.assign({}, o.orbit || {}, {
      auto: reduced ? 0 : ((o.orbit && o.orbit.auto) || 0),
      onClick: function (e) { if (onPick) onPick(raycast(e)); }
    }));
    function raycast(e) {
      var r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(pickables, true);
      return hits[0] || null;
    }
    function resize() {
      var w = stage.clientWidth || 600, h = stage.clientHeight || 340;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      if (o.onResize) o.onResize(w, h);
    }
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(stage); else window.addEventListener('resize', resize);
    resize();
    var io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }, { threshold: 0.01 });
    io.observe(stage);
    function loop(t) {
      raf = 0;
      if (disposed) return;
      if (!visible || document.hidden) { running = false; return; }
      var dt = Math.min(0.05, (t - lastT) / 1000 || 0.016); lastT = t;
      orbit.update(dt);
      for (var i = 0; i < frameFns.length; i++) frameFns[i](dt, t / 1000);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (running || disposed) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(loop); }
    function onVis() { if (!document.hidden) start(); }
    document.addEventListener('visibilitychange', onVis);
    function hover(e) { if (!pickables.length || e.buttons) return; renderer.domElement.style.cursor = raycast(e) ? 'pointer' : ''; }
    renderer.domElement.addEventListener('pointermove', hover);
    // overlay: zoom + reset
    var ov = U.el('div', { class: 'overlay' });
    var left = U.el('span', { class: 'badge', text: o.badge || 'Drag to orbit' });
    var right = U.el('span', { style: 'display:flex;gap:6px' });
    [['−', 'Zoom out', 1.15], ['+', 'Zoom in', 1 / 1.15]].forEach(function (b) {
      right.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', 'aria-label': b[1], text: b[0], onclick: function () { orbit.zoom(b[2]); } }));
    });
    right.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Reset view', onclick: function () { orbit.reset(); } }));
    ov.appendChild(left); ov.appendChild(right);
    stage.appendChild(ov);
    var offTheme = U.onTheme(function () { if (o.onTheme) o.onTheme(colors()); });
    start();
    return {
      scene: scene, camera: camera, renderer: renderer, orbit: orbit, reduced: reduced, badge: left,
      onFrame: function (f) { frameFns.push(f); },
      pickable: function (list, cb) { pickables = list; onPick = cb; },
      dispose: function () {
        disposed = true; cancelAnimationFrame(raf); io.disconnect(); if (ro) ro.disconnect();
        document.removeEventListener('visibilitychange', onVis); offTheme(); orbit.dispose();
        scene.traverse(function (ob) {
          if (ob.geometry) ob.geometry.dispose();
          if (ob.material) (Array.isArray(ob.material) ? ob.material : [ob.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
        });
        renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }
  function clearGroup(g) {
    while (g.children.length) {
      var ch = g.children.pop();
      ch.traverse(function (ob) {
        if (ob.geometry) ob.geometry.dispose();
        if (ob.material) (Array.isArray(ob.material) ? ob.material : [ob.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
    }
  }
  function std(color, extra) { return new T.MeshStandardMaterial(Object.assign({ color: col(color), roughness: 0.55, metalness: 0.05 }, extra || {})); }
  function cylBetween(a, b, r, mat) {
    var d = new T.Vector3().subVectors(b, a), len = d.length();
    var m = new T.Mesh(new T.CylinderGeometry(r, r, len, 12, 1), mat);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.clone().normalize());
    return m;
  }
  function line(points, color, o) {
    o = o || {};
    var g = new T.BufferGeometry().setFromPoints(points);
    var m = o.dashed ? new T.LineDashedMaterial({ color: col(color), dashSize: o.dash || 0.18, gapSize: o.gap || 0.12, transparent: true, opacity: o.opacity == null ? 1 : o.opacity })
      : new T.LineBasicMaterial({ color: col(color), transparent: true, opacity: o.opacity == null ? 1 : o.opacity });
    var l = new T.Line(g, m);
    if (o.dashed) l.computeLineDistances();
    return l;
  }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function infoPanel(body) { var p = U.el('div', { class: 'info-panel' }); body.appendChild(p); return p; }
  function ctrlRow(body) { var r = U.el('div', { class: 'ctrls' }); body.insertBefore(r, body.firstChild); return r; }

  /* =====================================================================
     1) STACK — protocol stacks with encapsulation (hero + OSI lab)
     ===================================================================== */
  var OSI = [
    { k: 'phy', n: 'Physical', pdu: 'Bits', hdr: '', d: 'Moves individual bits from one hop (node) to the next.', f: ['Physical characteristics of interfaces and media', 'Representation of bits (encoding)', 'Data rate and bit synchronization', 'Line configuration, physical topology, transmission mode'], ex: 'Cables, hubs, repeaters, NIC transceivers' },
    { k: 'dll', n: 'Data link', pdu: 'Frame', hdr: 'H2', tr: 'T2', d: 'Moves frames from one hop (node) to the next: hop-to-hop delivery.', f: ['Framing', 'Physical (MAC) addressing', 'Flow control and error control', 'Access control on shared links'], ex: 'Switches, bridges; Ethernet, PPP, HDLC' },
    { k: 'net', n: 'Network', pdu: 'Packet', hdr: 'H3', d: 'Delivers individual packets from the source host to the destination host.', f: ['Logical (IP) addressing', 'Routing through intermediate routers'], ex: 'Routers; IP, ICMP, IGMP' },
    { k: 'tl', n: 'Transport', pdu: 'Segment', hdr: 'H4', d: 'Delivers a whole message from one process to another. Often called the heart of OSI.', f: ['Service-point (port) addressing', 'Segmentation and reassembly', 'Connection control', 'End-to-end flow and error control'], ex: 'TCP, UDP, SCTP' },
    { k: 'ses', n: 'Session', pdu: 'Data', hdr: 'H5', d: 'Dialog controller: sets up, maintains and synchronizes the interaction.', f: ['Dialog control (half or full duplex)', 'Synchronization with checkpoints'], ex: 'Login sessions in online banking' },
    { k: 'pre', n: 'Presentation', pdu: 'Data', hdr: 'H6', d: 'Takes care of the syntax and semantics of the information exchanged.', f: ['Translation (e.g. ASCII ↔ EBCDIC)', 'Encryption and decryption', 'Compression (lossy or lossless)'], ex: 'SSL/TLS, JPEG, MP3' },
    { k: 'app', n: 'Application', pdu: 'Message', hdr: 'H7', d: 'Gives users and programs access to network services.', f: ['Network virtual terminal', 'File transfer and access', 'Mail services', 'Directory services'], ex: 'HTTP, FTP, SMTP, DNS, TELNET' }
  ];
  var TCPIP = [
    { k: 'phy', n: 'Physical', pdu: 'Bits', hdr: '', d: 'Carries individual bits as electrical, optical or radio signals across the medium.', f: ['Bits to signals', 'Transmission media sit below it (layer 0)'], ex: 'Cables, hubs, repeaters' },
    { k: 'dll', n: 'Data link', pdu: 'Frame', hdr: 'DH', tr: 'DT', d: 'Moves a frame from one node to the next node over a link (hop-to-hop).', f: ['Encapsulates the datagram in a frame', 'TCP/IP defines no protocol here: any LAN/WAN protocol works'], ex: 'Link-layer switches; Ethernet, Wi-Fi, PPP' },
    { k: 'net', n: 'Network', pdu: 'Datagram', hdr: 'NH', d: 'Host-to-host delivery and routing of datagrams across the internet.', f: ['IP: connectionless, unreliable, best effort', 'ICMP, IGMP, ARP, DHCP help IP'], ex: 'Routers' },
    { k: 'tl', n: 'Transport', pdu: 'Segment', hdr: 'TH', d: 'End-to-end, process-to-process delivery of the message.', f: ['TCP: reliable, connection-oriented (flow, error, congestion control)', 'UDP: connectionless, unreliable; SCTP for newer apps'], ex: 'Port numbers identify processes' },
    { k: 'app', n: 'Application', pdu: 'Message', hdr: '', d: 'Process-to-process communication between two programs.', f: ['SMTP, FTP, HTTP, DNS, SNMP, TELNET / SSH'], ex: 'Your browser, mail client, ssh' }
  ];
  function layerColor(c, k) {
    if (k === 'ses') return mix(c.app, c.surface, 0.45);
    if (k === 'pre') return mix(c.app, c.surface, 0.22);
    return col(c[k]);
  }

  DCN.scenes.stack = function (stage, opts, body) {
    var hero = opts.mode === 'hero';
    var c = colors();
    var model = hero ? 'tcpip' : (opts.model || 'osi');
    var S = makeStage(stage, {
      orbit: { r: hero ? 12.5 : 14, theta: 0.32, phi: 1.32, target: new T.Vector3(0, -0.25, 0), auto: hero ? 0.09 : 0, minR: 6, maxR: 28 },
      badge: hero ? 'Drag to orbit · click a layer' : 'Drag to orbit · click a layer for details',
      onTheme: function (nc) { c = nc; build(); }
    });
    var root = new T.Group(); S.scene.add(root);
    var info = infoPanel(body);
    var playing = !S.reduced, tau = 0;
    var L, stacks, packet, bits, wireCurve, pduLabel, slabs = [], deliveredLabel, peerLines = [];
    var W = 3.1, Dp = 2.2, GAP = 0.16, X = 2.35;
    if (!hero) {
      var row = ctrlRow(body);
      row.appendChild(U.seg([['osi', 'OSI · 7 layers'], ['tcpip', 'TCP/IP · 5 layers']], model, function (v) { model = v; tau = 0; build(); showDefault(); }));
      var pb = U.el('button', { type: 'button', class: 'btn sm', text: playing ? 'Pause' : 'Play encapsulation' });
      pb.addEventListener('click', function () { playing = !playing; pb.textContent = playing ? 'Pause' : 'Play encapsulation'; });
      row.appendChild(pb);
      row.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Restart', onclick: function () { tau = 0; playing = true; pb.textContent = 'Pause'; } }));
    }
    function layers() { return model === 'osi' ? OSI : TCPIP; }
    function H() { return model === 'osi' ? 0.44 : 0.56; }
    function yOf(i) { return i * (H() + GAP); }
    function build() {
      clearGroup(root); slabs = []; peerLines = [];
      L = layers();
      var h = H();
      [-X, X].forEach(function (x, side) {
        L.forEach(function (ly, i) {
          var colr = layerColor(c, ly.k);
          var m = new T.Mesh(new T.BoxGeometry(W, h, Dp), std(colr, { transparent: true, opacity: c.dark ? 0.9 : 0.94, roughness: 0.6 }));
          m.position.set(x, yOf(i), 0);
          m.userData = { layer: i, side: side };
          root.add(m); slabs.push(m);
          var eg = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: col(c.dark ? c.ink : c.ink2), transparent: true, opacity: 0.35 }));
          eg.position.copy(m.position); root.add(eg);
          var txt = (model === 'osi' ? (i + 1) + '  ' : '') + ly.n;
          var lb = faceLabel(txt, { color: c.dark ? '#0A0E16' : '#FFFFFF', size: 44, weight: 650, height: h * 0.5 });
          lb.position.set(x, yOf(i), Dp / 2 + 0.012);
          root.add(lb);
        });
        var tl = label(side === 0 ? (hero ? 'Host A · sender' : 'Sender') : (hero ? 'Host B · receiver' : 'Receiver'), { color: c.ink, size: 40, weight: 650, height: 0.34 });
        tl.position.set(x, yOf(L.length - 1) + h / 2 + 0.55, 0); root.add(tl);
      });
      // peer-to-peer logical lines
      L.forEach(function (ly, i) {
        var pl = line([new T.Vector3(-X + W / 2 + 0.05, yOf(i), -Dp / 2 + 0.2), new T.Vector3(X - W / 2 - 0.05, yOf(i), -Dp / 2 + 0.2)], c.muted, { dashed: true, opacity: 0.6 });
        root.add(pl); peerLines.push(pl);
      });
      if (!hero) {
        var pt = label('peer-to-peer (logical) links', { color: c.muted, size: 30, height: 0.22 });
        pt.position.set(0, yOf(L.length - 1) + 0.25, -Dp / 2 + 0.2); root.add(pt);
      }
      // wire
      var y0 = yOf(0) - H() / 2 - 0.05;
      wireCurve = new T.CatmullRomCurve3([new T.Vector3(-X, y0, 0.6), new T.Vector3(-X + 0.6, y0 - 0.9, 0.9), new T.Vector3(0, y0 - 1.25, 1.0), new T.Vector3(X - 0.6, y0 - 0.9, 0.9), new T.Vector3(X, y0, 0.6)]);
      var wire = new T.Mesh(new T.TubeGeometry(wireCurve, 60, 0.06, 8, false), std(c.phy, { roughness: 0.4 }));
      root.add(wire);
      var wl = label('transmission medium', { color: c.muted, size: 30, height: 0.22 });
      wl.position.set(0, y0 - 1.6, 1.0); root.add(wl);
      // packet
      packet = new T.Group(); root.add(packet);
      var core = new T.Mesh(new T.BoxGeometry(0.46, 0.3, 0.3), std(c.dark ? '#E6EBF4' : '#FFFFFF', { roughness: 0.3, emissive: col(c.dark ? '#E6EBF4' : '#FFFFFF'), emissiveIntensity: 0.15 }));
      packet.add(core);
      packet.userData.parts = [];
      var off = 0.23;
      for (var i = L.length - 1; i >= 0; i--) {
        var ly = L[i];
        if (!ly.hdr) continue;
        var hm = new T.Mesh(new T.BoxGeometry(0.16, 0.3, 0.3), std(layerColor(c, ly.k), { emissive: layerColor(c, ly.k), emissiveIntensity: 0.25 }));
        off += 0.17; hm.position.x = -off; packet.add(hm);
        var hl = label(ly.hdr, { color: c.ink, size: 28, height: 0.17, mono: true });
        hl.position.set(-off, 0.27, 0.16); packet.add(hl);
        var parts = [hm, hl];
        if (ly.tr) {
          var tm = new T.Mesh(new T.BoxGeometry(0.16, 0.3, 0.3), std(layerColor(c, ly.k), { emissive: layerColor(c, ly.k), emissiveIntensity: 0.25 }));
          tm.position.x = 0.23 + 0.09; packet.add(tm);
          var tlb = label(ly.tr, { color: c.ink, size: 28, height: 0.17, mono: true });
          tlb.position.set(0.32, 0.27, 0.16); packet.add(tlb);
          parts.push(tm, tlb);
        }
        packet.userData.parts.push({ layer: i, parts: parts });
      }
      pduLabel = label('Message', { color: c.ink, bg: c.surface, border: c.line2, size: 30, height: 0.27, weight: 600 });
      root.add(pduLabel);
      deliveredLabel = label('Delivered to the application', { color: c.ok, bg: c.surface, border: c.ok, size: 30, height: 0.28, weight: 650 });
      deliveredLabel.visible = false; root.add(deliveredLabel);
      bits = new T.Group(); root.add(bits);
      for (var b = 0; b < 12; b++) {
        var bm = new T.Mesh(new T.SphereGeometry(0.075, 10, 8), std(b % 3 ? c.phy : c.accent, { emissive: col(c.phy), emissiveIntensity: 0.6 }));
        bits.add(bm);
      }
      S.pickable(slabs, pick);
      root.position.y = -yOf(L.length - 1) / 2 + 0.3;
    }
    var Dstep = 0.95, Wdur = 1.8;
    function setHeaders(test) {
      packet.userData.parts.forEach(function (p) { var v = test(p.layer); p.parts.forEach(function (o) { o.visible = v; }); });
    }
    function pduName(lowest) { return L[lowest] ? L[lowest].pdu : 'Message'; }
    function update(dt) {
      if (!L) return;
      if (playing) tau += dt;
      var n = L.length, T1 = n * Dstep, total = 2 * T1 + Wdur + 1.4;
      if (tau > total) tau = 0;
      var zf = Dp / 2 + 0.45;
      deliveredLabel.visible = false;
      if (tau < T1) {
        var k = Math.floor(tau / Dstep), f = (tau - k * Dstep) / Dstep, li = n - 1 - k, y = yOf(li);
        if (f > 0.42 && li > 0) y = yOf(li) + (yOf(li - 1) - yOf(li)) * ease((f - 0.42) / 0.58);
        packet.visible = true; bits.visible = false;
        packet.position.set(-X, y, zf);
        var arrived = f > 0.12 ? li : li + 1;
        setHeaders(function (l) { return l >= arrived; });
        pduLabel.visible = true; pduLabel.position.set(-X - 1.35, y + 0.42, zf);
        pduLabel.setText(li === 0 && f > 0.6 ? 'Bits' : pduName(arrivedLowest(arrived)));
      } else if (tau < T1 + Wdur) {
        var s = (tau - T1) / Wdur;
        packet.visible = false; bits.visible = true; pduLabel.visible = true;
        bits.children.forEach(function (bm, i) { var u = U.clamp(s * 1.25 - i * 0.025, 0, 1); bm.visible = u > 0 && u < 1; bm.position.copy(wireCurve.getPoint(u)); });
        var mid = wireCurve.getPoint(U.clamp(s, 0, 1));
        pduLabel.position.set(mid.x, mid.y + 0.55, mid.z); pduLabel.setText('Bits on the wire');
      } else if (tau < 2 * T1 + Wdur) {
        var t2 = tau - T1 - Wdur, k2 = Math.floor(t2 / Dstep), f2 = (t2 - k2 * Dstep) / Dstep, y2 = yOf(k2);
        if (f2 > 0.42 && k2 < n - 1) y2 = yOf(k2) + (yOf(k2 + 1) - yOf(k2)) * ease((f2 - 0.42) / 0.58);
        packet.visible = true; bits.visible = false;
        packet.position.set(X, y2, zf);
        var gone = f2 > 0.25 ? k2 : k2 - 1;
        setHeaders(function (l) { return l > gone; });
        pduLabel.visible = true; pduLabel.position.set(X + 1.35, y2 + 0.42, zf);
        pduLabel.setText(pduName(arrivedLowest(gone + 1)));
      } else {
        packet.visible = true; bits.visible = false; setHeaders(function () { return false; });
        packet.position.set(X, yOf(n - 1), zf); pduLabel.visible = false;
        deliveredLabel.visible = true; deliveredLabel.position.set(X, yOf(n - 1) + 0.75, zf);
      }
    }
    function arrivedLowest(from) {
      for (var i = Math.max(0, from); i < L.length; i++) if (L[i].hdr) return i;
      return L.length - 1;
    }
    function showDefault() {
      if (hero) {
        info.innerHTML = '<h4>Click a layer</h4><p>Each slab is a layer of the TCP/IP stack. Click one to see which chapters of your syllabus live there. The moving packet gains a header at every layer on the way down and loses it on the way up: that is encapsulation.</p>';
      } else {
        info.innerHTML = '<h4>Click any layer</h4><p>Watch the packet: each layer on the sending side adds its own header (the data link layer also adds a trailer). The receiving side strips them in reverse order. Dashed lines show that each layer talks only to its peer layer on the other machine.</p>';
      }
    }
    function pick(hit) {
      if (!hit) return;
      var obj = hit.object; while (obj && obj.userData.layer == null) obj = obj.parent;
      if (!obj) return;
      var ly = L[obj.userData.layer];
      slabs.forEach(function (s) { s.material.emissive = new T.Color(0x000000); });
      slabs.filter(function (s) { return s.userData.layer === obj.userData.layer; }).forEach(function (s) { s.material.emissive = layerColor(c, ly.k); s.material.emissiveIntensity = 0.35; });
      var sw = '<span class="sw" style="background:' + '#' + layerColor(c, ly.k).getHexString() + '"></span>';
      if (hero) {
        var chs = DCN.ordered().filter(function (ch) { return ch.layer === ly.k && ch.part !== 'X'; });
        var html = '<h4>' + sw + ly.n + ' layer</h4><p>' + ly.d + '</p>';
        if (chs.length) html += '<ul>' + chs.map(function (ch) { return '<li><a href="#' + ch.id + '">Chapter ' + ch.num + ' · ' + ch.title + '</a></li>'; }).join('') + '</ul>';
        if (ly.k === 'phy') html += '<p class="small muted">Chapters 1 and 2 (foundations) cover every layer.</p>';
        info.innerHTML = html;
      } else {
        info.innerHTML = '<h4>' + sw + (model === 'osi' ? 'Layer ' + (obj.userData.layer + 1) + ' · ' : '') + ly.n + '</h4><p>' + ly.d + '</p><ul>' + ly.f.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p class="small"><b>Unit of data:</b> ' + ly.pdu + (ly.hdr ? ' · <b>adds:</b> ' + ly.hdr + (ly.tr ? ' + ' + ly.tr : '') : '') + ' · <b>examples:</b> ' + ly.ex + '</p>';
      }
    }
    build(); showDefault();
    S.onFrame(update);
    return { dispose: S.dispose };
  };

  /* =====================================================================
     2) TOPOLOGY — mesh / star / bus / ring / hybrid with failures
     ===================================================================== */
  DCN.scenes.topology = function (stage, opts, body) {
    var c = colors();
    var S = makeStage(stage, { orbit: { r: 9.6, theta: 0.25, phi: 0.92, target: new T.Vector3(0, -0.2, 0), minR: 5, maxR: 26 }, badge: 'Click a cable to cut it', onTheme: function (nc) { c = nc; build(); } });
    var root = new T.Group(); S.scene.add(root);
    var kind = opts.start || 'mesh', n = 6, hubFailed = false;
    var nodes = [], edges = [], hub = null, packetObj = null, anim = null;
    var row = ctrlRow(body);
    row.appendChild(U.seg([['mesh', 'Mesh'], ['star', 'Star'], ['bus', 'Bus'], ['ring', 'Ring'], ['hybrid', 'Hybrid']], kind, function (v) { kind = v; hubFailed = false; build(); }));
    var nIn = U.el('input', { type: 'range', min: '3', max: '9', value: String(n), id: U.uid('n') });
    var nLab = U.el('b', { class: 'mono', text: String(n) });
    nIn.addEventListener('input', function () { n = +nIn.value; nLab.textContent = n; build(); });
    row.appendChild(U.el('div', { class: 'ctrl' }, [U.el('label', { for: nIn.id, text: 'Devices' }), nIn, nLab]));
    row.appendChild(U.el('button', { type: 'button', class: 'btn sm', text: 'Send a packet', onclick: function () { send(); } }));
    var failBtn = U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Fail the hub', onclick: function () { hubFailed = !hubFailed; paint(); status(); } });
    row.appendChild(failBtn);
    row.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Repair all', onclick: function () { hubFailed = false; edges.forEach(function (e) { e.broken = false; }); paint(); status(); } }));
    var readout = U.el('div', { class: 'readout' }); body.appendChild(readout);
    var info = infoPanel(body);

    function addNode(p, labelText, isHub) {
      var m = isHub
        ? new T.Mesh(new T.BoxGeometry(1.0, 0.45, 1.0), std(c.accent))
        : new T.Mesh(new T.BoxGeometry(0.66, 0.46, 0.5), std(c.found));
      m.position.copy(p);
      root.add(m);
      if (!isHub) {
        var scr = new T.Mesh(new T.BoxGeometry(0.54, 0.32, 0.02), std(c.dark ? '#9fc3ff' : '#cfe0ff', { emissive: col('#7fb0ff'), emissiveIntensity: 0.25 }));
        scr.position.set(p.x, p.y + 0.02, p.z + 0.26); root.add(scr);
      }
      var lb = label(labelText, { color: c.ink, size: 40, weight: 700, height: 0.42 });
      lb.position.set(p.x, p.y + 0.62, p.z); root.add(lb);
      var node = { p: p.clone(), mesh: m, hub: !!isHub, name: labelText };
      nodes.push(node);
      return node;
    }
    function addEdge(a, b, type, r) {
      var mat = std(type === 'backbone' ? c.phy : c.muted, { roughness: 0.5 });
      var m = cylBetween(a.p, b.p, r || 0.045, mat);
      m.userData.edge = edges.length;
      root.add(m);
      var e = { a: a, b: b, mesh: m, broken: false, type: type || 'link' };
      edges.push(e);
      return e;
    }
    function build() {
      clearGroup(root); nodes = []; edges = []; hub = null; anim = null; packetObj = null;
      var R = 2.2 + n * 0.22, i;
      failBtn.hidden = !(kind === 'star' || kind === 'hybrid');
      nIn.disabled = kind === 'hybrid';
      if (kind === 'mesh' || kind === 'star' || kind === 'ring') {
        for (i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2 - Math.PI / 2;
          addNode(new T.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R), String.fromCharCode(65 + i));
        }
        if (kind === 'mesh') { for (i = 0; i < n; i++) for (var j = i + 1; j < n; j++) addEdge(nodes[i], nodes[j]); }
        if (kind === 'star') { hub = addNode(new T.Vector3(0, 0, 0), 'Hub', true); for (i = 0; i < n; i++) addEdge(nodes[i], hub); }
        if (kind === 'ring') {
          for (i = 0; i < n; i++) addEdge(nodes[i], nodes[(i + 1) % n]);
          nodes.forEach(function (nd) { var rp = new T.Mesh(new T.BoxGeometry(0.2, 0.2, 0.2), std(c.dll)); rp.position.set(nd.p.x * 0.93, -0.3, nd.p.z * 0.93); root.add(rp); });
          var arrowCurve = []; for (i = 0; i <= 40; i++) { var t = i / 40 * Math.PI * 1.7 - Math.PI / 2; arrowCurve.push(new T.Vector3(Math.cos(t) * (R * 0.55), -0.15, Math.sin(t) * (R * 0.55))); }
          root.add(line(arrowCurve, c.dll, { dashed: true, opacity: 0.8 }));
          var al = label('one direction', { color: c.dll, size: 28, height: 0.22 }); al.position.set(0, 0, 0); root.add(al);
        }
      } else if (kind === 'bus') {
        var span = Math.max(6, n * 1.3), x0 = -span / 2;
        var taps = [];
        var t0 = { p: new T.Vector3(x0 - 0.4, 0, 0), term: true, name: 'end' }; nodes.push(t0);
        for (i = 0; i < n; i++) {
          var x = x0 + (i + 0.5) * (span / n);
          var tap = { p: new T.Vector3(x, 0, 0), tap: true, name: 'tap' }; nodes.push(tap); taps.push(tap);
          var tm = new T.Mesh(new T.SphereGeometry(0.1, 10, 8), std(c.ink2)); tm.position.copy(tap.p); root.add(tm);
          var dev = addNode(new T.Vector3(x, 0, i % 2 ? 1.6 : -1.6), String.fromCharCode(65 + i));
          addEdge(tap, dev, 'drop', 0.035);
        }
        var t1 = { p: new T.Vector3(-x0 + 0.4, 0, 0), term: true, name: 'end' }; nodes.push(t1);
        var chain = [t0].concat(taps).concat([t1]);
        for (i = 0; i < chain.length - 1; i++) addEdge(chain[i], chain[i + 1], 'backbone', 0.08);
        [t0, t1].forEach(function (t) { var tr = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 0.3, 14), std(c.ink2)); tr.rotation.z = Math.PI / 2; tr.position.copy(t.p); root.add(tr); });
        var tl1 = label('terminator', { color: c.muted, size: 26, height: 0.2 }); tl1.position.set(x0 - 0.4, 0.4, 0); root.add(tl1);
        var bl = label('backbone (bus)', { color: c.phy, size: 30, height: 0.24 }); bl.position.set(0, 0.35, 0); root.add(bl);
      } else if (kind === 'hybrid') {
        hub = addNode(new T.Vector3(0, 0, 0), 'Hub', true);
        var letter = 65;
        for (var b = 0; b < 3; b++) {
          var ang = b / 3 * Math.PI * 2 - Math.PI / 2, dir = new T.Vector3(Math.cos(ang), 0, Math.sin(ang)), perp = new T.Vector3(-dir.z, 0, dir.x);
          var prev = hub, start = { p: dir.clone().multiplyScalar(1.0), tap: true, bus: b, name: 'tap' }; nodes.push(start);
          addEdge(hub, start, 'link', 0.05);
          prev = start;
          for (var k = 0; k < 3; k++) {
            var tp = { p: dir.clone().multiplyScalar(1.8 + k * 1.2), tap: true, bus: b, name: 'tap' }; nodes.push(tp);
            var e = addEdge(prev, tp, 'backbone', 0.07); e.bus = b;
            var tmm = new T.Mesh(new T.SphereGeometry(0.09, 10, 8), std(c.ink2)); tmm.position.copy(tp.p); root.add(tmm);
            var dv = addNode(tp.p.clone().addScaledVector(perp, k % 2 ? 1.0 : -1.0), String.fromCharCode(letter++)); dv.bus = b;
            addEdge(tp, dv, 'drop', 0.035);
            prev = tp;
          }
        }
      }
      packetObj = new T.Mesh(new T.SphereGeometry(0.16, 16, 12), std(c.accent, { emissive: col(c.accent), emissiveIntensity: 0.8 }));
      packetObj.visible = false; root.add(packetObj);
      S.pickable(edges.map(function (e) { return e.mesh; }).concat(hub ? [hub.mesh] : []), function (hit) {
        if (!hit) return;
        if (hub && hit.object === hub.mesh) { hubFailed = !hubFailed; paint(); status(); return; }
        var ei = hit.object.userData.edge; if (ei == null) return;
        edges[ei].broken = !edges[ei].broken; paint(); status();
      });
      paint(); status();
    }
    function paint() {
      edges.forEach(function (e) {
        e.mesh.material.color = col(e.broken ? c.exam : (e.type === 'backbone' ? c.phy : c.muted));
        e.mesh.material.transparent = true; e.mesh.material.opacity = e.broken ? 0.45 : 1;
      });
      if (hub) { hub.mesh.material.color = col(hubFailed ? c.exam : c.accent); }
      failBtn.textContent = hubFailed ? 'Repair the hub' : 'Fail the hub';
    }
    var devices = function () { return nodes.filter(function (x) { return !x.hub && !x.tap && !x.term; }); };
    function adj(nd) {
      var out = [];
      edges.forEach(function (e) {
        if (e.broken) return;
        if (hubFailed && (e.a.hub || e.b.hub)) return;
        if (e.a === nd) out.push(e.b); else if (e.b === nd && kind !== 'ring') out.push(e.a);
      });
      return out;
    }
    function busDead() {
      return kind === 'bus' && edges.some(function (e) { return e.type === 'backbone' && e.broken; });
    }
    function hybridBusDead(b) { return edges.some(function (e) { return e.type === 'backbone' && e.broken && e.bus === b; }); }
    function path(src, dst) {
      if (busDead()) return null;
      if (kind === 'ring' && edges.some(function (e) { return e.broken; })) return null;
      if (kind === 'hybrid' && (hybridBusDead(src.bus) || hybridBusDead(dst.bus))) return null;
      var prev = new Map(), q = [src]; prev.set(src, null);
      while (q.length) {
        var u = q.shift(); if (u === dst) break;
        adj(u).forEach(function (v) { if (!prev.has(v)) { prev.set(v, u); q.push(v); } });
      }
      if (!prev.has(dst)) return null;
      var p = [], x = dst; while (x) { p.unshift(x); x = prev.get(x); }
      return p;
    }
    function status() {
      var d = devices(), pairs = 0, ok = 0;
      for (var i = 0; i < d.length; i++) for (var j = i + 1; j < d.length; j++) { pairs++; if (path(d[i], d[j]) || (kind === 'ring' && path(d[j], d[i]))) ok++; }
      var N = d.length, links = '', ports = '', cost = '';
      if (kind === 'mesh') { links = (N * (N - 1) / 2) + ' duplex (' + N * (N - 1) + ' simplex)'; ports = (N - 1) + ' per device'; cost = 'Highest cabling'; }
      if (kind === 'star') { links = N + ' (one per device)'; ports = '1 per device · hub needs ' + N; cost = 'Low; hub is a single point of failure'; }
      if (kind === 'bus') { links = '1 backbone + ' + N + ' drop lines'; ports = '1 tap per device'; cost = 'Least cable'; }
      if (kind === 'ring') { links = N + ' point-to-point links'; ports = '2 per device (repeater)'; cost = 'Low; one break stops a simple ring'; }
      if (kind === 'hybrid') { links = '3 hub links + 3 bus segments'; ports = 'hub: 3 · devices: 1 tap'; cost = 'Star backbone with three buses'; }
      readout.innerHTML = '';
      [['Devices', String(N)], ['Cables', links], ['I/O ports', ports], ['Device pairs that can talk', ok + ' of ' + pairs]].forEach(function (p) {
        readout.appendChild(U.el('div', { class: 'r' }, [U.el('span', { text: p[0] }), U.el('b', { text: p[1] })]));
      });
      var msg = {
        mesh: 'Every device has a dedicated link to every other device. Cut a cable: traffic re-routes through other devices, so the mesh keeps working (robustness, easy fault isolation).',
        star: 'All traffic passes through the hub. Cutting one cable isolates only that device, but if the hub fails the whole network is dead.',
        bus: 'One backbone cable carries everyone\'s signal. A break anywhere on the backbone stops all transmission (signal reflection), which is why fault isolation is hard.',
        ring: 'Each repeater regenerates the signal and passes it one way round the ring. One break disables a simple ring; a dual ring (second ring in the opposite direction) fixes this.',
        hybrid: 'A star backbone with three bus networks, the shape of most campus networks. Your college uses a star-based hybrid: floor switches feed block switches, which feed two core switches.'
      }[kind];
      var alert = '';
      if (hubFailed) alert = ' <b style="color:var(--exam)">Hub failed: devices cannot reach each other through it.</b>';
      else if (busDead() || (kind === 'ring' && edges.some(function (e) { return e.broken; }))) alert = ' <b style="color:var(--exam)">Network down.</b>';
      info.innerHTML = '<h4>' + { mesh: 'Mesh topology', star: 'Star topology', bus: 'Bus topology', ring: 'Ring topology', hybrid: 'Hybrid topology' }[kind] + '</h4><p>' + msg + alert + '</p>';
    }
    function send() {
      var d = devices(); if (d.length < 2) return;
      var src = d[0], dst = d[Math.floor(d.length / 2)];
      var p = path(src, dst);
      if (!p) { info.querySelector('p').innerHTML += ' <b style="color:var(--exam)">No route from ' + src.name + ' to ' + dst.name + '.</b>'; return; }
      var pts = p.map(function (x) { return x.p.clone().setY(x.p.y + 0.05); });
      var lens = [], total = 0;
      for (var i = 1; i < pts.length; i++) { var l = pts[i].distanceTo(pts[i - 1]); lens.push(l); total += l; }
      anim = { pts: pts, lens: lens, total: total, s: 0 };
      packetObj.visible = true;
    }
    S.onFrame(function (dt) {
      if (!anim) return;
      anim.s += dt * 4.2;
      if (anim.s >= anim.total) { packetObj.position.copy(anim.pts[anim.pts.length - 1]); anim = null; setTimeout(function () { if (packetObj) packetObj.visible = false; }, 500); return; }
      var s = anim.s, i = 0; while (i < anim.lens.length && s > anim.lens[i]) { s -= anim.lens[i]; i++; }
      packetObj.position.lerpVectors(anim.pts[i], anim.pts[i + 1], s / anim.lens[i]);
    });
    build();
    return { dispose: S.dispose };
  };

  /* =====================================================================
     3) FIBER — propagation modes and modal dispersion
     ===================================================================== */
  DCN.scenes.fiber = function (stage, opts, body) {
    var c = colors();
    var S = makeStage(stage, { orbit: { r: 13, theta: 0.42, phi: 1.2, target: new T.Vector3(0, 0, 0), minR: 5, maxR: 30 }, badge: 'Drag to look along the fibre', onTheme: function (nc) { c = nc; build(); } });
    var root = new T.Group(); S.scene.add(root);
    var mode = 'step', LEN = 11, rays = [], photons = [], clock = 0, PERIOD = 4.2;
    var row = ctrlRow(body);
    row.appendChild(U.seg([['step', 'Multimode · step-index'], ['graded', 'Multimode · graded-index'], ['single', 'Single-mode']], mode, function (v) { mode = v; build(); }));
    var readout = U.el('div', { class: 'readout' }); body.appendChild(readout);
    var info = infoPanel(body);
    function build() {
      clearGroup(root); rays = []; photons = []; clock = 0;
      var rCore = mode === 'single' ? 0.16 : 0.62, rClad = 1.15;
      var clad = new T.Mesh(new T.CylinderGeometry(rClad, rClad, LEN, 48, 1, true), new T.MeshStandardMaterial({ color: col(c.line2), transparent: true, opacity: c.dark ? 0.16 : 0.22, side: T.DoubleSide, depthWrite: false }));
      clad.rotation.z = Math.PI / 2; root.add(clad);
      var core = new T.Mesh(new T.CylinderGeometry(rCore, rCore, LEN, 40, 1, true), new T.MeshStandardMaterial({ color: col(c.tip), transparent: true, opacity: mode === 'graded' ? 0.3 : 0.22, side: T.DoubleSide, depthWrite: false, emissive: col(c.tip), emissiveIntensity: 0.15 }));
      core.rotation.z = Math.PI / 2; root.add(core);
      [-LEN / 2, LEN / 2].forEach(function (x) {
        var ring = new T.Mesh(new T.RingGeometry(rCore, rClad, 48), new T.MeshBasicMaterial({ color: col(c.line2), transparent: true, opacity: 0.5, side: T.DoubleSide }));
        ring.rotation.y = Math.PI / 2; ring.position.x = x; root.add(ring);
        var disk = new T.Mesh(new T.CircleGeometry(rCore, 40), new T.MeshBasicMaterial({ color: col(c.tip), transparent: true, opacity: 0.35, side: T.DoubleSide }));
        disk.rotation.y = Math.PI / 2; disk.position.x = x; root.add(disk);
      });
      var src = new T.Mesh(new T.ConeGeometry(0.42, 0.9, 24), std(mode === 'single' ? c.exam : c.tool, { emissive: col(mode === 'single' ? c.exam : c.tool), emissiveIntensity: 0.4 }));
      src.rotation.z = -Math.PI / 2; src.position.x = -LEN / 2 - 0.75; root.add(src);
      var sl = label(mode === 'single' ? 'laser (focused source)' : 'LED source', { color: c.ink, size: 30, height: 0.26 }); sl.position.set(-LEN / 2 - 0.8, 0.85, 0); root.add(sl);
      var det = new T.Mesh(new T.BoxGeometry(0.4, 1.0, 1.0), std(c.found)); det.position.x = LEN / 2 + 0.45; root.add(det);
      var dlb = label('detector', { color: c.ink, size: 30, height: 0.26 }); dlb.position.set(LEN / 2 + 0.5, 0.85, 0); root.add(dlb);
      var cl = label('core (denser, n₁)', { color: c.tip, size: 30, height: 0.26 }); cl.position.set(-1.6, rCore + 0.2, 0.6); root.add(cl);
      var cl2 = label('cladding (less dense, n₂ < n₁)', { color: c.muted, size: 30, height: 0.26 }); cl2.position.set(1.4, rClad + 0.3, 0); root.add(cl2);
      var specs;
      if (mode === 'step') specs = [0, 0.22, 0.4, 0.58].map(function (ang, i) { return { kind: 'zig', ang: ang, rot: i * 1.1 }; });
      else if (mode === 'graded') specs = [0, 0.3, 0.45, 0.58].map(function (amp, i) { return { kind: 'sin', amp: amp, rot: i * 1.1 }; });
      else specs = [{ kind: 'zig', ang: 0, rot: 0 }];
      specs.forEach(function (sp, i) {
        var pts = [], N = 260;
        for (var k = 0; k <= N; k++) {
          var x = -LEN / 2 + LEN * k / N, y;
          if (sp.kind === 'zig') {
            if (sp.ang === 0) y = 0;
            else { var half = (2 * rCore * 0.92) / Math.tan(sp.ang), u = ((x + LEN / 2) / half + 0.5) % 2; y = (u < 1 ? -1 + 2 * u : 3 - 2 * u) * rCore * 0.92; }
          } else { y = sp.amp * Math.sin((x + LEN / 2) * 1.35); }
          pts.push(new T.Vector3(x, y * Math.cos(sp.rot), y * Math.sin(sp.rot)));
        }
        var lenAcc = [0];
        for (var m = 1; m < pts.length; m++) lenAcc.push(lenAcc[m - 1] + pts[m].distanceTo(pts[m - 1]));
        var hue = [c.accent, c.app, c.dll, c.tl][i % 4];
        var ln = line(pts, hue, { opacity: 0.55 }); root.add(ln);
        var ph = new T.Mesh(new T.SphereGeometry(0.1, 12, 10), new T.MeshBasicMaterial({ color: col(hue) }));
        root.add(ph);
        rays.push({ pts: pts, acc: lenAcc, total: lenAcc[lenAcc.length - 1] }); photons.push(ph);
      });
      var shortest = Math.min.apply(null, rays.map(function (r) { return r.total; }));
      var longest = Math.max.apply(null, rays.map(function (r) { return r.total; }));
      var spread = mode === 'graded' ? 'small (paths equalised)' : mode === 'single' ? 'almost none' : Math.round((longest / shortest - 1) * 100) + '% longer path';
      readout.innerHTML = '';
      var rows = {
        step: [['Core / cladding', '50–100 / 125 µm'], ['Light source', 'LED'], ['Paths', 'zig-zag, sharp reflections'], ['Pulse spreading', spread]],
        graded: [['Core / cladding', '50 or 62.5 / 125 µm'], ['Light source', 'LED'], ['Paths', 'smooth curves'], ['Pulse spreading', spread]],
        single: [['Core / cladding', '7 / 125 µm'], ['Light source', 'laser'], ['Paths', 'one, almost straight'], ['Pulse spreading', spread]]
      }[mode];
      rows.forEach(function (p) { readout.appendChild(U.el('div', { class: 'r' }, [U.el('span', { text: p[0] }), U.el('b', { text: p[1] })])); });
      info.innerHTML = '<h4>' + { step: 'Multimode step-index', graded: 'Multimode graded-index', single: 'Single-mode' }[mode] + '</h4><p>' + {
        step: 'Core density is constant, so light travels in straight lines and changes direction abruptly at the cladding (the "step"). Steeper rays travel a longer zig-zag path and arrive later, so a sharp input pulse comes out smeared: distortion.',
        graded: 'Density falls gradually from the centre of the core to the edge. Rays bend smoothly, and the ones that wander outwards move faster in the less dense glass, so all of them arrive at nearly the same time. Distortion is much lower.',
        single: 'A very narrow step-index core and a highly focused laser limit the light to a single, nearly horizontal path. The critical angle is close to 90°, every beam arrives together, so delays are negligible: used for long-distance, high-rate links.'
      }[mode] + '</p><p class="small muted">Photons leave the source together every few seconds; watch how far apart they arrive.</p>';
    }
    S.onFrame(function (dt) {
      clock += dt; var t = clock % PERIOD;
      var speed = 4.2; // world units per second along each path
      rays.forEach(function (r, i) {
        var s = t * speed;
        if (mode === 'graded') s = t * speed * (r.total / rays[0].total);
        var ph = photons[i];
        if (s >= r.total) { ph.position.copy(r.pts[r.pts.length - 1]); ph.material.opacity = 1; return; }
        var k = 1; while (k < r.acc.length && r.acc[k] < s) k++;
        var a = r.pts[k - 1], b = r.pts[Math.min(k, r.pts.length - 1)], seg = (r.acc[k] - r.acc[k - 1]) || 1;
        ph.position.lerpVectors(a, b, (s - r.acc[k - 1]) / seg);
      });
    });
    build();
    return { dispose: S.dispose };
  };

  /* =====================================================================
     4) SIGNAL — sine phasor (mode=sine) and Fourier composite (mode=fourier)
     ===================================================================== */
  DCN.scenes.signal = function (stage, opts, body) {
    var c = colors(), fourier = opts.mode === 'fourier';
    var S = makeStage(stage, { orbit: { r: fourier ? 15 : 13, theta: fourier ? 0.7 : 0.55, phi: 1.2, target: new T.Vector3(0, 0, 0), minR: 5, maxR: 34 }, badge: fourier ? 'Front = time domain · side = frequency domain' : 'Drag to orbit', onTheme: function (nc) { c = nc; build(); } });
    var root = new T.Group(); S.scene.add(root);
    var A = 1.2, f = 1, ph = 0, N = 4, clock = 0, LENX = 10;
    var dyn = {};
    var row = ctrlRow(body);
    var readout = U.el('div', { class: 'readout' }); body.appendChild(readout);
    function slider(lab, min, max, step, val, cb, fmt) {
      var inp = U.el('input', { type: 'range', min: String(min), max: String(max), step: String(step), value: String(val), id: U.uid('s') });
      var out = U.el('b', { class: 'mono', text: fmt(val) });
      inp.addEventListener('input', function () { var v = +inp.value; out.textContent = fmt(v); cb(v); });
      row.appendChild(U.el('div', { class: 'ctrl' }, [U.el('label', { for: inp.id, text: lab }), inp, out]));
    }
    if (!fourier) {
      slider('Peak amplitude', 0.4, 2, 0.1, A, function (v) { A = v; rebuildWave(); }, function (v) { return v.toFixed(1) + ' V'; });
      slider('Frequency', 0.5, 3, 0.5, f, function (v) { f = v; rebuildWave(); }, function (v) { return v + ' Hz'; });
      slider('Phase', 0, 360, 15, 0, function (v) { ph = v * Math.PI / 180; rebuildWave(); }, function (v) { return v + '°'; });
    } else {
      slider('Harmonics', 1, 12, 1, N, function (v) { N = v; build(); }, function (v) { return String(v); });
      row.appendChild(U.seg([['3d', '3D'], ['front', 'Time domain'], ['side', 'Frequency domain']], '3d', function (v) {
        if (v === 'front') S.orbit.to(0, Math.PI / 2 - 0.02, 15); else if (v === 'side') S.orbit.to(Math.PI / 2, Math.PI / 2 - 0.02, 15); else S.orbit.to(0.7, 1.2, 15);
      }));
    }
    function axes(zPos) {
      root.add(line([new T.Vector3(-LENX / 2, 0, zPos), new T.Vector3(LENX / 2 + 0.4, 0, zPos)], c.muted, { opacity: 0.8 }));
      var tl = label('time →', { color: c.muted, size: 28, height: 0.24 }); tl.position.set(LENX / 2 + 0.6, -0.3, zPos); root.add(tl);
    }
    function build() {
      clearGroup(root); dyn = {};
      if (!fourier) {
        // back plane grid
        var grid = new T.GridHelper(LENX, 10, col(c.line2), col(c.line));
        grid.rotation.x = Math.PI / 2; grid.position.set(0, 0, -2.4); grid.material.transparent = true; grid.material.opacity = 0.5; root.add(grid);
        axes(-2.4); axes(0);
        var ring = []; for (var i = 0; i <= 64; i++) { var a = i / 64 * Math.PI * 2; ring.push(new T.Vector3(-LENX / 2, Math.sin(a) * 1, Math.cos(a) * 1)); }
        dyn.ring = line(ring, c.line2, { opacity: 0.9 }); root.add(dyn.ring);
        dyn.vec = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(-LENX / 2, 0, 0), 1, col(c.accent), 0.25, 0.16); root.add(dyn.vec);
        dyn.dot = new T.Mesh(new T.SphereGeometry(0.09, 12, 10), new T.MeshBasicMaterial({ color: col(c.accent) })); root.add(dyn.dot);
        dyn.proj = new T.Mesh(new T.SphereGeometry(0.09, 12, 10), new T.MeshBasicMaterial({ color: col(c.phy) })); root.add(dyn.proj);
        var l1 = label('rotating phasor', { color: c.accent, size: 28, height: 0.24 }); l1.position.set(-LENX / 2, 2.4, 0); root.add(l1);
        var l2 = label('sine wave = its shadow on the back wall', { color: c.phy, size: 28, height: 0.24 }); l2.position.set(1.5, 2.5, -2.4); root.add(l2);
        rebuildWave();
      } else {
        var f0 = 1, sumPts = [];
        for (var h = 0; h < N; h++) {
          var nH = 2 * h + 1, amp = 4 / (Math.PI * nH) * 1.4, z = -1 - h * 0.75, pts = [];
          for (var k = 0; k <= 300; k++) { var x = -LENX / 2 + LENX * k / 300; pts.push(new T.Vector3(x, amp * Math.sin(2 * Math.PI * f0 * nH * (x + LENX / 2) / LENX * 2), z)); }
          var hue = mix(c.tl, c.app, N > 1 ? h / (N - 1) : 0);
          root.add(line(pts, '#' + hue.getHexString(), { opacity: 0.85 }));
          var bar = new T.Mesh(new T.BoxGeometry(0.16, amp, 0.16), std('#' + hue.getHexString(), { emissive: hue, emissiveIntensity: 0.2 }));
          bar.position.set(LENX / 2 + 0.9, amp / 2, z); root.add(bar);
          var bl = label(nH + 'f', { color: c.ink2, size: 26, height: 0.22, mono: true }); bl.position.set(LENX / 2 + 0.9, amp + 0.25, z); root.add(bl);
        }
        for (var k2 = 0; k2 <= 600; k2++) {
          var x2 = -LENX / 2 + LENX * k2 / 600, s = 0;
          for (var h2 = 0; h2 < N; h2++) { var n2 = 2 * h2 + 1; s += 4 / (Math.PI * n2) * 1.4 * Math.sin(2 * Math.PI * n2 * (x2 + LENX / 2) / LENX * 2); }
          sumPts.push(new T.Vector3(x2, s, 1.2));
        }
        root.add(line(sumPts, c.accent, { opacity: 1 }));
        var tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(sumPts.filter(function (p, i) { return i % 3 === 0; })), 300, 0.035, 6, false), std(c.accent, { emissive: col(c.accent), emissiveIntensity: 0.3 }));
        root.add(tube);
        var target = []; for (var k4 = 0; k4 <= 400; k4++) { var x4 = -LENX / 2 + LENX * k4 / 400; target.push(new T.Vector3(x4, Math.sin(2 * Math.PI * (x4 + LENX / 2) / LENX * 2) >= 0 ? 1.4 : -1.4, 1.2)); }
        root.add(line(target, c.muted, { dashed: true, opacity: 0.7 }));
        axes(1.2);
        var sl2 = label('sum of ' + N + ' harmonic' + (N > 1 ? 's' : '') + ' → digital-looking square wave', { color: c.accent, size: 28, height: 0.26 }); sl2.position.set(-1, 2.3, 1.2); root.add(sl2);
        var fl = label('frequency-domain spikes', { color: c.ink2, size: 28, height: 0.24 }); fl.position.set(LENX / 2 + 0.9, 2.4, -1 - (N - 1) * 0.37); root.add(fl);
        root.position.z = (N - 1) * 0.3;
        var fmax = 2 * N - 1;
        readout.innerHTML = '';
        [['Harmonics used', '1, 3, 5 … ' + fmax + ' × f'], ['Highest frequency', fmax + 'f'], ['Bandwidth (fmax − fmin)', (fmax - 1) + 'f'], ['Shape', N >= 8 ? 'close to a square wave' : N >= 3 ? 'getting sharper' : 'rough approximation']].forEach(function (p) {
          readout.appendChild(U.el('div', { class: 'r' }, [U.el('span', { text: p[0] }), U.el('b', { text: p[1] })]));
        });
      }
    }
    function rebuildWave() {
      if (fourier) return;
      ['wave', 'helix', 'cos'].forEach(function (k) { if (dyn[k]) { root.remove(dyn[k]); dyn[k].geometry.dispose(); dyn[k].material.dispose(); } });
      var pw = [], hx = [];
      for (var k = 0; k <= 400; k++) {
        var x = -LENX / 2 + LENX * k / 400, tt = (x + LENX / 2) / LENX, ang = 2 * Math.PI * f * tt + ph;
        pw.push(new T.Vector3(x, A * Math.sin(ang), -2.4));
        hx.push(new T.Vector3(x, A * Math.sin(ang), A * Math.cos(ang)));
      }
      dyn.wave = line(pw, c.phy, {}); root.add(dyn.wave);
      dyn.helix = line(hx, c.accent, { opacity: 0.55 }); root.add(dyn.helix);
      var ring = []; for (var i = 0; i <= 64; i++) { var a = i / 64 * Math.PI * 2; ring.push(new T.Vector3(-LENX / 2, Math.sin(a) * A, Math.cos(a) * A)); }
      dyn.ring.geometry.dispose(); dyn.ring.geometry = new T.BufferGeometry().setFromPoints(ring);
      readout.innerHTML = '';
      [['Peak amplitude', A.toFixed(1) + ' V'], ['Frequency f', f + ' Hz'], ['Period T = 1/f', U.fmt(1 / f, 3) + ' s'], ['Phase', Math.round(ph * 180 / Math.PI) + '° = ' + U.fmt(ph / Math.PI, 2) + 'π rad']].forEach(function (p) {
        readout.appendChild(U.el('div', { class: 'r' }, [U.el('span', { text: p[0] }), U.el('b', { text: p[1] })]));
      });
    }
    S.onFrame(function (dt) {
      if (fourier || !dyn.vec) return;
      clock += dt * 0.25;
      var tt = clock % 1, ang = 2 * Math.PI * f * tt + ph, x = -LENX / 2 + LENX * tt;
      var dir = new T.Vector3(0, Math.sin(ang), Math.cos(ang));
      dyn.vec.position.set(x, 0, 0); dyn.vec.setDirection(dir); dyn.vec.setLength(A, 0.25, 0.16);
      dyn.dot.position.set(x, A * Math.sin(ang), A * Math.cos(ang));
      dyn.proj.position.set(x, A * Math.sin(ang), -2.4);
    });
    build();
    return { dispose: S.dispose };
  };

  /* =====================================================================
     5) MUX — frequency × time × code resource cube
     ===================================================================== */
  DCN.scenes.mux = function (stage, opts, body) {
    var c = colors();
    var S = makeStage(stage, { orbit: { r: 17, theta: 0.75, phi: 1.05, target: new T.Vector3(0, 1, 0), minR: 7, maxR: 40 }, badge: 'Drag to orbit · the bright plane is “now”', onTheme: function (nc) { c = nc; build(); } });
    var root = new T.Group(); S.scene.add(root);
    var dma = opts.labels === 'dma';
    var mode = opts.start || (dma ? 'fdm' : 'fdm');
    var FW = 8, TL = 12, CH = 3, users = ['A', 'B', 'C', 'D'], cursor, clock = 0, blocks = [];
    var row = ctrlRow(body);
    var choices = dma ? [['fdm', 'FDMA'], ['tdm', 'TDMA'], ['cdma', 'CDMA']] : [['fdm', 'FDM'], ['tdm', 'Synchronous TDM'], ['stat', 'Statistical TDM'], ['cdma', 'Code division']];
    row.appendChild(U.seg(choices, mode, function (v) { mode = v; build(); }));
    var info = infoPanel(body);
    function ucol(i) { return [c.phy, c.dll, c.net, c.app][i]; }
    function block(x0, x1, z0, z1, y0, y1, ci, op) {
      var m = new T.Mesh(new T.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), std(ucol(ci), { transparent: true, opacity: op || 0.85 }));
      m.position.set((x0 + x1) / 2 - FW / 2, (y0 + y1) / 2, (z0 + z1) / 2 - TL / 2);
      m.userData = { u: ci, z0: z0, z1: z1 };
      root.add(m); blocks.push(m);
      var e = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: col(c.ink), transparent: true, opacity: 0.18 }));
      e.position.copy(m.position); root.add(e);
      return m;
    }
    function build() {
      clearGroup(root); blocks = [];
      // axes
      var o = new T.Vector3(-FW / 2, 0, -TL / 2);
      root.add(new T.ArrowHelper(new T.Vector3(1, 0, 0), o, FW + 1, col(c.ink2), 0.3, 0.18));
      root.add(new T.ArrowHelper(new T.Vector3(0, 0, 1), o, TL + 1, col(c.ink2), 0.3, 0.18));
      root.add(new T.ArrowHelper(new T.Vector3(0, 1, 0), o, CH + 1.2, col(c.ink2), 0.3, 0.18));
      var lf = label('frequency', { color: c.ink2, size: 30, height: 0.3 }); lf.position.set(FW / 2 + 1.2, 0, -TL / 2); root.add(lf);
      var lt = label('time', { color: c.ink2, size: 30, height: 0.3 }); lt.position.set(-FW / 2, 0, TL / 2 + 1.3); root.add(lt);
      var lc = label('code', { color: c.ink2, size: 30, height: 0.3 }); lc.position.set(-FW / 2, CH + 1.6, -TL / 2); root.add(lc);
      var i, k;
      if (mode === 'fdm') {
        var bw = FW / 4, g = 0.22;
        for (i = 0; i < 4; i++) block(i * bw + g / 2, (i + 1) * bw - g / 2, 0, TL, 0, 0.9, i);
        var gl = label('guard bands', { color: c.muted, size: 26, height: 0.24 }); gl.position.set(-FW / 4, 1.5, TL / 2 + 0.2); root.add(gl);
      } else if (mode === 'tdm') {
        var slot = 0.85, fr = 4 * slot + 0.15, z = 0;
        for (k = 0; z + fr <= TL + 0.01; k++) {
          var sb = new T.Mesh(new T.BoxGeometry(FW, 0.9, 0.12), std(c.ink2, { transparent: true, opacity: 0.6 }));
          sb.position.set(0, 0.45, z + 0.06 - TL / 2); root.add(sb);
          for (i = 0; i < 4; i++) block(0, FW, z + 0.15 + i * slot, z + 0.15 + (i + 1) * slot - 0.05, 0, 0.9, i);
          z += fr;
        }
        var fl = label('frame = one slot per input + framing bit', { color: c.muted, size: 26, height: 0.24 }); fl.position.set(0, 1.6, -TL / 2 + 1.8); root.add(fl);
      } else if (mode === 'stat') {
        var seq = [0, 2, 0, 3, 1, 0, 0, 2, 3, 0, 1, 2, 0], zz = 0;
        seq.forEach(function (u) { if (zz + 0.85 > TL) return; block(0.6, FW, zz, zz + 0.8, 0, 0.9, u); var ad = new T.Mesh(new T.BoxGeometry(0.5, 0.9, 0.8), std(c.ink2)); ad.position.set(0.3 - FW / 2, 0.45, zz + 0.4 - TL / 2); root.add(ad); zz += 0.9; });
        var al = label('each slot carries an address (dark block)', { color: c.muted, size: 26, height: 0.24 }); al.position.set(0, 1.6, -TL / 2 + 1.5); root.add(al);
      } else if (mode === 'cdma') {
        for (i = 0; i < 4; i++) block(0, FW, 0, TL, i * 0.78, i * 0.78 + 0.62, i, 0.55);
        var cl = label('everyone sends at once, on the whole band', { color: c.muted, size: 26, height: 0.24 }); cl.position.set(0, 3.7, 0); root.add(cl);
      }
      for (i = 0; i < 4; i++) { var ul = label('user ' + users[i], { color: ucol(i), size: 30, weight: 700, height: 0.28 }); ul.position.set(-FW / 2 - 1.3, 0.4 + i * 0.5, TL / 2 - 0.5); root.add(ul); }
      cursor = new T.Mesh(new T.PlaneGeometry(FW + 0.6, CH + 0.6), new T.MeshBasicMaterial({ color: col(c.accent), transparent: true, opacity: 0.14, side: T.DoubleSide, depthWrite: false }));
      cursor.position.set(0, (CH + 0.6) / 2 - 0.2, -TL / 2); root.add(cursor);
      var txt = {
        fdm: ['Frequency-division', 'The link\'s bandwidth is cut into bands, one per user, separated by guard bands. At any instant every user is transmitting, each on its own carrier frequency. Analog technique; used by radio, TV and 1G cellular.'],
        tdm: ['Synchronous time-division', 'Time is cut into frames; each frame has one slot per input line, even if that line is idle. At any instant one user owns the whole bandwidth. Frame duration = duration of one input unit; output rate = n × input rate.'],
        stat: ['Statistical time-division', 'Slots go only to lines that have data, so no slot is wasted. Because the order is no longer fixed, every slot must carry the destination address. No framing bits are needed.'],
        cdma: ['Code-division', 'All stations transmit at the same time over the entire bandwidth. They are separated by orthogonal chip codes: the receiver multiplies the sum on the channel by the sender\'s code to pull out that station\'s data.']
      }[mode];
      info.innerHTML = '<h4>' + txt[0] + (dma && mode !== 'cdma' ? ' multiple access' : '') + '</h4><p>' + txt[1] + '</p><p class="small muted">Read the bright plane as “now”: the blocks it cuts through are the users transmitting at that instant.</p>';
    }
    S.onFrame(function (dt) {
      if (!cursor) return;
      clock += dt * 1.6; var z = (clock % TL);
      cursor.position.z = z - TL / 2;
      blocks.forEach(function (b) { var on = z >= b.userData.z0 && z <= b.userData.z1; b.material.emissive.set(on ? ucol(b.userData.u) : 0x000000); b.material.emissiveIntensity = on ? 0.45 : 0; });
    });
    build();
    return { dispose: S.dispose };
  };

  /* =====================================================================
     6) DNS — iterative vs recursive resolution in the name-server tree
     ===================================================================== */
  DCN.scenes.dns = function (stage, opts, body) {
    var c = colors();
    var S = makeStage(stage, { orbit: { r: 15, theta: 0.35, phi: 1.12, target: new T.Vector3(0, 0.8, 0), minR: 7, maxR: 34 }, badge: 'Drag to orbit', onTheme: function (nc) { c = nc; build(); } });
    var root = new T.Group(); S.scene.add(root);
    var mode = 'iter', step = 0, t = 0, playing = !S.reduced, msg = null, N = {}, arcLines = [];
    var row = ctrlRow(body);
    row.appendChild(U.seg([['iter', 'Iterated query'], ['rec', 'Recursive query']], mode, function (v) { mode = v; step = 0; t = 0; build(); }));
    var pb = U.el('button', { type: 'button', class: 'btn sm', text: playing ? 'Pause' : 'Play' });
    pb.addEventListener('click', function () { playing = !playing; pb.textContent = playing ? 'Pause' : 'Play'; });
    row.appendChild(pb);
    row.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Next step', onclick: function () { playing = false; pb.textContent = 'Play'; step = (step + 1) % 8; t = 0; showStep(); } }));
    var info = infoPanel(body);
    var P = {
      root: [0, 4.2, 0, 'Root DNS server', 'net'],
      com: [-3.6, 2.3, -0.4, '.com TLD', 'found'], org: [-1.4, 2.3, 1.4, '.org TLD', 'found'], edu: [1.3, 2.3, -1.2, '.edu TLD server', 'net'], inn: [3.6, 2.3, 0.6, '.in TLD', 'found'],
      amazon: [-4.3, 0.5, -1.4, 'amazon.com', 'found'], yahoo: [-2.9, 0.5, 0.9, 'yahoo.com', 'found'], umass: [0.6, 0.5, -2.4, 'dns.cs.umass.edu\n(authoritative)', 'net'], poly: [2.5, 0.5, -0.4, 'poly.edu', 'found'],
      local: [-0.6, -1.6, 2.8, 'Local DNS server\ndns.poly.edu', 'app'], host: [-3.4, -2.5, 3.4, 'Requesting host\ncis.poly.edu', 'tl']
    };
    var TREE = [['root', 'com'], ['root', 'org'], ['root', 'edu'], ['root', 'inn'], ['com', 'amazon'], ['com', 'yahoo'], ['edu', 'umass'], ['edu', 'poly']];
    var FLOWS = {
      iter: [['host', 'local', 'Host asks its local DNS server for gaia.cs.umass.edu (recursive request to the local server).'], ['local', 'root', 'Local server asks a root server.'], ['root', 'local', 'Root replies: "I don\'t know, but ask the .edu TLD server" (a referral).'], ['local', 'edu', 'Local server asks the .edu TLD server.'], ['edu', 'local', 'TLD replies with the address of the authoritative server dns.cs.umass.edu.'], ['local', 'umass', 'Local server asks the authoritative server.'], ['umass', 'local', 'Authoritative server returns the IP address of gaia.cs.umass.edu.'], ['local', 'host', 'Local server caches the answer and returns it to the host.']],
      rec: [['host', 'local', 'Host asks its local DNS server.'], ['local', 'root', 'Local server forwards the query to a root server.'], ['root', 'edu', 'Root itself forwards it to the .edu TLD server.'], ['edu', 'umass', 'TLD forwards it to the authoritative server.'], ['umass', 'edu', 'The answer comes back to the TLD server…'], ['edu', 'root', '…then to the root server…'], ['root', 'local', '…then to the local DNS server, which caches it.'], ['local', 'host', 'Local server returns the IP address to the host. The burden of resolution was on the contacted servers.']]
    };
    function v3(k) { return new T.Vector3(P[k][0], P[k][1], P[k][2]); }
    function build() {
      clearGroup(root); N = {}; arcLines = [];
      Object.keys(P).forEach(function (k) {
        var p = P[k], big = k === 'root' || k === 'local' || k === 'host';
        var m = new T.Mesh(k === 'host' ? new T.BoxGeometry(0.7, 0.45, 0.5) : new T.CylinderGeometry(big ? 0.42 : 0.32, big ? 0.42 : 0.32, big ? 0.75 : 0.55, 20), std(c[p[4]]));
        m.position.copy(v3(k)); root.add(m); N[k] = m;
        var lb = label(p[3], { color: c.ink, size: 28, height: p[3].indexOf('\n') > 0 ? 0.48 : 0.26, weight: 600 });
        lb.position.set(p[0], p[1] + 0.75, p[2]); root.add(lb);
      });
      TREE.forEach(function (e) { root.add(line([v3(e[0]), v3(e[1])], c.line2, { opacity: 0.9 })); });
      var tl = label('DNS hierarchy: root → top-level domains → authoritative servers', { color: c.muted, size: 26, height: 0.24 }); tl.position.set(0, 5.4, 0); root.add(tl);
      FLOWS[mode].forEach(function (f, i) {
        var a = v3(f[0]), b = v3(f[1]), mid = a.clone().add(b).multiplyScalar(0.5); mid.y += 0.9 + (i % 2) * 0.3;
        var curve = new T.QuadraticBezierCurve3(a, mid, b);
        var ln = line(curve.getPoints(40), c.muted, { dashed: true, opacity: 0.25 }); root.add(ln);
        var nl = label(String(i + 1), { color: '#FFFFFF', bg: c.accent, size: 30, height: 0.3, weight: 700, mono: true });
        nl.position.copy(curve.getPoint(0.5)); nl.visible = false; root.add(nl);
        arcLines.push({ curve: curve, line: ln, num: nl });
      });
      msg = new T.Mesh(new T.SphereGeometry(0.17, 16, 12), std(c.accent, { emissive: col(c.accent), emissiveIntensity: 0.9 }));
      root.add(msg);
      showStep();
    }
    function showStep() {
      arcLines.forEach(function (a, i) { a.line.material.opacity = i < step ? 0.65 : i === step ? 0.95 : 0.18; a.line.material.color = col(i <= step ? c.accent : c.muted); a.num.visible = i <= step; });
      var f = FLOWS[mode][step];
      info.innerHTML = '<h4>Step ' + (step + 1) + ' of 8 · ' + (mode === 'iter' ? 'iterated' : 'recursive') + ' query</h4><p>' + f[2] + '</p><p class="small muted">' + (mode === 'iter' ? 'In an iterated query, a contacted server replies with the name of the next server to ask; the local server does the legwork.' : 'In a recursive query, each contacted server asks the next one on your behalf, which puts heavy load on upper-level servers.') + '</p>';
    }
    S.onFrame(function (dt) {
      if (!arcLines.length) return;
      if (playing) { t += dt / 1.3; if (t >= 1) { t = 0; step = (step + 1) % 8; showStep(); } }
      msg.position.copy(arcLines[step].curve.getPoint(U.clamp(t, 0, 1)));
    });
    build();
    return { dispose: S.dispose };
  };

  /* =====================================================================
     7) JOURNEY — one packet crossing networks: IPv6 tunnelling, NAT, fragmentation
     ===================================================================== */
  DCN.scenes.journey = function (stage, opts, body) {
    var c = colors();
    var mode = opts.mode || 'tunnel', step = 0, tt = 0, playing = !U.reducedMotion();
    var cam = null, narrow = (stage.clientWidth || 600) / (stage.clientHeight || 340) < 1.5, LS = narrow ? 1.45 : 1;
    function fit(w, h) { if (!cam || !w || !h) return; cam.fov = 2 * Math.atan((narrow ? 0.62 : 0.7) / (w / h)) * 180 / Math.PI; cam.updateProjectionMatrix(); }
    var S = makeStage(stage, { orbit: { r: narrow ? 15 : 14.2, theta: narrow ? 0.5 : 0.0, phi: narrow ? 0.9 : 0.95, target: new T.Vector3(0, 0.5, 0.2), minR: 7, maxR: 36 }, badge: 'Drag to orbit', onTheme: function (nc) { c = nc; build(); }, onResize: function (w, h) { fit(w, h); } });
    cam = S.camera; fit(stage.clientWidth, stage.clientHeight);
    var root = new T.Group(), pkG = new T.Group(); S.scene.add(root); S.scene.add(pkG);
    var row = ctrlRow(body);
    if (!opts.lock) row.appendChild(U.seg([['tunnel', 'IPv6 tunnelling'], ['nat', 'NAT'], ['frag', 'Fragmentation'], ['bgp', 'BGP'], ['email', 'E-mail']], mode, function (v) { mode = v; build(); }));
    var pb = U.el('button', { type: 'button', class: 'btn sm', text: playing ? 'Pause' : 'Play' });
    pb.addEventListener('click', function () { playing = !playing; pb.textContent = playing ? 'Pause' : 'Play'; });
    row.appendChild(pb);
    row.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Next step', onclick: function () { playing = false; pb.textContent = 'Play'; go(step + 1); } }));
    row.appendChild(U.el('button', { type: 'button', class: 'btn ghost sm', text: 'Restart', onclick: function () { go(0); } }));
    var info = infoPanel(body);
    var NAT = [['172.18.3.1', '1400', '25.8.3.2', '80', 'TCP'], ['172.18.3.2', '1401', '25.8.3.2', '80', 'TCP']];
    var SC = {
      tunnel: {
        title: 'IPv6 datagram crossing an IPv4 network by tunnelling',
        nodes: [['A', -7.5, 0, 'host', 'A (IPv6)', 'net'], ['B', -4.5, 0, 'dual', 'B (IPv6 + IPv4)', 'net'], ['C', -1.5, 0, 'router', 'C (IPv4)', 'tool'], ['D', 1.5, 0, 'router', 'D (IPv4)', 'tool'], ['E', 4.5, 0, 'dual', 'E (IPv6 + IPv4)', 'net'], ['F', 7.5, 0, 'host', 'F (IPv6)', 'net']],
        zones: [[-8.6, -4.5, 'net', 'IPv6'], [-4.5, 4.5, 'tool', 'IPv4 network: the tunnel'], [4.5, 8.6, 'net', 'IPv6']],
        links: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F']],
        tube: ['B', 'E'],
        steps: [
          { a: 'A', b: 'B', pk: [{ col: 'net', text: 'IPv6 datagram\nsrc A → dst F · flow X' }], say: 'A sends an ordinary IPv6 datagram (source A, destination F) to its IPv6 neighbour B.' },
          { a: 'B', b: 'C', pk: [{ col: 'net', text: 'IPv4 header: src B → dst E\n[ IPv6: src A → dst F ]', shell: 'tool' }], say: 'B is at the edge of the IPv4 network. It places the <b>entire IPv6 datagram in the data (payload) field of an IPv4 datagram</b> addressed from B to E, the router at the other end of the tunnel.' },
          { a: 'C', b: 'D', pk: [{ col: 'net', text: 'IPv4 header: src B → dst E\n[ IPv6: src A → dst F ]', shell: 'tool' }], say: 'C and D are IPv4-only routers. They forward an ordinary IPv4 datagram and are unaware that it carries an IPv6 datagram.' },
          { a: 'D', b: 'E', pk: [{ col: 'net', text: 'IPv4 header: src B → dst E\n[ IPv6: src A → dst F ]', shell: 'tool' }], say: 'The IPv4 datagram reaches E, the far end of the tunnel.' },
          { a: 'E', b: 'F', pk: [{ col: 'net', text: 'IPv6 datagram\nsrc A → dst F · flow X' }], say: 'E sees that the IPv4 datagram carries an IPv6 datagram, <b>extracts it</b> and routes it on to F exactly as if it had come from an IPv6 neighbour. Logically, B and E look directly connected.' }
        ]
      },
      nat: {
        title: 'NAT: private hosts share one global address',
        nodes: [['H1', -6.8, -1.5, 'host', 'Host 172.18.3.1', 'dll'], ['H2', -6.8, 1.5, 'host', 'Host 172.18.3.2', 'dll'], ['R', -2.0, 0, 'router', 'NAT router\nglobal 200.24.5.8', 'accent'], ['SV', 6.0, 0, 'server', 'Server 25.8.3.2\nHTTP, port 80', 'app']],
        zones: [[-8.6, -2.0, 'dll', 'Private network 172.18.0.0/16'], [-2.0, 7.8, 'net', 'Global Internet']],
        links: [['H1', 'R'], ['H2', 'R'], ['R', 'SV']],
        steps: [
          { a: 'H1', b: 'R', pk: [{ col: 'dll', text: 'src 172.18.3.1 : 1400\ndst 25.8.3.2 : 80' }], say: 'Host 172.18.3.1 sends a TCP request to the web server. Its source address is private and cannot be used on the Internet.', tab: 0 },
          { a: 'R', b: 'SV', pk: [{ col: 'net', text: 'src 200.24.5.8 : 1400\ndst 25.8.3.2 : 80' }], say: 'The NAT router <b>replaces the source address</b> with its global address 200.24.5.8 and records the connection (private address and port, external address and port, protocol) in its translation table.', tab: 1 },
          { a: 'SV', b: 'R', pk: [{ col: 'net', text: 'src 25.8.3.2 : 80\ndst 200.24.5.8 : 1400' }], say: 'The server answers the only address it has seen: the NAT router. The private network is invisible to the rest of the Internet.', tab: 1 },
          { a: 'R', b: 'H1', pk: [{ col: 'dll', text: 'src 25.8.3.2 : 80\ndst 172.18.3.1 : 1400' }], say: 'The router looks up external address 25.8.3.2, port 80 and private port 1400 in its table, finds 172.18.3.1 and <b>replaces the destination address</b>.', tab: 1 },
          { a: 'H2', b: 'R', pk: [{ col: 'dll', text: 'src 172.18.3.2 : 1401\ndst 25.8.3.2 : 80' }], say: 'A second host contacts the <b>same server</b>. With only two columns (private address, external address) the router could not tell the replies apart.', tab: 1 },
          { a: 'R', b: 'SV', pk: [{ col: 'net', text: 'src 200.24.5.8 : 1401\ndst 25.8.3.2 : 80' }], say: 'Using port numbers and the protocol in a five-column table removes the ambiguity: this connection is the one with private port 1401.', tab: 2 },
          { a: 'SV', b: 'R', pk: [{ col: 'net', text: 'src 25.8.3.2 : 80\ndst 200.24.5.8 : 1401' }], say: 'Both replies arrive at 200.24.5.8 from 25.8.3.2:80; only the port tells them apart.', tab: 2 },
          { a: 'R', b: 'H2', pk: [{ col: 'dll', text: 'src 25.8.3.2 : 80\ndst 172.18.3.2 : 1401' }], say: 'The router translates the destination to 172.18.3.2. Note that the communication had to be <b>started from inside</b> the private network.', tab: 2 }
        ]
      },
      frag: {
        title: 'IPv4 fragmentation at a router, reassembly at the destination',
        nodes: [['S', -7.4, 0, 'host', 'Source host', 'net'], ['R', -1.2, 0, 'router', 'Router', 'net'], ['D', 6.6, 0, 'host', 'Destination host', 'net']],
        zones: [[-8.8, -1.2, 'net', 'Link MTU ≥ 4,000 bytes'], [-1.2, 8, 'tool', 'Link MTU = 1,500 bytes']],
        links: [['S', 'R', 0.11], ['R', 'D', 0.045]],
        steps: [
          { a: 'S', b: 'R', pk: [{ col: 'net', w: 2.7, text: 'Datagram: 4,000 bytes (20 header + 3,980 data)\nID 777 · offset 0 · M 0' }], say: 'A 4,000-byte datagram (20-byte header + 3,980 data bytes) arrives at a router whose outgoing link has an MTU of 1,500 bytes. It does not fit in one frame.' },
          { a: 'R', b: 'D', pk: [{ col: 'net', w: 1.05, text: 'Fragment 1 · 1,500 B\nID 777 · offset 0 · M 1', d: 0 }, { col: 'net', w: 1.05, text: 'Fragment 2 · 1,500 B\nID 777 · offset 185 · M 1', d: 0.9 }, { col: 'net', w: 0.75, text: 'Fragment 3 · 1,040 B\nID 777 · offset 370 · M 0', d: 1.8 }], say: 'The router splits the 3,980 data bytes into 1,480 + 1,480 + 1,020. Each fragment copies the header, keeps <b>identification 777</b>, and carries an <b>offset in 8-byte units</b> (0, 1480/8 = 185, 2960/8 = 370). M = 1 on all but the last fragment.' },
          { a: 'D', b: 'D', pk: [{ col: 'net', w: 2.7, text: 'Reassembled datagram: 4,000 bytes\nID 777 · delivered to TCP/UDP' }], say: 'Only the <b>destination</b> reassembles: it groups fragments by identification, orders them by offset and knows it has the last one when M = 0. If any fragment is lost, the whole datagram is discarded. (In IPv6, routers never fragment; only the source does.)' }
        ]
      },
      email: {
        title: 'E-mail: two pushes with SMTP, one pull with POP3 or IMAP',
        nodes: [['A', -7.4, 0.6, 'host', 'Alice (user agent)', 'tl'], ['MA', -3.0, 0.3, 'server', 'Alice\'s mail server\nMTA client · queue', 'app'], ['MB', 3.0, 0.3, 'server', 'Bob\'s mail server\nMTA server · mailbox', 'app'], ['B', 7.4, 0.6, 'host', 'Bob (user agent)', 'tl']],
        zones: [[-8.8, -1.6, 'tl', 'Alice\'s LAN / WAN'], [-1.6, 1.6, 'net', 'Internet'], [1.6, 8.8, 'tl', 'Bob\'s LAN / WAN']],
        links: [['A', 'MA'], ['MA', 'MB', 0.1], ['MB', 'B']],
        steps: [
          { a: 'A', b: 'MA', pk: [{ col: 'tl', text: 'SMTP (push)\nfrom alice@crepes.fr' }], say: 'Alice composes the message in her <b>user agent</b> (UA). The UA <b>pushes</b> it to the <b>MTA client</b> on her mail server: the first SMTP client-server pair.' },
          { a: 'MA', b: 'MA', pk: [{ col: 'app', w: 1.3, text: 'queued (spool)' }], say: 'The message waits in the <b>queue (spool)</b> of outgoing mail on Alice\'s mail server.' },
          { a: 'MA', b: 'MB', pk: [{ col: 'app', text: 'SMTP over TCP port 25\nMAIL FROM · RCPT TO · DATA' }], say: 'The MTA client opens a TCP connection to Bob\'s mail server on <b>port 25</b> and <b>pushes</b> the message: the second SMTP pair (MTA client to MTA server). Commands are ASCII text; replies are status codes such as 220, 250 and 354.' },
          { a: 'MB', b: 'MB', pk: [{ col: 'app', w: 1.3, text: 'stored in Bob\'s mailbox' }], say: 'The MTA server stores the message in <b>Bob\'s mailbox</b>, part of the server\'s disk that only Bob may access. Bob does not run an MTA server himself, because he would have to stay online all the time.' },
          { a: 'MB', b: 'B', pk: [{ col: 'tl', text: 'POP3 (port 110) or IMAP4\nMAA pull' }], say: 'When Bob is ready, his <b>message access agent</b> (MAA) client <b>pulls</b> the message with POP3 or IMAP4 (or HTTP for web mail). SMTP is a push protocol; POP3 and IMAP are pull protocols.' }
        ]
      },
      bgp: {
        title: 'BGP: how the Internet learns to reach prefix x',
        nodes: [['x', -8.1, 1.7, 'host', 'subnet x', 'tl'], ['3b', -7.4, -1.2, 'router', '3b', 'tl'], ['3c', -6.4, 1.2, 'router', '3c', 'tl'], ['3a', -4.3, 0, 'router', '3a (gateway)', 'tl'],
          ['1c', -1.7, 0, 'router', '1c (gateway)', 'net'], ['1a', 0, -1.5, 'router', '1a', 'net'], ['1d', 0, 1.5, 'router', '1d', 'net'], ['1b', 1.7, 0, 'router', '1b (gateway)', 'net'],
          ['2a', 4.3, 0, 'router', '2a (gateway)', 'app'], ['2b', 7.2, -1.3, 'router', '2b', 'app'], ['2c', 7.0, 1.4, 'router', '2c', 'app']],
        zones: [[-9.2, -3.3, 'tl', 'AS3'], [-2.9, 2.9, 'net', 'AS1'], [3.3, 8.6, 'app', 'AS2']],
        links: [['x', '3c'], ['3b', '3c'], ['3b', '3a'], ['3c', '3a'], ['3a', '1c', 0.1], ['1c', '1a'], ['1a', '1b'], ['1c', '1d'], ['1d', '1b'], ['1b', '2a', 0.1], ['2a', '2b'], ['2a', '2c'], ['2b', '2c']],
        steps: [
          { pk: [{ path: ['3a', '1c'], col: 'tl', text: 'eBGP UPDATE\nprefix x · AS-PATH AS3 · NEXT-HOP 3a' }], say: '<b>eBGP session</b> between gateway routers 3a and 1c (a semi-permanent TCP connection, port 179). AS3 advertises prefix x and so <b>promises</b> to forward datagrams towards it.' },
          { pk: [{ path: ['1c', '1a'], col: 'net', text: 'iBGP: x via AS3' }, { path: ['1c', '1d'], col: 'net', text: 'iBGP: x via AS3' }, { path: ['1c', '1a', '1b'], col: 'net', text: 'iBGP: x via AS3', d: 0.4 }], say: '<b>iBGP</b>: 1c propagates the new reachability information to <b>all routers inside AS1</b>. Each router that learns a new prefix creates an entry for it in its forwarding table.' },
          { pk: [{ path: ['1b', '2a'], col: 'tl', text: 'eBGP UPDATE\nprefix x · AS-PATH AS1 AS3 · NEXT-HOP 1b' }], say: 'Gateway 1b re-advertises the route to AS2 over the 1b–2a eBGP session. The <b>AS-PATH grows</b> to AS1 AS3; a router that finds its own AS in an AS-PATH drops the route, which prevents loops.' },
          { pk: [{ path: ['1d', '1c', '3a', '3c', 'x'], col: 'accent', w: 0.75, text: 'IP datagram for x' }], say: 'Forwarding: router 1d knows (from BGP) that x is reached through gateway 1c, and (from intra-AS routing, OSPF or RIP) which of its interfaces I is on the least-cost path to 1c. It installs the entry (x, I) and datagrams follow that path.' }
        ]
      }
    };
    var NP = {};
    function npos(id) { var n = NP[id]; return new T.Vector3(n[1], 0, n[2]); }
    function nodeMesh(n) {
      var g = new T.Group(), colr = c[n[5]] || c.net, m;
      if (n[3] === 'host') { m = new T.Mesh(new T.BoxGeometry(0.95, 0.62, 0.72), std(colr)); m.position.y = 0.31; g.add(m); var scr = new T.Mesh(new T.BoxGeometry(0.72, 0.05, 0.5), std(c.surface)); scr.position.y = 0.64; g.add(scr); }
      else if (n[3] === 'server') { m = new T.Mesh(new T.BoxGeometry(0.8, 1.3, 0.8), std(colr)); m.position.y = 0.65; g.add(m); [0.35, 0.65, 0.95].forEach(function (y) { var s2 = new T.Mesh(new T.BoxGeometry(0.82, 0.04, 0.82), std(c.surface)); s2.position.y = y; g.add(s2); }); }
      else {
        m = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.56, 28), std(colr)); m.position.y = 0.28; g.add(m);
        var band = new T.Mesh(new T.CylinderGeometry(0.515, 0.515, 0.14, 28), std(n[3] === 'dual' ? c.tool : c.surface)); band.position.y = 0.33; g.add(band);
        [0, Math.PI / 2].forEach(function (r) { var ar = new T.Mesh(new T.BoxGeometry(0.62, 0.05, 0.09), std(c.surface)); ar.position.y = 0.58; ar.rotation.y = r + Math.PI / 4; g.add(ar); });
      }
      return g;
    }
    function packet(p) {
      var g = new T.Group(), w = p.w || 1.15;
      var box = new T.Mesh(new T.BoxGeometry(w, 0.4, 0.55), std(c[p.col] || c.net, { emissive: col(c[p.col] || c.net), emissiveIntensity: 0.25 }));
      g.add(box);
      var hd = new T.Mesh(new T.BoxGeometry(Math.min(0.26, w * 0.22), 0.42, 0.57), std(c.surface)); hd.position.x = -w / 2 + Math.min(0.13, w * 0.11); g.add(hd);
      if (p.shell) {
        var sh = new T.Mesh(new T.BoxGeometry(w + 0.6, 0.78, 0.92), new T.MeshStandardMaterial({ color: col(c[p.shell]), transparent: true, opacity: 0.32, roughness: 0.4, depthWrite: false }));
        g.add(sh);
        var sh2 = new T.Mesh(new T.BoxGeometry(0.3, 0.8, 0.94), std(c[p.shell])); sh2.position.x = -(w + 0.6) / 2 + 0.15; g.add(sh2);
      }
      var lb = label(p.text, { color: c.ink, bg: c.surface, border: c[p.shell || p.col] || c.net, size: 30, height: 0.62 * LS, weight: 600, mono: true });
      lb.position.y = (p.shell ? 1.05 : 0.86) + (LS - 1) * 0.5; g.add(lb);
      g.userData = { d: p.d || 0 };
      return g;
    }
    function build() {
      clearGroup(root); clearGroup(pkG);
      var sc = SC[mode]; NP = {};
      sc.nodes.forEach(function (n) { NP[n[0]] = n; });
      sc.zones.forEach(function (z) {
        var plate = new T.Mesh(new T.BoxGeometry(z[1] - z[0] - 0.08, 0.08, 5.4), new T.MeshBasicMaterial({ color: mix(c[z[2]], c.surface, c.dark ? 0.78 : 0.86) }));
        plate.position.set((z[0] + z[1]) / 2, -0.06, 0); root.add(plate);
        var zl = label(z[3], { color: c[z[2]] || c.ink2, size: 32, height: 0.38 * LS, weight: 700 });
        zl.position.set((z[0] + z[1]) / 2, 0.22, -2.35); root.add(zl);
      });
      sc.links.forEach(function (l) {
        var a = npos(l[0]), b = npos(l[1]); a.y = b.y = 0.12;
        root.add(cylBetween(a, b, l[2] || 0.07, std(c.ink2)));
      });
      if (sc.tube) {
        var ta = npos(sc.tube[0]), tb = npos(sc.tube[1]); ta.y = tb.y = 0.95;
        var tube = cylBetween(ta, tb, 0.62, new T.MeshStandardMaterial({ color: col(c.tool), transparent: true, opacity: c.dark ? 0.16 : 0.12, depthWrite: false, side: T.DoubleSide }));
        tube.geometry.dispose(); tube.geometry = new T.CylinderGeometry(0.62, 0.62, ta.distanceTo(tb), 28, 1, true);
        root.add(tube);
      }
      sc.nodes.forEach(function (n) {
        var g = nodeMesh(n); g.position.copy(npos(n[0])); root.add(g);
        var nl = label(n[4], { color: c.ink, bg: c.surface, border: c.line2, size: 28, height: (n[4].indexOf('\n') > 0 ? 0.56 : 0.34) * LS, weight: 700, depthTest: false, renderOrder: 4 });
        nl.position.set(n[1], 0.05, n[2] + 1.2); root.add(nl);
      });
      go(0);
    }
    function tableHTML(k, cur) {
      var h = '<div class="table-wrap"><table class="cmp"><thead><tr><th>Private address</th><th>Private port</th><th>External address</th><th>External port</th><th>Transport protocol</th></tr></thead><tbody>';
      if (!k) h += '<tr><td colspan="5" class="muted">Translation table is empty</td></tr>';
      for (var i = 0; i < k; i++) h += '<tr' + (i === cur ? ' style="background:var(--hl, color-mix(in srgb, var(--accent) 12%, transparent))"' : '') + '>' + NAT[i].map(function (x) { return '<td class="mono">' + x + '</td>'; }).join('') + '</tr>';
      return h + '</tbody></table></div>';
    }
    function go(i) {
      var sc = SC[mode];
      step = ((i % sc.steps.length) + sc.steps.length) % sc.steps.length; tt = 0;
      clearGroup(pkG);
      var st = sc.steps[step];
      st.pk.forEach(function (p) { var g = packet(p); g.userData.path = p.path || [st.a, st.b]; g.position.copy(npos(g.userData.path[0])); g.position.y = 1.15; g.visible = !(p.d > 0); pkG.add(g); });
      var extra = '';
      if (mode === 'nat') extra = tableHTML(st.tab, step === 1 ? 0 : step === 5 ? 1 : -1);
      info.innerHTML = '<h4>' + sc.title + ' · step ' + (step + 1) + ' of ' + sc.steps.length + '</h4><p>' + st.say + '</p>' + extra;
    }
    var HOLD = 1.3;
    function moveTime() { return mode === 'bgp' ? 2.6 : 1.7; }
    S.onFrame(function (dt) {
      var sc = SC[mode], st = sc.steps[step];
      if (!st) return;
      tt += dt;
      var maxD = 0; st.pk.forEach(function (p) { maxD = Math.max(maxD, p.d || 0); });
      pkG.children.forEach(function (g) {
        var MOVE = moveTime() * (g.userData.path && g.userData.path.length > 3 ? 1.8 : 1), u = U.clamp((tt - g.userData.d) / MOVE, 0, 1), e = ease(u);
        g.visible = tt >= g.userData.d;
        var path = g.userData.path;
        if (path[0] === path[path.length - 1]) { var s = 0.55 + 0.45 * e; g.scale.set(s, s, s); g.position.y = 1.15 + Math.sin(Math.PI * e) * 0.3; return; }
        var pts = path.map(npos), lens = [], L = 0;
        for (var i = 1; i < pts.length; i++) { lens.push(pts[i].distanceTo(pts[i - 1])); L += lens[i - 1]; }
        var dd = e * L, k = 0;
        while (k < lens.length - 1 && dd > lens[k]) { dd -= lens[k]; k++; }
        var f = lens[k] ? U.clamp(dd / lens[k], 0, 1) : 1, a = pts[k], b = pts[k + 1];
        g.position.set(a.x + (b.x - a.x) * f, 1.15 + Math.sin(Math.PI * f) * (path.length > 2 ? 0.3 : 0.5), a.z + (b.z - a.z) * f);
      });
      var longest = 0; pkG.children.forEach(function (g) { longest = Math.max(longest, g.userData.d + moveTime() * (g.userData.path && g.userData.path.length > 3 ? 1.8 : 1)); });
      if (playing && tt > Math.max(maxD, longest) + HOLD) go(step + 1);
    });
    build();
    return { dispose: S.dispose };
  };
})();
