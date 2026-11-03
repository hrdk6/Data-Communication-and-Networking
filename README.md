# Signal to Socket: DCN study guide

An interactive study site for Data Communication and Networking (BCS502, BMSIT&M), built only from the notes, slides, textbook chapters, question papers and lab files in this repository.

## Open it

- **On your computer:** open `docs/index.html` in any modern browser. It works offline, straight from the file; no server or install is needed.
- **As a website:** in the repository's GitHub settings, go to **Pages**, choose **Deploy from a branch**, pick the branch and the **`/docs`** folder, and save. The site then appears at your GitHub Pages address.

## What is inside

| Part | Chapters |
| --- | --- |
| A · Data communication | 1 Introduction · 2 Network models · 3 Data and signals · 4 Digital and analog transmission · 5 Multiplexing · 6 Transmission media |
| B · Networking | 7 Error detection · 8 Data link control · 9 Media access control · 10 Network layer and IP addressing · 11 Routing · 12 Transport layer · 13 Application layer |
| Toolkit | Formula sheet and calculators · Exam question bank (IA-1 solved, IA-2 important questions, VTU questions, likely questions) · Mixed test · Lab manual |

Every chapter has worked examples in the exam format, model answers sized to the marks, a self-test, and interactive labs: 3D scenes (protocol stacks, topologies, fibre modes, signals, multiplexing, IP tunnelling, NAT, fragmentation, BGP, e-mail, DNS) and calculators or simulators (line coding, PCM, CRC, checksum, ARQ, ALOHA, CDMA, IPv4 subnetting, Dijkstra, distance vector, TCP diagrams, congestion window, RTT, HTTP timing and more).

- **Search** with the box at the top (or press `/`).
- **Track progress** with the *Mark revised* button under each topic; the home page shows your coverage. Progress, quiz scores and the theme are stored only in your browser.
- **Heads-up boxes** point out the few places where a source in this repository has a slip (for example the pure ALOHA maximum, or a mask written as 256.256.256.224) and give the correct value.

## Files

```
docs/
  index.html          shell and home page
  css/app.css         design system
  js/core.js          router, navigation, search, progress, quiz engine
  js/w-phy.js         physical-layer labs
  js/w-dll.js         data-link labs
  js/w-net.js         network, transport and application labs
  js/scenes.js        3D scenes (three.js)
  js/ch/              one file per chapter and toolkit page
  vendor/three.min.js three.js r128 (MIT licence, see vendor/three.LICENSE.txt)
```
