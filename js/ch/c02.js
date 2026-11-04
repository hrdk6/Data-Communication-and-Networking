DCN.register({
  id: 'c2', num: 2, part: 'A', layer: 'found', unit: 'Unit 1 · Module 1',
  title: 'Network Models: Layering, TCP/IP and OSI',
  short: 'Network models',
  summary: 'Why communication is split into layers, the five-layer TCP/IP suite and its protocols, how data is encapsulated on the way down and decapsulated on the way up, the four kinds of address, and the seven-layer OSI model.',
  hot: ['IA-1 Q1b', 'IA-1 Q6a'],
  sources: ['U-1-ch-2.pdf', '2.ppt', 'CN-BCS502-Module1-RajeshL.pdf', 'cn_module1 (naveen notes).pdf', 'CN_Complete_Notes'],
  keywords: 'protocol layering principles logical connection TCP/IP layers encapsulation decapsulation multiplexing demultiplexing addressing MAC port IP OSI physical data link network transport session presentation application PDU segment datagram frame',
  html: `
<section class="topic" id="c2-layering">
<h2>Protocol layering</h2>
<p>A <b>protocol</b> defines the rules that the sender, the receiver and all intermediate devices must follow to communicate effectively. When communication is simple, one protocol is enough. When it is complex, the task is divided between <b>layers</b>, with a protocol at each layer. This is <b>protocol layering</b>.</p>
<h3 id="c2-scenarios">Two scenarios</h3>
<div class="duo">
  <div class="card"><h4>First scenario: one layer</h4><p>Maria and Ann are neighbours who talk face to face in the same language. Communication happens in a single layer.</p></div>
  <div class="card"><h4>Second scenario: three layers</h4><p>Ann moves to another city, so they write letters through the post office and agree on an encryption technique so an intruder cannot read them. Each friend has three "machines":</p><ul><li><b>Layer 3</b>: listens / talks, producing the plaintext letter.</li><li><b>Layer 2</b>: encrypts / decrypts (plaintext ↔ ciphertext).</li><li><b>Layer 1</b>: puts the ciphertext in an envelope with addresses and mails it / takes it out of the mailbox.</li></ul></div>
</div>
<p>At Maria's side the letter goes <b>down</b> the layers (talk → encrypt → mail); at Ann's side it comes <b>up</b> (pick up → decrypt → read). Each layer acts as a <b>black box</b> with inputs and outputs; two boxes that give the same outputs for the same inputs can replace each other. This is <b>modularity</b>.</p>
<div class="duo">
  <div class="card"><h4>Advantages of layering</h4><ul><li>Separates the <b>services</b> from the <b>implementation</b>: a layer can be changed as long as it offers the same service.</li><li>Intermediate systems (routers, switches) need only some layers, so they are cheaper.</li></ul></div>
  <div class="card"><h4>Disadvantage</h4><ul><li>A single layer would be simpler: no layer would need to serve the one above and use the one below.</li></ul></div>
</div>
<h3 id="c2-principles">Principles of protocol layering</h3>
<ol>
  <li><b>First principle:</b> for bidirectional communication, each layer must perform two opposite tasks, one in each direction (layer 3 listens in one direction and talks in the other; layer 2 encrypts and decrypts).</li>
  <li><b>Second principle:</b> the two objects under each layer at both sites must be <b>identical</b> (the object under layer 3 at both sites is a plaintext letter; under layer 2 a ciphertext letter).</li>
</ol>
<p><b>Logical connections:</b> each layer behaves as if it had a direct, imaginary connection to the same layer at the other end. This layer-to-layer (peer) communication is what lets each layer be designed on its own.</p>
<div class="note exam"><b class="tag">IA-1 Q1b · 4 marks</b><p><b>How layering helps a chat app that sends text, images and voice notes.</b> One mark for each:</p><ul><li><b>Design flexibility</b>: each layer is a separate module, so the team can change how images or voice are encoded at the application layer without touching transport or network code.</li><li><b>Troubleshooting</b>: a fault can be isolated to one layer. Corrupted messages point to error control (checksum/CRC); slow delivery points to transport congestion control or the network path.</li><li><b>Scalability</b>: new features (say, video messages) are added at the top layer while the lower layers carry them unchanged.</li><li><b>Reusability</b>: the same TCP/IP transport and network layers serve text, images and voice, and other applications too.</li></ul></div>
</section>

<section class="topic" id="c2-tcpip">
<h2>The TCP/IP protocol suite</h2>
<p><b>TCP/IP</b> is the protocol suite (a set of protocols organised in layers) used in the Internet today. It is <b>hierarchical</b>: each upper-level protocol is supported by the services of one or more lower-level protocols. The original suite had four layers (host-to-network, internet, transport, application); compared with OSI it is described as <b>five layers</b>: physical, data link, network, transport and application.</p>
<h3 id="c2-arch">Layered architecture</h3>
<p>Picture computer A talking to computer B across three LANs joined by one router. Five devices take part: the source host, the link-layer switch in link 1, the router, the link-layer switch in link 2 and the destination host.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Device</th><th>Layers involved</th><th>Why</th></tr></thead>
<tbody>
<tr><th>Source and destination hosts</th><td>All 5</td><td>The message is created at the application layer and must go all the way down and up again.</td></tr>
<tr><th>Router</th><td>3 (network, data link, physical)</td><td>It only routes; it has no transport or application layer. It runs one network layer but <i>n</i> combinations of data-link and physical layers, one per link, because each link may use its own protocols.</td></tr>
<tr><th>Link-layer switch</th><td>2 (data link, physical)</td><td>It only forwards frames within one link.</td></tr>
</tbody></table></div>
<ul>
  <li>The duty of the <b>application, transport and network</b> layers is <b>end-to-end</b>; their domain is the internet. The data unit they create must not be changed by any router or switch.</li>
  <li>The duty of the <b>data-link and physical</b> layers is <b>hop-to-hop</b> (a hop is a host or a router); their domain is the link. Routers may change the data unit (a router can fragment a packet), so identical objects exist only between two hops.</li>
</ul>
<h3 id="c2-layers">What each TCP/IP layer does</h3>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Layer</th><th>Responsibility</th><th>Protocols</th><th>Data unit</th></tr></thead>
<tbody>
<tr><th>Application</th><td>Process-to-process communication between two programs: a request and a response.</td><td><b>SMTP</b> (e-mail), <b>FTP</b> (file transfer), <b>TELNET / SSH</b> (remote login), <b>HTTP</b> (the Web), <b>DNS</b> (finds the IP address of a name), <b>SNMP</b> (manages the Internet)</td><td>Message</td></tr>
<tr><th>Transport</th><td>End-to-end delivery from a process to a process: takes the message, encapsulates it in a segment and hands it to the network layer.</td><td><b>TCP</b>: reliable, connection-oriented; flow, error and congestion control. <b>UDP</b>: simplest; connectionless and unreliable; no flow, error or congestion control; suits short messages that cannot afford retransmission. <b>SCTP</b>: for newer applications such as voice over the Internet; combines the best of UDP and TCP.</td><td>Segment (TCP) / user datagram (UDP)</td></tr>
<tr><th>Network</th><td>Source-to-destination (host-to-host) delivery and routing of packets; routers choose the best route.</td><td><b>IP</b>: main protocol; defines address format and routes packets; <b>connectionless and unreliable</b> (no flow, error or congestion control). <b>ARP</b>: finds the physical address from a known IP address. <b>ICMP</b>: reports datagram problems to the sender. <b>IGMP</b>: sends one message to a group. <b>DHCP</b>: gives a host its network-layer address.</td><td>Datagram</td></tr>
<tr><th>Data link</th><td>Moves a frame from one node to the next over a link (wired or wireless LAN/WAN). Takes the datagram and encapsulates it in a frame.</td><td>TCP/IP defines no specific protocol; it supports all standard and proprietary ones (some detect and correct errors, some only detect).</td><td>Frame</td></tr>
<tr><th>Physical</th><td>Moves individual bits from one node to the next. The transmission medium is a hidden layer below it; the medium carries electrical or optical signals, not bits.</td><td>—</td><td>Bits</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c2-encap">
<h2>Encapsulation, decapsulation and multiplexing</h2>
<h3 id="c2-encap-source">At the source host: encapsulation only</h3>
<ol>
  <li>The application layer produces a <b>message</b> and passes it to the transport layer.</li>
  <li>The transport layer treats it as payload and adds a transport header: identifiers of the source and destination application programs (ports) plus information for end-to-end delivery such as flow, error or congestion control. The result is a <b>segment</b> (TCP) or <b>user datagram</b> (UDP).</li>
  <li>The network layer adds its header: source and destination host addresses, header error check, fragmentation information. The result is a <b>datagram</b>.</li>
  <li>The data-link layer adds a header with the link-layer addresses of the host or the next hop (the router). The result is a <b>frame</b>, handed to the physical layer for transmission.</li>
</ol>
<h3 id="c2-encap-router">At the router: decapsulation and encapsulation</h3>
<p>The data-link layer takes the datagram out of the frame and passes it up. The network layer only inspects the source and destination addresses and consults its <b>forwarding table</b> to find the next hop. It does not change the datagram unless it must fragment it. The datagram goes to the data-link layer of the next link, which encapsulates it in a new frame.</p>
<h3 id="c2-encap-dest">At the destination host: decapsulation only</h3>
<p>Each layer removes its header, checks for errors and delivers the payload to the next-higher protocol until the message reaches the application layer.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Layer</th><th>Packet name</th><th>What is added</th></tr></thead>
<tbody>
<tr><th>Application</th><td>Message</td><td>—</td></tr>
<tr><th>Transport</th><td>Segment / user datagram</td><td>Transport header (ports)</td></tr>
<tr><th>Network</th><td>Datagram</td><td>Network header (IP addresses)</td></tr>
<tr><th>Data link</th><td>Frame</td><td>Link header (MAC addresses) and usually a trailer</td></tr>
<tr><th>Physical</th><td>Bits</td><td>—</td></tr>
</tbody></table></div>
<h3 id="c2-mux">Multiplexing and demultiplexing</h3>
<p>Because TCP/IP uses several protocols at some layers, there is <b>multiplexing at the source</b> and <b>demultiplexing at the destination</b>. Multiplexing means a protocol can encapsulate packets from several next-higher protocols (one at a time); demultiplexing means it can decapsulate and deliver packets to several next-higher protocols. To do this a protocol needs a header field saying which protocol the payload belongs to.</p>
<ul>
  <li>At the transport layer, UDP or TCP accepts messages from several application protocols.</li>
  <li>At the network layer, IP accepts a segment from TCP, a user datagram from UDP, or packets from ICMP, IGMP and others.</li>
  <li>At the data-link layer, a frame may carry a payload from IP or from other protocols such as ARP.</li>
</ul>
</section>

<section class="topic" id="c2-addressing">
<h2>Addressing</h2>
<p>Every communication between two parties needs a source address and a destination address. That looks like five pairs, one per layer, but there are only <b>four</b>, because the physical layer carries bits, which have no addresses.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Layer</th><th>Address</th><th>Scope</th><th>Example</th></tr></thead>
<tbody>
<tr><th>Application</th><td>Name (specific address)</td><td>—</td><td><code>someorg.com</code>, <code>somebody@coldmail.com</code></td></tr>
<tr><th>Transport</th><td>Port number (16 bits)</td><td>Local: distinguishes programs running at the same time on one host</td><td><code>753</code>, 80 for HTTP</td></tr>
<tr><th>Network</th><td>Logical (IP) address (32 bits in IPv4)</td><td>Global: the whole Internet</td><td><code>10.1.1.11</code></td></tr>
<tr><th>Data link</th><td>Link-layer (physical, MAC) address (48 bits)</td><td>Local: one network (LAN or WAN)</td><td><code>07:01:02:01:2C:4B</code> (12 hex digits)</td></tr>
</tbody></table></div>
<ul>
  <li><b>Physical addresses</b>: in a bus LAN, the node with physical address 10 sends a frame to the node with address 87; the others drop it.</li>
  <li><b>Logical addresses</b>: each device has a pair (logical and physical) for each connection. A router connected to three networks has three pairs.</li>
  <li><b>Port addresses</b>: a sender runs processes a, b, c; a receiver runs j and k; process a talks to process j.</li>
</ul>
<div class="note remember"><b class="tag">Remember</b><p>The <b>physical addresses change from hop to hop</b>, but the logical (IP) and port addresses usually stay the same from source to destination.</p></div>
</section>

<section class="topic" id="c2-osi">
<h2>The OSI model</h2>
<p>The <b>International Organization for Standardization (ISO)</b>, established in 1947, is a multinational body for worldwide agreement on standards. Its standard covering all aspects of network communication is the <b>Open Systems Interconnection (OSI) model</b>, first introduced in the late 1970s. An <b>open system</b> is a set of protocols that lets any two different systems communicate regardless of their underlying architecture. OSI is a layered framework of <b>seven separate but related layers</b>. <b>ISO is the organisation; OSI is the model.</b></p>
<figure class="lab lab-3d" data-scene="stack" data-model="osi"><figcaption><span class="ttl">OSI and TCP/IP in 3D</span><span class="cap">Play the encapsulation, switch between the two models, and click any layer for its functions.</span></figcaption></figure>
<p class="mnemonic">Top down: <u>A</u>ll <u>P</u>eople <u>S</u>eem <u>T</u>o <u>N</u>eed <u>D</u>ata <u>P</u>rocessing</p>
<p>Layers 5–7 are often called the <b>software layers</b> (user support), layers 1–3 the <b>hardware layers</b> (network support), and layer 4, which links the two groups, the <b>heart of OSI</b>.</p>
<h3 id="c2-osi-interaction">Interaction between layers</h3>
<ul>
  <li><b>Peer-to-peer processes</b>: layer x on one machine communicates with layer x on another machine, following that layer's protocol. Only the physical layers communicate directly.</li>
  <li><b>Interfaces</b>: each pair of adjacent layers has an interface defining the information and services the lower layer offers the upper one.</li>
  <li><b>Encapsulation</b> in an exchange: at the sender, the data D7 gets header H7, then H6 … H2, and a trailer T2 at layer 2; layer 1 turns the whole unit into a bit stream. The receiver removes them in reverse order.</li>
</ul>
<h3 id="c2-osi-layers">Functions of the seven layers</h3>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Layer</th><th>Responsible for</th><th>Main functions</th></tr></thead>
<tbody>
<tr><th>7 · Application</th><td>Providing services to the user</td><td>Network virtual terminal; file transfer, access and management; mail services; directory services. Interface between users and applications.</td></tr>
<tr><th>6 · Presentation</th><td>Translation, compression and encryption</td><td><b>Translation</b> between different encodings (e.g. ASCII ↔ EBCDIC); <b>encryption/decryption</b> for privacy (e.g. SSL); <b>compression</b>, lossy or lossless, to reduce bits (text, audio, video).</td></tr>
<tr><th>5 · Session</th><td>Dialog control and synchronisation</td><td><b>Dialog control</b>: lets two systems talk in half- or full-duplex. <b>Synchronisation</b>: adds checkpoints (e.g. after every 100 pages of a 2000-page file) so a crash resumes from the last checkpoint. Also authentication, authorisation, session management. Example: a login session in online banking. Can be skipped if not needed.</td></tr>
<tr><th>4 · Transport</th><td>Process-to-process delivery of the entire message</td><td><b>Service-point (port) addressing</b> (0–65535; TCP favours reliability, UDP efficiency); <b>segmentation and reassembly</b> with sequence numbers; <b>connection control</b> (connectionless or connection-oriented); end-to-end <b>flow control</b> and <b>error control</b> (retransmission). Network-independent: it ignores how the lower layers work.</td></tr>
<tr><th>3 · Network</th><td>Delivery of individual packets from source host to destination host</td><td><b>Logical addressing</b> (IP addresses, 32 bits as 4 octets of 0–255) and <b>routing</b> (path determination with protocols such as OSPF and BGP). Devices: routers, hosts, anything with an IP.</td></tr>
<tr><th>2 · Data link</th><td>Moving frames from one hop (node) to the next</td><td><b>Framing</b>; <b>physical addressing</b> (MAC addresses in header and trailer); <b>flow control</b>; <b>error control</b> (trailer); <b>access control</b> when devices share a link (e.g. CSMA). Devices: NICs, switches.</td></tr>
<tr><th>1 · Physical</th><td>Moving individual bits from one hop (node) to the next</td><td>Physical characteristics of interfaces and media; <b>representation of bits</b> (encoding into signals); <b>data rate</b>; <b>synchronisation of bits</b>; <b>line configuration</b> (point-to-point or multipoint); <b>physical topology</b>; <b>transmission mode</b> (simplex, half, full duplex). Devices: cables, Wi-Fi, repeaters, hubs.</td></tr>
</tbody></table></div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Layer</th><th>PDU</th><th>Delivery</th><th>Address</th><th>Devices</th></tr></thead>
<tbody>
<tr><th>4 Transport</th><td>Segment</td><td>Service to service (process)</td><td>TCP/UDP ports</td><td>—</td></tr>
<tr><th>3 Network</th><td>Packet</td><td>End to end</td><td>IP addresses</td><td>Routers, hosts</td></tr>
<tr><th>2 Data link</th><td>Frame</td><td>Hop to hop</td><td>MAC addresses</td><td>Switches</td></tr>
<tr><th>1 Physical</th><td>Bits</td><td>Transporting bits</td><td>—</td><td>Cables, Wi-Fi, hubs</td></tr>
</tbody></table></div>
<div class="note exam"><b class="tag">IA-1 Q6a · 6 marks</b><p><b>Use OSI to troubleshoot slow transfers, failed e-mail and poor video calls.</b> Draw the seven layers, describe each in a line, then map the symptoms:</p><ul><li><b>Slow file transfers</b>: physical (damaged cable, low bandwidth, noise), data link (collisions and frame errors forcing retransmission), network (congestion or a poor route), transport (TCP flow/congestion control throttling, retransmissions).</li><li><b>Failed e-mail delivery</b>: application (SMTP server or client settings, DNS lookup of the mail server), transport (port 25 connection refused or blocked), network (mail server unreachable).</li><li><b>Poor video calls</b>: jitter and delay at the network layer, packet loss at the transport layer (UDP does not retransmit), too little bandwidth at the physical layer; session drops point to the session layer, codec problems to presentation.</li></ul></div>
</section>

<section class="topic" id="c2-compare">
<h2>OSI versus TCP/IP</h2>
<p>Comparing the two, the <b>session and presentation layers are missing</b> from TCP/IP; its application layer is usually considered the combination of OSI layers 5, 6 and 7. Two reasons were given:</p>
<ol>
  <li>TCP/IP has more than one transport-layer protocol, and some session-layer functions are available in some of them.</li>
  <li>The application layer is not one piece of software; many applications are developed at this layer, and they can include session or presentation functions themselves.</li>
</ol>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>OSI (7 layers)</th><th>TCP/IP as five layers</th><th>Original four-layer TCP/IP</th></tr></thead>
<tbody>
<tr><td>7 Application · 6 Presentation · 5 Session</td><td>Application</td><td>Application</td></tr>
<tr><td>4 Transport</td><td>Transport</td><td>Host-to-host (transport)</td></tr>
<tr><td>3 Network</td><td>Network</td><td>Internet</td></tr>
<tr><td>2 Data link · 1 Physical</td><td>Data link · Physical</td><td>Network access (host-to-network)</td></tr>
</tbody></table></div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>OSI model</th><th>TCP/IP suite</th></tr></thead>
<tbody>
<tr><th>Developed by</th><td>ISO, late 1970s</td><td>The Internet community (ARPANET era), before OSI</td></tr>
<tr><th>Nature</th><td>A reference model; layers defined first, protocols later</td><td>A working protocol suite; protocols existed first</td></tr>
<tr><th>Layers</th><td>7</td><td>5 (or 4)</td></tr>
<tr><th>Session / presentation</th><td>Separate layers</td><td>Folded into the application layer</td></tr>
<tr><th>Use today</th><td>Teaching and troubleshooting framework</td><td>Runs the Internet</td></tr>
</tbody></table></div>
<h3 id="c2-osi-failure">Why OSI did not replace TCP/IP</h3>
<ol>
  <li>OSI was completed when TCP/IP was already fully in place; a lot of time and money had been spent on TCP/IP and changing it would cost a lot.</li>
  <li>Some OSI layers were never fully defined. For example, the presentation and session layers' services were listed, but their protocols were not fully defined or described and the software was not fully developed.</li>
  <li>When an organisation implemented OSI in a different application, it did not perform well enough to persuade the Internet authority to switch.</li>
</ol>
</section>

<section class="topic" id="c2-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>Explain the seven layers of the OSI model with a neat diagram. · 8–10 marks</summary><div class="body">
<p>Draw the seven-layer stack for two hosts with the peer-to-peer arrows. For each layer write its one-line responsibility (the "responsible for" column above) and two or three functions. Close with the OSI vs TCP/IP mapping. Use the data unit names: bits, frame, packet, segment, data.</p></div></details>
<details class="answer"><summary>Describe the layers of the TCP/IP protocol suite and their protocols. · 8 marks</summary><div class="body">
<p>Draw the five layers and the small internet (two hosts, two switches, one router) showing which layers each device uses. Describe each layer, its data unit and its protocols (IP, ARP, ICMP, IGMP; TCP, UDP, SCTP; SMTP, FTP, TELNET, DNS, SNMP, HTTP). State end-to-end vs hop-to-hop duties.</p></div></details>
<details class="answer"><summary>What is protocol layering? Explain its principles with the two scenarios. · 6 marks</summary><div class="body">
<p>Definition; first scenario (one layer, face to face) and second scenario (three layers: talk, encrypt, mail) with the sender and receiver flows; modularity; the two principles; logical connections; advantages and the disadvantage.</p></div></details>
<details class="answer"><summary>Explain encapsulation and decapsulation in TCP/IP. · 6 marks</summary><div class="body">
<p>Draw message → segment → datagram → frame at the source, decapsulate-then-encapsulate at the router (forwarding table, no change to the datagram unless fragmenting), and decapsulation with error checking at the destination. Add multiplexing/demultiplexing with the header field that identifies the upper protocol.</p></div></details>
<details class="answer"><summary>Explain the four levels of addresses used in TCP/IP with examples. · 6 marks</summary><div class="body">
<p>Physical/link (48-bit MAC, 07:01:02:01:2C:4B; changes hop to hop), logical/IP (32-bit, global), port (16-bit, e.g. 753; identifies a process), specific/application (e-mail address, URL). State which layer uses each and which addresses survive the whole path.</p></div></details>
</section>
`,
  quiz: [
    { q: 'The TCP/IP protocol suite, as compared with OSI, consists of how many layers?', o: ['2', '3', '5', '6'], a: 2, why: 'Physical, data link, network, transport and application.' },
    { q: 'A router is involved in how many layers of the TCP/IP suite?', o: ['2', '3', '4', '5'], a: 1, why: 'Network, data link and physical; it has no transport or application layer.' },
    { q: 'A link-layer switch is involved in how many layers?', o: ['2', '3', '4', '5'], a: 0, why: 'Data link and physical only.' },
    { q: 'In the TCP/IP suite, which of these is an application-layer protocol?', o: ['UDP', 'IP', 'FTP', 'TCP'], a: 2, why: 'FTP transfers files between hosts at the application layer.' },
    { q: 'The transport-layer packet in TCP/IP is called a', o: ['Message', 'Datagram', 'Segment / user datagram', 'Frame'], a: 2, why: 'TCP produces segments; UDP produces user datagrams.' },
    { q: 'Which layer moves frames from one hop (node) to the next?', o: ['Physical', 'Data link', 'Transport', 'Network'], a: 1, why: 'The data link layer is responsible for hop-to-hop delivery of frames.' },
    { q: 'Dialog control and synchronisation are functions of the', o: ['Transport layer', 'Session layer', 'Presentation layer', 'Application layer'], a: 1, why: 'The session layer is the network dialog controller and adds checkpoints.' },
    { q: 'Translation, compression and encryption belong to the', o: ['Session layer', 'Presentation layer', 'Data link layer', 'Network layer'], a: 1, why: 'The presentation layer deals with the syntax and semantics of the information.' },
    { q: 'Which address changes from hop to hop?', o: ['Port address', 'Logical (IP) address', 'Physical (MAC) address', 'Specific address'], a: 2, why: 'Each link uses its own link-layer addresses; IP and port addresses stay the same.' },
    { q: 'A port address in TCP/IP is how long?', o: ['8 bits', '16 bits', '32 bits', '48 bits'], a: 1, why: 'Port numbers range from 0 to 65,535.' },
    { q: 'Which pair of OSI layers is missing from the TCP/IP suite?', o: ['Network and transport', 'Session and presentation', 'Data link and physical', 'Transport and session'], a: 1, why: 'Their functions are folded into TCP/IP\'s application layer.' },
    { q: 'The second principle of protocol layering says', o: ['Each layer must do two opposite tasks', 'The objects under each layer at both sites must be identical', 'Every layer needs a header', 'Only the physical layer communicates directly'], a: 1, why: 'For example, both sites must have a plaintext letter under layer 3.' }
  ]
});
