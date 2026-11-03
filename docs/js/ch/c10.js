DCN.register({
  id: 'c10', num: 10, part: 'B', layer: 'net', unit: 'Module 3',
  title: 'Network Layer and IP Addressing',
  short: 'Network layer & IP',
  summary: 'What the network layer does, datagram versus virtual-circuit packet switching, IPv4 addressing (classful, classless/CIDR, subnetting, special addresses), DHCP, NAT, the IPv4 datagram and fragmentation, and IPv6 with tunnelling.',
  hot: ['IA-1 Q7b'],
  sources: ['Module 3.pptx.pdf', 'Module 3- IPV4 ADDRESSING.pdf', 'CN_Complete_Notes (Module 3)', 'basic of networks.pdf', 'cn Text book.pdf (ch. 4)', 'IA-1 answer scheme.pdf'],
  keywords: 'network layer host-to-host packetizing routing forwarding forwarding table routing table error control flow control congestion control quality of service security IPSec ICMP IGMP ARP datagram approach connectionless virtual circuit connection-oriented label VCI setup teardown IPv4 address 32-bit address space notation dotted decimal binary hexadecimal prefix suffix hierarchy classful class A B C D E netid hostid default mask address depletion subnetting supernetting classless CIDR slash notation mask first address last address network address block allocation ICANN aggregation summarization special addresses this-host limited broadcast loopback private multicast public private IP DHCP discover offer request ack nack magic cookie ports 67 68 lease renewing rebinding bound NAT translation table private address global address pool ports datagram format VER HLEN service type total length identification flags offset TTL time to live protocol checksum options fragmentation MTU reassembly more fragments do not fragment IPv6 128-bit traffic class flow label payload length next header hop limit extension headers hop-by-hop source routing authentication ESP destination option path MTU ICMPv6 packet too big tunneling tunnelling transition dual stack',
  html: `
<section class="topic" id="c10-intro">
<h2>The network layer at a glance</h2>
<p>The network layer is responsible for the <b>host-to-host delivery</b> of datagrams. It receives services from the data-link layer and provides services to the transport layer. Unlike the transport and application layers, network-layer protocols run in <b>every host and every router</b>.</p>
<div class="duo">
  <div class="card"><h4>At the source host</h4><p>Accepts a segment from the transport layer, encapsulates it in a datagram and delivers it to the data-link layer.</p></div>
  <div class="card"><h4>At each router</h4><p>Examines the header fields of every IP datagram passing through it and sends it towards the next network. A router normally uses only three layers, and is drawn with two data-link and two physical layers because it receives a packet from one network and delivers it to another.</p></div>
  <div class="card"><h4>At the destination host</h4><p>Decapsulates the datagram, extracts the packet and delivers it to the corresponding transport-layer protocol.</p></div>
</div>
<h3 id="c10-inet">The Internet's network layer</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Part</th><th>What it provides</th></tr></thead><tbody>
<tr><td><b>IP protocol</b></td><td>Addressing conventions, datagram format, packet-handling conventions</td></tr>
<tr><td><b>Routing protocols</b> (RIP, OSPF, BGP)</td><td>Path selection; they fill the <b>forwarding table</b></td></tr>
<tr><td><b>ICMP</b></td><td>Error reporting and router "signalling"</td></tr>
</tbody></table></div>
<p>In version 4 the network layer is <b>one main protocol and three auxiliary ones</b>: <b>IPv4</b> (packetizing, forwarding and delivery), <b>ICMPv4</b> (handles some errors in delivery), <b>IGMP</b> (helps IPv4 with multicasting) and <b>ARP</b> (glues the network and data-link layers by mapping network-layer addresses to link-layer addresses).</p>
</section>

<section class="topic" id="c10-services">
<h2>Network-layer services</h2>
<h3 id="c10-packetizing">Packetizing</h3>
<p>The first duty of the network layer is <b>packetizing</b>: encapsulating the payload (data from the upper layer) in a network-layer packet at the source and decapsulating it at the destination. Like the post office, it carries the payload <b>without changing or using it</b>.</p>
<ul>
  <li>The <b>source</b> adds a header with the source and destination addresses and other information, and gives the packet to the data-link layer. It may not change the payload unless the payload is too large and must be <b>fragmented</b>.</li>
  <li>The <b>destination</b> decapsulates the packet and delivers the payload to the upper-layer protocol. If the packet was fragmented (at the source or at routers), the network layer waits for all fragments, <b>reassembles</b> them and then delivers.</li>
  <li><b>Routers</b> may not decapsulate packets (unless they must fragment them) and may not change the source and destination addresses; they only inspect them to forward the packet. If a packet is fragmented, the header is copied to every fragment with a few changes.</li>
</ul>
<h3 id="c10-routing-fwd">Routing and forwarding: the two key functions</h3>
<div class="duo">
  <div class="card"><h4>Routing</h4><p>Determining the <b>route</b> taken by packets from source to destination. The internet is a combination of LANs, WANs and routers, so there are many possible routes; the network layer must find the best one. In the Internet this is done by running <b>routing protocols</b> that help routers coordinate their knowledge of the neighbourhood and build consistent tables. <i>Analogy: planning the whole trip.</i></p></div>
  <div class="card"><h4>Forwarding</h4><p>The action a router applies when a packet arrives at one of its interfaces: move it from the router's input to the <b>appropriate output</b>. The router takes one piece of header information, the <b>destination address</b> or a <b>label</b>, and looks up the output interface in its <b>forwarding table</b> (routing table). <i>Analogy: getting through a single interchange.</i></p></div>
</div>
<figure class="fig">
<svg viewBox="0 0 680 230" role="img" aria-label="A routing algorithm builds the local forwarding table; the router looks up the destination address of an arriving packet and sends it out on link 2">
  <defs><marker id="c10a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--ink-2)"/></marker><marker id="c10b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>
  <rect x="30" y="12" width="220" height="34" rx="6" style="fill:color-mix(in srgb, var(--net) 14%, var(--surface));stroke:var(--net)"/>
  <text x="140" y="34" text-anchor="middle" style="font-size:13px;font-weight:700">Routing algorithm</text>
  <line x1="140" y1="46" x2="140" y2="70" style="stroke:var(--ink-2);stroke-width:2" marker-end="url(#c10a)"/>
  <text x="150" y="63" style="font-size:10.5px;fill:var(--muted)">builds</text>
  <rect x="30" y="74" width="220" height="24" style="fill:var(--surface-2);stroke:var(--line-2)"/>
  <rect x="30" y="146" width="220" height="24" style="fill:color-mix(in srgb, var(--accent) 16%, var(--surface));stroke:var(--line-2)"/>
  <g style="fill:none;stroke:var(--line-2)"><rect x="30" y="98" width="220" height="24"/><rect x="30" y="122" width="220" height="24"/><rect x="30" y="170" width="220" height="24"/><line x1="165" y1="74" x2="165" y2="194"/></g>
  <text x="97" y="90" text-anchor="middle" style="font-size:11px;font-weight:700">Destination address</text><text x="207" y="90" text-anchor="middle" style="font-size:11px;font-weight:700">Output link</text>
  <g class="mono" style="font-size:11px"><text x="97" y="114" text-anchor="middle">address-range 1</text><text x="207" y="114" text-anchor="middle">3</text><text x="97" y="138" text-anchor="middle">address-range 2</text><text x="207" y="138" text-anchor="middle">2</text><text x="97" y="162" text-anchor="middle">address-range 3</text><text x="207" y="162" text-anchor="middle">2</text><text x="97" y="186" text-anchor="middle">address-range 4</text><text x="207" y="186" text-anchor="middle">1</text></g>
  <text x="140" y="214" text-anchor="middle" style="font-size:11px;fill:var(--muted)">Local forwarding table (in this router)</text>
  <rect x="290" y="102" width="112" height="36" rx="4" style="fill:color-mix(in srgb, var(--tl) 14%, var(--surface));stroke:var(--tl)"/>
  <text x="346" y="117" text-anchor="middle" style="font-size:10.5px;font-weight:600">arriving packet</text><text x="346" y="131" text-anchor="middle" class="mono" style="font-size:10px">dest in range 3</text>
  <line x1="402" y1="120" x2="442" y2="120" style="stroke:var(--ink-2);stroke-width:2" marker-end="url(#c10a)"/>
  <path d="M250 158 C 330 190, 430 180, 462 150" style="fill:none;stroke:var(--accent);stroke-width:1.6;stroke-dasharray:5 4"/>
  <text x="352" y="194" text-anchor="middle" style="font-size:10.5px;fill:var(--accent);font-weight:600">look up → link 2</text>
  <circle cx="480" cy="120" r="34" style="fill:var(--surface);stroke:var(--net);stroke-width:2.5"/>
  <text x="480" y="125" text-anchor="middle" style="font-size:12px;font-weight:700">Router</text>
  <line x1="506" y1="98" x2="596" y2="44" style="stroke:var(--ink-2);stroke-width:2"/><text x="604" y="44" style="font-size:11px">link 1</text>
  <line x1="514" y1="120" x2="600" y2="120" style="stroke:var(--accent);stroke-width:3.5" marker-end="url(#c10b)"/><text x="608" y="124" style="font-size:11px;font-weight:700;fill:var(--accent)">link 2</text>
  <line x1="506" y1="142" x2="596" y2="196" style="stroke:var(--ink-2);stroke-width:2"/><text x="604" y="200" style="font-size:11px">link 3</text>
</svg>
<figcaption>Routing builds the table; forwarding uses it for every arriving packet (after the Module 3 slides).</figcaption>
</figure>
<h3 id="c10-other">Other services</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Service</th><th>What the Internet's network layer does</th></tr></thead><tbody>
<tr><td><b>Error control</b></td><td>Not provided for the data, because a packet may be fragmented at each router, which makes error checking at this layer inefficient. A <b>checksum covers only the header</b>. The auxiliary protocol <b>ICMP</b> gives some error control when a datagram is discarded or has unknown header information.</td></tr>
<tr><td><b>Flow control</b></td><td>Not provided directly. Datagrams are sent when ready, without attention to the readiness of the receiver.</td></tr>
<tr><td><b>Congestion control</b></td><td>Congestion means too many datagrams in an area of the Internet. Routers may drop datagrams; the upper layers then resend duplicates, which can make it worse until the system collapses.</td></tr>
<tr><td><b>Quality of service</b></td><td>Increasingly important for real-time audio and video. To keep the network layer untouched, the provisions are mostly implemented in the upper layers.</td></tr>
<tr><td><b>Security</b></td><td>Not a concern in the original design. A virtual level called <b>IPSec</b> changes the connectionless service into a connection-oriented one to provide security.</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c10-switching">
<h2>Packet switching: datagram and virtual-circuit approaches</h2>
<p>A router is a switch that connects an input port to an output port. Only <b>packet switching</b> is used at the network layer, because the unit of data here is a packet (circuit switching is mostly a physical-layer idea). A message is divided into packets that are sent one by one; the destination waits for all packets of a message before delivering it. There are two approaches (compare <a href="#c1-packet">packet switching in Chapter 1</a>).</p>
<h3 id="c10-dgram">Datagram approach: connectionless service</h3>
<ul>
  <li>The network layer treats each packet <b>independently</b>; there is no relationship between packets of the same message. They may travel different paths and arrive out of order.</li>
  <li>The switches are called <b>routers</b>. A packet is routed using only the information in its header: the router uses the <b>destination address</b> to decide where it goes; the source address can be used to send an error message back if the packet is discarded.</li>
  <li>The Internet's network layer was designed this way to keep it simple.</li>
</ul>
<h3 id="c10-vcircuit">Virtual-circuit approach: connection-oriented service</h3>
<p>All packets of a message are related. A virtual connection is set up first, then all datagrams follow the same path. Besides the addresses, each packet carries a <b>flow label</b>, a <b>virtual-circuit identifier</b>, and is forwarded on that label.</p>
<figure class="fig">
<svg viewBox="0 0 700 220" role="img" aria-label="Virtual circuit from A to B through routers R1, R3 and R4; the label changes from 14 to 66 to 22 to 77">
  <g style="stroke:var(--ink-2);stroke-width:2"><line x1="70" y1="70" x2="162" y2="70"/><line x1="218" y1="70" x2="322" y2="70"/><line x1="378" y1="70" x2="482" y2="70"/><line x1="538" y1="70" x2="630" y2="70"/></g>
  <rect x="20" y="52" width="50" height="36" rx="4" style="fill:var(--surface-2);stroke:var(--ink-2)"/><text x="45" y="75" text-anchor="middle" style="font-size:14px;font-weight:700">A</text>
  <rect x="630" y="52" width="50" height="36" rx="4" style="fill:var(--surface-2);stroke:var(--ink-2)"/><text x="655" y="75" text-anchor="middle" style="font-size:14px;font-weight:700">B</text>
  <g style="fill:var(--surface);stroke:var(--net);stroke-width:2.5"><circle cx="190" cy="70" r="28"/><circle cx="350" cy="70" r="28"/><circle cx="510" cy="70" r="28"/></g>
  <g style="font-size:13px;font-weight:700" text-anchor="middle"><text x="190" y="75">R1</text><text x="350" y="75">R3</text><text x="510" y="75">R4</text></g>
  <g class="mono" style="font-size:10px;fill:var(--muted)"><text x="152" y="62">1</text><text x="222" y="62">3</text><text x="312" y="62">1</text><text x="382" y="62">3</text><text x="472" y="62">1</text><text x="542" y="62">4</text></g>
  <g><rect x="97" y="22" width="36" height="20" rx="10" style="fill:var(--accent)"/><rect x="252" y="22" width="36" height="20" rx="10" style="fill:var(--accent)"/><rect x="412" y="22" width="36" height="20" rx="10" style="fill:var(--accent)"/><rect x="566" y="22" width="36" height="20" rx="10" style="fill:var(--accent)"/></g>
  <g class="mono" style="font-size:12px;font-weight:700;fill:#fff" text-anchor="middle"><text x="115" y="36" style="fill:#fff">14</text><text x="270" y="36" style="fill:#fff">66</text><text x="430" y="36" style="fill:#fff">22</text><text x="584" y="36" style="fill:#fff">77</text></g>
  <g style="fill:none;stroke:var(--line-2)">
    <rect x="116" y="112" width="148" height="66"/><line x1="116" y1="130" x2="264" y2="130"/><line x1="116" y1="148" x2="264" y2="148"/><line x1="190" y1="112" x2="190" y2="178"/><line x1="153" y1="130" x2="153" y2="178"/><line x1="227" y1="130" x2="227" y2="178"/>
    <rect x="276" y="112" width="148" height="66"/><line x1="276" y1="130" x2="424" y2="130"/><line x1="276" y1="148" x2="424" y2="148"/><line x1="350" y1="112" x2="350" y2="178"/><line x1="313" y1="130" x2="313" y2="178"/><line x1="387" y1="130" x2="387" y2="178"/>
    <rect x="436" y="112" width="148" height="66"/><line x1="436" y1="130" x2="584" y2="130"/><line x1="436" y1="148" x2="584" y2="148"/><line x1="510" y1="112" x2="510" y2="178"/><line x1="473" y1="130" x2="473" y2="178"/><line x1="547" y1="130" x2="547" y2="178"/>
  </g>
  <g style="font-size:10px;font-weight:700" text-anchor="middle">
    <text x="153" y="125">Incoming</text><text x="227" y="125">Outgoing</text><text x="313" y="125">Incoming</text><text x="387" y="125">Outgoing</text><text x="473" y="125">Incoming</text><text x="547" y="125">Outgoing</text>
  </g>
  <g style="font-size:9.5px;fill:var(--muted)" text-anchor="middle">
    <text x="134" y="143">Port</text><text x="171" y="143">Label</text><text x="208" y="143">Port</text><text x="245" y="143">Label</text>
    <text x="294" y="143">Port</text><text x="331" y="143">Label</text><text x="368" y="143">Port</text><text x="405" y="143">Label</text>
    <text x="454" y="143">Port</text><text x="491" y="143">Label</text><text x="528" y="143">Port</text><text x="565" y="143">Label</text>
  </g>
  <g class="mono" style="font-size:12px;font-weight:600" text-anchor="middle">
    <text x="134" y="168">1</text><text x="171" y="168">14</text><text x="208" y="168">3</text><text x="245" y="168" style="fill:var(--accent)">66</text>
    <text x="294" y="168">1</text><text x="331" y="168">66</text><text x="368" y="168">3</text><text x="405" y="168" style="fill:var(--accent)">22</text>
    <text x="454" y="168">1</text><text x="491" y="168">22</text><text x="528" y="168">4</text><text x="565" y="168" style="fill:var(--accent)">77</text>
  </g>
  <text x="350" y="204" text-anchor="middle" style="font-size:11px;fill:var(--muted)">The request packet fills the first three columns; the acknowledgment fills the outgoing label (orange).</text>
</svg>
</figure>
<ol>
  <li><b>Setup phase.</b> A <b>request packet</b> carrying the source and destination addresses travels from A to B. Each router creates a table entry but can fill only three of the four columns: incoming port, an incoming label it chooses, and outgoing port (R1: 1, 14, 3; R3: 1, 66, 3; R4: 1, 22, 4). B, if ready, chooses label 77 for packets from A. Then an <b>acknowledgment packet</b> travels back: B sends 77 to R4, which uses it as its outgoing label; R4 sends its incoming label 22 to R3; R3 sends 66 to R1; R1 sends 14 to A.</li>
  <li><b>Data-transfer phase.</b> A sends every packet with label <b>14</b>. R1 changes it to 66, R3 to 22 and R4 delivers it with 77. All packets follow the same sequence of labels and arrive <b>in order</b>.</li>
  <li><b>Teardown phase.</b> After sending all packets, A sends a <b>teardown packet</b>; B responds with a <b>confirmation packet</b>; all routers delete the entry.</li>
</ol>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Datagram approach</th><th>Virtual-circuit approach</th></tr></thead><tbody>
<tr><td>Connectionless: no setup or teardown</td><td>Connection-oriented: setup, data transfer, teardown</td></tr>
<tr><td>Forwarding decision on the <b>destination address</b></td><td>Forwarding decision on the <b>label</b> (virtual-circuit identifier), which changes at every router</td></tr>
<tr><td>Packets of one message may take different paths and arrive out of order</td><td>All packets follow the same path and arrive in order</td></tr>
<tr><td>Routers keep no per-message state</td><td>Every router on the path keeps an entry for each virtual circuit</td></tr>
<tr><td>How the Internet (IP) was designed</td><td>The connection-oriented idea; IPv6's flow label lets IP work this way</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c10-ipv4">
<h2>IPv4 addresses</h2>
<p>The identifier used in the IP layer to identify the connection of each device to the Internet is the <b>Internet address</b> or <b>IP address</b>. An IPv4 address is a <b>32-bit</b> address that <b>uniquely and universally</b> defines the connection of a host or a router to the Internet.</p>
<ul>
  <li>It is the address of the <b>connection</b>, not of the host or router: if the device is moved to another network, its address may change.</li>
  <li><b>Unique</b>: each address defines one, and only one, connection. A device with two connections to the Internet (via two networks) has two IPv4 addresses.</li>
  <li><b>Universal</b>: the addressing system must be accepted by any host that wants to be connected to the Internet.</li>
</ul>
<div class="formula"><code class="f">Address space = 2<sup>b</sup> → IPv4: 2<sup>32</sup> = 4,294,967,296</code><span class="where">b = number of bits in an address. Without restrictions, more than four billion devices could be connected.</span></div>
<h3 id="c10-notation">Three notations</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Notation</th><th>Base</th><th>The same address</th></tr></thead><tbody>
<tr><td>Binary</td><td>2</td><td class="mono">10000000 00001011 00000011 00011111</td></tr>
<tr><td>Dotted-decimal</td><td>256</td><td class="mono">128.11.3.31</td></tr>
<tr><td>Hexadecimal</td><td>16</td><td class="mono">80 0B 03 1F (8 hex digits)</td></tr>
</tbody></table></div>
<p>In binary, a space is usually inserted between octets (bytes) for readability. In dotted-decimal, each byte is written in decimal, so each number is between <b>0 and 255</b>. Each hexadecimal digit is 4 bits; this form is often used in network programming.</p>
<h3 id="c10-hierarchy">Hierarchy in addressing</h3>
<p>Postal addresses (country, state, city, street, house) and telephone numbers (country code, area code, exchange, connection) are hierarchical. A 32-bit IPv4 address is hierarchical too, but has only <b>two parts</b>:</p>
<div class="flow"><span><b>Prefix</b> · n bits · defines the <b>network</b></span><i>+</i><span><b>Suffix</b> · 32 − n bits · defines the <b>node</b> (connection of a device)</span></div>
<p>A prefix can be <b>fixed length</b> (the original design, <b>classful addressing</b>, now obsolete) or <b>variable length</b> (<b>classless addressing</b>, used today).</p>
</section>

<section class="topic" id="c10-classful">
<h2>Classful addressing</h2>
<p>To accommodate both small and large networks, three fixed prefix lengths were designed instead of one (n = 8, 16 and 24), and the whole address space was divided into <b>five classes</b>.</p>
<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="Classful address layouts for classes A to E">
  <g style="font-size:10px;fill:var(--muted)" text-anchor="middle"><text x="164" y="14">byte 1</text><text x="292" y="14">byte 2</text><text x="420" y="14">byte 3</text><text x="548" y="14">byte 4</text></g>
  <g style="stroke:var(--line-2);stroke-dasharray:3 3"><line x1="228" y1="20" x2="228" y2="200"/><line x1="356" y1="20" x2="356" y2="200"/><line x1="484" y1="20" x2="484" y2="200"/></g>
  <g style="font-size:12px;font-weight:700"><text x="10" y="42">Class A</text><text x="10" y="78">Class B</text><text x="10" y="114">Class C</text><text x="10" y="150">Class D</text><text x="10" y="186">Class E</text></g>
  <g style="stroke:var(--ink-2);stroke-width:1">
    <rect x="100" y="24" width="16" height="26" style="fill:var(--accent)"/><rect x="116" y="24" width="112" height="26" style="fill:color-mix(in srgb, var(--net) 22%, var(--surface))"/><rect x="228" y="24" width="384" height="26" style="fill:color-mix(in srgb, var(--dll) 14%, var(--surface))"/>
    <rect x="100" y="60" width="32" height="26" style="fill:var(--accent)"/><rect x="132" y="60" width="224" height="26" style="fill:color-mix(in srgb, var(--net) 22%, var(--surface))"/><rect x="356" y="60" width="256" height="26" style="fill:color-mix(in srgb, var(--dll) 14%, var(--surface))"/>
    <rect x="100" y="96" width="48" height="26" style="fill:var(--accent)"/><rect x="148" y="96" width="336" height="26" style="fill:color-mix(in srgb, var(--net) 22%, var(--surface))"/><rect x="484" y="96" width="128" height="26" style="fill:color-mix(in srgb, var(--dll) 14%, var(--surface))"/>
    <rect x="100" y="132" width="64" height="26" style="fill:var(--accent)"/><rect x="164" y="132" width="448" height="26" style="fill:color-mix(in srgb, var(--app) 14%, var(--surface))"/>
    <rect x="100" y="168" width="64" height="26" style="fill:var(--accent)"/><rect x="164" y="168" width="448" height="26" style="fill:var(--surface-2)"/>
  </g>
  <g class="mono" style="font-size:11px;font-weight:700;fill:#fff" text-anchor="middle"><text x="108" y="41" style="fill:#fff">0</text><text x="116" y="77" style="fill:#fff">10</text><text x="124" y="113" style="fill:#fff">110</text><text x="132" y="149" style="fill:#fff">1110</text><text x="132" y="185" style="fill:#fff">1111</text></g>
  <g style="font-size:11px" text-anchor="middle">
    <text x="172" y="41">Prefix: 7 bits</text><text x="420" y="41">Suffix (host): 24 bits</text>
    <text x="244" y="77">Prefix: 14 bits</text><text x="484" y="77">Suffix: 16 bits</text>
    <text x="316" y="113">Prefix: 21 bits</text><text x="548" y="113">Suffix: 8 bits</text>
    <text x="388" y="149">Multicast addresses (not divided)</text>
    <text x="388" y="185">Reserved for future use (not divided)</text>
  </g>
</svg>
<figcaption>The orange class bits are part of the prefix: A has n = 8, B n = 16, C n = 24.</figcaption>
</figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Class</th><th>First bits</th><th>First byte</th><th class="num">Prefix n</th><th>Networks</th><th>Addresses per network</th><th>Default mask</th></tr></thead><tbody>
<tr><td><b>A</b></td><td class="mono">0</td><td>0–127</td><td class="num">8</td><td>2<sup>7</sup> = 128</td><td>2<sup>24</sup> = 16,777,216</td><td class="mono">255.0.0.0</td></tr>
<tr><td><b>B</b></td><td class="mono">10</td><td>128–191</td><td class="num">16</td><td>2<sup>14</sup> = 16,384</td><td>2<sup>16</sup> = 65,536</td><td class="mono">255.255.0.0</td></tr>
<tr><td><b>C</b></td><td class="mono">110</td><td>192–223</td><td class="num">24</td><td>2<sup>21</sup> = 2,097,152</td><td>2<sup>8</sup> = 256</td><td class="mono">255.255.255.0</td></tr>
<tr><td><b>D</b></td><td class="mono">1110</td><td>224–239</td><td class="num">–</td><td colspan="2">Not divided into prefix and suffix: <b>multicast</b></td><td>–</td></tr>
<tr><td><b>E</b></td><td class="mono">1111</td><td>240–255</td><td class="num">–</td><td colspan="2">Not divided: <b>reserved</b></td><td>–</td></tr>
</tbody></table></div>
<div class="note remember"><b class="tag">Why 2<sup>7</sup>, 2<sup>14</sup>, 2<sup>21</sup>?</b><p>The class bits are part of the prefix. Class A's prefix is 8 bits, but the first bit (0) defines the class, leaving 7 bits for the network identifier. Class B: 16 − 2 = 14 bits. Class C: 24 − 3 = 21 bits.</p></div>
<div class="note tip"><b class="tag">From the lab notes</b><p>Only classes A, B and C are used practically for hosts. In class A, networks 0 and 127 are not used (127 is the loopback block). The default mask has 1s in the network bits and 0s in the host bits: 255.0.0.0, 255.255.0.0, 255.255.255.0.</p></div>
<h3 id="c10-depletion">Address depletion</h3>
<p>Classful addressing became obsolete because of <b>address exhaustion</b>:</p>
<ul>
  <li><b>Class A</b> can be assigned to only 128 organizations, each getting a single network with 16,777,216 nodes. Few organizations are that large, so most of these addresses were <b>wasted</b>.</li>
  <li><b>Class B</b> was designed for midsize organizations, but many of its addresses also remained unused.</li>
  <li><b>Class C</b> has the opposite flaw: 256 addresses per network is so small that most companies were not comfortable with it.</li>
  <li><b>Class E</b> was almost never used, wasting the whole class.</li>
</ul>
<h3 id="c10-subsuper">Subnetting and supernetting</h3>
<p>Two strategies were tried. In <b>subnetting</b>, a class A or B block is divided into several subnets, each with a <b>larger prefix</b> than the original network (a class A network divided into four subnets gives n<sub>sub</sub> = 10); unused addresses can also be shared among organizations. <b>Supernetting</b> combined several class C blocks into a larger block for organizations needing more than 256 addresses, but it made routing more difficult. Neither really solved the problem.</p>
<div class="note def"><b class="tag">Advantage of classful addressing</b><p>Given an address, we can find its class and, since each class has a fixed prefix length, the prefix length immediately. The prefix length is <b>inherent in the address</b>; no extra information is needed.</p></div>
<div class="example"><p class="ex-q"><span class="chip hot">IA-1 Q7b</span> Find the class of 201.20.31.65, 126.11.11.239, 193.14.56.22 and 130.34.54.12.</p><ol class="steps">
  <li>Look only at the first byte (or its leading bits)</li>
  <li>201 = <span class="mono">11001001</span> → starts 110 → <b>class C</b></li>
  <li>126 = <span class="mono">01111110</span> → starts 0 → <b>class A</b></li>
  <li>193 = <span class="mono">11000001</span> → starts 110 → <b>class C</b></li>
  <li>130 = <span class="mono">10000010</span> → starts 10 → <b>class B</b></li>
</ol><p class="ex-a">C · A · C · B (ranges: A 0–127, B 128–191, C 192–223, D 224–239, E 240–255)</p></div>
</section>

<section class="topic" id="c10-classless">
<h2>Classless addressing (CIDR)</h2>
<p>Subnetting and supernetting did not solve depletion. The long-term solution, a larger address space, is <b>IPv6</b>. The short-term solution, announced by the Internet authorities in <b>1996</b>, still uses IPv4 addresses: <b>classless addressing</b>. Variable-length blocks that belong to no class are used: a block of 1, 2, 4, 128 … addresses.</p>
<ul>
  <li>The whole address space is divided into <b>non-overlapping, variable-length blocks</b>. The prefix defines the block (network); the suffix defines the node. In theory blocks can have 2<sup>0</sup>, 2<sup>1</sup>, …, 2<sup>32</sup> addresses.</li>
  <li>Restriction: the number of addresses in a block must be a <b>power of 2</b>. An organization is granted one block.</li>
  <li>The prefix length ranges from 0 to 32. The size of the network is <b>inversely proportional to the prefix length</b>: a small prefix means a larger network.</li>
</ul>
<h3 id="c10-slash">Slash notation</h3>
<p>The prefix length is not inherent in the address, so it is given separately after a slash: <span class="mono">byte.byte.byte.byte/n</span>. This is informally called <b>slash notation</b> and formally <b>classless interdomain routing (CIDR)</b>, pronounced "cider". Examples: <span class="mono">12.24.76.8/8</span>, <span class="mono">23.14.67.92/12</span>, <span class="mono">220.8.24.255/25</span>.</p>
<h3 id="c10-extract">Extracting information from an address</h3>
<p>Given any address in a block and n, we want three things: the number of addresses, the first address and the last address.</p>
<div class="fgrid">
  <div class="formula"><code class="f">N = 2<sup>32 − n</sup></code><span class="where">Number of addresses in the block</span></div>
  <div class="formula"><code class="f">First: keep n left bits, set the rest to 0s</code><span class="where">This is the network address</span></div>
  <div class="formula"><code class="f">Last: keep n left bits, set the rest to 1s</code><span class="where">The last address of the block</span></div>
</div>
<div class="example"><p class="ex-q">A classless address is given as 167.199.170.82/27. Find the number of addresses, the first address and the last address.</p><ol class="steps">
  <li>N = 2<sup>32 − 27</sup> = 2<sup>5</sup> = <b>32</b> addresses</li>
  <li>27 = 8 + 8 + 8 + 3, so only the last byte is split: 82 = <span class="mono">010|10010</span></li>
  <li>First: <span class="mono">010|00000</span> = 64 → <b>167.199.170.64/27</b></li>
  <li>Last: <span class="mono">010|11111</span> = 95 → <b>167.199.170.95/27</b></li>
</ol><p class="ex-a">32 addresses, from 167.199.170.64/27 to 167.199.170.95/27</p></div>
<h3 id="c10-mask">Address mask</h3>
<p>The <b>address mask</b> is a 32-bit number with the <b>n leftmost bits set to 1</b> and the remaining 32 − n bits set to 0. It is the complement of (2<sup>32 − n</sup> − 1). A program can extract the block information with the bitwise operations NOT, AND and OR:</p>
<div class="fgrid">
  <div class="formula"><code class="f">N = NOT(mask) + 1</code></div>
  <div class="formula"><code class="f">First = (any address) AND mask</code></div>
  <div class="formula"><code class="f">Last = (any address) OR NOT(mask)</code></div>
</div>
<div class="example"><p class="ex-q">Repeat the /27 example using the mask.</p><ol class="steps">
  <li>Mask /27 = <span class="mono">11111111 11111111 11111111 11100000</span> = <b>255.255.255.224</b>; NOT(mask) = 0.0.0.31</li>
  <li>N = 31 + 1 = <b>32</b></li>
  <li>First = 167.199.170.82 AND 255.255.255.224: last byte 82 AND 224 = <span class="mono">01010010 AND 11100000 = 01000000</span> = 64</li>
  <li>Last = 167.199.170.82 OR 0.0.0.31: last byte 82 OR 31 = <span class="mono">01011111</span> = 95</li>
</ol><p class="ex-a">The operations can be applied byte by byte: 167.199.170.64 and 167.199.170.95</p></div>
<div class="note warn"><b class="tag">Heads-up</b><p>The complete notes print this mask as "256.256.256.224". A byte can never exceed 255: the mask is <b>255.255.255.224</b>.</p></div>
<h3 id="c10-netaddr">Network address</h3>
<p>The first address, the <b>network address</b>, is particularly important: it is the identifier of the network and is used to route a packet to its destination network. When a packet arrives at a router with m interfaces, the router finds the network address of the destination and consults its forwarding table to find the interface from which to send the packet. Inside the destination network, another strategy delivers it to the host.</p>
<h3 id="c10-alloc">Block allocation</h3>
<p>The ultimate responsibility for allocating blocks belongs to <b>ICANN</b> (Internet Corporation for Assigned Names and Numbers). ICANN normally assigns a large block to an ISP (or to a large organization treated as an ISP), not to individual users. Two restrictions make CIDR work:</p>
<ol>
  <li>The number of requested addresses N must be a <b>power of 2</b>, because n = 32 − log<sub>2</sub>N must be an integer.</li>
  <li>The block must lie where enough contiguous addresses are free, and its <b>first address must be divisible by N</b>: first address = (prefix in decimal) × 2<sup>32 − n</sup> = (prefix in decimal) × N.</li>
</ol>
<div class="example"><p class="ex-q">An ISP requests a block of 1000 addresses. What is granted?</p><ol class="steps">
  <li>1000 is not a power of 2, so <b>1024</b> addresses are granted</li>
  <li>n = 32 − log<sub>2</sub>1024 = 32 − 10 = <b>22</b></li>
  <li>An available block 18.14.12.0/22 is granted. Its first address in decimal is 18 × 2<sup>24</sup> + 14 × 2<sup>16</sup> + 12 × 2<sup>8</sup> = 302,910,464 = 1024 × 295,811, which is divisible by 1024 ✓</li>
</ol><p class="ex-a">18.14.12.0/22, covering 18.14.12.0 to 18.14.15.255</p></div>
</section>

<section class="topic" id="c10-subnet">
<h2>Subnetting and address aggregation</h2>
<p>More levels of hierarchy are created with <b>subnetting</b>. An organization (or ISP) granted a range of addresses divides it into subranges and assigns each to a <b>subnetwork (subnet)</b>. Nothing stops further levels: a subnet can be divided into sub-subnets, and so on.</p>
<h3 id="c10-design">Designing subnets</h3>
<p>With N addresses and prefix n granted to the organization, and N<sub>sub</sub> addresses with prefix n<sub>sub</sub> for each subnet, three rules guarantee correct routing:</p>
<ol>
  <li>The number of addresses in each subnet must be a <b>power of 2</b>.</li>
  <li>The prefix length of each subnet is <b>n<sub>sub</sub> = 32 − log<sub>2</sub>N<sub>sub</sub></b>.</li>
  <li>The starting address of each subnet must be <b>divisible by the number of addresses in it</b>. This is achieved by assigning addresses to the <b>larger subnets first</b>.</li>
</ol>
<p>Then the first and last address of each subnet are found exactly as for any block.</p>
<div class="note tip"><b class="tag">Why subnet? (lab notes)</b><p>Maintenance is easier, broadcast volume and network traffic are reduced, and one network is protected from another: for example, the MCA department network cannot be accessed from the CS department network.</p></div>
<div class="example"><p class="ex-q">Lab example: divide 200.1.2.0/24 into (a) 2 subnets and (b) 4 subnets.</p><ol class="steps">
  <li>(a) Borrow 1 host bit → /25, mask 255.255.255.128, 2<sup>7</sup> = 128 addresses each, 128 − 2 = 126 hosts</li>
  <li>Subnet 1: network 200.1.2.0, hosts 200.1.2.1 – 200.1.2.126, broadcast 200.1.2.127</li>
  <li>Subnet 2: network 200.1.2.128, hosts 200.1.2.129 – 200.1.2.254, broadcast 200.1.2.255</li>
  <li>(b) Borrow 2 bits → /26, mask 255.255.255.192, 2<sup>6</sup> = 64 addresses, 62 hosts each</li>
  <li>Networks 200.1.2.0, .64, .128, .192; host ranges .1–.62, .65–.126, .129–.190, .193–.254; broadcasts .63, .127, .191, .255</li>
</ol><p class="ex-a">Hosts per subnet = 2<sup>host bits</sup> − 2: the network address and the broadcast address are not given to hosts</p></div>
<div class="example"><p class="ex-q">Design practice: an organization is granted 14.24.74.0/24 and needs three subnets with 120, 60 and 10 addresses. Design the subblocks.</p><ol class="steps">
  <li>N = 2<sup>32 − 24</sup> = 256. Round each need up to a power of 2 and assign the <b>largest first</b></li>
  <li>120 → 128 addresses, n<sub>sub</sub> = 32 − 7 = 25: <b>14.24.74.0/25 – 14.24.74.127/25</b></li>
  <li>60 → 64 addresses, n<sub>sub</sub> = 32 − 6 = 26: <b>14.24.74.128/26 – 14.24.74.191/26</b></li>
  <li>10 → 16 addresses, n<sub>sub</sub> = 32 − 4 = 28: <b>14.24.74.192/28 – 14.24.74.207/28</b></li>
  <li>128 + 64 + 16 = 208 addresses used; 14.24.74.208 – 14.24.74.255 (48 addresses) are reserved for the future</li>
</ol><p class="ex-a">Each start (0, 128, 192) is divisible by its block size (128, 64, 16), as rule 3 requires</p></div>
<figure class="lab" data-widget="ipv4"><figcaption><span class="ttl">IPv4 address lab: class, block, mask and subnets</span><span class="cap">Type any address, with or without /n. You get the class, the mask, the first and last address with the AND/OR working, and an equal split into subnets. The first button solves IA-1 Q7b.</span></figcaption></figure>
<h3 id="c10-aggregation">Address aggregation</h3>
<p>One advantage of CIDR is <b>address aggregation</b> (also called <b>address summarization</b> or <b>route summarization</b>). When blocks are combined into a larger block, routing can be done on the prefix of the larger block. ICANN assigns a large block to an ISP; the ISP divides it into smaller subblocks for its customers but advertises just the one large block to the rest of the Internet.</p>
<div class="example"><p class="ex-q">An ISP has given four organizations 160.70.14.0/26, 160.70.14.64/26, 160.70.14.128/26 and 160.70.14.192/26. What single block does it advertise?</p><ol class="steps">
  <li>The four /26 blocks are contiguous and cover 160.70.14.0 to 160.70.14.255</li>
  <li>4 × 64 = 256 = 2<sup>8</sup> addresses → prefix 32 − 8 = 24</li>
</ol><p class="ex-a">One route, 160.70.14.0/24: every packet for any of the four organizations is sent to the ISP, which forwards it inside</p></div>
</section>

<section class="topic" id="c10-special">
<h2>Special addresses; public and private</h2>
<p>Five kinds of special address are used for special purposes:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Special address</th><th>Block</th><th>Use</th></tr></thead><tbody>
<tr><td><b>This-host</b></td><td class="mono">0.0.0.0/32</td><td>Used as the source by a host that needs to send a datagram but does not know its own address (e.g. the first DHCP message).</td></tr>
<tr><td><b>Limited broadcast</b></td><td class="mono">255.255.255.255/32</td><td>Sends a datagram to all devices in a network. Routers block it, so it cannot travel outside the network.</td></tr>
<tr><td><b>Loopback</b></td><td class="mono">127.0.0.0/8</td><td>A packet with this destination never leaves the host. Used to test software, e.g. a client and a server program on the same machine; <span class="mono">ping 127.0.0.1</span> tests the local stack.</td></tr>
<tr><td><b>Private</b></td><td class="mono">10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16 · 169.254.0.0/16</td><td>Used inside organizations and reusable in other networks; not routed on the global Internet (they reach it through NAT).</td></tr>
<tr><td><b>Multicast</b></td><td class="mono">224.0.0.0/4</td><td>Reserved for multicast addresses (the old class D).</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>Public IP</h4><ul><li>Accessed directly over the Internet</li><li>Assigned and controlled by your ISP</li><li>Cannot be reused by other devices</li><li>Any IP not in the reserved private ranges</li></ul></div>
  <div class="card"><h4>Private IP</h4><ul><li>Identifies a device on the local network</li><li>Assigned by the admin or your network router</li><li>Can be reused by devices in other networks</li><li>10.0.0.0–10.255.255.255 · 172.16.0.0–172.31.255.255 · 192.168.0.0–192.168.255.255</li></ul></div>
</div>
</section>

<section class="topic" id="c10-dhcp">
<h2>Dynamic Host Configuration Protocol (DHCP)</h2>
<p>Once an organization has a block (from ICANN or an ISP), addresses can be assigned to hosts and routers manually, or automatically with <b>DHCP</b>. DHCP is an <b>application-layer program</b> using the <b>client-server</b> paradigm that actually helps TCP/IP at the network layer. It is so widely used that it is called a <b>plug-and-play protocol</b>.</p>
<ul>
  <li>A network manager can configure DHCP to assign <b>permanent</b> IP addresses to hosts and routers, or <b>temporary, on-demand</b> addresses.</li>
  <li>Temporary addresses let a traveller connect a laptop to the Internet from a hotel, and let an ISP with 1000 granted addresses serve 4000 households, assuming no more than a quarter are online at the same time.</li>
</ul>
<div class="note remember"><b class="tag">Four pieces of information</b><p>A computer needs its <b>IP address</b>, the <b>network prefix</b> (address mask), the address of a <b>router</b> and the IP address of a <b>name server</b>. DHCP can provide all of them.</p></div>
<h3 id="c10-dhcp-format">Message format</h3>
<figure class="lab" data-widget="header" data-spec="dhcp"><figcaption><span class="ttl">DHCP message: tap any field</span><span class="cap">The last four fields are larger than one row; their real sizes are printed on them.</span></figcaption></figure>
<p>The 64-byte <b>options</b> field has a dual purpose: additional information or vendor-specific information. The server puts a <b>magic cookie</b> in the format of an IP address, <span class="mono">99.130.83.99</span>; when the client finds it, the next 60 bytes are options. An option has three fields: a 1-byte <b>tag</b>, a 1-byte <b>length</b> and a variable-length <b>value</b>. If the tag is <b>53</b>, the value is one of eight message types:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Value</th><th>Message type</th><th class="num">Value</th><th>Message type</th></tr></thead><tbody>
<tr><td class="num">1</td><td>DHCPDISCOVER</td><td class="num">5</td><td>DHCPACK</td></tr>
<tr><td class="num">2</td><td>DHCPOFFER</td><td class="num">6</td><td>DHCPNACK</td></tr>
<tr><td class="num">3</td><td>DHCPREQUEST</td><td class="num">7</td><td>DHCPRELEASE</td></tr>
<tr><td class="num">4</td><td>DHCPDECLINE</td><td class="num">8</td><td>DHCPINFORM</td></tr>
</tbody></table></div>
<div class="note warn"><b class="tag">Heads-up</b><p>The complete notes say the tag field is "11-byte". It is a <b>1-byte</b> tag, followed by a 1-byte length and the value.</p></div>
<h3 id="c10-dhcp-op">Operation</h3>
<figure class="lab" data-widget="seq" data-spec="dhcp"><figcaption><span class="ttl">DHCP in four messages</span><span class="cap">Step through DISCOVER, OFFER, REQUEST and ACK; tap Next to read what each message carries.</span></figcaption></figure>
<ol>
  <li>The joining host creates a <b>DHCPDISCOVER</b> message in which only the transaction ID is set (to a random number). It is put in a UDP user datagram with source port <b>68</b> and destination port <b>67</b>, inside an IP datagram from <b>0.0.0.0</b> ("this host") to <b>255.255.255.255</b> (broadcast): the host knows neither its own address nor the server's.</li>
  <li>The server or servers respond with <b>DHCPOFFER</b>: the <i>your address</i> field holds the offered IP address and the <i>server address</i> field the server's IP. The datagram's source is the server, but its destination is broadcast, so other DHCP servers can see it and make a better offer.</li>
  <li>The host receives one or more offers, selects the best and sends <b>DHCPREQUEST</b> to that server, with the known fields filled in and the same port numbers.</li>
  <li>The selected server responds with <b>DHCPACK</b> if the offered address is valid. If it cannot keep its offer it sends <b>DHCPNACK</b> and the client repeats the process. This message is also broadcast, so other servers learn whether the request was accepted.</li>
</ol>
<div class="duo">
  <div class="card"><h4>Two well-known ports</h4><p>DHCP uses well-known ports for both sides (68 and 67) instead of one well-known and one ephemeral port, because the server's response is <b>broadcast</b>. If two clients run at once (after a power failure and restoration), the <b>transaction ID</b> separates their responses.</p></div>
  <div class="card"><h4>Using FTP</h4><p>The server does not send everything. In the DHCPACK it gives the pathname of a file holding the complete information (such as the DNS server address); the client fetches it with a file transfer protocol.</p></div>
  <div class="card"><h4>Error control</h4><p>DHCP runs over unreliable UDP. It therefore (1) requires UDP to use the <b>checksum</b> (optional in UDP), and (2) the client uses <b>timers and a retransmission policy</b> if no reply arrives.</p></div>
</div>
<h3 id="c10-dhcp-fsm">Transition states</h3>
<figure class="fig">
<svg viewBox="0 0 660 270" role="img" aria-label="DHCP client state diagram: INIT, SELECTING, REQUESTING, BOUND, RENEWING and REBINDING">
  <defs><marker id="c10d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--ink-2)"/></marker></defs>
  <g style="stroke-width:2">
    <rect x="30" y="40" width="110" height="36" rx="18" style="fill:var(--surface);stroke:var(--ink-2)"/>
    <rect x="265" y="40" width="110" height="36" rx="18" style="fill:var(--surface);stroke:var(--ink-2)"/>
    <rect x="500" y="40" width="110" height="36" rx="18" style="fill:var(--surface);stroke:var(--ink-2)"/>
    <rect x="30" y="170" width="110" height="36" rx="18" style="fill:color-mix(in srgb, var(--dll) 16%, var(--surface));stroke:var(--dll)"/>
    <rect x="265" y="170" width="110" height="36" rx="18" style="fill:color-mix(in srgb, var(--dll) 16%, var(--surface));stroke:var(--dll)"/>
    <rect x="500" y="170" width="110" height="36" rx="18" style="fill:color-mix(in srgb, var(--dll) 24%, var(--surface));stroke:var(--dll)"/>
  </g>
  <g class="mono" style="font-size:12px;font-weight:700" text-anchor="middle"><text x="85" y="63">INIT</text><text x="320" y="63">SELECTING</text><text x="555" y="63">REQUESTING</text><text x="85" y="193">REBINDING</text><text x="320" y="193">RENEWING</text><text x="555" y="193">BOUND</text></g>
  <g style="fill:none;stroke:var(--ink-2);stroke-width:1.6">
    <line x1="140" y1="58" x2="262" y2="58" marker-end="url(#c10d)"/>
    <path d="M305 40 C 295 6, 345 6, 335 38" marker-end="url(#c10d)"/>
    <line x1="375" y1="58" x2="497" y2="58" marker-end="url(#c10d)"/>
    <line x1="555" y1="76" x2="555" y2="167" marker-end="url(#c10d)"/>
    <line x1="500" y1="180" x2="378" y2="180" marker-end="url(#c10d)"/>
    <line x1="375" y1="198" x2="497" y2="198" marker-end="url(#c10d)"/>
    <line x1="265" y1="180" x2="143" y2="180" marker-end="url(#c10d)"/>
    <line x1="85" y1="170" x2="85" y2="79" marker-end="url(#c10d)"/>
    <path d="M85 206 C 85 262, 555 262, 555 209" marker-end="url(#c10d)"/>
  </g>
  <g style="font-size:10px">
    <text x="201" y="50" text-anchor="middle">DHCPDISCOVER</text>
    <text x="320" y="12" text-anchor="middle">DHCPOFFER (more offers)</text>
    <text x="436" y="38" text-anchor="middle">select offer /</text><text x="436" y="50" text-anchor="middle">DHCPREQUEST</text>
    <text x="562" y="126">DHCPACK</text>
    <text x="439" y="162" text-anchor="middle">lease 50% expired /</text><text x="439" y="174" text-anchor="middle">DHCPREQUEST</text>
    <text x="436" y="214" text-anchor="middle">DHCPACK</text>
    <text x="204" y="162" text-anchor="middle">lease 75% expired /</text><text x="204" y="174" text-anchor="middle">DHCPREQUEST</text>
    <text x="92" y="118">lease expired</text><text x="92" y="130">or DHCPNACK</text>
    <text x="320" y="254" text-anchor="middle">DHCPACK (lease renewed)</text>
  </g>
</svg>
<figcaption>Green states: the client may use its IP address only in BOUND, RENEWING or REBINDING.</figcaption>
</figure>
<ul>
  <li>The client starts in <b>INIT</b> and broadcasts a discover message.</li>
  <li>When it receives an offer it moves to <b>SELECTING</b>, where it may receive more offers.</li>
  <li>After selecting an offer it sends a request and moves to <b>REQUESTING</b>. If an ACK arrives it moves to <b>BOUND</b> and uses the IP address.</li>
  <li>When the lease is <b>50% expired</b> it tries to renew it in <b>RENEWING</b>; if the server renews the lease, it returns to BOUND.</li>
  <li>If the lease is not renewed and is <b>75% expired</b>, it moves to <b>REBINDING</b>. An ACK takes it back to BOUND; otherwise it goes to INIT and requests another IP address.</li>
</ul>
<div class="fgrid">
  <div class="formula"><code class="f">Renewal timer = 50% of lease</code></div>
  <div class="formula"><code class="f">Rebinding timer = 75% of lease</code></div>
  <div class="formula"><code class="f">Expiration timer = lease time</code></div>
</div>
</section>

<section class="topic" id="c10-nat">
<h2>Network Address Translation (NAT)</h2>
<p>NAT is a technology that provides the <b>mapping between private and universal (global) addresses</b> and at the same time supports virtual private networks. A site uses a set of private addresses for internal communication and a set of global addresses (at least one) for communication with the rest of the world. The site must have only <b>one connection to the global Internet</b>, through a <b>NAT-capable router</b> that runs NAT software.</p>
<ul>
  <li>The router has one private address and one global address, e.g. <span class="mono">200.24.5.8</span>. The private network is <b>invisible</b> to the rest of the Internet, which sees only the NAT router.</li>
  <li><b>Outgoing</b> packets: the NAT router replaces the <b>source address</b> with the global NAT address.</li>
  <li><b>Incoming</b> packets: it replaces the <b>destination address</b> (its own global address) with the appropriate private address.</li>
</ul>
<h3 id="c10-nat-table">Translation table</h3>
<p>Translating the source of outgoing packets is straightforward. But how does the router know the private destination of a packet coming from the Internet? It keeps a <b>translation table</b>, in one of three forms:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Strategy</th><th>How it works</th><th>Limitation</th></tr></thead><tbody>
<tr><td><b>Using one IP address</b></td><td>Two columns: private address and external address (the packet's destination). When the response returns, its source address (the external address) is used to find the private address.</td><td>Communication must always be <b>initiated by the private network</b>, and only one private host can access a given external host at a time.</td></tr>
<tr><td><b>Using a pool of IP addresses</b></td><td>The router uses several global addresses, e.g. 200.24.5.8, 200.24.5.9, 200.24.5.10 and 200.24.5.11.</td><td>Four private hosts can talk to the same external host at once (each pair of addresses is a separate connection), but no more.</td></tr>
<tr><td><b>Using IP and port addresses</b></td><td>Five columns: private address, private port, external address, external port, transport protocol.</td><td>Allows a <b>many-to-many</b> relationship between private hosts and external server programs.</td></tr>
</tbody></table></div>
<p class="small muted">Five-column table when hosts 172.18.3.1 and 172.18.3.2 both access the HTTP server on external host 25.8.3.2:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Private address</th><th>Private port</th><th>External address</th><th>External port</th><th>Transport protocol</th></tr></thead><tbody>
<tr><td class="mono">172.18.3.1</td><td class="mono">1400</td><td class="mono">25.8.3.2</td><td class="mono">80</td><td>TCP</td></tr>
<tr><td class="mono">172.18.3.2</td><td class="mono">1401</td><td class="mono">25.8.3.2</td><td class="mono">80</td><td>TCP</td></tr>
</tbody></table></div>
<figure class="lab lab-3d" data-scene="journey" data-mode="nat" data-lock="1"><figcaption><span class="ttl">Watch NAT rewrite the addresses</span><span class="cap">Two private hosts reach one web server through a single global address. The translation table fills in below the scene.</span></figcaption></figure>
</section>

<section class="topic" id="c10-datagram">
<h2>The IPv4 datagram</h2>
<p>IPv4 is responsible for packetizing, forwarding and delivery of a packet at the network layer. Its packet, the <b>datagram</b>, is a variable-length packet of two parts: a <b>header</b> of <b>20 to 60 bytes</b>, which contains the information essential to routing and delivery, and the <b>payload</b> (data). It is customary in TCP/IP to show the header in 4-byte rows.</p>
<figure class="lab" data-widget="header" data-spec="ipv4"><figcaption><span class="ttl">IPv4 header: tap any field</span><span class="cap">Five fixed rows make the 20-byte minimum; options add up to 40 bytes.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Field</th><th>Size</th><th>Purpose</th></tr></thead><tbody>
<tr><td>Version (VER)</td><td>4 bits</td><td>Version of the protocol; value 4.</td></tr>
<tr><td>Header length (HLEN)</td><td>4 bits</td><td>Total header length in <b>4-byte words</b> (so it fits in 4 bits). The receiver multiplies it by 4: 5 → 20 bytes, 15 → 60 bytes.</td></tr>
<tr><td>Service type</td><td>8 bits</td><td>Originally type of service (TOS), how the datagram should be handled. In the late 1990s the IETF redefined it for <b>differentiated services</b> (DiffServ).</td></tr>
<tr><td>Total length</td><td>16 bits</td><td>Header plus data in bytes, at most 65,535. Tells the receiver when the packet has completely arrived.</td></tr>
<tr><td>Identification · Flags · Fragmentation offset</td><td>16 · 3 · 13 bits</td><td>Used when a datagram is larger than the underlying network can carry (next section).</td></tr>
<tr><td>Time-to-live (TTL)</td><td>8 bits</td><td>Controls the maximum number of hops (routers) visited. The source stores a number (about twice the maximum number of routers between any two hosts); each router decrements it and <b>discards</b> the datagram if it becomes 0. Stops datagrams circulating forever when routing malfunctions.</td></tr>
<tr><td>Protocol</td><td>8 bits</td><td>A unique number for the protocol whose packet is carried, so the destination knows where to deliver the payload: ICMP 1, IGMP 2, TCP 6, UDP 17, OSPF 89.</td></tr>
<tr><td>Header checksum</td><td>16 bits</td><td>Checks the <b>header only</b> (1s-complement sum, then complemented). IP leaves checking the payload to its owner, such as TCP or UDP. Header errors are disasters: a corrupted destination address delivers to the wrong host, a corrupted protocol field to the wrong protocol, corrupted fragmentation fields break reassembly.</td></tr>
<tr><td>Source and destination addresses</td><td>32 + 32 bits</td><td>Must stay <b>unchanged</b> from source to destination. The destination address is known by the protocol using IP or provided by DNS.</td></tr>
<tr><td>Options</td><td>0–40 bytes</td><td>For network testing and debugging. Not required in every header, but every IP implementation must be able to handle them. Some options are changed by routers, which forces the checksum to be recalculated.</td></tr>
<tr><td>Payload</td><td>variable</td><td>The packet from the protocol using IP: the contents of the parcel; the header is only the information written on it.</td></tr>
</tbody></table></div>
<div class="formula"><code class="f">Length of data = total length − (HLEN × 4)</code><span class="where">Header length in bytes = HLEN × 4, between 20 and 60</span></div>
<div class="example"><p class="ex-q">(a) An IPv4 packet arrives with the first 8 bits 01000010. The receiver discards it. Why? (b) HLEN is 1000 in binary: how many bytes of options? (c) HLEN = 5 and total length = 0x0028: how many bytes of data?</p><ol class="steps">
  <li>(a) VER = 0100 = 4 is correct, but HLEN = 0010 = 2 → 2 × 4 = 8 bytes. The minimum header is 20 bytes, so the packet has been corrupted.</li>
  <li>(b) HLEN = 8 → header = 8 × 4 = 32 bytes. The base header is 20 bytes, so options = 32 − 20 = <b>12 bytes</b>.</li>
  <li>(c) Header = 5 × 4 = 20 bytes; total length = 0x28 = 40 bytes; data = 40 − 20 = <b>20 bytes</b>.</li>
</ol><p class="ex-a">Always convert HLEN to bytes (× 4) before using it</p></div>
</section>

<section class="topic" id="c10-frag">
<h2>Fragmentation and reassembly</h2>
<p>Not all link-layer protocols can carry packets of the same size. The maximum amount of data a link-layer frame can carry is its <b>maximum transmission unit (MTU)</b>: Ethernet frames carry up to <b>1,500 bytes</b>, some wide-area links no more than <b>576 bytes</b>. When the outgoing link's MTU is smaller than a datagram, the router <b>fragments</b> its data into two or more smaller IP datagrams, called <b>fragments</b>, and sends each in its own frame.</p>
<ul>
  <li>Fragments are <b>reassembled only at the destination host</b>, never in routers: reassembly in routers would complicate the protocol and slow routers down. TCP and UDP expect complete segments.</li>
  <li><b>Identification</b> (16 bits): the sending host stamps each datagram with an identification number (usually incrementing). Every fragment keeps the original identification, source and destination, so the destination can tell which fragments belong together.</li>
  <li><b>Flags</b> (3 bits): reserved, <b>D</b> (do not fragment: if the datagram does not fit, it is discarded and an ICMP error is sent) and <b>M</b> (more fragments: 1 in every fragment except the last, which has 0).</li>
  <li><b>Fragmentation offset</b> (13 bits): where the fragment's data fits in the original datagram, in units of <b>8 bytes</b>. So the data in every fragment except the last must be a <b>multiple of 8 bytes</b>.</li>
  <li>IP is unreliable, so fragments can be lost: the offsets reveal a missing fragment and the M = 0 fragment tells the destination it has the last one.</li>
</ul>
<div class="example"><p class="ex-q">A 4,000-byte datagram (20 bytes of header + 3,980 bytes of payload) with identification 777 must be forwarded to a link with an MTU of 1,500 bytes. Give the fragments.</p><ol class="steps">
  <li>Data per fragment ≤ 1,500 − 20 = 1,480 bytes, and 1,480 is a multiple of 8 ✓</li>
  <li>3,980 = 1,480 + 1,480 + 1,020 → <b>3 fragments</b></li>
  <li>Offsets: 0 / 8 = <b>0</b>, 1,480 / 8 = <b>185</b>, 2,960 / 8 = <b>370</b></li>
</ol>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Fragment</th><th>Bytes</th><th class="num">ID</th><th>Offset</th><th class="num">Flag (M)</th></tr></thead><tbody>
<tr><td>1st</td><td>1,480 data (1,500 total)</td><td class="num">777</td><td>0 (data from byte 0)</td><td class="num">1</td></tr>
<tr><td>2nd</td><td>1,480 data (1,500 total)</td><td class="num">777</td><td>185 (data from byte 1,480)</td><td class="num">1</td></tr>
<tr><td>3rd</td><td>1,020 data (1,040 total)</td><td class="num">777</td><td>370 (data from byte 2,960)</td><td class="num">0</td></tr>
</tbody></table></div>
<p class="ex-a">The payload reaches the transport layer only after the IP layer has fully rebuilt the datagram; if a fragment is missing, the incomplete datagram is discarded</p></div>
<figure class="lab" data-widget="frag"><figcaption><span class="ttl">Fragmentation calculator</span><span class="cap">Change the datagram size, header length and MTU. Tick the D bit to see the datagram dropped instead.</span></figcaption></figure>
<figure class="lab lab-3d" data-scene="journey" data-mode="frag" data-lock="1"><figcaption><span class="ttl">One datagram, three fragments</span><span class="cap">The router splits the datagram for the 1,500-byte link; only the destination reassembles it.</span></figcaption></figure>
<details class="solution"><summary>Practice: a fragment arrives with M = 0 and offset 100. Is it the first, a middle or the last fragment? What is the number of its first byte?</summary><div class="body"><p>M = 0 means it is the <b>last</b> fragment; the non-zero offset shows that earlier fragments exist. First byte = 100 × 8 = <b>800</b>.</p></div></details>
<details class="solution"><summary>Practice: a fragment has HLEN = 5, total length 1,220 and offset 100. Which data bytes does it carry?</summary><div class="body"><p>Header = 5 × 4 = 20 bytes, so data = 1,220 − 20 = 1,200 bytes. First byte = 100 × 8 = 800; last byte = 800 + 1,200 − 1 = <b>1,999</b>.</p></div></details>
</section>

<section class="topic" id="c10-ipv6">
<h2>IPv6: the next-generation IP</h2>
<p>The main reason for migrating from IPv4 to IPv6 is the <b>small address space</b> of IPv4: the 32-bit space was soon to be completely allocated. An IPv6 address is <b>128 bits (16 bytes)</b> long, four times the IPv4 length, giving about 3.4 × 10<sup>38</sup> addresses. It is written in hexadecimal as <b>8 fields separated by colons</b>, for example <span class="mono">2001:0000:3238:DFE1:0063:0000:0000:FEFB</span>.</p>
<p>Additional motivation from the Module 3 slides: a header format that <b>speeds up processing and forwarding</b>, and header changes that make <b>quality of service</b> easier. Hence a <b>fixed-length 40-byte header</b> and <b>no fragmentation at routers</b>.</p>
<h3 id="c10-ipv6-changes">What changed in the protocol</h3>
<div class="duo">
  <div class="card"><h4>Better header format</h4><p>Options are separated from the base header and inserted, when needed, between the base header and the data. Routing becomes simpler and faster because most options need not be checked by routers.</p></div>
  <div class="card"><h4>New options, allowance for extension</h4><p>New options add functionality, and the protocol can be extended if new technologies or applications require it.</p></div>
  <div class="card"><h4>Support for resource allocation</h4><p>The type-of-service field is removed; <b>traffic class</b> and <b>flow label</b> let the source request special handling, e.g. for real-time audio and video.</p></div>
  <div class="card"><h4>Support for more security</h4><p>Encryption and authentication options provide confidentiality and integrity of the packet.</p></div>
</div>
<h3 id="c10-ipv6-format">Packet format</h3>
<p>Each packet is a <b>base header of 40 bytes</b> followed by a <b>payload of up to 65,535 bytes</b>.</p>
<figure class="lab" data-widget="header" data-spec="ipv6"><figcaption><span class="ttl">IPv6 base header: tap any field</span><span class="cap">Compare it with the IPv4 header: fewer fields and a fixed length.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Field</th><th>Size</th><th>Purpose</th></tr></thead><tbody>
<tr><td>Version</td><td>4 bits</td><td>Value 6.</td></tr>
<tr><td>Traffic class (priority)</td><td>8 bits</td><td>Distinguishes payloads with different delivery requirements; replaces the type-of-service field. (Slides: priority among datagrams in a flow.)</td></tr>
<tr><td>Flow label</td><td>20 bits</td><td>Identifies datagrams of the same "flow" that need special handling.</td></tr>
<tr><td>Payload length</td><td>2 bytes</td><td>Length of the datagram <b>excluding</b> the base header. IPv4 has two length fields; IPv6's base header is fixed at 40 bytes, so only the payload length is needed.</td></tr>
<tr><td>Next header</td><td>8 bits</td><td>Type of the first extension header (if present) or of the data after the base header, e.g. TCP or UDP. Similar to the protocol field of IPv4.</td></tr>
<tr><td>Hop limit</td><td>8 bits</td><td>Same purpose as the TTL field in IPv4.</td></tr>
<tr><td>Source and destination addresses</td><td>16 + 16 bytes</td><td>128-bit addresses of the original source and the destination.</td></tr>
</tbody></table></div>
<h3 id="c10-flow">Flow label and priority</h3>
<p>The flow label was added so that IPv6 can be used as a <b>connection-oriented</b> protocol. To a router, a <b>flow</b> is a sequence of packets sharing the same characteristics: travelling the same path, using the same resources, having the same kind of security. A router that handles flow labels keeps a <b>flow label table</b> with one entry per active flow, giving the services that flow needs.</p>
<ul>
  <li><b>Faster processing</b>: instead of consulting the forwarding table and going through a routing algorithm, the router looks up the next hop in the flow label table.</li>
  <li><b>Real-time audio and video</b>: digital media needs high bandwidth, large buffers and long processing time, reserved in advance so data is not delayed. This also needs protocols such as <b>RTP</b> (Real-time Transport Protocol) and <b>RSVP</b> (Resource Reservation Protocol).</li>
</ul>
<h3 id="c10-ipv6-frag">Fragmentation and reassembly in IPv6</h3>
<p>IPv6 datagrams are fragmented <b>only by the source</b>, not by routers; reassembly takes place at the destination. This speeds up processing in routers. The source checks the packet size and decides whether to fragment. A router that receives a packet larger than the MTU of the network ahead <b>drops it</b> and sends an ICMPv6 <b>packet-too-big</b> error message to the source.</p>
<h3 id="c10-ipv6-other">Other changes from IPv4</h3>
<ul>
  <li><b>Checksum removed</b> entirely, to reduce processing time at each hop.</li>
  <li><b>Options</b> allowed, but outside the header, indicated by the Next Header field.</li>
  <li><b>ICMPv6</b>: a new version of ICMP with additional message types (e.g. "Packet Too Big") and multicast group management functions.</li>
</ul>
<h3 id="c10-ext">Extension headers</h3>
<p>To give the datagram more functionality, the 40-byte base header can be followed by up to <b>six extension headers</b>:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Extension header</th><th>Purpose</th></tr></thead><tbody>
<tr><td><b>Hop-by-hop option</b></td><td>The source passes information to <b>all routers</b> visited by the datagram.</td></tr>
<tr><td><b>Source routing</b></td><td>Combines the strict source route and loose source route options of IPv4.</td></tr>
<tr><td><b>Fragmentation</b></td><td>Only the original source can fragment. It uses <b>Path MTU Discovery</b> to find the smallest MTU on the path, then fragments accordingly.</td></tr>
<tr><td><b>Authentication</b></td><td>Validates the message sender and ensures the integrity of the data.</td></tr>
<tr><td><b>Encrypted Security Payload (ESP)</b></td><td>Provides confidentiality and guards against eavesdropping.</td></tr>
<tr><td><b>Destination option</b></td><td>The source passes information to the <b>destination only</b>; intermediate routers cannot access it.</td></tr>
</tbody></table></div>
<div class="note remember"><b class="tag">Memory hook</b><p class="mnemonic"><u>H</u>appy <u>S</u>tudents <u>F</u>ind <u>A</u>nswers <u>E</u>very <u>D</u>ay</p><p>Hop-by-hop · Source routing · Fragmentation · Authentication · ESP · Destination option</p></div>
<h3 id="c10-compare">IPv4 versus IPv6</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Feature</th><th>IPv4</th><th>IPv6</th></tr></thead><tbody>
<tr><td>Address length</td><td>32 bits</td><td>128 bits</td></tr>
<tr><td>Address space</td><td>About 4.29 × 10<sup>9</sup></td><td>About 3.4 × 10<sup>38</sup></td></tr>
<tr><td>Representation</td><td>Decimal: 4 fields separated by dots (66.94.29.13)</td><td>Hexadecimal: 8 fields separated by colons</td></tr>
<tr><td>Header length</td><td>20–60 bytes</td><td>Fixed 40 bytes</td></tr>
<tr><td>Checksum field</td><td>Available</td><td>Not available</td></tr>
<tr><td>Fragmentation</td><td>By the sender and forwarding routers</td><td>Only by the sender</td></tr>
<tr><td>Packet flow identification</td><td>Not available</td><td>Flow label field in the header</td></tr>
<tr><td>Options</td><td>Inside the header</td><td>Extension headers after the base header</td></tr>
<tr><td>Transmission schemes</td><td>Broadcast</td><td>Multicast and anycast</td></tr>
<tr><td>Security</td><td>Depends on the application</td><td>IPSec built in (encryption and authentication)</td></tr>
<tr><td>Address configuration</td><td>Manual and DHCP</td><td>Auto-configuration and renumbering</td></tr>
<tr><td>Classes</td><td>Five classes, A to E</td><td>No classes</td></tr>
<tr><td>VLSM (variable-length subnet mask)</td><td>Supported</td><td>Not supported</td></tr>
<tr><td>Conversion</td><td>IPv4 can be converted to IPv6</td><td>Not all IPv6 can be converted to IPv4</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c10-transition">
<h2>Transition from IPv4 to IPv6: tunnelling</h2>
<p>Not all routers can be upgraded simultaneously, and there can be no "flag day" when the whole Internet switches over. So how will the network operate with <b>mixed IPv4 and IPv6 routers</b>?</p>
<p><b>Tunnelling</b>: the IPv6 datagram is carried as the <b>payload of an IPv4 datagram</b> among IPv4 routers. In the slide example, A, B, E and F are IPv6 routers and C and D are IPv4 routers. B and E, the two ends of the tunnel, must understand both versions.</p>
<div class="duo">
  <div class="card"><h4>Logical view</h4><p>A – B ═ IPv4 tunnel ═ E – F. The IPv6 routers B and E appear to be directly connected.</p></div>
  <div class="card"><h4>Physical view</h4><p>A – B – C – D – E – F. B puts the IPv6 datagram (src A, dest F) inside an IPv4 datagram (src B, dest E); C and D forward it as ordinary IPv4; E extracts the IPv6 datagram and forwards it to F.</p></div>
</div>
<figure class="lab lab-3d" data-scene="journey" data-mode="tunnel" data-lock="1"><figcaption><span class="ttl">IPv6 through an IPv4 tunnel</span><span class="cap">Follow the datagram from A to F. The amber shell is the IPv4 header that B adds and E removes.</span></figcaption></figure>
</section>

<section class="topic" id="c10-exam">
<h2>Exam corner</h2>
<div class="note exam"><b class="tag">How Module 3 is asked</b><p>Long answers are "explain with a neat diagram": draw the header with bit widths, the classful layout, the DHCP exchange, the NAT table or the tunnel. Numericals come from classless blocks (N, first, last, mask), subnet design, header fields (HLEN, total length) and fragmentation offsets.</p></div>
<details class="answer"><summary>Explain the services provided by the network layer. · 8 marks</summary><div class="body"><p>Packetizing (encapsulate at the source, decapsulate at the destination, payload never changed except for fragmentation); routing (choose the best route with routing protocols) and forwarding (forwarding-table lookup on the destination address or label), with the trip and interchange analogy and the forwarding-table figure; other services: error control (header checksum only, ICMP), no flow control, congestion control, QoS, security through IPSec.</p></div></details>
<details class="answer"><summary>Compare the datagram and virtual-circuit approaches. Explain the phases of a virtual circuit. · 8 marks</summary><div class="body"><p>Datagram: connectionless, independent packets, forwarding on the destination address, out-of-order arrival possible. Virtual circuit: setup with request and acknowledgment packets filling the (incoming port, incoming label, outgoing port, outgoing label) tables, data transfer with label swapping 14 → 66 → 22 → 77, teardown. Draw the A–R1–R3–R4–B figure and finish with the comparison table.</p></div></details>
<details class="answer"><summary>Explain classful addressing. Why did it become obsolete? · 6 marks</summary><div class="body"><p>Five classes with first bits and prefix lengths 8/16/24, number of networks 2<sup>7</sup>, 2<sup>14</sup>, 2<sup>21</sup>, class D multicast, class E reserved (draw the layout); address depletion class by class; subnetting and supernetting as attempted fixes; advantage: the prefix length is inherent in the address.</p></div></details>
<details class="answer"><summary><span class="chip hot">IA-1 Q7b</span> Identify the need of classless addressing. Find the class of 201.20.31.65, 126.11.11.239, 193.14.56.22 and 130.34.54.12. · 4 marks</summary><div class="body"><p><b>Need:</b> in classful addressing a large part of the available addresses was wasted (class A and B blocks too big for most organizations, class C too small, class E unused), and the address space was being exhausted. Classless addressing gives each organization a variable-length block sized to its needs (a power of 2, written with a prefix length /n), so far fewer addresses are wasted and blocks can be aggregated.</p><p><b>Classes</b> (first byte): 201 → <b>C</b> · 126 → <b>A</b> · 193 → <b>C</b> · 130 → <b>B</b>.</p></div></details>
<details class="answer"><summary>Given an address in slash notation, find the number of addresses, the first and last address and the mask. · 4–6 marks</summary><div class="body"><p>N = 2<sup>32 − n</sup>; mask = n ones followed by zeros; first = address AND mask (rightmost 32 − n bits set to 0); last = address OR NOT(mask) (set to 1). Always show the binary of the byte that is split. Check your answer in the IPv4 lab above.</p></div></details>
<details class="answer"><summary>Explain DHCP: message format, operation and transition states. · 8 marks</summary><div class="body"><p>Purpose and the four pieces of information; message format with options, magic cookie 99.130.83.99 and the tag-53 message types; the DISCOVER → OFFER → REQUEST → ACK/NACK exchange with ports 68/67 and addresses 0.0.0.0 → 255.255.255.255; why two well-known ports; FTP for extra information; error control; the state diagram with the 50%, 75% and 100% timers.</p></div></details>
<details class="answer"><summary>What is NAT? Explain address translation and the translation table. · 6 marks</summary><div class="body"><p>Private and global addresses, a single connection through the NAT router (200.24.5.8); outgoing source replacement and incoming destination replacement; the three translation strategies: one address (communication initiated from inside), a pool of addresses, and addresses plus ports (the five-column table with 172.18.3.1 and 172.18.3.2).</p></div></details>
<details class="answer"><summary>Explain the IPv4 datagram format with a neat diagram. · 8 marks</summary><div class="body"><p>The 32-bit-row diagram (VER, HLEN, service type, total length / identification, flags, fragmentation offset / TTL, protocol, header checksum / source address / destination address / options), one or two lines per field, the data-length formula, and fragmentation with the MTU idea and the 4,000-byte example.</p></div></details>
<details class="answer"><summary>Explain the IPv6 packet format. Differentiate IPv4 and IPv6. · 8–10 marks</summary><div class="body"><p>Reasons for IPv6 and the protocol changes, the base header diagram and its fields, the flow label, fragmentation only at the source, the six extension headers and the comparison table (at least eight rows).</p></div></details>
<details class="answer"><summary>How will the Internet move from IPv4 to IPv6? Explain tunnelling. · 6 marks</summary><div class="body"><p>No flag day and mixed routers; the IPv6 datagram carried as the payload of an IPv4 datagram between the two tunnel ends; the logical and physical views with the A…F example and the headers on each hop.</p></div></details>
</section>
`,
  quiz: [
    { q: 'Moving a packet from a router\'s input link to the appropriate output link is called', o: ['Routing', 'Forwarding', 'Packetizing', 'Switching off'], a: 1, why: 'Forwarding is the per-packet table lookup; routing builds the table.' },
    { q: 'In the virtual-circuit approach, a router forwards a packet using', o: ['The source address', 'The destination address', 'The label (virtual-circuit identifier)', 'The TTL'], a: 2, why: 'The label is looked up and swapped at every router.' },
    { q: 'The size of the IPv4 address space is', o: ['2^16', '2^32 = 4,294,967,296', '2^64', '2^128'], a: 1, why: 'IPv4 addresses are 32 bits long.' },
    { q: 'The address 130.34.54.12 belongs to class', o: ['A', 'B', 'C', 'D'], a: 1, why: 'First byte 130 is in 128–191 (leading bits 10).' },
    { q: 'How many class C networks are possible?', o: ['128', '16,384', '2,097,152', '256'], a: 2, why: '24-bit prefix minus 3 class bits = 21 bits: 2^21.' },
    { q: 'What is the first address of the block containing 167.199.170.82/27?', o: ['167.199.170.0', '167.199.170.64', '167.199.170.80', '167.199.170.95'], a: 1, why: '82 AND 224 = 64.' },
    { q: 'The mask for a /22 block is', o: ['255.255.255.0', '255.255.252.0', '255.255.248.0', '255.252.0.0'], a: 1, why: '8 + 8 + 6 ones: the third byte is 11111100 = 252.' },
    { q: 'An ISP requests 1000 addresses. The granted prefix length is', o: ['/21', '/22', '/23', '/24'], a: 1, why: '1024 addresses are granted; n = 32 − 10 = 22.' },
    { q: 'Which block is a private address block?', o: ['127.0.0.0/8', '172.16.0.0/12', '224.0.0.0/4', '200.24.5.0/24'], a: 1, why: '127/8 is loopback and 224/4 multicast.' },
    { q: 'DHCP client and server use the UDP ports', o: ['67 and 68', '68 and 67', '20 and 21', '53 and 53'], a: 1, why: 'Client 68, server 67: both well-known because replies are broadcast.' },
    { q: 'A DHCP client moves to the RENEWING state when the lease is', o: ['25% expired', '50% expired', '75% expired', 'fully expired'], a: 1, why: 'Renewal timer 50%, rebinding 75%, expiration 100%.' },
    { q: 'With a single global address and a two-column translation table, NAT requires that', o: ['The external host start the communication', 'The private network start the communication', 'Ports are used', 'DHCP is disabled'], a: 1, why: 'The table entry is created by an outgoing packet.' },
    { q: 'An IPv4 header with HLEN = 15 is', o: ['15 bytes', '30 bytes', '60 bytes', '20 bytes'], a: 2, why: 'HLEN counts 4-byte words: 15 × 4 = 60.' },
    { q: 'A 4,000-byte datagram (20-byte header) crosses a link with MTU 1,500. The offset of the third fragment is', o: ['2960', '370', '185', '0'], a: 1, why: 'Its data starts at byte 2,960; 2,960 / 8 = 370.' },
    { q: 'In IPv6, fragmentation is done by', o: ['Every router', 'Only the source', 'Only the destination', 'The NAT router'], a: 1, why: 'Routers drop oversized packets and send ICMPv6 packet-too-big.' },
    { q: 'The IPv6 base header is', o: ['20 bytes', '20–60 bytes', '40 bytes fixed', '128 bytes'], a: 2, why: 'Options moved to extension headers, so the base header is fixed.' },
    { q: 'In tunnelling, an IPv6 datagram crosses an IPv4 network', o: ['After being converted to IPv4', 'As the payload of an IPv4 datagram', 'Only through NAT', 'By fragmenting into IPv4 fragments'], a: 1, why: 'B wraps it in an IPv4 datagram addressed to E, which unwraps it.' }
  ]
});
