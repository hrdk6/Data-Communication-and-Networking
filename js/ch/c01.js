DCN.register({
  id: 'c1', num: 1, part: 'A', layer: 'found', unit: 'Unit 1 · Module 1',
  title: 'Introduction to Data Communication and Networks',
  short: 'Introduction',
  summary: 'What a data communication system is made of, how networks are judged and laid out, the kinds of networks from PAN to WAN, how the Internet is organised and governed, and how switching moves data across it.',
  hot: ['IA-1 Q1a', 'IA-1 Q5b', 'VTU Jan 20 · Jan 19 · Jul 19', 'VTU Jan 18', 'VTU Jul 18 · Jul 19'],
  sources: ['U-1-ch-1.pdf', '1.ppt', 'CN-BCS502-Module1-RajeshL.pdf', 'cn_module1 (naveen notes).pdf', 'CN_Complete_Notes', 'Network Survey Report.pdf', 'CNS Servey Report AAD.pdf'],
  keywords: 'delivery accuracy timeliness jitter message sender receiver medium protocol simplex half duplex full duplex unicode ascii pixel mesh star bus ring hybrid hub LAN WAN MAN PAN internet ISP RFC ISOC IAB IETF IRTF circuit message packet datagram virtual circuit VCI',
  html: `
<section class="topic" id="c1-datacomm">
<h2>Data communications</h2>
<p><b>Telecommunication</b> means communication at a distance (<i>tele</i> is Greek for "far"). <b>Data</b> is information presented in whatever form the parties creating and using it agree on. <b>Data communication</b> is the exchange of data between two devices through some transmission medium, such as a wire cable. The devices must be part of a communication system made of hardware (physical equipment) and software (programs).</p>
<h3 id="c1-characteristics">Four fundamental characteristics</h3>
<p>The effectiveness of a data communication system depends on four characteristics. Learn them with their one-line meanings; they come up in scenario questions.</p>
<div class="duo">
  <div class="card"><h4>1 · Delivery</h4><p>Data must reach the correct destination, and only the intended device or user.</p></div>
  <div class="card"><h4>2 · Accuracy</h4><p>Data must arrive without alteration. Data changed in transit and left uncorrected is unusable.</p></div>
  <div class="card"><h4>3 · Timeliness</h4><p>Data delivered late is useless. For audio and video this means <b>real-time transmission</b>: delivered as produced, in order, without significant delay.</p></div>
  <div class="card"><h4>4 · Jitter</h4><p>The variation in packet arrival time: uneven delay. If video packets are sent every 30 ms but some arrive after 30 ms and others after 40 ms, the picture becomes uneven.</p></div>
</div>
<h3 id="c1-components">Five components</h3>
<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Components of a data communication system">
  <rect x="20" y="20" width="110" height="62" rx="6" style="fill:var(--surface-2);stroke:var(--line-2)"/>
  <text x="75" y="42" text-anchor="middle" style="font-size:12px">Rule 1:</text><text x="75" y="58" text-anchor="middle" style="font-size:12px">Rule 2: …</text><text x="75" y="74" text-anchor="middle" style="font-size:12px">Rule n:</text>
  <rect x="510" y="20" width="110" height="62" rx="6" style="fill:var(--surface-2);stroke:var(--line-2)"/>
  <text x="565" y="42" text-anchor="middle" style="font-size:12px">Rule 1:</text><text x="565" y="58" text-anchor="middle" style="font-size:12px">Rule 2: …</text><text x="565" y="74" text-anchor="middle" style="font-size:12px">Rule n:</text>
  <text x="160" y="56" style="font-size:13px;font-weight:600">Protocol</text><text x="420" y="56" style="font-size:13px;font-weight:600">Protocol</text>
  <rect x="20" y="104" width="110" height="40" rx="6" style="fill:var(--found);fill-opacity:.15;stroke:var(--found)"/><text x="75" y="129" text-anchor="middle" style="font-size:14px;font-weight:700">Sender</text>
  <rect x="510" y="104" width="110" height="40" rx="6" style="fill:var(--found);fill-opacity:.15;stroke:var(--found)"/><text x="565" y="129" text-anchor="middle" style="font-size:14px;font-weight:700">Receiver</text>
  <line x1="130" y1="124" x2="510" y2="124" style="stroke:var(--phy);stroke-width:4"/>
  <text x="320" y="160" text-anchor="middle" style="font-size:13px">Transmission medium</text>
  <rect x="265" y="88" width="110" height="28" rx="5" style="fill:var(--accent);fill-opacity:.18;stroke:var(--accent)"/><text x="320" y="107" text-anchor="middle" style="font-size:13px;font-weight:700">Message →</text>
</svg>
<figcaption>Draw this in every answer on components: five boxes, labelled.</figcaption>
</figure>
<ol>
  <li><b>Message</b>: the information to be communicated: text, numbers, pictures, audio or video.</li>
  <li><b>Sender</b>: the device that sends the message (computer, workstation, telephone handset, video camera…).</li>
  <li><b>Receiver</b>: the device that receives it (computer, workstation, telephone handset, television…).</li>
  <li><b>Transmission medium</b>: the physical path from sender to receiver: twisted-pair wire, coaxial cable, fibre-optic cable, radio waves.</li>
  <li><b>Protocol</b>: a set of rules that govern data communication; an agreement between the devices. Without a protocol two devices may be connected but not communicating, like a French speaker and a Japanese speaker.</li>
</ol>
<h3 id="c1-representation">Data representation</h3>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Form</th><th>How it is represented</th></tr></thead>
<tbody>
<tr><th>Text</th><td>A bit pattern per symbol. Each set of patterns is a <b>code</b>; representing symbols is <b>coding</b>. <b>Unicode</b> uses 32 bits for any character in any language. <b>ASCII</b> forms the first 127 characters of Unicode (Basic Latin).</td></tr>
<tr><th>Numbers</th><td>Also bit patterns, but converted directly to binary (not ASCII) to simplify arithmetic.</td></tr>
<tr><th>Images</th><td>A matrix of <b>pixels</b>; each pixel gets a bit pattern. Resolution = number of pixels. Black-and-white needs 1 bit per pixel; four grey levels need 2 bits (00 black, 01 dark grey, 10 light grey, 11 white). Colour: <b>RGB</b> (red, green, blue) or <b>YCM</b> (yellow, cyan, magenta).</td></tr>
<tr><th>Audio</th><td>Recording or broadcasting of sound. Continuous, not discrete, even after a microphone turns it into an electric signal.</td></tr>
<tr><th>Video</th><td>A continuous entity (TV camera) or a sequence of discrete images arranged to show motion.</td></tr>
</tbody></table></div>
<h3 id="c1-dataflow">Data flow</h3>
<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="Simplex, half-duplex and full-duplex data flow">
  <defs><marker id="c1a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--phy)"/></marker></defs>
  <text x="10" y="30" style="font-size:13px;font-weight:700">a. Simplex</text>
  <rect x="130" y="14" width="80" height="30" rx="4" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="170" y="34" text-anchor="middle" style="font-size:12px">Mainframe</text>
  <rect x="520" y="14" width="80" height="30" rx="4" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="560" y="34" text-anchor="middle" style="font-size:12px">Monitor</text>
  <line x1="215" y1="29" x2="514" y2="29" style="stroke:var(--phy);stroke-width:2.5" marker-end="url(#c1a)"/><text x="365" y="22" text-anchor="middle" style="font-size:11px">direction of data</text>
  <text x="10" y="100" style="font-size:13px;font-weight:700">b. Half-duplex</text>
  <rect x="130" y="80" width="80" height="34" rx="4" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="170" y="102" text-anchor="middle" style="font-size:12px">Station</text>
  <rect x="520" y="80" width="80" height="34" rx="4" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="560" y="102" text-anchor="middle" style="font-size:12px">Station</text>
  <line x1="215" y1="90" x2="514" y2="90" style="stroke:var(--phy);stroke-width:2" marker-end="url(#c1a)"/><text x="365" y="84" text-anchor="middle" style="font-size:11px">at time 1</text>
  <line x1="514" y1="106" x2="215" y2="106" style="stroke:var(--net);stroke-width:2" marker-end="url(#c1a)"/><text x="365" y="122" text-anchor="middle" style="font-size:11px">at time 2</text>
  <text x="10" y="176" style="font-size:13px;font-weight:700">c. Full-duplex</text>
  <rect x="130" y="156" width="80" height="34" rx="4" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="170" y="178" text-anchor="middle" style="font-size:12px">Station</text>
  <rect x="520" y="156" width="80" height="34" rx="4" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="560" y="178" text-anchor="middle" style="font-size:12px">Station</text>
  <line x1="220" y1="173" x2="508" y2="173" style="stroke:var(--dll);stroke-width:2.5" marker-end="url(#c1a)" marker-start="url(#c1a)"/><text x="365" y="166" text-anchor="middle" style="font-size:11px">both directions all the time</text>
</svg>
</figure>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Mode</th><th>Who can send</th><th>Capacity</th><th>Example</th></tr></thead>
<tbody>
<tr><th>Simplex</th><td>Only one device transmits; the other only receives (one-way street).</td><td>Whole channel in one direction.</td><td>Keyboard, traditional monitor</td></tr>
<tr><th>Half-duplex</th><td>Both can transmit, but not at the same time (one-lane road with two-way traffic).</td><td>Whole channel taken by whichever device is sending.</td><td>Walkie-talkie, CB radio</td></tr>
<tr><th>Full-duplex</th><td>Both transmit simultaneously.</td><td>Shared: two separate paths, or the capacity divided between the two directions.</td><td>Telephone network</td></tr>
</tbody></table></div>
<div class="note exam"><b class="tag">IA-1 Q1a · 6 marks</b><p><b>Office with slow transfers.</b> (1) Importance of data communication there: faster, reliable file sharing reduces waiting and improves productivity; stable connectivity keeps on-site and remote staff collaborating; encryption and secure protocols protect sensitive office data. (2) Characteristics that could be hurting performance: <b>delivery</b> (data going to the wrong place or not arriving), <b>accuracy</b> (corrupted files that must be resent), <b>timeliness</b> (late data, slow transfers) and <b>jitter</b> (uneven delay that makes calls choppy). Scheme: 3 + 3 marks.</p></div>
</section>

<section class="topic" id="c1-networks">
<h2>Networks and network criteria</h2>
<p>A <b>network</b> is a set of devices (<b>nodes</b>) connected by communication <b>links</b>. A node is any device that can send or receive data: a computer, printer, router. A link is any medium that can carry a signal: cable, air, optical fibre. Most networks use <b>distributed processing</b>: a task is divided among many computers instead of one large machine.</p>
<h3 id="c1-criteria">Network criteria</h3>
<div class="duo">
  <div class="card"><h4>Performance</h4><ul><li><b>Transit time</b>: time for a message to travel from one device to another.</li><li><b>Response time</b>: time between an inquiry and its response.</li><li>Depends on: number of users, type of medium, capability of the hardware, efficiency of the software.</li><li>Measured by <b>throughput</b> (want more) and <b>delay</b> (want less). The two often conflict: pushing more data raises delay through congestion.</li></ul></div>
  <div class="card"><h4>Reliability</h4><ul><li>Frequency of failure.</li><li>Time taken to recover from a failure.</li><li>Robustness of the network in a catastrophe.</li></ul></div>
  <div class="card"><h4>Security</h4><ul><li>Protecting data from unauthorised access.</li><li>Protecting data from damage.</li><li>Policies and procedures for recovering from breaches and data loss.</li></ul></div>
</div>
<h3 id="c1-connection">Type of connection</h3>
<div class="duo">
  <div class="card"><h4>Point-to-point</h4><p>A dedicated link between exactly two devices; the entire capacity is reserved for them. Changing TV channels with an infrared remote is a point-to-point connection.</p></div>
  <div class="card"><h4>Multipoint (multidrop)</h4><p>More than two devices share one link. Capacity is shared <b>spatially</b> (several devices use the link at once) or <b>temporally</b> (they take turns).</p></div>
</div>
<p>By the number of receivers, a transmission is <b>unicast</b> (one sender to one receiver), <b>multicast</b> (one sender to a group) or <b>broadcast</b> (one sender to everyone on the network).</p>
</section>

<section class="topic" id="c1-topology">
<h2>Physical topology</h2>
<p><b>Physical topology</b> is the way a network is laid out physically: the geometric representation of all links and linking devices (nodes) to one another. Two or more devices connect to a link; two or more links form a topology. There are four basic topologies, plus hybrids.</p>
<figure class="lab lab-3d" data-scene="topology"><figcaption><span class="ttl">Topology lab: build it, break it</span><span class="cap">Switch topologies, change the number of devices, click cables to cut them, fail the hub, then send a packet.</span></figcaption></figure>
<figure class="fig">
<svg viewBox="0 0 680 170" role="img" aria-label="Mesh, star, bus and ring topologies">
  <g transform="translate(20,20)">
    <text x="60" y="0" text-anchor="middle" style="font-size:13px;font-weight:700">Mesh</text>
    <g style="stroke:var(--line-2);stroke-width:1.6"><line x1="60" y1="20" x2="110" y2="60"/><line x1="60" y1="20" x2="90" y2="120"/><line x1="60" y1="20" x2="30" y2="120"/><line x1="60" y1="20" x2="10" y2="60"/><line x1="110" y1="60" x2="90" y2="120"/><line x1="110" y1="60" x2="30" y2="120"/><line x1="110" y1="60" x2="10" y2="60"/><line x1="90" y1="120" x2="30" y2="120"/><line x1="90" y1="120" x2="10" y2="60"/><line x1="30" y1="120" x2="10" y2="60"/></g>
    <g style="fill:var(--found)"><circle cx="60" cy="20" r="8"/><circle cx="110" cy="60" r="8"/><circle cx="90" cy="120" r="8"/><circle cx="30" cy="120" r="8"/><circle cx="10" cy="60" r="8"/></g>
  </g>
  <g transform="translate(190,20)">
    <text x="60" y="0" text-anchor="middle" style="font-size:13px;font-weight:700">Star</text>
    <g style="stroke:var(--line-2);stroke-width:1.6"><line x1="60" y1="70" x2="15" y2="25"/><line x1="60" y1="70" x2="105" y2="25"/><line x1="60" y1="70" x2="15" y2="120"/><line x1="60" y1="70" x2="105" y2="120"/></g>
    <rect x="44" y="60" width="32" height="20" rx="3" style="fill:var(--accent)"/><text x="60" y="74" text-anchor="middle" style="font-size:10px;fill:var(--surface)">hub</text>
    <g style="fill:var(--found)"><circle cx="15" cy="25" r="8"/><circle cx="105" cy="25" r="8"/><circle cx="15" cy="120" r="8"/><circle cx="105" cy="120" r="8"/></g>
  </g>
  <g transform="translate(360,20)">
    <text x="70" y="0" text-anchor="middle" style="font-size:13px;font-weight:700">Bus</text>
    <line x1="0" y1="70" x2="140" y2="70" style="stroke:var(--phy);stroke-width:4"/>
    <g style="stroke:var(--line-2);stroke-width:1.6"><line x1="25" y1="70" x2="25" y2="30"/><line x1="70" y1="70" x2="70" y2="110"/><line x1="115" y1="70" x2="115" y2="30"/></g>
    <g style="fill:var(--found)"><circle cx="25" cy="25" r="8"/><circle cx="70" cy="115" r="8"/><circle cx="115" cy="25" r="8"/></g>
    <text x="70" y="140" text-anchor="middle" style="font-size:10px">drop lines + taps</text>
  </g>
  <g transform="translate(540,20)">
    <text x="60" y="0" text-anchor="middle" style="font-size:13px;font-weight:700">Ring</text>
    <circle cx="60" cy="72" r="46" style="fill:none;stroke:var(--line-2);stroke-width:1.6"/>
    <g style="fill:var(--found)"><circle cx="60" cy="26" r="8"/><circle cx="104" cy="58" r="8"/><circle cx="87" cy="110" r="8"/><circle cx="33" cy="110" r="8"/><circle cx="16" cy="58" r="8"/></g>
    <text x="60" y="76" text-anchor="middle" style="font-size:10px">one way</text>
  </g>
</svg>
<figcaption>Exam drawings: keep them this simple, but label the hub, the backbone and the direction of the ring.</figcaption>
</figure>
<h3 id="c1-mesh">Mesh</h3>
<p>Every device has a dedicated point-to-point link to every other device. With <i>n</i> devices there are <b>n(n − 1)</b> physical (simplex) links, or <b>n(n − 1)/2 duplex links</b>; every device needs <b>n − 1 I/O ports</b>.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>Dedicated links: each connection carries its own load, so no traffic problems.</li><li>Robust: one failed link does not stop the system.</li><li>Privacy and security: only the intended receiver sees the data.</li><li>Easy fault identification and isolation; traffic can be rerouted.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li>Hard to install and reconfigure.</li><li>The bulk of wiring can exceed the available space.</li><li>Expensive hardware for so many links and ports.</li></ul><p class="small muted">Practical use: connecting telephone regional offices, each to every other.</p></div>
</div>
<figure class="lab" data-widget="mesh" data-n="5"><figcaption><span class="ttl">Mesh calculator</span><span class="cap">VTU Jan 18 asked this for 5 devices.</span></figcaption></figure>
<h3 id="c1-star">Star</h3>
<p>Each device has a dedicated point-to-point link only to a central controller, the <b>hub</b>. Devices are not linked to each other, so there is no direct traffic between them: device 1 sends to the hub, which relays to device 2.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>Cheaper than mesh: each device needs one link and one I/O port.</li><li>Easy to install and reconfigure: add or remove a node without disturbing others.</li><li>Robust: if one link fails, only that device is affected.</li><li>Easy fault detection; centralised management.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li><b>Single point of failure</b>: if the hub goes down, the whole network is dead.</li><li>More cable than bus or ring.</li><li>Number of nodes limited by the hub's capacity.</li></ul><p class="small muted">Typical use: local area networks.</p></div>
</div>
<h3 id="c1-bus">Bus</h3>
<p>A multipoint topology: one long cable, the <b>backbone</b>, links all devices. Nodes connect through <b>drop lines</b> (device to bus) and <b>taps</b> (connectors on the bus). As the signal travels it loses energy as heat, so there is a limit on the number of taps and the distance between them. Data is broadcast; only the device whose address matches accepts it.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>Easy installation.</li><li>Least cable of all topologies; redundancy eliminated.</li><li>Low cost; good for small LANs.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li>Difficult reconnection and fault isolation.</li><li>Signal reflection at the taps degrades quality.</li><li>A fault or break in the backbone stops all transmission.</li><li>Limits on cable length and number of nodes; low security, since every device receives the data.</li></ul></div>
</div>
<h3 id="c1-ring">Ring</h3>
<p>Each device has a dedicated point-to-point link only with the two devices on either side. A signal travels round the ring in one direction until it reaches its destination. Each device contains a <b>repeater</b> that regenerates the bits and passes them on. Sending is controlled by a <b>token</b>.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>Easy to install and reconfigure: adding or deleting a device changes only two connections.</li><li>Simple fault isolation: a device that hears no signal within a set time raises an alarm with the problem's location.</li><li>Less congestion: traffic flows one way.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li>Unidirectional traffic.</li><li>A break in the ring (or a failed device) can disable the whole network. A <b>dual ring</b>, with a second ring running the other way, overcomes both drawbacks.</li><li>Limits on cable length and nodes; slower, since data passes every device on the way.</li></ul></div>
</div>
<h3 id="c1-hybrid">Hybrid</h3>
<p>A combination of topologies, for example a star backbone with three bus networks hanging off the hub.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Mesh</th><th>Star</th><th>Bus</th><th>Ring</th></tr></thead>
<tbody>
<tr><th>Connection</th><td>Point-to-point to all</td><td>Point-to-point to hub</td><td>Multipoint</td><td>Point-to-point to two neighbours</td></tr>
<tr><th>Links for n devices</th><td class="mono">n(n−1)/2</td><td class="mono">n</td><td class="mono">1 backbone + n drops</td><td class="mono">n</td></tr>
<tr><th>Ports per device</th><td class="mono">n − 1</td><td class="mono">1</td><td class="mono">1 (tap)</td><td class="mono">2</td></tr>
<tr><th>One cable fails</th><td>Reroute; still works</td><td>Only that device lost</td><td>Whole network down</td><td>Whole ring down (unless dual)</td></tr>
<tr><th>Fault isolation</th><td>Easy</td><td>Easy</td><td>Difficult</td><td>Simple (alarm)</td></tr>
<tr><th>Cost / cabling</th><td>Highest</td><td>Moderate</td><td>Lowest</td><td>Low</td></tr>
</tbody></table></div>
<h3 id="c1-campus">Real case: the BMSIT&amp;M campus network</h3>
<p>The two network survey reports in your files describe your own campus. It uses a <b>star-based hybrid topology</b>:</p>
<div class="flow"><span>Wi-Fi / LAN devices</span><i>→</i><span>floor switch</span><i>→</i><span>block node switch</span><i>→</i><span>stacked switches</span><i>→</i><span>two core switches (Extreme X590)</span><i>→</i><span>UTM firewall</span><i>→</i><span>ISP links</span></div>
<ul>
  <li>Optical fibre cable (OFC) interconnects the buildings; a radio-frequency (RF) link reaches the ladies' hostel; a secondary OFC ring acts as a backup if the primary fails.</li>
  <li>Two core switches instead of one handle more connections and bandwidth, and remove a single point of failure.</li>
  <li>The Unified Threat Management (UTM) box blocks restricted sites, applies browsing policies and stops attacks; Extreme NAC authenticates users.</li>
  <li>Why star: isolation of devices, simplicity, a failed cable does not affect others, devices can be added without interruption, centralised control, easy troubleshooting.</li>
</ul>
<div class="note exam"><b class="tag">IA-1 Q5b · 4 marks</b><p><b>Topology for a large, growing university campus.</b> Recommend a <b>star (or hybrid star) with a redundant, mesh-like core</b>: star wiring inside each building gives easy fault isolation and lets new buildings join by adding a link to the core; redundant core links give the reliability a mesh offers. Limitations to mention: the central switch is a single point of failure (use two core switches), more cable is needed than for a bus, the number of nodes depends on switch capacity, and a full mesh between buildings would be very expensive. The scheme also gave marks for explaining all four topologies with diagrams.</p></div>
</section>

<section class="topic" id="c1-devices">
<h2>Network devices</h2>
<p>Your slides list four devices that connect media and build networks. Remember each by the layer it works at.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Device</th><th>Layer</th><th>What it does</th></tr></thead>
<tbody>
<tr><th>Hub (and repeater)</th><td>Physical</td><td>Receives a signal and regenerates or repeats it to every port. It has no idea of addresses.</td></tr>
<tr><th>Bridge</th><td>Data link</td><td>Connects two LAN segments and forwards or filters frames using their MAC addresses.</td></tr>
<tr><th>Switch (link-layer switch)</th><td>Data link</td><td>A multiport bridge: sends each frame only to the port of the destination MAC address. Involved in only two layers (data link, physical). Managed switches can be configured (VLANs, SNMP, port mirroring); unmanaged ones are plug and play.</td></tr>
<tr><th>Router</th><td>Network</td><td>Connects different networks and forwards packets by their IP address using a routing table. Involved in three layers (network, data link, physical).</td></tr>
<tr><th>NIC</th><td>Data link / physical</td><td>Network interface card: gives the computer its 48-bit MAC (hardware) address.</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c1-types">
<h2>Network types</h2>
<p>Networks are classified by <b>size, geographical coverage and ownership</b>.</p>
<div class="duo">
  <div class="card"><h4>PAN</h4><p>Personal area network: devices around one person, e.g. a computer and its wireless peripherals over <b>Bluetooth</b>. The PC is the master and tells the slaves (mouse, keyboard) which addresses, times and frequencies to use.</p></div>
  <div class="card"><h4>LAN</h4><p>Local area network: privately owned, connecting hosts in a single office, building or campus. Each host has an address that uniquely identifies it in the LAN; a packet carries both source and destination addresses. Today LANs use a smart switch.</p></div>
  <div class="card"><h4>MAN</h4><p>Metropolitan area network: covers a city. Best-known examples are cable TV networks; high-speed wireless access standardised as IEEE 802.16 (<b>WiMAX</b>).</p></div>
  <div class="card"><h4>WAN</h4><p>Wide area network: spans a town, state, country or the world. Usually created and run by communication companies (e.g. BSNL, Airtel) and leased by organisations. Two kinds: <b>point-to-point WAN</b> (connects two devices over cable or air) and <b>switched WAN</b> (more than two ends; several point-to-point WANs joined by switches; the backbone of global communication).</p></div>
</div>
<p>When two or more networks are connected they form an <b>internetwork</b> (an internet with a small i). In the two-office example, a switch delivers traffic inside an office, while routers R1 and R2 carry a packet between the west-coast and east-coast offices.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Parameter</th><th>LAN</th><th>WAN</th></tr></thead>
<tbody>
<tr><th>Expands to</th><td>Local area network</td><td>Wide area network</td></tr>
<tr><th>Meaning</th><td>Connects computers in a single office, building or campus</td><td>Connects computers over a large geographical area such as countries</td></tr>
<tr><th>Ownership</th><td>Private</td><td>Private or public</td></tr>
<tr><th>Range</th><td>Small: up to about 10 km</td><td>Large: beyond 100 km</td></tr>
<tr><th>Speed</th><td>High: typically 10, 100 and 1000 Mbps</td><td>Low: typically 1.5 Mbps</td></tr>
<tr><th>Propagation delay</th><td>Short</td><td>Long</td></tr>
<tr><th>Cost · congestion</th><td>Low · less</td><td>High · more</td></tr>
<tr><th>Design and maintenance</th><td>Easy</td><td>Difficult</td></tr>
<tr><th>Fault tolerance</th><td>More tolerant</td><td>Less tolerant</td></tr>
<tr><th>Media used</th><td>Twisted pair</td><td>Optical fibre or radio waves</td></tr>
<tr><th>Used for · interconnects</th><td>College, hospital · hosts</td><td>Internet · connecting devices such as switches, routers, modems</td></tr>
</tbody></table></div>
<p>Related terms: the <b>Internet</b> connects computers around the world; an <b>intranet</b> connects computers inside one organisation; an <b>extranet</b> extends connections beyond the organisation to suppliers, customers and partners.</p>
<div class="note exam"><b class="tag">VTU Jul 19</b><p><b>What decides whether a network is a LAN or a WAN?</b> Geographical span (building/campus vs country/world), ownership (private vs usually run by a carrier and leased), speed and delay (high/short vs lower/long), cost and media (twisted pair vs fibre/radio), and what it interconnects (hosts vs connecting devices such as switches and routers).</p></div>
</section>

<section class="topic" id="c1-internet">
<h2>The Internet</h2>
<p>An <b>internet</b> is two or more networks that can communicate. The <b>Internet</b> (capital I) is the most notable one, made of thousands of interconnected networks. Conceptually it has three levels:</p>
<ul>
  <li><b>Backbones</b>: large networks owned by companies such as Sprint, Verizon (MCI), AT&amp;T and NTT, connected through complex switching systems called <b>peering points</b>. Backbones are also called international ISPs.</li>
  <li><b>Provider networks</b>: smaller networks that pay to use the backbones; also called national or regional ISPs. A regional ISP serves a specific area with a smaller support team; a national ISP serves cities and towns nationwide.</li>
  <li><b>Customer networks</b>: at the edge, actually using the Internet's services and paying the provider networks.</li>
</ul>
<p>In the older hierarchical picture, local ISPs connect to regional ISPs, which connect to national ISPs; national ISPs interconnect at network access points (NAPs).</p>
<h3 id="c1-access">Accessing the Internet</h3>
<ol>
  <li><b>Telephone networks</b>: <b>dial-up</b> (a modem converts data to voice; slow, and the line cannot carry calls meanwhile) or <b>DSL</b> (upgraded line; voice and data at the same time, higher speed).</li>
  <li><b>Cable networks</b>: the cable TV network carries data; fast, but speed varies with how many neighbours share the cable.</li>
  <li><b>Wireless networks</b>: wireless WAN access, often combined with wired connections.</li>
  <li><b>Direct connection</b>: a large organisation leases a high-speed WAN from a carrier and becomes a local ISP connected to a regional ISP.</li>
</ol>
<h3 id="c1-url">What happens when you type a web address</h3>
<ol>
  <li>Your device reaches the Internet through a router (joins devices into one network) and a modem (connects to your ISP over cable or DSL).</li>
  <li>You type a URL, which tells the ISP where you want to go.</li>
  <li>The query goes to the ISP; the browser looks up the IP address for the domain name through <b>DNS</b> (for example google.com → 64.233.191.255).</li>
  <li>The browser sends an <b>HTTP request</b> to the target server, using TCP/IP.</li>
  <li>The server approves and replies "200 OK", then sends the website's files as data packets.</li>
  <li>The browser reassembles the packets and the page loads.</li>
</ol>
<p class="small muted">Chapters 12 and 13 explain every step of this journey in detail.</p>
</section>

<section class="topic" id="c1-standards">
<h2>Internet standards and administration</h2>
<p>An <b>Internet standard</b> is a thoroughly tested specification that is useful to, and followed by, those who work with the Internet. A specification starts as an <b>Internet draft</b>: a working document with no official status and a <b>six-month lifetime</b>. On the recommendation of the Internet authorities a draft may be published as a <b>Request for Comment (RFC)</b>, which is edited, numbered and made available to everyone.</p>
<div class="duo">
  <div class="card"><h4>Six maturity levels of an RFC</h4><ol><li><b>Proposed standard</b>: stable, well understood, of enough interest; tested by several groups.</li><li><b>Draft standard</b>: after at least two successful independent, interoperable implementations.</li><li><b>Internet standard</b>: after demonstrations of successful implementation.</li><li><b>Historic</b>: superseded, or never passed the maturity levels.</li><li><b>Experimental</b>: work on an experimental situation; must not be used in a working Internet service.</li><li><b>Informational</b>: general, historical or tutorial information, often from a vendor.</li></ol></div>
  <div class="card"><h4>Five requirement levels</h4><ol><li><b>Required</b>: must be implemented by all Internet systems (e.g. IP, ICMP).</li><li><b>Recommended</b>: not required, but useful (e.g. FTP, TELNET).</li><li><b>Elective</b>: neither required nor recommended; use it if it benefits you.</li><li><b>Limited use</b>: only in limited situations; most experimental RFCs.</li><li><b>Not recommended</b>: inappropriate for general use; usually historic (deprecated) RFCs.</li></ol></div>
</div>
<h3 id="c1-admin">Who runs the Internet</h3>
<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Internet administration hierarchy">
  <g style="stroke:var(--line-2);stroke-width:1.6"><line x1="320" y1="44" x2="320" y2="74"/><line x1="320" y1="104" x2="180" y2="134"/><line x1="320" y1="104" x2="460" y2="134"/></g>
  <rect x="250" y="14" width="140" height="30" rx="5" style="fill:var(--net);fill-opacity:.15;stroke:var(--net)"/><text x="320" y="34" text-anchor="middle" style="font-size:13px;font-weight:700">ISOC</text>
  <rect x="250" y="74" width="140" height="30" rx="5" style="fill:var(--net);fill-opacity:.15;stroke:var(--net)"/><text x="320" y="94" text-anchor="middle" style="font-size:13px;font-weight:700">IAB</text>
  <rect x="100" y="134" width="160" height="30" rx="5" style="fill:var(--dll);fill-opacity:.15;stroke:var(--dll)"/><text x="180" y="154" text-anchor="middle" style="font-size:13px;font-weight:700">IETF (managed by IESG)</text>
  <rect x="380" y="134" width="160" height="30" rx="5" style="fill:var(--tl);fill-opacity:.15;stroke:var(--tl)"/><text x="460" y="154" text-anchor="middle" style="font-size:13px;font-weight:700">IRTF (managed by IRSG)</text>
  <text x="180" y="186" text-anchor="middle" style="font-size:11px">areas → working groups</text><text x="460" y="186" text-anchor="middle" style="font-size:11px">research groups</text>
</svg>
</figure>
<ul>
  <li><b>ISOC (Internet Society)</b>: international non-profit formed in 1992 to support the standards process; maintains IAB, IETF, IRTF and IANA, and promotes research.</li>
  <li><b>IAB (Internet Architecture Board)</b>: technical adviser to ISOC; oversees the development of the TCP/IP suite; works through IETF and IRTF; manages the editing of RFCs; liaison with other standards bodies.</li>
  <li><b>IETF (Internet Engineering Task Force)</b>: a forum of working groups managed by the IESG; identifies operational problems and proposes solutions; develops and reviews specifications meant to become standards. Working groups are collected into areas (applications, protocols, routing, network management, next generation IPng, security…).</li>
  <li><b>IRTF (Internet Research Task Force)</b>: working groups managed by the IRSG; long-term research on Internet protocols, applications, architecture and technology.</li>
</ul>
</section>

<section class="topic" id="c1-switching">
<h2>Switching</h2>
<p>A large network has many possible paths from sender to receiver. <b>Switching</b> connects systems for one-to-one communication and decides how data crosses the intermediate nodes (switches). There are three techniques: <b>circuit</b>, <b>message</b> and <b>packet</b> switching; packet switching comes as <b>datagram</b> or <b>virtual-circuit</b> networks.</p>
<h3 id="c1-circuit">Circuit switching</h3>
<p>A dedicated end-to-end path is established before communication and stays until it is released, just like a telephone call. A request signal goes to the receiver, which acknowledges that the path is available, and only then does data flow. Three phases: <b>circuit establishment → data transfer → circuit disconnect</b>. Used in the public telephone network for voice.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>The channel is dedicated.</li><li>Fixed bandwidth; once set up, the only delay is the transmission itself.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li>Long set-up time (about 10 s) during which no data moves.</li><li>Expensive: a dedicated path for every connection.</li><li>Inefficient: capacity is wasted when no data is sent, and no one else may use the free channel.</li></ul></div>
</div>
<h3 id="c1-message">Message switching</h3>
<p>The whole message is the unit of transfer. No dedicated path is set up; the destination address is appended to the message and each intermediate node <b>stores the entire message and then forwards</b> it (a store-and-forward network). Routing is dynamic.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>Channels are shared, so bandwidth is used efficiently.</li><li>Less congestion: messages wait at nodes.</li><li>Message priority can be used; messages of any size are supported.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li>Switches need enough storage to hold whole messages.</li><li>Long delays from storing and forwarding.</li></ul></div>
</div>
<h3 id="c1-packet">Packet switching</h3>
<p>The message is divided into smaller <b>packets</b>, each with a header carrying the source address, destination address and a sequence number. Packets travel independently (ideally along the shortest available path) and are reassembled in order at the receiver; a missing or corrupted packet is requested again. There is <b>no resource reservation</b>: resources are allocated on demand, first come first served.</p>
<div class="duo">
  <div class="card"><h4>Advantages</h4><ul><li>Cost-effective: switches need little storage.</li><li>Reliable: if a node is busy, packets are rerouted.</li><li>Efficient: no set-up needed, and many users share the same channel.</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li>Not suitable for applications needing low delay and high quality.</li><li>Complex protocols, high implementation cost.</li><li>Overloads cause retransmissions; unrecovered errors can lose information.</li></ul></div>
</div>
<h3 id="c1-datagram">Datagram networks</h3>
<ul>
  <li>Each packet (a <b>datagram</b>) is treated independently, even if it belongs to the same message; packets may take different paths and arrive out of order.</li>
  <li>Called <b>connectionless</b>: there are no set-up and teardown phases, and the switch keeps no information about a connection.</li>
  <li>Each switch has a <b>routing table</b> of destination address → output port, updated dynamically. The destination address in each header stays the same for the whole journey.</li>
  <li>Efficiency is better than circuit switching (resources are used only while packets are being sent); delay can be greater than in a virtual-circuit network because each packet may wait at every switch.</li>
  <li>The Internet uses the datagram approach at the network layer.</li>
</ul>
<h3 id="c1-vc">Virtual-circuit networks</h3>
<p>A cross between a circuit-switched network and a datagram network:</p>
<ol>
  <li>As in circuit switching, there are <b>set-up and teardown phases</b> in addition to data transfer.</li>
  <li>Resources can be allocated during set-up (as in circuit switching) or on demand (as in a datagram network).</li>
  <li>Data are packetised and each packet carries an address in its header, but the address is <b>local</b>: it says which switch (virtual circuit) the packet goes to next, not the final destination.</li>
  <li>All packets of a connection follow the <b>same path</b>, set up when the connection was made.</li>
  <li>Normally implemented in the data-link layer (circuit switching in the physical layer, datagrams in the network layer).</li>
</ol>
<p><b>Addressing:</b> a <b>global address</b> (unique in the whole network) is used only to create the circuit during set-up; during data transfer each packet carries a <b>virtual-circuit identifier (VCI)</b>, a small number with only local scope that changes from switch to switch. Each switch's table maps (incoming port, incoming VCI) → (outgoing port, outgoing VCI). <b>Phases:</b> set-up (a setup request travels to the destination and an acknowledgment returns, filling the tables), data transfer, teardown. Delay: a one-time set-up and teardown delay, but no per-packet routing decision.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Circuit switching</th><th>Datagram (packet)</th><th>Virtual circuit (packet)</th></tr></thead>
<tbody>
<tr><th>Set-up phase</th><td>Yes</td><td>No</td><td>Yes</td></tr>
<tr><th>Resources</th><td>Reserved for the call</td><td>On demand</td><td>At set-up or on demand</td></tr>
<tr><th>Path</th><td>Dedicated, fixed</td><td>Each packet decided separately</td><td>Same for all packets</td></tr>
<tr><th>Address carried</th><td>None during transfer</td><td>Full destination address</td><td>Local VCI</td></tr>
<tr><th>Order of arrival</th><td>In order</td><td>May be out of order</td><td>In order</td></tr>
<tr><th>Layer (Forouzan)</th><td>Physical</td><td>Network</td><td>Data link</td></tr>
<tr><th>Example</th><td>Telephone network</td><td>The Internet (IP)</td><td>Frame Relay, ATM</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c1-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>Describe data communication and its components. · 6 marks · VTU Jan 20, Jan 19, Jul 19</summary><div class="body">
<p>Data communication is the exchange of data between two devices through a transmission medium, using a system of hardware and software. Its effectiveness depends on delivery, accuracy, timeliness and jitter (one line each).</p>
<p>Draw the five-box figure, then explain: <b>message</b> (the information: text, numbers, images, audio, video), <b>sender</b>, <b>receiver</b>, <b>transmission medium</b> (twisted pair, coax, fibre, radio) and <b>protocol</b> (rules both sides agree on; without it devices are connected but cannot communicate).</p></div></details>
<details class="answer"><summary>Explain the data flow techniques of data communication. · 5 marks · VTU Jan 20, Jul 19</summary><div class="body">
<p>Draw the three-part figure. <b>Simplex</b>: one direction only, whole capacity used one way (keyboard → computer, monitor). <b>Half-duplex</b>: both directions but one at a time, whole capacity to whoever sends (walkie-talkie). <b>Full-duplex</b>: both directions at once, capacity shared through two paths or divided (telephone).</p></div></details>
<details class="answer"><summary>Five devices are in a mesh. How many duplex links and ports? · 2 marks · VTU Jan 18</summary><div class="body">
<p>Duplex links = n(n − 1)/2 = 5 × 4 / 2 = <b>10</b>. Ports per device = n − 1 = <b>4</b> (20 ports in total). For 7 devices: 21 links, 6 ports each.</p></div></details>
<details class="answer"><summary>Explain two fundamental characteristics of communication and the basic topologies. · 8 marks · VTU Jul 18, Jul 19</summary><div class="body">
<p>Pick delivery and accuracy (or timeliness and jitter) with a sentence each. Then mesh, star, bus and ring: definition, a labelled diagram, and two advantages and two disadvantages of each. Use the comparison table above as a final summary.</p></div></details>
<details class="answer"><summary>List the network criteria. · 4 marks · VTU Jul 18</summary><div class="body">
<p><b>Performance</b> (transit and response time; depends on number of users, medium, hardware, software; measured by throughput and delay), <b>reliability</b> (frequency of failure, recovery time, robustness in a catastrophe) and <b>security</b> (protection from unauthorised access and damage, recovery policies).</p></div></details>
<details class="answer"><summary>Compare circuit switching with datagram and virtual-circuit packet switching. · 6–8 marks</summary><div class="body">
<p>Define each in two lines, give the phases of circuit switching (establish, transfer, disconnect) and virtual circuits (set-up, transfer, teardown), explain global address vs VCI, and finish with the comparison table above.</p></div></details>
<details class="answer"><summary>Explain the maturity and requirement levels of Internet standards. · 6 marks</summary><div class="body">
<p>Internet draft (six months, no status) → RFC. Maturity: proposed standard, draft standard, Internet standard, historic, experimental, informational. Requirement: required (IP, ICMP), recommended (FTP, TELNET), elective, limited use, not recommended.</p></div></details>
</section>
`,
  quiz: [
    { q: 'A connection that provides a dedicated link between two devices is called', o: ['Point-to-point', 'Multipoint', 'Both', 'None of them'], a: 0, why: 'The entire capacity of a point-to-point link is reserved for the two devices.' },
    { q: 'Changing TV channels with an infrared remote control is an example of', o: ['Multidrop connection', 'Point-to-point connection', 'Broadcast', 'Mesh'], a: 1, why: 'The remote and the TV form a dedicated point-to-point link.' },
    { q: 'Seven devices are connected in a mesh topology. How many duplex links are needed?', o: ['42', '7', '21', '6'], a: 2, why: 'n(n − 1)/2 = 7 × 6 / 2 = 21. (42 is the number of simplex links.)' },
    { q: 'In that seven-device mesh, how many I/O ports does each device need?', o: ['5', '6', '7', '21'], a: 1, why: 'Each device connects to the other n − 1 = 6 devices.' },
    { q: 'In a star topology with six computers, how many links are needed?', o: ['6', '1', '5', '15'], a: 0, why: 'One link from each computer to the hub.' },
    { q: 'Bus topology is a', o: ['Point-to-point connection', 'Multipoint connection', 'Both', 'None'], a: 1, why: 'All devices share one backbone cable.' },
    { q: 'The flow of data in a simple ring topology is', o: ['Half duplex', 'Duplex', 'Unidirectional', 'Bidirectional'], a: 2, why: 'A signal is passed in one direction from device to device.' },
    { q: 'Video packets sent every 30 ms arrive with 30 ms and 40 ms delays. This problem is called', o: ['Attenuation', 'Jitter', 'Timeliness', 'Accuracy'], a: 1, why: 'Jitter is the variation (unevenness) in packet arrival time.' },
    { q: 'What is the lifetime of an Internet draft?', o: ['One month', 'Six months', 'One year', 'Unlimited'], a: 1, why: 'An Internet draft is a work in progress with no official status and a six-month lifetime.' },
    { q: 'IP and ICMP are examples of RFCs at which requirement level?', o: ['Recommended', 'Elective', 'Required', 'Limited use'], a: 2, why: 'Required protocols must be implemented by every Internet system.' },
    { q: 'Which statement about a virtual-circuit network is true?', o: ['Packets carry the full destination address', 'Each packet may take a different path', 'Packets carry a VCI with local scope', 'There is no set-up phase'], a: 2, why: 'The global address is used only at set-up; packets then carry a local virtual-circuit identifier.' },
    { q: 'Which switching technique stores the entire message at each node before forwarding it?', o: ['Circuit switching', 'Message switching', 'Datagram switching', 'Virtual-circuit switching'], a: 1, why: 'Message switching is a store-and-forward network with the whole message as the unit.' }
  ]
});
