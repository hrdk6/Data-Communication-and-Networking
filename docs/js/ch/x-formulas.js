DCN.register({
  id: 'formulas', num: 20, part: 'X', layer: 'tool',
  title: 'Formula Sheet and Calculators',
  short: 'Formula sheet',
  summary: 'Every formula in the syllabus on one page, grouped by chapter, with the units that trip people up and a bench of calculators that show their working. Each block links back to the full explanation.',
  sources: ['All chapters'],
  keywords: 'formula sheet cheat sheet numericals units mesh links ports wavelength frequency period bandwidth decibel dB dBm SNR Nyquist Shannon capacity bit rate baud rate signal elements r c N S Bmin Nmax PCM sampling Nyquist rate quantization SNRdB bit rate ASK FSK PSK bandwidth TDM frame rate T-1 1.544 Hamming distance dmin stop and wait efficiency 1/(1+2a) window size GBN SR ALOHA throughput vulnerable time CSMA/CD minimum frame size IPv4 block number of addresses first address last address mask subnet hosts HLEN total length fragmentation offset Bellman-Ford Dijkstra iBGP sessions RTT EstimatedRTT DevRTT TimeoutInterval cwnd throughput HTTP response time',
  html: `
<section class="topic" id="fx-units">
<h2>Units first: where marks are lost</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Quantity</th><th>Rule</th><th>Example</th></tr></thead><tbody>
<tr><td>Data rates</td><td>Decimal prefixes: k = 10<sup>3</sup>, M = 10<sup>6</sup>, G = 10<sup>9</sup> bits per second</td><td>1 Mbps = 1,000,000 bps</td></tr>
<tr><td>Bytes and bits</td><td>1 byte = 8 bits. "B" is bytes, "b" is bits</td><td>10 KB = 10,000 bytes = 80,000 bits</td></tr>
<tr><td>Time</td><td>1 ms = 10<sup>−3</sup> s · 1 µs = 10<sup>−6</sup> s · 1 ns = 10<sup>−9</sup> s</td><td>25.6 µs = 25.6 × 10<sup>−6</sup> s</td></tr>
<tr><td>Frequency and period</td><td>f = 1/T; kHz = 10<sup>3</sup> Hz, MHz = 10<sup>6</sup> Hz</td><td>T = 1 ms → f = 1 kHz</td></tr>
<tr><td>Logarithms</td><td>log<sub>2</sub>x = log<sub>10</sub>x / 0.301; useful: log<sub>2</sub>1024 = 10, log<sub>2</sub>1001 ≈ 9.97</td><td>log<sub>2</sub>(1 + 1000) ≈ 9.97</td></tr>
<tr><td>Decibels to ratio</td><td>SNR = 10<sup>SNR<sub>dB</sub>/10</sup></td><td>30 dB → 1000</td></tr>
</tbody></table></div>
<div class="note exam"><b class="tag">How numericals are marked</b><p>Formula (with symbols defined) → substitution with units → answer with units. Even when the final number is wrong, the formula and substitution usually earn most of the marks.</p></div>
</section>

<section class="topic" id="fx-c1">
<h2>Chapters 1–2 · Networks and models</h2>
<div class="fgrid">
  <div class="formula"><code class="f">Mesh: links = n(n − 1) / 2</code><span class="where">n devices, duplex links; each device needs n − 1 I/O ports. 5 devices → 10 links, 4 ports each. <a href="#c1-mesh">Mesh topology</a></span></div>
  <div class="formula"><code class="f">Star: n links · Ring: n links · Bus: 1 cable + n drop lines</code><span class="where">Star: each device has one link and one port to the hub. <a href="#c1-topology">Topologies</a></span></div>
</div>
</section>

<section class="topic" id="fx-c3">
<h2>Chapter 3 · Data and signals</h2>
<div class="fgrid">
  <div class="formula"><code class="f">f = 1 / T</code><span class="where">Frequency (Hz) and period (s)</span></div>
  <div class="formula"><code class="f">λ = c / f = c × T</code><span class="where">Wavelength; c = propagation speed (3 × 10<sup>8</sup> m/s in air). <a href="#c3-wavelength">Wavelength</a></span></div>
  <div class="formula"><code class="f">B = f<sub>highest</sub> − f<sub>lowest</sub></code><span class="where">Bandwidth of a composite signal. <a href="#c3-composite">Composite signals</a></span></div>
  <div class="formula"><code class="f">bits per level = log<sub>2</sub>L</code><span class="where">L signal levels. <a href="#c3-digital">Digital signals</a></span></div>
  <div class="formula"><code class="f">Bit length = propagation speed × bit duration</code><span class="where">Bit duration = 1 / bit rate</span></div>
  <div class="formula"><code class="f">dB = 10 log<sub>10</sub>(P<sub>2</sub> / P<sub>1</sub>)</code><span class="where">Negative = attenuation, positive = amplification; dB values of stages add. (For voltages: 20 log<sub>10</sub>(V<sub>2</sub>/V<sub>1</sub>).) <a href="#c3-attenuation">Attenuation</a></span></div>
  <div class="formula"><code class="f">dBm = 10 log<sub>10</sub>P<sub>m</sub></code><span class="where">P<sub>m</sub> in milliwatts</span></div>
  <div class="formula"><code class="f">SNR = signal power / noise power · SNR<sub>dB</sub> = 10 log<sub>10</sub>SNR</code><span class="where"><a href="#c3-noise">Noise</a></span></div>
  <div class="formula"><code class="f">Nyquist: BitRate = 2 × B × log<sub>2</sub>L</code><span class="where">Noiseless channel; B in Hz, L levels. <a href="#c3-limits">Data-rate limits</a></span></div>
  <div class="formula"><code class="f">Shannon: C = B × log<sub>2</sub>(1 + SNR)</code><span class="where">Noisy channel capacity; SNR as a ratio, not dB. Use Shannon for the upper limit, Nyquist to find the levels</span></div>
  <div class="formula"><code class="f">Throughput = data delivered / time</code><span class="where"><a href="#c3-throughput">Throughput</a></span></div>
  <div class="formula"><code class="f">Latency = propagation + transmission + queuing + processing</code><span class="where">Propagation time = distance / propagation speed · Transmission time = message size / bandwidth. <a href="#c3-latency">Latency</a></span></div>
  <div class="formula"><code class="f">BDP = bandwidth × delay</code><span class="where">Number of bits that fill the link. <a href="#c3-bdp">Bandwidth-delay product</a></span></div>
</div>
<div class="example"><p class="ex-q"><span class="chip hot">IA-1 Q4b</span> A telephone channel has B = 3.4 kHz. (a) Capacity for SNR = 30 dB? (b) SNR needed for 4800 bps?</p><ol class="steps"><li>SNR = 10<sup>30/10</sup> = 1000 → C = 3400 × log<sub>2</sub>(1001) ≈ 3400 × 9.97 ≈ <b>33.9 kbps</b></li><li>4800 = 3400 × log<sub>2</sub>(1 + SNR) → log<sub>2</sub>(1 + SNR) = 1.41 → 1 + SNR = 2<sup>1.41</sup> ≈ 2.66 → SNR ≈ <b>1.66</b> (≈ 2.2 dB)</li></ol><p class="ex-a">≈ 33.9 kbps · SNR ≈ 1.66</p></div>
</section>

<section class="topic" id="fx-c4">
<h2>Chapter 4 · Digital and analog transmission</h2>
<div class="fgrid">
  <div class="formula"><code class="f">S = N / r   (r = data elements per signal element)</code><span class="where">S = baud rate (signal rate), N = bit rate. <a href="#c4-rates">Data rate and signal rate</a></span></div>
  <div class="formula"><code class="f">S<sub>ave</sub> = c × N × (1/r) baud</code><span class="where">c = case factor: 0 best, 1 worst, ½ average</span></div>
  <div class="formula"><code class="f">B<sub>min</sub> = c × N × (1/r) · N<sub>max</sub> = (1/c) × B × r</code><span class="where">Minimum bandwidth; maximum data rate for a given bandwidth</span></div>
  <div class="formula"><code class="f">N = bit rate / baud rate · L = 2<sup>N</sup></code><span class="where">Data elements per signal element and number of signal levels (IA-1 Q3b: 8000/1000 = 8, L = 2<sup>8</sup> = 256)</span></div>
  <div class="formula"><code class="f">Nyquist sampling: f<sub>s</sub> = 2 × f<sub>max</sub></code><span class="where">At least twice the highest frequency (low-pass); for bandpass, twice the bandwidth. <a href="#c4-sampling">Sampling</a></span></div>
  <div class="formula"><code class="f">Δ = (V<sub>max</sub> − V<sub>min</sub>) / L</code><span class="where">Quantization step for L zones. <a href="#c4-quantization">Quantization</a></span></div>
  <div class="formula"><code class="f">SNR<sub>dB</sub> = 6.02 n<sub>b</sub> + 1.76 dB</code><span class="where">n<sub>b</sub> = bits per sample; each extra bit adds 6 dB</span></div>
  <div class="formula"><code class="f">PCM bit rate = f<sub>s</sub> × n<sub>b</sub></code><span class="where">E.g. voice: 8000 samples/s × 8 bits = 64 kbps. <a href="#c4-encoding">PCM encoding</a></span></div>
  <div class="formula"><code class="f">B<sub>min</sub> (PCM) = n<sub>b</sub> × B<sub>analog</sub></code><span class="where">Minimum bandwidth of the digitized signal</span></div>
  <div class="formula"><code class="f">ASK / PSK: B = (1 + d) × S</code><span class="where">d = 0 to 1 depends on the modulation and filtering. <a href="#c4-ask">ASK</a></span></div>
  <div class="formula"><code class="f">FSK: B = (1 + d) × S + 2Δf</code><span class="where">2Δf = difference between the two carrier frequencies. <a href="#c4-fsk">FSK</a></span></div>
  <div class="formula"><code class="f">Digital-to-analog: S = N / r, r = log<sub>2</sub>L</code><span class="where">QPSK: 2 bits per element; 16-QAM: 4 bits. <a href="#c4-constellation">Constellations</a></span></div>
</div>
</section>

<section class="topic" id="fx-c5">
<h2>Chapter 5 · Multiplexing</h2>
<div class="fgrid">
  <div class="formula"><code class="f">FDM link bandwidth = Σ channel bandwidths + guard bands</code><span class="where">n channels need n − 1 guard bands between them. <a href="#c5-fdm">FDM</a></span></div>
  <div class="formula"><code class="f">TDM: output slot duration = input slot duration / n</code><span class="where">n inputs; the frame lasts as long as one input unit. <a href="#c5-tdm">Synchronous TDM</a></span></div>
  <div class="formula"><code class="f">Link rate = frame rate × bits per frame</code><span class="where">With framing bits: (n × bits per slot + framing bits) × frames per second</span></div>
  <div class="formula"><code class="f">T-1 = 24 × 64 kbps + 8 kbps = 1.544 Mbps</code><span class="where">193 bits per frame (24 × 8 + 1 framing bit) × 8000 frames/s. <a href="#c5-ds">DS and T lines</a></span></div>
</div>
</section>

<section class="topic" id="fx-c7">
<h2>Chapters 7–9 · Data-link layer</h2>
<div class="fgrid">
  <div class="formula"><code class="f">d<sub>min</sub> = s + 1   to detect up to s errors</code><span class="where">Hamming distance d(x, y) = number of 1s in x XOR y. <a href="#c7-hamming">Hamming distance</a></span></div>
  <div class="formula"><code class="f">CRC: append r = (divisor bits − 1) zeros, divide (XOR), remainder = check bits</code><span class="where">Receiver: remainder 0 → accept (IA-1 Q3a: 1010 with 1011 → codeword 1010011). <a href="#c7-crc">CRC</a></span></div>
  <div class="formula"><code class="f">Checksum = complement of the 1s-complement sum</code><span class="where">Wrap carries around; receiver's sum of everything = all 1s → no error. <a href="#c7-inet">Internet checksum</a></span></div>
  <div class="formula"><code class="f">Stop-and-Wait: η = 1 / (1 + 2a), a = T<sub>p</sub> / T<sub>t</sub></code><span class="where">T<sub>t</sub> = frame size / bandwidth; throughput = η × B. <a href="#c8-efficiency">Efficiency</a></span></div>
  <div class="formula"><code class="f">Go-Back-N: W<sub>s</sub> ≤ 2<sup>m</sup> − 1 · Selective Repeat: W ≤ 2<sup>m − 1</sup></code><span class="where">m = bits in the sequence number. <a href="#c8-gbn">GBN</a> · <a href="#c8-sr">SR</a></span></div>
  <div class="formula"><code class="f">Pure ALOHA: S = G e<sup>−2G</sup>, max 0.184 at G = ½, vulnerable 2T<sub>fr</sub></code><span class="where">G = frames generated per frame time. <a href="#c9-pure">Pure ALOHA</a></span></div>
  <div class="formula"><code class="f">Slotted ALOHA: S = G e<sup>−G</sup>, max 0.368 at G = 1, vulnerable T<sub>fr</sub></code><span class="where">Successful frames per second = S / T<sub>fr</sub>. <a href="#c9-slotted">Slotted ALOHA</a></span></div>
  <div class="formula"><code class="f">CSMA vulnerable time = T<sub>p</sub></code><span class="where">Maximum propagation time</span></div>
  <div class="formula"><code class="f">CSMA/CD: T<sub>fr</sub> ≥ 2T<sub>p</sub> → min frame = 2T<sub>p</sub> × B</code><span class="where">10 Mbps, T<sub>p</sub> = 25.6 µs → 512 bits = 64 bytes. <a href="#c9-minframe">Minimum frame size</a></span></div>
</div>
</section>

<section class="topic" id="fx-c10">
<h2>Chapter 10 · IP addressing and the datagram</h2>
<div class="fgrid">
  <div class="formula"><code class="f">N = 2<sup>32 − n</sup></code><span class="where">Addresses in a /n block. <a href="#c10-extract">Extracting information</a></span></div>
  <div class="formula"><code class="f">First = address AND mask · Last = address OR NOT(mask)</code><span class="where">Mask = n ones then zeros; N = NOT(mask) + 1. <a href="#c10-mask">Address mask</a></span></div>
  <div class="formula"><code class="f">n = 32 − log<sub>2</sub>N · first address divisible by N</code><span class="where">Block allocation rules. <a href="#c10-alloc">Block allocation</a></span></div>
  <div class="formula"><code class="f">n<sub>sub</sub> = 32 − log<sub>2</sub>N<sub>sub</sub> · hosts = 2<sup>32 − n</sup> − 2</code><span class="where">Assign the largest subnets first. <a href="#c10-design">Designing subnets</a></span></div>
  <div class="formula"><code class="f">Class by first byte: A 0–127 · B 128–191 · C 192–223 · D 224–239 · E 240–255</code><span class="where">Networks: 2<sup>7</sup>, 2<sup>14</sup>, 2<sup>21</sup>. <a href="#c10-classful">Classful</a></span></div>
  <div class="formula"><code class="f">Header bytes = HLEN × 4 · data = total length − HLEN × 4</code><span class="where">HLEN 5–15 → 20–60 bytes. <a href="#c10-datagram">IPv4 datagram</a></span></div>
  <div class="formula"><code class="f">Offset = first data byte / 8 · data per fragment = ⌊(MTU − header)/8⌋ × 8</code><span class="where">M = 1 except on the last fragment. <a href="#c10-frag">Fragmentation</a></span></div>
</div>
</section>

<section class="topic" id="fx-c11">
<h2>Chapter 11 · Routing</h2>
<div class="fgrid">
  <div class="formula"><code class="f">d<sub>x</sub>(y) = min<sub>v</sub> { c(x,v) + d<sub>v</sub>(y) }</code><span class="where">Bellman-Ford; the minimizing neighbour is the next hop. <a href="#c11-bf">Bellman-Ford</a></span></div>
  <div class="formula"><code class="f">D(v) = min( D(v), D(w) + c(w,v) )</code><span class="where">Dijkstra update after adding w to N′; O(n<sup>2</sup>). <a href="#c11-dijkstra">Dijkstra</a></span></div>
  <div class="formula"><code class="f">Least-cost paths = N × (N − 1); trees = N</code><span class="where"><a href="#c11-trees">Least-cost trees</a></span></div>
  <div class="formula"><code class="f">iBGP sessions = n(n − 1) / 2</code><span class="where">Full mesh in an AS with n routers. <a href="#c11-ibgp">iBGP</a></span></div>
  <div class="formula"><code class="f">RIP: max 15 hops, 16 = ∞ · timers 30 s / 180 s / 120 s</code><span class="where">Periodic (25–35 s random), expiration, garbage collection. <a href="#c11-rip">RIP</a></span></div>
</div>
</section>

<section class="topic" id="fx-c12">
<h2>Chapters 12–13 · Transport and application</h2>
<div class="fgrid">
  <div class="formula"><code class="f">Ports: 0–1023 well-known · 1024–49,151 registered · 49,152–65,535 dynamic</code><span class="where"><a href="#c12-ports">Port numbers</a></span></div>
  <div class="formula"><code class="f">Next seq = seq + bytes carried · ACK = next byte expected</code><span class="where">SYN and FIN consume one number. <a href="#c12-numbering">Numbering</a></span></div>
  <div class="formula"><code class="f">new ackNo + new rwnd ≥ last ackNo + last rwnd</code><span class="where">No shrinking of the send window. <a href="#c12-shrink">Shrinking</a></span></div>
  <div class="formula"><code class="f">EstimatedRTT = (1 − α)·EstimatedRTT + α·SampleRTT</code><span class="where">α = 0.125. <a href="#c12-rtt">RTT estimation</a></span></div>
  <div class="formula"><code class="f">DevRTT = (1 − β)·DevRTT + β·|SampleRTT − EstimatedRTT|</code><span class="where">β = 0.25</span></div>
  <div class="formula"><code class="f">TimeoutInterval = EstimatedRTT + 4·DevRTT</code></div>
  <div class="formula"><code class="f">Window = min(rwnd, cwnd)</code><span class="where">Slow start: +1 MSS per ACK (doubles per RTT); avoidance: +1 per RTT. <a href="#c12-tcpcc">Congestion control</a></span></div>
  <div class="formula"><code class="f">TCP throughput ≈ 0.75 × W<sub>max</sub> / RTT</code><span class="where">AIMD sawtooth. <a href="#c12-aimd">AIMD</a></span></div>
  <div class="formula"><code class="f">HTTP non-persistent: 2 RTT + transmit time per object</code><span class="where">N objects → N + 1 connections; persistent pipelined ≈ one RTT for all objects. <a href="#c13-persist">HTTP connections</a></span></div>
</div>
</section>

<section class="topic" id="fx-bench">
<h2>Calculator bench</h2>
<p>Each calculator shows its working, so you can check a hand-solved numerical line by line.</p>
<figure class="lab" data-widget="capacity"><figcaption><span class="ttl">Nyquist and Shannon</span><span class="cap">Bandwidth, levels and SNR in; bit rate and capacity out.</span></figcaption></figure>
<figure class="lab" data-widget="baud"><figcaption><span class="ttl">Bit rate, baud rate and bandwidth</span><span class="cap">S = c × N × 1/r for the common line codes.</span></figcaption></figure>
<figure class="lab" data-widget="perf"><figcaption><span class="ttl">Propagation, transmission and latency</span><span class="cap">Distance, speed, message size and bandwidth.</span></figcaption></figure>
<figure class="lab" data-widget="sweff"><figcaption><span class="ttl">Stop-and-Wait efficiency</span><span class="cap">η = 1/(1 + 2a).</span></figcaption></figure>
<figure class="lab" data-widget="ipv4"><figcaption><span class="ttl">IPv4 block and subnet calculator</span><span class="cap">Class, mask, first and last address, subnets.</span></figcaption></figure>
<figure class="lab" data-widget="frag"><figcaption><span class="ttl">Fragmentation</span><span class="cap">Fragments, offsets and M flags.</span></figcaption></figure>
<figure class="lab" data-widget="rtt"><figcaption><span class="ttl">RTT and time-out</span><span class="cap">EstimatedRTT, DevRTT and TimeoutInterval step by step.</span></figcaption></figure>
</section>
`
});
