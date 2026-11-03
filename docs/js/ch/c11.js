DCN.register({
  id: 'c11', num: 11, part: 'B', layer: 'net', unit: 'Module 3',
  title: 'Routing Algorithms and Protocols',
  short: 'Routing',
  summary: 'How routers build forwarding tables: the internet as a weighted graph, link-state routing with Dijkstra, distance-vector routing with Bellman-Ford (and count to infinity), path-vector routing, hierarchical routing with autonomous systems, RIP, OSPF, BGP and multicast MOSPF.',
  hot: ['IA-2 Q1'],
  sources: ['Routing Algorithms.pdf', 'Module 3.pptx.pdf', 'CN_Complete_Notes (Module 3, ch. 20–21)', 'CN IA-2 imp questions'],
  keywords: 'unicast routing multicast forwarding table graph nodes edges weighted graph cost least-cost routing least-cost tree shortest path tree global decentralized static dynamic link state LS LSDB link-state database LSP flooding sequence number Dijkstra N prime D(v) p(v) predecessor O(n2) distance vector DV Bellman-Ford equation dx(y) min neighbour iterative asynchronous distributed good news bad news count to infinity two-node loop split horizon poison reverse poisoned three-node instability path vector policy spanning tree loop prevention hierarchical routing autonomous system AS ASN stub multihomed transient intra-AS inter-AS IGP EGP gateway router hot potato RIP hop count 15 16 infinity UDP 520 routed request response timers periodic expiration garbage collection OSPF open shortest path first areas backbone area border router designated router LSA router link network link summary link external link hello database description link state request update acknowledgment protocol 89 authentication BGP eBGP iBGP TCP 179 speakers peers session path attributes ORIGIN AS-PATH NEXT-HOP MED LOCAL-PREF ATOMIC-AGGREGATE AGGREGATOR route selection open update keepalive notification routing policy MOSPF multicast source-based tree IGMP',
  html: `
<section class="topic" id="c11-intro">
<h2>Unicast routing: the big picture</h2>
<p>The goal of the network layer is to deliver a datagram from its source to its destination or destinations. One destination (one-to-one delivery) is <b>unicast routing</b>; several destinations (one-to-many) is <b>multicast routing</b>.</p>
<ul>
  <li>In unicast routing a packet is routed <b>hop by hop</b> with the help of <b>forwarding tables</b>.</li>
  <li>The <b>source host</b> needs no forwarding table: it delivers its packet to the <b>default router</b> of its local network. The <b>destination host</b> needs none either: it receives the packet from its default router.</li>
  <li>So only the routers that glue the networks together need forwarding tables, and routing a packet means routing it from the <b>source router</b> (default router of the source host) to the <b>destination router</b> (router connected to the destination network).</li>
</ul>
<h3 id="c11-graph">An internet as a weighted graph</h3>
<p>A graph is a set of nodes and edges. To model an internet, each <b>router is a node</b> and each <b>network between a pair of routers is an edge</b>. Every edge has a <b>cost</b> (weight); if there is no edge between two nodes, the cost is <b>infinity</b>.</p>
<div class="fgrid">
  <div class="formula"><code class="f">G = (N, E)</code><span class="where">N = set of routers, e.g. {u, v, w, x, y, z}; E = set of links, e.g. {(u,v), (u,x), (v,x), (v,w), (x,w), (x,y), (w,y), (w,z), (y,z)}</span></div>
  <div class="formula"><code class="f">cost(x<sub>1</sub>, …, x<sub>p</sub>) = c(x<sub>1</sub>,x<sub>2</sub>) + … + c(x<sub>p−1</sub>,x<sub>p</sub>)</code><span class="where">c(x, x′) = cost of link (x, x′), e.g. c(w, z) = 5. The cost could always be 1, or inversely related to bandwidth or to congestion.</span></div>
</div>
<p><b>Key question:</b> what is the least-cost path between u and z? A <b>routing algorithm</b> is an algorithm that finds that least-cost path. The graph abstraction is also useful elsewhere, e.g. in P2P, where N is the set of peers and E the set of TCP connections.</p>
<h3 id="c11-trees">Least-cost routing and least-cost trees</h3>
<p>Each source router chooses the route whose total cost is the least among all possible routes, so every router must find the least-cost route between itself and all the other routers.</p>
<ul>
  <li>With N routers there are N − 1 least-cost paths from each router, so N × (N − 1) for the whole internet (90 paths for just 10 routers).</li>
  <li>A neater view is a <b>least-cost tree</b>: a tree with the source router as root that spans the whole graph, in which the path from the root to every node is the shortest. There is one least-cost tree per node, so N trees for the internet.</li>
</ul>
<div class="duo">
  <div class="card"><h4>Property 1: reverse routes</h4><p>The least-cost route from X to Y in X's tree is the inverse of the least-cost route from Y to X in Y's tree; the cost is the same in both directions (e.g. A → B → E → F and F → E → B → A, cost 8 each).</p></div>
  <div class="card"><h4>Property 2: routes combine</h4><p>Instead of going from X to Z with X's tree, we can go from X to Y with X's tree and continue from Y to Z with Y's tree: the combined route is the same (e.g. A → G costs 9 either way, 6 + 3).</p></div>
</div>
</section>

<section class="topic" id="c11-classify">
<h2>Classifying routing algorithms</h2>
<div class="duo">
  <div class="card"><h4>Global or decentralized information?</h4><ul><li><b>Global</b>: every router has the complete topology and all link costs. These are <b>link-state (LS)</b> algorithms.</li><li><b>Decentralized</b>: a router knows only its physically connected neighbours and the link costs to them; the computation is iterative, exchanging information with neighbours. These are <b>distance-vector (DV)</b> algorithms.</li></ul></div>
  <div class="card"><h4>Static or dynamic?</h4><ul><li><b>Static</b>: routes change slowly over time.</li><li><b>Dynamic</b>: routes change more quickly, through periodic updates or in response to link-cost changes.</li></ul></div>
</div>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Algorithm</th><th>Idea</th><th>Internet protocol</th></tr></thead><tbody>
<tr><td><b>Distance vector</b></td><td>Each router tells its <b>neighbours</b> what it knows about the <b>whole internet</b></td><td>RIP (intra-domain)</td></tr>
<tr><td><b>Link state</b></td><td>Each router tells the <b>whole internet</b> what it knows about its <b>neighbours</b></td><td>OSPF (intra-domain)</td></tr>
<tr><td><b>Path vector</b></td><td>Like DV but carries whole paths and applies <b>policies</b> instead of least cost</td><td>BGP (inter-domain)</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c11-ls">
<h2>Link-state routing and Dijkstra's algorithm</h2>
<p>In link-state routing the <b>cost associated with an edge defines the state of the link</b>. Links with lower costs are preferred; a cost of infinity means the link does not exist or is broken.</p>
<h3 id="c11-lsdb">Link-state database (LSDB)</h3>
<p>To build a least-cost tree, each node needs a <b>complete map</b> of the network: the state of every link. The collection of states of all links is the <b>link-state database</b>. There is only <b>one LSDB</b> for the whole internet; every node keeps a duplicate. It can be represented as a <b>two-dimensional matrix</b> in which each cell is the cost of the corresponding link.</p>
<p>The LSDB is built by <b>flooding</b>:</p>
<ol>
  <li>Each node sends greeting messages to its immediate neighbours and learns two things per neighbour: the <b>identity of the node</b> and the <b>cost of the link</b>. Together they form the <b>LS packet (LSP)</b>, which is sent out of every interface.</li>
  <li>A node receiving an LSP compares it with any copy it already has, using the <b>sequence number</b>. If the new LSP is older, it is discarded.</li>
  <li>If it is newer (or the first), the node keeps it, discards the old one, and sends a copy out of <b>every interface except the one it arrived on</b>. This guarantees that flooding stops somewhere.</li>
</ol>
<h3 id="c11-dijkstra">Dijkstra's algorithm</h3>
<p>Using the shared LSDB, every node runs Dijkstra's algorithm to build its own least-cost tree:</p>
<ol>
  <li>The node chooses <b>itself as the root</b>, a tree with a single node, and sets the total cost of each node from the LSDB.</li>
  <li>It selects the node <b>not yet in the tree that is closest to the root</b> and adds it to the tree. Then the costs of the nodes not in the tree are updated, because paths may have changed.</li>
  <li>It repeats step 2 until <b>all nodes</b> are in the tree.</li>
</ol>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Notation (slides)</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="mono">c(x,y)</td><td>Link cost from node x to y; ∞ if they are not direct neighbours</td></tr>
<tr><td class="mono">D(v)</td><td>Current value of the cost of the path from the source to destination v</td></tr>
<tr><td class="mono">p(v)</td><td>Predecessor node along the path from the source to v</td></tr>
<tr><td class="mono">N′</td><td>Set of nodes whose least-cost path is definitively known</td></tr>
</tbody></table></div>
<pre class="code">1  Initialization:
2    N' = {u}
3    for all nodes v
4      if v adjacent to u
5        then D(v) = c(u,v)
6        else D(v) = ∞
7
8  Loop
9    find w not in N' such that D(w) is a minimum
10   add w to N'
11   update D(v) for all v adjacent to w and not in N':
12     D(v) = min( D(v), D(w) + c(w,v) )
13   /* new cost to v is either the old cost to v or the known
14      shortest path cost to w plus the cost from w to v */
15 until all nodes in N'</pre>
<p>It computes least-cost paths from one node (the source) to all other nodes, which gives the <b>forwarding table</b> for that node. It is iterative: after k iterations the least-cost paths to k destinations are known.</p>
<figure class="lab" data-widget="dijkstra" data-graph="k2" data-src="u"><figcaption><span class="ttl">Dijkstra lab: run it one step at a time</span><span class="cap">Both slide examples are built in (choose the graph), plus a four-router practice graph and your own graph. The table is the exact exam format: D(v), p(v) per step, with the chosen node in bold.</span></figcaption></figure>
<div class="example"><p class="ex-q"><span class="chip hot">IA-2 Q1</span> Slide example 2: find the least-cost paths from u (links u–v 2, u–x 1, u–w 5, v–x 2, v–w 3, x–w 3, x–y 1, w–y 1, w–z 5, y–z 2).</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Step</th><th>N′</th><th class="mono">D(v),p(v)</th><th class="mono">D(w),p(w)</th><th class="mono">D(x),p(x)</th><th class="mono">D(y),p(y)</th><th class="mono">D(z),p(z)</th></tr></thead><tbody>
<tr><td class="num">0</td><td class="mono">u</td><td class="mono">2,u</td><td class="mono">5,u</td><td class="mono"><b>1,u</b></td><td class="mono">∞</td><td class="mono">∞</td></tr>
<tr><td class="num">1</td><td class="mono">ux</td><td class="mono">2,u</td><td class="mono">4,x</td><td></td><td class="mono"><b>2,x</b></td><td class="mono">∞</td></tr>
<tr><td class="num">2</td><td class="mono">uxy</td><td class="mono"><b>2,u</b></td><td class="mono">3,y</td><td></td><td></td><td class="mono">4,y</td></tr>
<tr><td class="num">3</td><td class="mono">uxyv</td><td></td><td class="mono"><b>3,y</b></td><td></td><td></td><td class="mono">4,y</td></tr>
<tr><td class="num">4</td><td class="mono">uxyvw</td><td></td><td></td><td></td><td></td><td class="mono"><b>4,y</b></td></tr>
<tr><td class="num">5</td><td class="mono">uxyvwz</td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody></table></div>
<ol class="steps"><li>Ties (v and y both 2 at step 1) can be broken arbitrarily; the slide picks y first.</li><li>Trace predecessors to build the shortest-path tree: v ← u; x ← u; y ← x; w ← y; z ← y.</li></ol>
<p class="ex-a">Forwarding table of u: v → (u,v); x, y, w, z → (u,x). Costs: v 2, x 1, y 2, w 3, z 4</p></div>
<div class="example"><p class="ex-q">Slide example 1: links u–w 3, u–x 5, u–v 7, w–x 4, w–v 3, w–y 8, x–y 7, x–z 9, v–y 4, y–z 2. Source u.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Step</th><th>N′</th><th class="mono">D(v),p(v)</th><th class="mono">D(w),p(w)</th><th class="mono">D(x),p(x)</th><th class="mono">D(y),p(y)</th><th class="mono">D(z),p(z)</th></tr></thead><tbody>
<tr><td class="num">0</td><td class="mono">u</td><td class="mono">7,u</td><td class="mono"><b>3,u</b></td><td class="mono">5,u</td><td class="mono">∞</td><td class="mono">∞</td></tr>
<tr><td class="num">1</td><td class="mono">uw</td><td class="mono">6,w</td><td></td><td class="mono"><b>5,u</b></td><td class="mono">11,w</td><td class="mono">∞</td></tr>
<tr><td class="num">2</td><td class="mono">uwx</td><td class="mono"><b>6,w</b></td><td></td><td></td><td class="mono">11,w</td><td class="mono">14,x</td></tr>
<tr><td class="num">3</td><td class="mono">uwxv</td><td></td><td></td><td></td><td class="mono"><b>10,v</b></td><td class="mono">14,x</td></tr>
<tr><td class="num">4</td><td class="mono">uwxvy</td><td></td><td></td><td></td><td></td><td class="mono"><b>12,y</b></td></tr>
<tr><td class="num">5</td><td class="mono">uwxvyz</td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody></table></div>
<p class="ex-a">Paths from u: w 3 (u–w), x 5 (u–x), v 6 (u–w–v), y 10 (u–w–v–y), z 12 (u–w–v–y–z)</p></div>
<details class="solution"><summary>Practice: four-router graph A–E (A–B 2, A–C 5, B–C 1, B–D 4, C–D 2, C–E 6, D–E 3). Find the least-cost tree of A.</summary><div class="body">
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Step</th><th>N′</th><th class="mono">D(B)</th><th class="mono">D(C)</th><th class="mono">D(D)</th><th class="mono">D(E)</th></tr></thead><tbody>
<tr><td class="num">0</td><td class="mono">A</td><td class="mono"><b>2,A</b></td><td class="mono">5,A</td><td class="mono">∞</td><td class="mono">∞</td></tr>
<tr><td class="num">1</td><td class="mono">AB</td><td></td><td class="mono"><b>3,B</b></td><td class="mono">6,B</td><td class="mono">∞</td></tr>
<tr><td class="num">2</td><td class="mono">ABC</td><td></td><td></td><td class="mono"><b>5,C</b></td><td class="mono">9,C</td></tr>
<tr><td class="num">3</td><td class="mono">ABCD</td><td></td><td></td><td></td><td class="mono"><b>8,D</b></td></tr>
<tr><td class="num">4</td><td class="mono">ABCDE</td><td></td><td></td><td></td><td></td></tr>
</tbody></table></div>
<p>Tree: A–B (2), B–C (3), C–D (5), D–E (8). Every destination leaves A through B. Check it in the lab with the "Four routers A–E" graph.</p></div></details>
<div class="note remember"><b class="tag">Complexity</b><p>Each iteration must check all nodes w not in N′: n(n + 1)/2 comparisons, so <b>O(n<sup>2</sup>)</b>. Link-state also needs O(nE) messages to flood the LSPs.</p></div>
</section>

<section class="topic" id="c11-dv">
<h2>Distance-vector routing and the Bellman-Ford equation</h2>
<p>In distance-vector routing, each node first creates its own least-cost tree with the rudimentary information it has about its <b>immediate neighbours</b>. These incomplete trees are exchanged between neighbours until they represent the whole internet. A router continuously tells all its neighbours what it knows about the whole internet (even if that knowledge is incomplete).</p>
<h3 id="c11-bf">The Bellman-Ford equation</h3>
<div class="formula"><code class="f">d<sub>x</sub>(y) = min<sub>v</sub> { c(x,v) + d<sub>v</sub>(y) }</code><span class="where">d<sub>x</sub>(y) = cost of the least-cost path from x to y; the minimum is taken over all neighbours v of x; c(x,v) = cost to neighbour v; d<sub>v</sub>(y) = cost from neighbour v to the destination y. The neighbour achieving the minimum is the <b>next hop</b>, used in the forwarding table.</span></div>
<div class="formula"><code class="f">D<sub>xy</sub> = min { D<sub>xy</sub>, (c<sub>xz</sub> + D<sub>zy</sub>) }</code><span class="where">The form used to update an existing least cost when a cheaper path through an intermediary node z is found (complete notes). The equation builds new least-cost paths from previously established ones.</span></div>
<div class="example"><p class="ex-q"><span class="chip hot">IA-2 Q1</span> In slide example 2, d<sub>v</sub>(z) = 5, d<sub>x</sub>(z) = 3 and d<sub>w</sub>(z) = 3. u's neighbours are v (cost 2), x (cost 1) and w (cost 5). Find d<sub>u</sub>(z).</p><ol class="steps">
  <li>d<sub>u</sub>(z) = min { c(u,v) + d<sub>v</sub>(z), c(u,x) + d<sub>x</sub>(z), c(u,w) + d<sub>w</sub>(z) }</li>
  <li>= min { 2 + 5, 1 + 3, 5 + 3 } = min { 7, 4, 8 }</li>
</ol><p class="ex-a">d<sub>u</sub>(z) = 4, and the next hop towards z is x</p></div>
<h3 id="c11-vectors">Distance vectors</h3>
<p>A least-cost tree is a combination of least-cost paths glued together. Distance-vector routing "unglues" them into a <b>distance vector</b>: a one-dimensional array in which the <b>name</b> of the vector is the root, the <b>indexes</b> are the destinations and each <b>cell</b> is the least cost from the root to that destination. It gives only the least costs, not the paths.</p>
<ul>
  <li>When booted, each node sends greeting messages to discover its immediate neighbours and the distance to each, puts these in its vector and leaves the other cells at <b>infinity</b>.</li>
  <li>These rudimentary vectors cannot forward packets well (A thinks it is not connected to G). So each node sends a copy of its vector to all immediate neighbours; a node receiving a neighbour's vector updates its own using the Bellman-Ford equation.</li>
</ul>
<p>In the slides' notation, node x keeps its own distance vector D<sub>x</sub> = [D<sub>x</sub>(y): y ∈ N], knows the cost c(x,v) to each neighbour, and keeps each neighbour's vector D<sub>v</sub>. From time to time each node sends its vector to its neighbours; when x receives a new vector it updates:</p>
<div class="formula"><code class="f">D<sub>x</sub>(y) ← min<sub>v</sub> { c(x,v) + D<sub>v</sub>(y) }   for each node y ∈ N</code></div>
<div class="duo">
  <div class="card"><h4>Iterative and asynchronous</h4><p>Each local iteration is caused by a <b>local link-cost change</b> or a <b>DV update message</b> from a neighbour.</p></div>
  <div class="card"><h4>Distributed</h4><p>Each node notifies its neighbours <b>only when its DV changes</b>; they then notify their neighbours if necessary. Each node: wait → recompute → if the DV changed, notify neighbours.</p></div>
</div>
<figure class="lab" data-widget="dv" data-graph="xyz"><figcaption><span class="ttl">Distance-vector lab: watch the tables converge</span><span class="cap">Each "exchange" sends every node's vector to its neighbours and applies Bellman-Ford. Switch to the link-cost-change scenarios to see good news and bad news travel.</span></figcaption></figure>
<div class="example"><p class="ex-q">Slide example: three nodes with c(x,y) = 2, c(y,z) = 1, c(x,z) = 7. Show the distance tables after the first exchange.</p><ol class="steps">
  <li>Initially each node knows only its own links: D<sub>x</sub> = [0, 2, 7], D<sub>y</sub> = [2, 0, 1], D<sub>z</sub> = [7, 1, 0] (order x, y, z)</li>
  <li>At x: D<sub>x</sub>(y) = min { c(x,y) + D<sub>y</sub>(y), c(x,z) + D<sub>z</sub>(y) } = min { 2 + 0, 7 + 1 } = 2</li>
  <li>At x: D<sub>x</sub>(z) = min { c(x,y) + D<sub>y</sub>(z), c(x,z) + D<sub>z</sub>(z) } = min { 2 + 1, 7 + 0 } = <b>3</b> (via y)</li>
  <li>At z: D<sub>z</sub>(x) = min { c(z,x) + D<sub>x</sub>(x), c(z,y) + D<sub>y</sub>(x) } = min { 7 + 0, 1 + 2 } = <b>3</b> (via y)</li>
  <li>At y nothing changes: D<sub>y</sub>(x) = min { 2, 1 + 7 } = 2 and D<sub>y</sub>(z) = min { 1, 2 + 7 } = 1</li>
  <li>x and z changed, so they send their new vectors; the next exchange changes nothing, so the algorithm is quiet</li>
</ol><p class="ex-a">Final: D<sub>x</sub> = [0, 2, 3], D<sub>y</sub> = [2, 0, 1], D<sub>z</sub> = [3, 1, 0]</p></div>
<details class="solution"><summary>Practice: in the four-router graph (A–B 2, A–C 5, B–C 1, B–D 4, C–D 2, C–E 6, D–E 3), B reports d<sub>B</sub>(E) = 6 and C reports d<sub>C</sub>(E) = 5. Find d<sub>A</sub>(E) and the next hop.</summary><div class="body"><p>d<sub>A</sub>(E) = min { c(A,B) + d<sub>B</sub>(E), c(A,C) + d<sub>C</sub>(E) } = min { 2 + 6, 5 + 5 } = <b>8</b>, next hop <b>B</b>. This agrees with Dijkstra's answer above (A–B–C–D–E, cost 8).</p></div></details>
</section>

<section class="topic" id="c11-cti">
<h2>Count to infinity, split horizon and poison reverse</h2>
<p>In distance-vector routing, a <b>decrease in cost (good news) propagates quickly</b>, but an <b>increase in cost (bad news) propagates slowly</b>. If a link breaks (cost becomes infinity), every router should know immediately, but in DV routing this takes several updates. This is the <b>count-to-infinity</b> problem.</p>
<div class="duo">
  <div class="card"><h4>Good news travels fast (slides)</h4><p>c(x,y) changes 4 → 1. At t<sub>0</sub> y detects the change, updates its DV and informs its neighbours. At t<sub>1</sub> z receives y's update, computes its new least cost to x and sends its DV. At t<sub>2</sub> y receives z's update; its least costs do not change, so it sends nothing.</p></div>
  <div class="card"><h4>Bad news travels slowly</h4><p>c(x,y) changes 4 → 60 (with c(x,z) = 50). y still believes z can reach x for 5, so it routes through z (cost 6); z then routes through y (cost 7), and so on: the costs climb 1 or 2 at a time. It takes <b>44 iterations</b> before the algorithm stabilises.</p></div>
</div>
<h3 id="c11-twonode">The two-node loop</h3>
<p>Nodes A and B both know how to reach X: A directly (cost 2), B through A (cost 4 + 2 = 6). Suddenly the A–X link fails and A sets its cost to X to ∞. If A could send its table to B immediately, all would be fine, but the system becomes unstable if <b>B sends its table to A first</b>:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Moment</th><th>A's route to X</th><th>B's route to X</th></tr></thead><tbody>
<tr><td>Before the failure</td><td>2, direct</td><td>6, via A</td></tr>
<tr><td>After the A–X link fails</td><td>∞</td><td>6, via A</td></tr>
<tr><td>A receives B's table (assumes B found a way)</td><td>4 + 6 = 10, via B</td><td>6, via A</td></tr>
<tr><td>B receives A's table</td><td>10, via B</td><td>4 + 10 = 14, via A</td></tr>
<tr><td>… and so on</td><td>grows until ∞</td><td>grows until ∞</td></tr>
</tbody></table></div>
<h3 id="c11-split">Split horizon</h3>
<p>Instead of flooding its whole table through each interface, a node sends only <b>part of its table</b> through each interface. If B's best route to X goes via A, B does not advertise that route to A: the information came from A, and taking information from A, modifying it and sending it back to A is what creates the confusion. A then keeps ∞, and when A sends its table to B, B corrects its own: the system is stable after the first update.</p>
<h3 id="c11-poison">Poison reverse</h3>
<p>Split horizon has a drawback: protocols use timers and delete a route when there is no news about it. When B leaves X out of its advertisement to A, A cannot tell whether this is due to split horizon or because B has heard nothing about X recently. With <b>poison reverse</b>, B still advertises X, but with <b>distance infinity</b> as a warning: "do not use this value; what I know about this route comes from you." In the slides' words: if z routes through y to get to x, z tells y that its distance to x is infinite, so y will not route to x via z.</p>
<div class="note warn"><b class="tag">Three-node instability</b><p>Split horizon combined with poison reverse removes the <b>two-node</b> instability. If the instability is among <b>three nodes</b>, stability cannot be guaranteed. (The slides ask the same: will poisoned reverse completely solve count to infinity? No.)</p></div>
</section>

<section class="topic" id="c11-compare">
<h2>Link state versus distance vector</h2>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Aspect</th><th>Link state (LS)</th><th>Distance vector (DV)</th></tr></thead><tbody>
<tr><td>Who talks to whom</td><td>Each router tells the <b>whole internet</b> about its <b>neighbours</b></td><td>Each router tells its <b>neighbours</b> about the <b>whole internet</b></td></tr>
<tr><td>Information</td><td>Global: complete topology (LSDB) at every node</td><td>Decentralized: own links plus neighbours' vectors</td></tr>
<tr><td>Message complexity</td><td>n nodes, E links: O(nE) messages sent</td><td>Exchanges between neighbours only; convergence time varies</td></tr>
<tr><td>Speed of convergence</td><td>O(n<sup>2</sup>) algorithm requiring O(nE) messages; may have oscillations</td><td>Convergence time varies; may have routing loops; count-to-infinity problem</td></tr>
<tr><td>Robustness (router malfunctions)</td><td>A node can advertise an incorrect <b>link</b> cost, but each node computes only its <b>own</b> table</td><td>A node can advertise an incorrect <b>path</b> cost; each node's table is used by others, so errors <b>propagate</b> through the network</td></tr>
<tr><td>Algorithm</td><td>Dijkstra</td><td>Bellman-Ford</td></tr>
<tr><td>Protocol</td><td>OSPF</td><td>RIP</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c11-pv">
<h2>Path-vector routing</h2>
<p>Both LS and DV routing aim at least cost. Sometimes that is not the priority: a sender may want to <b>prevent its packets from passing through certain routers</b>, or the goal may simply be <b>reachability</b>. Least-cost routing does not let a sender apply such policies. <b>Path-vector (PV) routing</b> is not based on least cost: the best route is decided by the source using the <b>policy</b> it imposes, so the source controls the path. It is mostly designed to route packets <b>between ISPs</b>.</p>
<h3 id="c11-spanning">Spanning trees</h3>
<p>The path from a source to all destinations is the best <b>spanning tree</b>, but this is the tree chosen by the source's policy, not the least-cost tree. A source may apply several policies at once. Common ones:</p>
<ul><li>Use the <b>minimum number of nodes</b> to be visited.</li><li><b>Avoid some nodes</b> as middle nodes (e.g. A and E avoid D; B avoids C).</li></ul>
<h3 id="c11-pvcreate">Creating the spanning trees</h3>
<p>Like DV, PV routing is <b>asynchronous and distributed</b>. At boot each node builds a path vector from its immediate neighbours and sends it to them. On receiving a neighbour's path vector, a node updates its own with an equation like Bellman-Ford but applying its policy instead of the least cost:</p>
<div class="formula"><code class="f">Path(x, y) = best { Path(x, y), (x + Path(v, y)) }   for all neighbours v</code><span class="where">"best" is defined by the policy. One more rule: if Path(v, y) already includes x, it is discarded, to avoid a loop (x does not want to visit itself).</span></div>
<p>For example, node C receives B's vector, which improves its own (now it knows how to reach A); then it receives D's vector, which changes nothing. C's vector is then stable and serves as its forwarding table.</p>
</section>

<section class="topic" id="c11-hier">
<h2>Hierarchical routing and autonomous systems</h2>
<p>So far all routers were identical and the network "flat". This is not true in practice, for two reasons:</p>
<div class="duo">
  <div class="card"><h4>Scale</h4><p>With hundreds of millions of destinations, routers cannot store them all in routing tables, and exchanging routing tables would swamp the links. Searching huge tables is slow and updating them creates huge traffic.</p></div>
  <div class="card"><h4>Administrative autonomy</h4><p>The Internet is a network of networks; each network admin (each ISP) may want to control routing in its own network.</p></div>
</div>
<h3 id="c11-structure">Internet structure</h3>
<p>The Internet changed from a tree with a single backbone to a <b>multi-backbone</b> structure run by private corporations: <b>backbones</b> connected by <b>peering points</b>; below them <b>provider networks</b> that use the backbones for global connectivity and serve customers; and <b>customer networks</b>. Any of these can be called an ISP.</p>
<h3 id="c11-as">Autonomous systems</h3>
<p>Hierarchical routing treats <b>each ISP as an autonomous system (AS)</b>. Each AS can run the routing protocol that meets its needs, while the global Internet runs a global protocol that glues the ASs together. Each AS gets an <b>autonomous number (ASN)</b> from ICANN, a <b>16-bit</b> unsigned integer. ASs are classified by how they connect, not by size:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Type</th><th>Connections</th><th>Transit traffic?</th><th>Example</th></tr></thead><tbody>
<tr><td><b>Stub AS</b></td><td>Only one connection to another AS</td><td>No: traffic is only initiated or terminated here</td><td>A customer network (source or sink of data)</td></tr>
<tr><td><b>Multihomed AS</b></td><td>More than one connection to other ASs</td><td>No: its policy does not let data pass through</td><td>A customer using more than one provider</td></tr>
<tr><td><b>Transient AS</b></td><td>More than one connection</td><td>Yes: traffic passes through</td><td>Provider networks and backbones</td></tr>
</tbody></table></div>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Inside one AS</th><th>Between ASs</th></tr></thead><tbody>
<tr><td><b>Intra-AS</b> routing protocol = intradomain protocol = <b>interior gateway protocol (IGP)</b></td><td><b>Inter-AS</b> routing protocol = interdomain protocol = <b>exterior gateway protocol (EGP)</b></td></tr>
<tr><td>All routers in the same AS run the same intra-AS protocol; different ASs may run different ones. Common: <b>RIP</b>, <b>OSPF</b> (and IGRP, Cisco proprietary)</td><td>The only one in use is <b>BGP</b></td></tr>
</tbody></table></div>
<p>A <b>gateway router</b> sits at the edge of its own AS and has a link to a router in another AS. The <b>forwarding table</b> is configured by both protocols: intra-AS routing sets the entries for internal destinations; inter-AS and intra-AS together set the entries for external destinations.</p>
<h3 id="c11-interas">Inter-AS tasks and hot-potato routing</h3>
<p>Suppose a router in AS1 receives a datagram destined outside AS1. It should forward it to a gateway router, but which one? AS1 must (1) <b>learn which destinations are reachable</b> through AS2 and which through AS3, and (2) <b>propagate this reachability information</b> to all routers in AS1. This is the job of inter-AS routing.</p>
<ul>
  <li><b>One way out:</b> AS1 learns that subnet x is reachable via AS3 (gateway 1c) but not via AS2. Router 1d finds from intra-AS routing that its interface I is on the least-cost path to 1c, and installs the forwarding entry (x, I).</li>
  <li><b>Several ways out:</b> if x is reachable via both AS3 and AS2, router 1d must choose a gateway. With <b>hot-potato routing</b> it sends the packet towards the <b>closest</b> of the two gateways: learn from the inter-AS protocol that x is reachable via several gateways → use intra-AS information to find the least-cost path to each → choose the gateway with the smallest least cost → enter (x, I) in the forwarding table.</li>
</ul>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Why different intra- and inter-AS routing?</th><th>Inter-AS</th><th>Intra-AS</th></tr></thead><tbody>
<tr><td>Policy</td><td>The admin wants control over how its traffic is routed and who routes through its network</td><td>Single admin, so no policy decisions are needed</td></tr>
<tr><td>Scale</td><td colspan="2">Hierarchical routing saves table size and reduces update traffic</td></tr>
<tr><td>Performance</td><td>Policy may dominate over performance</td><td>Can focus on performance</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c11-rip">
<h2>RIP: Routing Information Protocol</h2>
<p>RIP is one of the most widely used <b>intra-domain</b> routing protocols, based on the <b>distance-vector</b> algorithm. It was included in the BSD-UNIX distribution in 1982.</p>
<h3 id="c11-hops">Hop count</h3>
<ul>
  <li>RIP routers advertise the cost of reaching <b>networks (subnets)</b>, not nodes of a theoretical graph.</li>
  <li>To keep the cost independent of delay, bandwidth and so on, the cost is the <b>number of hops</b>: the number of networks (subnets) a packet travels through from the source router to the final destination host. Each link has cost 1.</li>
  <li>The maximum cost of a path is <b>15</b>; <b>16 means infinity</b> (no connection). RIP can therefore be used only in ASs whose diameter is at most 15 hops.</li>
</ul>
<h3 id="c11-ripfwd">Forwarding tables</h3>
<p>A RIP forwarding table has three columns: <b>destination network</b>, <b>next router</b> and <b>cost in hops</b>. The first and third columns together carry the same information as a distance vector. Although the table names only the next router, the tables together give the whole least-cost tree (R1 → R2 → R3 → N4). The third column is not needed for forwarding, but it is needed for <b>updating</b> the table when a route changes.</p>
<div class="example"><p class="ex-q">Slide example: router D's table has w via A (2 hops), y via B (2), z via B (7) and x directly (1). D receives an advertisement from A: w 1, x 1, z 4 (via C). What changes?</p><ol class="steps">
  <li>D adds one hop for itself to every received cost: w 2, x 2, z 5, all via A</li>
  <li>w: received 2 = old 2, so no change; x: received 2 &gt; old 1, so no change</li>
  <li>z: received 5 &lt; old 7 → <b>new route: z via A, 5 hops</b></li>
</ol><p class="ex-a">D's table: w A 2 · y B 2 · z A 5 · x – 1</p></div>
<h3 id="c11-ripimpl">Implementation and messages</h3>
<ul>
  <li>RIP is a process using <b>UDP</b> on the well-known <b>port 520</b>. In BSD it is a daemon named <b>routed</b> (route daemon). So although RIP helps IP route datagrams through the AS, RIP messages are carried inside UDP user datagrams inside IP datagrams: <b>RIP runs at the application layer</b> but creates forwarding tables for IP.</li>
  <li>Two versions: RIP-1 and RIP-2 (backward compatible; uses fields that were 0 in RIP-1). A message has <b>entries</b>, each carrying one line of the sender's forwarding table.</li>
  <li><b>Request</b> messages are sent by a router that has just come up or has timed-out entries; they can ask for specific entries or all.</li>
  <li><b>Response (update)</b> messages are <b>solicited</b> (answer to a request) or <b>unsolicited</b> (sent periodically, <b>every 30 seconds</b>, or when the table changes). Each advertisement lists up to <b>25 destination subnets</b>.</li>
</ul>
<h3 id="c11-ripalgo">RIP algorithm</h3>
<p>RIP uses DV with changes: a router sends the <b>whole forwarding table</b>, not just a distance vector. The receiver adds one hop to each cost and sets the next router to the sender (the "received routes"). It keeps its old routes except in three cases:</p>
<ol>
  <li>The received route does <b>not exist</b> in the old table → add it.</li>
  <li>The received route has a <b>lower cost</b> → select it.</li>
  <li>The received route has a <b>higher cost</b> but the <b>same next router</b> → select it (the route really changed at its source).</li>
</ol>
<p>The new table is sorted by destination (mostly longest prefix first).</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>RIP timer</th><th>Value</th><th>Purpose</th></tr></thead><tbody>
<tr><td><b>Periodic</b></td><td>Random, 25–35 s</td><td>Controls regular update messages; random so routers do not all send at the same time</td></tr>
<tr><td><b>Expiration</b></td><td>180 s per route</td><td>Reset by every update for that route; if no update arrives in 180 s the route expires and its hop count is set to 16 (unreachable)</td></tr>
<tr><td><b>Garbage collection</b></td><td>120 s</td><td>An invalid route is still advertised with metric 16 for 120 s, so neighbours learn it is invalid, then it is purged</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>Link failure (slides)</h4><p>If no advertisement is heard after 180 s, the neighbour or link is declared dead; routes via it are invalidated, new advertisements go to neighbours, and they in turn send new advertisements if their tables changed. Poison reverse prevents ping-pong loops (infinite distance = 16 hops).</p></div>
  <div class="card"><h4>Performance</h4><p><b>Update messages</b> are simple and local. <b>Convergence</b> can be slow in a large domain, but with at most 15 hops it is normally fine; count to infinity and loops are eased by split horizon and poison reverse. <b>Robustness</b> is weak: a failure or corruption in one router propagates to all routers.</p></div>
</div>
</section>

<section class="topic" id="c11-ospf">
<h2>OSPF: Open Shortest Path First</h2>
<p>OSPF is also an <b>intra-domain</b> protocol, but based on the <b>link-state</b> algorithm. It is <b>open</b>: its specification is a public document. Every router gets the topology map through LS packet dissemination and computes routes with <b>Dijkstra's algorithm</b>. An OSPF advertisement carries one entry per neighbour and is <b>flooded to the entire AS</b>, carried in OSPF messages <b>directly over IP</b> (not TCP or UDP), with protocol field <b>89</b>.</p>
<h3 id="c11-metric">Metric and forwarding tables</h3>
<p>The cost is calculated from the source router to the destination <b>network</b>. Each link can be given a weight based on throughput, round-trip time, reliability and so on, or the administrator can use the hop count. Different service types (TOS) can have different costs. Each router builds its forwarding table from its shortest-path tree. With hop count as the cost, OSPF and RIP tables in the same AS would be exactly the same, because both use shortest-path trees.</p>
<h3 id="c11-areas">Areas</h3>
<p>Flooding LSPs through a large AS creates a huge volume of traffic, so the AS is divided into <b>areas</b>. Each area is a small independent domain for flooding LSPs: a second level of hierarchy (first the AS, then the area). Since routers also need link-state information about other areas, one area is the <b>backbone area</b> (area identification <b>0</b>), which glues the areas together and passes each area's information to all others.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Hierarchical OSPF (slides)</th><th>Role</th></tr></thead><tbody>
<tr><td>Two-level hierarchy</td><td>Local area and backbone. Link-state advertisements stay in the area; each node has the detailed topology of its area and only knows the direction (shortest path) to networks in other areas.</td></tr>
<tr><td><b>Area border routers</b></td><td>"Summarize" distances to the networks in their own area and advertise them to other area border routers</td></tr>
<tr><td><b>Backbone routers</b></td><td>Run OSPF routing limited to the backbone</td></tr>
<tr><td><b>Boundary routers</b></td><td>Connect to other ASs</td></tr>
<tr><td>Internal routers</td><td>Routers entirely inside one area</td></tr>
</tbody></table></div>
<h3 id="c11-lsa">Link-state advertisements</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>LSA type</th><th>Sent by and meaning</th></tr></thead><tbody>
<tr><td><b>Router link</b></td><td>A router advertises itself as a node, with its links: <b>transient</b> link (to a transient network, connected to the rest by one or more routers: network address and cost), <b>stub</b> link (to a stub network, not a through network: address and cost) and <b>point-to-point</b> link (address of the router at the other end and cost).</td></tr>
<tr><td><b>Network link</b></td><td>Advertises a network as a node. A network is passive, so a <b>designated router</b> advertises for it, listing the IP addresses of all its routers; no cost is advertised.</td></tr>
<tr><td><b>Summary link to network</b></td><td>By an area border router: summary of links collected by the backbone to an area, or by an area to the backbone. Glues the areas together.</td></tr>
<tr><td><b>Summary link to AS</b> (border router)</td><td>By an AS router: summary links from other ASs to the backbone of this AS, to be passed on to the areas.</td></tr>
<tr><td><b>External link</b></td><td>By an AS router: announces a single network outside the AS to the backbone area.</td></tr>
</tbody></table></div>
<h3 id="c11-ospfmsg">Messages, authentication and performance</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Type</th><th>OSPF message</th><th>Purpose</th></tr></thead><tbody>
<tr><td class="num">1</td><td><b>Hello</b></td><td>A router introduces itself to its neighbours and announces all neighbours it already knows</td></tr>
<tr><td class="num">2</td><td><b>Database description</b></td><td>Sent in response to hello so a newly joined router can acquire the full LSDB</td></tr>
<tr><td class="num">3</td><td><b>Link-state request</b></td><td>Asks for information about a specific link state</td></tr>
<tr><td class="num">4</td><td><b>Link-state update</b></td><td>The main message for building the LSDB, in five versions (router, network, summary to network, summary to AS border router, external)</td></tr>
<tr><td class="num">5</td><td><b>Link-state acknowledgment</b></td><td>Makes OSPF reliable: every received update must be acknowledged</td></tr>
</tbody></table></div>
<ul>
  <li><b>Authentication</b>: the common header provides for authenticating the sender, so a malicious entity cannot make a router join a routing system it does not belong to (slides: all OSPF messages authenticated, for security).</li>
  <li><b>Advanced features not in RIP</b> (slides): security; <b>multiple same-cost paths</b> allowed (only one path in RIP); for each link, <b>multiple cost metrics for different TOS</b> (e.g. a satellite link "low" for best effort, high for real time); integrated unicast and multicast support (<b>MOSPF</b> uses the same topology database); hierarchical OSPF in large domains.</li>
  <li><b>Performance</b>: update messages are complex and flooded to the whole area (heavy traffic in large areas); convergence is fairly quick once flooding completes, though each router must run Dijkstra; <b>more robust than RIP</b>, since after receiving the complete LSDB each router is independent.</li>
</ul>
</section>

<section class="topic" id="c11-bgp">
<h2>BGP: Border Gateway Protocol (version 4)</h2>
<p>BGP4 is the <b>only inter-domain routing protocol</b> used in the Internet today, "the glue that holds the Internet together". It is based on the <b>path-vector</b> algorithm, tailored to provide information about the <b>reachability</b> of networks. BGP gives each AS a way to:</p>
<ul>
  <li><b>eBGP</b>: obtain subnet reachability information from neighbouring ASs;</li>
  <li><b>iBGP</b>: propagate that reachability information to all routers inside the AS;</li>
  <li>determine "good" routes to other networks based on reachability information and <b>policy</b>;</li>
  <li>let a subnet advertise its existence to the rest of the Internet: "I am here".</li>
</ul>
<figure class="lab lab-3d" data-scene="journey" data-mode="bgp" data-lock="1"><figcaption><span class="ttl">BGP in motion: eBGP, iBGP and a growing AS-PATH</span><span class="cap">AS3 advertises prefix x to AS1, AS1 spreads it inside with iBGP and re-advertises it to AS2, then a datagram from 1d follows the learned route.</span></figcaption></figure>
<h3 id="c11-ebgp">External BGP (eBGP)</h3>
<p>BGP is point-to-point. Two routers running it create a <b>TCP connection on well-known port 179</b> and exchange messages; they are <b>BGP peers</b> or <b>BGP speakers</b>, and each logical connection is a <b>session</b>. eBGP pairs physically connected border routers of two different ASs. In the notes' example (AS1 transient; AS2, AS3, AS4 stubs), the pairs R1–R5, R2–R6 and R4–R9 form three sessions over the WANs N5, N6 and N7. Message 1 from R1 tells R5 that N1, N2, N3 and N4 can be reached through R1.</p>
<p>When AS3 advertises a prefix to AS1, AS3 <b>promises</b> it will forward datagrams towards that prefix, and it can <b>aggregate</b> prefixes in its advertisement. eBGP alone leaves two problems: some border routers do not know how to reach non-neighbour ASs (R5 knows nothing of AS3 and AS4), and <b>no non-border router</b> knows how to reach other ASs.</p>
<h3 id="c11-ibgp">Internal BGP (iBGP)</h3>
<p>iBGP also uses TCP port 179, but creates a session between <b>every possible pair of routers inside an AS</b>. An AS with a single router has no iBGP session; an AS with n routers needs <b>n(n − 1)/2</b> sessions (a full mesh) to prevent loops. Each router advertises its own reachability to its peer instead of flooding what it receives from another session. A session is an overlay (TCP connection) that may span several physical networks, as dictated by the intradomain protocol. Border routers therefore run three protocols (intradomain, eBGP, iBGP); other routers run two (intradomain, iBGP).</p>
<h3 id="c11-inject">Injecting BGP information into intradomain routing</h3>
<ul>
  <li>BGP's path tables are not used directly for forwarding; they are <b>injected into the intradomain forwarding tables</b> (RIP or OSPF).</li>
  <li><b>Stub AS</b>: its only border router adds a <b>default entry</b> whose next router is the speaker at the other end of the eBGP connection.</li>
  <li><b>Transient AS</b>: each border router injects the whole contents of its path table. The cost to foreign networks can be set to the cost of reaching the first AS in the path.</li>
  <li><b>Address aggregation</b> keeps tables small: 14.18.20.0/26, 14.18.20.64/26, 14.18.20.128/26 and 14.18.20.192/26 combine into <b>14.18.20.0/24</b> if all four are reached through one path; the longest-prefix rule handles exceptions.</li>
</ul>
<h3 id="c11-attrib">Path attributes</h3>
<p>An advertised prefix carries BGP attributes: <b>prefix + attributes = "route"</b>. Up to seven attributes exist, either <b>well-known</b> (recognised by all routers; mandatory or discretionary) or <b>optional</b> (transitive, passed to the next AS, or intransitive). The first byte holds four attribute flags, the next the attribute type, then the value length and the value.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th class="num">Type</th><th>Attribute</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="num">1</td><td><b>ORIGIN</b></td><td>Well-known mandatory: source of the routing information: 1 = intradomain protocol (RIP or OSPF), 2 = BGP, 3 = unknown</td></tr>
<tr><td class="num">2</td><td><b>AS-PATH</b></td><td>List of ASs through which the destination can be reached (e.g. AS 67, AS 17). A router that finds its own AS in the list drops the path, which <b>prevents loops</b>; also used in route selection</td></tr>
<tr><td class="num">3</td><td><b>NEXT-HOP</b></td><td>The next router to forward to (the specific internal-AS router towards the next-hop AS); helps inject BGP paths into RIP or OSPF</td></tr>
<tr><td class="num">4</td><td><b>MULT-EXIT-DISC</b></td><td>Optional intransitive: discriminates among multiple exit paths to a destination</td></tr>
<tr><td class="num">5</td><td><b>LOCAL-PREF</b></td><td>Set by the administrator by organization policy; preferred routes get a higher value (4-byte unsigned)</td></tr>
<tr><td class="num">6</td><td><b>ATOMIC-AGGREGATE</b></td><td>Defines the destination prefix as a single destination network; no value field (length 0)</td></tr>
<tr><td class="num">7</td><td><b>AGGREGATOR</b></td><td>Optional transitive: the prefix is an aggregate; gives the last AS that aggregated and its router's IP address</td></tr>
</tbody></table></div>
<p>A gateway router receiving a route advertisement uses an <b>import policy</b> to accept or decline it (e.g. "never route through AS x"): <b>policy-based routing</b>.</p>
<h3 id="c11-select">Route selection and messages</h3>
<div class="duo">
  <div class="card"><h4>Choosing among several routes (slides)</h4><ol><li><b>Local preference</b> value: a policy decision</li><li><b>Shortest AS-PATH</b></li><li><b>Closest NEXT-HOP</b> router: hot-potato routing</li><li>Additional criteria</li></ol></div>
  <div class="card"><h4>Four BGP messages (over TCP)</h4><ul><li><b>OPEN</b>: opens the TCP connection to a peer and authenticates the sender</li><li><b>UPDATE</b>: advertises a new path or withdraws an old one (the heart of BGP)</li><li><b>KEEPALIVE</b>: keeps the connection alive without updates (before the hold time expires); also ACKs the OPEN</li><li><b>NOTIFICATION</b>: reports errors in the previous message; also used to close the session</li></ul></div>
</div>
<h3 id="c11-policy">Routing policy (slides)</h3>
<p>A, B and C are provider networks; X, W and Y are customers. X is <b>dual-homed</b> (attached to two providers, B and C). X does not want to carry traffic from B to C, so <b>X will not advertise to B a route to C</b>. Similarly, A advertises path AW to B and B advertises BAW to X, but B should <b>not</b> advertise BAW to C: B gets no revenue for routing CBAW, since neither W nor C is B's customer. B wants to force C to route to W via A, and to route only to and from its own customers.</p>
<div class="note remember"><b class="tag">Performance</b><p>BGP speakers exchange many messages to build forwarding tables, but BGP is <b>free from loops and count to infinity</b>. Like RIP, a failure or corruption still propagates.</p></div>
</section>

<section class="topic" id="c11-mospf">
<h2>Multicast routing: MOSPF</h2>
<p><b>Multicast Open Shortest Path First (MOSPF)</b> is the extension of OSPF (used in unicast routing) to multicasting, using the <b>source-based tree</b> approach. In unicast link-state routing each router has an LSDB to build a shortest-path tree; for multicasting each router also needs a database showing <b>which interface has an active member of a particular group</b>. To forward a multicast packet from source S to group G, a router:</p>
<ol>
  <li>Uses Dijkstra to build a shortest-path tree with <b>S as the root</b> and all destinations as leaves (it can, because the LSDB gives the whole topology). The tree depends on the source: a different tree for each source.</li>
  <li>Finds <b>itself</b> in that tree, creating a shortest-path subtree with itself as root.</li>
  <li>This subtree is a broadcast subtree; the router <b>prunes</b> it into a multicast tree. <b>IGMP</b> provides membership information at the leaf level, and MOSPF adds a new type of link-state update packet that floods membership to all routers.</li>
  <li>Forwards the packet out of <b>only those interfaces</b> that are branches of the multicast tree, so every network with active group members gets a copy and no other network does.</li>
</ol>
</section>

<section class="topic" id="c11-exam">
<h2>Exam corner</h2>
<div class="note exam"><b class="tag">IA-2 important question 1</b><p><b>Problems on Bellman-Ford and Dijkstra.</b> Practise the two slide graphs until you can produce the step table without looking, then use your own graph in the labs to make new problems. Always finish with the shortest-path tree and the forwarding table.</p></div>
<details class="answer"><summary>Explain link-state routing. Apply Dijkstra's algorithm to the given graph. · 10 marks</summary><div class="body"><p>Link state = cost; LSDB as a matrix built by flooding LSPs with sequence numbers; Dijkstra's three steps or the pseudocode; then the step table (N′, D(v), p(v)) for the given graph; the shortest-path tree; the forwarding table; complexity O(n<sup>2</sup>).</p></div></details>
<details class="answer"><summary>Explain distance-vector routing with the Bellman-Ford equation and an example. · 8–10 marks</summary><div class="body"><p>The equation d<sub>x</sub>(y) = min<sub>v</sub>{c(x,v) + d<sub>v</sub>(y)} with labelled terms; distance vectors and initial vectors; exchange with neighbours; iterative, asynchronous, distributed; a worked example such as d<sub>u</sub>(z) = min{2 + 5, 1 + 3, 5 + 3} = 4 or the x, y, z tables.</p></div></details>
<details class="answer"><summary>What is the count-to-infinity problem? Explain split horizon and poison reverse. · 6–8 marks</summary><div class="body"><p>Good news fast, bad news slow (the 4 → 60 example, 44 iterations); the two-node loop table; split horizon (do not send a route back to where it came from); poison reverse (send it back with ∞); three-node instability remains.</p></div></details>
<details class="answer"><summary>Compare link-state and distance-vector routing. · 6 marks</summary><div class="body"><p>Use the comparison table: who talks to whom, global vs decentralized, message complexity, speed of convergence, robustness, algorithm and protocol.</p></div></details>
<details class="answer"><summary>Explain path-vector routing. · 6 marks</summary><div class="body"><p>Why least cost is not always wanted (policy, reachability); spanning trees chosen by policy; initial path vectors; the update equation Path(x, y) = best{Path(x, y), (x + Path(v, y))} and the loop rule; used between ISPs (BGP).</p></div></details>
<details class="answer"><summary>Explain hierarchical routing: autonomous systems, intra- and inter-AS routing. · 6–8 marks</summary><div class="body"><p>Scale and administrative autonomy; Internet structure; AS and ASN; stub, multihomed and transient ASs; IGP vs EGP; gateway routers; inter-AS tasks; hot-potato routing; why intra- and inter-AS routing differ (policy, scale, performance).</p></div></details>
<details class="answer"><summary>Explain RIP: hop count, forwarding table, messages, algorithm and timers. · 8 marks</summary><div class="body"><p>DV based; hop count with 15 maximum and 16 = infinity; three-column table and the role of the cost column; UDP port 520 and routed; request/response every 30 s; the three update cases; periodic, expiration and garbage-collection timers; performance.</p></div></details>
<details class="answer"><summary>Explain OSPF: metric, areas, link-state advertisements and messages. · 8 marks</summary><div class="body"><p>LS based and open; metric per link and per TOS; areas with backbone area 0 and area border, backbone and boundary routers; the five LSA types; the five message types; authentication; advanced features compared with RIP.</p></div></details>
<details class="answer"><summary>Explain BGP: eBGP, iBGP, path attributes and route selection. · 10 marks</summary><div class="body"><p>Path-vector, inter-domain; TCP port 179, speakers and sessions; eBGP between border routers and its two gaps; iBGP full mesh n(n − 1)/2; injection into intradomain tables; aggregation; the seven attributes with AS-PATH and NEXT-HOP in detail; route selection order; the four messages; routing policy example.</p></div></details>
<details class="answer"><summary>Explain multicast routing using MOSPF. · 6 marks</summary><div class="body"><p>Extension of OSPF with a group-membership database; the four steps (source-rooted shortest-path tree, own subtree, prune with IGMP membership information, forward on tree branches only).</p></div></details>
</section>
`,
  quiz: [
    { q: 'In unicast routing, which devices need forwarding tables?', o: ['Only the source host', 'Only the destination host', 'The routers between the networks', 'Every host and router'], a: 2, why: 'Hosts simply use their default router.' },
    { q: 'A routing algorithm in which every router has the complete topology and all link costs is', o: ['Distance vector', 'Link state', 'Path vector', 'Static'], a: 1, why: 'Global information = link state; decentralized = distance vector.' },
    { q: 'In Dijkstra\'s algorithm, N′ is', o: ['The set of all nodes', 'The set of nodes whose least-cost path is definitively known', 'The predecessor of v', 'The cost to v'], a: 1, why: 'Each iteration adds the closest node not yet in N′.' },
    { q: 'The complexity of Dijkstra\'s algorithm with n nodes is', o: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], a: 2, why: 'n(n + 1)/2 comparisons.' },
    { q: 'd_v(z) = 5, d_x(z) = 3, d_w(z) = 3 with c(u,v) = 2, c(u,x) = 1, c(u,w) = 5. d_u(z) is', o: ['3', '4', '7', '8'], a: 1, why: 'min{2 + 5, 1 + 3, 5 + 3} = 4, via x.' },
    { q: 'In distance-vector routing, which kind of news travels slowly?', o: ['A cost decrease', 'A cost increase', 'A new neighbour', 'None'], a: 1, why: 'Bad news causes the count-to-infinity problem.' },
    { q: 'With poison reverse, if z routes to x through y, z tells y that its distance to x is', o: ['0', 'Its real cost', 'Infinity', 'The cost to y'], a: 2, why: 'So y will never route to x via z.' },
    { q: 'Which statement describes link-state routing?', o: ['Each router tells its neighbours what it knows about the whole internet', 'Each router tells the whole internet what it knows about its neighbours', 'The source chooses paths by policy', 'Routers exchange only hop counts'], a: 1, why: 'LSPs about neighbours are flooded to everyone.' },
    { q: 'In path-vector routing, a received path that already contains x is', o: ['Preferred', 'Discarded to avoid a loop', 'Added with cost ∞', 'Forwarded unchanged'], a: 1, why: 'x does not want to visit itself.' },
    { q: 'An AS with more than one connection to other ASs that does not carry transit traffic is', o: ['Stub', 'Multihomed', 'Transient', 'Backbone'], a: 1, why: 'Transient ASs allow traffic through; stub ASs have one connection.' },
    { q: 'In RIP, a hop count of 16 means', o: ['A long but valid path', 'Infinity (unreachable)', 'The maximum allowed diameter', 'A direct link'], a: 1, why: 'The maximum valid cost is 15.' },
    { q: 'RIP messages are carried in', o: ['TCP port 179', 'UDP port 520', 'IP directly, protocol 89', 'UDP port 67'], a: 1, why: 'RIP runs as the routed daemon at the application layer.' },
    { q: 'OSPF messages are carried', o: ['Over TCP', 'Over UDP', 'Directly in IP datagrams (protocol 89)', 'Inside BGP sessions'], a: 2, why: 'OSPF is implemented in the network layer using IP.' },
    { q: 'In OSPF, the backbone area has area identification', o: ['1', '0', '255', 'The ASN'], a: 1, why: 'Area 0 glues the other areas together.' },
    { q: 'BGP peers communicate over', o: ['UDP port 520', 'TCP port 179', 'IP protocol 89', 'TCP port 80'], a: 1, why: 'Semi-permanent TCP connections called sessions.' },
    { q: 'An AS with n routers needs how many iBGP sessions?', o: ['n', 'n − 1', 'n(n − 1)/2', 'n²'], a: 2, why: 'A full mesh, to prevent loops.' },
    { q: 'The BGP attribute that lists the ASs a prefix advertisement has passed through is', o: ['NEXT-HOP', 'ORIGIN', 'AS-PATH', 'LOCAL-PREF'], a: 2, why: 'It also prevents loops.' },
    { q: 'Hot-potato routing sends a packet to', o: ['The gateway with the shortest AS-PATH', 'The closest gateway by intra-AS cost', 'A random gateway', 'The backbone area'], a: 1, why: 'Get the packet out of the AS as cheaply as possible.' }
  ]
});
