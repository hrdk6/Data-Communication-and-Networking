DCN.register({
  id: 'c3', num: 3, part: 'A', layer: 'phy', unit: 'Unit 1',
  title: 'Data and Signals',
  short: 'Data & signals',
  summary: 'How data becomes electromagnetic signals: sine waves and their parameters, composite signals and bandwidth, digital signals and how they travel, what damages signals on the way, the theoretical limits on data rate, and the numbers used to judge network performance.',
  hot: ['IA-1 Q2b', 'IA-1 Q4b'],
  sources: ['U-1-ch-3.pdf', '3.ppt', '4.ppt', '5.ppt', 'CN_Complete_Notes'],
  keywords: 'analog digital periodic nonperiodic sine amplitude frequency period phase wavelength time domain frequency domain composite fourier bandwidth harmonics bit rate bit length baseband broadband low-pass bandpass attenuation decibel dBm distortion noise thermal induced crosstalk impulse SNR nyquist shannon capacity throughput latency propagation transmission queuing bandwidth-delay product RTT jitter',
  html: `
<section class="topic" id="c3-analog-digital">
<h2>Analog and digital</h2>
<p>To be transmitted, data must be transformed into <b>electromagnetic signals</b>. Both data and signals can be analog or digital.</p>
<div class="duo">
  <div class="card"><h4>Analog</h4><p><b>Analog data</b> is continuous and takes continuous values, like the human voice or an analog clock whose hands pass through every instant between 10:10 and 10:11. An <b>analog signal</b> can have an infinite number of values in a range.</p></div>
  <div class="card"><h4>Digital</h4><p><b>Digital data</b> has discrete states and takes discrete values, like data in computer memory or a digital clock that jumps from 10:10 to 10:11. A <b>digital signal</b> can have only a limited number of values (often just two).</p></div>
</div>
<div class="duo">
  <div class="card"><h4>Periodic signal</h4><p>Completes a pattern within a measurable time frame, the <b>period</b>, and repeats it over identical periods. One full pattern is a <b>cycle</b>.</p></div>
  <div class="card"><h4>Nonperiodic signal</h4><p>Changes without any pattern or cycle that repeats over time.</p></div>
</div>
<div class="note remember"><b class="tag">Remember</b><p>In data communication we commonly use <b>periodic analog signals</b> (they need less bandwidth) and <b>nonperiodic digital signals</b> (they can represent variation in data).</p></div>
</section>

<section class="topic" id="c3-sine">
<h2>Periodic analog signals: the sine wave</h2>
<p>Periodic analog signals are <b>simple</b> (a sine wave, which cannot be decomposed further) or <b>composite</b> (made of several sine waves). A sine wave is described by three parameters: <b>peak amplitude</b>, <b>frequency</b> and <b>phase</b>.</p>
<figure class="lab lab-3d" data-scene="signal" data-mode="sine"><figcaption><span class="ttl">A sine wave is the shadow of a rotating phasor</span><span class="cap">Change amplitude, frequency and phase and watch the wave on the back wall.</span></figcaption></figure>
<div class="duo">
  <div class="card"><h4>Peak amplitude</h4><p>The absolute value of the highest intensity, proportional to the energy the signal carries. Measured in volts for electric signals.</p></div>
  <div class="card"><h4>Period and frequency</h4><p><b>Period T</b>: time in seconds to complete one cycle. <b>Frequency f</b>: number of periods in one second, in hertz (Hz). They are inverses: <b>f = 1/T</b> and <b>T = 1/f</b>.</p></div>
  <div class="card"><h4>Phase</h4><p>The position of the waveform relative to time 0, in degrees or radians (360° = 2π rad). A phase of 0° starts at zero going up; 90° starts at the peak; 180° starts at zero going down.</p></div>
</div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Unit of period</th><th>Equivalent</th><th>Unit of frequency</th><th>Equivalent</th></tr></thead>
<tbody>
<tr><td>second (s)</td><td>1 s</td><td>hertz (Hz)</td><td>1 Hz</td></tr>
<tr><td>millisecond (ms)</td><td>10⁻³ s</td><td>kilohertz (kHz)</td><td>10³ Hz</td></tr>
<tr><td>microsecond (µs)</td><td>10⁻⁶ s</td><td>megahertz (MHz)</td><td>10⁶ Hz</td></tr>
<tr><td>nanosecond (ns)</td><td>10⁻⁹ s</td><td>gigahertz (GHz)</td><td>10⁹ Hz</td></tr>
<tr><td>picosecond (ps)</td><td>10⁻¹² s</td><td>terahertz (THz)</td><td>10¹² Hz</td></tr>
</tbody></table></div>
<ul>
  <li><b>Frequency is the rate of change with respect to time.</b> Change in a short span means high frequency; change over a long span means low frequency.</li>
  <li>If a signal does not change at all, its frequency is <b>zero</b>. If it changes instantaneously, its frequency is <b>infinite</b>.</li>
</ul>
<div class="example"><p class="ex-q">The power we use at home has a frequency of 60 Hz. Find the period.</p><ol class="steps"><li>T = 1/f = 1/60 s</li><li>= 0.0166 s = 16.6 ms</li></ol><p class="ex-a">T = 16.6 ms</p></div>
<div class="example"><p class="ex-q">A sine wave is offset 1/6 cycle with respect to time 0. What is its phase?</p><ol class="steps"><li>One cycle = 360°</li><li>1/6 × 360° = 60° = 60 × 2π/360 rad</li></ol><p class="ex-a">Phase = 60° = π/3 rad ≈ 1.046 rad</p></div>
<h3 id="c3-wavelength">Wavelength</h3>
<p><b>Wavelength</b> binds the period or frequency of a sine wave to the <b>propagation speed</b> of the medium: it is the distance a simple signal travels in one period.</p>
<div class="formula"><code class="f">λ = c / f = c × T</code><span class="where">λ = wavelength (m) · c = propagation speed (3 × 10⁸ m/s in vacuum) · f = frequency (Hz) · T = period (s). Optical wavelengths are given in micrometres (microns).</span></div>
<div class="example"><p class="ex-q">Find the wavelength of red light (f = 4 × 10¹⁴ Hz) in air.</p><ol class="steps"><li>λ = c/f = (3 × 10⁸) / (4 × 10¹⁴)</li><li>= 0.75 × 10⁻⁶ m</li></ol><p class="ex-a">λ = 0.75 µm</p></div>
<h3 id="c3-domains">Time domain and frequency domain</h3>
<p>A <b>time-domain plot</b> shows amplitude against time. A <b>frequency-domain plot</b> shows peak amplitude against frequency. <b>A complete sine wave in the time domain is one single spike in the frequency domain</b>: the spike's position is the frequency and its height is the peak amplitude. The frequency domain is much more compact for signals made of many sine waves.</p>
</section>

<section class="topic" id="c3-composite">
<h2>Composite signals and bandwidth</h2>
<p>A single-frequency sine wave carries no information, so data communication uses <b>composite signals</b> made of many simple sine waves. According to <b>Fourier analysis</b>, any composite signal is a combination of simple sine waves with different frequencies, amplitudes and phases.</p>
<ul>
  <li>A <b>periodic</b> composite signal decomposes into sine waves with <b>discrete</b> frequencies (a fundamental f and its harmonics 3f, 5f…).</li>
  <li>A <b>nonperiodic</b> composite signal decomposes into a <b>continuous</b> range of frequencies.</li>
</ul>
<figure class="lab lab-3d" data-scene="signal" data-mode="fourier"><figcaption><span class="ttl">Build a square wave from sine waves</span><span class="cap">Add odd harmonics one by one. Look from the front for the time domain and from the side for the frequency domain.</span></figcaption></figure>
<div class="formula"><code class="f">Bandwidth B = f<sub>highest</sub> − f<sub>lowest</sub></code><span class="where">The range of frequencies contained in a composite signal.</span></div>
<div class="example"><p class="ex-q">A periodic signal is decomposed into five sine waves of 100, 300, 500, 700 and 900 Hz. What is its bandwidth? Draw the spectrum if each has a maximum amplitude of 10 V.</p><ol class="steps"><li>B = f<sub>h</sub> − f<sub>l</sub> = 900 − 100</li><li>Spectrum: five vertical bars of height 10 V at 100, 300, 500, 700 and 900 Hz on the frequency axis.</li></ol><p class="ex-a">B = 800 Hz</p></div>
<details class="solution"><summary>Practice: a periodic signal has B = 20 Hz and highest frequency 60 Hz. What is the lowest frequency?</summary><div class="body"><p>B = f<sub>h</sub> − f<sub>l</sub> → 20 = 60 − f<sub>l</sub> → <b>f<sub>l</sub> = 40 Hz</b>. If it contains all integer frequencies of the same amplitude, the spectrum has bars at 40, 41, … 60 Hz.</p></div></details>
<details class="solution"><summary>Practice: a nonperiodic composite signal has B = 200 kHz with its middle at 140 kHz. Find its range.</summary><div class="body"><p>Half the bandwidth (100 kHz) on each side of 140 kHz: from <b>40 kHz to 240 kHz</b>. Its spectrum is continuous.</p></div></details>
</section>

<section class="topic" id="c3-digital">
<h2>Digital signals</h2>
<p>A digital signal can represent a 1 as a positive voltage and a 0 as zero voltage. It may have more than two levels, sending more than one bit per level.</p>
<div class="formula"><code class="f">bits per level = log₂ L</code><span class="where">L = number of signal levels</span></div>
<div class="example"><p class="ex-q">A digital signal has eight levels. How many bits are needed per level?</p><ol class="steps"><li>log₂ 8 = 3</li></ol><p class="ex-a">Each signal level carries 3 bits. (With 9 levels, log₂ 9 = 3.17, so 4 bits are needed per level.)</p></div>
<ul>
  <li><b>Bit rate</b> (used instead of frequency): the number of bits sent in 1 s, in bits per second (bps).</li>
  <li><b>Bit length</b>: the distance one bit occupies on the medium. <b>Bit length = propagation speed × bit duration</b>.</li>
</ul>
<details class="solution"><summary>Practice: text is downloaded at 100 pages per minute; a page averages 24 lines of 80 characters, 8 bits each. Required bit rate?</summary><div class="body"><p>100 × 24 × 80 × 8 bits per 60 s = <b>25,600 bps = 25.6 kbps</b>.</p></div></details>
<h3 id="c3-composite-digital">A digital signal is a composite analog signal</h3>
<p>By Fourier analysis, a digital signal is a composite analog signal with an <b>infinite bandwidth</b>. A periodic digital signal has discrete frequencies; a nonperiodic one has a continuous spectrum. Its frequency spectrum starts at 0 and goes to infinity.</p>
<h3 id="c3-baseband">Baseband and broadband transmission</h3>
<div class="duo">
  <div class="card"><h4>Baseband</h4><p>Sending a digital signal over a channel <b>without changing it to an analog signal</b>. It needs a <b>low-pass channel</b>: one whose bandwidth starts at 0.</p><ul><li><b>Wide (dedicated) channel</b>: the digital shape is preserved only if the channel's bandwidth is infinite or very wide, e.g. two stations on a dedicated cable.</li><li><b>Limited channel</b>: we approximate the digital signal with its first harmonics. In baseband, <b>the required bandwidth is proportional to the bit rate</b>: sending bits faster needs more bandwidth.</li></ul></div>
  <div class="card"><h4>Broadband (modulation)</h4><p>Changing the digital signal to an <b>analog signal</b> for transmission. Modulation lets us use a <b>bandpass channel</b>, whose bandwidth does not start from zero; bandpass channels are more available than low-pass ones.</p><p>If the channel is bandpass, the digital signal cannot go directly; it must be converted first, as a modem does on a telephone line.</p></div>
</div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Bit rate</th><th>Harmonic 1 (B = N/2)</th><th>Harmonics 1, 3 (B = 3N/2)</th><th>Harmonics 1, 3, 5 (B = 5N/2)</th></tr></thead>
<tbody>
<tr><td class="num">1 kbps</td><td class="num">500 Hz</td><td class="num">1.5 kHz</td><td class="num">2.5 kHz</td></tr>
<tr><td class="num">10 kbps</td><td class="num">5 kHz</td><td class="num">15 kHz</td><td class="num">25 kHz</td></tr>
<tr><td class="num">100 kbps</td><td class="num">50 kHz</td><td class="num">150 kHz</td><td class="num">250 kHz</td></tr>
</tbody></table></div>
<details class="solution"><summary>Practice: minimum low-pass bandwidth to send 1 Mbps in baseband? And the maximum bit rate of a 100 kHz low-pass channel?</summary><div class="body"><p>Minimum B = N/2 = <b>500 kHz</b> (1.5 MHz or 2.5 MHz for a better shape). A 100 kHz channel: N = 2B = <b>200 kbps</b> with the first-harmonic approximation.</p></div></details>
</section>

<section class="topic" id="c3-impairment">
<h2>Transmission impairment</h2>
<p>Transmission media are not perfect, so the signal at the end of the medium is not the same as the signal at the beginning: <b>what is sent is not what is received</b>. The three causes are <b>attenuation</b>, <b>distortion</b> and <b>noise</b>.</p>
<h3 id="c3-attenuation">Attenuation</h3>
<p>Attenuation is a <b>loss of energy</b>. As a signal travels through a medium it loses energy overcoming the medium's resistance (a wire carrying electric signals warms up). <b>Amplifiers</b> compensate by amplifying the signal. Loss or gain is measured in <b>decibels</b>: negative dB means the signal is attenuated, positive means it is amplified.</p>
<div class="fgrid">
  <div class="formula"><code class="f">dB = 10 log₁₀ (P₂ / P₁)</code><span class="where">P₁ = power at point 1 (input) · P₂ = power at point 2 (output)</span></div>
  <div class="formula"><code class="f">dBm = 10 log₁₀ Pm</code><span class="where">Pm = power in milliwatts</span></div>
</div>
<div class="example"><p class="ex-q">A signal's power is reduced to one half by a medium. Find the attenuation.</p><ol class="steps"><li>P₂ = 0.5 P₁</li><li>dB = 10 log₁₀(0.5 P₁ / P₁) = 10 log₁₀ 0.5 = 10 × (−0.3010)</li></ol><p class="ex-a">−3.01 dB ≈ −3 dB: a loss of 3 dB means losing half the power.</p></div>
<div class="example"><p class="ex-q">An amplifier increases a signal's power 20 times. Find the gain.</p><ol class="steps"><li>dB = 10 log₁₀(20 P₁ / P₁) = 10 log₁₀ 20 = 10 × 1.301</li></ol><p class="ex-a">13.01 dB ≈ 13 dB gain</p></div>
<div class="example"><p class="ex-q">A signal is attenuated by 3 dB from point 1 to 2, amplified by 7 dB from 2 to 3, and attenuated by 3 dB from 3 to 4. Resultant?</p><ol class="steps"><li>Decibels of cascaded stages add.</li><li>dB = −3 + 7 − 3</li></ol><p class="ex-a">+1 dB: the signal is slightly amplified overall.</p></div>
<div class="example"><p class="ex-q">Calculate the power of a signal whose dBm is −30.</p><ol class="steps"><li>dBm = 10 log₁₀ Pm → −30 = 10 log₁₀ Pm</li><li>log₁₀ Pm = −3 → Pm = 10⁻³ mW</li></ol><p class="ex-a">Pm = 10⁻³ mW = 1 µW</p></div>
<h3 id="c3-distortion">Distortion</h3>
<p>Distortion means the signal <b>changes its form or shape</b>. It occurs in a <b>composite signal</b> made of different frequencies: each frequency component has its own propagation speed through the medium, so the components arrive with different delays. At the receiver they have different phases than at the sender, so their sum has a different shape. This is also called <b>delay distortion</b>.</p>
<h3 id="c3-noise">Noise</h3>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Type</th><th>Cause</th></tr></thead>
<tbody>
<tr><th>Thermal noise</th><td>Random motion of electrons in a wire creates an extra signal not sent by the transmitter.</td></tr>
<tr><th>Induced noise</th><td>Sources such as motors and appliances: they act as a sending antenna and the medium as a receiving antenna.</td></tr>
<tr><th>Crosstalk</th><td>The effect of one wire on another: one wire acts as a sending antenna, the other as the receiving antenna.</td></tr>
<tr><th>Impulse noise</th><td>A spike: a high-energy signal in a very short time, from power lines, lightning and so on.</td></tr>
</tbody></table></div>
<div class="fgrid">
  <div class="formula"><code class="f">SNR = average signal power / average noise power</code><span class="where">A ratio of two powers; a high SNR means the signal is less corrupted by noise.</span></div>
  <div class="formula"><code class="f">SNR<sub>dB</sub> = 10 log₁₀ SNR</code><span class="where">SNR is usually quoted in decibels.</span></div>
</div>
<div class="example"><p class="ex-q">Signal power is 10 mW and noise power is 1 µW. Find SNR and SNR<sub>dB</sub>.</p><ol class="steps"><li>SNR = 10 mW / 1 µW = 10⁻² W / 10⁻⁶ W = 10⁴ = 10,000</li><li>SNR<sub>dB</sub> = 10 log₁₀ 10,000 = 10 × 4</li></ol><p class="ex-a">SNR = 10,000; SNR<sub>dB</sub> = 40 dB</p></div>
<p>For a <b>noiseless channel</b>, noise power is zero, so SNR = ∞ and SNR<sub>dB</sub> = ∞. This is an ideal we can never reach in real life.</p>
<figure class="lab" data-widget="db"><figcaption><span class="ttl">Decibel and SNR calculator</span><span class="cap">Every result shows the working in exam format.</span></figcaption></figure>
<div class="note exam"><b class="tag">IA-1 Q2b · 4 marks</b><p><b>A retail WAN between New York headquarters and remote warehouses: files get corrupted, video calls are choppy, download speeds vary.</b></p><ul><li><b>Attenuation</b>: over long WAN distances the signal loses energy; weak signals are misread as wrong bits, so files arrive corrupted and must be resent, which cuts speed. Fix: amplifiers or repeaters, better cable.</li><li><b>Noise</b>: thermal, induced, crosstalk and impulse noise add unwanted signal; a low SNR flips bits, causing corruption and retransmissions that make download speed vary.</li><li><b>Delay distortion</b>: the frequency components of the composite signal travel at different speeds and arrive out of phase; the received shape changes, adding bit errors and uneven delay (jitter), which makes video choppy.</li></ul></div>
</section>

<section class="topic" id="c3-limits">
<h2>Data rate limits: Nyquist and Shannon</h2>
<p>How fast we can send data over a channel depends on three factors: the <b>bandwidth available</b>, the <b>number of signal levels</b> we use, and the <b>quality of the channel</b> (its noise). Two formulas give the limits.</p>
<div class="fgrid">
  <div class="formula"><code class="f">BitRate = 2 × B × log₂ L</code><span class="where"><b>Nyquist, noiseless channel.</b> B = bandwidth (Hz) · L = number of signal levels · BitRate in bps.</span></div>
  <div class="formula"><code class="f">C = B × log₂(1 + SNR)</code><span class="where"><b>Shannon, noisy channel.</b> C = capacity (bps) · B = bandwidth (Hz) · SNR as a ratio, not in dB.</span></div>
</div>
<div class="note warn"><b class="tag">Heads-up</b><ul><li>Increasing L raises the Nyquist bit rate, but the receiver must tell more levels apart, so reliability drops. Doubling L adds only one bit per level.</li><li>Shannon's capacity does not depend on L; it is the upper limit for any coding. Always convert SNR<sub>dB</sub> to a ratio first: SNR = 10<sup>SNRdB/10</sup>.</li></ul></div>
<div class="example"><p class="ex-q">A noiseless channel of bandwidth 4000 Hz transmits a signal with two levels. Maximum bit rate?</p><ol class="steps"><li>BitRate = 2 × 4000 × log₂ 2 = 2 × 4000 × 1</li></ol><p class="ex-a">8000 bps. With four levels: 2 × 4000 × log₂ 4 = 16,000 bps.</p></div>
<div class="example"><p class="ex-q">We need to send 280 kbps over a noiseless channel of bandwidth 20 kHz. How many signal levels?</p><ol class="steps"><li>280,000 = 2 × 20,000 × log₂ L</li><li>log₂ L = 280 / 40 = 7</li><li>L = 2⁷</li></ol><p class="ex-a">L = 128 levels</p></div>
<div class="example"><p class="ex-q">An extremely noisy channel has SNR almost zero. Capacity?</p><ol class="steps"><li>C = B log₂(1 + 0) = B log₂ 1 = B × 0</li></ol><p class="ex-a">C = 0, whatever the bandwidth: no data can be sent.</p></div>
<div class="example"><p class="ex-q">Bandwidth 3000 Hz, SNR = 3162 (a telephone line). Highest bit rate?</p><ol class="steps"><li>C = 3000 × log₂(1 + 3162) = 3000 × log₂ 3163</li><li>= 3000 × 11.627</li></ol><p class="ex-a">C ≈ 34,881 bps ≈ 34.9 kbps</p></div>
<div class="example"><p class="ex-q">SNR<sub>dB</sub> = 36 and B = 2 MHz. Channel capacity?</p><ol class="steps"><li>SNR = 10<sup>36/10</sup> = 10<sup>3.6</sup> = 3981</li><li>C = 2 × 10⁶ × log₂(3982) = 2 × 10⁶ × 11.959</li></ol><p class="ex-a">C ≈ 23.92 Mbps ≈ 24 Mbps</p></div>
<div class="example"><p class="ex-q"><b>IA-1 Q4b.</b> A voice-grade telephone channel has a bandwidth of 3.4 kHz. (a) Find the capacity for SNR = 30 dB. (b) What SNR is needed to carry 4800 bps?</p><ol class="steps"><li>(a) SNR = 10<sup>30/10</sup> = 1000</li><li>C = 3400 × log₂(1001) = 3400 × 9.967 = 33,888 bps</li><li>(b) 4800 = 3400 × log₂(1 + SNR) → log₂(1 + SNR) = 1.4118</li><li>1 + SNR = 2<sup>1.4118</sup> = 2.661 → SNR = 1.661</li><li>SNR<sub>dB</sub> = 10 log₁₀ 1.661 = 2.2 dB</li></ol><p class="ex-a">(a) C ≈ 33.9 kbps · (b) SNR ≈ 1.66, i.e. about 2.2 dB</p></div>
<div class="example"><p class="ex-q">A channel has B = 1 MHz and SNR = 63. Choose a suitable bit rate and number of signal levels.</p><ol class="steps"><li>Shannon upper limit: C = 10⁶ × log₂(64) = 6 Mbps</li><li>For better performance choose something lower, say 4 Mbps</li><li>Nyquist: 4 × 10⁶ = 2 × 10⁶ × log₂ L → log₂ L = 2</li></ol><p class="ex-a">4 Mbps with L = 4 signal levels. Shannon gives the ceiling; Nyquist gives the number of levels.</p></div>
<figure class="lab" data-widget="capacity"><figcaption><span class="ttl">Nyquist and Shannon solver</span><span class="cap">Forward and reverse problems, with every step shown. Preloaded with IA-1 Q4b.</span></figcaption></figure>
</section>

<section class="topic" id="c3-performance">
<h2>Performance</h2>
<h3 id="c3-bandwidth">Bandwidth</h3>
<p>Bandwidth has two meanings. <b>Bandwidth in hertz</b> is the range of frequencies in a composite signal or that a channel can pass. <b>Bandwidth in bits per second</b> is the maximum number of bits per second a channel or link can transmit (e.g. Fast Ethernet: 100 Mbps). An increase in bandwidth in hertz means an increase in bandwidth in bits per second. The more bandwidth, the more data a link can send and receive.</p>
<h3 id="c3-throughput">Throughput</h3>
<p><b>Throughput</b> is how fast we can <i>actually</i> send data: the actual amount of data passing through, measured in bps. Bandwidth is the potential; throughput is the reality, and it is always less than or equal to the bandwidth.</p>
<div class="example"><p class="ex-q">A network with a bandwidth of 10 Mbps passes only 12,000 frames per minute, each carrying 10,000 bits on average. Throughput?</p><ol class="steps"><li>Throughput = (12,000 × 10,000) / 60</li></ol><p class="ex-a">2 Mbps: one-fifth of the bandwidth.</p></div>
<h3 id="c3-latency">Latency (delay)</h3>
<p>Latency is how long an entire message takes to arrive completely at the destination, from the time the first bit is sent out from the source.</p>
<div class="formula"><code class="f">Latency = propagation time + transmission time + queuing time + processing delay</code><span class="where">Propagation time = distance / propagation speed · Transmission time = message size / bandwidth · Queuing time = waiting in router queues (varies with load)</span></div>
<div class="example"><p class="ex-q">Distance 12,000 km, propagation speed in cable 2.4 × 10⁸ m/s. Propagation time?</p><ol class="steps"><li>(12,000 × 1000) / (2.4 × 10⁸)</li></ol><p class="ex-a">50 ms</p></div>
<details class="solution"><summary>Practice: a 2.5 KB e-mail and a 5 MB image over 12,000 km of cable (2.4 × 10⁸ m/s) at 1 Gbps and 1 Mbps respectively. Which delay dominates?</summary><div class="body"><p>E-mail: transmission = 2500 × 8 / 10⁹ = <b>0.020 ms</b>; propagation 50 ms dominates (short message, fast link). Image: transmission = 5,000,000 × 8 / 10⁶ = <b>40 s</b>; transmission dominates (large message). Try both in the lab below.</p></div></details>
<p><b>Speed</b> in your slides means how fast the information is received: the transfer rate (bit rate) of the circuit, in bps, kbps, Mbps or Gbps.</p>
<h3 id="c3-bdp">Bandwidth-delay product</h3>
<p>The <b>bandwidth-delay product</b> is the number of bits that can fill the link. Picture the link as a pipe: the cross-section is the bandwidth, the length is the delay, and the volume is bandwidth × delay. With bandwidth 1 bps and delay 5 s, 5 bits fill the link. It tells the sender how many bits it should send before expecting the first ones back (or before waiting for an acknowledgment).</p>
<div class="example"><p class="ex-q">Link capacity is 512 kbps and the round-trip delay is 1000 ms. Bandwidth-delay product?</p><ol class="steps"><li>512 × 1000 bits/s × 1000 × 10⁻³ s = 512,000 bits</li><li>= 64,000 bytes = 62.5 KB</li></ol><p class="ex-a">512,000 bits (62.5 KB)</p></div>
<p><b>Round-trip time (RTT)</b>, or round-trip delay, is the time for a signal to be sent plus the time for its acknowledgment to come back. <b>Jitter</b> is a problem when different packets of data meet different delays and the receiving application (real-time audio or video) is time-sensitive.</p>
<figure class="lab" data-widget="perf"><figcaption><span class="ttl">Delay and bandwidth-delay calculator</span><span class="cap">See which delay dominates for short and long messages.</span></figcaption></figure>
</section>

<section class="topic" id="c3-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>Differentiate analog and digital data and signals; periodic and nonperiodic signals. · 4–6 marks</summary><div class="body"><p>Define each with the clock example and the two plots (smooth wave vs steps). State which combinations data communication prefers and why (periodic analog for bandwidth, nonperiodic digital for data).</p></div></details>
<details class="answer"><summary>Explain the parameters of a sine wave with diagrams. · 6 marks</summary><div class="body"><p>Peak amplitude (two waves, same f and phase, different heights), frequency and period (f = 1/T, units table, 60 Hz example), phase (0°, 90°, 180° waves), wavelength λ = c/f, and the time vs frequency domain picture (a sine wave is one spike).</p></div></details>
<details class="answer"><summary>Explain the causes of transmission impairment. · 6 marks · IA-1 Q2b</summary><div class="body"><p>Attenuation with the dB formula and a figure (original → attenuated → amplified), distortion (components out of phase at the receiver), noise (four types) and SNR. For a scenario question, connect each cause to the symptom as in the IA-1 box above.</p></div></details>
<details class="answer"><summary>State Nyquist's and Shannon's formulas and solve a numerical. · 4–6 marks · IA-1 Q4b</summary><div class="body"><p>Write both formulas with their conditions (noiseless vs noisy), convert dB to ratio, substitute, and give units. Use the combined Shannon-then-Nyquist method when asked to choose a bit rate and number of levels.</p></div></details>
<details class="answer"><summary>Explain the performance measures of a network. · 6–8 marks</summary><div class="body"><p>Bandwidth (Hz and bps), throughput (with the 10 Mbps example), latency and its four components with formulas, bandwidth-delay product (the pipe picture and the 512 kbps example), RTT and jitter.</p></div></details>
</section>
`,
  quiz: [
    { q: 'If a signal does not change at all, its frequency is', o: ['Infinite', 'Zero', 'One', 'Undefined'], a: 1, why: 'Frequency is the rate of change; no change means zero frequency.' },
    { q: 'What is the period of the 60 Hz power used at home?', o: ['60 s', '1.66 ms', '16.6 ms', '0.6 s'], a: 2, why: 'T = 1/f = 1/60 s = 16.6 ms.' },
    { q: 'A periodic signal is made of sine waves at 100, 300, 500, 700 and 900 Hz. Its bandwidth is', o: ['900 Hz', '800 Hz', '500 Hz', '1000 Hz'], a: 1, why: 'B = highest − lowest = 900 − 100 = 800 Hz.' },
    { q: 'A complete sine wave appears in the frequency domain as', o: ['A continuous band', 'A single spike', 'Two spikes', 'A square pulse'], a: 1, why: 'Its position gives the frequency and its height the peak amplitude.' },
    { q: 'How many bits does each level of an 8-level digital signal carry?', o: ['2', '3', '4', '8'], a: 1, why: 'log₂ 8 = 3.' },
    { q: 'A loss of 3 dB means the power has', o: ['Doubled', 'Halved', 'Fallen to one-third', 'Fallen to one-tenth'], a: 1, why: '10 log₁₀(0.5) = −3.01 dB.' },
    { q: 'Signal power 10 mW, noise power 1 µW. SNRdB is', o: ['10 dB', '20 dB', '40 dB', '4 dB'], a: 2, why: 'SNR = 10⁻²/10⁻⁶ = 10⁴; 10 log₁₀ 10⁴ = 40 dB.' },
    { q: 'Spikes caused by lightning or power lines are', o: ['Thermal noise', 'Induced noise', 'Crosstalk', 'Impulse noise'], a: 3, why: 'Impulse noise is a high-energy signal in a very short time.' },
    { q: 'Distortion occurs because', o: ['The medium absorbs energy', 'Frequency components travel at different speeds', 'Electrons move randomly', 'Two wires interfere'], a: 1, why: 'The components arrive with different delays and phases, changing the shape.' },
    { q: 'Nyquist: a noiseless 3000 Hz channel with two signal levels can carry at most', o: ['3000 bps', '6000 bps', '12,000 bps', '1500 bps'], a: 1, why: '2 × 3000 × log₂ 2 = 6000 bps.' },
    { q: 'Shannon capacity of an extremely noisy channel (SNR ≈ 0) is', o: ['Equal to the bandwidth', 'Twice the bandwidth', 'Zero', 'Infinite'], a: 2, why: 'log₂(1 + 0) = 0.' },
    { q: 'Baseband transmission of a digital signal needs', o: ['A bandpass channel', 'A low-pass channel', 'Modulation', 'A carrier'], a: 1, why: 'Baseband sends the digital signal as it is, over a channel whose bandwidth starts at zero.' },
    { q: 'Which is NOT a component of latency?', o: ['Propagation time', 'Transmission time', 'Queuing time', 'Bandwidth-delay product'], a: 3, why: 'Latency = propagation + transmission + queuing + processing delay.' },
    { q: 'A 512 kbps link with a 1000 ms round-trip delay has a bandwidth-delay product of', o: ['512 bits', '512,000 bits', '64 bits', '1000 bits'], a: 1, why: '512 × 10³ bps × 1 s = 512,000 bits = 62.5 KB.' }
  ]
});
