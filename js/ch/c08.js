DCN.register({
  id: 'c8', num: 8, part: 'B', layer: 'dll', unit: 'Module 2',
  title: 'Data Link Control: Framing, ARQ, HDLC and PPP',
  short: 'Data link control',
  summary: 'Node-to-node delivery over one link: framing with byte and bit stuffing, flow and error control, the Stop-and-Wait, Go-Back-N and Selective Repeat ARQ protocols with their efficiency, and the HDLC and PPP protocols.',
  hot: ['IA-1 Q4a', 'IA-1 Q7a', 'IA-1 Q8a'],
  sources: ['2-module 2.pptx', 'CN-BCS502-Module2-RajeshL.pdf', 'cn_module2 (naveen notes).pdf', 'CN_Complete_Notes', 'IA-1 answer scheme.pdf'],
  keywords: 'DLC framing fixed variable character-oriented byte stuffing escape bit-oriented bit stuffing flag 01111110 flow control error control buffer connectionless connection-oriented FSM simple protocol stop-and-wait ARQ sequence number acknowledgment piggybacking efficiency bandwidth-delay utilisation go-back-N sliding window send window receive window selective repeat NAK HDLC NRM ABM I-frame S-frame U-frame RR RNR REJ SREJ SABM UA DISC PPP LCP PAP CHAP NCP IPCP transition phases dead establish authenticate network open terminate',
  html: `
<section class="topic" id="c8-services">
<h2>DLC services and framing</h2>
<p>The data-link layer has two main functions: <b>data link control (DLC)</b> and media access control. DLC deals with communication between two adjacent nodes (<b>node-to-node</b>): framing, flow and error control, and the software protocols that give smooth, reliable transmission of frames between nodes.</p>
<p>The physical layer moves bits as a signal. The data-link layer must pack bits into <b>frames</b> so each frame is distinguishable from the next, just as an envelope separates one letter from another. Framing adds a <b>sender address</b> and a <b>destination address</b>: the destination address says where the packet goes; the sender address lets the recipient acknowledge it.</p>
<div class="duo">
  <div class="card"><h4>Fixed-size framing</h4><p>No boundary markers are needed: the size itself acts as the delimiter (e.g. ATM cells).</p></div>
  <div class="card"><h4>Variable-size framing</h4><p>Needs a way to mark the end of one frame and the start of the next. Two approaches: <b>character-oriented</b> and <b>bit-oriented</b>.</p></div>
</div>
<h3 id="c8-byte">Character-oriented framing and byte stuffing</h3>
<p>Data are carried as 8-bit characters. The header carries the source and destination addresses and other control information; the trailer carries error-detection bits. A 1-byte <b>flag</b> of protocol-dependent special characters marks the beginning and end of each frame.</p>
<p>Problem: if the flag pattern appears inside the data, the receiver thinks the frame has ended. Fix: <b>byte stuffing</b>. A special <b>escape character (ESC)</b> is stuffed before any byte in the data that looks like a flag. The receiver removes the ESC and treats the next byte as data. If ESC itself appears in the text, another ESC is added before it.</p>
<div class="note remember"><b class="tag">Byte stuffing</b><p>Adding 1 extra byte (ESC) whenever there is a flag or escape character in the text.</p></div>
<h3 id="c8-bit">Bit-oriented framing and bit stuffing</h3>
<p>The data section is a sequence of bits. Most protocols use the 8-bit flag <b>01111110</b> to mark the start and end of a frame. If the flag pattern appears in the data, <b>bit stuffing</b> prevents it from looking like a flag.</p>
<div class="note remember"><b class="tag">Bit stuffing</b><p>Adding one extra <b>0</b> whenever <b>five consecutive 1s follow a 0</b> in the data, so that the receiver never mistakes the pattern 0111110 for a flag. The receiver removes the 0 that follows five 1s.</p></div>
<figure class="lab" data-widget="stuffing"><figcaption><span class="ttl">Byte and bit stuffing</span><span class="cap">Type data and see exactly where the extra 0s or ESC bytes go.</span></figcaption></figure>
</section>

<section class="topic" id="c8-flow">
<h2>Flow control and error control</h2>
<p>The most important responsibilities of the data-link layer are <b>flow control</b> and <b>error control</b>; together they are called data link control.</p>
<div class="duo">
  <div class="card"><h4>Flow control</h4><p>A set of procedures that <b>restricts how much data the sender can send before waiting for an acknowledgment</b>. Four entities are involved: the network and data-link layers at the sending and receiving nodes. If the receiving node cannot process frames as fast as they arrive, it is overwhelmed, so it gives feedback to stop or slow the sender. Flow control is implemented with <b>buffers</b>: memory locations that hold packets; when the receiver's buffer is full it tells the sender to stop.</p></div>
  <div class="card"><h4>Error control</h4><p>Based on <b>automatic repeat request (ARQ)</b>: retransmission of data. Two ways to implement it:</p><ul><li>a corrupted frame is silently discarded; an uncorrupted one is delivered to the network layer;</li><li>a corrupted frame is silently discarded; for an uncorrupted one an <b>acknowledgment</b> is sent to the sender (serving both flow and error control).</li></ul></div>
</div>
<p><b>Combining them</b>: the acknowledgment sent for flow control can also tell the sender that the packet arrived uncorrupted; no ACK means a problem.</p>
<div class="duo">
  <div class="card"><h4>Connectionless DLC</h4><p>Frames are sent from one node to the next with no relationship between them; each is independent. Frames are not numbered and there is no sense of order.</p></div>
  <div class="card"><h4>Connection-oriented DLC</h4><p>A logical connection is first set up between the two nodes (setup phase); related frames are transmitted (transfer phase); then the connection is torn down (teardown phase). Frames are numbered and sent in order.</p></div>
</div>
</section>

<section class="topic" id="c8-protocols">
<h2>Data-link protocols and FSMs</h2>
<p>Four protocols are traditionally defined for flow and error control: <b>Simple</b>, <b>Stop-and-Wait</b>, <b>Go-Back-N</b> and <b>Selective Repeat</b>. Your slides group them by channel type:</p>
<div class="duo">
  <div class="card"><h4>Noiseless channels</h4><p>Ideal: no frame is lost, duplicated or corrupted.</p><ul><li>Simplest protocol</li><li>Stop-and-Wait protocol</li></ul></div>
  <div class="card"><h4>Noisy channels</h4><p>Real: frames can be lost or corrupted, so error control is added.</p><ul><li>Stop-and-Wait ARQ</li><li>Go-Back-N ARQ</li><li>Selective Repeat ARQ</li></ul></div>
</div>
<p>A protocol's behaviour is shown as a <b>finite state machine (FSM)</b>: a machine with a finite number of states that stays in one state until an <b>event</b> occurs. Each event triggers a list of <b>actions</b> and a move to the next state (possibly the same one). One state is the <b>initial state</b>. States are drawn as rounded rectangles, events in colour, actions in black, with arrows to the next state.</p>
<h3 id="c8-simple">The simple (simplest) protocol</h3>
<p>No flow or error control; unidirectional (data frames go only from sender to receiver); the receiver is assumed to handle every frame immediately. Both FSMs have a single <b>ready</b> state. The sender waits for a request from its network layer, encapsulates the message in a frame and sends it. The receiver waits for a frame, decapsulates it and delivers it. Sending three frames means three events at each site; the sender never thinks about the receiver.</p>
<h3 id="c8-sw">The Stop-and-Wait protocol</h3>
<p>Uses both flow and error control. The sender sends <b>one frame at a time and waits for an acknowledgment</b> before sending the next. A CRC is added to each frame; a corrupted frame is silently discarded, and the receiver's silence tells the sender the frame was lost or corrupted.</p>
<div class="duo">
  <div class="card"><h4>Sender FSM</h4><ul><li><b>Ready state</b>: waiting for a packet from the network layer. When one comes: create a frame, <b>save a copy</b>, start the only timer, send the frame, move to blocking.</li><li><b>Blocking state</b>: (a) time-out → resend the saved copy, restart the timer; (b) corrupted ACK → discard it; (c) error-free ACK → stop the timer, discard the copy, go back to ready.</li></ul></div>
  <div class="card"><h4>Receiver FSM</h4><ul><li>Always in the ready state.</li><li>Error-free frame → deliver the message to the network layer and send an ACK.</li><li>Corrupted frame → discard it.</li></ul></div>
</div>
<p><b>The duplicate problem</b>: if an ACK is lost, the sender times out and resends, and the receiver's network layer gets two copies (like ordering an item twice). The fix is <b>sequence numbers</b> on data frames and <b>acknowledgment numbers</b> on ACKs. They are simply 0, 1, 0, 1… (modulo 2), and <b>the acknowledgment number always names the sequence number of the next frame expected</b>.</p>
<h3 id="c8-piggy">Piggybacking</h3>
<p>To make bidirectional protocols efficient, a frame carrying data from A to B also carries control information (acknowledgments) about frames that arrived from B, and vice versa. This is <b>piggybacking</b>.</p>
</section>

<section class="topic" id="c8-arq">
<h2>Stop-and-Wait ARQ</h2>
<p>Stop-and-Wait ARQ adds error control to Stop-and-Wait for noisy channels:</p>
<ul>
  <li>The sender <b>keeps a copy</b> of each frame and starts a timer. <b>Error correction is done by retransmitting the copy when the timer expires.</b></li>
  <li>Frames carry <b>sequence numbers modulo 2</b> (0, 1, 0, 1…).</li>
  <li>The <b>acknowledgment number announces, modulo 2, the sequence number of the next frame expected</b> (ACK 1 after frame 0, ACK 0 after frame 1).</li>
  <li>A corrupted or lost frame is never acknowledged; a duplicate (after a lost ACK) is discarded but acknowledged again.</li>
</ul>
<figure class="lab" data-widget="arq" data-proto="sw" data-scen="ack" data-k="2"><figcaption><span class="ttl">ARQ simulator</span><span class="cap">Pick a protocol and make a frame or an ACK disappear. Open the step-by-step explanation under the timeline.</span></figcaption></figure>
<div class="example"><p class="ex-q">Trace Stop-and-Wait ARQ when frame 1 is lost and later an ACK is lost.</p><ol class="steps"><li>Frame 0 is sent and acknowledged with ACK 1.</li><li>Frame 1 is lost; the timer expires and frame 1 is resent; ACK 0 arrives and the timer stops.</li><li>Frame 0 is sent and arrives, but its ACK 1 is lost.</li><li>The sender cannot tell whether the frame or the ACK was lost, so after the time-out it resends frame 0.</li><li>The receiver sees a duplicate (it expects frame 1), discards it and resends ACK 1.</li></ol><p class="ex-a">Sequence numbers let the receiver reject the duplicate.</p></div>
<h3 id="c8-efficiency">Efficiency of Stop-and-Wait</h3>
<p>Your handwritten notes derive the efficiency from the cycle for one frame: transmission time T<sub>t</sub>, propagation T<sub>p</sub>, (processing and the tiny ACK time ignored), and the ACK's propagation T<sub>p</sub>.</p>
<div class="fgrid">
  <div class="formula"><code class="f">η = T<sub>t</sub> / (T<sub>t</sub> + 2T<sub>p</sub>) = 1 / (1 + 2a)</code><span class="where">a = T<sub>p</sub> / T<sub>t</sub> · T<sub>t</sub> = L / B (frame size / bandwidth) · T<sub>p</sub> = distance / speed</span></div>
  <div class="formula"><code class="f">Throughput = η × B</code><span class="where">also called bandwidth utilisation or effective bandwidth</span></div>
</div>
<div class="example"><p class="ex-q">In a Stop-and-Wait ARQ system the bandwidth is 1 Mbps and 1 bit takes 20 ms to make a round trip. What is the bandwidth-delay product? With 1000-bit frames, what is the link utilisation?</p><ol class="steps"><li>BDP = (1 × 10⁶) × (20 × 10⁻³) = 20,000 bits</li><li>The system could send 20,000 bits during a round trip, but sends only 1000.</li><li>Utilisation = 1000 / 20,000</li></ol><p class="ex-a">5%. For a link with high bandwidth or long delay, Stop-and-Wait wastes the link's capacity.</p></div>
<div class="example"><p class="ex-q">What is the utilisation for the same link if a protocol can send up to 15 frames before stopping to wait for acknowledgments?</p><ol class="steps"><li>BDP is still 20,000 bits.</li><li>15 frames = 15,000 bits per round trip.</li></ol><p class="ex-a">15,000 / 20,000 = 75% (less if damaged frames must be resent). This is why sliding-window protocols exist.</p></div>
<figure class="lab" data-widget="sweff" data-l="1000" data-b="1" data-rtt="20" data-w="1"><figcaption><span class="ttl">Link utilisation calculator</span><span class="cap">Set the window to 15 to reproduce the second example. Shows the textbook ratio and the exact cycle formula.</span></figcaption></figure>
<div class="note exam"><b class="tag">IA-1 Q7a · 6 marks</b><p><b>How does Stop-and-Wait ARQ ensure reliable transmission and handle loss or errors?</b> Reliable transmission: one frame at a time, a CRC in each frame, a kept copy and a timer, ACK numbers naming the next frame expected. Handling loss and errors: (1) a corrupted frame is discarded silently, so no ACK comes and the timer causes a resend; (2) a lost frame leads to the same time-out and resend; (3) a lost ACK causes a resend of a frame the receiver already has; modulo-2 sequence numbers let it detect and discard the duplicate and re-acknowledge. Draw two timelines: one with a lost frame, one with a lost ACK.</p></div>
</section>

<section class="topic" id="c8-gbn">
<h2>Go-Back-N ARQ</h2>
<p>To improve efficiency, Go-Back-N lets the sender keep <b>several frames outstanding</b> (sent but not yet acknowledged) while waiting, so the channel stays busy. It is a <b>sliding window</b> protocol.</p>
<ul>
  <li><b>Sequence numbers are modulo 2<sup>m</sup></b>, where m is the size of the sequence-number field in bits (m = 2 gives 0, 1, 2, 3, 0, 1…).</li>
  <li>The <b>send window</b> is an imaginary box of size up to <b>2<sup>m</sup> − 1</b> with three variables: <b>S<sub>f</sub></b> (first outstanding frame), <b>S<sub>n</sub></b> (next frame to send) and <b>S<sub>size</sub></b>. It can slide one or more slots when a valid acknowledgment arrives.</li>
  <li>The <b>receive window</b> has size <b>1</b>: a single variable <b>R<sub>n</sub></b>, the frame expected next. It slides one slot each time a correct frame arrives.</li>
  <li>The receiver accepts frames <b>only in order</b> and sends an ACK for each one; acknowledgments are <b>cumulative</b> (ACK k means all frames before k arrived). If a frame is lost or corrupted, the receiver <b>discards all subsequent frames</b> and does not acknowledge them.</li>
  <li>One timer runs for the first outstanding frame. When it expires, the sender <b>goes back</b> and resends <b>all</b> outstanding frames from S<sub>f</sub> to S<sub>n</sub> − 1.</li>
</ul>
<figure class="lab" data-widget="arq" data-proto="gbn" data-scen="frame" data-k="2"><figcaption><span class="ttl">Go-Back-N in the three IA-1 scenarios</span><span class="cap">Switch between “All frames arrive”, “A frame is lost” and “An ACK is lost”.</span></figcaption></figure>
<div class="note warn"><b class="tag">Why the send window must be less than 2<sup>m</sup></b><p>Take m = 2 (sequence numbers 0–3). With window size 3: the sender sends frames 0, 1, 2; all ACKs are lost; after the time-out it resends frame 0. The receiver expects frame 3, so it correctly discards the duplicate. With window size 4: frames 0, 1, 2, 3 are sent and all ACKs are lost; the receiver now expects frame 0 of the <i>next</i> cycle, so it <b>wrongly accepts</b> the resent old frame 0 as new. Hence S<sub>size</sub> ≤ 2<sup>m</sup> − 1.</p></div>
<div class="note exam"><b class="tag">IA-1 Q4a · 6 marks</b><p><b>Analyse Go-Back-N with flow and timeline diagrams when (i) all frames arrive, (ii) some frames are lost, (iii) an acknowledgment is lost.</b> 2 marks each. Draw the sender's window (S<sub>f</sub>, S<sub>n</sub>) above the timeline.</p><ul><li><b>(i) No loss</b>: frames 0, 1, 2 go out back to back; ACK 1, 2, 3 return; the window slides by one for each ACK and new frames are sent.</li><li><b>(ii) Frame lost</b>: frame 2 is lost; frames 3 and 0 arrive out of order and are discarded (no ACK). The timer for frame 2 expires and the sender resends frames 2, 3, 0: it goes back N.</li><li><b>(iii) ACK lost</b>: the ACK for frame 2 is lost, but the next cumulative ACK covers it, so nothing is resent. Only if no later ACK arrives before the time-out are the outstanding frames resent.</li></ul><p class="small">Your handwritten notes add: the minimum number of sequence numbers is 2 (= W<sub>s</sub> + W<sub>r</sub>) for Stop-and-Wait and W<sub>s</sub> + 1 for Go-Back-N, i.e. W<sub>s</sub> ≤ 2<sup>m</sup> − 1.</p></div>
</section>

<section class="topic" id="c8-sr">
<h2>Selective Repeat ARQ</h2>
<p>Go-Back-N is simple, but on a noisy link it wastes bandwidth resending frames that arrived safely. <b>Selective Repeat</b> resends <b>only the damaged frame</b>.</p>
<ul>
  <li>The send window and the receive window have the <b>same size</b>, at most <b>2<sup>m−1</sup></b> (half the sequence space).</li>
  <li>The receiver <b>accepts out-of-order frames</b> that fall inside its window and <b>buffers</b> them; it delivers data to the network layer only when a consecutive run starting at R<sub>n</sub> is complete.</li>
  <li>When a frame is missing, the receiver sends a <b>NAK</b> (negative acknowledgment) for it, once per window position. The sender resends only that frame. Each frame has its own timer.</li>
</ul>
<figure class="lab" data-widget="arq" data-proto="sr" data-scen="frame" data-k="2"><figcaption><span class="ttl">Selective Repeat with a lost frame</span><span class="cap">Notice the NAK and that only the missing frame is resent.</span></figcaption></figure>
<div class="note warn"><b class="tag">Why the window is at most 2<sup>m−1</sup></b><p>With m = 2, a window of 2: frames 0 and 1 are sent and both ACKs are lost; frame 0 is resent; the receiver's window now covers 2 and 3, so the old frame 0 is correctly discarded. With a window of 3: frames 0, 1, 2 are sent and ACKs are lost; the receiver's window is now 3, 0, 1, so the resent old frame 0 is <b>wrongly accepted</b> as new.</p></div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Stop-and-Wait ARQ</th><th>Go-Back-N ARQ</th><th>Selective Repeat ARQ</th></tr></thead>
<tbody>
<tr><th>Send window</th><td>1</td><td>≤ 2<sup>m</sup> − 1</td><td>≤ 2<sup>m−1</sup></td></tr>
<tr><th>Receive window</th><td>1</td><td>1</td><td>same as send window</td></tr>
<tr><th>Out-of-order frames</th><td>—</td><td>Discarded</td><td>Buffered</td></tr>
<tr><th>On loss, resend</th><td>The one frame</td><td>All outstanding frames</td><td>Only the lost frame</td></tr>
<tr><th>Acknowledgment</th><td>Next frame expected (mod 2)</td><td>Cumulative ACK</td><td>ACK (cumulative) and NAK</td></tr>
<tr><th>Timers</th><td>One</td><td>One (oldest outstanding frame)</td><td>One per frame</td></tr>
<tr><th>Efficiency / complexity</th><td>Lowest / simplest</td><td>Good / simple receiver</td><td>Best on noisy links / most complex</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c8-hdlc">
<h2>HDLC</h2>
<p><b>High-level Data Link Control (HDLC)</b> is a <b>bit-oriented</b> protocol for communication over <b>point-to-point and multipoint</b> links. It implements the Stop-and-Wait protocol (with sliding-window variants through its control fields).</p>
<div class="duo">
  <div class="card"><h4>Normal response mode (NRM)</h4><p>An <b>unbalanced</b> configuration: one <b>primary</b> station that can send commands and several <b>secondary</b> stations that can only respond. Used for point-to-point and multipoint links.</p></div>
  <div class="card"><h4>Asynchronous balanced mode (ABM)</h4><p>A <b>balanced</b> configuration: a point-to-point link where each station is both primary and secondary (peers). This is the common mode today.</p></div>
</div>
<h3 id="c8-hdlc-frames">Frames</h3>
<ul>
  <li><b>I-frames</b> (information): carry user data and control information relating to it (piggybacking).</li>
  <li><b>S-frames</b> (supervisory): carry only control information (flow and error control when piggybacking is impossible).</li>
  <li><b>U-frames</b> (unnumbered): reserved for system management; they manage the link itself.</li>
</ul>
<figure class="lab" data-widget="header" data-spec="hdlc"><figcaption><span class="ttl">HDLC frame fields</span><span class="cap">Tap a field for its job.</span></figcaption></figure>
<ul>
  <li><b>Flag</b> (8 bits, 01111110): identifies the beginning and end of the frame and is a synchronisation pattern for the receiver.</li>
  <li><b>Address</b>: the secondary station's address; a "to" address when the primary sends, a "from" address when a secondary sends. One byte or several.</li>
  <li><b>Control</b> (1 or 2 bytes): flow and error control; its meaning depends on the frame type.</li>
  <li><b>Information</b>: user data from the network layer or management information; variable length.</li>
  <li><b>FCS</b> (frame check sequence): 2- or 4-byte ITU-T CRC.</li>
</ul>
<figure class="lab" data-widget="header" data-spec="hdlc-ctl"><figcaption><span class="ttl">The three control-field formats</span><span class="cap">The first one or two bits tell the receiver which kind of frame it is.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Frame</th><th>Control field</th><th>Meaning</th></tr></thead>
<tbody>
<tr><th>I-frame</th><td class="mono">0 · N(S) · P/F · N(R)</td><td>First bit 0. N(S) (3 bits) = sequence number; N(R) (3 bits) = acknowledgment number when piggybacking. P/F has meaning only when set: <b>poll</b> when sent by the primary to a secondary, <b>final</b> when sent by a secondary to the primary.</td></tr>
<tr><th>S-frame</th><td class="mono">10 · code · P/F · N(R)</td><td>No information field. N(R) is an ACK or NAK depending on the 2-bit code: <b>00 RR</b> receive ready (ACK); <b>10 RNR</b> receive not ready (ACK, but stop sending); <b>01 REJ</b> reject (NAK used in Go-Back-N); <b>11 SREJ</b> selective reject (NAK used in Selective Repeat).</td></tr>
<tr><th>U-frame</th><td class="mono">11 · code · P/F · code</td><td>A 2-bit prefix and a 3-bit suffix make up to 32 U-frame types for session management, e.g. <b>SABM</b>, <b>UA</b>, <b>DISC</b>.</td></tr>
</tbody></table></div>
<p><b>Connection with U-frames</b>: node A asks for a connection with a <b>SABM</b> (set asynchronous balanced mode) frame; node B answers with <b>UA</b> (unnumbered acknowledgment). Data is exchanged, then A sends <b>DISC</b> (disconnect) and B confirms with <b>UA</b>.</p>
</section>

<section class="topic" id="c8-ppp">
<h2>Point-to-Point Protocol (PPP)</h2>
<p>HDLC works for both point-to-point and multipoint links, but the most common protocol for <b>point-to-point access</b> is <b>PPP</b>. Millions of Internet users connect their home computers to an ISP's server through PPP.</p>
<div class="duo">
  <div class="card"><h4>Services PPP provides</h4><ol><li>Defines the format of the frame exchanged between devices.</li><li>Defines how two devices negotiate the establishment of the link and the exchange of data.</li><li>Defines how network-layer data are encapsulated in the frame.</li><li>Defines how two devices authenticate each other.</li><li>Provides multiple network-layer services, supporting many network-layer protocols.</li><li>Provides connections over multiple links (Multilink PPP).</li><li>Provides network address configuration: useful when a home user needs a temporary address.</li></ol></div>
  <div class="card"><h4>Services left out (to keep it simple)</h4><ol><li><b>No flow control</b>: a sender can send frames one after another without worrying about the receiver's buffer.</li><li><b>Very simple error control</b>: a CRC detects errors and a corrupted frame is silently discarded; upper layers must deal with it.</li><li><b>No sophisticated addressing</b> for multipoint configurations.</li></ol></div>
</div>
<h3 id="c8-ppp-frame">PPP frame</h3>
<p>PPP is a <b>byte-oriented</b> (character-oriented) protocol.</p>
<figure class="lab" data-widget="header" data-spec="ppp"><figcaption><span class="ttl">PPP frame format</span><span class="cap">Tap a field for its job.</span></figcaption></figure>
<ul>
  <li><b>Flag</b>: one byte <b>01111110</b> at the start and end; treated as a byte.</li>
  <li><b>Address</b>: the constant <b>11111111</b> (broadcast address); the two parties may agree to omit it.</li>
  <li><b>Control</b>: the constant <b>11000000</b>, imitating HDLC; PPP provides no flow control and only limited error control.</li>
  <li><b>Protocol</b>: what the data field carries, user data or other information; 2 bytes by default, 1 byte if negotiated.</li>
  <li><b>Payload</b>: user data or other information; default maximum <b>1500 bytes</b>, negotiable. It is byte-stuffed if the flag pattern appears; padding is needed because no field gives its size.</li>
  <li><b>FCS</b>: a standard 2- or 4-byte CRC.</li>
</ul>
<div class="note remember"><b class="tag">Byte stuffing in PPP</b><p>The flag is a byte, so it must be escaped whenever it appears in the data. PPP is a byte-oriented protocol using byte stuffing with the <b>escape byte 01111101</b>: stuffed before a flag-like byte to tell the receiver that the next byte is not a flag.</p></div>
<h3 id="c8-ppp-phases">Transition phases</h3>
<figure class="fig">
<svg viewBox="0 0 660 230" role="img" aria-label="PPP transition phase diagram">
  <defs><marker id="c8a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--ink-2)"/></marker></defs>
  <g style="font-size:13px;font-weight:700">
    <rect x="20" y="30" width="100" height="40" rx="20" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="70" y="55" text-anchor="middle">Dead</text>
    <rect x="200" y="30" width="110" height="40" rx="20" style="fill:var(--dll);fill-opacity:.15;stroke:var(--dll)"/><text x="255" y="55" text-anchor="middle">Establish</text>
    <rect x="400" y="30" width="130" height="40" rx="20" style="fill:var(--dll);fill-opacity:.15;stroke:var(--dll)"/><text x="465" y="55" text-anchor="middle">Authenticate</text>
    <rect x="400" y="160" width="130" height="40" rx="20" style="fill:var(--dll);fill-opacity:.15;stroke:var(--dll)"/><text x="465" y="185" text-anchor="middle">Network</text>
    <rect x="200" y="160" width="110" height="40" rx="20" style="fill:var(--net);fill-opacity:.18;stroke:var(--net)"/><text x="255" y="185" text-anchor="middle">Open</text>
    <rect x="20" y="160" width="100" height="40" rx="20" style="fill:var(--exam);fill-opacity:.12;stroke:var(--exam)"/><text x="70" y="185" text-anchor="middle">Terminate</text>
  </g>
  <g style="stroke:var(--ink-2);stroke-width:1.6;fill:none" marker-end="url(#c8a)">
    <line x1="120" y1="50" x2="196" y2="50" marker-end="url(#c8a)"/>
    <line x1="310" y1="50" x2="396" y2="50" marker-end="url(#c8a)"/>
    <line x1="465" y1="70" x2="465" y2="156" marker-end="url(#c8a)"/>
    <line x1="400" y1="180" x2="314" y2="180" marker-end="url(#c8a)"/>
    <line x1="200" y1="180" x2="124" y2="180" marker-end="url(#c8a)"/>
    <line x1="70" y1="160" x2="70" y2="74" marker-end="url(#c8a)"/>
    <path d="M300 68 Q 380 110 420 160" marker-end="url(#c8a)"/>
  </g>
  <g style="font-size:10.5px">
    <text x="158" y="42" text-anchor="middle">carrier detected</text>
    <text x="355" y="42" text-anchor="middle">options agreed</text>
    <text x="475" y="118">authentication</text><text x="475" y="132">successful</text>
    <text x="300" y="118" text-anchor="middle">no authentication</text>
    <text x="357" y="172" text-anchor="middle">NCP done</text>
    <text x="162" y="172" text-anchor="middle">done</text>
    <text x="78" y="120">carrier dropped</text>
  </g>
</svg>
<figcaption>Failure in establish or authenticate also leads to terminate.</figcaption>
</figure>
<ol>
  <li><b>Dead</b>: the link is not being used; no active carrier, the line is quiet.</li>
  <li><b>Establish</b>: when one node starts communicating, options are negotiated between the two parties using <b>LCP</b> packets. If negotiation succeeds, the system goes to authentication (if required) or directly to the network phase.</li>
  <li><b>Authenticate</b>: optional; the two nodes may agree during establishment to skip it. Otherwise authentication packets (PAP or CHAP) are exchanged.</li>
  <li><b>Network</b>: negotiation of the network-layer protocols (<b>NCP</b>). PPP requires a network-layer agreement before data is exchanged; since PPP supports several network-layer protocols, the receiver must know which one will receive the data.</li>
  <li><b>Open</b>: data transfer. The connection stays here until one end wants to terminate.</li>
  <li><b>Terminate</b>: the connection is closed; several packets are exchanged between the two ends for house cleaning and closing the link.</li>
</ol>
<h3 id="c8-ppp-mux">Multiplexing in PPP: LCP, authentication and NCP</h3>
<p>Although PPP is a link-layer protocol, it uses three sets of protocols to establish the link, authenticate the parties and carry network-layer data. At any moment a PPP frame's payload carries one of them, identified by the protocol field:</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Protocol</th><th>Protocol field (hex)</th><th>Job</th></tr></thead>
<tbody>
<tr><th>LCP · Link Control Protocol</th><td class="mono">C021</td><td>Establishing, maintaining, configuring and terminating links; negotiating options between the endpoints. 11 packet types: four for configuration (establish phase), two for termination, five for monitoring and debugging.</td></tr>
<tr><th>PAP · Password Authentication Protocol</th><td class="mono">C023</td><td>Two steps: the user sends an identification and password; the system accepts or denies. Packets: authenticate-request, authenticate-ack, authenticate-nak.</td></tr>
<tr><th>CHAP · Challenge Handshake Authentication Protocol</th><td class="mono">C223</td><td>Three-way handshake; the password is never sent. (1) The system sends a challenge value; (2) the user applies a predefined function to the challenge and its own password and returns the result; (3) the system computes the same and compares. Packets: challenge, response, success, failure. More secure than PAP, especially if the challenge changes.</td></tr>
<tr><th>NCP · IPCP (Internet Protocol Control Protocol)</th><td class="mono">8021</td><td>Configures the link for carrying IP packets. NCP packets carry no data; they only configure the network layer. (OSI's control protocol is 8023, Xerox NS IDP's is 8025.)</td></tr>
<tr><th>IP data</th><td class="mono">0021</td><td>After NCP configuration, network-layer data flows; 0021 means the payload is an IP datagram.</td></tr>
<tr><th>Multilink PPP fragment</th><td class="mono">003D</td><td>A logical PPP frame is split into several actual PPP frames over multiple channels; a sequence number shows each fragment's position.</td></tr>
</tbody></table></div>
<div class="note exam"><b class="tag">IA-1 Q8a · 6 marks</b><p><b>Analyse how PPP manages connections.</b> PPP frame format with every field (2 marks) and the transition phases with the diagram (4 marks): dead → establish (LCP options) → authenticate (optional, PAP/CHAP) → network (NCP) → open (data transfer) → terminate → dead.</p></div>
</section>

<section class="topic" id="c8-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>What is framing? Explain byte stuffing and bit stuffing with examples. · 6 marks</summary><div class="body"><p>Fixed vs variable framing; character-oriented frame (flag, header, data, trailer, flag) with ESC stuffing; bit-oriented frame with flag 01111110 and the five-1s rule. Show a before/after example of each.</p></div></details>
<details class="answer"><summary>Explain Stop-and-Wait ARQ with diagrams; derive its efficiency. · 8 marks · IA-1 Q7a</summary><div class="body"><p>Mechanism (copy, timer, modulo-2 numbers, ACK = next expected), lost-frame and lost-ACK timelines, η = 1/(1 + 2a), and the 1 Mbps / 20 ms / 1000-bit example (5%).</p></div></details>
<details class="answer"><summary>Explain Go-Back-N ARQ with send and receive windows and three scenarios. · 8 marks · IA-1 Q4a</summary><div class="body"><p>Windows (S<sub>f</sub>, S<sub>n</sub>, size ≤ 2<sup>m</sup> − 1; R<sub>n</sub>), cumulative ACKs, discard of out-of-order frames, time-out and go-back, three timelines, and the window-size proof.</p></div></details>
<details class="answer"><summary>Compare Go-Back-N and Selective Repeat ARQ. · 6 marks</summary><div class="body"><p>Use the comparison table: window sizes, out-of-order handling, what is resent, ACK/NAK, timers, efficiency. Add why the SR window is ≤ 2<sup>m−1</sup>.</p></div></details>
<details class="answer"><summary>Explain HDLC: transfer modes, frame types and control field. · 8 marks</summary><div class="body"><p>NRM and ABM with diagrams; I, S and U frames; the frame fields; the three control-field formats with the four S-frame codes; SABM/UA/DISC connection example.</p></div></details>
<details class="answer"><summary>Explain PPP: services, frame format and transition phases. · 8 marks · IA-1 Q8a</summary><div class="body"><p>Services provided and not provided, frame fields with their constant values, byte stuffing with 01111101, the phase diagram, and LCP/PAP/CHAP/NCP with protocol field values.</p></div></details>
</section>
`,
  quiz: [
    { q: 'Bit stuffing inserts an extra 0 after', o: ['Four consecutive 1s', 'A 0 followed by five consecutive 1s', 'Every flag', 'Six consecutive 0s'], a: 1, why: 'So the flag 01111110 never appears inside the data.' },
    { q: 'In byte stuffing, an extra byte is added when the data contains', o: ['Only the flag', 'Only ESC', 'A flag or an ESC character', 'A CRC'], a: 2, why: 'ESC is stuffed before any flag-like byte and before any ESC in the text.' },
    { q: 'Flow control means', o: ['Correcting bit errors', 'Restricting how much data the sender sends before waiting for an ACK', 'Routing frames', 'Adding a CRC'], a: 1, why: 'It stops a fast sender from overwhelming a slow receiver.' },
    { q: 'Error control in the data-link layer is based on', o: ['FEC', 'ARQ (automatic repeat request)', 'Checksums only', 'Parity only'], a: 1, why: 'Corrupted or lost frames are retransmitted.' },
    { q: 'In Stop-and-Wait ARQ, after frame 0 is received correctly the receiver sends', o: ['ACK 0', 'ACK 1', 'NAK 0', 'Nothing'], a: 1, why: 'The ACK number names the next frame expected, modulo 2.' },
    { q: 'Bandwidth 1 Mbps, round trip 20 ms, frames of 1000 bits. Stop-and-Wait utilisation is about', o: ['50%', '20%', '5%', '75%'], a: 2, why: 'BDP = 20,000 bits; 1000 / 20,000 = 5%.' },
    { q: 'With an m-bit sequence field, the Go-Back-N send window must be', o: ['≤ 2^m', '≤ 2^m − 1', '≤ 2^(m−1)', '1'], a: 1, why: 'A window of 2^m lets an old frame be accepted as new.' },
    { q: 'The Go-Back-N receive window size is', o: ['1', '2^m − 1', '2^(m−1)', 'Equal to the send window'], a: 0, why: 'The receiver accepts only the next expected frame.' },
    { q: 'In Go-Back-N, when the ACK of one frame is lost but a later ACK arrives in time', o: ['All frames are resent', 'Nothing is resent, because ACKs are cumulative', 'Only that frame is resent', 'The connection resets'], a: 1, why: 'The later cumulative ACK acknowledges the earlier frame too.' },
    { q: 'Selective Repeat resends', o: ['All outstanding frames', 'Only the damaged or lost frame', 'Nothing', 'Every other frame'], a: 1, why: 'Out-of-order frames are buffered at the receiver.' },
    { q: 'The HDLC mode in which each station acts as both primary and secondary is', o: ['NRM', 'ABM', 'ARM', 'PPP'], a: 1, why: 'Asynchronous balanced mode: peers on a point-to-point link.' },
    { q: 'An HDLC S-frame with code 01 is', o: ['RR', 'RNR', 'REJ', 'SREJ'], a: 2, why: '00 RR, 10 RNR, 01 REJ, 11 SREJ.' },
    { q: 'The PPP address field always contains', o: ['01111110', '11111111', '11000000', '01111101'], a: 1, why: 'A constant broadcast address; 11000000 is the control field.' },
    { q: 'In which PPP phase are network-layer protocols negotiated?', o: ['Establish', 'Authenticate', 'Network', 'Open'], a: 2, why: 'NCP (e.g. IPCP) negotiation happens in the network phase.' },
    { q: 'Which PPP authentication protocol never sends the password over the link?', o: ['PAP', 'CHAP', 'LCP', 'IPCP'], a: 1, why: 'CHAP sends a function of the challenge and the password.' }
  ]
});
