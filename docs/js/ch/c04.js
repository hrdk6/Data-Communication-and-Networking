DCN.register({
  id: 'c4', num: 4, part: 'A', layer: 'phy', unit: 'Unit 2',
  title: 'Digital and Analog Transmission',
  short: 'Transmission',
  summary: 'Turning bits into signals and signals into bits: line coding schemes, pulse code modulation, parallel and serial transmission modes, and the four ways to put digital data on an analog carrier.',
  hot: ['IA-1 Q2a', 'IA-1 Q3b', 'IA-1 Q5a'],
  sources: ['U-2_GCR.ppt', '7.ppt', 'cn_module1 (naveen notes).pdf', 'IA-1 answer scheme.pdf'],
  keywords: 'line coding data element signal element bit rate baud rate signal rate baseline wandering DC component self-synchronization unipolar polar NRZ NRZ-L NRZ-I RZ manchester differential manchester bipolar AMI pseudoternary PCM sampling nyquist PAM quantization quantization error SNR companding encoding parallel serial asynchronous synchronous isochronous start bit stop bit ASK FSK PSK BPSK QPSK QAM constellation carrier',
  html: `
<section class="topic" id="c4-linecoding-basics">
<h2>Digital-to-digital conversion: line coding</h2>
<p>Digital data can be represented by digital signals using three techniques: <b>line coding</b>, block coding and scrambling. <b>Line coding is always needed</b>; the other two may or may not be. Line coding is the process of converting digital data (a string of 1s and 0s) into a digital signal, for example +V for 1 and 0 V or −V for 0. The sender encodes; the receiver recreates the data by decoding the signal.</p>
<h3 id="c4-elements">Data element versus signal element</h3>
<ul>
  <li>A <b>data element</b> is the smallest entity that can represent information: the bit. Data elements are what we need to send; they are carried.</li>
  <li>A <b>signal element</b> is the shortest unit (timewise) of a digital signal. Signal elements are what we can send; they are the carriers.</li>
  <li><b>r</b> = number of data elements carried by each signal element. One data element per signal element: r = 1. Two signal elements (two transitions) per data element: r = ½.</li>
</ul>
<h3 id="c4-rates">Data rate versus signal rate</h3>
<p>The <b>data rate</b> (bit rate, N) is the number of bits sent in 1 s, in bps. The <b>signal rate</b> (pulse rate, modulation rate or <b>baud rate</b>, S) is the number of signal elements sent in 1 s, in baud. A good design <b>increases the data rate while decreasing the signal rate</b>: a higher data rate means faster transmission, a lower signal rate means less bandwidth.</p>
<div class="fgrid">
  <div class="formula"><code class="f">S = N / r</code><span class="where">Basic relation between signal rate and data rate.</span></div>
  <div class="formula"><code class="f">S<sub>ave</sub> = c × N × (1/r) baud</code><span class="where">c = case factor (0 to 1) for worst, best and average cases; c = ½ for the average case.</span></div>
  <div class="formula"><code class="f">B<sub>min</sub> = c × N × (1/r)</code><span class="where">The baud rate, not the bit rate, decides the bandwidth: more changes in the signal inject more frequencies.</span></div>
  <div class="formula"><code class="f">N<sub>max</sub> = (1/c) × B × r</code><span class="where">Maximum data rate for a given bandwidth. With L levels r = log₂L and c = ½, this becomes Nyquist's 2 × B × log₂L.</span></div>
</div>
<div class="example"><p class="ex-q">A signal carries data with one data element per signal element (r = 1). The bit rate is 100 kbps. What is the average baud rate if c is between 0 and 1?</p><ol class="steps"><li>Average case: c = ½</li><li>S = c × N × (1/r) = ½ × 100,000 × 1</li></ol><p class="ex-a">S = 50,000 baud = 50 kbaud</p></div>
<div class="example"><p class="ex-q"><b>IA-1 Q3b.</b> An analog signal has a bit rate of 8000 bps and a baud rate of 1000 baud. How many data elements does each signal element carry, and how many signal elements (levels) are needed?</p><ol class="steps"><li>r = N / S = 8000 / 1000 = 8 bits per signal element</li><li>L = 2<sup>r</sup> = 2⁸</li></ol><p class="ex-a">8 data elements per signal element; 256 signal elements (levels). Scheme: 2 + 2 marks.</p></div>
<figure class="lab" data-widget="baud" data-n="8000" data-s="1000"><figcaption><span class="ttl">Bit rate ↔ baud rate solver</span><span class="cap">Preloaded with IA-1 Q3b.</span></figcaption></figure>
<h3 id="c4-issues">What a good line code must handle</h3>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Issue</th><th>What goes wrong</th></tr></thead>
<tbody>
<tr><th>Baseline wandering</th><td>The receiver keeps a running average of received power, the <b>baseline</b>, and judges each element against it. A long run of 0s or 1s makes the baseline drift, so decoding becomes hard. A good code avoids long runs at one level.</td></tr>
<tr><th>DC components</th><td>A constant voltage for a while creates very low frequencies near zero (DC components). Systems that cannot pass low frequencies, or that use electrical (transformer) coupling, cannot carry them, and long-distance transfer of such a signal is not feasible.</td></tr>
<tr><th>Self-synchronisation</th><td>The receiver's bit intervals must match the sender's. If its clock is faster or slower it misreads the stream: the sender sends 10110001 but a receiver with a shorter bit duration reads 110111000011. A <b>self-synchronising</b> signal includes timing information: transitions at the start, middle or end of a pulse reset the receiver's clock.</td></tr>
<tr><th>Built-in error detection</th><td>It helps if the code itself can reveal some errors that happened in transmission.</td></tr>
<tr><th>Immunity to noise and interference</th><td>The code should resist noise and other interference.</td></tr>
<tr><th>Complexity</th><td>A complex scheme is more costly; four signal levels are harder to interpret than two.</td></tr>
</tbody></table></div>
<details class="solution"><summary>Practice: the receiver clock is 0.1% faster than the sender's. How many extra bits per second does it read at 1 kbps? At 1 Mbps?</summary><div class="body"><p>At 1 kbps the receiver reads 1001 bits instead of 1000: <b>1 extra bps</b>. At 1 Mbps it reads 1,001,000: <b>1000 extra bps</b>. This is why self-synchronisation matters more at high rates.</p></div></details>
</section>

<section class="topic" id="c4-schemes">
<h2>Line coding schemes</h2>
<p>The schemes in your syllabus fall into three groups: <b>unipolar</b> (NRZ), <b>polar</b> (NRZ-L, NRZ-I, RZ, and the biphase Manchester and differential Manchester) and <b>bipolar</b> (AMI and pseudoternary).</p>
<figure class="lab" data-widget="linecoding" data-bits="1011001011" data-show="unrz,nrzl,nrzi,rz,manch"><figcaption><span class="ttl">Line coding visualiser</span><span class="cap">Preloaded with the IA-1 Q2a bit string 1011001011. Tick schemes to compare them; change the bits to practise.</span></figcaption></figure>
<h3 id="c4-unipolar">Unipolar: NRZ</h3>
<p>All signal levels are on one side of the time axis. Positive voltage defines bit 1 and zero voltage defines bit 0. It is called <b>non-return-to-zero</b> because the signal does not return to zero at the middle of the bit. It is costly: it needs twice the power of polar NRZ for the same performance, and it has a DC component and no self-synchronisation.</p>
<h3 id="c4-polar">Polar: NRZ-L and NRZ-I</h3>
<p>In polar schemes the voltages are on both sides of the time axis (e.g. +V for 0 and −V for 1). Polar NRZ uses two voltage levels and comes in two versions:</p>
<div class="duo">
  <div class="card"><h4>NRZ-L (NRZ-Level)</h4><p>The <b>level</b> of the voltage decides the bit: 0 → +V, 1 → −V.</p></div>
  <div class="card"><h4>NRZ-I (NRZ-Invert)</h4><p>A <b>change</b> in level means 1; no change means 0. The signal inverts on every 1.</p></div>
</div>
<ul>
  <li>Long runs of 0s or 1s skew the average power (baseline wandering) in NRZ-L; in NRZ-I this happens only for long runs of 0s.</li>
  <li>The synchronisation problem exists in both but is more serious in NRZ-L: long 0s hurt both, long 1s only NRZ-L.</li>
  <li>A sudden change of polarity (e.g. the two wires of a twisted pair swapped) makes NRZ-L read every 0 as 1 and every 1 as 0. NRZ-I does not have this problem.</li>
  <li>Both have an average signal rate of <b>N/2 baud</b>.</li>
</ul>
<div class="example"><p class="ex-q">A system uses NRZ-I to transfer 1-Mbps data. Average signal rate and minimum bandwidth?</p><ol class="steps"><li>S = N/2 = 1,000,000 / 2 = 500 kbaud</li><li>B<sub>min</sub> = S</li></ol><p class="ex-a">500 kbaud; minimum bandwidth 500 kHz</p></div>
<div class="note warn"><b class="tag">Heads-up</b><p>Your U-2 slide prints this example as "10-Mbps data" but keeps the answer 500 kbaud, which only fits 1 Mbps. For 10 Mbps the answer would be 5 Mbaud and 5 MHz. Quote whichever version the question gives and apply S = N/2.</p></div>
<h3 id="c4-rz">Polar RZ</h3>
<p><b>Return-to-zero</b> fixes NRZ's clocking problem by using three values: positive, negative and zero. The signal changes <b>during</b> the bit, not between bits: it goes to 0 in the middle of each bit and stays there until the next bit begins (1 → +V then 0, 0 → −V then 0).</p>
<ul><li>Disadvantage: two signal changes per bit, so it occupies more bandwidth; three levels make it more complex.</li><li>The polarity-reversal problem still exists, but there is <b>no DC component</b>.</li></ul>
<h3 id="c4-biphase">Biphase: Manchester and differential Manchester</h3>
<div class="duo">
  <div class="card"><h4>Manchester</h4><p>Combines the ideas of RZ (transition at mid-bit) and NRZ-L. Each bit is divided into two halves; the voltage stays at one level in the first half and moves to the other in the second. <b>0 = high-to-low, 1 = low-to-high</b>. The mid-bit transition provides synchronisation.</p></div>
  <div class="card"><h4>Differential Manchester</h4><p>Combines RZ and NRZ-I. There is <b>always</b> a transition at the middle of the bit, but the value is decided at the <b>beginning</b>: if the next bit is 0 there is a transition; if it is 1 there is none.</p></div>
</div>
<ul><li>Both overcome baseline wandering and have <b>no DC component</b>.</li><li>Their minimum bandwidth is <b>twice that of NRZ</b> (r = ½, average S = N).</li></ul>
<h3 id="c4-bipolar">Bipolar: AMI and pseudoternary</h3>
<p>Bipolar (multilevel binary) encoding uses three levels: positive, zero and negative. One data element is at zero; the other alternates between positive and negative.</p>
<div class="duo">
  <div class="card"><h4>AMI (alternate mark inversion)</h4><p>"Mark" is telegraphy's word for 1, so AMI means alternate-1 inversion. <b>0 → zero voltage; each 1 alternates +V, −V</b>.</p></div>
  <div class="card"><h4>Pseudoternary</h4><p>The mirror image: <b>1 → zero voltage; each 0 alternates +V, −V</b>.</p></div>
</div>
<ul>
  <li>Same signal rate as NRZ (N/2), but <b>no DC component</b>: a long run of 1s alternates, and a long run of 0s sits at zero amplitude, which has no DC either.</li>
  <li>NRZ has most of its energy near zero frequency, which suits channels poorly; bipolar energy is concentrated around N/2.</li>
  <li>AMI is commonly used for long-distance communication but loses synchronisation on a long run of 0s.</li>
</ul>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Scheme</th><th>Category</th><th>r</th><th>Average baud</th><th>Bandwidth</th><th>DC component</th><th>Self-sync</th></tr></thead>
<tbody>
<tr><th>Unipolar NRZ</th><td>Unipolar</td><td>1</td><td>N/2</td><td>N/2</td><td>Yes</td><td>No</td></tr>
<tr><th>NRZ-L</th><td>Polar</td><td>1</td><td>N/2</td><td>N/2</td><td>Yes</td><td>No (long 0s or 1s)</td></tr>
<tr><th>NRZ-I</th><td>Polar</td><td>1</td><td>N/2</td><td>N/2</td><td>Yes</td><td>No (long 0s)</td></tr>
<tr><th>RZ</th><td>Polar</td><td>½</td><td>N</td><td>N</td><td>No</td><td>Yes</td></tr>
<tr><th>Manchester / Diff. Manchester</th><td>Polar biphase</td><td>½</td><td>N</td><td>N</td><td>No</td><td>Yes</td></tr>
<tr><th>AMI / Pseudoternary</th><td>Bipolar</td><td>1</td><td>N/2</td><td>N/2</td><td>No</td><td>No (long 0s / long 1s)</td></tr>
</tbody></table></div>
<div class="note exam"><b class="tag">IA-1 Q2a · 6 marks</b><p><b>Encode 1011001011 in NRZ, NRZ-L, NRZ-I, RZ and Manchester.</b> Scheme: NRZ 1 + NRZ-L 1 + NRZ-I 1 + RZ 1.5 + Manchester 1.5. Draw each on its own time axis with dashed bit boundaries and the bits written on top, and <b>state your assumptions</b> (NRZ-L: 0 = +V; NRZ-I: line starts high).</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Bit</th><th>1</th><th>0</th><th>1</th><th>1</th><th>0</th><th>0</th><th>1</th><th>0</th><th>1</th><th>1</th></tr></thead>
<tbody>
<tr><th>Unipolar NRZ</th><td>+</td><td>0</td><td>+</td><td>+</td><td>0</td><td>0</td><td>+</td><td>0</td><td>+</td><td>+</td></tr>
<tr><th>NRZ-L</th><td>−</td><td>+</td><td>−</td><td>−</td><td>+</td><td>+</td><td>−</td><td>+</td><td>−</td><td>−</td></tr>
<tr><th>NRZ-I (start +)</th><td>−</td><td>−</td><td>+</td><td>−</td><td>−</td><td>−</td><td>+</td><td>+</td><td>−</td><td>+</td></tr>
<tr><th>RZ</th><td>+ 0</td><td>− 0</td><td>+ 0</td><td>+ 0</td><td>− 0</td><td>− 0</td><td>+ 0</td><td>− 0</td><td>+ 0</td><td>+ 0</td></tr>
<tr><th>Manchester</th><td>− +</td><td>+ −</td><td>− +</td><td>− +</td><td>+ −</td><td>+ −</td><td>− +</td><td>+ −</td><td>− +</td><td>− +</td></tr>
</tbody></table></div></div>
</section>

<section class="topic" id="c4-pcm">
<h2>Analog-to-digital conversion: PCM</h2>
<p>A digital signal is superior to an analog one: it is more robust to noise and can easily be recovered, corrected and amplified. So the tendency today is to change analog signals into digital data. The most common technique is <b>pulse code modulation (PCM)</b>. A PCM encoder has three processes:</p>
<div class="flow"><span>Analog signal</span><i>→</i><span>(low-pass filter)</span><i>→</i><span>1 · Sampling → PAM</span><i>→</i><span>2 · Quantization</span><i>→</i><span>3 · Encoding</span><i>→</i><span>Digital data 1100…</span></div>
<p>Before sampling, the signal is filtered to limit its maximum frequency, which decides the sampling rate. The filter must not distort the signal by removing components that matter.</p>
<figure class="lab" data-widget="pcm"><figcaption><span class="ttl">PCM lab: sample, quantize, encode</span><span class="cap">Try 1 × fmax to see aliasing, then 2 × (Nyquist). Change L to watch the error and SNR change.</span></figcaption></figure>
<h3 id="c4-sampling">1 · Sampling</h3>
<p>The analog signal is sampled every <b>T<sub>s</sub></b> seconds (the sample interval). Its inverse is the <b>sampling rate</b> f<sub>s</sub> = 1/T<sub>s</sub>. The process is also called <b>pulse amplitude modulation (PAM)</b>; the result is still a signal with analog (non-integral) values.</p>
<div class="duo">
  <div class="card"><h4>Ideal</h4><p>An impulse at each sampling instant. Ideal, but not easy to implement.</p></div>
  <div class="card"><h4>Natural</h4><p>A high-speed switch is on for a short time; the pulse keeps the shape of the analog signal.</p></div>
  <div class="card"><h4>Flat-top</h4><p>The most common: a <b>sample-and-hold</b> circuit makes each pulse a single, constant amplitude.</p></div>
</div>
<div class="note def"><b class="tag">Nyquist theorem</b><p>To reproduce the original analog signal, the sampling rate must be <b>at least twice the highest frequency</b> contained in the signal: <b>f<sub>s</sub> ≥ 2 f<sub>max</sub></b>.</p><ul><li>We can sample a signal only if it is <b>band-limited</b>; a signal with infinite bandwidth cannot be sampled.</li><li>It is twice the <b>highest frequency</b>, not the bandwidth. For a low-pass signal the two are equal; for a bandpass signal the bandwidth is smaller than the highest frequency.</li></ul></div>
<p>Sampling at the Nyquist rate recovers the signal; oversampling (e.g. 4f) also works but wastes samples; undersampling (e.g. f) gives samples that look like a different, slower signal, so the original cannot be recovered. Telephone companies digitise voice assuming a maximum frequency of 4000 Hz, so they sample at <b>8000 samples per second</b>.</p>
<div class="example"><p class="ex-q">A complex low-pass signal has a bandwidth of 200 kHz. Minimum sampling rate?</p><ol class="steps"><li>Low-pass: frequencies from 0 to 200 kHz, so f<sub>max</sub> = 200 kHz</li><li>f<sub>s</sub> = 2 × 200 kHz</li></ol><p class="ex-a">400,000 samples per second</p></div>
<div class="example"><p class="ex-q">A complex bandpass signal has a bandwidth of 200 kHz. Minimum sampling rate?</p><ol class="steps"><li>We do not know where the band starts or ends, so we do not know f<sub>max</sub>.</li></ol><p class="ex-a">It cannot be found from the bandwidth alone.</p></div>
<h3 id="c4-quantization">2 · Quantization</h3>
<p>Sampling gives pulses whose amplitudes can take infinitely many non-integral values between the signal's minimum and maximum. Such values cannot be encoded with a finite number of bits, so they are mapped onto a finite set:</p>
<ol>
  <li>Assume the signal's instantaneous amplitudes lie between V<sub>min</sub> and V<sub>max</sub>.</li>
  <li>Divide the range into <b>L zones</b>, each of height <b>Δ = (V<sub>max</sub> − V<sub>min</sub>) / L</b>.</li>
  <li>Assign quantized values 0 to L − 1 to the <b>midpoint</b> of each zone.</li>
  <li>Approximate every sample to the quantized value of its zone.</li>
</ol>
<div class="example"><p class="ex-q">Sample amplitudes lie between −20 V and +20 V and we use L = 8 levels.</p><ol class="steps"><li>Δ = (20 − (−20)) / 8 = 5 V</li><li>Zones: −20 to −15, −15 to −10, −10 to −5, −5 to 0, 0 to 5, 5 to 10, 10 to 15, 15 to 20</li><li>Midpoints: −17.5, −12.5, −7.5, −2.5, 2.5, 7.5, 12.5, 17.5</li><li>Codes: n<sub>b</sub> = log₂ 8 = 3 bits → 000 for the lowest zone … 111 for the highest</li></ol><p class="ex-a">Each sample is sent as one 3-bit code.</p></div>
<ul>
  <li><b>Choosing L</b> depends on the amplitude range and the accuracy needed: two levels if the signal only takes two values; audio normally uses L = 256; video uses thousands. A low L with a lot of fluctuation increases the error.</li>
  <li><b>Quantization error</b>: the output is the zone midpoint, so unless the input is exactly at the midpoint there is an error of up to Δ/2. More zones mean a smaller Δ and smaller errors, but more bits per sample and a higher bit rate.</li>
</ul>
<div class="formula"><code class="f">SNR<sub>dB</sub> = 6.02 n<sub>b</sub> + 1.76 dB</code><span class="where">Contribution of quantization error to the SNR; n<sub>b</sub> = bits per sample. Each extra bit adds about 6 dB.</span></div>
<div class="example"><p class="ex-q">What is the SNR<sub>dB</sub> with eight levels (3 bits per sample)?</p><ol class="steps"><li>SNR<sub>dB</sub> = 6.02 × 3 + 1.76</li></ol><p class="ex-a">19.82 dB</p></div>
<div class="example"><p class="ex-q">A telephone subscriber line must have SNR<sub>dB</sub> above 40. Minimum bits per sample?</p><ol class="steps"><li>6.02 n<sub>b</sub> + 1.76 = 40 → n<sub>b</sub> = 38.24 / 6.02 = 6.35</li></ol><p class="ex-a">7 bits per sample (telephone companies usually assign 7 or 8)</p></div>
<h3 id="c4-nonuniform">Uniform and nonuniform quantization</h3>
<p>In many signals (like voice) amplitude changes happen more often at low amplitudes, and weak samples suffer most from a fixed Δ/2 error. <b>Nonuniform quantization</b> uses zones that are smaller near the low amplitudes and larger near the high ones, aiming to keep the signal-to-quantization-noise ratio steady for all sample values. It can also be achieved by <b>companding and expanding</b>: the signal is compressed (companded) logarithmically at the sender before conversion and expanded at the receiver. Companding gives weak signals more resolution.</p>
<h3 id="c4-encoding">3 · Encoding and bit rate</h3>
<p>Each quantized sample becomes an n<sub>b</sub>-bit code word (e.g. 2 → 010, 5 → 101), with <b>n<sub>b</sub> = log₂ L</b>.</p>
<div class="fgrid">
  <div class="formula"><code class="f">Bit rate = f<sub>s</sub> × n<sub>b</sub></code><span class="where">sampling rate × bits per sample</span></div>
  <div class="formula"><code class="f">B<sub>min</sub> = n<sub>b</sub> × B<sub>analog</sub></code><span class="where">Minimum bandwidth of the digitised low-pass signal (NRZ or bipolar, c = ½). The price we pay for digitisation.</span></div>
</div>
<div class="example"><p class="ex-q">Digitise the human voice (0–4000 Hz) with 8 bits per sample. Bit rate?</p><ol class="steps"><li>Sampling rate = 2 × 4000 = 8000 samples/s</li><li>Bit rate = 8000 × 8</li></ol><p class="ex-a">64,000 bps = 64 kbps (one DS-0 telephone channel)</p></div>
<div class="example"><p class="ex-q">A low-pass analog signal of 4 kHz is digitised with 8 bits per sample. Minimum channel bandwidth?</p><ol class="steps"><li>Sent as analog it needs 4 kHz.</li><li>Digitised: B<sub>min</sub> = 8 × 4 kHz</li></ol><p class="ex-a">32 kHz: eight times the analog bandwidth.</p></div>
<h3 id="c4-decoder">Recovering the original signal: the PCM decoder</h3>
<p>The decoder turns each code word into a pulse that <b>holds</b> its amplitude until the next pulse, building a staircase signal. A <b>low-pass filter</b> with the same cutoff frequency as the original signal smooths the staircase into an analog signal. If the signal was sampled at or above the Nyquist rate and there are enough quantization levels, the original is recreated; amplification restores its maximum and minimum values. The higher L, the less distorted the recovered signal.</p>
<div class="note exam"><b class="tag">IA-1 Q5a · 6 marks</b><p><b>Why does a PCM encoder need quantization? Explain with an example.</b> Draw the encoder (analog signal → sampling → quantizing → encoding → digital data) for 2 marks, then explain the three steps for 4 marks. The key point: sampling produces PAM pulses with <b>infinitely many, non-integral amplitude values</b> that cannot be represented with a finite number of bits. Quantization divides the range into L zones of height Δ and replaces each sample with its zone's midpoint, so every sample can be sent as an n<sub>b</sub> = log₂ L bit code. Use the −20 V to +20 V, L = 8 example (Δ = 5 V, 3-bit codes) and mention the quantization error ≤ Δ/2 and SNR<sub>dB</sub> = 6.02 n<sub>b</sub> + 1.76.</p></div>
</section>

<section class="topic" id="c4-modes">
<h2>Transmission modes</h2>
<p>Binary data can cross a link in <b>parallel</b> mode (many bits per clock tick) or <b>serial</b> mode (one bit per clock tick). There is one way to send parallel data, but three kinds of serial transmission: <b>asynchronous</b>, <b>synchronous</b> and <b>isochronous</b>.</p>
<div class="duo">
  <div class="card"><h4>Parallel</h4><p>Bits are grouped into n-bit words and sent n at a time over <b>n wires</b>, one bit per wire (e.g. 8 wires bundled in a cable).</p><ul><li>Advantage: <b>speed</b>, up to n times faster than serial.</li><li>Disadvantage: <b>cost</b> of n lines, so it is limited to short distances.</li></ul></div>
  <div class="card"><h4>Serial</h4><p>One bit follows another on a <b>single channel</b>.</p><ul><li>Advantage: cost reduced by roughly a factor of n.</li><li>Since devices work in parallel internally, converters are needed: parallel-to-serial at the sender, serial-to-parallel at the receiver.</li></ul></div>
</div>
<figure class="fig">
<svg viewBox="0 0 660 150" role="img" aria-label="Asynchronous and synchronous serial transmission">
  <text x="8" y="22" style="font-size:12px;font-weight:700">Asynchronous: 1 start bit (0) · 8 data bits · 1 stop bit (1) · gaps of any length</text>
  <g transform="translate(8,34)">
    <rect x="0" y="0" width="22" height="26" style="fill:var(--app);fill-opacity:.3;stroke:var(--app)"/><text x="11" y="17" text-anchor="middle" class="mono" style="font-size:11px">0</text>
    <rect x="22" y="0" width="132" height="26" style="fill:var(--net);fill-opacity:.15;stroke:var(--net)"/><text x="88" y="17" text-anchor="middle" class="mono" style="font-size:11px">01101001</text>
    <rect x="154" y="0" width="22" height="26" style="fill:var(--dll);fill-opacity:.3;stroke:var(--dll)"/><text x="165" y="17" text-anchor="middle" class="mono" style="font-size:11px">1</text>
    <text x="214" y="17" text-anchor="middle" style="font-size:11px">gap</text>
    <rect x="250" y="0" width="22" height="26" style="fill:var(--app);fill-opacity:.3;stroke:var(--app)"/><text x="261" y="17" text-anchor="middle" class="mono" style="font-size:11px">0</text>
    <rect x="272" y="0" width="132" height="26" style="fill:var(--net);fill-opacity:.15;stroke:var(--net)"/><text x="338" y="17" text-anchor="middle" class="mono" style="font-size:11px">11100100</text>
    <rect x="404" y="0" width="22" height="26" style="fill:var(--dll);fill-opacity:.3;stroke:var(--dll)"/><text x="415" y="17" text-anchor="middle" class="mono" style="font-size:11px">1</text>
    <text x="500" y="17" text-anchor="middle" style="font-size:11px">gap …</text>
  </g>
  <text x="8" y="94" style="font-size:12px;font-weight:700">Synchronous: bytes back to back in a frame, no start/stop bits or gaps</text>
  <g transform="translate(8,104)">
    <rect x="0" y="0" width="560" height="26" style="fill:var(--net);fill-opacity:.12;stroke:var(--net)"/>
    <text x="280" y="17" text-anchor="middle" class="mono" style="font-size:11px">10101100 01110011 11001010 00011101 10100111 01010010 …</text>
  </g>
</svg>
</figure>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Asynchronous</th><th>Synchronous</th><th>Isochronous</th></tr></thead>
<tbody>
<tr><th>Unit</th><td>One byte (usually 8 bits) at a time</td><td>Long frames of many bytes</td><td>A continuous, fixed-rate stream</td></tr>
<tr><th>Extra bits</th><td>1 start bit (0) and 1 or more stop bits (1) per byte: at least 10 bits per byte</td><td>None; idle periods filled with a special idle pattern</td><td>—</td></tr>
<tr><th>Gaps</th><td>Variable gaps between bytes (idle line)</td><td>No gaps between bytes; uneven gaps between frames possible</td><td>No uneven gaps at all</td></tr>
<tr><th>Timing</th><td>Unimportant at the byte level; the receiver starts a timer on each start bit</td><td>Very important: the receiver must count bits accurately; byte synchronisation is done in the data link layer</td><td>The entire stream must be synchronised</td></tr>
<tr><th>Pros and cons</th><td>Slower, but cheap and effective</td><td>Faster: fewer bits to move</td><td>Guarantees data arrives at a fixed rate</td></tr>
<tr><th>Typical use</th><td>Keyboard to computer (slow, unpredictable typing)</td><td>High-speed computer-to-computer transfer</td><td>Real-time audio and video, e.g. TV at 30 images per second</td></tr>
</tbody></table></div>
<div class="note remember"><b class="tag">Remember</b><p>"Asynchronous" means asynchronous <b>at the byte level</b>; the bits within a byte are still synchronised, since their durations are the same.</p></div>
</section>

<section class="topic" id="c4-d2a">
<h2>Digital-to-analog conversion</h2>
<p>A sine wave is defined by amplitude, frequency and phase. Varying any one of them while modulating a <b>carrier</b> gives a different signal, so there are three basic mechanisms: <b>amplitude shift keying (ASK)</b>, <b>frequency shift keying (FSK)</b> and <b>phase shift keying (PSK)</b>. A fourth and better mechanism, <b>quadrature amplitude modulation (QAM)</b>, changes both amplitude and phase; it is the dominant method today.</p>
<figure class="lab" data-widget="modulation" data-bits="1011001010"><figcaption><span class="ttl">Modulation lab with constellation diagrams</span><span class="cap">Pick a scheme to see the waveform, its constellation and its bandwidth for your bit rate.</span></figcaption></figure>
<h3 id="c4-ask">Amplitude shift keying (ASK)</h3>
<p>The amplitude of the carrier is varied to create signal elements; frequency and phase stay constant. ASK is normally implemented with two levels: <b>binary ASK (BASK)</b>, also called <b>on-off keying (OOK)</b>: the peak amplitude of one level is 0 and the other equals the carrier's amplitude.</p>
<ul>
  <li><b>Bandwidth</b>: modulation produces a nonperiodic composite signal whose bandwidth is proportional to the baud rate: <b>B = (1 + d) × S</b>, where d (0 to 1) depends on the modulation and filtering. So B is between S and 2S, centred on the carrier frequency f<sub>c</sub>; on a bandpass channel we choose f<sub>c</sub> to sit in the middle.</li>
  <li><b>Implementation</b>: multiply a unipolar NRZ signal (1 V / 0 V) by the carrier from an oscillator: amplitude 1 keeps the carrier, 0 gives zero.</li>
</ul>
<div class="example"><p class="ex-q">An available bandwidth of 100 kHz spans 200 to 300 kHz. Carrier frequency and bit rate for ASK with d = 1?</p><ol class="steps"><li>The middle of the band: f<sub>c</sub> = 250 kHz</li><li>B = (1 + d) × S = 2 × N × (1/r) = 2N (r = 1)</li><li>100 kHz = 2N</li></ol><p class="ex-a">f<sub>c</sub> = 250 kHz, N = 50 kbps</p></div>
<h3 id="c4-fsk">Frequency shift keying (FSK)</h3>
<p>The frequency of the carrier is varied; it is constant during one signal element and changes for the next if the data element changes. Peak amplitude and phase stay constant. In <b>binary FSK (BFSK)</b> there are two carrier frequencies: f<sub>1</sub> for 0 and f<sub>2</sub> for 1, each Δf from the midpoint, so they are <b>2Δf</b> apart. (Real carriers are very high and close together.)</p>
<div class="formula"><code class="f">B = (1 + d) × S + 2Δf</code><span class="where">BFSK can be seen as two ASK signals, each with its own carrier.</span></div>
<div class="example"><p class="ex-q">The same 200–300 kHz band is used with FSK, d = 1. Choose the carriers and the bit rate.</p><ol class="steps"><li>Midpoint 250 kHz; choose 2Δf = 50 kHz → f<sub>1</sub> = 225 kHz, f<sub>2</sub> = 275 kHz</li><li>100 = (1 + 1) × S + 50 → 2S = 50 kHz → S = 25 kbaud</li><li>N = S (r = 1)</li></ol><p class="ex-a">N = 25 kbps</p></div>
<ul>
  <li><b>Noncoherent BFSK</b>: the phase may jump when one element ends and the next begins; built as two ASK modulations with two carriers.</li>
  <li><b>Coherent BFSK</b>: the phase continues through the boundary; built with one <b>voltage-controlled oscillator (VCO)</b> driven by unipolar NRZ: zero input keeps the regular frequency, positive input raises it.</li>
  <li><b>Multilevel FSK (MFSK)</b>: more than two frequencies, e.g. four frequencies for 2 bits at a time, eight for 3 bits. Frequencies must be 2Δf apart, and the minimum 2Δf is S, so with d = 0 the bandwidth is <b>B = L × S</b>.</li>
</ul>
<details class="solution"><summary>Practice: send 3 bits at a time at 3 Mbps with MFSK; carrier 10 MHz. Levels, baud rate and bandwidth?</summary><div class="body"><p>L = 2³ = <b>8</b> frequencies. S = 3 Mbps / 3 = <b>1 Mbaud</b>, so the frequencies are 1 MHz apart (2Δf = 1 MHz). B = 8 × 1 MHz = <b>8 MHz</b>.</p></div></details>
<h3 id="c4-psk">Phase shift keying (PSK)</h3>
<p>The phase of the carrier is varied to represent two or more signal elements; peak amplitude and frequency stay constant.</p>
<ul>
  <li><b>Binary PSK (BPSK)</b>: two signal elements, one with phase 0° and the other 180°. It is as simple as BASK with one big advantage: <b>less susceptible to noise</b>, because noise changes amplitude more easily than phase. It is superior to FSK because it needs no second carrier, but needs more sophisticated hardware to tell phases apart.</li>
  <li>BPSK bandwidth equals BASK's and is less than BFSK's: no bandwidth is spent separating two carriers.</li>
  <li><b>Implementation</b>: the 180° element is the complement of the 0° element, so multiply a <b>polar</b> NRZ signal by the carrier: 1 (positive voltage) → phase 0°, 0 (negative) → 180°.</li>
</ul>
<h3 id="c4-qpsk">Quadrature PSK (QPSK)</h3>
<p>QPSK sends <b>2 bits per signal element</b>, halving the baud rate and the bandwidth. It uses two BPSK modulations, one <b>in-phase</b> and one <b>quadrature</b> (out of phase). A serial-to-parallel converter sends one bit to each modulator, so each bit there lasts 2T. The sum of the two outputs is a sine wave with one of four phases: <b>45°, −45°, 135° and −135°</b>. L = 4, r = 2.</p>
<div class="example"><p class="ex-q">Find the bandwidth for a 12 Mbps QPSK signal with d = 0.</p><ol class="steps"><li>r = 2, so S = N × (1/r) = 6 Mbaud</li><li>B = (1 + d) × S = S</li></ol><p class="ex-a">B = 6 MHz</p></div>
<h3 id="c4-constellation">Constellation diagrams</h3>
<p>A <b>constellation diagram</b> shows the amplitude and phase of each signal element as a dot, with its bit pattern written beside it. The horizontal X axis is the in-phase carrier; the vertical Y axis is the quadrature carrier. For each point:</p>
<ul><li>its projection on X is the peak amplitude of the in-phase component; its projection on Y is the peak amplitude of the quadrature component;</li><li>the length of the line from the origin is the peak amplitude of the signal element; the angle with the X axis is its phase.</li></ul>
<div class="duo">
  <div class="card"><h4>ASK (OOK)</h4><p>Only the in-phase carrier: two points on the X axis, at 0 (binary 0) and 1 (binary 1).</p></div>
  <div class="card"><h4>BPSK</h4><p>Only the in-phase carrier with polar NRZ: points at −1 and +1, i.e. amplitude 1 V at phase 180° and at 0°.</p></div>
  <div class="card"><h4>QPSK</h4><p>Two carriers. 11 is made of two 1 V components, so its amplitude is √2 at 45°. All four points have amplitude √2 at 45°, 135°, −135° and −45°.</p></div>
</div>
<h3 id="c4-qam">Quadrature amplitude modulation (QAM)</h3>
<p>PSK is limited by how well equipment can distinguish small phase differences. QAM combines ASK and PSK: <b>two carriers, in-phase and quadrature, each with several amplitude levels</b>. Variations are numerous: the simplest <b>4-QAM</b> uses unipolar NRZ on each carrier (like OOK); 4-QAM with polar NRZ is exactly QPSK; another 4-QAM uses two positive levels; <b>16-QAM</b> uses eight levels (four positive, four negative). The minimum bandwidth for QAM is the same as for ASK and PSK, and QAM has the same advantages as PSK over ASK.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>ASK</th><th>FSK</th><th>PSK</th><th>QAM</th></tr></thead>
<tbody>
<tr><th>What varies</th><td>Amplitude</td><td>Frequency</td><td>Phase</td><td>Amplitude and phase</td></tr>
<tr><th>Bandwidth</th><td>(1 + d)S</td><td>(1 + d)S + 2Δf</td><td>(1 + d)S</td><td>(1 + d)S</td></tr>
<tr><th>Noise immunity</th><td>Poor (noise hits amplitude)</td><td>Better</td><td>Good</td><td>Good</td></tr>
<tr><th>Notes</th><td>Simple; OOK</td><td>Needs two carriers</td><td>Needs phase-sensitive hardware</td><td>Most bits per baud; dominant method</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c4-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>Encode a bit stream with NRZ-L, NRZ-I, RZ, Manchester and differential Manchester. · 6 marks · IA-1 Q2a</summary><div class="body"><p>Draw each waveform with bit boundaries; state each rule in one line; state assumptions. Add the characteristics table (r, baud, DC, sync) if asked to compare.</p></div></details>
<details class="answer"><summary>Explain data element, signal element, data rate and signal rate. Solve: bit rate 8000 bps, baud 1000. · 4 marks · IA-1 Q3b</summary><div class="body"><p>Definitions and S = c × N × (1/r). Then r = N/S = 8, L = 2⁸ = 256.</p></div></details>
<details class="answer"><summary>What are the characteristics of a good line coding scheme? · 6 marks</summary><div class="body"><p>Baseline wandering, DC components, self-synchronisation (with the 10110001 example), built-in error detection, immunity to noise, low complexity: one or two lines each.</p></div></details>
<details class="answer"><summary>Explain PCM with a neat diagram; why is quantization needed? · 6–8 marks · IA-1 Q5a</summary><div class="body"><p>Encoder diagram; sampling (three methods, Nyquist theorem, 8000 samples/s for voice); quantization (four steps, −20 to +20 V example, error, SNR formula, nonuniform/companding); encoding (n<sub>b</sub> = log₂ L, bit rate = f<sub>s</sub> × n<sub>b</sub>); decoder (hold + low-pass filter).</p></div></details>
<details class="answer"><summary>Compare parallel and serial transmission; explain asynchronous, synchronous and isochronous modes. · 6 marks</summary><div class="body"><p>Two cards for parallel vs serial, then the three-column table above with the start/stop bit figure.</p></div></details>
<details class="answer"><summary>Explain ASK, FSK and PSK with waveforms and bandwidth. · 8 marks</summary><div class="body"><p>For each: what varies, a waveform for 1011 below the bits, the bandwidth formula and one worked example (ASK 200–300 kHz; FSK with 2Δf; QPSK 12 Mbps). Finish with constellation diagrams of OOK, BPSK and QPSK and a line on QAM.</p></div></details>
</section>
`,
  quiz: [
    { q: 'Which of the three digital-to-digital techniques is always needed?', o: ['Block coding', 'Scrambling', 'Line coding', 'None'], a: 2, why: 'Line coding is always needed; block coding and scrambling may or may not be.' },
    { q: 'A signal has a bit rate of 8000 bps and a baud rate of 1000 baud. How many signal levels are needed?', o: ['8', '16', '128', '256'], a: 3, why: 'r = 8000/1000 = 8 bits per element, L = 2⁸ = 256.' },
    { q: 'The required bandwidth of a digital signal depends on', o: ['The bit rate', 'The baud rate', 'The voltage', 'The number of bits per frame'], a: 1, why: 'More changes in the signal (baud) inject more frequencies.' },
    { q: 'In NRZ-I, a binary 1 is represented by', o: ['A positive voltage', 'A negative voltage', 'A change (inversion) of level', 'No change of level'], a: 2, why: 'NRZ-I inverts on a 1 and stays the same on a 0.' },
    { q: 'Which scheme has a transition at the middle of every bit and decides the bit value at the beginning?', o: ['Manchester', 'Differential Manchester', 'RZ', 'AMI'], a: 1, why: 'Differential Manchester: transition at start means 0, no transition means 1.' },
    { q: 'In Manchester coding (Forouzan/IEEE convention), bit 0 is', o: ['Low-to-high', 'High-to-low', 'Zero voltage', 'Alternating'], a: 1, why: '0 = high-to-low, 1 = low-to-high.' },
    { q: 'In bipolar AMI, a binary 0 is encoded as', o: ['+V', '−V', 'Zero voltage', 'Alternating ±V'], a: 2, why: 'AMI alternates the 1s; 0s sit at zero.' },
    { q: 'The minimum bandwidth of Manchester encoding is', o: ['Half that of NRZ', 'Same as NRZ', 'Twice that of NRZ', 'Four times that of NRZ'], a: 2, why: 'Two signal changes per bit (r = ½) double the baud rate.' },
    { q: 'By the Nyquist theorem, a voice signal with highest frequency 4000 Hz must be sampled at least at', o: ['4000 samples/s', '8000 samples/s', '2000 samples/s', '16000 samples/s'], a: 1, why: 'fs ≥ 2 fmax = 8000 samples per second.' },
    { q: 'PCM with 8 quantization levels has an SNRdB of about', o: ['8 dB', '19.82 dB', '24 dB', '49.9 dB'], a: 1, why: 'nb = 3; 6.02 × 3 + 1.76 = 19.82 dB.' },
    { q: 'Human voice digitised at 8 bits per sample gives a bit rate of', o: ['8 kbps', '32 kbps', '64 kbps', '128 kbps'], a: 2, why: '8000 samples/s × 8 bits = 64 kbps.' },
    { q: 'In asynchronous transmission, each byte is framed by', o: ['A flag at each end', 'A start bit (0) and one or more stop bits (1)', 'Sync characters', 'A header and trailer'], a: 1, why: 'The start bit alerts the receiver; stop bits mark the end of the byte.' },
    { q: 'Which modulation is least affected by noise?', o: ['ASK', 'PSK', 'OOK', 'Unipolar NRZ'], a: 1, why: 'Noise changes amplitude more easily than phase.' },
    { q: 'A 12 Mbps QPSK signal with d = 0 needs a bandwidth of', o: ['12 MHz', '24 MHz', '6 MHz', '3 MHz'], a: 2, why: 'r = 2 → S = 6 Mbaud → B = (1 + 0) × S = 6 MHz.' },
    { q: 'In a constellation diagram, the angle a point makes with the X axis gives the', o: ['Amplitude', 'Frequency', 'Phase', 'Bit rate'], a: 2, why: 'The vector length is the amplitude; the angle is the phase.' }
  ]
});
