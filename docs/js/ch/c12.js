DCN.register({
  id: 'c12', num: 12, part: 'B', layer: 'tl', unit: 'Module 4',
  title: 'Transport Layer: UDP and TCP',
  short: 'Transport layer',
  summary: 'Process-to-process delivery with port numbers and sockets, multiplexing, flow and error control, connectionless and connection-oriented service, UDP, TCP (segments, the three-way handshake, data transfer, termination, flow control, error control, RTT and time-out) and congestion control (principles, ATM ABR, AIMD, slow start, Tahoe and Reno, fast retransmit and recovery).',
  hot: ['IA-2 Q2', 'IA-2 Q5'],
  sources: ['CN_Modue-4_Transport Layer.pptx.pdf', 'Congestion Window.pptx', 'Fast retransmission and recovery.pptx', 'CN IA-2 imp ques notes.pdf', 'CN_Complete_Notes (Module 4)'],
  keywords: 'transport layer process-to-process logical communication segment port number ephemeral well-known registered dynamic ICANN ranges socket address encapsulation decapsulation multiplexing demultiplexing flow control pushing pulling buffers error control sequence number acknowledgment sliding window congestion connectionless connection-oriented FSM simple protocol stop-and-wait pipelining UDP user datagram 8-byte header length checksum pseudoheader queuing TFTP SNMP RIP multicasting best effort no frills TCP stream delivery byte number sequence number ISN acknowledgment number cumulative MSS full duplex segment format header length flags URG ACK PSH RST SYN FIN window size rwnd urgent pointer options three-way handshake SYN SYN+ACK passive open active open SYN flooding denial of service cookie push urgent data FIN half-close reset TIME_WAIT FIN_WAIT CLOSE_WAIT LAST_ACK opening closing windows shrinking window shutdown probing silly window syndrome Nagle Clark delayed acknowledgment SACK generating acknowledgments retransmission RTO three duplicate ACKs fast retransmission out-of-order RTT EstimatedRTT DevRTT TimeoutInterval congestion control end-end network-assisted ATM ABR RM cell NI CI ER EFCI cwnd ssthresh slow start congestion avoidance fast recovery Tahoe Reno NewReno AIMD sawtooth throughput 0.75 Wmax TCP vs UDP',
  html: `
<section class="topic" id="c12-intro">
<h2>Transport-layer services</h2>
<p>The transport layer is located between the application layer and the network layer. It provides <b>process-to-process communication</b> between two application layers, one at the local host and the other at the remote host. It is the <b>heart of the TCP/IP suite</b>: the end-to-end logical vehicle for transferring data. The two application layers assume an imaginary direct <b>logical connection</b> through which they send and receive messages.</p>
<ul>
  <li>Transport protocols run in the <b>end systems</b> only. The <b>send side</b> breaks application messages into <b>segments</b> and passes them to the network layer; the <b>receive side</b> reassembles segments into messages and passes them to the application layer.</li>
  <li>More than one transport protocol is available to applications. The Internet has two main ones: <b>TCP</b> (reliable, in-order delivery with congestion control, flow control and connection setup) and <b>UDP</b> (unreliable, unordered, "best-effort" delivery). SCTP is a newer protocol that combines features of both.</li>
</ul>
<div class="duo">
  <div class="card"><h4>Network layer</h4><p>Logical communication between <b>hosts</b>. It can deliver a message only to the destination computer: an incomplete delivery.</p></div>
  <div class="card"><h4>Transport layer</h4><p>Logical communication between <b>processes</b>. It relies on and enhances network-layer services, handing each message to the correct process.</p></div>
</div>
<div class="note tip"><b class="tag">Household analogy (slides)</b><p>12 kids in Ann's house send letters to 12 kids in Bill's house. <b>Hosts</b> = houses, <b>processes</b> = kids, <b>application messages</b> = letters in envelopes, <b>transport protocol</b> = Ann and Bill, who demultiplex to their in-house siblings, <b>network-layer protocol</b> = the postal service.</p></div>
</section>

<section class="topic" id="c12-ports">
<h2>Addressing: port numbers and socket addresses</h2>
<p>Process-to-process communication is most commonly achieved through the <b>client-server</b> paradigm: a process on the local host (the <b>client</b>) needs services from a process usually on a remote host (the <b>server</b>). We must define the local host, local process, remote host and remote process. Hosts are defined by <b>IP addresses</b>; processes by <b>port numbers</b>, 16-bit integers from <b>0 to 65,535</b>.</p>
<div class="duo">
  <div class="card"><h4>Ephemeral port (client)</h4><p>The client defines itself with an <b>ephemeral</b> ("short-lived") port number, because a client's life is normally short. It is recommended to be greater than 1023.</p></div>
  <div class="card"><h4>Well-known port (server)</h4><p>Servers use <b>universal</b> port numbers, the well-known ports, so clients know where to find them.</p></div>
</div>
<p>The destination IP address selects the <b>host</b> among all hosts in the world; then the port number selects <b>one of the processes</b> on that host.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>ICANN range</th><th>Ports</th><th>Meaning</th></tr></thead><tbody>
<tr><td><b>Well-known</b></td><td class="mono">0 – 1023</td><td>Assigned and controlled by ICANN</td></tr>
<tr><td><b>Registered</b></td><td class="mono">1024 – 49,151</td><td>Not assigned or controlled by ICANN; only registered with ICANN to prevent duplication</td></tr>
<tr><td><b>Dynamic (private)</b></td><td class="mono">49,152 – 65,535</td><td>Neither controlled nor registered; used as temporary or private ports</td></tr>
</tbody></table></div>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Well-known ports in this syllabus</th><th>Port</th><th>Transport</th></tr></thead><tbody>
<tr><td>FTP (data · control)</td><td class="mono">20 · 21</td><td>TCP</td></tr>
<tr><td>SSH</td><td class="mono">22</td><td>TCP</td></tr>
<tr><td>TELNET</td><td class="mono">23</td><td>TCP</td></tr>
<tr><td>SMTP</td><td class="mono">25</td><td>TCP</td></tr>
<tr><td>DNS</td><td class="mono">53</td><td>UDP (and TCP)</td></tr>
<tr><td>DHCP (server · client)</td><td class="mono">67 · 68</td><td>UDP</td></tr>
<tr><td>HTTP</td><td class="mono">80</td><td>TCP</td></tr>
<tr><td>POP3</td><td class="mono">110</td><td>TCP</td></tr>
<tr><td>BGP</td><td class="mono">179</td><td>TCP</td></tr>
<tr><td>RIP</td><td class="mono">520</td><td>UDP</td></tr>
</tbody></table></div>
<h3 id="c12-socket">Socket addresses</h3>
<p>The combination of an <b>IP address and a port number</b> is a <b>socket address</b>. The client socket address defines the client process uniquely, as the server socket address defines the server process. A transport-layer connection needs a <b>pair</b> of socket addresses: the IP addresses travel in the network-layer header and the port numbers in the transport-layer header.</p>
<h3 id="c12-encap">Encapsulation and decapsulation</h3>
<p>At the sender, a process passes the message to the transport layer with a pair of socket addresses; the transport layer adds its header. Transport-layer packets are called <b>user datagrams</b>, <b>segments</b> or <b>packets</b> depending on the protocol. At the receiver, the header is dropped and the message delivered to the process; the sender's socket address is passed along in case the process must reply.</p>
</section>

<section class="topic" id="c12-mux">
<h2>Multiplexing and demultiplexing</h2>
<p>An entity that accepts items from more than one source is <b>multiplexing</b> (many to one); one that delivers items to more than one destination is <b>demultiplexing</b> (one to many). The transport layer at the <b>source multiplexes</b>: several processes hand messages to one transport protocol. The transport layer at the <b>destination demultiplexes</b>: it uses the port numbers to hand each message to the right process.</p>
<div class="flow"><span>Processes P1, P2, P3</span><i>→</i><span><b>Multiplexer</b> (source transport layer)</span><i>→</i><span>IP</span><i>→</i><span><b>Demultiplexer</b> (destination transport layer)</span><i>→</i><span>Processes P1, P2, P3</span></div>
</section>

<section class="topic" id="c12-flowerr">
<h2>Flow control, error control and congestion control</h2>
<h3 id="c12-flow-basic">Flow control</h3>
<p>Whenever one entity produces items and another consumes them, the rates must balance. If items are produced faster than they are consumed, the consumer is overwhelmed and discards items; flow control prevents this loss.</p>
<ul>
  <li><b>Pushing</b>: the sender delivers items whenever they are produced, without a request. <b>Pulling</b>: the producer delivers after the consumer asks.</li>
  <li>At the transport layer there are four entities: sender process, sender transport layer, receiver transport layer, receiver process. The sending process only produces (pushes). The sending transport layer consumes and produces. The receiving transport layer consumes packets and produces messages. The receiving process normally <b>pulls</b>.</li>
  <li>So at least two flow controls are needed: from the sending transport layer to the sending application layer, and from the receiving transport layer to the sending transport layer.</li>
  <li>The usual solution is <b>two buffers</b>, one at each transport layer. When the sender's buffer is full, it tells the application to stop passing chunks; when the receiver's buffer is full, it tells the sending transport layer to stop sending. When space appears, they say so.</li>
</ul>
<h3 id="c12-error-basic">Error control</h3>
<p>IP is unreliable, so error control is added at the transport layer if the application needs reliability. It is responsible for:</p>
<ol><li>Detecting and discarding <b>corrupted</b> packets.</li><li>Keeping track of <b>lost and discarded</b> packets and resending them.</li><li>Recognising <b>duplicate</b> packets and discarding them.</li><li><b>Buffering out-of-order</b> packets until the missing ones arrive.</li></ol>
<ul>
  <li><b>Sequence numbers</b>: with m bits, numbers run from 0 to 2<sup>m</sup> − 1 and then wrap around (m = 4 gives 0 … 15, 0, 1, …). They let the receiver detect duplicates (same number) and out-of-order packets (gaps).</li>
  <li><b>Acknowledgments</b>: the receiver sends a positive ACK for packets that arrive safe and sound and simply discards corrupted ones. The sender detects loss with a <b>timer</b>: if no ACK arrives before it expires, the packet is resent.</li>
</ul>
<h3 id="c12-window">Combining them: the sliding window</h3>
<p>Flow control needs two buffers; error control needs sequence and acknowledgment numbers. Both are met with <b>two numbered buffers</b>. At the sender, a packet takes the number x of the next free buffer slot, and a copy stays in slot x until it is acknowledged. At the receiver, packet y is stored in slot y until the application takes it. Since sequence numbers are modulo 2<sup>m</sup>, the buffer is drawn as a circle; the part in use is the <b>sliding window</b>, shown in circular or linear format. When all slices are marked, the buffer is full.</p>
<h3 id="c12-cong-basic">Congestion</h3>
<p>Congestion occurs when the <b>load</b> on the network (packets sent) is greater than its <b>capacity</b> (packets it can handle). Routers and switches have queues; congestion at the transport layer is really congestion at the network layer showing itself at the transport layer. Congestion control keeps the load below capacity.</p>
</section>

<section class="topic" id="c12-conntypes">
<h2>Connectionless and connection-oriented service</h2>
<div class="duo">
  <div class="card"><h4>Connectionless</h4><p>The source process divides its message into chunks acceptable to the transport layer and delivers them one by one. The transport layer treats each chunk as a <b>single independent unit</b> with no relation to the others: packets are independent.</p></div>
  <div class="card"><h4>Connection-oriented</h4><p>Client and server first <b>establish a logical connection</b>; data is exchanged only after that, and the connection is then <b>torn down</b>. It involves only the two hosts (end to end), so it can run over either kind of network layer. Flow, error and congestion control can be implemented.</p></div>
</div>
<h3 id="c12-fsm">Finite state machine</h3>
<p>A transport layer can be described as an <b>FSM</b>: always in one of a finite number of states until an event occurs; each event triggers a list of actions and a next state. A connection-oriented transport layer passes through states before reaching <b>established</b> and before closing:</p>
<div class="flow"><span>CLOSED</span><i>→ open request sent →</i><span>OPEN-WAIT-I</span><i>→ ACK received →</i><span>OPEN-WAIT-II</span><i>→ peer's request, ACK sent →</i><span><b>ESTABLISHED</b></span></div>
<div class="flow" style="margin-top:8px"><span><b>ESTABLISHED</b></span><i>→ close request sent →</i><span>CLOSE-WAIT-I</span><i>→ ACK received →</i><span>CLOSE-WAIT-II</span><i>→ peer's close, ACK sent →</i><span>CLOSED</span></div>
<p class="small muted">In OPEN-WAIT-II a unidirectional connection exists; for a bidirectional one the machine waits there until the other end also requests a connection.</p>
<h3 id="c12-simple">Simple protocol and Stop-and-Wait</h3>
<div class="duo">
  <div class="card"><h4>Simple protocol</h4><p>Connectionless, with <b>neither flow nor error control</b>; the receiver is assumed never to be overwhelmed. Each side's FSM has one <b>ready</b> state: the sender waits for a message from its application, packs and sends it; the receiver waits for a packet, unpacks and delivers it. <b>UDP is a slight modification of this protocol.</b></p></div>
  <div class="card"><h4>Stop-and-Wait</h4><p>Connection-oriented, with flow and error control, using a sliding window of size 1. The sender sends one packet and waits for its ACK; a checksum detects corruption (corrupted packets are silently discarded); a timer triggers retransmission; sequence numbers modulo 2 detect duplicates; the ACK number announces the <b>next packet expected</b>. Very inefficient on a "thick and long" channel (large bandwidth-delay product). Pipelining (several packets before feedback) fixes this.</p></div>
</div>
<p>The full state machines, numbering, efficiency and the pipelined Go-Back-N and Selective-Repeat versions are covered with simulators in <a href="#c8-sw">Chapter 8</a>: the transport-layer versions work the same way.</p>
</section>

<section class="topic" id="c12-udp">
<h2>UDP: User Datagram Protocol</h2>
<p>UDP is a <b>connectionless, unreliable</b> transport protocol that adds process-to-process communication to IP's host-to-host delivery. It is a very simple protocol with a minimum of overhead: a process that wants to send a small message and does not care much about reliability can use it, with far less interaction between sender and receiver than TCP. The slides call it the "no frills", "bare bones" Internet transport protocol giving a <b>"best effort"</b> service: segments may be lost or delivered out of order.</p>
<h3 id="c12-udpfmt">User datagram format</h3>
<figure class="lab" data-widget="header" data-spec="udp"><figcaption><span class="ttl">UDP header: four 16-bit fields</span><span class="cap">Tap a field. The whole header is a fixed 8 bytes.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Field (16 bits each)</th><th>Purpose</th></tr></thead><tbody>
<tr><td><b>Source port number</b></td><td>Port of the sending process</td></tr>
<tr><td><b>Destination port number</b></td><td>Used to deliver the data to the correct process on the destination host</td></tr>
<tr><td><b>Length</b></td><td>Total length of the user datagram (header + data) in bytes: 16 bits can define 0 to 65,535</td></tr>
<tr><td><b>Checksum</b></td><td>Error detection over the pseudoheader, the header and the data</td></tr>
<tr><td>Application data</td><td>The message, carried in the data field</td></tr>
</tbody></table></div>
<h3 id="c12-udpsvc">UDP services</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Service</th><th>What UDP does</th></tr></thead><tbody>
<tr><td>Process-to-process</td><td>Uses socket addresses (IP address + port number)</td></tr>
<tr><td>Connectionless</td><td>Each user datagram is independent: not numbered, no connection establishment or termination, may take a different path. A process cannot send a stream and expect UDP to chop it into related datagrams.</td></tr>
<tr><td>Flow control</td><td>None, and no window mechanism: the receiver may overflow. The process must provide it if needed.</td></tr>
<tr><td>Error control</td><td>None except the <b>checksum</b>; a datagram with an error is <b>silently discarded</b>. The sender does not know of losses or duplicates.</td></tr>
<tr><td>Checksum</td><td>Covers a <b>pseudoheader</b> (part of the IP header, some fields set to 0), the UDP header and the data. Optional in UDP over IPv4.</td></tr>
<tr><td>Congestion control</td><td>None: UDP assumes its packets are small and sporadic. This may not hold for today's real-time audio and video.</td></tr>
<tr><td>Queuing</td><td>Queues are associated with ports; some implementations create an incoming and an outgoing queue per process, others only an incoming one.</td></tr>
<tr><td>Multiplexing and demultiplexing</td><td>One UDP serves several processes on a host</td></tr>
</tbody></table></div>
<h3 id="c12-udpcks">The UDP (Internet) checksum</h3>
<p>The sender treats the segment contents, including the header fields, as a sequence of <b>16-bit integers</b>, adds them in <b>1s complement</b> (a carry out of the most significant bit is wrapped around and added to the result) and puts the complement of the sum in the checksum field. The receiver computes the checksum of what it received and compares: if they differ, an error is detected; if they match, no error is detected (though errors are still possible).</p>
<div class="example"><p class="ex-q">Slide example: add the two 16-bit integers 1110011001100110 and 1101010101010101 and find the checksum.</p><ol class="steps">
  <li>Sum = 1 1011101110111011 (17 bits: a carry out of the top bit)</li>
  <li>Wrap the carry around: 1011101110111011 + 1 = <b>1011101110111100</b></li>
  <li>Checksum = 1s complement of the sum = <b>0100010001000011</b></li>
</ol><p class="ex-a">The receiver adds all words including the checksum; a result of all 1s means no error was detected</p></div>
<figure class="lab" data-widget="checksum" data-mode="inet"><figcaption><span class="ttl">Internet checksum calculator</span><span class="cap">Preloaded with the slide example; type your own 16-bit words in binary or 0x hex.</span></figcaption></figure>
<h3 id="c12-udpapps">Why and where UDP is used</h3>
<div class="duo">
  <div class="card"><h4>Why is there a UDP? (slides)</h4><ul><li>No connection establishment, which can add delay</li><li>Simple: no connection state at sender or receiver</li><li>Small header size</li><li>No congestion control: UDP can blast away as fast as desired</li></ul></div>
  <div class="card"><h4>Typical applications</h4><ul><li>Simple request-response with little concern for flow and error control (not bulk data like FTP)</li><li>Processes with their own flow and error control, e.g. <b>TFTP</b></li><li><b>Multicasting</b> (built into UDP, not TCP)</li><li>Management processes such as <b>SNMP</b>; route updating such as <b>RIP</b>; <b>DNS</b></li><li><b>Interactive real-time</b> and streaming multimedia (loss tolerant, rate sensitive)</li></ul></div>
</div>
<p>Reliable transfer over UDP is still possible by adding reliability at the <b>application layer</b> (application-specific error recovery).</p>
</section>

<section class="topic" id="c12-tcp">
<h2>TCP: services and features</h2>
<p>TCP is a <b>reliable, connection-oriented</b> protocol for any application where reliability is important.</p>
<div class="duo">
  <div class="card"><h4>Overview (slides)</h4><ul><li><b>Point-to-point</b>: one sender, one receiver</li><li><b>Reliable, in-order byte stream</b>: no "message boundaries"</li><li><b>Pipelined</b>: congestion and flow control set the window size</li><li><b>Full duplex</b>: bidirectional data in one connection; MSS = maximum segment size</li><li><b>Connection-oriented</b>: handshaking initialises sender and receiver state before data exchange</li><li><b>Flow controlled</b>: the sender will not overwhelm the receiver</li></ul></div>
  <div class="card"><h4>Services (notes)</h4><ul><li><b>Process-to-process</b> communication using port numbers</li><li><b>Stream delivery</b>: the two processes seem connected by an imaginary "tube" carrying bytes</li><li><b>Sending and receiving buffers</b> (circular arrays of byte locations), one for each direction</li><li><b>Segments</b>: TCP groups bytes into segments, adds a header and gives them to IP</li><li><b>Full-duplex</b>, with multiplexing and demultiplexing per connection</li><li><b>Connection-oriented</b> (logical connection, three phases) and <b>reliable</b> (acknowledgments)</li></ul></div>
</div>
<p>At the sender, the buffer has empty chambers (to be filled by the process), bytes <b>sent but not yet acknowledged</b> (kept until acknowledged) and bytes waiting to be sent. At the receiver, there are empty chambers and received bytes waiting to be read by the process. TCP's connection is <b>logical, not physical</b>: segments travel in IP datagrams that may be lost, corrupted or reordered, and TCP fixes this while IP is unaware.</p>
<h3 id="c12-numbering">Numbering: bytes, sequence numbers, acknowledgments</h3>
<ul>
  <li>There is no segment-number field. TCP numbers <b>every data byte</b>, independently in each direction, starting from an arbitrary number between 0 and 2<sup>32</sup> − 1: with first byte 1057 and 6000 bytes, the bytes are 1057 to 7056.</li>
  <li><b>Sequence number</b> of a segment = number of its <b>first data byte</b>. The first segment uses the <b>ISN</b> (initial sequence number), a random number; each later segment's number = previous sequence number + bytes carried by the previous segment. Some control segments count as carrying one imaginary byte.</li>
  <li><b>Acknowledgment number</b> = number of the <b>next byte</b> the party expects to receive, and it is <b>cumulative</b>: 5643 means all bytes up to 5642 have been received (not that 5642 bytes were received).</li>
</ul>
<div class="example"><p class="ex-q">A TCP connection transfers a file of 5000 bytes; the first byte is numbered 10001. Find the sequence numbers if the data is sent in five segments of 1000 bytes.</p><ol class="steps">
  <li>Segment 1: sequence number <b>10001</b>, bytes 10001 – 11000</li>
  <li>Segment 2: <b>11001</b>, bytes 11001 – 12000</li>
  <li>Segment 3: <b>12001</b>, bytes 12001 – 13000</li>
  <li>Segment 4: <b>13001</b>, bytes 13001 – 14000</li>
  <li>Segment 5: <b>14001</b>, bytes 14001 – 15000</li>
</ol><p class="ex-a">Each sequence number = previous + 1000</p></div>
<div class="example"><p class="ex-q">Slide example (telnet): user on host A types 'C'; host B echoes it back.</p><ol class="steps">
  <li>A → B: <span class="mono">Seq = 42, ACK = 79, data = 'C'</span></li>
  <li>B → A: <span class="mono">Seq = 79, ACK = 43, data = 'C'</span>: B acknowledges receipt of 'C' and echoes it</li>
  <li>A → B: <span class="mono">Seq = 43, ACK = 80</span>: A acknowledges receipt of the echoed 'C'</li>
</ol><p class="ex-a">ACK = sequence number of the next byte expected from the other side</p></div>
</section>

<section class="topic" id="c12-segment">
<h2>The TCP segment</h2>
<p>A TCP packet is a <b>segment</b>: a header of <b>20 to 60 bytes</b> (20 without options) followed by the application data. The segment is encapsulated in an IP datagram, which is encapsulated in a frame.</p>
<figure class="lab" data-widget="header" data-spec="tcp"><figcaption><span class="ttl">TCP header: tap any field</span><span class="cap">Five fixed rows (20 bytes) plus up to 40 bytes of options.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Field</th><th>Size</th><th>Purpose</th></tr></thead><tbody>
<tr><td>Source / destination port address</td><td>16 + 16 bits</td><td>Ports of the sending and receiving application programs</td></tr>
<tr><td>Sequence number</td><td>32 bits</td><td>Number of the first data byte in this segment; the ISN is chosen randomly at connection setup, usually different in each direction</td></tr>
<tr><td>Acknowledgment number</td><td>32 bits</td><td>Byte number the receiver expects next (x + 1 after receiving byte x); can be piggybacked with data</td></tr>
<tr><td>Header length</td><td>4 bits</td><td>Number of 4-byte words in the header: 5 (20 bytes) to 15 (60 bytes)</td></tr>
<tr><td>Control</td><td>6 bits</td><td>Six flags: <b>URG</b> (urgent pointer valid), <b>ACK</b> (acknowledgment valid), <b>PSH</b> (push data now), <b>RST</b> (reset), <b>SYN</b> (synchronise sequence numbers), <b>FIN</b> (terminate). They enable flow control, establishment and termination, abortion and the mode of transfer</td></tr>
<tr><td>Window size</td><td>16 bits</td><td>Receiving window <b>rwnd</b> in bytes (max 65,535), determined by the receiver; the sender must obey it</td></tr>
<tr><td>Checksum</td><td>16 bits</td><td>Same calculation as UDP with a pseudoheader (protocol value 6), but <b>mandatory</b> in TCP</td></tr>
<tr><td>Urgent pointer</td><td>16 bits</td><td>Valid only if URG is set: added to the sequence number gives the last urgent byte</td></tr>
<tr><td>Options</td><td>0–40 bytes</td><td>Optional information, e.g. the MSS negotiated at setup, SACK</td></tr>
</tbody></table></div>
<p class="small muted">The slides note that URG and PSH are generally not used, and that the receive window field gives the number of bytes the receiver is willing to accept.</p>
</section>

<section class="topic" id="c12-conn">
<h2>TCP connection establishment: the three-way handshake</h2>
<p>TCP is connection-oriented with three phases: <b>connection establishment</b>, <b>data transfer</b> and <b>connection termination</b>. Data flows in full-duplex, so each party must initialise communication and get the other's approval before data is transferred. Before exchanging data, sender and receiver "handshake": they agree to establish a connection (each knowing the other is willing) and agree on connection parameters (sequence numbers in each direction, buffer sizes).</p>
<figure class="lab" data-widget="seq" data-spec="tcp-open"><figcaption><span class="ttl">Diagram 1 · Connection establishment</span><span class="cap">Replay the three segments and watch the states change on each side.</span></figcaption></figure>
<p>The server first tells its TCP it is ready to accept a connection: a <b>passive open</b>. The client that wants to connect issues an <b>active open</b>. Then:</p>
<ol>
  <li><b>SYN</b> (client → server): only the SYN flag is set. It synchronises sequence numbers: the client picks a random <b>ISN</b>, seq = x. It carries no data but <b>consumes one sequence number</b> (one imaginary byte), because it must be acknowledged. Client state SYN-SENT.</li>
  <li><b>SYN + ACK</b> (server → client): a dual purpose. It is a SYN for the other direction (server ISN, seq = y), and it acknowledges the client's SYN (ACK flag, ack = x + 1). Also consumes one sequence number. Server state SYN-RCVD.</li>
  <li><b>ACK</b> (client → server): acknowledges the server's SYN (ack = y + 1, SYN bit 0). A pure ACK consumes no sequence number, though some implementations let it carry the client's first data. Both sides are now ESTABLISHED.</li>
</ol>
<div class="note tip"><b class="tag">From the IA-2 notes</b><p>Step 1: connection-request segment with SYN = 1 and the client ISN, encapsulated in an IP datagram. Step 2: connection-granted segment with SYN = 1, acknowledgment field = client_isn + 1 and the server ISN. Step 3: the client's ACK with SYN = 0, acknowledgment = server_isn + 1; the reliable connection is established.</p></div>
<h3 id="c12-why3">Why not a two-way handshake? (slides)</h3>
<p>Over a real network, delays vary, messages are retransmitted after loss and reordered, and neither side can "see" the other. With only req_conn(x) and acc_conn(x), an old retransmitted request can arrive after the client has finished and gone: the server accepts it and holds a <b>half-open connection</b> with no client, or even accepts duplicated old data as new. The third segment proves that the client is live and that the server's choice of sequence number was received.</p>
<h3 id="c12-synflood">SYN flooding attack</h3>
<p>Attackers send a large number of SYN segments to a server, each pretending to come from a different client by <b>faking the source IP address</b>. The server allocates resources (transfer control block tables, timers) and sends SYN + ACK segments to fake clients, which are lost; while it waits for the third leg, resources sit unused. If enough SYNs arrive, the server runs out of resources and refuses valid clients: a <b>denial-of-service attack</b>. Defences: limit connection requests in a time period, filter unwanted source addresses, or postpone resource allocation until the client is verified with a <b>cookie</b> (as SCTP does).</p>
</section>

<section class="topic" id="c12-data">
<h2>TCP data transfer</h2>
<p>Once the connection is established, data and acknowledgments flow in both directions. Data travelling in the same direction as an acknowledgment are carried in the same segment: the acknowledgment is <b>piggybacked</b>.</p>
<figure class="lab" data-widget="seq" data-spec="tcp-data"><figcaption><span class="ttl">Diagram 2 · Data transfer</span><span class="cap">The client sends 2,000 bytes in two segments, the server sends 2,000 bytes in one, and the client's last segment carries only an acknowledgment.</span></figcaption></figure>
<ul>
  <li>The first three segments carry both data and acknowledgments; the last carries only an ACK, because there is no more data.</li>
  <li>The client's data segments have the <b>PSH</b> flag set, so the server TCP delivers the data to the server process as soon as it arrives. The server's segment does not set it (implementations may or may not).</li>
</ul>
<div class="duo">
  <div class="card"><h4>Pushing data</h4><p>Normally the sending TCP chooses the segment size and the receiving TCP delivers when convenient, which is efficient. When an application cannot accept delay (e.g. interactive use), it requests a <b>push</b>: the sending TCP must not wait for the window to fill, but create a segment and send it immediately with the <b>PSH</b> bit, telling the receiving TCP to deliver it as soon as possible.</p></div>
  <div class="card"><h4>Urgent data</h4><p>To send bytes that must be treated specially, the application marks them urgent; TCP puts them at the <b>beginning</b> of a segment with the <b>URG</b> bit set, and the <b>urgent pointer</b> marks the end. With sequence number 15000 and urgent pointer 200, urgent data runs from byte <b>15000 to 15200</b>; the rest of the segment is normal data.</p></div>
</div>
</section>

<section class="topic" id="c12-close">
<h2>TCP connection termination</h2>
<p>Either party can close the connection, though usually the client does. Implementations offer <b>three-way handshaking</b>, or <b>four-way handshaking with a half-close</b>.</p>
<figure class="lab" data-widget="seq" data-spec="tcp-close3"><figcaption><span class="ttl">Diagram 3 · Connection termination (three-way)</span><span class="cap">FIN, FIN + ACK, ACK.</span></figcaption></figure>
<ol>
  <li>After a close command from its process, the client TCP sends a <b>FIN</b> segment (FIN flag set). It may carry the client's last data; if it is only a control segment it consumes <b>one sequence number</b>.</li>
  <li>The server TCP informs its process and sends <b>FIN + ACK</b>, confirming the client's FIN and announcing its own close. It may carry the server's last data; otherwise it consumes one sequence number.</li>
  <li>The client sends the last <b>ACK</b>, with acknowledgment number = 1 + the sequence number of the server's FIN. It cannot carry data and consumes no sequence number.</li>
</ol>
<h3 id="c12-halfclose">Half-close and the closing states</h3>
<p>In a <b>half-close</b>, one end stops sending data while still receiving. Example: <b>sorting</b>. The client sends all its data and half-closes with a FIN; the server ACKs it but keeps its own direction open, sorts, sends the sorted data, then sends its FIN, which the client acknowledges. After the half-close, data travels only from server to client and acknowledgments from client to server.</p>
<figure class="lab" data-widget="seq" data-spec="tcp-close"><figcaption><span class="ttl">Four-segment close with states (slides)</span><span class="cap">FIN_WAIT_1, FIN_WAIT_2, CLOSE_WAIT, LAST_ACK and TIME_WAIT.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Client state</th><th>Meaning</th><th>Server state</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="mono">FIN_WAIT_1</td><td>Sent FIN (clientSocket.close()); can no longer send but can receive data</td><td class="mono">CLOSE_WAIT</td><td>Got the FIN, sent the ACK; can still send data</td></tr>
<tr><td class="mono">FIN_WAIT_2</td><td>Got the ACK; waits for the server to close</td><td class="mono">LAST_ACK</td><td>Sent its own FIN; can no longer send data</td></tr>
<tr><td class="mono">TIMED_WAIT</td><td>Got the server's FIN and sent the last ACK; waits 2 × maximum segment lifetime</td><td class="mono">CLOSED</td><td>Got the last ACK</td></tr>
</tbody></table></div>
<p>Rules (slides): client and server each close their side by sending a segment with <b>FIN = 1</b>; a received FIN is answered with an ACK, which can be combined with one's own FIN; simultaneous FIN exchanges can be handled.</p>
<div class="note def"><b class="tag">Connection reset</b><p>TCP at one end may deny a connection request, abort an existing connection or terminate an idle connection. All of these use the <b>RST</b> (reset) flag.</p></div>
</section>

<section class="topic" id="c12-flowctl">
<h2>TCP flow control</h2>
<p>Flow control balances the rate at which a producer creates data with the rate at which a consumer can use it. TCP separates flow control from error control (assume an error-free channel for now). Data travels sending process → sending TCP → receiving TCP → receiving process (paths 1, 2, 3); flow-control feedback travels from the receiving TCP to the sending TCP and from the sending TCP to the sending process (paths 4, 5). <b>The receiving TCP controls the sending TCP; the sending TCP controls the sending process</b> (by refusing data when its window is full).</p>
<h3 id="c12-windows">Opening and closing windows</h3>
<ul>
  <li>Buffer sizes are fixed at connection setup, but the <b>window sizes</b> are adjusted.</li>
  <li>The <b>receive window</b> closes when more bytes arrive from the sender and opens when the process pulls bytes. It does not shrink.</li>
  <li>The <b>send window</b> is controlled by the receiver: it <b>closes</b> when a new acknowledgment allows it, <b>opens</b> when the advertised rwnd allows (new ackNo + new rwnd &gt; last ackNo + last rwnd), and <b>shrinks</b> otherwise.</li>
</ul>
<figure class="lab" data-widget="seq" data-spec="tcp-flow"><figcaption><span class="ttl">Flow-control scenario: eight segments</span><span class="cap">rwnd goes 800 → 600 → 400 → 600 as the server buffer fills and its process pulls data.</span></figcaption></figure>
<h3 id="c12-shrink">Shrinking of windows and window shutdown</h3>
<div class="formula"><code class="f">new ackNo + new rwnd ≥ last ackNo + last rwnd</code><span class="where">The receiver must keep this relation so that the right wall of the send window never moves to the left. Calculations are modulo 2<sup>32</sup>.</span></div>
<div class="example"><p class="ex-q">The last acknowledgment was ackNo = 206 with rwnd = 12. The receiver now wants to send ackNo = 210 with rwnd = 4. Is this allowed?</p><ol class="steps"><li>Old right wall = 206 + 12 = 218; new right wall = 210 + 4 = 214</li><li>214 &lt; 218: the right wall would move left, so the send window would <b>shrink</b></li></ol><p class="ex-a">Not allowed: the receiver must advertise rwnd ≥ 8 with ackNo 210</p></div>
<p><b>Window shutdown</b> is the one exception: the receiver can temporarily send <b>rwnd = 0</b> if it does not want data for a while. The sender does not shrink its window but stops sending until a new advertisement arrives. Even then it can always send a segment with <b>1 byte</b> of data, called <b>probing</b>, to prevent a deadlock.</p>
<h3 id="c12-sws">Silly window syndrome</h3>
<p>If the sending application creates data slowly, or the receiving application consumes it slowly, data travels in very small segments. A segment with 1 byte of data in a 41-byte datagram (20 bytes TCP header + 20 bytes IP header + 1 byte of data) has an overhead of 41/1: the network capacity is used very inefficiently.</p>
<div class="duo">
  <div class="card"><h4>Created by the sender: Nagle's algorithm</h4><ol><li>Send the first piece of data even if it is only 1 byte.</li><li>Then accumulate data in the output buffer and wait until <b>either</b> an acknowledgment arrives <b>or</b> enough data has accumulated to fill a maximum-size segment; then send.</li><li>Repeat step 2 for the rest of the transmission.</li></ol></div>
  <div class="card"><h4>Created by the receiver: two solutions</h4><p>If the receiver consumes 1 byte at a time from a full 4 KB buffer, it would advertise a 1-byte window and get 1-byte segments.</p><ol><li><b>Clark's solution</b>: acknowledge as soon as data arrive, but announce a <b>window of zero</b> until there is room for a maximum-size segment or at least half the buffer is empty.</li><li><b>Delayed acknowledgment</b>: wait until there is a decent amount of space before acknowledging, so the sender cannot slide its window. It also reduces traffic, but may cause unnecessary retransmissions, so an ACK should not be delayed by more than <b>500 ms</b>.</li></ol></div>
</div>
</section>

<section class="topic" id="c12-errctl">
<h2>TCP error control</h2>
<p>TCP is reliable: it detects and resends corrupted segments, resends lost segments, stores out-of-order segments until the missing ones arrive, and detects and discards duplicates. It uses three simple tools: <b>checksum</b>, <b>acknowledgment</b> and <b>time-out</b>.</p>
<ul>
  <li><b>Checksum</b>: a mandatory 16-bit checksum in every segment. A corrupted segment is discarded and treated as lost.</li>
  <li><b>Acknowledgment</b>: confirms data segments and control segments that consume a sequence number. <b>ACK segments are never acknowledged.</b></li>
  <li><b>Cumulative acknowledgment (ACK)</b>: the receiver advertises the next byte it expects, ignoring segments stored out of order ("positive cumulative acknowledgment"). The 32-bit ACK field is valid only when the ACK flag is 1.</li>
  <li><b>Selective acknowledgment (SACK)</b>: reports blocks of bytes that arrived out of order or were duplicated. It does not replace ACK and is implemented as an <b>option</b> at the end of the header.</li>
</ul>
<h3 id="c12-ackrules">When does a receiver generate acknowledgments?</h3>
<ol>
  <li>When A sends data to B, it must <b>piggyback</b> an acknowledgment of the next sequence number it expects (reduces traffic).</li>
  <li>With no data to send, an in-order segment arriving when the previous one is already acknowledged: <b>delay</b> the ACK until another segment arrives or about <b>500 ms</b> pass.</li>
  <li>An expected segment arrives while the previous in-order segment is unacknowledged: send an ACK <b>immediately</b>. There should never be more than two in-order unacknowledged segments.</li>
  <li>An <b>out-of-order</b> segment with a higher sequence number arrives: immediately send an ACK announcing the next expected segment. This leads to <b>fast retransmission</b>.</li>
  <li>A <b>missing segment</b> arrives: send an ACK announcing the next sequence number expected.</li>
  <li>A <b>duplicate</b> segment arrives: discard it but immediately ACK the next in-order segment expected (fixes problems when an ACK was lost).</li>
</ol>
<h3 id="c12-retrans">Retransmission and fast retransmit</h3>
<p>A sent segment is stored in a queue until acknowledged. It is retransmitted when the <b>retransmission timer</b> expires, or when the sender receives <b>three duplicate ACKs</b> for the first segment in the queue.</p>
<div class="duo">
  <div class="card"><h4>Retransmission after RTO</h4><p>One retransmission time-out (RTO) per connection. When it expires, TCP resends the segment at the front of the queue (smallest sequence number) and restarts the timer. RTO is dynamic, based on the round-trip time (RTT).</p></div>
  <div class="card"><h4>After three duplicate ACKs</h4><p>Time-outs can be long. If an original ACK plus three identical copies arrive, the missing segment is retransmitted <b>immediately</b>, without waiting for the time-out: <b>fast retransmission</b>.</p></div>
</div>
<figure class="lab" data-widget="seq" data-spec="fast-rtx"><figcaption><span class="ttl">Fast retransmit with a lost segment (from the slides)</span><span class="cap">Segment 2 is lost; the receiver keeps asking for byte 100 until the sender resends it.</span></figcaption></figure>
<p><b>Out-of-order segments</b> are not discarded today: they are stored and flagged until the missing segments arrive, but no out-of-order data is ever delivered to the process. So TCP behaves like <b>Selective Repeat</b> (it keeps out-of-order segments) with a slight similarity to <b>Go-Back-N</b> (its original ACKs are cumulative); with SACK it is closest to SR.</p>
<h3 id="c12-rtt">Round-trip time and time-out (slides)</h3>
<p>The time-out must be longer than the RTT, but the RTT varies. Too short gives premature time-outs and unnecessary retransmissions; too long gives a slow reaction to segment loss. <b>SampleRTT</b> is the measured time from sending a segment until its ACK is received (ignoring retransmissions); it varies, so a smoother average is kept:</p>
<div class="fgrid">
  <div class="formula"><code class="f">EstimatedRTT = (1 − α) · EstimatedRTT + α · SampleRTT</code><span class="where">Exponentially weighted moving average; typical α = 0.125</span></div>
  <div class="formula"><code class="f">DevRTT = (1 − β) · DevRTT + β · |SampleRTT − EstimatedRTT|</code><span class="where">Deviation of SampleRTT from EstimatedRTT; typical β = 0.25</span></div>
  <div class="formula"><code class="f">TimeoutInterval = EstimatedRTT + 4 · DevRTT</code><span class="where">The estimate plus a "safety margin": larger variation, larger margin</span></div>
</div>
<figure class="lab" data-widget="rtt"><figcaption><span class="ttl">RTT and time-out calculator</span><span class="cap">Enter the initial values and a list of SampleRTTs; every step is shown.</span></figcaption></figure>
<details class="solution"><summary>Practice: EstimatedRTT = 100 ms, DevRTT = 5 ms, then SampleRTT = 106 ms. Find the new values and the time-out.</summary><div class="body"><p>EstimatedRTT = 0.875 × 100 + 0.125 × 106 = 87.5 + 13.25 = <b>100.75 ms</b>. DevRTT = 0.75 × 5 + 0.25 × |106 − 100.75| = 3.75 + 1.3125 = <b>5.0625 ms</b>. TimeoutInterval = 100.75 + 4 × 5.0625 = <b>121 ms</b>.</p></div></details>
</section>

<section class="topic" id="c12-congestion">
<h2>Principles of congestion control</h2>
<p>Informally, congestion is "too many sources sending too much data too fast for the network to handle". It is <b>different from flow control</b> (which protects the receiver). It shows up as <b>lost packets</b> (buffer overflow at routers) and <b>long delays</b> (queueing in router buffers). A top-10 problem.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Scenario (slides)</th><th>Setting</th><th>Cost of congestion</th></tr></thead><tbody>
<tr><td><b>1</b></td><td>Two senders, two receivers, one router with infinite buffers, output link capacity R, no retransmission</td><td>Per-connection throughput is at most R/2, and delays become <b>very large</b> as the arrival rate λ<sub>in</sub> approaches capacity</td></tr>
<tr><td><b>2</b></td><td>One router with <b>finite</b> buffers; the sender retransmits timed-out packets, so the transport-layer input λ′<sub>in</sub> includes retransmissions</td><td>More work (retransmissions) for a given "goodput"; premature time-outs send <b>unneeded duplicates</b> that the link carries, decreasing goodput</td></tr>
<tr><td><b>3</b></td><td>Four senders, multihop paths, time-out and retransmit</td><td>As one flow's traffic grows, the other flow's packets are dropped at the shared queue and its throughput goes to 0; when a packet is dropped, any <b>upstream transmission capacity</b> used for it was wasted</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>End-end congestion control</h4><p>No explicit feedback from the network; congestion is <b>inferred</b> from observed loss and delay at the end systems. <b>This is the approach taken by TCP.</b></p></div>
  <div class="card"><h4>Network-assisted congestion control</h4><p>Routers give feedback to end systems: a single bit indicating congestion (SNA, DECbit, TCP/IP ECN, ATM), or an <b>explicit rate</b> for the sender to send at.</p></div>
</div>
<h3 id="c12-abr">Case study: ATM ABR congestion control</h3>
<ul>
  <li><b>ABR (available bit rate)</b> is an "elastic service": if the sender's path is underloaded, the sender should use the available bandwidth; if congested, it is throttled to its minimum guaranteed rate.</li>
  <li><b>RM (resource management) cells</b> are sent by the sender, interspersed with data cells. Switches set bits in them ("network-assisted"): <b>NI</b> (no increase in rate: mild congestion) and <b>CI</b> (congestion indication). The receiver returns RM cells to the sender with the bits intact.</li>
  <li>A two-byte <b>ER (explicit rate)</b> field in the RM cell: a congested switch may lower it, so the sender's rate becomes the maximum supportable rate on the path.</li>
  <li><b>EFCI</b> bit in data cells: set to 1 by a congested switch; if the data cell before an RM cell has EFCI set, the receiver sets CI in the returned RM cell.</li>
</ul>
</section>

<section class="topic" id="c12-tcpcc">
<h2>TCP congestion control</h2>
<p>The receiver's rwnd protects the receiver, but not the <b>routers in the middle</b>: a router receiving from many senders can be overwhelmed and drop segments, and more loss means more retransmissions, more congestion and finally collapse. IP has no congestion control, so <b>TCP</b> must handle it: speed up when there is no congestion, slow down when it is detected. It uses a second variable, the <b>congestion window, cwnd</b>.</p>
<div class="formula"><code class="f">Actual window size = minimum (rwnd, cwnd)</code><span class="where">rwnd: congestion at the end (the receiver), advertised by the receiver · cwnd: congestion in the middle (the network), a TCP state variable that limits how much data can be sent before an ACK arrives</span></div>
<h3 id="c12-detect">Congestion detection</h3>
<div class="duo">
  <div class="card"><h4>Time-out: strong congestion</h4><p>No ACK before the time-out: the segments are assumed lost because of congestion.</p></div>
  <div class="card"><h4>Three duplicate ACKs: weak congestion</h4><p>Four ACKs with the same number: one segment is missing but three later ones arrived, so the network is only slightly congested or has recovered.</p></div>
</div>
<p>The sender uses only one feedback to detect congestion: <b>ACKs</b>. Tahoe TCP treats both signals the same; Reno TCP treats them differently.</p>
<h3 id="c12-ss">Slow start: exponential increase</h3>
<p>cwnd starts at <b>1 MSS</b> (the MSS is negotiated at setup with an option of that name) and <b>increases by 1 MSS each time an ACK arrives</b>. One segment is sent; its ACK makes cwnd 2; two ACKs make it 4; then 8 … so cwnd <b>doubles every RTT</b>. The name is misleading: it starts slowly but grows exponentially. It stops at the <b>slow-start threshold, ssthresh</b>. (Slides: done by incrementing cwnd for every ACK; initial rate slow but ramps up exponentially fast.)</p>
<div class="formula"><code class="f">If an ACK arrives: cwnd = cwnd + 1   →   after n RTTs, cwnd = 2<sup>n</sup></code></div>
<h3 id="c12-ca">Congestion avoidance: additive increase</h3>
<p>To avoid congestion before it happens, once cwnd reaches ssthresh TCP grows <b>additively</b>: each time a whole window of segments is acknowledged, cwnd increases by 1. Starting at cwnd = 4, four ACKs make it 5, five more ACKs make it 6, and so on: linear growth per RTT.</p>
<div class="formula"><code class="f">If an ACK arrives: cwnd = cwnd + (1 / cwnd)</code></div>
<h3 id="c12-fr">Fast recovery</h3>
<p>Optional in TCP. It starts when three duplicate ACKs arrive (light congestion). It is also additive, but increases cwnd when a duplicate ACK arrives (after the three that triggered it): cwnd = cwnd + (1 / cwnd).</p>
<h3 id="c12-versions">Tahoe, Reno and NewReno</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Version</th><th>On time-out</th><th>On three duplicate ACKs</th></tr></thead><tbody>
<tr><td><b>Tahoe TCP</b></td><td colspan="2">Uses only slow start and congestion avoidance, and treats both signals the same: <b>ssthresh = cwnd / 2, cwnd = 1</b>, and a new slow start. In congestion avoidance, a congestion event again halves ssthresh and returns to slow start (e.g. ssthresh 8, congestion at cwnd = 20 → new ssthresh = 10, so ssthresh can also increase).</td></tr>
<tr><td><b>Reno TCP</b></td><td>ssthresh = cwnd / 2, cwnd = 1, <b>slow start</b></td><td>Moves to the <b>fast-recovery</b> state with cwnd = ssthresh + 3 MSS. More duplicate ACKs: stay, cwnd grows. A time-out: slow start. A new (non-duplicate) ACK: congestion avoidance with cwnd deflated to ssthresh.</td></tr>
<tr><td><b>NewReno TCP</b></td><td>As Reno</td><td>Also checks whether more than one segment of the window was lost: if the new ACK points inside the window, that segment is retransmitted too, to avoid more duplicate ACKs.</td></tr>
</tbody></table></div>
<div class="note remember"><b class="tag">Slides summary</b><p><b>Loss indicated by time-out</b>: cwnd set to 1 MSS; the window then grows exponentially (as in slow start) up to the threshold, then linearly. <b>Loss indicated by 3 duplicate ACKs (TCP Reno)</b>: duplicate ACKs show the network can still deliver some segments, so cwnd is cut in half and then grows linearly. <b>TCP Tahoe</b> always sets cwnd to 1 (time-out or 3 duplicate ACKs).</p></div>
<figure class="lab" data-widget="cwnd"><figcaption><span class="ttl">Congestion-window lab: Tahoe versus Reno</span><span class="cap">Add time-outs or triple duplicate ACKs at any round and compare the two versions; the round-by-round table is ready for an exam answer.</span></figcaption></figure>
<h3 id="c12-aimd">AIMD and TCP throughput</h3>
<p>Reno is the most common version, and most congestion is detected by three duplicate ACKs. Ignoring slow start and short fast-recovery periods, cwnd = cwnd + 1/cwnd per ACK (<b>additive increase</b>: +1 MSS every RTT until loss is detected) and cwnd = cwnd / 2 on congestion (<b>multiplicative decrease</b>). The result is the <b>AIMD sawtooth</b>: TCP keeps probing for usable bandwidth.</p>
<div class="formula"><code class="f">Throughput = 0.75 × W<sub>max</sub> / RTT</code><span class="where">If cwnd were flat, throughput = cwnd / RTT. With a sawtooth whose minimum is half its maximum, the average is (max + min)/2 = 0.75 W<sub>max</sub>, where W<sub>max</sub> is the average window size when congestion occurs.</span></div>
<div class="example"><p class="ex-q">MSS = 10 KB and RTT = 100 ms. Congestion occurred at window sizes 10, 12, 10, 8 and 8 MSS. Find the throughput.</p><ol class="steps">
  <li>W<sub>max</sub> = (10 + 12 + 10 + 8 + 8) / 5 = 48 / 5 = <b>9.6 MSS</b> = 96 KB</li>
  <li>Throughput = 0.75 × 96 KB / 0.1 s = 720 KB/s</li>
  <li>In bits: 720 × 1000 × 8 = <b>5.76 Mbps</b></li>
</ol><p class="ex-a">About 5.76 Mbps (720 kilobytes per second)</p></div>
<div class="note warn"><b class="tag">Heads-up</b><p>The complete notes (copying the textbook) write "0.75 × 960 kbps / 100 ms = 7.2 Mbps". 9.6 MSS × 10 KB is 96 KB = 768 kilobits, not 960, so the consistent answer is 5.76 Mbps. In an exam, show the formula, W<sub>max</sub> and each unit conversion so the method earns full marks.</p></div>
<div class="note warn"><b class="tag">Heads-up</b><p>The congestion-window lab slides say that after a loss or three duplicate ACKs "the congestion has dropped to zero". What drops is the <b>congestion window</b>: to 1 MSS in Tahoe (and after a time-out), or to half in Reno, never to zero. The same slides also give: ssthresh starts equal to the receiver window; slow start while cwnd &lt; ssthresh; congestion avoidance when cwnd ≥ ssthresh.</p></div>
</section>

<section class="topic" id="c12-vs">
<h2>TCP versus UDP</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Feature</th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Connection</td><td>Connection-oriented: three-way handshake, termination</td><td>Connectionless: no handshaking</td></tr>
<tr><td>Reliability</td><td>Reliable: ACKs, retransmission of lost or corrupted segments</td><td>Unreliable: best effort; lost datagrams are not resent</td></tr>
<tr><td>Ordering</td><td>In-order byte stream; out-of-order segments are buffered</td><td>Unordered, independent datagrams, not numbered</td></tr>
<tr><td>Unit and header</td><td>Segment, header 20–60 bytes</td><td>User datagram, fixed 8-byte header</td></tr>
<tr><td>Flow control</td><td>Yes: rwnd, sliding window</td><td>None</td></tr>
<tr><td>Error control</td><td>Checksum (mandatory), ACK, time-out, retransmission</td><td>Checksum only (optional over IPv4); errors are silently discarded</td></tr>
<tr><td>Congestion control</td><td>Yes: cwnd, slow start, AIMD</td><td>None: can send as fast as it wants</td></tr>
<tr><td>Speed and overhead</td><td>More overhead and setup delay</td><td>Fast, minimal overhead</td></tr>
<tr><td>Multicasting</td><td>No</td><td>Yes</td></tr>
<tr><td>Typical uses</td><td>HTTP, FTP, SMTP, TELNET, SSH, BGP</td><td>DNS, DHCP, SNMP, RIP, TFTP, streaming and real-time media</td></tr>
</tbody></table></div>
<div class="note exam"><b class="tag">IA-2 Q5 · Advantages of TCP over UDP (IA-2 notes)</b><ol><li><b>Reliability</b>: TCP ensures reliable delivery by retransmitting lost or corrupted packets, which UDP does not.</li><li><b>Data integrity</b>: TCP delivers data in the correct order, maintaining the sequence of the transmitted packets.</li><li><b>Connection-oriented</b>: TCP establishes a connection before data transfer, so both sender and receiver are ready.</li><li><b>Error checking</b>: TCP detects errors and automatically recovers by retransmitting the affected packets.</li><li><b>Flow control</b>: TCP adjusts the data flow between sender and receiver so the receiver is not overwhelmed (and, separately, congestion control protects the network).</li></ol></div>
<div class="note warn"><b class="tag">Heads-up</b><p>The IA-2 notes describe flow control as preventing "network congestion". Strictly, <b>flow control</b> protects the <b>receiver</b> (rwnd) and <b>congestion control</b> protects the <b>network</b> (cwnd). Mention both to be safe.</p></div>
</section>

<section class="topic" id="c12-exam">
<h2>Exam corner</h2>
<div class="note exam"><b class="tag">IA-2 important questions 2 and 5</b><p><b>Q2</b>: TCP with three diagrams: connection establishment, data transfer and connection termination (use the three replayable diagrams above). <b>Q5</b>: advantages of TCP over UDP, and the UDP segment structure.</p></div>
<details class="answer"><summary>Explain the services of the transport layer. · 8 marks</summary><div class="body"><p>Process-to-process communication; port numbers (ephemeral, well-known, ICANN ranges); socket addresses; encapsulation and decapsulation; multiplexing and demultiplexing; flow control (pushing/pulling, buffers); error control (four duties, sequence numbers, ACKs); sliding window; congestion control; connectionless vs connection-oriented service.</p></div></details>
<details class="answer"><summary>Explain the UDP user datagram format and its services. List applications of UDP. · 6–8 marks</summary><div class="body"><p>Draw the 8-byte header (source port, destination port, length, checksum: 16 bits each) and describe each field; services: process-to-process, connectionless, no flow control, checksum-only error control with pseudoheader, no congestion control, queuing, multiplexing; why UDP exists; applications (TFTP, SNMP, RIP, DNS, multicasting, real-time).</p></div></details>
<details class="answer"><summary><span class="chip hot">IA-2 Q2</span> Explain TCP connection establishment, data transfer and termination with diagrams. · 10 marks</summary><div class="body"><p><b>Establishment</b>: passive and active open, SYN (seq = x, consumes one number), SYN + ACK (seq = y, ack = x + 1), ACK (ack = y + 1), with the states. <b>Data transfer</b>: the four-segment example with piggybacked ACKs and PSH, plus push and urgent data. <b>Termination</b>: FIN, FIN + ACK, ACK (three-way) and the half-close version with FIN_WAIT/CLOSE_WAIT/TIME_WAIT. Add SYN flooding for a bonus line.</p></div></details>
<details class="answer"><summary>Explain the TCP segment format. · 8 marks</summary><div class="body"><p>The 32-bit-row diagram, each field with its size and role, the six flags, rwnd, mandatory checksum with pseudoheader, urgent pointer and options; then byte numbering, sequence and acknowledgment numbers with the 10001 example.</p></div></details>
<details class="answer"><summary>Explain TCP flow control and the silly window syndrome. · 8 marks</summary><div class="body"><p>Paths 1–5; opening, closing and shrinking windows; the eight-segment scenario; the no-shrink inequality; window shutdown and probing; silly window syndrome with Nagle's algorithm, Clark's solution and delayed ACK (≤ 500 ms).</p></div></details>
<details class="answer"><summary>Explain TCP error control: acknowledgments, retransmission and fast retransmit. · 8 marks</summary><div class="body"><p>Checksum, ACK, time-out; cumulative ACK and SACK; the six ACK-generation rules; retransmission after RTO and after three duplicate ACKs with the lost-segment diagram; out-of-order segments; RTT estimation formulas.</p></div></details>
<details class="answer"><summary>Explain TCP congestion control: slow start, congestion avoidance, fast recovery, Tahoe and Reno. · 10 marks</summary><div class="body"><p>cwnd, rwnd and actual window = min; detection by time-out and three duplicate ACKs; slow start (cwnd + 1 per ACK, doubling per RTT, ssthresh); congestion avoidance (+1 per RTT); fast recovery; the Tahoe/Reno table; an AIMD sawtooth graph with rounds; throughput 0.75 W<sub>max</sub>/RTT.</p></div></details>
<details class="answer"><summary>Explain the principles of congestion control and the ATM ABR case study. · 6–8 marks</summary><div class="body"><p>Definition and manifestations; the three scenarios and their costs; end-end vs network-assisted approaches; ABR elastic service, RM cells with NI and CI bits, ER field and EFCI bit.</p></div></details>
<details class="answer"><summary><span class="chip hot">IA-2 Q5</span> List the advantages of TCP over UDP. Explain the UDP segment. · 6 marks</summary><div class="body"><p>The five advantages (reliability, ordered delivery, connection-oriented, error checking and recovery, flow control) plus congestion control; then the UDP segment diagram with source port, destination port, length and checksum, and the application data field.</p></div></details>
</section>
`,
  quiz: [
    { q: 'The transport layer provides logical communication between', o: ['Hosts', 'Processes', 'Routers', 'Links'], a: 1, why: 'The network layer connects hosts; the transport layer connects processes.' },
    { q: 'Port numbers in the range 49,152–65,535 are', o: ['Well-known', 'Registered', 'Dynamic (private)', 'Reserved for TCP'], a: 2, why: 'Well-known 0–1023, registered 1024–49,151.' },
    { q: 'A socket address is', o: ['A MAC address plus a port', 'An IP address plus a port number', 'Two port numbers', 'An IP address plus a protocol'], a: 1, why: 'A connection needs a pair of socket addresses.' },
    { q: 'The UDP header is', o: ['4 bytes', '8 bytes', '20 bytes', '20–60 bytes'], a: 1, why: 'Four 16-bit fields.' },
    { q: 'Which statement about UDP is true?', o: ['It numbers its datagrams', 'It provides flow control', 'A datagram with a checksum error is silently discarded', 'It needs a three-way handshake'], a: 2, why: 'Checksum is its only error control.' },
    { q: 'Which protocol is a slight modification of the simple (connectionless, no flow or error control) protocol?', o: ['TCP', 'UDP', 'SCTP', 'Stop-and-Wait'], a: 1, why: 'As stated in the notes.' },
    { q: 'A file of 5000 bytes starts at byte 10001 and is sent in 1000-byte segments. The third segment\'s sequence number is', o: ['12000', '12001', '13001', '3'], a: 1, why: '10001, 11001, 12001, …' },
    { q: 'An acknowledgment number of 5643 means', o: ['5643 bytes received', 'All bytes up to 5642 received', 'Byte 5643 received', 'Segment 5643 lost'], a: 1, why: 'It is the next byte expected, and cumulative.' },
    { q: 'A SYN segment carries no data but', o: ['Consumes one sequence number', 'Consumes no sequence number', 'Must carry the MSS', 'Is never acknowledged'], a: 0, why: 'It counts as one imaginary byte because it must be acknowledged.' },
    { q: 'In the three-way handshake, the server\'s segment is', o: ['SYN', 'ACK', 'SYN + ACK', 'FIN + ACK'], a: 2, why: 'It opens the server direction and acknowledges the client SYN.' },
    { q: 'A SYN flooding attack works by', o: ['Sending FINs to close connections', 'Sending many SYNs with fake source addresses', 'Flooding ACKs', 'Shrinking the window'], a: 1, why: 'The server allocates resources for half-open connections: denial of service.' },
    { q: 'With sequence number 15000 and urgent pointer 200, the last urgent byte is', o: ['200', '15000', '15200', '14800'], a: 2, why: 'Urgent pointer + sequence number.' },
    { q: 'The receiver advertises rwnd = 0. The sender', o: ['Closes the connection', 'Shrinks its buffer', 'Stops sending but may probe with 1 byte', 'Retransmits everything'], a: 2, why: 'Window shutdown; probing prevents deadlock.' },
    { q: 'Nagle\'s algorithm solves the silly window syndrome created by', o: ['The receiver', 'The sender', 'The router', 'The checksum'], a: 1, why: 'Clark\'s solution and delayed ACK handle the receiver side.' },
    { q: 'Fast retransmission is triggered by', o: ['One duplicate ACK', 'Three duplicate ACKs', 'A time-out', 'A SYN'], a: 1, why: 'The missing segment is resent without waiting for the timer.' },
    { q: 'TimeoutInterval equals', o: ['EstimatedRTT', 'EstimatedRTT + 4·DevRTT', '2·SampleRTT', 'EstimatedRTT + DevRTT'], a: 1, why: 'Estimate plus a safety margin.' },
    { q: 'TCP\'s actual send window is', o: ['rwnd', 'cwnd', 'min(rwnd, cwnd)', 'rwnd + cwnd'], a: 2, why: 'Receiver limit and network limit together.' },
    { q: 'During slow start, cwnd', o: ['Increases by 1 per RTT', 'Doubles every RTT', 'Stays at 1', 'Halves every RTT'], a: 1, why: '+1 MSS per ACK means doubling per round.' },
    { q: 'On three duplicate ACKs, TCP Reno', o: ['Sets cwnd = 1', 'Halves the window and enters fast recovery', 'Closes the connection', 'Ignores them'], a: 1, why: 'Tahoe would set cwnd to 1.' },
    { q: 'TCP congestion control is', o: ['Network-assisted', 'End-end', 'Done by IP', 'Done by the receiver only'], a: 1, why: 'Congestion is inferred from loss and delay.' }
  ]
});
