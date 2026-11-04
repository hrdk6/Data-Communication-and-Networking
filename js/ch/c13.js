DCN.register({
  id: 'c13', num: 13, part: 'B', layer: 'app', unit: 'Module 5',
  title: 'Application Layer',
  short: 'Application layer',
  summary: 'Client-server, peer-to-peer and hybrid paradigms, sockets and socket programming, the Web and HTTP (persistent connections, messages, cookies, caching), FTP, e-mail (SMTP, POP3, IMAP, MIME), DNS, TELNET and SSH.',
  hot: ['IA-2 Q3', 'IA-2 Q4'],
  sources: ['CN_Module-5_Application Layer.pdf', 'CN module 5 CEC.pdf', 'CN IA-2 imp ques notes.pdf', 'CN_Complete_Notes (Module 5)'],
  keywords: 'application layer client server peer to peer P2P hybrid mixed paradigm Skype BitTorrent instant messaging process socket API socket interface TLI STREAM port number transport requirements data loss throughput timing security elastic socket programming Java TCP client server ServerSocket accept UDP DatagramSocket DatagramPacket iterative listen socket World Wide Web Tim Berners-Lee hypertext hypermedia browser controller interpreter URL protocol host port path static dynamic active documents applet JavaScript HTTP stateless port 80 nonpersistent persistent RTT response time request message response message GET POST HEAD PUT DELETE TRACE OPTIONS CONNECT status codes 200 301 400 404 505 conditional request If-Modified-Since cookies Set-Cookie web caching proxy HTTPS FTP control connection port 21 data connection port 20 PORT USER PASS LIST RETR STOR file type data structure transmission mode stream block compressed email electronic mail user agent MTA MAA mailbox spool SMTP port 25 HELO MAIL FROM RCPT TO DATA QUIT 220 250 354 221 push pull POP3 port 110 delete mode keep mode IMAP4 folders MIME content type content transfer encoding base64 quoted-printable web-based mail PGP S/MIME DNS domain name system resolver name space flat hierarchical domain name space label FQDN PQDN zone root server primary secondary TLD authoritative local name server generic domains country domains recursive iterative resolution caching TTL resource record A NS CNAME MX SOA AAAA DNS message registrar DDNS DNSSEC port 53 TELNET remote login NVT network virtual terminal pseudoterminal SSH SSH-TRANS SSH-AUTH SSH-CONN sftp port forwarding tunnelling',
  html: `
<section class="topic" id="c13-intro">
<h2>The application layer</h2>
<p>The whole Internet, hardware and software, was designed to provide services at the <b>application layer</b>, the fifth layer of TCP/IP; the other four layers exist to make these services possible. The two application layers assume an imaginary direct <b>logical connection</b> through which they exchange messages.</p>
<ul>
  <li>It is the <b>highest layer</b>: its protocols provide services to no other protocol, they only receive services from the transport layer. So protocols can be <b>removed easily</b>, and new ones added as long as they use the services of a transport-layer protocol.</li>
  <li><b>Standard</b> protocols (HTTP, FTP, SMTP, DNS …) are standardized and documented by the Internet authority: each is a pair of programs that interact with the user and the transport layer. <b>Nonstandard</b> (proprietary) protocols can be created by anyone who writes two programs using the transport layer; private use needs no approval, which is what made the Internet so popular.</li>
  <li>To create a network app, write programs that run on (different) <b>end systems</b> and communicate over the network, e.g. web server software talking to browser software. There is no need to write software for <b>network-core devices</b>, which do not run user applications.</li>
</ul>
<p class="small muted">Some network apps (slides): e-mail, web, instant messaging, remote login, P2P file sharing, multi-user network games, streaming stored video, voice over IP, real-time video conferencing, social networking, online games.</p>
</section>

<section class="topic" id="c13-paradigms">
<h2>Application architectures: client-server, P2P and hybrid</h2>
<p>Two application programs, on two computers anywhere in the world, must send messages to each other. Their relationship follows one of these paradigms:</p>
<div class="duo">
  <div class="card"><h4>Client-server</h4><ul><li>An <b>always-on</b> host, the <b>server</b>, provides services when it receives requests from many hosts, the <b>clients</b>.</li><li>The server has a <b>fixed, well-known (permanent) IP address</b>, so a client can always contact it. Server farms (data centers) are used for scaling.</li><li>Clients may be intermittently connected, may have dynamic IP addresses and <b>do not communicate directly</b> with each other.</li><li>Examples: Web, FTP, Telnet, e-mail; search engines, e-commerce, web mail and social networks use data centers.</li></ul></div>
  <div class="card"><h4>Peer-to-peer (P2P)</h4><ul><li><b>No always-on server</b> (minimal dependence on dedicated servers).</li><li>Arbitrary end systems, the <b>peers</b>, communicate <b>directly</b>. They are intermittently connected and change IP addresses.</li><li>Peers are not owned by the service provider: they are desktops and laptops controlled by users, in homes, universities and offices.</li><li><b>Highly scalable but difficult to manage.</b> Examples: file sharing (BitTorrent), Internet telephony (Skype), IPTV.</li></ul></div>
  <div class="card"><h4>Hybrid (mixed)</h4><ul><li>Combines the advantages of both: a light-load client-server exchange finds the address of the peer that offers a service, then the service itself is received peer to peer.</li><li><b>Skype</b>: a voice-over-IP P2P application; a centralized server finds the address of the remote party; the client-client connection is direct.</li><li><b>Instant messaging</b>: chatting between two users is P2P; a centralized service handles presence detection and location (users register their IP address when they come online and look up their buddies' addresses).</li></ul></div>
</div>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Analysis</th><th>Client-server</th><th>Peer-to-peer</th><th>Hybrid</th></tr></thead><tbody>
<tr><td>Who provides the service</td><td>Dedicated server only</td><td>Every peer can request and provide</td><td>Server for lookup, peers for the service</td></tr>
<tr><td>Addressing</td><td>Server has a fixed IP address</td><td>Peers change addresses</td><td>Server keeps track of peers' current addresses</td></tr>
<tr><td>Scalability</td><td>Limited by server capacity; needs data centers</td><td>Self-scaling: every new peer adds capacity</td><td>Good: the server does only light work</td></tr>
<tr><td>Management and control</td><td>Easy, central control</td><td>Difficult: peers come and go</td><td>Moderate</td></tr>
<tr><td>Reliability</td><td>Server is a single point of failure</td><td>No single point of failure, but peers are unreliable</td><td>Depends on the lookup server</td></tr>
<tr><td>Cost</td><td>Provider pays for servers and bandwidth</td><td>Low cost for the provider</td><td>Low</td></tr>
<tr><td>Examples</td><td>Web, FTP, e-mail, Telnet</td><td>BitTorrent, Skype calls, IPTV</td><td>Skype, instant messaging</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c13-process">
<h2>Processes, sockets and transport services</h2>
<p>A <b>process</b> is a program running within a host. Two processes on the same host use inter-process communication defined by the OS; processes on different hosts communicate by <b>exchanging messages</b>. The <b>client process</b> initiates communication; the <b>server process</b> waits to be contacted (applications with P2P architectures have both). The server must be running when a request arrives; the client runs only when needed.</p>
<h3 id="c13-sockets">Sockets and the API</h3>
<p>A process sends and receives messages through a software interface called a <b>socket</b>, analogous to a <b>door</b>: the sending process shoves the message out of the door and relies on the transport infrastructure on the other side to bring it to the receiving process's socket. The app developer controls the application side; the OS controls the transport side (TCP with its buffers and variables). The interface between the application layer and the transport layer is the <b>Application Programming Interface (API)</b>; three common ones are the <b>socket interface</b>, the <b>Transport Layer Interface (TLI)</b> and <b>STREAM</b>. Through the API the developer chooses the transport protocol and can fix a few parameters.</p>
<h3 id="c13-addr">Addressing processes</h3>
<p>Does the host's 32-bit IP address identify the process? <b>No</b>: many processes can run on the same host. The identifier includes both the <b>IP address</b> and the <b>port number</b> of the process: HTTP server port 80, mail server port 25. To send an HTTP message to the gaia.cs.umass.edu web server: IP address 128.119.245.12, port 80. Communication is two-way, so a pair of socket addresses is needed: local and remote.</p>
<h3 id="c13-needs">What transport service does an app need?</h3>
<div class="duo">
  <div class="card"><h4>Data loss</h4><p>Some apps (audio) tolerate some loss; others (file transfer, telnet) need 100% reliable transfer.</p></div>
  <div class="card"><h4>Timing</h4><p>Some apps (Internet telephony, interactive games) need low delay to be "effective".</p></div>
  <div class="card"><h4>Throughput</h4><p>Some (multimedia) need a minimum throughput; <b>elastic</b> apps use whatever throughput they get.</p></div>
  <div class="card"><h4>Security</h4><p>Encryption, data integrity …</p></div>
</div>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Application</th><th>Data loss</th><th>Throughput</th><th>Time sensitive</th></tr></thead><tbody>
<tr><td>File transfer, e-mail, Web documents</td><td>No loss</td><td>Elastic</td><td>No</td></tr>
<tr><td>Real-time audio/video</td><td>Loss-tolerant</td><td>Audio 5 kbps–1 Mbps, video 10 kbps–5 Mbps</td><td>Yes, 100s of ms</td></tr>
<tr><td>Stored audio/video</td><td>Loss-tolerant</td><td>Same as above</td><td>Yes, a few seconds</td></tr>
<tr><td>Interactive games</td><td>Loss-tolerant</td><td>A few kbps up</td><td>Yes, 100s of ms</td></tr>
<tr><td>Instant messaging</td><td>No loss</td><td>Elastic</td><td>Yes and no</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>TCP service</h4><p>Connection-oriented (setup between client and server processes), reliable transport, flow control (the sender will not overwhelm the receiver), congestion control (throttle the sender when the network is overloaded). Does not provide timing, minimum-throughput guarantees or security.</p></div>
  <div class="card"><h4>UDP service</h4><p>Unreliable data transfer between sending and receiving process. Does not provide connection setup, reliability, flow control, congestion control, timing, throughput guarantees or security. (SCTP combines the two: connection-oriented and reliable but message-oriented, with multi-stream service.)</p></div>
</div>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Application</th><th>Application-layer protocol</th><th>Underlying transport</th></tr></thead><tbody>
<tr><td>E-mail</td><td>SMTP [RFC 2821]</td><td>TCP</td></tr>
<tr><td>Remote terminal access</td><td>Telnet [RFC 854]</td><td>TCP</td></tr>
<tr><td>Web</td><td>HTTP [RFC 2616]</td><td>TCP</td></tr>
<tr><td>File transfer</td><td>FTP [RFC 959]</td><td>TCP</td></tr>
<tr><td>Streaming multimedia</td><td>HTTP (e.g. YouTube), RTP [RFC 1889]</td><td>TCP or UDP</td></tr>
<tr><td>Internet telephony</td><td>SIP, RTP, proprietary (e.g. Skype)</td><td>Typically UDP</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c13-socket">
<h2>Socket programming</h2>
<p>Goal: build client-server applications that communicate using sockets. A socket is a host-local, application-created, OS-controlled interface (a "door") through which an application process can both send and receive messages. The socket API offers two transport services: <b>unreliable datagram</b> (UDP) and <b>reliable byte-stream</b> (TCP).</p>
<h3 id="c13-iter">Iterative servers</h3>
<p>An <b>iterative</b> server handles one client request at a time; other requests are queued and served first-in, first-out.</p>
<div class="duo">
  <div class="card"><h4>UDP: one socket each</h4><ul><li><b>Server</b>: passive open; creates an empty socket, <b>binds</b> it to its well-known port (only the server half of the socket address is filled), and issues a <b>receive</b> that blocks until a request arrives. It then fills in the client's address, processes the request, sends the response, clears the client address and loops.</li><li><b>Client</b>: active open; creates an empty socket, <b>sends</b> (which fully fills the socket), <b>receives</b> (blocks until the response arrives), then destroys the socket.</li><li>A client sending two datagrams counts as two clients. The server socket lasts forever; the client socket is destroyed when the client ends.</li></ul></div>
  <div class="card"><h4>TCP: listen socket + one socket per client</h4><ul><li>The server creates a <b>listen socket</b>, binds it to its address and port, and calls <b>listen</b> so the OS can queue incoming connections.</li><li>In a loop it calls <b>accept</b> to take one client from the waiting list (blocking if none), which creates a <b>new socket</b> just for data exchange with that client.</li><li>Two socket types separate the connection phase from the data-exchange phase. The client uses <b>one socket</b> for both.</li></ul></div>
</div>
<h3 id="c13-javatcp">Java example with TCP (slides)</h3>
<p>The client reads a line from standard input (<span class="mono">inFromUser</span> stream) and sends it to the server through its socket (<span class="mono">outToServer</span> stream). The server reads the line, converts it to upper case and sends it back. The client reads and prints the modified line (<span class="mono">inFromServer</span> stream). A <b>stream</b> is a sequence of characters flowing into (input stream) or out of (output stream) a process.</p>
<pre class="code">import java.io.*;
import java.net.*;
class TCPClient {
  public static void main(String argv[]) throws Exception {
    String sentence;
    String modifiedSentence;
    BufferedReader inFromUser =                       // create input stream
        new BufferedReader(new InputStreamReader(System.in));
    Socket clientSocket = new Socket("hostname", 6789); // create client socket, connect to server
    DataOutputStream outToServer =                    // output stream attached to socket
        new DataOutputStream(clientSocket.getOutputStream());
    BufferedReader inFromServer =                     // input stream attached to socket
        new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
    sentence = inFromUser.readLine();
    outToServer.writeBytes(sentence + '\\n');          // send line to server
    modifiedSentence = inFromServer.readLine();       // read line from server
    System.out.println("FROM SERVER: " + modifiedSentence);
    clientSocket.close();
  }
}</pre>
<pre class="code">import java.io.*;
import java.net.*;
class TCPServer {
  public static void main(String argv[]) throws Exception {
    String clientSentence;
    String capitalizedSentence;
    ServerSocket welcomeSocket = new ServerSocket(6789);  // welcoming socket at port 6789
    while (true) {
      Socket connectionSocket = welcomeSocket.accept();   // wait on welcoming socket for a client
      BufferedReader inFromClient =                       // input stream attached to socket
          new BufferedReader(new InputStreamReader(connectionSocket.getInputStream()));
      DataOutputStream outToClient =                      // output stream attached to socket
          new DataOutputStream(connectionSocket.getOutputStream());
      clientSentence = inFromClient.readLine();           // read in line from socket
      capitalizedSentence = clientSentence.toUpperCase() + '\\n';
      outToClient.writeBytes(capitalizedSentence);        // write out line to socket
    }                                                     // loop back and wait for another client
  }
}</pre>
<h3 id="c13-javaudp">Java example with UDP (slides)</h3>
<p>UDP has no "connection": no handshaking; the sender explicitly attaches the destination IP address and port to each packet, and the server must extract the sender's IP address and port from each received packet. Data may be received out of order or lost.</p>
<pre class="code">import java.io.*;
import java.net.*;
class UDPClient {
  public static void main(String args[]) throws Exception {
    BufferedReader inFromUser =
        new BufferedReader(new InputStreamReader(System.in));
    DatagramSocket clientSocket = new DatagramSocket();          // create client socket
    InetAddress IPAddress = InetAddress.getByName("hostname");   // translate hostname to IP using DNS
    byte[] sendData = new byte[1024];
    byte[] receiveData = new byte[1024];
    String sentence = inFromUser.readLine();
    sendData = sentence.getBytes();
    DatagramPacket sendPacket =                                  // datagram with data, length, IP, port
        new DatagramPacket(sendData, sendData.length, IPAddress, 9876);
    clientSocket.send(sendPacket);                               // send datagram to server
    DatagramPacket receivePacket =
        new DatagramPacket(receiveData, receiveData.length);
    clientSocket.receive(receivePacket);                         // read datagram from server
    String modifiedSentence = new String(receivePacket.getData());
    System.out.println("FROM SERVER:" + modifiedSentence);
    clientSocket.close();
  }
}</pre>
<pre class="code">import java.io.*;
import java.net.*;
class UDPServer {
  public static void main(String args[]) throws Exception {
    DatagramSocket serverSocket = new DatagramSocket(9876);      // datagram socket at port 9876
    byte[] receiveData = new byte[1024];
    byte[] sendData = new byte[1024];
    while (true) {
      DatagramPacket receivePacket =                             // space for received datagram
          new DatagramPacket(receiveData, receiveData.length);
      serverSocket.receive(receivePacket);                       // receive datagram
      String sentence = new String(receivePacket.getData());
      InetAddress IPAddress = receivePacket.getAddress();        // get IP address and port of sender
      int port = receivePacket.getPort();
      String capitalizedSentence = sentence.toUpperCase();
      sendData = capitalizedSentence.getBytes();
      DatagramPacket sendPacket =                                // datagram to send to client
          new DatagramPacket(sendData, sendData.length, IPAddress, port);
      serverSocket.send(sendPacket);                             // write out datagram to socket
    }                                                            // loop back, wait for another datagram
  }
}</pre>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Step</th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Server socket</td><td><span class="mono">welcomeSocket = new ServerSocket(6789)</span>, then <span class="mono">connectionSocket = welcomeSocket.accept()</span> for each client</td><td><span class="mono">serverSocket = new DatagramSocket(9876)</span>, one socket for all clients</td></tr>
<tr><td>Client socket</td><td><span class="mono">new Socket("hostname", 6789)</span>: TCP connection set up at creation</td><td><span class="mono">new DatagramSocket()</span>: no connection</td></tr>
<tr><td>Sending</td><td>Write bytes into an output stream</td><td>Build a <span class="mono">DatagramPacket</span> with data, length, IP address and port, then <span class="mono">send()</span></td></tr>
<tr><td>Receiving</td><td>Read lines from an input stream (byte stream)</td><td><span class="mono">receive()</span> a whole packet; the server reads the sender's address and port from it</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c13-web">
<h2>The World Wide Web</h2>
<ul>
  <li>Proposed by <b>Tim Berners-Lee in 1989 at CERN</b> so researchers across Europe could access each other's work; the commercial Web began in the early 1990s. Today it is a global information space of <b>web pages</b> connected by links.</li>
  <li>Its growth rests on two ideas: <b>distributed</b> (any server can add pages without overloading a few servers) and <b>linked</b> (pages reference pages on other servers) through <b>hypertext</b>, which became <b>hypermedia</b> (text, images, audio, video).</li>
  <li>Architecture: a <b>distributed client-server service</b>. The service is spread over many <b>sites</b>, each holding web pages. A <b>simple</b> page has no links; a <b>composite</b> page has one or more links. Each page is a file with a name and address.</li>
</ul>
<div class="duo">
  <div class="card"><h4>Web client (browser)</h4><p>Three parts: a <b>controller</b> (takes keyboard and mouse input and uses the client programs to access the document), <b>client protocols</b> (HTTP, FTP …) and <b>interpreters</b> (HTML, Java, JavaScript) that display the document.</p></div>
  <div class="card"><h4>Web server</h4><p>Stores the pages and sends the document for each request. For efficiency it caches requested files in memory and can use multithreading or multiprocessing to answer several requests at a time (e.g. Apache, Microsoft IIS).</p></div>
</div>
<h3 id="c13-url">Uniform Resource Locator (URL)</h3>
<div class="flow"><span><b>protocol</b>: the "vehicle", usually http</span><i>://</i><span><b>host</b>: IP address or domain name</span><i>:</i><span><b>port</b>: 80 for HTTP (usually omitted)</span><i>/</i><span><b>path</b>: folders and file name</span></div>
<p>Example: <span class="mono">http://www.mhhe.com/compsci/forouzan/</span>: host www.mhhe.com (www is part of the host name), path compsci/forouzan/. Slides: in <span class="mono">www.someschool.edu/someDept/pic.gif</span>, www.someschool.edu is the host name and /someDept/pic.gif the path name.</p>
<h3 id="c13-docs">Web documents</h3>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Type</th><th>How it is made</th><th>Technology</th></tr></thead><tbody>
<tr><td><b>Static</b></td><td>Fixed content created and stored on the server; the client gets a copy</td><td>HTML, XML, XSL, XHTML</td></tr>
<tr><td><b>Dynamic</b></td><td>Created by the server, by running a program or script, each time a browser requests it; contents vary per request (e.g. the server's date and time)</td><td>Server-side programs and scripts</td></tr>
<tr><td><b>Active</b></td><td>A program or script that runs on the <b>client</b> for animation or interaction; the server sends a copy and the browser runs it</td><td>Java applets (compiled bytecode), JavaScript</td></tr>
</tbody></table></div>
</section>

<section class="topic" id="c13-http">
<h2>HTTP: HyperText Transfer Protocol</h2>
<p>HTTP is the Web's application-layer protocol, at the heart of the Web. It is implemented in a client program and a server program that exchange <b>HTTP messages</b>. A web page consists of <b>objects</b> (an HTML file, a JPEG image, a Java applet, an audio file …), each addressable by a <b>URL</b>; most pages are a <b>base HTML file</b> plus several referenced objects.</p>
<ul>
  <li><b>Client-server model</b>: the client is a browser that requests, receives and "displays" web objects; the server (e.g. Apache) sends objects in response to requests.</li>
  <li><b>Uses TCP</b>: the client initiates a TCP connection (creates a socket) to the server on <b>port 80</b>; the server accepts it; HTTP messages are exchanged; the TCP connection is closed.</li>
  <li><b>HTTP is "stateless"</b>: the server keeps no information about past client requests. Protocols that maintain state are complex: past history must be maintained, and if the server or client crashes their views of the state may be inconsistent.</li>
</ul>
<h3 id="c13-persist">Non-persistent and persistent connections</h3>
<div class="duo">
  <div class="card"><h4>Non-persistent HTTP</h4><p>At most <b>one object</b> per TCP connection. For a page with N referenced objects on the same server, the connection is opened and closed <b>N + 1 times</b>, and the server needs N + 1 buffers: high overhead. Each object costs <b>2 RTTs</b>, and browsers often open parallel connections to compensate.</p></div>
  <div class="card"><h4>Persistent HTTP (default in HTTP/1.1)</h4><p>The server <b>leaves the connection open</b> after a response; later requests and responses between the same client and server use it, even several pages. The client sends requests as soon as it meets a referenced object: as little as <b>one RTT for all</b> the referenced objects.</p></div>
</div>
<p>Non-persistent example (slides): the user enters <span class="mono">www.someSchool.edu/someDepartment/home.index</span> (text plus references to 10 JPEG images).</p>
<ol>
  <li>1a. The HTTP client initiates a TCP connection to the server on port 80. 1b. The server, waiting on port 80, accepts and notifies the client.</li>
  <li>The client sends an HTTP <b>request message</b> (with the URL) into the TCP socket.</li>
  <li>The server receives it, forms a <b>response message</b> containing the requested object and sends it into its socket.</li>
  <li>The server closes the TCP connection.</li>
  <li>The client receives the HTML file, displays it, parses it and finds 10 referenced JPEG objects.</li>
  <li>Steps 1–5 are repeated for each of the 10 JPEG objects.</li>
</ol>
<figure class="lab" data-widget="seq" data-spec="http-np"><figcaption><span class="ttl">One non-persistent fetch</span><span class="cap">Two RTTs per object: one for the TCP handshake, one for the request and the first bytes of the response.</span></figcaption></figure>
<div class="formula"><code class="f">Non-persistent response time = 2 RTT + file transmission time</code><span class="where">RTT = time for a small packet to travel from client to server and back (propagation, queuing and processing delays). The first two handshake segments take one RTT; the request rides with the third segment and the response takes another RTT.</span></div>
<figure class="lab" data-widget="http"><figcaption><span class="ttl">HTTP response-time calculator</span><span class="cap">Compare non-persistent (serial and parallel) with persistent connections for a page with several objects.</span></figcaption></figure>
<div class="example"><p class="ex-q">RTT = 100 ms; a base HTML file and 10 small images (transmission time negligible) on one server. Total time with non-persistent serial connections versus persistent with pipelining?</p><ol class="steps">
  <li>Non-persistent, one at a time: (1 + 10) objects × 2 RTT = 22 × 100 ms = <b>2.2 s</b></li>
  <li>Persistent with pipelining: 2 RTT for the base file, then about 1 RTT for all 10 images = 3 × 100 ms = <b>0.3 s</b></li>
</ol><p class="ex-a">Persistent connections save the setup RTT for every object</p></div>
<h3 id="c13-msg">HTTP messages</h3>
<p>Two types, both in <b>ASCII</b> (human-readable): request and response.</p>
<pre class="code">GET /somedir/page.html HTTP/1.1      &lt;- request line (method, URL, version)
Host: www.someschool.edu              &lt;- header lines
User-agent: Mozilla/4.0
Connection: close
Accept-language: fr
                                      &lt;- extra carriage return, line feed: end of header</pre>
<ul>
  <li><b>Host:</b> the host on which the object resides. <b>Connection: close</b>: the browser does not want a persistent connection. <b>User-agent:</b> the browser type. <b>Accept-language: fr</b>: prefer a French version if one exists.</li>
  <li><b>Uploading form input</b>: the <b>POST</b> method puts the input in the <b>entity body</b>; the <b>URL method</b> uses GET with the input in the URL field, e.g. <span class="mono">www.somesite.com/animalsearch?monkeys&amp;banana</span>.</li>
</ul>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Method</th><th>Version</th><th>Purpose</th></tr></thead><tbody>
<tr><td><b>GET</b></td><td>1.0</td><td>Request an object identified in the URL field</td></tr>
<tr><td><b>POST</b></td><td>1.0</td><td>Request a page whose contents depend on what the user entered in a form (sent in the entity body)</td></tr>
<tr><td><b>HEAD</b></td><td>1.0</td><td>Ask the server to leave the requested object out of the response: header only (used for debugging)</td></tr>
<tr><td><b>PUT</b></td><td>1.1</td><td>Upload a file in the entity body to the path in the URL field</td></tr>
<tr><td><b>DELETE</b></td><td>1.1</td><td>Delete the file specified in the URL field</td></tr>
<tr><td>TRACE · OPTIONS · CONNECT</td><td>1.1</td><td>Echo the request back · return the methods the server supports · TCP/IP tunnel for HTTP</td></tr>
</tbody></table></div>
<pre class="code">HTTP/1.1 200 OK                         &lt;- status line (version, status code, phrase)
Connection: close                       &lt;- server will close the TCP connection
Date: Thu, 06 Aug 1998 12:00:15 GMT     &lt;- when the response was created
Server: Apache/1.3.0 (Unix)             &lt;- like User-agent, for the server
Last-Modified: Mon, 22 Jun 1998 ...     &lt;- when the object was created or modified
Content-Length: 6821                    &lt;- bytes in the object
Content-Type: text/html                 &lt;- the body is HTML text

data data data data data ...            &lt;- the requested HTML file</pre>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Status code</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="mono">200 OK</td><td>Request succeeded; the requested object is later in this message</td></tr>
<tr><td class="mono">301 Moved Permanently</td><td>Object moved; the new location is in the <span class="mono">Location:</span> header and the client retrieves it automatically</td></tr>
<tr><td class="mono">400 Bad Request</td><td>The request message was not understood by the server</td></tr>
<tr><td class="mono">404 Not Found</td><td>The requested document is not on this server</td></tr>
<tr><td class="mono">505 HTTP Version Not Supported</td><td>The requested protocol version is not supported</td></tr>
</tbody></table></div>
<h3 id="c13-cond">Conditional request</h3>
<p>A client can add a condition: the server sends the page only if it is met. The most common is the modification date: the header line <span class="mono">If-Modified-Since: &lt;date&gt;</span> asks for the page only if it changed after that time. If it did not, the status line says the file was not modified (<span class="mono">304 Not Modified</span>) and the body is empty.</p>
<h3 id="c13-cookies">Cookies</h3>
<p>HTTP is stateless, but websites often want to identify users, to restrict access or to serve content by user identity. An <b>HTTP cookie</b> is a small piece of data sent by a website and stored by the browser, letting sites remember state (items in a shopping cart) or browsing activity (log-ins, pages visited).</p>
<ol>
  <li><b>Creating and storing</b>: the server stores information about the client (domain name, the cookie contents such as name or registration number, a timestamp …) and includes the cookie in its response; the browser stores it in its <b>cookie directory</b>, sorted by server domain name.</li>
  <li><b>Using</b>: when the client sends a request, the browser looks for a cookie from that server and includes it. The server then knows this is an old client. The browser never reads the contents or discloses them to the user: <b>a cookie is made by the server and eaten by the server</b>.</li>
</ol>
<figure class="lab" data-widget="seq" data-spec="cookie"><figcaption><span class="ttl">Cookie walk-through: the BestToys example</span><span class="cap">Cart ID 12343 travels in Set-Cookie once, then in every later request.</span></figcaption></figure>
<p>Other uses: sites restricted to registered clients send a cookie at first registration; web portals remember your favourite pages; advertising agencies use cookies in banner ads to build a profile of a user's web behaviour, which makes cookies controversial for privacy.</p>
<h3 id="c13-cache">Web caching (proxy server)</h3>
<p>A <b>web cache</b>, also called a <b>proxy server</b>, satisfies HTTP requests on behalf of an origin server. It has its own disk storage with copies of recently requested objects, and the browser can be configured to send all requests to it first. For <span class="mono">http://www.someschool.edu/campus.gif</span>:</p>
<ol>
  <li>The browser opens a TCP connection to the web cache and sends the request to it.</li>
  <li>If the cache has a copy, it returns the object in an HTTP response.</li>
  <li>If not, the cache opens a TCP connection to the origin server and requests the object.</li>
  <li>The origin server sends the object to the cache.</li>
  <li>The cache stores a copy and sends one to the browser over the existing connection.</li>
</ol>
<div class="note def"><b class="tag">HTTP security</b><p>HTTP itself provides no security. Run over the Secure Socket Layer (SSL), it is called <b>HTTPS</b>, which provides confidentiality, client and server authentication and data integrity (HTTPS uses port 443).</p></div>
</section>

<section class="topic" id="c13-ftp">
<h2>FTP: File Transfer Protocol</h2>
<p>FTP transfers files from one host to another using the client-server model; the client initiates the transfer (to or from the remote host). Systems differ in file-name rules, data formats and directory structures, and FTP handles this smoothly; it is generally better than HTTP for large files and many file formats.</p>
<ul>
  <li>The client has three components: the <b>user interface</b>, the <b>client control process</b> and the <b>client data transfer process</b>. The server has a <b>server control process</b> and a <b>server data transfer process</b>.</li>
  <li>The <b>control connection</b> joins the control processes; the <b>data connection</b> joins the data transfer processes. Separating commands from data makes FTP efficient: control needs only simple one-line rules, data needs complex rules for the variety of data types.</li>
</ul>
<div class="duo">
  <div class="card"><h4>Control connection · TCP port 21</h4><p>Stays connected for the <b>entire interactive session</b> and is "out of band". Commands (ASCII upper case, maybe with an argument) go from client to server; responses go back. Each line ends with CR LF. The <b>FTP server maintains state</b>: the current directory and earlier authentication.</p></div>
  <div class="card"><h4>Data connection · TCP port 20</h4><p><b>Opened and closed for each file</b> transferred. (1) The client issues a passive open on an <b>ephemeral port</b>, because it is the client that issues the transfer commands. (2) It sends this port number to the server with the <b>PORT</b> command. (3) The server does an <b>active open</b> from port 20 to that port.</p></div>
</div>
<figure class="lab" data-widget="seq" data-spec="ftp"><figcaption><span class="ttl">An FTP session</span><span class="cap">Login on the control connection, then a data connection for one file.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Sample command</th><th>Meaning</th><th>Sample reply</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="mono">USER username</td><td>Send the user name</td><td class="mono">331</td><td>Username OK, password required</td></tr>
<tr><td class="mono">PASS password</td><td>Send the password</td><td class="mono">125</td><td>Data connection already open; transfer starting</td></tr>
<tr><td class="mono">LIST</td><td>Return the list of files in the current directory</td><td class="mono">425</td><td>Can't open data connection</td></tr>
<tr><td class="mono">RETR filename</td><td>Retrieve (get) a file</td><td class="mono">452</td><td>Error writing file</td></tr>
<tr><td class="mono">STOR filename</td><td>Store (put) a file on the remote host</td><td class="mono">PORT</td><td>(command) tells the server the client's data port</td></tr>
</tbody></table></div>
<p>Every command gets at least one response: a <b>three-digit code</b> plus text. The first digit gives the status of the command, the second the area it applies to, the third extra information.</p>
<h3 id="c13-ftpdata">Communication over the data connection</h3>
<p>Before a file is sent, three attributes are agreed over the control connection to solve the heterogeneity problem:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Attribute</th><th>Choices</th></tr></thead><tbody>
<tr><td><b>File type</b></td><td>ASCII file, EBCDIC file or image file</td></tr>
<tr><td><b>Data structure</b></td><td>File structure, record structure or page structure</td></tr>
<tr><td><b>Transmission mode</b></td><td><b>Stream</b> mode (default: a continuous stream of bytes to TCP), <b>block</b> mode (data delivered in blocks) or <b>compressed</b> mode</td></tr>
</tbody></table></div>
<p>A file transfer means one of three things: <b>retrieving</b> a file (server to client), <b>storing</b> a file (client to server) or a <b>directory listing</b> (server to client).</p>
<div class="note warn"><b class="tag">Security</b><p>FTP was designed when security was not an issue: the password and the data travel in <b>plaintext</b> and can be intercepted. Adding SSL between FTP and TCP gives <b>SSL-FTP</b>.</p></div>
</section>

<section class="topic" id="c13-email">
<h2>Electronic mail</h2>
<p>E-mail is different from HTTP and FTP: messages are sent and <b>stored until the recipient retrieves them</b>, a reply is optional and is a separate transaction, and Bob does not run a server to receive mail (he may be offline). Intermediate mail servers do the client-server work.</p>
<h3 id="c13-arch">Architecture</h3>
<p>Three major components (slides): <b>user agents</b>, <b>mail servers</b> and <b>SMTP</b>. In the notes' scenario Alice and Bob are connected to their mail servers by a LAN or WAN. Each user has a <b>mailbox</b> (part of the server's disk, only the owner may access it) and the server has a <b>queue (spool)</b> for messages waiting to be sent. Three kinds of agent are used: <b>user agent (UA)</b>, <b>message transfer agent (MTA)</b> and <b>message access agent (MAA)</b>.</p>
<figure class="lab lab-3d" data-scene="journey" data-mode="email" data-lock="1"><figcaption><span class="ttl">One e-mail from Alice to Bob</span><span class="cap">Two SMTP pushes (UA to MTA, MTA client to MTA server) and one pull by Bob's message access agent.</span></figcaption></figure>
<ol>
  <li>Alice composes the e-mail with her UA.</li>
  <li>The UA sends it to the MTA client on Alice's mail server.</li>
  <li>The MTA client hands it to the MTA server on the same mail server.</li>
  <li>The e-mail is placed in the spool (queue) on Alice's mail server.</li>
  <li>The MTA client sends the e-mail across the Internet to Bob's mail server.</li>
  <li>The MTA server on Bob's mail server receives it.</li>
  <li>The e-mail is stored in Bob's mailbox.</li>
  <li>Bob's MAA server retrieves the message from the mailbox.</li>
  <li>Bob uses his MAA client to access the message through his UA.</li>
</ol>
<div class="note remember"><b class="tag">Two key points</b><p>(1) Bob cannot use an MTA server to receive mail directly: he would have to keep it running and stay connected all the time. (2) MTAs <b>push</b> messages, but Bob needs a <b>pull</b> program to retrieve them when he wants: the MAA. So e-mail uses <b>three client-server applications</b>: two MTA pairs and one MAA pair.</p></div>
<h3 id="c13-ua">User agent, addresses and mailing lists</h3>
<ul>
  <li>A <b>user agent</b> (mail reader) composes, reads, replies to and forwards messages and handles local mailboxes. <b>Command-driven</b> UAs take one-character commands (r = reply to sender, R = reply to all): mail, pine, elm. <b>GUI-based</b>: Eudora, Outlook, Mozilla Thunderbird.</li>
  <li><b>Sending</b>: the mail has an <b>envelope</b> (sender address, receiver address …) and a <b>message</b> (header: sender, receiver, subject …; body: the actual information). <b>Receiving</b>: the UA, triggered by the user or a timer, lists each message with sender, subject and time.</li>
  <li><b>Address</b>: <span class="mono">local part @ domain name</span>: the local part names the user's mailbox; the domain identifies the mail server (mail exchanger).</li>
  <li><b>Mailing list</b> (group list): one alias represents several addresses; the system prepares a separate message for each entry and hands them to the MTA.</li>
</ul>
<h3 id="c13-smtp">SMTP: Simple Mail Transfer Protocol</h3>
<ul>
  <li>The formal protocol for the MTA client and server. It uses <b>TCP</b> to reliably transfer e-mail from client to server on <b>port 25</b>.</li>
  <li><b>Direct transfer</b>: sending server to receiving server.</li>
  <li><b>Three phases</b>: handshaking (greeting), transfer of messages, closure.</li>
  <li><b>Command/response</b> interaction: commands are ASCII text, responses are a status code and phrase; each line ends with CR LF.</li>
  <li>Messages must be in <b>7-bit ASCII</b> (max 1000 characters per line); the server uses <b>CRLF.CRLF</b> to find the end of the message. SMTP uses <b>persistent</b> connections.</li>
</ul>
<figure class="lab" data-widget="seq" data-spec="smtp"><figcaption><span class="ttl">Sample SMTP interaction (slides)</span><span class="cap">crepes.fr sends Alice's message to Bob at hamburger.edu.</span></figcaption></figure>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Phase</th><th>Steps</th></tr></thead><tbody>
<tr><td><b>Connection establishment</b></td><td>After the client's TCP connection to port 25: the server sends <span class="mono">220</span> (service ready) or <span class="mono">421</span> (not available); the client sends <span class="mono">HELO</span> with its domain name; the server replies <span class="mono">250</span> (request completed)</td></tr>
<tr><td><b>Message transfer</b></td><td><span class="mono">MAIL FROM</span> (sender address, the return address for errors) → <span class="mono">250</span>; <span class="mono">RCPT TO</span> (recipient) → <span class="mono">250</span>, repeated per recipient; <span class="mono">DATA</span> → <span class="mono">354</span> (start mail input); the message lines, ended by a line with just a period → <span class="mono">250</span> (OK)</td></tr>
<tr><td><b>Connection termination</b></td><td><span class="mono">QUIT</span> → <span class="mono">221</span> (service closing)</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>Scenario: Alice sends a message to Bob (slides)</h4><ol><li>Alice uses her UA to compose a message "to" bob@someschool.edu.</li><li>Her UA sends it to her mail server; it is placed in the message queue.</li><li>The client side of SMTP opens a TCP connection with Bob's mail server.</li><li>The SMTP client sends Alice's message over the TCP connection.</li><li>Bob's mail server places the message in Bob's mailbox.</li><li>Bob invokes his user agent to read the message.</li></ol></div>
  <div class="card"><h4>SMTP compared with HTTP</h4><ul><li>HTTP is a <b>pull</b> protocol; SMTP is a <b>push</b> protocol.</li><li>Both use ASCII command/response interaction and status codes.</li><li>HTTP encapsulates each object in its own response message; SMTP sends multiple objects in a <b>multipart</b> message.</li></ul></div>
</div>
<div class="note tip"><b class="tag">From the IA-2 notes</b><p>Three characteristics of SMTP: the message body uses 7-bit ASCII only; normally no intermediate mail servers are used for sending; mail can cross multiple networks through mail relaying. How it works: mail servers listen on port 25; the sending server initiates a TCP connection to the receiving server; if the receiver is down, the sender tries later; the client gives the sender's and recipient's addresses; finally it sends the message over the same TCP connection.</p></div>
<h3 id="c13-format">Mail message format (RFC 822)</h3>
<p>SMTP is the protocol for exchanging messages; RFC 822 is the standard for the text message format: <b>header lines</b> (To:, From:, Subject:, different from SMTP commands), a <b>blank line</b>, then the <b>body</b>, the message in ASCII characters only.</p>
<h3 id="c13-access">Mail access protocols: POP3, IMAP4, HTTP</h3>
<p>SMTP delivers and stores mail at the receiver's server (push). A mail access protocol retrieves it from the server (pull): <b>POP3</b> (authorization and download), <b>IMAP4</b> (more features, manipulation of stored messages on the server) or <b>HTTP</b> (Gmail, Hotmail, Yahoo! Mail).</p>
<figure class="lab" data-widget="seq" data-spec="pop3"><figcaption><span class="ttl">POP3 session (slides)</span><span class="cap">Authorization (user, pass) then transaction (list, retr, dele, quit).</span></figcaption></figure>
<div class="duo">
  <div class="card"><h4>POP3</h4><ul><li>Simple but limited. The client opens a connection to the server on <b>TCP port 110</b>, sends the user name and password, then lists and retrieves messages one by one.</li><li>Client commands: <span class="mono">user</span>, <span class="mono">pass</span>, <span class="mono">list</span>, <span class="mono">retr</span>, <span class="mono">dele</span>, <span class="mono">quit</span>; server responses <span class="mono">+OK</span> and <span class="mono">-ERR</span>.</li><li>Two modes: <b>delete</b> (download and delete: Bob cannot re-read mail if he changes client) and <b>keep</b> (download and keep: copies on different clients).</li><li>POP3 is <b>stateless</b> across sessions.</li></ul></div>
  <div class="card"><h4>IMAP4</h4><ul><li>Keeps all messages in one place, the server, and lets the user organize them in <b>folders</b>; it keeps user state across sessions (folder names, message-to-folder mappings).</li><li>Extra functions: check the e-mail header before downloading; search the contents for a string before downloading; <b>partially download</b> e-mail (useful for large multimedia on low bandwidth); create, delete or rename mailboxes on the server; create a hierarchy of mailboxes in a folder.</li></ul></div>
</div>
<h3 id="c13-webmail">Web-based mail</h3>
<p><b>Case I</b>: Alice uses a traditional mail server, Bob a web-based server. SMTP carries the mail from Alice's browser side to her server and from server to server; Bob then gets it from his web server with <b>HTTP</b> (not POP3 or IMAP4): he logs in, receives the list in HTML and retrieves mails with more HTTP transactions. <b>Case II</b>: both use web servers. Alice sends to her web server with HTTP (Bob's mailbox address as the URL); her server forwards to Bob's server with <b>SMTP</b>; Bob reads it with HTTP.</p>
<h3 id="c13-mime">MIME</h3>
<p>E-mail can carry only <b>7-bit ASCII</b>, so it cannot carry non-English text, binary files, video or audio. <b>Multipurpose Internet Mail Extensions (MIME)</b> is a supplementary protocol that transforms non-ASCII data into NVT ASCII at the sender and back again at the receiver. It adds five headers:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>MIME header</th><th>Meaning</th></tr></thead><tbody>
<tr><td><b>MIME-Version</b></td><td>The MIME version used (current version 1.1)</td></tr>
<tr><td><b>Content-Type</b></td><td>Type/subtype of the body, plus parameters: seven types: text, multipart, message, image, video, audio, application</td></tr>
<tr><td><b>Content-Transfer-Encoding</b></td><td>How the message is encoded into 0s and 1s for transport: five methods: 7bit, 8bit, binary, base64, quoted-printable</td></tr>
<tr><td><b>Content-ID</b></td><td>Uniquely identifies the whole message in a multiple-message environment</td></tr>
<tr><td><b>Content-Description</b></td><td>Says whether the body is an image, audio or video</td></tr>
</tbody></table></div>
<div class="note def"><b class="tag">E-mail security</b><p>The e-mail protocols have no built-in security; exchanges can be secured with two application-layer protocols, <b>PGP</b> (Pretty Good Privacy) and <b>S/MIME</b> (Secure/MIME).</p></div>
</section>

<section class="topic" id="c13-dns">
<h2>DNS: Domain Name System</h2>
<p>People prefer names; hosts and routers use 32-bit IP addresses to address datagrams. DNS maps <b>human-friendly names to IP addresses</b>, like a telephone directory for the Internet. It is:</p>
<ul>
  <li>a <b>distributed database</b> implemented in a <b>hierarchy of many name servers</b>;</li>
  <li>an <b>application-layer protocol</b> in which hosts, routers and name servers communicate to resolve names. A core Internet function implemented at the application layer: complexity at the network's "edge";</li>
  <li>carried over <b>UDP</b> (and TCP) on <b>port 53</b> (IA-2 notes: distributed database, application-layer protocol, uses UDP and port 53).</li>
</ul>
<div class="duo">
  <div class="card"><h4>DNS services (slides)</h4><ul><li>Hostname to IP address translation</li><li><b>Host aliasing</b>: canonical and alias names</li><li><b>Mail server aliasing</b></li><li><b>Load distribution</b>: replicated web servers, a set of IP addresses for one canonical name</li></ul></div>
  <div class="card"><h4>Why not centralize DNS?</h4><ul><li>Single point of failure</li><li>Traffic volume</li><li>Distant centralized database</li><li>Maintenance</li></ul><p>It doesn't scale! A central directory would also be vulnerable to failures, so DNS information is distributed across servers worldwide.</p></div>
</div>
<h3 id="c13-dnsuse">How a name is mapped (six steps)</h3>
<p>A user wants a file transfer server whose name is afilesource.com; TCP/IP needs its IP address.</p>
<ol>
  <li>The user passes the host name to the file transfer client.</li>
  <li>The file transfer client passes the host name to the <b>DNS client</b>.</li>
  <li>Every computer, after booting, knows the address of one DNS server. The DNS client sends a query with the server name to that DNS server.</li>
  <li>The DNS server responds with the IP address of the file transfer server.</li>
  <li>The DNS client passes the IP address to the file transfer client.</li>
  <li>The file transfer client uses the IP address to access the file transfer server.</li>
</ol>
<p class="small muted">IA-2 notes version: the browser extracts the host name from the URL, passes it to the DNS application, the DNS client queries the DNS server, the server replies with the IP address, and the browser uses it to connect to the website.</p>
<h3 id="c13-namespace">Name space and domain name space</h3>
<div class="duo">
  <div class="card"><h4>Flat name space</h4><p>Each name is a sequence of characters with no structure; shared segments mean nothing. Needs central control to avoid duplicates: impractical for the Internet.</p></div>
  <div class="card"><h4>Hierarchical name space</h4><p>Names have several parts (organization type, organization name, department …). A central authority assigns only part of the name, and organizations manage the rest, so caesar.first.com and caesar.second.com are distinct. This is the basis of DNS.</p></div>
</div>
<ul>
  <li><b>Domain name space</b>: an <b>inverted tree</b> with the root at the top, at most <b>128 levels</b> (level 0, the root, to level 127).</li>
  <li><b>Label</b>: each node has a label of at most <b>63 characters</b>; the root label is a null (empty) string. Children of a node must have different labels, which guarantees unique domain names.</li>
  <li><b>Domain name</b>: the sequence of labels separated by dots, read from the node up to the root. A name ending with the null label (written as a final dot) is a <b>fully qualified domain name (FQDN)</b>; one that does not reach the root is a <b>partially qualified domain name (PQDN)</b>, used within the same site: the resolver supplies the missing suffix.</li>
  <li><b>Domain</b>: a subtree of the domain name space, named after its top node; a domain can be divided into subdomains.</li>
</ul>
<h3 id="c13-servers">Distribution: name servers, zones and the hierarchy</h3>
<ul>
  <li>One computer holding everything would be <b>inefficient</b> (heavy load) and <b>unreliable</b> (any failure loses everything), so the information is distributed among many <b>DNS servers</b>: the root stands alone, first-level domains get their own servers, and large domains are divided into subdomains.</li>
  <li>A <b>zone</b> is the part of the hierarchy a server is responsible (authoritative) for. If the server delegates subdomains to other servers, its zone differs from its domain; it keeps references to the lower-level servers.</li>
  <li>A <b>root server</b>'s zone is the whole tree; it usually stores no domain information itself but delegates, keeping references. Several root servers each cover the whole space, distributed around the world (the slides show <b>13 root name servers</b>, a to m, many replicated).</li>
  <li>A <b>primary server</b> stores and maintains (creates, updates) the zone file on its disk. A <b>secondary server</b> transfers the complete zone information from another server and stores it, but never creates or updates it.</li>
</ul>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Server (slides)</th><th>Role</th></tr></thead><tbody>
<tr><td><b>Root name servers</b></td><td>Contacted by a local name server that cannot resolve a name; they contact an authoritative server if the mapping is not known, get it and return it</td></tr>
<tr><td><b>Top-level domain (TLD) servers</b></td><td>Responsible for com, org, net, edu … and all top-level country domains (uk, fr, ca, jp); e.g. Network Solutions for com, Educause for edu</td></tr>
<tr><td><b>Authoritative DNS servers</b></td><td>An organization's own servers with authoritative hostname-to-IP mappings for its servers (Web, mail); run by the organization or a service provider</td></tr>
<tr><td><b>Local name server</b></td><td>Not strictly in the hierarchy; each ISP, company or university has one (the "default name server"). A host's query goes to it first; it acts as a proxy and forwards the query into the hierarchy</td></tr>
</tbody></table></div>
<p>First approximation (slides): to get the IP address of www.amazon.com, the client queries a root server to find a com DNS server, queries the com server to get the amazon.com DNS server, then queries amazon.com's server for the address.</p>
<h3 id="c13-domains">DNS in the Internet</h3>
<p>The tree was originally divided into <b>generic domains</b>, <b>country domains</b> and the inverse domain (used to find a name from an IP address, now deprecated).</p>
<ul>
  <li><b>Generic domains</b> group hosts by generic behaviour; the first level has <b>14 labels</b> describing organization types: aero, biz, com, coop, edu, gov, info, int, mil, museum, name, net, org, pro.</li>
  <li><b>Country domains</b> use two-character country abbreviations (us, in …); second labels can be organizational or national, e.g. states in the US: <span class="mono">uci.ca.us.</span> = University of California, Irvine.</li>
</ul>
<h3 id="c13-resolve">Resolution: recursive and iterative</h3>
<p>Mapping a name to an address is <b>name-address resolution</b>. A host calls a DNS client, the <b>resolver</b>, which asks the closest DNS server. If that server has the information it answers; otherwise it refers the resolver to other servers or asks them. The resolver checks whether the reply is a real resolution or an error and gives it to the requesting process.</p>
<figure class="lab lab-3d" data-scene="dns"><figcaption><span class="ttl">DNS resolution in 3D</span><span class="cap">Switch between an iterated and a recursive query for gaia.cs.umass.edu, asked by cis.poly.edu, and step through all eight messages.</span></figcaption></figure>
<div class="duo">
  <div class="card"><h4>Iterated query</h4><p>The contacted server replies with the name of the next server to contact: "I don't know this name, but ask this server." In the notes' example, messages 2, 4 and 6 carry the same query, while replies 3, 5 and 7 carry the IP addresses of the TLD server, the organization's local DNS server and finally the destination. Normally the iteration happens between the local server and the others; the resolver gets the final answer from its local server (event 8).</p></div>
  <div class="card"><h4>Recursive query</h4><p>Puts the burden of resolution on the contacted name server: each server asks the next on the requester's behalf (local → root → TLD → authoritative), and the answer travels back step by step, being cached by the ISP's server. Heavy load on the upper levels.</p></div>
</div>
<h3 id="c13-caching">Caching</h3>
<p>Once any name server learns a mapping, it <b>caches</b> it; a later request is answered from the cache and marked <b>unauthoritative</b>. To avoid outdated mappings, the authoritative server attaches a <b>time-to-live (TTL)</b>: how long the mapping may be cached. Servers keep a TTL counter per entry and purge expired ones. TLD server addresses are typically cached in local name servers, so <b>root name servers are not often visited</b>.</p>
<h3 id="c13-rr">Resource records</h3>
<p>The zone information is a set of <b>resource records</b>, a 5-tuple: <span class="mono">(domain name, type, class, TTL, value)</span>. The domain name identifies the record; the value is the information kept; TTL is the validity in seconds; class is the network type (IN for Internet); the type says how to interpret the value. The slides write the format as <span class="mono">(name, value, type, ttl)</span>.</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Type</th><th>name</th><th>value</th></tr></thead><tbody>
<tr><td class="mono"><b>A</b></td><td>Host name</td><td>Its IPv4 address (32 bits)</td></tr>
<tr><td class="mono"><b>NS</b></td><td>Domain (e.g. foo.com)</td><td>Host name of the authoritative name server for this domain</td></tr>
<tr><td class="mono"><b>CNAME</b></td><td>Alias name for some "canonical" (real) name</td><td>The canonical name (www.ibm.com is really servereast.backup2.ibm.com)</td></tr>
<tr><td class="mono"><b>MX</b></td><td>Domain</td><td>Name of the mail server associated with the name</td></tr>
<tr><td class="mono">SOA</td><td>Zone</td><td>Marks the start of a zone</td></tr>
<tr><td class="mono">AAAA</td><td>Host name</td><td>Its IPv6 address</td></tr>
</tbody></table></div>
<h3 id="c13-dnsmsg">DNS messages</h3>
<p>Two types, <b>query</b> and <b>response</b>, with the <b>same format</b>.</p>
<figure class="lab" data-widget="header" data-spec="dns"><figcaption><span class="ttl">DNS message: tap any field</span><span class="cap">A 12-byte header followed by four variable sections.</span></figcaption></figure>
<ul>
  <li><b>Identification</b> (16 bits): set by the client; the reply to a query uses the same number.</li>
  <li><b>Flags</b>: query or reply, recursion desired, recursion available, reply is authoritative, error status.</li>
  <li>Four counts give the number of records of each type in the message.</li>
  <li><b>Question</b> section (name and type fields for a query): in both queries and responses. <b>Answer</b> section (resource records in response to the query): responses only. <b>Authoritative</b> section: records for authoritative servers. <b>Additional</b> section: extra "helpful" information for the resolver.</li>
</ul>
<h3 id="c13-reg">Registrars, DDNS and DNS security</h3>
<ul>
  <li>New domains are added through <b>registrars</b>, commercial entities accredited by ICANN, which check that the name is unique, enter it in the DNS database and charge a fee. The organization gives its server's name and IP address, e.g. a new commercial organization "wonderful" with server ws at 200.200.200.5 registers <span class="mono">ws.wonderful.com</span> → 200.200.200.5.</li>
  <li><b>Dynamic DNS (DDNS)</b> automates updates for frequently changing addresses: a new binding (e.g. from DHCP) is sent to the primary server, which updates the zone; secondary servers learn of it by active or passive notification and do a zone transfer. Authentication prevents unauthorized changes.</li>
  <li><b>Attacks</b>: reading responses to profile a user (prevent with confidentiality); intercepting and changing responses or creating bogus ones to redirect the user (prevent with message origin authentication and integrity); flooding the server (denial of service). <b>DNSSEC</b> provides origin authentication and integrity with digital signatures, but not confidentiality and no specific DoS protection (caching helps protect upper-level servers).</li>
</ul>
</section>

<section class="topic" id="c13-telnet">
<h2>TELNET: remote logging</h2>
<p>A separate client/server pair for every service does not scale. <b>Remote login</b> applications instead let a user log into a remote computer and use whatever services it has (e.g. a student uses the university's Java compiler). <b>TELNET</b> is an early remote login protocol (TCP port 23). It requires a user name and password but sends <b>everything in plaintext</b>, including the password, so it is vulnerable and has largely been replaced by SSH. It is still studied for its simple architecture (the remote-logging issues also apply to SSH) and because administrators use it for diagnostics and debugging.</p>
<div class="duo">
  <div class="card"><h4>Local logging</h4><p>Keystrokes go to the terminal driver and the local operating system, which interprets them and invokes the application.</p></div>
  <div class="card"><h4>Remote logging</h4><p>Keystrokes go from the terminal driver to the <b>TELNET client</b>, which converts them into <b>NVT</b> characters and sends them across the network. At the remote machine, TCP/IP passes them to the <b>TELNET server</b>, which translates them for the remote system and passes them through a <b>pseudoterminal driver</b> (the OS cannot take TELNET characters directly) to the right application.</p></div>
</div>
<ul>
  <li><b>Network Virtual Terminal (NVT)</b>: different systems use different control combinations (Ctrl+z in DOS, Ctrl+d in UNIX), so TELNET uses a universal character set. Two sets of 8-bit characters: <b>NVT ASCII</b> for data (lowest 7 bits = US ASCII, highest bit 0) and <b>control characters</b> (highest bit 1).</li>
  <li><b>Options</b>: client and server can negotiate extra features before or during the session; simple terminals use the defaults.</li>
  <li><b>User interface</b>: the operating system defines user-friendly commands.</li>
</ul>
</section>

<section class="topic" id="c13-ssh">
<h2>SSH: Secure Shell</h2>
<p>SSH is a secure application program used for remote logging and file transfer, originally designed to <b>replace TELNET</b> (TCP port 22). SSH-1 and SSH-2 are totally incompatible; SSH-1 is deprecated because of security flaws. SSH is an application-layer protocol with three components:</p>
<div class="table-wrap"><table class="cmp"><thead><tr><th>Component</th><th>What it does</th></tr></thead><tbody>
<tr><td><b>SSH-TRANS</b> (transport-layer protocol)</td><td>TCP is not secure, so after an insecure TCP connection the two sides exchange security parameters and create a <b>secure channel</b> on top of TCP, providing (1) privacy/confidentiality, (2) data integrity, (3) server authentication and (4) compression of messages</td></tr>
<tr><td><b>SSH-AUTH</b> (authentication protocol)</td><td>Authenticates the <b>client</b>: it sends the user name, server name, authentication method and data; the server replies with success or failure (then the client retries), similar to client authentication in SSL</td></tr>
<tr><td><b>SSH-CONN</b> (connection protocol)</td><td>Once both sides are authenticated, <b>multiplexes</b> several logical channels over the secure channel, each for a purpose such as remote logging or file transfer</td></tr>
</tbody></table></div>
<div class="duo">
  <div class="card"><h4>Applications</h4><ul><li><b>Remote logging</b>: free and commercial SSH clients</li><li><b>File transfer</b>: the Secure File Transfer Program (<b>sftp</b>) is built on SSH</li><li><b>Port forwarding</b>: insecure applications such as TELNET and SMTP can travel through SSH's secured channel, a tunnel, so it is also called <b>SSH tunnelling</b></li></ul></div>
  <div class="card"><h4>SSH packet format</h4><p><b>Length</b> (4 bytes, excluding padding) · <b>padding</b> (1–8 bytes, to make attacks harder) · <b>type</b> (which SSH protocol) · <b>data</b> · <b>CRC</b> (error detection).</p></div>
</div>
<figure class="lab" data-widget="header" data-spec="ssh"><figcaption><span class="ttl">SSH packet: tap any field</span><span class="cap">The padding makes attacks on the security provision more difficult.</span></figcaption></figure>
</section>

<section class="topic" id="c13-exam">
<h2>Exam corner</h2>
<div class="note exam"><b class="tag">IA-2 important questions 3 and 4</b><p><b>Q3</b>: client-server, peer-to-peer and hybrid: analyse (definitions, features, diagram and the analysis table). <b>Q4</b>: SMTP and DNS.</p></div>
<details class="answer"><summary><span class="chip hot">IA-2 Q3</span> Analyse the client-server, peer-to-peer and hybrid architectures. · 8–10 marks</summary><div class="body"><p>Client-server: always-on server with a fixed IP address, data centers, clients do not talk to each other; examples. P2P: no always-on server, peers communicate directly, intermittently connected with changing IPs, highly scalable but hard to manage; BitTorrent, Skype. Hybrid: server for lookup, peers for service (Skype, instant messaging). Draw both diagrams and finish with the analysis table (service, addressing, scalability, management, reliability, cost).</p></div></details>
<details class="answer"><summary>Explain HTTP: non-persistent and persistent connections, message formats and status codes. · 10 marks</summary><div class="body"><p>Overview (TCP port 80, stateless); non-persistent steps with the 10-image example and 2 RTT + transmit time; persistent connections; the request message (request line, header lines, methods) and response message (status line, headers); the five status codes; conditional GET.</p></div></details>
<details class="answer"><summary>What are cookies? How are they created and used? · 6 marks</summary><div class="body"><p>Why HTTP needs them (stateless); creating and storing (server stores client info, sends the cookie, browser keeps it by domain); using (browser returns it; made and eaten by the server); the BestToys shopping example; other uses and privacy concerns.</p></div></details>
<details class="answer"><summary>Explain web caching (proxy server). · 4 marks</summary><div class="body"><p>Definition; the five steps for campus.gif; benefits: faster response and less traffic on the institution's access link and on the Internet.</p></div></details>
<details class="answer"><summary>Explain FTP with its control and data connections. · 8 marks</summary><div class="body"><p>The client and server components; control connection on port 21 for the whole session; data connection on port 20 per file and the three steps (passive open on an ephemeral port, PORT command, active open); commands and three-digit replies; file type, data structure and transmission mode; security.</p></div></details>
<details class="answer"><summary><span class="chip hot">IA-2 Q4</span> Explain the e-mail architecture and SMTP. · 10 marks</summary><div class="body"><p>The nine-step UA/MTA/MAA scenario with the two key points (push vs pull); user agents, addresses, mailing lists; SMTP features (TCP port 25, three phases, command/response, 7-bit ASCII, CRLF.CRLF); the sample interaction with codes 220, 250, 354, 221; comparison with HTTP.</p></div></details>
<details class="answer"><summary>Compare POP3 and IMAP4. What is MIME? · 6–8 marks</summary><div class="body"><p>POP3: port 110, authorization and transaction phases, delete and keep modes, stateless; IMAP4: server-side folders and state, header check, search, partial download, mailbox management. MIME: why it is needed and its five headers with the content types and encodings.</p></div></details>
<details class="answer"><summary><span class="chip hot">IA-2 Q4</span> Explain DNS: name space, hierarchy of servers, resolution and resource records. · 10 marks</summary><div class="body"><p>Purpose and services; why not centralized; domain name space (inverted tree, labels, FQDN/PQDN, domains); zones, root, primary and secondary servers; root/TLD/authoritative/local servers; generic and country domains; iterated vs recursive resolution with the eight-message diagram; caching and TTL; resource records (A, NS, CNAME, MX); message format; UDP port 53.</p></div></details>
<details class="answer"><summary>Explain TELNET and SSH. · 8 marks</summary><div class="body"><p>TELNET: remote logging, local vs remote logging with the pseudoterminal driver, NVT character set, options, plaintext weakness. SSH: SSH-TRANS, SSH-AUTH, SSH-CONN, applications (remote logging, sftp, port forwarding) and packet format.</p></div></details>
<details class="answer"><summary>Write TCP (or UDP) client and server programs in Java that convert a line to upper case. · 8 marks</summary><div class="body"><p>Use the four programs above: TCP with ServerSocket, accept(), input/output streams; UDP with DatagramSocket and DatagramPacket. Explain the socket interaction diagram for the chosen protocol.</p></div></details>
</section>
`,
  quiz: [
    { q: 'In the client-server paradigm, clients', o: ['Communicate directly with each other', 'Have fixed IP addresses', 'Do not communicate directly with each other', 'Must be always on'], a: 2, why: 'They talk only to the always-on server.' },
    { q: 'Which application is a hybrid of client-server and P2P?', o: ['FTP', 'Skype', 'The Web', 'SMTP'], a: 1, why: 'A server finds the remote party; the call itself is direct.' },
    { q: 'A process is identified on the Internet by', o: ['Its IP address alone', 'Its MAC address', 'Its IP address and port number', 'Its host name'], a: 2, why: 'Many processes can run on the same host.' },
    { q: 'In the slides\' Java TCP server, the call that waits for a client and returns a new socket is', o: ['new ServerSocket()', 'welcomeSocket.accept()', 'receive()', 'connect()'], a: 1, why: 'The welcoming socket stays; accept() creates the connection socket.' },
    { q: 'HTTP is called stateless because', o: ['It uses UDP', 'The server keeps no information about past client requests', 'It has no headers', 'It never closes connections'], a: 1, why: 'State, when needed, is added with cookies.' },
    { q: 'With non-persistent HTTP, the response time for one small object is about', o: ['1 RTT', '2 RTT + transmission time', '3 RTT', 'Transmission time only'], a: 1, why: 'One RTT for TCP setup, one for request and response.' },
    { q: 'A page with N referenced objects over non-persistent HTTP needs how many TCP connections?', o: ['1', 'N', 'N + 1', '2N'], a: 2, why: 'One for the base file and one per object.' },
    { q: 'Status code 404 means', o: ['OK', 'Moved permanently', 'Bad request', 'Not found'], a: 3, why: '200 OK, 301 moved, 400 bad request, 505 version not supported.' },
    { q: 'An HTTP cookie is', o: ['Read by the browser to show the user', 'Made by the server and eaten by the server', 'Stored only on the server', 'Part of the TCP header'], a: 1, why: 'The browser just stores and returns it.' },
    { q: 'FTP uses which ports for control and data?', o: ['20 control, 21 data', '21 control, 20 data', '80 and 443', '25 and 110'], a: 1, why: 'The control connection stays open; a data connection is made per file.' },
    { q: 'In FTP, who issues the passive open for the data connection?', o: ['The server, on port 21', 'The client, on an ephemeral port', 'The server, on port 20', 'Nobody: data uses the control connection'], a: 1, why: 'The client then sends the port with PORT, and the server opens from port 20.' },
    { q: 'SMTP is a', o: ['Pull protocol on port 110', 'Push protocol on TCP port 25', 'Pull protocol on port 143', 'Push protocol over UDP'], a: 1, why: 'Mail access protocols (POP3, IMAP) pull.' },
    { q: 'After the SMTP DATA command, the server replies', o: ['220', '250', '354', '221'], a: 2, why: '354: start mail input, end with a line holding a single period.' },
    { q: 'Which protocol lets a user keep folders on the mail server and download only part of a message?', o: ['POP3', 'SMTP', 'IMAP4', 'MIME'], a: 2, why: 'POP3 has no server-side folders.' },
    { q: 'MIME is needed because SMTP can carry only', o: ['8-bit binary', '7-bit ASCII', 'Unicode', 'Images'], a: 1, why: 'MIME converts non-ASCII data to NVT ASCII and back.' },
    { q: 'A DNS label can have at most', o: ['32 characters', '63 characters', '128 characters', '255 characters'], a: 1, why: 'The tree itself has at most 128 levels.' },
    { q: 'A DNS record of type MX gives', o: ['An IPv4 address', 'An alias', 'The mail server for a domain', 'The authoritative name server'], a: 2, why: 'A = address, CNAME = canonical name, NS = name server.' },
    { q: 'In an iterated DNS query, a contacted server', o: ['Asks the next server itself', 'Replies with the name of the next server to contact', 'Always answers with the IP address', 'Floods all servers'], a: 1, why: 'Recursive queries put the burden on the contacted server.' },
    { q: 'DNS normally uses', o: ['TCP port 80', 'UDP port 53', 'UDP port 67', 'TCP port 25'], a: 1, why: 'As in the IA-2 notes.' },
    { q: 'TELNET\'s main weakness is that it', o: ['Uses UDP', 'Sends everything, including the password, in plaintext', 'Cannot carry control characters', 'Needs MIME'], a: 1, why: 'SSH replaced it with an encrypted channel.' },
    { q: 'The SSH component that multiplexes several logical channels over the secure channel is', o: ['SSH-TRANS', 'SSH-AUTH', 'SSH-CONN', 'sftp'], a: 2, why: 'TRANS builds the secure channel; AUTH authenticates the client.' }
  ]
});
