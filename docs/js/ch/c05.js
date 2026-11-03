DCN.register({
  id: 'c5', num: 5, part: 'A', layer: 'phy', unit: 'Unit 3',
  title: 'Bandwidth Utilisation: Multiplexing and Spread Spectrum',
  short: 'Multiplexing',
  summary: 'How one link is shared by many signals: frequency-division, wavelength-division and time-division multiplexing (synchronous and statistical), the telephone hierarchies built on them, and the idea behind spread spectrum.',
  hot: ['Unit 3 numericals'],
  sources: ['UNIT3 (1) (1).pdf', 'CN_Complete_Notes'],
  keywords: 'multiplexing MUX DEMUX link channel FDM guard band group supergroup master group jumbo group AM FM AMPS WDM prism TDM synchronous time slot frame interleaving empty slots multilevel multiple-slot pulse stuffing framing bits DS-0 DS-1 T-1 193 bits E lines statistical TDM addressing slot size spread spectrum spreading code',
  html: `
<section class="topic" id="c5-intro">
<h2>Multiplexing</h2>
<p>Whenever the bandwidth of a medium linking two devices is greater than the bandwidth needs of the devices, the link can be shared. <b>Multiplexing</b> is the set of techniques that allow <b>simultaneous transmission of multiple signals across a single data link</b>. As traffic grows we can keep adding links, or install higher-bandwidth links and let each carry many signals.</p>
<ul>
  <li>In a multiplexed system, <b>n lines share the bandwidth of one link</b>.</li>
  <li>The lines feed a <b>multiplexer (MUX)</b>, which combines them into a single stream (many-to-one). At the far end a <b>demultiplexer (DEMUX)</b> separates the stream back into its component transmissions (one-to-many) and directs them to their lines.</li>
  <li>The <b>link</b> is the physical path; a <b>channel</b> is the portion of a link that carries a transmission between one pair of lines. One link can have many (n) channels.</li>
</ul>
<p>There are three basic techniques: <b>frequency-division multiplexing (FDM)</b> and <b>wavelength-division multiplexing (WDM)</b>, designed for analog signals, and <b>time-division multiplexing (TDM)</b>, designed for digital signals.</p>
<figure class="lab lab-3d" data-scene="mux"><figcaption><span class="ttl">Who owns which slice of the link?</span><span class="cap">The link as a block of frequency × time. Switch techniques and follow the bright "now" plane.</span></figcaption></figure>
</section>

<section class="topic" id="c5-fdm">
<h2>Frequency-division multiplexing (FDM)</h2>
<p>FDM is an <b>analog</b> technique used when the bandwidth of a link (in hertz) is greater than the combined bandwidths of the signals to be sent. Each sending device's signal modulates a <b>different carrier frequency</b>; the modulated signals are combined into one composite signal for the link. Carriers are separated by enough bandwidth for each modulated signal; these bandwidth ranges are the channels. Channels can be separated by strips of unused bandwidth, <b>guard bands</b>, to stop signals overlapping. FDM is analog, but digital sources can use it after converting their signals to analog.</p>
<div class="duo">
  <div class="card"><h4>Multiplexing process</h4><p>Each source produces a signal in a similar frequency range. Inside the MUX these similar signals modulate different carriers (f<sub>1</sub>, f<sub>2</sub>, f<sub>3</sub>); the results are combined into a single composite signal sent over a link with enough bandwidth.</p></div>
  <div class="card"><h4>Demultiplexing process</h4><p>The DEMUX uses a series of <b>filters</b> to split the composite signal into its components. Each is passed to a <b>demodulator</b> that separates it from its carrier and delivers it to its output line.</p></div>
</div>
<div class="example"><p class="ex-q">A voice channel occupies 4 kHz. Combine three voice channels into a link of 12 kHz, from 20 to 32 kHz, with no guard bands.</p><ol class="steps"><li>Shift (modulate) channel 1 to 20–24 kHz, channel 2 to 24–28 kHz, channel 3 to 28–32 kHz, and combine them.</li><li>At the receiver each channel gets the whole signal and uses a filter: 20–24, 24–28 or 28–32 kHz, discarding everything else.</li><li>Each channel then shifts its signal back to start from zero.</li></ol><p class="ex-a">Three 4 kHz bands side by side fill the 12 kHz link exactly.</p></div>
<div class="example"><p class="ex-q">Five channels of 100 kHz each are multiplexed with a 10 kHz guard band between channels. Minimum link bandwidth?</p><ol class="steps"><li>Five channels need at least four guard bands.</li><li>B = 5 × 100 + 4 × 10</li></ol><p class="ex-a">540 kHz</p></div>
<div class="example"><p class="ex-q">Four digital channels, each 1 Mbps, use a satellite channel of 1 MHz. Design an FDM configuration.</p><ol class="steps"><li>The satellite channel is analog: divide it into four channels of 250 kHz.</li><li>Each 1 Mbps stream must fit in 250 kHz, so 4 bits must be carried per hertz.</li></ol><p class="ex-a">Modulate each channel with 16-QAM (4 bits per signal element).</p></div>
<figure class="lab" data-widget="fdm"><figcaption><span class="ttl">FDM band planner</span><span class="cap">Change the channels and guard bands to see the total bandwidth.</span></figcaption></figure>
<h3 id="c5-hierarchy">The analog carrier system (FDM hierarchy)</h3>
<p>Telephone companies multiplex lower-bandwidth lines onto higher-bandwidth lines; for analog lines they use FDM in a hierarchy:</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Level</th><th>Built from</th><th>Bandwidth</th><th class="num">Voice channels</th></tr></thead>
<tbody>
<tr><th>Group</th><td>12 voice channels</td><td>48 kHz</td><td class="num">12</td></tr>
<tr><th>Supergroup</th><td>5 groups (or 60 independent voice channels)</td><td>240 kHz</td><td class="num">60</td></tr>
<tr><th>Master group</th><td>10 supergroups</td><td>2.40 MHz needed; 2.52 MHz with guard bands</td><td class="num">600</td></tr>
<tr><th>Jumbo group</th><td>6 master groups</td><td>6 × 2.52 = 15.12 MHz; augmented to 16.984 MHz for guard bands</td><td class="num">3600</td></tr>
</tbody></table></div>
<h3 id="c5-fdm-apps">Applications of FDM</h3>
<ul>
  <li><b>AM radio</b>: the band 530–1700 kHz, each station 10 kHz. Each station uses a different carrier frequency; the receiver tunes (filters) only the one it wants. There is no physical multiplexer here.</li>
  <li><b>FM radio</b>: a wider band of 88–108 MHz, because each station needs 200 kHz.</li>
  <li><b>Television</b>: each TV channel has its own 6 MHz.</li>
  <li><b>First-generation cellular telephones</b>: each user gets two 30 kHz channels, one for sending and one for receiving. The 3 kHz voice (300–3300 Hz) is modulated with FM, which needs 10 times the bandwidth: 30 kHz. So each user is given 60 kHz in total.</li>
</ul>
<div class="example"><p class="ex-q">AMPS uses 824–849 MHz for sending and 869–894 MHz for receiving; each user has 30 kHz in each direction. How many people can use their phones at once?</p><ol class="steps"><li>Each band is 25 MHz.</li><li>25 MHz / 30 kHz = 833.33; in reality the band is divided into 832 channels.</li><li>42 channels are used for control.</li></ol><p class="ex-a">832 − 42 = 790 channels for users at the same time.</p></div>
<p><b>Implementation</b>: FDM is easy to implement. In radio and TV broadcasting stations simply agree to use different carrier frequencies, with no physical MUX/DEMUX. In cellular systems a base station assigns a carrier to each user for the duration of the call; when the user hangs up the bandwidth goes to another caller.</p>
</section>

<section class="topic" id="c5-wdm">
<h2>Wavelength-division multiplexing (WDM)</h2>
<p>WDM is designed to use the high data rate of <b>fibre-optic cable</b>. Using a fibre for a single line wastes its bandwidth, so several lines are combined into one. WDM is conceptually the same as FDM, except that multiplexing and demultiplexing involve <b>optical signals</b> at very high frequencies: very narrow bands of light from different sources are combined into a wider band of light, and separated again at the receiver. Combining and splitting the light is easily done with a <b>prism</b>.</p>
</section>

<section class="topic" id="c5-tdm">
<h2>Synchronous time-division multiplexing</h2>
<p>TDM is a <b>digital</b> process that lets several connections share the high bandwidth of a link. Instead of sharing a portion of the bandwidth, they share <b>time</b>: each connection occupies a portion of time on the link. TDM is about multiplexing, not switching: data from source 1 always goes to the same destination, so delivery is fixed. Analog sources can use TDM after being sampled and digitised. There are two schemes: <b>synchronous</b> and <b>statistical</b>.</p>
<h3 id="c5-slots">Time slots and frames</h3>
<p>In synchronous TDM each input connection has an allotment in the output <b>even if it is not sending data</b>. Each input's data flow is divided into <b>units</b> (1 bit, one character or one block). Each input unit occupies one input time slot and becomes one output unit in one output time slot, but the output slot is <b>n times shorter</b>.</p>
<ul>
  <li>A round of one unit from each of the n connections forms a <b>frame</b> of n slots.</li>
  <li>If the input unit lasts T, each output slot lasts <b>T/n</b> and each frame lasts <b>T</b>.</li>
  <li>The output link's data rate must be <b>n times</b> the data rate of one connection.</li>
</ul>
<div class="fgrid">
  <div class="formula"><code class="f">output slot = input slot / n</code><span class="where">n = number of input connections</span></div>
  <div class="formula"><code class="f">frame duration = input unit duration</code><span class="where">frame rate = input rate / unit size</span></div>
  <div class="formula"><code class="f">link rate = frame rate × bits per frame</code><span class="where">bits per frame = n × unit + framing bits</span></div>
</div>
<div class="example"><p class="ex-q">Each of three input connections runs at 1 kbps and 1 bit is multiplexed at a time. Duration of each input slot, each output slot and each frame?</p><ol class="steps"><li>Bit duration = 1/1000 s = 1 ms, so the input slot is 1 ms.</li><li>Output slot = 1/3 of the input slot = 1/3 ms.</li><li>A frame has three output slots: 3 × 1/3 ms.</li></ol><p class="ex-a">1 ms · 1/3 ms · 1 ms (the frame lasts as long as one input unit)</p></div>
<div class="example"><p class="ex-q">Four 1 Mbps inputs, unit = 1 bit. Find the input bit duration, output bit duration, output bit rate and frame rate.</p><ol class="steps"><li>Input bit duration = 1/1 Mbps = 1 µs</li><li>Output bit duration = 1/4 µs</li><li>Output rate = 1/(1/4 µs) = 4 Mbps (4 × 1 Mbps)</li><li>Frame rate = input rate = 1,000,000 frames/s; check: 10⁶ frames × 4 bits = 4 Mbps</li></ol><p class="ex-a">1 µs · 0.25 µs · 4 Mbps · 10⁶ frames/s</p></div>
<div class="example"><p class="ex-q">Four 1 kbps connections, unit = 1 bit. Duration of a bit before multiplexing, link rate, slot duration, frame duration?</p><ol class="steps"><li>1/1 kbps = 1 ms</li><li>Link rate = 4 × 1 kbps = 4 kbps</li><li>Slot = 1/4 ms = 250 µs (also 1/4 kbps)</li><li>Frame = duration of one unit before multiplexing = 1 ms (4 × 250 µs)</li></ol><p class="ex-a">1 ms · 4 kbps · 250 µs · 1 ms</p></div>
<h3 id="c5-interleaving">Interleaving</h3>
<p>TDM can be pictured as two fast-rotating switches, one on the multiplexing side and one on the demultiplexing side, synchronised and rotating at the same speed in opposite directions. As the MUX switch opens in front of a connection, that connection sends one unit onto the path; as the DEMUX switch opens in front of a connection, that connection receives a unit. This is <b>interleaving</b>.</p>
<div class="example"><p class="ex-q">Four channels each send 100 bytes/s and 1 byte per channel is multiplexed. Frame size, frame duration, frame rate and link bit rate?</p><ol class="steps"><li>Each frame carries 1 byte from each channel: 4 bytes = 32 bits.</li><li>Each channel sends 100 bytes/s, so 100 frames/s; frame duration 1/100 s.</li><li>Link rate = 100 × 32 = 3200 bps (4 × 800 bps per channel).</li></ol><p class="ex-a">32 bits · 10 ms · 100 frames/s · 3200 bps</p></div>
<div class="example"><p class="ex-q">A multiplexer combines four 100 kbps channels with a 2-bit time slot. Frame rate, frame duration, bit rate and bit duration?</p><ol class="steps"><li>Each frame takes 2 bits per channel → 100,000 / 2 = 50,000 frames/s</li><li>Frame duration = 1/50,000 s = 20 µs</li><li>Each frame carries 8 bits → 50,000 × 8 = 400 kbps</li><li>Bit duration = 1/400,000 s = 2.5 µs (the frame is 8 bit-times long)</li></ol><p class="ex-a">50,000 frames/s · 20 µs · 400 kbps · 2.5 µs</p></div>
<h3 id="c5-empty">Empty slots and data rate management</h3>
<p>Synchronous TDM is not fully efficient: if a source has nothing to send, its slot in the output frame is <b>empty</b> (in your slide's figure, frames go out with three, two and three slots filled; none is full). When inputs run at different rates, three strategies (or a mix) are used:</p>
<div class="duo">
  <div class="card"><h4>Multilevel multiplexing</h4><p>For when one input's rate is a <b>multiple</b> of others. Two 20 kbps inputs are first multiplexed into 40 kbps, which then joins three 40 kbps inputs; a second level gives 160 kbps.</p></div>
  <div class="card"><h4>Multiple-slot allocation</h4><p>Give a fast input <b>more than one slot</b> per frame, e.g. a 50 kbps line gets two slots, with a demultiplexer splitting it into two 25 kbps inputs.</p></div>
  <div class="card"><h4>Pulse stuffing</h4><p>When rates are not integer multiples: make the highest rate dominant and add <b>dummy bits</b> to the slower lines (also called bit padding or bit stuffing). A 46 kbps input is stuffed up to 50 kbps.</p></div>
</div>
<details class="solution"><summary>Practice: channels of 100 kbps and 200 kbps are to be multiplexed. How? Frame rate, frame duration and link rate?</summary><div class="body"><p>Give one slot to the first channel and two slots to the second, so each frame carries 3 bits. The frame rate is <b>100,000 frames/s</b> (one bit from the first channel per frame), so the frame duration is 1/100,000 s = <b>10 µs</b>. Link rate = 100,000 × 3 = <b>300 kbps</b>; both channels keep their rates.</p></div></details>
<h3 id="c5-framing">Frame synchronisation</h3>
<p>TDM is harder to implement than FDM because the MUX and DEMUX must stay synchronised; otherwise a bit belonging to one channel goes to the wrong channel. So one or more <b>synchronisation (framing) bits</b> are added to the start of each frame. They follow a pattern from frame to frame, usually <b>1 bit per frame alternating 0 and 1</b>, letting the DEMUX lock onto the stream and separate the slots accurately.</p>
<div class="example"><p class="ex-q">Four sources each create 250 characters per second. The interleaved unit is a character and 1 synchronising bit is added per frame. Find (1) each source's rate, (2) the duration of a character, (3) the frame rate, (4) the frame duration, (5) bits per frame, (6) the link rate.</p><ol class="steps"><li>250 × 8 = 2000 bps = 2 kbps</li><li>1/250 s = 4 ms per character</li><li>One character from each source per frame → 250 frames/s</li><li>1/250 s = 4 ms (same as one character)</li><li>4 × 8 + 1 = 33 bits</li><li>250 × 33 = 8250 bps</li></ol><p class="ex-a">The link rate (8250 bps) exceeds the sum of the inputs (8000 bps) by 250 bps: one framing bit per frame.</p></div>
<figure class="lab" data-widget="tdm"><figcaption><span class="ttl">Synchronous TDM frame builder</span><span class="cap">Presets cover every slide example and the T-1 line.</span></figcaption></figure>
<h3 id="c5-ds">Digital signal service and T lines</h3>
<p>Telephone companies implement TDM through a hierarchy of digital signals, the <b>digital signal (DS) service</b>:</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Service</th><th>Rate</th><th>Made of</th><th>Line</th></tr></thead>
<tbody>
<tr><th>DS-0</th><td class="num">64 kbps</td><td>a single digital channel</td><td>—</td></tr>
<tr><th>DS-1</th><td class="num">1.544 Mbps</td><td>24 × 64 kbps + 8 kbps overhead; 24 DS-0</td><td>T-1</td></tr>
<tr><th>DS-2</th><td class="num">6.312 Mbps</td><td>96 × 64 kbps + 168 kbps overhead; 4 DS-1</td><td>T-2</td></tr>
<tr><th>DS-3</th><td class="num">44.376 Mbps</td><td>672 × 64 kbps + 1.368 Mbps overhead; 7 DS-2 or 28 DS-1</td><td>T-3</td></tr>
<tr><th>DS-4</th><td class="num">274.176 Mbps</td><td>4032 × 64 kbps + 16.128 Mbps overhead; 6 DS-3, 42 DS-2 or 168 DS-1</td><td>T-4</td></tr>
</tbody></table></div>
<ul>
  <li>DS-0, DS-1… are the names of <b>services</b>; <b>T lines</b> (T-1 to T-4) are the lines whose capacities match them. So far only T-1 and T-3 are commercially available.</li>
  <li>T lines are digital, but can carry analog telephone calls if the signals are first sampled and then time-division multiplexed.</li>
  <li><b>The T-1 frame</b>: DS-1 needs 8 kbps of overhead. A frame is <b>193 bits</b>: 24 slots of 8 bits plus 1 framing bit (24 × 8 + 1 = 193). Each slot holds one sample from one channel. With 8000 frames per second the rate is 193 × 8000 = <b>1.544 Mbps</b>.</li>
  <li><b>E lines</b> are the European version: conceptually identical, with different capacities.</li>
  <li>Some <b>second-generation cellular</b> systems divide the band into 30 kHz channels and apply TDM so six users share each band, giving six times more users.</li>
</ul>
</section>

<section class="topic" id="c5-statdm">
<h2>Statistical time-division multiplexing</h2>
<p>In synchronous TDM each input has a reserved slot, which is wasteful when lines are idle. In <b>statistical TDM</b>, slots are allocated <b>dynamically</b>: only an input line with a slot's worth of data gets a slot. The number of slots per frame is less than the number of input lines. The multiplexer checks the lines in <b>round-robin</b> order; it gives a slot to a line with data and skips the others.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Synchronous TDM</th><th>Statistical TDM</th></tr></thead>
<tbody>
<tr><th>Slot allocation</th><td>Fixed: every input owns a slot in every frame</td><td>Dynamic: only inputs with data get slots</td></tr>
<tr><th>Empty slots</th><td>Yes, wasted</td><td>No</td></tr>
<tr><th>Addressing</th><td>None needed: position in the frame is the address</td><td>Each slot carries data <b>and</b> the destination address (n = log₂N bits for N outputs, e.g. 3 bits for 8 lines)</td></tr>
<tr><th>Slot size</th><td>Can be one bit</td><td>Must be large compared with the address (1 data bit + 3 address bits = 300% overhead), so usually many bytes</td></tr>
<tr><th>Synchronisation bits</th><td>Needed in every frame</td><td>Not needed</td></tr>
<tr><th>Link capacity</th><td>Sum of all input capacities</td><td>Usually less than the sum, based on load statistics; at peak times some slots must wait</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c5-ss">
<h2>Spread spectrum</h2>
<p>Multiplexing combines signals from several sources for <b>bandwidth efficiency</b>: the link's bandwidth is divided between them. In <b>spread spectrum (SS)</b> we also combine signals from different sources, but into a <b>larger</b> bandwidth. It is designed for <b>wireless</b> LANs and WANs, where every station uses the air (or vacuum) as the medium and must share it <b>without interception by an eavesdropper</b> and <b>without being jammed</b> by a malicious intruder. Two principles:</p>
<ol>
  <li>The bandwidth allocated to each station is <b>far larger than it needs</b> (B<sub>SS</sub> ≫ B). This redundancy is what gives the protection.</li>
  <li>The expansion from B to B<sub>SS</sub> must be done by a process <b>independent of the original signal</b>: after the source creates the signal, the spreading process uses a <b>spreading code</b> to spread its bandwidth. The spreading code is a series of numbers that looks random but is actually a pattern.</li>
</ol>
<figure class="fig">
<svg viewBox="0 0 560 120" role="img" aria-label="Spread spectrum: bandwidth B spread to Bss by a spreading process">
  <path d="M30 80 C 40 40, 70 40, 80 80 Z" style="fill:var(--phy);fill-opacity:.4;stroke:var(--phy)"/><text x="55" y="100" text-anchor="middle" style="font-size:12px">B</text>
  <line x1="90" y1="70" x2="200" y2="70" style="stroke:var(--ink-2);stroke-width:2"/>
  <rect x="200" y="45" width="120" height="50" rx="6" style="fill:var(--surface-2);stroke:var(--line-2)"/><text x="260" y="74" text-anchor="middle" style="font-size:13px;font-weight:600">Spreading process</text>
  <line x1="260" y1="95" x2="260" y2="112" style="stroke:var(--ink-2)"/><text x="260" y="118" text-anchor="middle" style="font-size:11px">spreading code</text>
  <line x1="320" y1="70" x2="380" y2="70" style="stroke:var(--ink-2);stroke-width:2"/>
  <path d="M385 80 C 390 58, 400 56, 420 56 L 500 56 C 520 56, 530 58, 535 80 Z" style="fill:var(--net);fill-opacity:.3;stroke:var(--net)"/><text x="460" y="100" text-anchor="middle" style="font-size:12px">B<tspan baseline-shift="sub" style="font-size:9px">SS</tspan></text>
</svg>
</figure>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Multiplexing</th><th>Spread spectrum</th></tr></thead>
<tbody>
<tr><th>Goal</th><td>Bandwidth efficiency</td><td>Privacy and anti-jamming for wireless</td></tr>
<tr><th>Bandwidth per source</th><td>A share of the link</td><td>Much larger than needed</td></tr>
<tr><th>Typical medium</th><td>Cable, fibre, radio</td><td>Air (wireless LANs and WANs)</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c5-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>What is multiplexing? Explain FDM with the multiplexing and demultiplexing process. · 6–8 marks</summary><div class="body"><p>Definition, MUX/DEMUX figure with link vs channel, the three techniques. FDM: modulate different carriers, guard bands, combine; DEMUX with filters and demodulators. Add the 540 kHz example and one application (AM, FM, TV or AMPS).</p></div></details>
<details class="answer"><summary>Explain the analog hierarchy used by telephone companies. · 4 marks</summary><div class="body"><p>Group (12 channels, 48 kHz) → supergroup (5 groups, 240 kHz, 60 channels) → master group (10 supergroups, 2.52 MHz, 600 channels) → jumbo group (6 master groups, 16.984 MHz).</p></div></details>
<details class="answer"><summary>Explain synchronous TDM: time slots, frames and interleaving. Solve a frame-rate problem. · 8 marks</summary><div class="body"><p>Slots and frames (output slot T/n, frame T, link rate n × input), interleaving with rotating switches, empty slots, then one numerical (four 100 kbps channels with 2-bit slots, or the 250 characters/s example with a sync bit).</p></div></details>
<details class="answer"><summary>How does TDM handle different input data rates? · 6 marks</summary><div class="body"><p>Multilevel multiplexing, multiple-slot allocation and pulse stuffing, each with the slide example. Add frame synchronisation with framing bits.</p></div></details>
<details class="answer"><summary>Explain the DS hierarchy and the T-1 frame. · 4–6 marks</summary><div class="body"><p>DS-0 to DS-4 table; T lines implement DS services; T-1 frame of 193 bits (24 × 8 + 1) × 8000 frames/s = 1.544 Mbps; E lines.</p></div></details>
<details class="answer"><summary>Compare synchronous and statistical TDM. · 6 marks</summary><div class="body"><p>Use the comparison table: allocation, empty slots, addressing (log₂N bits), slot size, synchronisation bits, link capacity.</p></div></details>
<details class="answer"><summary>What is spread spectrum? State its principles. · 4 marks</summary><div class="body"><p>Combining signals into a larger bandwidth for wireless privacy and anti-jamming; B<sub>SS</sub> ≫ B; spreading done independently of the signal using a pseudo-random spreading code; figure.</p></div></details>
</section>
`,
  quiz: [
    { q: 'Which multiplexing techniques are designed for analog signals?', o: ['TDM only', 'FDM and WDM', 'TDM and WDM', 'Statistical TDM'], a: 1, why: 'FDM and WDM combine analog (or optical) signals; TDM is digital.' },
    { q: 'Five 100 kHz channels with 10 kHz guard bands need a minimum link bandwidth of', o: ['500 kHz', '540 kHz', '550 kHz', '510 kHz'], a: 1, why: '5 × 100 + 4 × 10 = 540 kHz; five channels need only four guard bands.' },
    { q: 'A group in the analog hierarchy carries', o: ['5 voice channels', '12 voice channels', '60 voice channels', '600 voice channels'], a: 1, why: 'A group is 12 voice channels in 48 kHz.' },
    { q: 'Each FM radio station needs a bandwidth of', o: ['10 kHz', '30 kHz', '200 kHz', '6 MHz'], a: 2, why: 'That is why the FM band (88–108 MHz) is wider than AM.' },
    { q: 'WDM is conceptually the same as', o: ['TDM', 'FDM', 'CDMA', 'Statistical TDM'], a: 1, why: 'It combines very high frequencies of light, using a prism.' },
    { q: 'In synchronous TDM with n inputs, the output slot duration is', o: ['n × T', 'T', 'T / n', 'T / 2n'], a: 2, why: 'Each output unit travels n times faster.' },
    { q: 'Four 100 kbps channels are multiplexed with 2-bit slots. The frame rate is', o: ['100,000 frames/s', '50,000 frames/s', '400,000 frames/s', '25,000 frames/s'], a: 1, why: 'Each frame takes 2 bits from each channel: 100,000 / 2 = 50,000.' },
    { q: 'How many bits are in a T-1 frame?', o: ['192', '193', '256', '24'], a: 1, why: '24 slots × 8 bits + 1 framing bit.' },
    { q: 'DS-1 runs at', o: ['64 kbps', '1.544 Mbps', '6.312 Mbps', '44.376 Mbps'], a: 1, why: '24 × 64 kbps + 8 kbps overhead.' },
    { q: 'Adding dummy bits to slower inputs so all rates match is called', o: ['Multilevel multiplexing', 'Multiple-slot allocation', 'Pulse stuffing', 'Interleaving'], a: 2, why: 'Also called bit padding or bit stuffing.' },
    { q: 'Statistical TDM needs an address in each slot because', o: ['Slots are fixed', 'There is no fixed relationship between inputs and outputs', 'It uses guard bands', 'Frames are synchronised'], a: 1, why: 'Slots are given dynamically, so position no longer identifies the destination.' },
    { q: 'Spread spectrum makes the bandwidth allocated to each station', o: ['Exactly what it needs', 'Smaller than it needs', 'Far larger than it needs', 'Zero when idle'], a: 2, why: 'The redundancy protects against eavesdropping and jamming.' }
  ]
});
