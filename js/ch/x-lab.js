DCN.register({
  id: 'lab', num: 23, part: 'X', layer: 'tool',
  title: 'Lab Manual',
  short: 'Lab manual',
  summary: 'Everything from your lab files: networking components and addresses, the network commands, cables and RJ-45 crimping, IP address study and subnetting, wireless LAN set-up, the NS2 congestion-window program, and the BMSIT&M campus network survey.',
  sources: ['basic of networks.pdf', 'network commands.pdf', 'TCL 3 (1).txt', 'Congestion Window.pptx', 'Network Survey Report.pdf', 'CNS Servey Report AAD.pdf'],
  keywords: 'lab practical viva network commands ipconfig ping arp tracert pathping netstat nslookup hostname NIC MAC address OUI switch managed unmanaged VLAN SNMP cables UTP STP coaxial BNC fiber crimping RJ45 T568A T568B straight cross cable IP address study subnet mask subnetting wireless LAN TP-Link access point repeater router mode SSID NS2 ns2 tcl nam xgraph congestion window cwnd rwnd Ethernet LAN simulation survey BMSIT campus data center UTM core switch OFC star topology',
  html: `
<section class="topic" id="lab-overview">
<h2>What the lab covers</h2>
<div class="duo">
  <div class="card"><h4>Orientation programme</h4><p>Networking components, NIC and switches, MAC and IP addresses, basic commands, types of cables, crimping, IP address study and subnetting, wireless LAN set-up.</p></div>
  <div class="card"><h4>Programs in your files</h4><ul><li>Execute the network commands (arp, ipconfig, hostname, netstat, nslookup, pathping, ping, tracert …)</li><li>Program 2: study of different types of cables</li><li>Program 3: simulate an Ethernet LAN with n nodes, set multiple traffic flows and plot the congestion window (NS2)</li></ul></div>
  <div class="card"><h4>Network survey</h4><p>The BMSIT&amp;M campus network architecture reports: data center, topology, bandwidth, IP scheme and security.</p></div>
</div>
</section>

<section class="topic" id="lab-components">
<h2>Networking components</h2>
<p>A computer network is a set of computing devices connected through media such as coaxial cable, twisted pair or radio waves that are able to communicate with each other.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Component</th><th>Key points</th></tr></thead><tbody>
<tr><td><b>NIC with BNC</b></td><td>Coaxial network: BNC (Bayonet Neill–Concelman) connector on the NIC and on the cable</td></tr>
<tr><td><b>NIC with RJ-45</b></td><td>Twisted-pair network: RJ-45 connector on the NIC and on the cable</td></tr>
<tr><td><b>Wi-Fi NIC / USB Wi-Fi module</b></td><td>Wireless LAN in the ISM band <b>2.4–2.4835 GHz</b>: indoor, low-power wireless equipment</td></tr>
<tr><td><b>NIC</b></td><td>Holds the <b>48-bit MAC (hardware) address</b> used by the data-link (MAC) layer to identify the system; wired or wireless</td></tr>
<tr><td><b>Switch</b></td><td>Connects multiple devices so they share and transfer data using MAC addresses; works at the <b>data-link layer</b>. Ethernet star topology (IEEE 802.3)</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>Unmanaged switch</h4><ul><li>Plug-and-play; needs no special installation</li><li>Auto-negotiation between Ethernet devices: the switch picks the best data rate automatically</li></ul></div>
  <div class="card"><h4>Managed switch</h4><ul><li>Control over traffic; each port can be customized and configured for efficiency</li><li>Can create <b>VLANs</b> and subnets; allows <b>port mirroring</b></li><li>Remotely accessible console; uses <b>SNMP</b> to monitor connected devices</li><li>Higher cost</li></ul></div>
</div>
</section>

<section class="topic" id="lab-addresses">
<h2>Numbers in networks: MAC and IP addresses</h2>
<div class="duo">
  <div class="card"><h4>MAC (physical, hardware) address</h4><ul><li>A <b>48-bit</b> hexadecimal number embedded in the NIC during manufacture; worldwide unique and permanent</li><li>Used by the MAC sublayer of the data-link layer; actual communication on the network happens with MAC addresses</li><li>Written as 12 hex digits separated by colons, hyphens or dots, e.g. <span class="mono">34-17-EB-54-C8-EB</span></li><li>The first 6 digits are the <b>OUI</b> (Organizational Unique Identifier) of the manufacturer, assigned by the IEEE Registration Authority: CC:46:D6 Cisco, 3C:5A:B4 Google, 3C:D9:2B Hewlett Packard, 00:9A:CD Huawei, 34-17-EB Dell</li><li>See it with <span class="mono">ipconfig /all</span> (Windows) or <span class="mono">ifconfig</span> (Linux)</li></ul></div>
  <div class="card"><h4>IP address</h4><ul><li>Uniquely identifies a device on the Internet or a LAN; used at the network (Internet) layer</li><li><b>32 bits</b> written as 4 octets separated by dots: <span class="mono">192.168.16.34</span> = <span class="mono">11000000.10101000.00010000.00100010</span></li><li>Divided into <b>network ID</b> and <b>host ID</b>; it can be changed</li><li>Allocated by <b>IANA</b>, a division of ICANN</li><li><b>Public IP</b>: reachable over the Internet, assigned by your ISP, not reusable; <b>private IP</b>: identifies a device on the local network, assigned by the admin or router, reusable (see <a href="#c10-special">special and private addresses</a>)</li></ul></div>
</div>
</section>

<section class="topic" id="lab-commands">
<h2>Network commands</h2>
<p>Windows Command Prompt commands from the lab notes; each one exposes a protocol from the syllabus.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Command</th><th>What it does</th><th>Syllabus link</th></tr></thead><tbody>
<tr><td class="mono">hostname</td><td>Displays the name of your computer</td><td>—</td></tr>
<tr><td class="mono">ipconfig</td><td>Basic TCP/IP configuration of all adapters (IPv4/IPv6 address, mask, default gateway)</td><td><a href="#c10-dhcp">DHCP</a></td></tr>
<tr><td class="mono">ipconfig /all</td><td>Full configuration, including the physical (MAC) address, DHCP and DNS servers</td><td><a href="#lab-addresses">MAC address</a></td></tr>
<tr><td class="mono">ipconfig /renew · /release</td><td>Renew or release the IP address obtained from DHCP</td><td><a href="#c10-dhcp-fsm">DHCP states</a></td></tr>
<tr><td class="mono">ping www.google.com</td><td>Checks connectivity to a host using <b>echo request</b> and <b>echo reply</b> messages (sends four test packets by default)</td><td>ICMP, <a href="#c10-inet">network layer</a></td></tr>
<tr><td class="mono">ping -n 5 -l 1500 www.google.com</td><td>Sends 5 requests with a packet length of 1500 bytes instead of 32</td><td><a href="#c10-frag">MTU and fragmentation</a></td></tr>
<tr><td class="mono">ping 127.0.0.1</td><td>Tests the NIC and TCP/IP stack of the local host (loopback)</td><td><a href="#c10-special">Loopback block</a></td></tr>
<tr><td class="mono">arp -a</td><td>Shows the ARP table: IP-to-MAC mappings learned on the Ethernet</td><td>ARP bridges layers 2 and 3</td></tr>
<tr><td class="mono">arp -d · arp -s &lt;ip&gt; &lt;mac&gt;</td><td>Delete an entry · add a static IP–MAC pair</td><td>—</td></tr>
<tr><td class="mono">tracert 192.168.1.1</td><td>Shows the actual path to a destination: an ordered list of the intermediate routers that return ICMP messages, with the hop count</td><td><a href="#c10-datagram">TTL</a> · <a href="#c11-intro">routing</a></td></tr>
<tr><td class="mono">tracert -h 3 lifewire.com &gt; z:\\tracertresults.txt</td><td>Limit to 3 hops and save the output to a file</td><td>—</td></tr>
<tr><td class="mono">pathping rvce.edu.in</td><td>Like tracert but sends echo requests to each router over a period of time and computes latency and packet loss per hop; slower, more informative</td><td><a href="#c3-latency">Latency</a></td></tr>
<tr><td class="mono">netstat</td><td>Active connections: protocol, local address, foreign address, state (ESTABLISHED, SYN_SENT …)</td><td><a href="#c12-conn">TCP states</a> · <a href="#c12-socket">sockets</a></td></tr>
<tr><td class="mono">netstat -a · -e · -n</td><td>All active ports · Ethernet statistics (packets sent and received) · numerical addresses and ports</td><td><a href="#c12-ports">Port numbers</a></td></tr>
<tr><td class="mono">nslookup</td><td>Shows the local DNS server and its address, looks up a domain's addresses and name servers, checks DNS record propagation</td><td><a href="#c13-dns">DNS</a></td></tr>
</tbody></table></div>
<pre class="code">C:\\&gt; ping www.google.com
Pinging www.google.com [142.250.194.4] with 32 bytes of data:
Reply from 142.250.194.4: bytes=32 time=26ms TTL=118
...
Ping statistics for 142.250.194.4:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)</pre>
<p class="small muted">Read the reply: 32 bytes of data per echo request, the round-trip time in milliseconds, and the TTL remaining when the reply arrived.</p>
</section>

<section class="topic" id="lab-cables">
<h2>Cables and RJ-45 crimping</h2>
<h3 id="lab-cabletypes">Program 2: types of cables</h3>
<div class="duo">
  <div class="card"><h4>Twisted pair</h4><p>Pairs twisted like a DNA strand; UTP and STP. Categories (lab slides): Cat5 100 Mbps / 100 MHz; Cat5e 1000 Mbps / 100 MHz; Cat6 1000 Mbps / 250 MHz; Cat6a 10 Gbps / 500 MHz; Cat7 10 Gbps / 1000 MHz; Cat7a 10 Gbps / 1200 MHz; Cat8 / 2000 MHz. Details in <a href="#c6-twisted">Chapter 6</a>.</p></div>
  <div class="card"><h4>Coaxial cable</h4><p>Carries higher frequencies than twisted pair: a central copper conductor in an insulating sheath, an outer conductor of foil or braid, and a plastic cover. Used for analog and digital transmission, LANs and TV distribution; higher bandwidth, cheaper than fibre, longer distances, excellent noise immunity. Drawbacks: a single cable failure can bring down the network; harder to install and costlier than twisted pair; an imperfect shield can cause a ground loop.</p></div>
  <div class="card"><h4>Fibre-optic cable</h4><p>Strands of glass fibre in an insulated casing for long-distance, high-performance networking: data rates up to 100 Gbps per channel, segment lengths from 150 to 40,000 m depending on the type, unaffected by EMI, about 10 connector types. Lower loss than copper and a life of over 100 years, but expensive and difficult to install.</p></div>
</div>
<h3 id="lab-crimp">Crimping a Cat cable</h3>
<ul>
  <li>A Cat cable has <b>4 twisted pairs</b>; each coloured wire is twisted with a white wire striped in the same colour.</li>
  <li>Only <b>two pairs</b> are used, on pins <b>1, 2, 3 and 6</b>, for the transmit and receive signals.</li>
  <li>The EIA (Electronic Industries Association) and TIA (Telecommunication Industry Association) define two wiring standards: <b>EIA/TIA-568-A</b> and <b>EIA/TIA-568-B</b>.</li>
</ul>
<figure class="lab" data-widget="rj45"><figcaption><span class="ttl">RJ-45 wiring lab</span><span class="cap">Switch between straight-through and crossover to see which pins swap. Pins 1, 2, 3 and 6 carry the signals.</span></figcaption></figure>
<div class="duo">
  <div class="card"><h4>Straight cable · different functions</h4><ul><li>Router to hub or switch</li><li>Server to hub or switch</li><li>Workstation to hub or switch</li></ul></div>
  <div class="card"><h4>Cross cable · same functions</h4><ul><li>Uplinks between switches</li><li>PC to PC</li><li>PC to router</li><li>Two routers together without a switch</li></ul></div>
</div>
<div class="note tip"><b class="tag">Procedure</b><ol><li>Strip about 2–3 cm of the outer jacket.</li><li>Untwist the pairs and arrange the eight wires in the T568B (or T568A) order.</li><li>Flatten and trim them evenly.</li><li>Push them fully into the RJ-45 connector (clip facing away from you, pin 1 on the left), so every wire reaches the end.</li><li>Crimp with the crimping tool.</li><li>Repeat on the other end (same standard for straight, the other standard for cross) and check with a cable tester.</li></ol></div>
</section>

<section class="topic" id="lab-ipstudy">
<h2>Study of IP addresses and subnetting</h2>
<ul>
  <li>The <b>network ID</b> identifies the physical network the computer is attached to; the <b>host ID</b> identifies the computer on that network. Classes A, B and C are used practically; in class A, 0 and 127 are not used (127 has special uses). Non-routable (private) addresses are used inside LANs.</li>
  <li>The <b>subnet mask</b> splits the address into network ID and host ID: network bits all 1s, host bits all 0s. Routers extract the network ID with it and forward the packet to that network. Class A 255.0.0.0, class B 255.255.0.0, class C 255.255.255.0.</li>
  <li><b>Subnetting</b> logically partitions one physical network into several smaller subnets: easier maintenance, less broadcast traffic, and protection of one network from another (the MCA department network cannot be accessed from the CS department network).</li>
</ul>
<figure class="lab" data-widget="ipv4" data-ip="200.1.2.0/24" data-sub="4"><figcaption><span class="ttl">Lab example: 200.1.2.0/24 in four subnets</span><span class="cap">Network IDs .0, .64, .128, .192, each with 62 hosts. Change the split to 2 subnets for the /25 version.</span></figcaption></figure>
<p>The full theory, including classless addressing and subnet design rules, is in <a href="#c10-subnet">Chapter 10</a>.</p>
</section>

<section class="topic" id="lab-wlan">
<h2>Wireless LAN set-up (TP-Link)</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Mode</th><th>Use</th></tr></thead><tbody>
<tr><td><b>Access Point (AP)</b></td><td>Extends the network: turns a wired connection into wireless. Works like a switch, usually behind a router.</td></tr>
<tr><td><b>Wireless router</b></td><td>Home Internet sharing: shares one wired Internet connection with several clients; the wired Internet point goes to the WAN port.</td></tr>
<tr><td><b>Repeater / range extender</b></td><td>Extends the wireless coverage with the same SSID and security.</td></tr>
</tbody></table></div>
<ol>
  <li>In a browser open <span class="mono">http://tplinkwifi.net</span> and log in (admin / admin).</li>
  <li>Check the current status of the device.</li>
  <li>Choose <b>Quick Setup</b>.</li>
  <li>Set the mode to <b>Access Point</b>.</li>
  <li>Change the <b>SSID</b> (Wi-Fi network name) and set a password.</li>
  <li>Preview the settings and click <b>Finish</b>: the AP is ready to build the WLAN.</li>
</ol>
<p class="small muted">Wireless LANs use CSMA/CA for media access: see <a href="#c9-ca">Chapter 9</a>.</p>
</section>

<section class="topic" id="lab-ns2">
<h2>Program 3 · NS2: Ethernet LAN and congestion window</h2>
<p><b>Aim</b>: simulate an Ethernet LAN using n nodes, set multiple traffic nodes and plot the congestion window for different source/destination pairs.</p>
<div class="duo">
  <div class="card"><h4>Background (lab slides)</h4><ul><li><b>Ethernet</b> connects wired LANs so devices communicate through a common protocol; it is a data-link-layer protocol. The data-link layer has two sublayers: <b>MAC</b> (media access control) and <b>LLC</b> (logical link control).</li><li><b>Congestion</b>: reduced quality of service when a node or link carries more data than it can handle.</li><li><b>cwnd</b> (congestion window): a TCP state variable limiting how much data TCP can send before receiving an ACK. <b>rwnd</b> (receiver window): advertises how much the destination can receive. Together they regulate the flow.</li><li>Slow start: cwnd starts at 1 MSS, ssthresh starts at rwnd; exponential growth while cwnd &lt; ssthresh, then linear (congestion avoidance).</li></ul></div>
  <div class="card"><h4>Topology in the program</h4><ul><li>Nodes n0 "Source0", n1 "Source1", n2 "R1", n3 "R2", n4 "Dest0", n5 "Dest1"</li><li>LAN 1: n0, n1, n2 at 0.5 Mb, 40 ms, MAC/802_3, DropTail queue</li><li>n2 ↔ n3 duplex link 10 Mb, 100 ms, with a <b>uniform random loss model</b></li><li>LAN 2: n3, n4, n5 at 0.5 Mb, 40 ms</li><li>TCP0: n0 → n4 (red), TCP1: n1 → n5 (green), packet size 1500, each driven by FTP (0.1–9.8 s and 1–9.9 s)</li></ul></div>
</div>
<pre class="code">set val(stop) 10.0                      ;# time of simulation end
set ns [new Simulator]
set tracefile [open 5.tr w]
set namfile [open 5.nam w]
$ns namtrace-all $namfile
set wf0 [open WinFile0 w]               ;# cwnd samples of TCP0
set wf1 [open WinFile1 w]               ;# cwnd samples of TCP1

proc PlotWindow {tcpSource file} {      ;# every 0.1 s write "time cwnd"
  global ns
  set time 0.1
  set now [$ns now]
  set cwnd [$tcpSource set cwnd_]
  puts $file "$now $cwnd"
  $ns at [expr $now+$time] "PlotWindow $tcpSource $file"
}

set n0 [$ns node]  ;  set n1 [$ns node]  ;  set n2 [$ns node]
set n3 [$ns node]  ;  set n4 [$ns node]  ;  set n5 [$ns node]
$n0 label "Source0" ; $n1 label "Source1" ; $n2 label "R1"
$n3 label "R2"      ; $n4 label "Dest0"   ; $n5 label "Dest1"
$ns color 1 "red"
$ns color 2 "green"

set lan [$ns newLan "$n0 $n1 $n2" 0.5Mb 40ms LL Queue/DropTail MAC/802_3 Channel]
$ns duplex-link $n2 $n3 10Mb 100ms DropTail
$ns duplex-link-op $n2 $n3 queuePos 0.5
set lan [$ns newLan "$n3 $n4 $n5" 0.5Mb 40ms LL Queue/DropTail MAC/802_3 Channel]

set loss_module [new ErrorModel]        ;# random packet loss on R1-R2
$loss_module ranvar [new RandomVariable/Uniform]
$loss_module drop-target [new Agent/Null]
$ns lossmodel $loss_module $n2 $n3

set tcp0 [new Agent/TCP]                ;# flow 1: Source0 -> Dest0
$ns attach-agent $n0 $tcp0
set sink2 [new Agent/TCPSink]
$ns attach-agent $n4 $sink2
$ns connect $tcp0 $sink2
$tcp0 set packetSize_ 1500

set tcp1 [new Agent/TCP]                ;# flow 2: Source1 -> Dest1
$ns attach-agent $n1 $tcp1
set sink3 [new Agent/TCPSink]
$ns attach-agent $n5 $sink3
$ns connect $tcp1 $sink3
$tcp1 set packetSize_ 1500

set ftp0 [new Application/FTP]
$ftp0 attach-agent $tcp0
$ns at 0.1 "$ftp0 start"
$ns at 9.8 "$ftp0 stop"
set ftp1 [new Application/FTP]
$ftp1 attach-agent $tcp1
$ns at 1 "$ftp1 start"
$ns at 9.9 "$ftp1 stop"

$ns at 0.1 "PlotWindow $tcp0 $wf0"
$ns at 0.5 "PlotWindow $tcp1 $wf1"
$tcp0 set class_ 1
$tcp1 set class_ 2

proc finish {} {
  global ns tracefile namfile
  $ns flush-trace
  close $tracefile
  close $namfile
  exec nam 5.nam &                      ;# animation
  exec xgraph WinFile0 WinFile1 &       ;# cwnd versus time for both flows
  exit 0
}
$ns at $val(stop) "$ns nam-end-wireless $val(stop)"
$ns at $val(stop) "finish"
$ns at $val(stop) "puts \\"done\\" ; $ns halt"
$ns run</pre>
<div class="duo">
  <div class="card"><h4>How to run</h4><ol><li>Save the program as, e.g., <span class="mono">lab3.tcl</span>.</li><li>Run <span class="mono">ns lab3.tcl</span>.</li><li>NAM opens with the animation of both LANs and the R1–R2 link.</li><li>xgraph plots <span class="mono">WinFile0</span> and <span class="mono">WinFile1</span>: cwnd against time for the two flows.</li></ol></div>
  <div class="card"><h4>What to observe and explain</h4><ul><li>cwnd rises quickly at the start (<b>slow start</b>), then more slowly (<b>congestion avoidance</b>).</li><li>Random losses on R1–R2 cut cwnd (time-out or triple duplicate ACKs), giving a sawtooth.</li><li>Flow 2 starts later (FTP at 1 s), so its curve starts later and the two flows share the bottleneck.</li><li>Theory: <a href="#c12-tcpcc">TCP congestion control</a> and the cwnd lab there.</li></ul></div>
</div>
</section>

<section class="topic" id="lab-survey">
<h2>Network survey: the BMSIT&amp;M campus</h2>
<p>Two student survey reports in your files ("Network Topology Architecture in BMSIT&amp;M", 2022–23) describe the campus network. Each fact below links to the syllabus concept it illustrates.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Aspect</th><th>What the survey found</th><th>Syllabus link</th></tr></thead><tbody>
<tr><td>Data center</td><td>Own data center (set up 2019–20) with a <b>UTM</b> (Unified Threat Management: anti-virus, anti-spam, content and web filtering), <b>two core switches</b>, node switches, <b>optical fibre cabling</b> between buildings and an <b>RF</b> link to the ladies' hostel</td><td><a href="#c6-fiber">Fibre</a> · <a href="#c6-radio">radio</a></td></tr>
<tr><td>Wi-Fi</td><td>Advanced Wi-Fi access points (141 in one report, 161 in the other)</td><td><a href="#c9-ca">CSMA/CA</a></td></tr>
<tr><td>Users</td><td>About 4500 users, 800–1000 concurrent; Wi-Fi authentication through a centralized <b>Extreme NAC</b> server, keyed by USN (students) or employee ID (staff)</td><td>—</td></tr>
<tr><td>Bandwidth</td><td>550 Mbps of 1:1 Internet bandwidth from two ISPs (DVOIS and Tata Teleservices), terminated at the data center and distributed over fibre; per-user bandwidth shared as users increase (students minimum 1 Mbps, up to 60 Mbps)</td><td><a href="#c3-bandwidth">Bandwidth</a> · <a href="#c3-throughput">throughput</a></td></tr>
<tr><td>Topology</td><td><b>Star-based hybrid</b>: blocks connected in a star from the data center; switches inside a block cascaded; secondary fibre lines like a ring as backup</td><td><a href="#c1-hybrid">Hybrid topology</a> · <a href="#c1-campus">campus choice</a></td></tr>
<tr><td>Distribution path</td><td>Device (Wi-Fi/LAN) → floor switch → block node switch → stack → core switch → UTM → ISP connectivity</td><td><a href="#c1-devices">Devices</a></td></tr>
<tr><td>Why star</td><td>Isolation of devices, simplicity, a failed cable does not affect the whole network, easy to add devices, centralization, easy troubleshooting, better performance, easy installation</td><td><a href="#c1-star">Star topology</a></td></tr>
<tr><td>Difficulties</td><td>Choosing an accessible data-center location; laying cables about 8 ft down, costly trenchless digging and drilling HDPE pipes that carry the fibre</td><td>—</td></tr>
<tr><td>Layout</td><td>Campus in four quadrants; a primary fibre ring (red) connects all quadrants to the data center in the BSN block; a secondary fibre (green) is the backup during an Internet blackout</td><td>Reliability (<a href="#c1-criteria">network criteria</a>)</td></tr>
<tr><td>IP scheme</td><td>One internal IP series: 0 series for admins, 1 series for departments, Wi-Fi in a separate series; LAN and Wi-Fi reach the core switch on separate lines with separate addresses, LAN gets priority</td><td><a href="#c10-special">Private addresses</a> · <a href="#c10-nat">NAT</a></td></tr>
<tr><td>Security</td><td>UTM, data backups stored separately, staff education on unsecured networks, anti-malware and firewall software; a coordinator and support staff administer the network</td><td>—</td></tr>
</tbody></table></div>
</section>
`
});
