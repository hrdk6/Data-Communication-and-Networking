DCN.register({
  id: 'questions', num: 21, part: 'X', layer: 'tool',
  title: 'Exam Question Bank',
  short: 'Question bank',
  summary: 'Your IA-1 paper solved question by question, the IA-2 important questions, the VTU previous-year questions from the slides, and the likely long and short questions for every chapter, each linked to the section that answers it.',
  sources: ['IA-1 answer scheme.pdf', 'IA-2/imp questions.jpg', 'CN IA-2 imp ques notes.pdf', '1.ppt (Important Questions)'],
  keywords: 'question bank previous year questions IA-1 IA-2 internal assessment answer scheme VTU important questions likely questions model answers marks exam strategy scenario questions Bloom level',
  html: `
<section class="topic" id="q-pattern">
<h2>How the internals are set</h2>
<div class="duo">
  <div class="card"><h4>Paper pattern (IA-1, 25 Nov 2024)</h4><ul><li>Max marks 40, 1 hour 30 minutes</li><li><b>Answer four full questions</b>: one from each pair (1 or 2, 3 or 4, 5 or 6, 7 or 8)</li><li>Each question: part a (6 marks) + part b (4 marks)</li><li>Bloom levels L3 (apply) and L4 (analyse); course outcomes CO1 and CO2</li></ul></div>
  <div class="card"><h4>What the scheme rewards</h4><ul><li><b>Scenario questions</b>: an office, a campus, a WAN, a chat app. Name the concept, then map it to the scenario.</li><li>Marks split by point: "diagram 2M + 3 steps 4M", "each point 1M".</li><li>Numericals: formula, substitution, answer, each with marks.</li><li>Every timeline question (GBN, Stop-and-Wait) expects a <b>diagram</b>.</li></ul></div>
</div>
<div class="note tip"><b class="tag">Use the labs</b><p>Every answer below links to its chapter section. The simulators there (line coding, CRC, ARQ, ALOHA, IPv4, Dijkstra, TCP diagrams) draw the exact diagram the answer needs, so you can copy the shape into your answer sheet.</p></div>
</section>

<section class="topic" id="q-ia1">
<h2>IA-1 solved, question by question</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Q</th><th>Question (short form)</th><th class="num">Marks</th><th>Where the full answer is</th></tr></thead><tbody>
<tr><td class="mono">1a</td><td>Office with slow transfers: importance of data communication; characteristics affecting performance</td><td class="num">6</td><td><a href="#c1-datacomm">Data communication</a> · <a href="#c1-characteristics">characteristics</a></td></tr>
<tr><td class="mono">1b</td><td>Chat app: benefits of protocol layering (flexibility, troubleshooting, scalability, reusability)</td><td class="num">4</td><td><a href="#c2-layering">Protocol layering</a></td></tr>
<tr><td class="mono">2a</td><td>Encode 1011001011 in NRZ, NRZ-L, NRZ-I, RZ and Manchester</td><td class="num">6</td><td><a href="#c4-schemes">Line coding schemes</a></td></tr>
<tr><td class="mono">2b</td><td>WAN with corrupted files and choppy video: attenuation, noise, delay distortion</td><td class="num">4</td><td><a href="#c3-impairment">Transmission impairment</a></td></tr>
<tr><td class="mono">3a</td><td>CRC: check bits for 1010 with divisor 1011; check received 1100</td><td class="num">6</td><td><a href="#c7-crc">CRC</a></td></tr>
<tr><td class="mono">3b</td><td>Bit rate 8000 bps, baud 1000: data elements per signal element; signal elements</td><td class="num">4</td><td><a href="#c4-rates">Data rate and signal rate</a></td></tr>
<tr><td class="mono">4a</td><td>Go-Back-N: all frames arrive, frames lost, ACK lost (timelines)</td><td class="num">6</td><td><a href="#c8-gbn">Go-Back-N</a></td></tr>
<tr><td class="mono">4b</td><td>3.4 kHz channel: capacity at 30 dB; SNR for 4800 bps</td><td class="num">4</td><td><a href="#c3-limits">Data-rate limits</a></td></tr>
<tr><td class="mono">5a</td><td>Why quantization is needed in a PCM encoder, with an example</td><td class="num">6</td><td><a href="#c4-pcm">PCM</a></td></tr>
<tr><td class="mono">5b</td><td>Campus network: recommend a topology, limitations</td><td class="num">4</td><td><a href="#c1-campus">Topology for a campus</a></td></tr>
<tr><td class="mono">6a</td><td>Office problems analysed with the seven OSI layers</td><td class="num">6</td><td><a href="#c2-osi-layers">OSI layers</a></td></tr>
<tr><td class="mono">6b</td><td>Differences between pure and slotted ALOHA</td><td class="num">4</td><td><a href="#c9-slotted">Slotted ALOHA</a></td></tr>
<tr><td class="mono">7a</td><td>How Stop-and-Wait ARQ ensures reliability and handles loss or errors</td><td class="num">6</td><td><a href="#c8-arq">Stop-and-Wait ARQ</a></td></tr>
<tr><td class="mono">7b</td><td>Need for classless addressing; classes of four addresses</td><td class="num">4</td><td><a href="#c10-classful">Classful addressing</a></td></tr>
<tr><td class="mono">8a</td><td>How PPP manages connections: frame format and transition phases</td><td class="num">6</td><td><a href="#c8-ppp">PPP</a></td></tr>
<tr><td class="mono">8b</td><td>Pure ALOHA, 1000-bit frames at 1 Mbps: vulnerable time; repeat for slotted</td><td class="num">4</td><td><a href="#c9-pure">Pure ALOHA</a></td></tr>
</tbody></table></div>

<details class="answer"><summary>1a · Importance and characteristics of data communication in the office scenario · 6 marks (3 + 3)</summary><div class="body"><p><b>Importance:</b> faster and more reliable sharing of files, so employees wait less and productivity rises; stable, uninterrupted connectivity between devices and team members, essential for collaboration (including remote staff); secure protocols and encryption protect office data in transit.</p><p><b>Characteristics that may be affecting performance:</b> <b>delivery</b> (data must reach the correct destination), <b>accuracy</b> (corrupted files are useless), <b>timeliness</b> (late delivery, e.g. lagging video, is useless) and <b>jitter</b> (uneven packet delay makes video and voice choppy). Tie each to the symptom: slow transfers → timeliness; failed or corrupted files → accuracy and delivery.</p></div></details>
<details class="answer"><summary>1b · Benefits of protocol layering for the chat application · 4 marks (1 each)</summary><div class="body"><ol><li><b>Design flexibility</b>: each layer (messages, transport, network) is designed separately; text, images and voice notes can use different upper-layer handling without changing the lower layers.</li><li><b>Troubleshooting</b>: a fault can be isolated to one layer (e.g. a lost-message problem at the transport layer).</li><li><b>Scalability</b>: new features or media types are added by changing one layer.</li><li><b>Reusability</b>: standard lower layers (TCP/IP) are reused instead of rewritten.</li></ol></div></details>
<details class="answer"><summary>2a · Line coding of 1011001011 · 6 marks (NRZ 1 · NRZ-L 1 · NRZ-I 1 · RZ 1.5 · Manchester 1.5)</summary><div class="body"><ul><li><b>Unipolar NRZ</b>: 1 = +V, 0 = 0 V for the whole bit.</li><li><b>NRZ-L</b>: the level decides the bit (Forouzan: 0 = positive, 1 = negative).</li><li><b>NRZ-I</b>: invert the level at the start of every 1; no change for 0 (state the initial level you assume).</li><li><b>RZ</b>: three levels; the signal goes to +V (bit 1) or −V (bit 0) for the first half and returns to zero in the middle of each bit.</li><li><b>Manchester</b>: transition in the middle of every bit: 0 = high to low, 1 = low to high (IEEE/Forouzan convention).</li></ul><p>Draw all five under the same bit grid. The visualiser below is preloaded with this exact sequence.</p></div></details>
<figure class="lab" data-widget="linecoding" data-bits="1011001011" data-show="unrz,nrzl,nrzi,rz,manch"><figcaption><span class="ttl">IA-1 Q2a drawn for you</span><span class="cap">The five waveforms of 1011001011, with bit boundaries.</span></figcaption></figure>
<details class="answer"><summary>2b · Attenuation, noise and delay distortion in the retail WAN · 4 marks</summary><div class="body"><ul><li><b>Attenuation</b>: loss of signal energy over the long WAN links; weak signals become unreadable, causing corrupted files unless amplifiers or repeaters are used (measured in dB).</li><li><b>Distortion</b> (delay distortion): the signal's frequency components travel at different speeds and arrive at different times, so the shape changes: bit errors and uneven delay, making video choppy.</li><li><b>Noise</b> (thermal, induced, crosstalk, impulse): corrupts bits and forces retransmissions, so download speeds vary. Higher SNR is better.</li></ul></div></details>
<details class="answer"><summary>3a · CRC with divisor 1011 · 6 marks (3 + 3)</summary><div class="body"><p><b>Encoder</b>: dataword 1010, divisor 1011 (degree 3), so append three 0s: 1010000. Divide with XOR: 1010 ⊕ 1011 = 0001 → 0010 → 0100 → 1000 ⊕ 1011 = 0011 → remainder <b>011</b>. Codeword = <b>1010011</b>.</p><p><b>Decoder</b>: divide the received codeword by 1011; a zero remainder (syndrome 000) means accept, a non-zero remainder means the data was corrupted and is discarded. Show the full long division for the question's received word; the CRC lab below does both divisions step by step.</p></div></details>
<figure class="lab" data-widget="crc" data-data="1010" data-div="1011"><figcaption><span class="ttl">IA-1 Q3a long division</span><span class="cap">Change the dataword or the received codeword to check the decoder side.</span></figcaption></figure>
<details class="answer"><summary>3b · Data elements per signal element · 4 marks (2 + 2)</summary><div class="body"><p>N (data elements per signal element) = bit rate / baud rate = 8000 / 1000 = <b>8 bits</b>. Number of signal elements (levels) L = 2<sup>N</sup> = 2<sup>8</sup> = <b>256</b>.</p></div></details>
<details class="answer"><summary>4a · Go-Back-N in three scenarios · 6 marks (2 each)</summary><div class="body"><ol><li><b>All frames arrive</b>: the sender sends frames in its window; the receiver sends cumulative ACKs; the window slides.</li><li><b>A frame is lost</b>: the receiver discards later out-of-order frames; the sender's timer for the lost frame expires and it <b>resends that frame and all frames after it</b>.</li><li><b>An ACK is lost</b>: a later cumulative ACK covers it, so nothing is resent; if no later ACK arrives before the time-out, the outstanding frames are resent.</li></ol><p>Window size ≤ 2<sup>m</sup> − 1. Draw a timeline for each case; the ARQ simulator in the GBN section draws all three.</p></div></details>
<details class="answer"><summary>4b · Shannon capacity of a 3.4 kHz channel · 4 marks</summary><div class="body"><p>(a) SNR = 10<sup>30/10</sup> = 1000; C = 3400 × log<sub>2</sub>(1 + 1000) = 3400 × 9.967 ≈ <b>33,888 bps</b>. (b) 4800 = 3400 × log<sub>2</sub>(1 + SNR) → log<sub>2</sub>(1 + SNR) = 1.412 → 1 + SNR = 2.66 → <b>SNR ≈ 1.66</b> (about 2.2 dB).</p></div></details>
<details class="answer"><summary>5a · Why quantization is needed in PCM · 6 marks (diagram 2 + steps 4)</summary><div class="body"><p>PCM has three steps: <b>sampling</b> (PAM at f<sub>s</sub> ≥ 2f<sub>max</sub>), <b>quantization</b> and <b>encoding</b>. Samples are still analog (any real value); to be represented by a fixed number of bits they must be rounded to one of L levels. Steps: divide the range V<sub>min</sub>…V<sub>max</sub> into L zones of height Δ = (V<sub>max</sub> − V<sub>min</sub>)/L; assign each zone a value 0 … L − 1 at its midpoint; replace each sample by its zone's value. The difference is the quantization error; SNR<sub>dB</sub> = 6.02 n<sub>b</sub> + 1.76. Then each value is encoded in n<sub>b</sub> = log<sub>2</sub>L bits.</p></div></details>
<details class="answer"><summary>5b · Topology for the university campus · 4 marks</summary><div class="body"><p>Recommend <b>star</b> (or a hybrid star/mesh backbone): easy to add buildings and departments, a failed link affects only one device and faults are quickly identified and isolated at the hub/switch; a mesh backbone between buildings gives redundancy. Limitations: the central device is a single point of failure, more cabling than bus, cost of redundant links in mesh. Explain all four topologies briefly with diagrams as the scheme asks.</p></div></details>
<details class="answer"><summary>6a · The seven OSI layers applied to the office problems · 6 marks</summary><div class="body"><p>Draw the stack and give one line per layer: physical (cables, signal problems → slow transfers), data link (framing, error and flow control, MAC), network (routing, logical addressing → misrouted packets), transport (reliable end-to-end delivery, segmentation → lost or slow transfers), session (dialog control), presentation (translation, encryption, compression), application (e-mail service → failed deliveries). Point to the likely layer for each symptom.</p></div></details>
<details class="answer"><summary>6b · Pure versus slotted ALOHA · 4 marks (any three differences)</summary><div class="body"><div class="table-wrap"><table class="cmp"><thead><tr><th>Pure ALOHA</th><th>Slotted ALOHA</th></tr></thead><tbody><tr><td>Send at any time</td><td>Send only at the beginning of a slot</td></tr><tr><td>Time is continuous, not synchronized</td><td>Time is discrete and globally synchronized</td></tr><tr><td>Vulnerable time 2 × T<sub>fr</sub></td><td>Vulnerable time T<sub>fr</sub></td></tr><tr><td>S = G e<sup>−2G</sup>, max 18.4%</td><td>S = G e<sup>−G</sup>, max 36.8%</td></tr></tbody></table></div></div></details>
<details class="answer"><summary>7a · How Stop-and-Wait ARQ gives reliability · 6 marks</summary><div class="body"><p>The sender keeps a copy of the frame, starts a timer and waits for an ACK; frames and ACKs carry sequence numbers (0/1, modulo 2). A corrupted frame is discarded by the receiver (checksum/CRC); a lost frame or lost ACK leads to a time-out and retransmission; a duplicate (after a lost ACK) is recognised by its sequence number and discarded, but acknowledged again. Draw the three cases (normal, lost frame, lost ACK).</p></div></details>
<details class="answer"><summary>7b · Need for classless addressing; classes · 4 marks</summary><div class="body"><p>In classful addressing a large part of the addresses was wasted (class A and B blocks too large, class C too small, class E unused). Classes: 201.20.31.65 → <b>C</b>; 126.11.11.239 → <b>A</b>; 193.14.56.22 → <b>C</b>; 130.34.54.12 → <b>B</b>.</p></div></details>
<details class="answer"><summary>8a · How PPP manages connections · 6 marks (format 2 + phases 4)</summary><div class="body"><p>Frame: flag 01111110, address 11111111, control 11000000, protocol (1–2 bytes), payload, FCS (2 or 4 bytes), flag. Transition phases: <b>dead</b> → carrier detected → <b>establish</b> (LCP options negotiated) → <b>authenticate</b> (optional, PAP/CHAP) → <b>network</b> (NCP, e.g. IPCP) → <b>open</b> (data transfer) → <b>terminate</b> → dead.</p></div></details>
<details class="answer"><summary>8b · Vulnerable time, 1000-bit frames at 1 Mbps · 4 marks</summary><div class="body"><p>T<sub>fr</sub> = 1000 / 10<sup>6</sup> = 1 ms. Pure ALOHA vulnerable time = 2 × T<sub>fr</sub> = <b>2 ms</b>; slotted ALOHA = T<sub>fr</sub> = <b>1 ms</b>.</p><div class="note warn"><b class="tag">Heads-up</b><p>The answer scheme's working also adds propagation time to the vulnerable time. The textbook definition uses only the frame transmission time, giving 2 ms and 1 ms.</p></div></div></details>
</section>

<section class="topic" id="q-ia2">
<h2>IA-2 important questions</h2>
<p>From the IA-2 list in your files, with the notes' answers merged into the chapters:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">#</th><th>Question</th><th>Answer</th></tr></thead><tbody>
<tr><td class="num">1</td><td>Problems on Bellman-Ford and Dijkstra</td><td><a href="#c11-dijkstra">Dijkstra (two slide examples + practice)</a> · <a href="#c11-bf">Bellman-Ford</a> · <a href="#c11-vectors">distance-vector tables</a></td></tr>
<tr><td class="num">2</td><td>TCP three-way handshake (three diagrams): connection establishment, data transfer, termination</td><td><a href="#c12-conn">Establishment</a> · <a href="#c12-data">Data transfer</a> · <a href="#c12-close">Termination</a></td></tr>
<tr><td class="num">3</td><td>Client-server, peer-to-peer, hybrid: analyse</td><td><a href="#c13-paradigms">Application architectures</a></td></tr>
<tr><td class="num">4</td><td>SMTP, DNS</td><td><a href="#c13-smtp">SMTP</a> · <a href="#c13-email">E-mail architecture</a> · <a href="#c13-dns">DNS</a></td></tr>
<tr><td class="num">5</td><td>Advantages of TCP over UDP; UDP segment</td><td><a href="#c12-vs">TCP versus UDP</a> · <a href="#c12-udpfmt">UDP format</a></td></tr>
</tbody></table></div>
<details class="solution"><summary>Practice for Q1: Dijkstra from u on slide example 1, then Bellman-Ford d<sub>u</sub>(z) on example 2</summary><div class="body"><p>Example 1 (u–w 3, u–x 5, u–v 7, w–x 4, w–v 3, w–y 8, x–y 7, x–z 9, v–y 4, y–z 2): N′ grows u, w, x, v, y, z with final costs w 3, x 5, v 6 (via w), y 10 (via v), z 12 (via y). Example 2: d<sub>u</sub>(z) = min{2 + 5, 1 + 3, 5 + 3} = 4 via x. Full step tables are in <a href="#c11-dijkstra">Chapter 11</a>.</p></div></details>
</section>

<section class="topic" id="q-vtu">
<h2>VTU previous-year questions (from the Unit 1 slides)</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Question</th><th>Asked in</th><th>Answer</th></tr></thead><tbody>
<tr><td>Describe data communication and its components</td><td>Jan 2020, Jan 2019, Jul 2019</td><td><a href="#c1-components">Components</a></td></tr>
<tr><td>5 devices in a mesh: how many duplex links? How many ports per device? (2 marks)</td><td>Jan 2018</td><td>10 links, 4 ports each · <a href="#c1-mesh">Mesh</a></td></tr>
<tr><td>Explain the data-flow techniques of data communication (5 marks)</td><td>Jan 2020, Jul 2019</td><td><a href="#c1-dataflow">Simplex, half-duplex, full-duplex</a></td></tr>
<tr><td>Explain any two fundamental characteristics of communication and the basic network topologies (8 marks)</td><td>Jul 2018, Jul 2019</td><td><a href="#c1-characteristics">Characteristics</a> · <a href="#c1-topology">Topologies</a></td></tr>
<tr><td>List the network criteria</td><td>Jul 2018</td><td><a href="#c1-criteria">Performance, reliability, security</a></td></tr>
<tr><td>What factors decide whether a network is a LAN or a WAN?</td><td>Jul 2019</td><td><a href="#c1-types">Network types</a></td></tr>
</tbody></table></div>
</section>

<section class="topic" id="q-partA">
<h2>Likely questions · Part A (Chapters 1–6)</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Question</th><th class="num">Marks</th><th>Answer</th></tr></thead><tbody>
<tr><td>Explain the five components of data communication and data representation</td><td class="num">6</td><td><a href="#c1-components">Components</a> · <a href="#c1-representation">representation</a></td></tr>
<tr><td>Explain mesh, star, bus and ring topologies with advantages and disadvantages</td><td class="num">8</td><td><a href="#c1-topology">Topologies</a></td></tr>
<tr><td>Explain circuit, message and packet switching; datagram vs virtual circuit</td><td class="num">8</td><td><a href="#c1-switching">Switching</a></td></tr>
<tr><td>Explain the Internet standards and administration (RFC maturity levels, ISOC, IAB, IETF, IRTF)</td><td class="num">6</td><td><a href="#c1-standards">Standards</a> · <a href="#c1-admin">administration</a></td></tr>
<tr><td>Explain the TCP/IP protocol suite and the duties of each layer</td><td class="num">8</td><td><a href="#c2-tcpip">TCP/IP</a></td></tr>
<tr><td>Explain encapsulation and decapsulation; addressing in TCP/IP</td><td class="num">6</td><td><a href="#c2-encap">Encapsulation</a> · <a href="#c2-addressing">addressing</a></td></tr>
<tr><td>Compare OSI and TCP/IP; why did OSI fail?</td><td class="num">6</td><td><a href="#c2-compare">Comparison</a> · <a href="#c2-osi-failure">lack of success</a></td></tr>
<tr><td>Define amplitude, frequency, phase and wavelength; time vs frequency domain</td><td class="num">6</td><td><a href="#c3-sine">Sine waves</a> · <a href="#c3-domains">domains</a></td></tr>
<tr><td>Nyquist and Shannon numericals; decibel numericals</td><td class="num">4</td><td><a href="#c3-limits">Data-rate limits</a> · <a href="#c3-attenuation">dB</a></td></tr>
<tr><td>Explain bandwidth, throughput, latency, bandwidth-delay product and jitter</td><td class="num">6</td><td><a href="#c3-performance">Performance</a></td></tr>
<tr><td>Explain line-coding characteristics; draw the polar, RZ, biphase and bipolar schemes</td><td class="num">8</td><td><a href="#c4-issues">Line-coding issues</a> · <a href="#c4-schemes">schemes</a></td></tr>
<tr><td>Explain PCM: sampling, quantization, encoding; numericals on bit rate</td><td class="num">8</td><td><a href="#c4-pcm">PCM</a></td></tr>
<tr><td>Explain ASK, FSK, PSK and QAM with constellation diagrams</td><td class="num">8</td><td><a href="#c4-d2a">Digital-to-analog conversion</a></td></tr>
<tr><td>Explain FDM with the analog hierarchy; WDM</td><td class="num">6</td><td><a href="#c5-fdm">FDM</a> · <a href="#c5-wdm">WDM</a></td></tr>
<tr><td>Explain synchronous TDM, data-rate management and framing; T-1 line</td><td class="num">8</td><td><a href="#c5-tdm">TDM</a> · <a href="#c5-ds">DS hierarchy</a></td></tr>
<tr><td>Explain statistical TDM and the principles of spread spectrum</td><td class="num">6</td><td><a href="#c5-statdm">Statistical TDM</a> · <a href="#c5-ss">spread spectrum</a></td></tr>
<tr><td>Explain twisted-pair, coaxial and fibre-optic cables; propagation modes</td><td class="num">8</td><td><a href="#c6-twisted">Twisted pair</a> · <a href="#c6-fiber">fibre</a></td></tr>
<tr><td>Explain unguided media: radio waves, microwaves and infrared</td><td class="num">6</td><td><a href="#c6-unguided">Unguided media</a></td></tr>
</tbody></table></div>
</section>

<section class="topic" id="q-partB">
<h2>Likely questions · Part B (Chapters 7–13)</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Question</th><th class="num">Marks</th><th>Answer</th></tr></thead><tbody>
<tr><td>Explain block coding, Hamming distance and d<sub>min</sub>; parity check code</td><td class="num">6</td><td><a href="#c7-block">Block coding</a> · <a href="#c7-parity">parity</a></td></tr>
<tr><td>CRC encoding and decoding numerical; polynomial representation</td><td class="num">6–8</td><td><a href="#c7-crc">CRC</a> · <a href="#c7-poly">polynomials</a></td></tr>
<tr><td>Internet checksum numerical; Fletcher and Adler checksums</td><td class="num">6</td><td><a href="#c7-checksum">Checksum</a></td></tr>
<tr><td>Explain framing: byte stuffing and bit stuffing</td><td class="num">6</td><td><a href="#c8-byte">Byte stuffing</a> · <a href="#c8-bit">bit stuffing</a></td></tr>
<tr><td>Explain Stop-and-Wait ARQ, Go-Back-N and Selective Repeat with window sizes</td><td class="num">10</td><td><a href="#c8-arq">ARQ</a> · <a href="#c8-gbn">GBN</a> · <a href="#c8-sr">SR</a></td></tr>
<tr><td>Explain HDLC frame types and control fields; PPP frame and phases</td><td class="num">8</td><td><a href="#c8-hdlc">HDLC</a> · <a href="#c8-ppp">PPP</a></td></tr>
<tr><td>Explain CSMA/CD and CSMA/CA; minimum frame size numerical</td><td class="num">8</td><td><a href="#c9-cd">CSMA/CD</a> · <a href="#c9-ca">CSMA/CA</a></td></tr>
<tr><td>Explain reservation, polling and token passing</td><td class="num">6</td><td><a href="#c9-controlled">Controlled access</a></td></tr>
<tr><td>Explain CDMA with chip sequences and Walsh tables</td><td class="num">8</td><td><a href="#c9-cdma">CDMA</a></td></tr>
<tr><td>Explain network-layer services; datagram vs virtual-circuit approaches</td><td class="num">8</td><td><a href="#c10-services">Services</a> · <a href="#c10-switching">packet switching</a></td></tr>
<tr><td>Classless addressing numerical: N, first, last, mask; subnet design</td><td class="num">4–6</td><td><a href="#c10-classless">CIDR</a> · <a href="#c10-subnet">subnetting</a></td></tr>
<tr><td>Explain DHCP and NAT</td><td class="num">8</td><td><a href="#c10-dhcp">DHCP</a> · <a href="#c10-nat">NAT</a></td></tr>
<tr><td>Explain the IPv4 datagram format and fragmentation</td><td class="num">8</td><td><a href="#c10-datagram">Datagram</a> · <a href="#c10-frag">fragmentation</a></td></tr>
<tr><td>Explain the IPv6 packet format; IPv4 vs IPv6; tunnelling</td><td class="num">10</td><td><a href="#c10-ipv6">IPv6</a> · <a href="#c10-transition">tunnelling</a></td></tr>
<tr><td>Dijkstra and Bellman-Ford problems; count to infinity</td><td class="num">10</td><td><a href="#c11-ls">Link state</a> · <a href="#c11-dv">distance vector</a> · <a href="#c11-cti">count to infinity</a></td></tr>
<tr><td>Explain RIP, OSPF and BGP</td><td class="num">10</td><td><a href="#c11-rip">RIP</a> · <a href="#c11-ospf">OSPF</a> · <a href="#c11-bgp">BGP</a></td></tr>
<tr><td>Explain UDP and its services; TCP services and segment format</td><td class="num">8</td><td><a href="#c12-udp">UDP</a> · <a href="#c12-segment">TCP segment</a></td></tr>
<tr><td>TCP connection management with diagrams</td><td class="num">10</td><td><a href="#c12-conn">Handshake</a> · <a href="#c12-close">termination</a></td></tr>
<tr><td>TCP flow control, silly window syndrome; error control and fast retransmit</td><td class="num">8</td><td><a href="#c12-flowctl">Flow control</a> · <a href="#c12-errctl">error control</a></td></tr>
<tr><td>TCP congestion control: slow start, AIMD, Tahoe and Reno</td><td class="num">10</td><td><a href="#c12-tcpcc">Congestion control</a></td></tr>
<tr><td>HTTP persistent and non-persistent connections; cookies; web caching</td><td class="num">10</td><td><a href="#c13-http">HTTP</a></td></tr>
<tr><td>Explain FTP; e-mail with SMTP, POP3 and IMAP; MIME</td><td class="num">10</td><td><a href="#c13-ftp">FTP</a> · <a href="#c13-email">E-mail</a></td></tr>
<tr><td>Explain DNS name space and resolution; TELNET and SSH</td><td class="num">10</td><td><a href="#c13-dns">DNS</a> · <a href="#c13-telnet">TELNET</a> · <a href="#c13-ssh">SSH</a></td></tr>
<tr><td>Write Java TCP/UDP client-server programs</td><td class="num">8</td><td><a href="#c13-socket">Socket programming</a></td></tr>
</tbody></table></div>
</section>

<section class="topic" id="q-strategy">
<h2>Writing answers that score</h2>
<div class="duo">
  <div class="card"><h4>Long answers (6–10 marks)</h4><ol><li>One-line definition first.</li><li>A labelled diagram: header layout, timeline, topology, state diagram.</li><li>Points matching the marks: roughly one point per mark.</li><li>For "compare" questions, a table with at least five rows.</li><li>For scenario questions, finish by mapping the concept back to the scenario.</li></ol></div>
  <div class="card"><h4>Numericals</h4><ol><li>Write the formula with symbols defined.</li><li>Convert units before substituting (bits vs bytes, ms vs s).</li><li>Show each intermediate value.</li><li>Box the answer with units.</li><li>Check it with the calculator on the <a href="#formulas">formula sheet</a>.</li></ol></div>
  <div class="card"><h4>Before the exam</h4><ul><li>Tick <b>Mark revised</b> under each topic as you finish it; the home page shows your coverage.</li><li>Take the <a href="#quiz">mixed test</a> until you score above 80%.</li><li>Redo the IA-1 and IA-2 questions above without looking.</li></ul></div>
</div>
</section>
`
});
