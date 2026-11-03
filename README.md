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
| Toolkit | Study assistant · Formula sheet and calculators · Exam question bank (IA-1 solved, IA-2 important questions, VTU questions, likely questions) · Mixed test · Lab manual |

Every chapter has worked examples in the exam format, model answers sized to the marks, a self-test, and interactive labs: 3D scenes (protocol stacks, topologies, fibre modes, signals, multiplexing, IP tunnelling, NAT, fragmentation, BGP, e-mail, DNS) and calculators or simulators (line coding, PCM, CRC, checksum, ARQ, ALOHA, CDMA, IPv4 subnetting, Dijkstra, distance vector, TCP diagrams, congestion window, RTT, HTTP timing and more).

- **Ask the study assistant** with the **Ask** button at the top, the box on the home page, the *Ask about this* button under every topic, or by selecting any sentence. It answers only from this guide and links every point to the passage it came from. See below.
- **Search** with the box at the top (or press `/`).
- **Track progress** with the *Mark revised* button under each topic; the home page shows your coverage. Progress, quiz scores and the theme are stored only in your browser.
- **Heads-up boxes** point out the few places where a source in this repository has a slip (for example the pure ALOHA maximum, or a mask written as 256.256.256.224) and give the correct value.

## Study assistant

The assistant is retrieval-augmented: it first finds the passages of this guide that answer a question, then answers only from them.

1. **Understand.** Spelling is corrected against the guide's own vocabulary, acronyms and synonyms are expanded (CSMA/CD, collision detection), the question type is detected, and a follow-up borrows words from the question before it. Questions that are mostly about things the notes never mention are declined instead of guessed.
2. **Retrieve.** About a thousand passages (notes, worked examples, model answers, tables, labs, programs, self-test items) are scored with BM25F keyword ranking, where headings count extra, and with random-indexing meaning vectors. The two rankings are fused by reciprocal rank.
3. **Select.** Maximal marginal relevance keeps passages that add something new, favouring model answers for exam questions and worked examples for numericals.
4. **Write.** Opened as a claude.ai artifact, Claude writes the answer from those passages only, citing each point as [S1], [S2] and so on. *Deep search* lets Claude run its own searches through the notes first. Opened from GitHub or as a file, the assistant runs in notes mode and assembles the answer from the closest sentences and tables, with the same sources.
5. **Check.** Each answer reports how many points cite a source, and underlines any point whose words are not clearly in the cited passage.

Modes: *Explain*, *Exam answer* (sized to 4, 6, 8 or 10 marks), *Revise*, *Numerical* and *Quiz me*. The **Retrieval inspector** on the assistant page shows how any question is read and which passages it pulls. The conversation is kept only in your browser; a question goes to Claude only when you press **Ask**.

## Files

```
docs/
  index.html          shell and home page
  css/app.css         design system
  js/core.js          router, navigation, search, progress, quiz engine
  js/rag.js           study assistant engine: corpus, hybrid retrieval, answer building
  js/assistant.js     study assistant interface: drawer, chat, citations, grounding check
  js/w-phy.js         physical-layer labs
  js/w-dll.js         data-link labs
  js/w-net.js         network, transport and application labs
  js/scenes.js        3D scenes (three.js)
  js/ch/              one file per chapter and toolkit page
  vendor/three.min.js three.js r128 (MIT licence, see vendor/three.LICENSE.txt)
```
