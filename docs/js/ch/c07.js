DCN.register({
  id: 'c7', num: 7, part: 'B', layer: 'dll', unit: 'Module 2',
  title: 'Error Detection: Block Codes, CRC and Checksum',
  short: 'Error detection',
  summary: 'How the receiver finds out that bits were corrupted: redundancy and block coding, Hamming distance, the simple parity check, cyclic redundancy check and its polynomial analysis, and the checksum used in the Internet.',
  hot: ['IA-1 Q3a'],
  sources: ['1- moduule  2.ppt', 'CN-BCS502-Module2-RajeshL.pdf', 'cn_module2 (naveen notes).pdf', 'CN_Complete_Notes', 'IA-1 answer scheme.pdf'],
  keywords: 'single-bit error burst error redundancy detection correction block coding dataword codeword hamming distance minimum hamming distance linear block code parity check syndrome cyclic code CRC generator divisor remainder modulo-2 XOR polynomial degree shifting burst error generator polynomial CRC-32 checksum ones complement internet checksum fletcher adler',
  html: `
<section class="topic" id="c7-intro">
<h2>Errors and redundancy</h2>
<p>Whenever bits flow from one point to another they are subject to unpredictable changes because of <b>interference</b>, which can change the shape of the signal. Networks must transfer data with acceptable accuracy. Some applications tolerate a few errors (random errors in audio or video), but text transfer expects a very high level of accuracy.</p>
<div class="duo">
  <div class="card"><h4>Single-bit error</h4><p>Only <b>1 bit</b> of a given data unit (byte, character or packet) changes from 1 to 0 or from 0 to 1.</p></div>
  <div class="card"><h4>Burst error</h4><p><b>Two or more bits</b> in the data unit change. A burst is <b>more likely</b> than a single-bit error, because noise usually lasts longer than one bit. At 1 kbps a noise of 1/100 s affects 10 bits; at 1 Mbps the same noise affects 10,000 bits.</p></div>
</div>
<ul>
  <li><b>Redundancy</b> is the central concept: to detect or correct errors we send extra bits with the data. The sender adds the redundant bits and the receiver removes them; their presence lets the receiver detect (or correct) corrupted bits.</li>
  <li><b>Detection versus correction</b>: correction is much harder. Detection only answers "has an error occurred?" (yes or no) and treats a single-bit error the same as a burst. Correction needs the exact number of corrupted bits and, more importantly, their <b>location</b>.</li>
  <li><b>Coding</b>: the sender creates a relationship between the redundant bits and the data bits; the receiver checks that relationship. The two broad categories are <b>block coding</b> and <b>convolution coding</b>; the syllabus covers block coding.</li>
</ul>
<div class="note def"><b class="tag">Modulo-2 arithmetic</b><p>Error-detection codes use arithmetic modulo 2 (integers 0 to N − 1 with N = 2). Addition and subtraction are the same operation, <b>XOR</b>: 0 + 0 = 0, 0 + 1 = 1, 1 + 0 = 1, 1 + 1 = 0. No carries, no borrows.</p></div>
</section>

<section class="topic" id="c7-block">
<h2>Block coding and Hamming distance</h2>
<p>In <b>block coding</b> the message is divided into blocks of k bits called <b>datawords</b>. We add r redundant bits to each to make blocks of <b>n = k + r</b> bits called <b>codewords</b>.</p>
<ul>
  <li>With k bits we can make 2<sup>k</sup> datawords; with n bits, 2<sup>n</sup> codewords. Since n &gt; k there are more possible codewords than datawords.</li>
  <li>The coding is one-to-one: the same dataword always gives the same codeword, so <b>2<sup>n</sup> − 2<sup>k</sup> codewords are never used</b> (invalid). Receiving one of them means the data was corrupted.</li>
</ul>
<p>The receiver can detect a change if two conditions hold: (1) it has (or can find) the list of valid codewords, and (2) the original codeword has changed into an <b>invalid</b> one. The encoder's generator turns k-bit datawords into n-bit codewords; the decoder's checker extracts the dataword or discards the codeword.</p>
<div class="example"><p class="ex-q">Let k = 2 and n = 3 with this code: 00 → 000, 01 → 011, 10 → 101, 11 → 110. The sender encodes 01 as 011. What happens at the receiver?</p><ol class="steps"><li>011 received: valid codeword → dataword 01 extracted.</li><li>Corrupted to 111 (leftmost bit flipped): not a valid codeword → discarded. The error is detected.</li><li>Corrupted to 000 (two right bits flipped): a valid codeword → dataword 00 accepted. Two errors went undetected.</li></ol><p class="ex-a">This code detects single errors but may miss two.</p></div>
<h3 id="c7-hamming">Hamming distance</h3>
<p>The <b>Hamming distance</b> d(x, y) between two words of the same size is the number of positions in which the corresponding bits differ. Find it by <b>XORing the two words and counting the 1s</b>. The Hamming distance between the sent and received codewords is the number of bits corrupted in transmission: if it is not zero, the codeword was corrupted.</p>
<div class="example"><p class="ex-q">Find d(000, 011) and d(10101, 11110).</p><ol class="steps"><li>000 ⊕ 011 = 011 → two 1s</li><li>10101 ⊕ 11110 = 01011 → three 1s</li></ol><p class="ex-a">d(000, 011) = 2 · d(10101, 11110) = 3</p></div>
<p>The <b>minimum Hamming distance d<sub>min</sub></b> is the smallest Hamming distance between all possible pairs in a set of codewords; it is the measure used to design a code.</p>
<div class="example"><p class="ex-q">Find d<sub>min</sub> of the code {000, 011, 101, 110} and of {00000, 01011, 10101, 11110}.</p><ol class="steps"><li>First code: d(000,011) = 2, d(000,101) = 2, d(000,110) = 2, d(011,101) = 2, d(011,110) = 2, d(101,110) = 2 → d<sub>min</sub> = 2</li><li>Second code: d(00000,01011) = 3, d(00000,10101) = 3, d(00000,11110) = 4, d(01011,10101) = 4, d(01011,11110) = 3, d(10101,11110) = 3 → d<sub>min</sub> = 3</li></ol><p class="ex-a">d<sub>min</sub> = 2 and d<sub>min</sub> = 3</p></div>
<div class="formula"><code class="f">to detect up to s errors: d<sub>min</sub> = s + 1</code><span class="where">Geometrically, all words reachable by 1 to s errors from the sent codeword lie inside a circle of radius s; every other valid codeword must lie outside it.</span></div>
<ul>
  <li>The first code above (d<sub>min</sub> = 2) guarantees detection of only a <b>single</b> error: if 101 is sent and one error occurs, the result is invalid; two errors may turn it into another valid codeword.</li>
  <li>A code with d<sub>min</sub> = 4 guarantees detection of up to <b>three</b> errors (s = d<sub>min</sub> − 1).</li>
</ul>
<figure class="lab" data-widget="hamming"><figcaption><span class="ttl">Hamming distance and d<sub>min</sub> calculator</span><span class="cap">Also tells you whether a code is linear.</span></figcaption></figure>
</section>

<section class="topic" id="c7-parity">
<h2>Linear block codes and the parity check</h2>
<p>Almost all block codes used today are <b>linear block codes</b>: the XOR (addition modulo 2) of any two valid codewords is another valid codeword. For a linear code, <b>d<sub>min</sub> = the number of 1s in the non-zero codeword with the fewest 1s</b>. Both codes above are linear: the first has non-zero codewords of weight 2, 2, 2 (d<sub>min</sub> = 2); in the second, XORing any two codewords gives the others, and d<sub>min</sub> = 3.</p>
<h3 id="c7-spc">Simple parity-check code C(5, 4)</h3>
<p>A k-bit dataword becomes an n-bit codeword with <b>n = k + 1</b>. The extra bit, the <b>parity bit</b>, makes the total number of 1s in the codeword <b>even</b>. d<sub>min</sub> = 2, so it is a <b>single-bit error-detecting code</b>; it cannot correct any error.</p>
<div class="duo">
  <div class="card"><h4>Encoder (sender)</h4><p>The generator takes a copy of the 4-bit dataword a<sub>3</sub>a<sub>2</sub>a<sub>1</sub>a<sub>0</sub> and generates the parity bit</p><p class="mono">r<sub>0</sub> = a<sub>3</sub> + a<sub>2</sub> + a<sub>1</sub> + a<sub>0</sub> (mod 2)</p><p>0 if the number of 1s is even, 1 if odd. Dataword + r<sub>0</sub> = 5-bit codeword.</p></div>
  <div class="card"><h4>Decoder (receiver)</h4><p>The checker adds all five received bits:</p><p class="mono">s<sub>0</sub> = b<sub>3</sub> + b<sub>2</sub> + b<sub>1</sub> + b<sub>0</sub> + q<sub>0</sub> (mod 2)</p><p>The result is the <b>syndrome</b>. The decision logic accepts the data bits if s<sub>0</sub> = 0 and discards them if s<sub>0</sub> = 1.</p></div>
</div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Dataword</th><th>Codeword</th><th>Dataword</th><th>Codeword</th><th>Dataword</th><th>Codeword</th><th>Dataword</th><th>Codeword</th></tr></thead>
<tbody class="mono">
<tr><td>0000</td><td>00000</td><td>0100</td><td>01001</td><td>1000</td><td>10001</td><td>1100</td><td>11000</td></tr>
<tr><td>0001</td><td>00011</td><td>0101</td><td>01010</td><td>1001</td><td>10010</td><td>1101</td><td>11011</td></tr>
<tr><td>0010</td><td>00101</td><td>0110</td><td>01100</td><td>1010</td><td>10100</td><td>1110</td><td>11101</td></tr>
<tr><td>0011</td><td>00110</td><td>0111</td><td>01111</td><td>1011</td><td>10111</td><td>1111</td><td>11110</td></tr>
</tbody></table></div>
<div class="example"><p class="ex-q">The sender sends dataword 1011 as codeword 10111. Examine five transmission cases.</p><ol class="steps"><li>No error: 10111 received, syndrome 0 → dataword 1011 accepted.</li><li>One error changes a<sub>1</sub>: 10011 received, syndrome 1 → discarded.</li><li>One error changes r<sub>0</sub>: 10110 received, syndrome 1 → discarded, even though the data bits were fine.</li><li>Two errors change r<sub>0</sub> and a<sub>3</sub>: 00110 received, syndrome 0 → wrong dataword 0011 accepted.</li><li>Three errors change a<sub>3</sub>, a<sub>2</sub>, a<sub>1</sub>: 01011 received, syndrome 1 → discarded.</li></ol><p class="ex-a">The simple parity check detects any odd number of errors but misses even numbers.</p></div>
<figure class="lab" data-widget="parity" data-data="1011"><figcaption><span class="ttl">Parity-check encoder and decoder</span><span class="cap">Flip received bits to recreate the five cases.</span></figcaption></figure>
</section>

<section class="topic" id="c7-crc">
<h2>Cyclic codes and CRC</h2>
<p><b>Cyclic codes</b> are linear block codes with one extra property: if a codeword is <b>cyclically shifted (rotated)</b>, the result is another codeword. If 1011000 is a codeword, its left rotation 0110001 is too (b<sub>1</sub> = a<sub>0</sub>, b<sub>2</sub> = a<sub>1</sub> … b<sub>0</sub> = a<sub>6</sub>). A subset of cyclic codes, the <b>cyclic redundancy check (CRC)</b>, is used in networks such as LANs and WANs.</p>
<h3 id="c7-crc-enc">The CRC encoder</h3>
<ol>
  <li>The dataword has k bits (4 here); the codeword has n bits (7 here).</li>
  <li>The dataword is <b>augmented</b> by appending n − k (3) zeros to its right; the n-bit result goes to the generator.</li>
  <li>The generator divides it by a predefined, agreed <b>divisor</b> of n − k + 1 (4) bits using <b>modulo-2 division</b>: at each step XOR the divisor with the leading bits; if the leftmost bit of the current part is 0, use an all-0s divisor instead.</li>
  <li>The quotient is discarded; the <b>remainder</b> (r<sub>2</sub>r<sub>1</sub>r<sub>0</sub>) is appended to the dataword to form the codeword.</li>
</ol>
<h3 id="c7-crc-dec">The CRC decoder</h3>
<ol>
  <li>The receiver gets the possibly corrupted codeword and feeds all n bits to the checker, a replica of the generator.</li>
  <li>The remainder of the same division is the <b>syndrome</b> (n − k bits), passed to the decision logic.</li>
  <li>If the syndrome is all 0s, the leftmost k bits are accepted as the dataword; otherwise everything is discarded.</li>
</ol>
<figure class="lab" data-widget="crc" data-data="1010" data-div="1011"><figcaption><span class="ttl">CRC long division, sender and receiver</span><span class="cap">Preloaded with IA-1 Q3a. Edit the received codeword to see the syndrome become non-zero.</span></figcaption></figure>
<div class="example"><p class="ex-q">Dataword 1001, divisor 1011. Find the codeword, then check 1001110 and 1000110 at the receiver.</p><ol class="steps"><li>Augment: 1001 → 1001000</li><li>1001 ⊕ 1011 = 010 → bring down 0 → 0100: leftmost 0, use 0000 → 100 → bring down 0 → 1000 ⊕ 1011 = 011 → bring down 0 → 0110: use 0000 → 110</li><li>Remainder 110 → codeword 1001 110</li><li>Receiver divides 1001110 by 1011 → syndrome 000 → accept 1001</li><li>Receiver divides 1000110 by 1011 → syndrome 011 → discard</li></ol><p class="ex-a">Codeword 1001110; a corrupted bit makes the syndrome non-zero.</p></div>
<div class="note exam"><b class="tag">IA-1 Q3a · 6 marks</b><p><b>Find the three check bits added to dataword 1010 with divisor 1011, showing the full division; then show on the receiver side how to check data word 1100.</b> Scheme: 3 + 3 marks.</p><ul><li>Augmented 1010000 ÷ 1011: 1010 ⊕ 1011 = 001 → 0010 (use 0000) → 010 → 0100 (use 0000) → 100 → 1000 ⊕ 1011 = <b>011</b>. Codeword = <b>1010011</b>.</li><li>Receiver: if the data part arrives as 1100, the received word is 1100011. Dividing by 1011: 1100 ⊕ 1011 = 111 → 1110 ⊕ 1011 = 101 → 1011 ⊕ 1011 = 000 → 0001 (use 0000) → <b>001</b>. The syndrome is not zero, so the codeword is corrupted and discarded.</li><li>Show both divisions completely in long-division form; the lab above draws them in exam layout.</li></ul></div>
</section>

<section class="topic" id="c7-poly">
<h2>Polynomials and cyclic code analysis</h2>
<p>A pattern of 0s and 1s can be written as a <b>polynomial</b> with coefficients 0 and 1: the power of each term shows the bit's position and the coefficient shows its value. 1000011 = x<sup>6</sup> + x + 1: a 7-bit pattern becomes three terms (and x<sup>23</sup> + x<sup>3</sup> + 1 is a 24-bit pattern).</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Operation</th><th>Rule</th><th>Example</th></tr></thead>
<tbody>
<tr><th>Degree</th><td>Highest power; one less than the number of bits</td><td>x<sup>6</sup> + x + 1 has degree 6 (7 bits)</td></tr>
<tr><th>Add / subtract</th><td>Same operation: combine terms and delete pairs of identical terms (coefficients mod 2)</td><td>(x<sup>5</sup> + x<sup>4</sup> + x<sup>2</sup>) + (x<sup>6</sup> + x<sup>4</sup> + x<sup>2</sup>) = x<sup>6</sup> + x<sup>5</sup></td></tr>
<tr><th>Multiply / divide terms</th><td>Add / subtract the powers</td><td>x<sup>3</sup> × x<sup>4</sup> = x<sup>7</sup> · x<sup>5</sup> / x<sup>2</sup> = x<sup>3</sup></td></tr>
<tr><th>Multiply polynomials</th><td>Every term by every term, then delete equal pairs</td><td>(x<sup>5</sup> + x<sup>3</sup> + x<sup>2</sup>)(x<sup>2</sup> + x + 1) = x<sup>7</sup> + x<sup>6</sup> + x<sup>2</sup></td></tr>
<tr><th>Divide polynomials</th><td>Divide first terms, multiply back, subtract; repeat until the degree is below the divisor's</td><td>CRC division</td></tr>
<tr><th>Shift left m bits</th><td>Multiply each term by x<sup>m</sup> (append zeros)</td><td>10011 → 10011000: x<sup>4</sup> + x + 1 → x<sup>7</sup> + x<sup>4</sup> + x<sup>3</sup></td></tr>
<tr><th>Shift right m bits</th><td>Divide by x<sup>m</sup> (delete rightmost bits)</td><td>10011 → 10: x<sup>4</sup> + x + 1 → x</td></tr>
</tbody></table></div>
<p><b>CRC with polynomials</b>: dataword 1001 = x<sup>3</sup> + 1; divisor 1011 = x<sup>3</sup> + x + 1 (the <b>generator polynomial g(x)</b>). Shifting left by 3 gives x<sup>6</sup> + x<sup>3</sup>; dividing by g(x) leaves x<sup>2</sup> + x (110); codeword = x<sup>6</sup> + x<sup>3</sup> + x<sup>2</sup> + x.</p>
<h3 id="c7-analysis">What a generator can catch</h3>
<p>With dataword d(x), codeword c(x), generator g(x), syndrome s(x) and error e(x): <b>received codeword = c(x) + e(x)</b>. Since c(x) divides exactly by g(x), the syndrome is the remainder of <b>e(x)/g(x)</b>. If s(x) ≠ 0, one or more bits are corrupted; if s(x) = 0, either no bit is corrupted or the decoder failed. <b>Errors e(x) that are divisible by g(x) are not caught.</b></p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Error type</th><th>Condition on g(x) to catch it</th></tr></thead>
<tbody>
<tr><th>Single-bit error (e = x<sup>i</sup>)</th><td>g(x) has <b>at least two terms</b> and the coefficient of x<sup>0</sup> is 1. (x + 1 catches all; x<sup>3</sup> misses errors at positions ≥ 3; 1 is useless.)</td></tr>
<tr><th>Two isolated single-bit errors (x<sup>i</sup>(x<sup>t</sup> + 1))</th><td>g(x) does <b>not divide x<sup>t</sup> + 1</b> for t between 2 and n − 1. (x + 1 and x<sup>4</sup> + 1 fail; x<sup>7</sup> + x<sup>6</sup> + 1 is good; x<sup>15</sup> + x<sup>14</sup> + 1 catches two errors up to 32,768 bits apart.)</td></tr>
<tr><th>Any odd number of errors</th><td>g(x) contains the factor <b>x + 1</b>.</td></tr>
<tr><th>Burst errors of length L</th><td>All bursts with <b>L ≤ r</b> are detected; L = r + 1 detected with probability 1 − (½)<sup>r−1</sup>; L &gt; r + 1 with probability 1 − (½)<sup>r</sup> (r = degree of g(x)).</td></tr>
</tbody></table></div>
<div class="example"><p class="ex-q">How good is g(x) = x<sup>6</sup> + 1 for burst errors?</p><ol class="steps"><li>r = 6: every burst of length ≤ 6 is detected.</li><li>Length 7: probability of slipping by = (½)<sup>5</sup> ≈ 3 in 100.</li><li>Length ≥ 8: (½)<sup>6</sup> ≈ 16 in 1000 slip by.</li></ol><p class="ex-a">x<sup>18</sup> + x<sup>7</sup> + x + 1 and x<sup>32</sup> + x<sup>23</sup> + x<sup>7</sup> + 1 do far better: bursts up to 18 and 32 bits are always caught.</p></div>
<div class="note remember"><b class="tag">A good generator polynomial</b><ol><li>has at least two terms;</li><li>has the coefficient of x<sup>0</sup> equal to 1;</li><li>does not divide x<sup>t</sup> + 1 for t between 2 and n − 1;</li><li>has the factor x + 1.</li></ol></div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Name</th><th>Polynomial</th><th>Used in</th></tr></thead>
<tbody>
<tr><th>CRC-8</th><td>x<sup>8</sup> + x<sup>2</sup> + x + 1</td><td>ATM header</td></tr>
<tr><th>CRC-10</th><td>x<sup>10</sup> + x<sup>9</sup> + x<sup>5</sup> + x<sup>4</sup> + x<sup>2</sup> + 1</td><td>ATM AAL</td></tr>
<tr><th>CRC-16</th><td>x<sup>16</sup> + x<sup>12</sup> + x<sup>5</sup> + 1</td><td>HDLC</td></tr>
<tr><th>CRC-32</th><td>x<sup>32</sup> + x<sup>26</sup> + x<sup>23</sup> + x<sup>22</sup> + x<sup>16</sup> + x<sup>12</sup> + x<sup>11</sup> + x<sup>10</sup> + x<sup>8</sup> + x<sup>7</sup> + x<sup>5</sup> + x<sup>4</sup> + x<sup>2</sup> + x + 1</td><td>LANs</td></tr>
</tbody></table></div>
<p><b>Advantages of cyclic codes</b>: very good at detecting single-bit errors, double errors, odd numbers of errors and burst errors; easy to implement in hardware and software, and especially fast in hardware. More powerful cyclic codes based on Galois-field algebra, such as <b>Reed-Solomon</b>, are used today for both detection and correction.</p>
</section>

<section class="topic" id="c7-checksum">
<h2>Checksum</h2>
<p>A <b>checksum</b> is an error-detecting technique for a message of any length. In the Internet it is used mostly at the <b>network and transport layers</b> rather than the data-link layer. At the source the message is divided into m-bit units and the generator creates an extra m-bit unit, the checksum, sent with the message. At the destination the checker creates a new checksum from the message plus the sent checksum: if it is all 0s the message is accepted, otherwise discarded.</p>
<h3 id="c7-cks-concept">The idea, step by step</h3>
<ol>
  <li>To send five 4-bit numbers (7, 11, 12, 0, 6), also send their sum: (7, 11, 12, 0, 6, <b>36</b>). The receiver adds the five numbers and compares with 36.</li>
  <li>Easier for the receiver: send the negative of the sum (−36) and check that everything adds to 0.</li>
  <li>But 36 does not fit in 4 bits. Use <b>one's complement arithmetic</b>: extra leftmost bits are wrapped and added to the m rightmost bits. 36 = 100100 → 0100 + 10 = 0110 = <b>6</b>. A negative number is the bit-inverse: −6 → 1001 = <b>9</b> (= 15 − 6).</li>
</ol>
<div class="example"><p class="ex-q">Send (7, 11, 12, 0, 6) with a one's complement checksum.</p><ol class="steps"><li>Sender: 7 + 11 + 12 + 0 + 6 = 36 → wrapped sum 6 → checksum = complement = 9</li><li>Sends (7, 11, 12, 0, 6, 9)</li><li>Receiver: 7 + 11 + 12 + 0 + 6 + 9 = 45 = 101101 → wrapped 1101 + 10 = 1111 = 15</li><li>Complement of 15 = 0</li></ol><p class="ex-a">Checksum 9; the receiver's result 0 means no error, so it keeps the data and drops the checksum.</p></div>
<h3 id="c7-inet">The Internet checksum (16-bit)</h3>
<div class="duo">
  <div class="card"><h4>Sender</h4><ol><li>Divide the message into 16-bit words.</li><li>Set the checksum word to 0.</li><li>Add all words, including the checksum, using one's complement addition.</li><li>Complement the sum: that is the checksum; send it with the data.</li></ol></div>
  <div class="card"><h4>Receiver</h4><ol><li>Divide the message (with checksum) into 16-bit words.</li><li>Add all words using one's complement addition.</li><li>Complement the sum to get the new checksum.</li><li>If it is 0, accept the message; otherwise reject it.</li></ol></div>
</div>
<p>The algorithm adds the words in ordinary (two's complement) arithmetic first, then wraps the extra carry bits back in to simulate one's complement.</p>
<figure class="lab" data-widget="checksum"><figcaption><span class="ttl">Checksum calculator</span><span class="cap">Traditional 4-bit example and the 16-bit Internet checksum.</span></figcaption></figure>
<h3 id="c7-fletcher">Fletcher and Adler</h3>
<p>The traditional checksum has a major problem: it is <b>not weighted</b>, treating every item equally, so if two 16-bit items are <b>transposed</b> the checksum does not change and the error is missed. Two weighted alternatives:</p>
<div class="duo">
  <div class="card"><h4>Fletcher checksum</h4><ul><li>Weights each data item by its position.</li><li><b>8-bit Fletcher</b>: works on bytes and creates a 16-bit checksum, calculated modulo 256 (intermediate results are divided by 256 and the remainder kept).</li><li>Two accumulators, L and R: one simply adds the data items, the other adds a weight.</li><li><b>16-bit Fletcher</b>: works on 16-bit items, creates a 32-bit checksum, modulo 65,536.</li></ul></div>
  <div class="card"><h4>Adler checksum</h4><p>A 32-bit checksum similar to 16-bit Fletcher, with three differences:</p><ol><li>calculation is on <b>single bytes</b> instead of 2 bytes at a time;</li><li>the modulus is the <b>prime 65,521</b> instead of 65,536 (a prime modulus detects some combinations better);</li><li>L is initialised to <b>1</b> instead of 0.</li></ol></div>
</div>
</section>

<section class="topic" id="c7-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>Explain CRC encoding and decoding with an example; check a received codeword. · 6–8 marks · IA-1 Q3a</summary><div class="body"><p>Draw the C(7,4) encoder/decoder blocks, list the encoder and decoder steps, show the full long division for the dataword, then divide the received codeword and interpret the syndrome.</p></div></details>
<details class="answer"><summary>What is Hamming distance? Find d<sub>min</sub> of a code; how many errors can it detect? · 4–6 marks</summary><div class="body"><p>Definition with the XOR method, two examples, d<sub>min</sub> definition, the rule d<sub>min</sub> = s + 1 with the circle picture, and a worked d<sub>min</sub> for a given set of codewords.</p></div></details>
<details class="answer"><summary>Explain the simple parity-check code with encoder and decoder. · 6 marks</summary><div class="body"><p>Figure of generator and checker, r<sub>0</sub> and s<sub>0</sub> formulas, the C(5,4) table, and the five cases of sending 1011.</p></div></details>
<details class="answer"><summary>Using polynomials, explain the conditions under which a CRC detects single, double, odd and burst errors. · 8 marks</summary><div class="body"><p>Received = c(x) + e(x); syndrome = e(x) mod g(x); then each row of the analysis table with an example, and the four properties of a good generator.</p></div></details>
<details class="answer"><summary>Explain the checksum and the Internet checksum with an example. · 6 marks</summary><div class="body"><p>The (7, 11, 12, 0, 6) example with one's complement wrapping, sender and receiver procedures, the 16-bit algorithm, and why Fletcher/Adler exist.</p></div></details>
</section>
`,
  quiz: [
    { q: 'Why is a burst error more likely than a single-bit error?', o: ['Bits are sent in parallel', 'Noise usually lasts longer than one bit', 'Receivers are slow', 'Codewords are long'], a: 1, why: 'A 1/100 s noise spike hits 10 bits at 1 kbps and 10,000 bits at 1 Mbps.' },
    { q: 'In block coding with k = 4 and n = 7, how many codewords are unused?', o: ['16', '112', '128', '3'], a: 1, why: '2⁷ − 2⁴ = 128 − 16 = 112.' },
    { q: 'd(10101, 11110) =', o: ['2', '3', '4', '5'], a: 1, why: '10101 ⊕ 11110 = 01011, which has three 1s.' },
    { q: 'To guarantee detection of up to s errors, dmin must be', o: ['s', 's + 1', '2s', '2s + 1'], a: 1, why: 'Every word within distance s of a codeword must be invalid.' },
    { q: 'A simple parity-check code can detect', o: ['Only even numbers of errors', 'Any odd number of errors', 'All burst errors', 'And correct single errors'], a: 1, why: 'Flipping an odd number of bits makes the parity odd (syndrome 1).' },
    { q: 'In CRC, the dataword is augmented with how many zeros?', o: ['n', 'k', 'n − k', 'n − k + 1'], a: 2, why: 'n − k zeros; the divisor has n − k + 1 bits.' },
    { q: 'Dataword 1001 with divisor 1011 gives the codeword', o: ['1001011', '1001110', '1001101', '1001000'], a: 1, why: 'The remainder of 1001000 ÷ 1011 is 110.' },
    { q: 'If the CRC syndrome is all 0s, the receiver', o: ['Discards the codeword', 'Accepts the leftmost k bits as the dataword', 'Requests retransmission', 'Corrects the error'], a: 1, why: 'A zero syndrome means no error was detected.' },
    { q: 'A generator polynomial with the factor (x + 1) can detect', o: ['All burst errors', 'All odd numbers of errors', 'Only single-bit errors', 'Nothing'], a: 1, why: 'Errors with an odd number of terms are never divisible by (x + 1).' },
    { q: 'Shifting 10011 left by 3 bits gives', o: ['10', '10011000', '0010011', '11001'], a: 1, why: 'Multiply by x³: append three zeros.' },
    { q: 'For (7, 11, 12, 0, 6), the 4-bit one\'s complement checksum is', o: ['6', '9', '36', '15'], a: 1, why: 'Sum 36 wraps to 6; its complement is 15 − 6 = 9.' },
    { q: 'Which weakness of the traditional checksum do Fletcher and Adler fix?', o: ['It cannot detect single-bit errors', 'It cannot detect transposed data items', 'It is too long', 'It needs a divisor'], a: 1, why: 'The traditional checksum is not weighted, so order does not matter to it.' },
    { q: 'The Adler checksum uses the modulus', o: ['256', '65,536', '65,521', '1024'], a: 2, why: 'A prime modulus improves detection for some data combinations.' }
  ]
});
