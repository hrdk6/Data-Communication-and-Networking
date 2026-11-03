DCN.register({
  id: 'c6', num: 6, part: 'A', layer: 'phy', unit: 'Module 1 · Lab',
  title: 'Transmission Media',
  short: 'Transmission media',
  summary: 'The physical paths below the physical layer: twisted-pair, coaxial and fibre-optic cable, and wireless radio waves, microwaves and infrared, with their standards, connectors, performance and uses.',
  hot: ['VTU Module 1', 'Lab program 2'],
  sources: ['CN-BCS502-Module1-RajeshL.pdf', 'CN_Complete_Notes', 'network commands.pdf (Program 2: cables)', 'basic of networks.pdf'],
  keywords: 'guided unguided twisted pair UTP STP category Cat5 RJ45 coaxial RG-59 RG-58 RG-11 BNC fiber optic core cladding reflection multimode step-index graded-index single-mode SC ST MT-RJ Kevlar radio waves microwaves infrared omnidirectional unidirectional parabolic dish horn ground propagation sky propagation line of sight VLF EHF IrDA',
  html: `
<section class="topic" id="c6-intro">
<h2>Guided and unguided media</h2>
<p>Transmission media are located <b>below the physical layer</b> and are directly controlled by it; we can say they belong to <b>layer zero</b>. A transmission medium is anything that can carry information from a source to a destination (for two people at dinner, it is the air). Computers send signals as electromagnetic energy, which propagates through the medium.</p>
<div class="duo">
  <div class="card"><h4>Guided (wired, bounded)</h4><p>Provide a conduit from one device to another; the signal is directed and contained by the physical limits of the medium.</p><ul><li>Twisted-pair cable</li><li>Coaxial cable</li><li>Fibre-optic cable</li></ul></div>
  <div class="card"><h4>Unguided (wireless)</h4><p>Transport electromagnetic waves without a physical conductor; the signal is broadcast through free space and is available to anyone with a receiver.</p><ul><li>Radio waves</li><li>Microwaves</li><li>Infrared</li></ul></div>
</div>
<p>Twisted-pair and coaxial cable use metallic (copper) conductors that carry signals as <b>electric current</b>. Optical fibre is glass or plastic and carries signals as <b>light</b>.</p>
</section>

<section class="topic" id="c6-twisted">
<h2>Twisted-pair cable</h2>
<p>A twisted pair is two conductors (normally copper), each with its own plastic insulation, twisted together. One wire carries the signal; the other is a ground reference. The receiver uses the <b>difference</b> between the two.</p>
<div class="note def"><b class="tag">Why twist?</b><p>Noise and crosstalk affect both wires. If the wires were parallel, one would always be closer to the noise source, so the unwanted signals would differ and show up at the receiver. Twisting keeps both wires, on balance, the same distance from the source, so the unwanted signals are nearly equal and <b>cancel out</b> in the difference.</p></div>
<h3 id="c6-utp">Unshielded versus shielded</h3>
<p>The most common cable is <b>unshielded twisted pair (UTP)</b>. IBM produced <b>shielded twisted pair (STP)</b>, which has a metal foil or braided-mesh covering around each pair. The shield improves quality by keeping out noise and crosstalk, but STP is bulkier and more expensive.</p>
<h3 id="c6-cat">Categories</h3>
<p>The Electronic Industries Association (EIA) classifies UTP into seven categories by cable quality, 1 lowest and 7 highest.</p>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Category</th><th>Specification</th><th class="num">Data rate (Mbps)</th><th>Use</th></tr></thead>
<tbody>
<tr><th>1</th><td>UTP used in telephone</td><td class="num">&lt; 0.1</td><td>Telephone</td></tr>
<tr><th>2</th><td>UTP originally used in T lines</td><td class="num">2</td><td>T-1 lines</td></tr>
<tr><th>3</th><td>Improved CAT 2, used in LANs</td><td class="num">10</td><td>LANs</td></tr>
<tr><th>4</th><td>Improved CAT 3, used in Token Ring</td><td class="num">20</td><td>LANs</td></tr>
<tr><th>5</th><td>Normally 24 AWG wire with a jacket and outside sheath</td><td class="num">100</td><td>LANs</td></tr>
<tr><th>5E</th><td>Extension of 5 with extra features to reduce crosstalk and electromagnetic interference</td><td class="num">125</td><td>LANs</td></tr>
<tr><th>6</th><td>Matched components from one manufacturer; tested at 200 Mbps</td><td class="num">200</td><td>LANs</td></tr>
<tr><th>7</th><td>SSTP (shielded screen twisted pair): each pair in helical foil plus an overall foil shield</td><td class="num">600</td><td>LANs</td></tr>
</tbody></table></div>
<p class="small muted">Your lab orientation slides also list newer cables: Cat5 100 Mbps (100 MHz), Cat5e and Cat6 1000 Mbps (100 / 250 MHz), Cat6a 10 Gbps (500 MHz), Cat7 and Cat7a 10 Gbps (1000 / 1200 MHz), Cat8 (2000 MHz).</p>
<ul>
  <li><b>Connector</b>: the most common UTP connector is the <b>RJ45</b> (registered jack). It is keyed, so it fits only one way.</li>
  <li><b>Performance</b>: attenuation (dB/km) rises sharply above 100 kHz; thicker wire (lower gauge number) attenuates less.</li>
  <li><b>Applications</b>: telephone lines and the local loop to the central office; DSL lines that give high data rates; LANs such as 10Base-T and 100Base-T.</li>
</ul>
<p class="small">Crimping RJ45 cables, T568A/T568B colour codes and straight vs cross cables are in the <a href="#lab-cables">Lab manual</a>.</p>
</section>

<section class="topic" id="c6-coax">
<h2>Coaxial cable</h2>
<p>Coaxial cable (coax) carries signals of <b>higher frequency ranges</b> than twisted pair. It has a central core conductor of solid or stranded wire (usually copper) in an insulating sheath, encased in an outer conductor of metal foil, braid or both. The outer metal wrapping is both a <b>shield against noise</b> and the second conductor that completes the circuit. It is covered by another insulating sheath and a plastic cover.</p>
<figure class="fig">
<svg viewBox="0 0 620 120" role="img" aria-label="Layers of a coaxial cable">
  <rect x="20" y="30" width="560" height="60" rx="30" style="fill:var(--surface-3);stroke:var(--line-2)"/>
  <rect x="110" y="36" width="470" height="48" rx="24" style="fill:var(--phy);fill-opacity:.25;stroke:var(--phy)"/>
  <rect x="210" y="44" width="370" height="32" rx="16" style="fill:var(--surface);stroke:var(--line-2)"/>
  <rect x="310" y="54" width="270" height="12" rx="6" style="fill:var(--accent)"/>
  <text x="55" y="22" text-anchor="middle" style="font-size:11px">plastic cover</text>
  <text x="150" y="110" text-anchor="middle" style="font-size:11px">outer conductor (shield)</text>
  <text x="250" y="22" text-anchor="middle" style="font-size:11px">insulator</text>
  <text x="400" y="110" text-anchor="middle" style="font-size:11px">inner conductor</text>
</svg>
</figure>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>RG rating</th><th class="num">Impedance (Ω)</th><th>Use</th></tr></thead>
<tbody>
<tr><th>RG-59</th><td class="num">75</td><td>Cable TV</td></tr>
<tr><th>RG-58</th><td class="num">50</td><td>Thin Ethernet</td></tr>
<tr><th>RG-11</th><td class="num">50</td><td>Thick Ethernet</td></tr>
</tbody></table></div>
<ul>
  <li><b>Standards</b>: coax is categorised by <b>Radio Government (RG)</b> ratings; each RG number fixes the wire gauge, insulator, shield and casing.</li>
  <li><b>Connectors</b>: the <b>Bayonet Neill-Concelman (BNC)</b> family: the BNC connector (to a device), the BNC T connector (branches a cable, used in Ethernet), and the BNC terminator (at the end of the cable, to stop the signal reflecting).</li>
  <li><b>Performance</b>: much higher bandwidth than twisted pair, but <b>much higher attenuation</b>, so the signal weakens quickly and needs frequent repeaters.</li>
  <li><b>Applications</b>: analog telephone networks (one coax carried 10,000 voice signals) and later digital ones (up to 600 Mbps); cable TV; traditional Ethernet LANs (10Base-2 thin, 10Base-5 thick).</li>
</ul>
<div class="duo">
  <div class="card"><h4>Advantages (lab handout)</h4><ul><li>Higher bandwidth; used for analog and digital transmission</li><li>Cheaper than fibre</li><li>Longer distances at higher data rates than twisted pair</li><li>Excellent noise immunity</li></ul></div>
  <div class="card"><h4>Disadvantages (lab handout)</h4><ul><li>A single cable failure can fail the whole network</li><li>Harder to install and costlier than twisted pair</li><li>An imperfect shield can cause a grounded loop</li></ul></div>
</div>
</section>

<section class="topic" id="c6-fiber">
<h2>Fibre-optic cable</h2>
<p>A fibre-optic cable is made of glass or plastic and transmits signals as <b>light</b>. It uses <b>reflection</b> to guide light: a glass or plastic <b>core</b> is surrounded by a <b>cladding</b> of less dense glass or plastic. The difference in density is chosen so that a beam of light in the core is <b>reflected off the cladding instead of being refracted into it</b>.</p>
<figure class="lab lab-3d" data-scene="fiber"><figcaption><span class="ttl">Inside a fibre: three propagation modes</span><span class="cap">Launch a light pulse and see how far apart the rays arrive in each mode.</span></figcaption></figure>
<h3 id="c6-modes">Propagation modes</h3>
<div class="duo">
  <div class="card"><h4>Multimode step-index</h4><p>Multiple beams from the light source travel through the core on different paths. Core density is <b>constant</b>, so a beam moves in a straight line until it hits the cladding, where its angle changes abruptly (the "step"). Beams take different path lengths and arrive at different times, which <b>distorts</b> the signal.</p></div>
  <div class="card"><h4>Multimode graded-index</h4><p>The core's density is <b>highest at the centre and decreases gradually</b> towards the edge. Light bends smoothly along curves, and the delays of the different beams become nearly equal, so <b>distortion is reduced</b>.</p></div>
  <div class="card"><h4>Single-mode</h4><p>Step-index fibre with a <b>very narrow core</b> and a <b>highly focused light source</b> (laser) that limits beams to nearly horizontal paths. The critical angle is close to 90°, so all beams arrive together with negligible delay and distortion.</p></div>
</div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Type</th><th class="num">Core (µm)</th><th class="num">Cladding (µm)</th><th>Mode</th></tr></thead>
<tbody>
<tr><td>50/125</td><td class="num">50.0</td><td class="num">125</td><td>Multimode, graded index</td></tr>
<tr><td>62.5/125</td><td class="num">62.5</td><td class="num">125</td><td>Multimode, graded index</td></tr>
<tr><td>100/125</td><td class="num">100.0</td><td class="num">125</td><td>Multimode, graded index</td></tr>
<tr><td>7/125</td><td class="num">7.0</td><td class="num">125</td><td>Single mode</td></tr>
</tbody></table></div>
<p>Fibres are named by the ratio of core diameter to cladding diameter, in micrometres.</p>
<ul>
  <li><b>Cable composition</b>: an outer <b>jacket</b> of PVC or Teflon; inside it <b>Kevlar</b> strands (the material in bulletproof vests) for strength; then a plastic coating to cushion the fibre; and at the centre the fibre itself (cladding and core).</li>
  <li><b>Connectors</b>: <b>SC</b> (subscriber channel; push/pull locking; cable TV), <b>ST</b> (straight-tip; bayonet locking, more reliable than SC; networking devices) and <b>MT-RJ</b> (same size as RJ45).</li>
  <li><b>Performance</b>: attenuation is much flatter than for twisted pair and coax, so about <b>one-tenth as many repeaters</b> are needed.</li>
  <li><b>Applications</b>: backbone networks (wide bandwidth is cost-effective), hybrid fibre-coax cable TV networks, and LANs such as 100Base-FX (Fast Ethernet) and 1000Base-X. Your campus interconnects its buildings with optical fibre.</li>
</ul>
<div class="duo">
  <div class="card"><h4>Advantages over metallic cable</h4><ul><li><b>Higher bandwidth</b>, hence higher data rates</li><li><b>Less signal attenuation</b>: 50 km without regeneration (copper needs repeaters every 5 km)</li><li><b>Immune to electromagnetic interference</b></li><li><b>Resistant to corrosive materials</b></li><li><b>Light weight</b></li><li><b>Greater immunity to tapping</b> (copper creates antenna effects)</li></ul></div>
  <div class="card"><h4>Disadvantages</h4><ul><li><b>Installation and maintenance</b> need expertise that is not available everywhere</li><li><b>Unidirectional light propagation</b>: two fibres are needed for two-way communication</li><li><b>Cost</b>: cable and interfaces are more expensive; not justified if bandwidth demand is low</li></ul></div>
</div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Twisted pair</th><th>Coaxial</th><th>Fibre optic</th></tr></thead>
<tbody>
<tr><th>Signal</th><td>Electric current</td><td>Electric current</td><td>Light</td></tr>
<tr><th>Bandwidth</th><td>Lowest</td><td>Higher</td><td>Highest</td></tr>
<tr><th>Attenuation</th><td>Rises sharply above 100 kHz</td><td>Highest; frequent repeaters</td><td>Lowest; far fewer repeaters</td></tr>
<tr><th>Noise immunity</th><td>Twisting cancels much noise</td><td>Shield gives good immunity</td><td>Immune to EMI</td></tr>
<tr><th>Connector</th><td>RJ45</td><td>BNC, BNC T, terminator</td><td>SC, ST, MT-RJ</td></tr>
<tr><th>Cost</th><td>Cheapest</td><td>Moderate</td><td>Highest</td></tr>
<tr><th>Uses</th><td>Telephone, DSL, 10/100Base-T LANs</td><td>Cable TV, old Ethernet, telephone trunks</td><td>Backbones, fibre LANs, long-distance links</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c6-unguided">
<h2>Unguided media: wireless</h2>
<p>Wireless communication uses the part of the electromagnetic spectrum from <b>3 kHz to 900 THz</b>. Unguided signals travel from source to destination in three ways:</p>
<div class="duo">
  <div class="card"><h4>Ground propagation</h4><p>Low-frequency radio waves travel close to the Earth, following its curve. Their range depends on the signal's power.</p></div>
  <div class="card"><h4>Sky propagation</h4><p>Higher-frequency radio waves radiate upward into the ionosphere and are reflected back to Earth, covering greater distances with lower power.</p></div>
  <div class="card"><h4>Line-of-sight propagation</h4><p>Very high frequencies travel in a straight line directly from antenna to antenna. Antennas must face each other and be tall or close enough to clear the Earth's curvature.</p></div>
</div>
<div class="table-wrap"><table class="cmp">
<thead><tr><th>Band</th><th>Range</th><th>Propagation</th><th>Application</th></tr></thead>
<tbody>
<tr><th>Very low frequency (VLF)</th><td>3–30 kHz</td><td>Ground</td><td>Long-range radio navigation</td></tr>
<tr><th>Low frequency (LF)</th><td>30–300 kHz</td><td>Ground</td><td>Radio beacons and navigational locators</td></tr>
<tr><th>Middle frequency (MF)</th><td>300 kHz–3 MHz</td><td>Sky</td><td>AM radio</td></tr>
<tr><th>High frequency (HF)</th><td>3–30 MHz</td><td>Sky</td><td>Citizens band (CB), ship and aircraft communication</td></tr>
<tr><th>Very high frequency (VHF)</th><td>30–300 MHz</td><td>Sky and line-of-sight</td><td>VHF TV, FM radio</td></tr>
<tr><th>Ultrahigh frequency (UHF)</th><td>300 MHz–3 GHz</td><td>Line-of-sight</td><td>UHF TV, cellular phones, paging, satellite</td></tr>
<tr><th>Superhigh frequency (SHF)</th><td>3–30 GHz</td><td>Line-of-sight</td><td>Satellite communication</td></tr>
<tr><th>Extremely high frequency (EHF)</th><td>30–300 GHz</td><td>Line-of-sight</td><td>Radar, satellite</td></tr>
</tbody></table></div>
<h3 id="c6-radio">Radio waves (3 kHz – 1 GHz)</h3>
<ul>
  <li>Mostly <b>omnidirectional</b>: they spread in all directions, so sending and receiving antennas need not be aligned; but waves from another antenna on the same frequency can interfere.</li>
  <li>Sky-mode radio waves travel long distances, which makes them suitable for long-distance broadcasting such as AM radio.</li>
  <li>Low- and medium-frequency radio waves <b>penetrate walls</b>: good for indoor reception, bad because signals cannot be confined to a building.</li>
  <li>The band is narrow (under 1 GHz), so data rates for digital communication are low; almost the entire band is regulated by authorities such as the FCC.</li>
  <li>They use <b>omnidirectional antennas</b>.</li>
  <li><b>Applications</b>: <b>multicasting</b> (one sender, many receivers): AM and FM radio, television, maritime radio, cordless phones and paging.</li>
</ul>
<h3 id="c6-micro">Microwaves (1 – 300 GHz)</h3>
<ul>
  <li><b>Unidirectional</b>: the beam can be narrowly focused, so antennas must be aligned; one aligned pair does not interfere with another.</li>
  <li><b>Line-of-sight</b> propagation: distant towers must be very tall, and repeaters are often needed for long distances.</li>
  <li>Very high-frequency microwaves <b>cannot penetrate walls</b>, a problem if receivers are inside buildings.</li>
  <li>The band is relatively wide (almost 299 GHz), so wider subbands and <b>high data rates</b> are possible. Some portions need permission from authorities.</li>
  <li><b>Unidirectional antennas</b>: the <b>parabolic dish</b> (every line parallel to the line of symmetry reflects to a common focus, so it gathers more signal than a single point) and the <b>horn</b> (outgoing signals are broadcast up a stem and deflected outward in a narrow beam; incoming signals are funnelled down into the stem).</li>
  <li><b>Applications</b>: <b>unicast</b> (one-to-one) communication: cellular phones, satellite networks and wireless LANs.</li>
</ul>
<h3 id="c6-ir">Infrared (300 GHz – 400 THz; wavelengths 1 mm – 770 nm)</h3>
<ul>
  <li>Used for <b>short-range</b> communication; having high frequencies, infrared <b>cannot penetrate walls</b>. This prevents interference: a remote in one room does not affect the next room, and you do not control your neighbour's TV.</li>
  <li>The same property makes it useless for long range, and it cannot be used outdoors because the sun's rays contain infrared that interferes.</li>
  <li>The band (almost 400 THz) has excellent potential for high data rates.</li>
  <li><b>IrDA</b> (Infrared Data Association) standards connect keyboards, mice, PCs and printers. The original standard gave 75 kbps up to 8 m; the newer one gives 4 Mbps. IrDA needs line of sight: the keyboard's port must point at the PC.</li>
</ul>
<div class="table-wrap"><table class="cmp">
<thead><tr><th></th><th>Radio waves</th><th>Microwaves</th><th>Infrared</th></tr></thead>
<tbody>
<tr><th>Frequency</th><td>3 kHz – 1 GHz</td><td>1 – 300 GHz</td><td>300 GHz – 400 THz</td></tr>
<tr><th>Direction</th><td>Omnidirectional</td><td>Unidirectional</td><td>Line of sight, short range</td></tr>
<tr><th>Walls</th><td>Penetrate (low/medium f)</td><td>Cannot penetrate (high f)</td><td>Cannot penetrate</td></tr>
<tr><th>Antenna</th><td>Omnidirectional</td><td>Parabolic dish, horn</td><td>IrDA port</td></tr>
<tr><th>Used for</th><td>Multicasting: radio, TV, paging, cordless phones</td><td>Unicasting: cellular, satellite, wireless LAN</td><td>Remote controls, keyboards, mice</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c6-exam">
<h2>Exam questions for this chapter</h2>
<details class="answer"><summary>Explain guided transmission media with neat diagrams. · 8–10 marks</summary><div class="body"><p>Twisted pair (why twisted, UTP vs STP, categories, RJ45, applications), coax (layers diagram, RG table, BNC connectors, applications), fibre (core/cladding reflection, three propagation modes with diagrams, connectors, applications). End with the three-column comparison table.</p></div></details>
<details class="answer"><summary>Explain the propagation modes of fibre-optic cable. · 6 marks</summary><div class="body"><p>Draw step-index multimode (zig-zag, abrupt reflections), graded-index multimode (curves, density decreasing outward) and single-mode (narrow core, straight beam). Explain distortion in each and the sizes table.</p></div></details>
<details class="answer"><summary>List the advantages and disadvantages of optical fibre. · 6 marks</summary><div class="body"><p>Six advantages (bandwidth, attenuation, EMI immunity, corrosion resistance, weight, tapping) and three disadvantages (installation and maintenance, unidirectional, cost).</p></div></details>
<details class="answer"><summary>Explain unguided media: radio waves, microwaves and infrared. · 8 marks</summary><div class="body"><p>Spectrum and the three propagation methods with a figure, the bands table, then each wave type's frequency range, direction, antennas and applications; finish with the comparison table.</p></div></details>
</section>
`,
  quiz: [
    { q: 'Transmission media are said to belong to', o: ['Layer 1', 'Layer zero', 'Layer 2', 'The application layer'], a: 1, why: 'They lie below the physical layer and are controlled by it.' },
    { q: 'Why are the wires in a twisted pair twisted?', o: ['To save space', 'So noise and crosstalk affect both wires equally and cancel', 'To increase resistance', 'To carry light'], a: 1, why: 'The receiver uses the difference between the wires, so equal noise cancels.' },
    { q: 'The most common connector for UTP is', o: ['BNC', 'RJ45', 'SC', 'ST'], a: 1, why: 'RJ45 is keyed so it can be inserted only one way.' },
    { q: 'RG-59 coaxial cable is used for', o: ['Thin Ethernet', 'Thick Ethernet', 'Cable TV', 'Telephone local loop'], a: 2, why: 'RG-59 (75 Ω) is cable TV; RG-58 and RG-11 (50 Ω) are thin and thick Ethernet.' },
    { q: 'Compared with twisted pair, coaxial cable has', o: ['Lower bandwidth and lower attenuation', 'Higher bandwidth but higher attenuation', 'No shield', 'Only optical signals'], a: 1, why: 'Its signal weakens rapidly, so it needs frequent repeaters.' },
    { q: 'Light stays inside an optical fibre because', o: ['The cladding is denser than the core', 'Light reflects off the less-dense cladding', 'The jacket is opaque', 'The core is hollow'], a: 1, why: 'The density difference makes the beam reflect instead of refract.' },
    { q: 'Which fibre mode gives the least distortion?', o: ['Multimode step-index', 'Multimode graded-index', 'Single-mode', 'All are equal'], a: 2, why: 'One nearly horizontal path means all beams arrive together.' },
    { q: 'In graded-index fibre the core density is', o: ['Constant', 'Highest at the centre, decreasing toward the edge', 'Lowest at the centre', 'Equal to the cladding'], a: 1, why: 'Light bends gradually, equalising delays.' },
    { q: 'Which is a disadvantage of optical fibre?', o: ['Immunity to EMI', 'Unidirectional light propagation', 'Light weight', 'Less attenuation'], a: 1, why: 'Two fibres are needed for two-way communication.' },
    { q: 'Radio waves are mostly', o: ['Unidirectional', 'Omnidirectional', 'Line-of-sight only', 'Unable to penetrate walls'], a: 1, why: 'They spread in all directions, which suits multicasting.' },
    { q: 'Microwaves are best suited for', o: ['Multicasting', 'Unicasting', 'Broadcasting through walls', 'Remote controls'], a: 1, why: 'Their narrow beams serve one-to-one links: cellular, satellite, wireless LAN.' },
    { q: 'Why can infrared not be used outdoors?', o: ['It is too slow', 'The sun\'s rays contain infrared that interferes', 'It needs a parabolic dish', 'It penetrates walls'], a: 1, why: 'Sunlight swamps the infrared signal.' }
  ]
});
