# Text-to-speech options for the portfolio site

**Date:** 2026-09-19
**Context:** The portfolio is a Next.js static export (single-page site, deployed as static files from `out/`). Goal: let visitors listen to selected content instead of reading it. Priorities: free or near-free, good English voice quality, low latency, minimal infrastructure, good privacy, works on modern desktop and mobile browsers, and easy to maintain as content changes.

This document surveys four option families (plus hybrids) against primary sources, then makes a recommendation.

---

## 1. Browser-native Web Speech API (`speechSynthesis`)

### Architecture

The page calls `window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))`. The browser hands the text to whatever speech engine the operating system (or the browser vendor) provides. Nothing ships with the site: no model download, no audio files, no server.

### Standards status

The Web Speech API is **not a W3C standard**. It is a ["Draft Community Group Report, 18 September 2026"](https://webaudio.github.io/web-speech-api/), currently maintained under the W3C Web Audio Working Group's umbrella after living for over a decade as a WICG/community-group draft. Despite that limbo status, the synthesis half has shipped in every major browser: MDN marks `SpeechSynthesis` as ["widely available … across browsers since September 2018"](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).

### Voice quality

This is the weakest point, and it is entirely outside our control. The voices are whatever the visitor's OS/browser exposes:

- **macOS/iOS Safari**: Apple's system voices — the newer Siri-adjacent voices are decent, but the default voice a page gets without careful selection is often the older, robotic one.
- **Windows Chrome/Edge**: Edge exposes high-quality Microsoft "Natural" voices; Chrome exposes local SAPI voices plus Google-hosted network voices.
- **Android Chrome**: Google TTS voices, reasonable quality.
- **Linux**: often eSpeak — very robotic.

So two visitors hear completely different renditions of the same text, and we cannot audition or fix any of them.

### Known gotchas (all confirmed against trackers/specs)

- **Voices load asynchronously.** `getVoices()` can return an empty array on first call; you must re-query on the [`voiceschanged` event](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)). Safari has additionally been reported to return incomplete voice lists ([Apple dev forums](https://developer.apple.com/forums/thread/723503)).
- **Chrome kills long utterances after ~15 seconds** when using network voices — [Chromium issue 41294170 ("Speech Synthesis stops abruptly after about 15 seconds")](https://issues.chromium.org/issues/41294170), see also [issue 41346274](https://issues.chromium.org/issues/41346274). Community workarounds are chunking text into short utterances or calling `resume()` on a timer — and the timer hack breaks on Android, where `pause()` behaves like `cancel()` ([cross-browser survey](https://dev.to/jankapunkt/cross-browser-speech-synthesis-the-hard-way-and-the-easy-way-353)). Any serious implementation needs a sentence-chunking queue.
- **iOS Safari requires a user gesture**: `speak()` outside a tap/click handler is dropped silently (WebKit's `SpeechSynthesis` has an explicit [`userGestureRequiredForSpeechStart` restriction](https://github.com/WebKit/webkit/blob/main/Source/WebCore/Modules/speech/SpeechSynthesis.h)). Playback also stops if Safari is backgrounded mid-utterance, and the hardware mute switch silences it ([Apple dev forums](https://developer.apple.com/forums/thread/49875), [weboutloud survey](https://weboutloud.io/bulletin/speech_synthesis_in_safari/)).
- **Remote voices have a privacy and latency cost.** The spec's [`SpeechSynthesisVoice.localService`](https://webaudio.github.io/web-speech-api/) attribute "is true for voices supplied by a local speech synthesizer, and is false for voices supplied by a remote speech synthesizer service" — i.e. with Chrome's Google network voices, the text of the page is sent to Google's servers to be synthesized. The spec has **no privacy-considerations section for synthesis at all**; filtering to `localService === true` voices is the only lever, at the cost of quality on some platforms. The voice list is also a known [fingerprinting surface](https://blog.crawlex.net/blog/speech-synthesis-voices-fingerprint/).

### Assessment

- **Cost:** $0. **Infrastructure:** none. **Latency:** near-instant (local voices).
- **Privacy:** good with local voices; text goes to Google/Apple servers with remote voices unless filtered.
- **Complexity:** deceptively high for a "one-liner" — voice selection UI or heuristics, chunking for Chrome, gesture-gating and lifecycle handling for iOS.
- **Maintenance:** zero as content changes (it reads the DOM/props directly). But the *experience* is unowned: quality varies from "fine" to "robotic" per visitor.

---

## 2. Cloud TTS APIs

### Architecture on a static site

A static export cannot hold an API key secret — anything in client JS is public. Calling a cloud TTS API therefore requires a **serverless proxy** (Vercel/Netlify function or Cloudflare Worker) that holds the key, applies rate limiting, and forwards `{text} → audio`. That is real infrastructure: a key to rotate, a rate limiter to prevent someone burning the quota, CORS config, and cold-start latency (typically a few hundred ms) plus synthesis time on every click. It also means visitor-triggered requests to a third party at read time — the weakest privacy posture of any option here.

### Pricing (first-party pages, checked 2026-09)

| Provider | Free tier | Paid price | Source |
|---|---|---|---|
| OpenAI (`tts-1` / `tts-1-hd` / `gpt-4o-mini-tts`) | none | $15 / $30 per 1M chars; mini-tts $0.60/1M text tokens in + $12/1M audio tokens out | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| Google Cloud TTS | 4M chars/mo (Standard + WaveNet), 1M chars/mo each (Neural2, Studio, Chirp 3 HD), recurring monthly | WaveNet/Neural2 $16/1M, Chirp 3 HD $30/1M, Studio $160/1M | [GCP pricing](https://cloud.google.com/text-to-speech/pricing) |
| Amazon Polly | first 12 months only: 5M std / 1M neural / 500K long-form / 100K generative chars/mo | $4 std, $16 neural, $30 generative, $100 long-form per 1M chars | [Polly pricing](https://aws.amazon.com/polly/pricing/) |
| Azure AI Speech | 0.5M neural chars/mo (F0 tier, recurring) | per-1M-char neural pricing (region-dependent; page shows per-region rates) | [Azure pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/) |
| ElevenLabs | 10K credits/mo, **no commercial license** on free tier | Starter $6/mo (30K credits), Creator $22/mo (121K credits) | [ElevenLabs pricing](https://elevenlabs.io/pricing) |
| Deepgram Aura | $200 signup credit | Aura-1 $0.015/1K chars ($15/1M), Aura-2 $0.030/1K ($30/1M) | [Deepgram pricing](https://deepgram.com/pricing) |
| Unreal Speech | 250K chars/mo | from $16/1M chars (volume discounts to ~$8) | [Unreal Speech pricing](https://unrealspeech.com/pricing) |
| PlayHT | 12.5K chars total (trial-sized) | Creator $19/mo, Unlimited $99/mo | [PlayHT pricing](https://playht.co/pricing) |

### Assessment

For a portfolio's traffic, the recurring free tiers (Google's 1M Neural2 chars/mo, Azure's 0.5M) would realistically never be exceeded — the cost problem is not dollars but the **serverless proxy, secret management, and abuse surface** that runtime calls demand. Voice quality is excellent (Neural2/Chirp, Azure Neural, ElevenLabs are the current quality ceiling). Latency is network-bound: fine (~0.5–2s to first audio) but never instant. Privacy is the worst of the families: every listen sends page text to a third-party API. Runtime cloud TTS is hard to justify for static, rarely-changing content — though a cloud free tier used **at build time** (family 4) sidesteps every one of these problems.

---

## 3. Client-side / in-browser ML models

### Kokoro (kokoro-js)

[Kokoro-82M](https://github.com/hexgrad/kokoro) is an 82M-parameter open-weight TTS model, Apache-2.0 licensed, whose quality is widely regarded as remarkable for its size. [kokoro-js](https://github.com/hexgrad/kokoro/blob/main/kokoro.js/README.md) runs it fully in the browser via Transformers.js/ONNX Runtime Web, with dtypes fp32/fp16/q8/q4/q4f16 and devices `wasm` (default) or `webgpu`, 28 English voices, and a `TextSplitterStream` for streaming synthesis. Model download sizes from the [ONNX weights repo](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX): **326 MB fp32, 163 MB fp16, ~92 MB q8, ~86 MB q8f16**. Reported performance: roughly real-time-or-better on WebGPU (~10s of audio in ~1s on a decent GPU, per the [Kokoro WebGPU demo coverage](https://news.ycombinator.com/item?id=42973769) and [Xenova's announcement](https://huggingface.co/posts/Xenova/620657830533509)); on WASM/CPU it is markedly slower — usable on fast desktops, sluggish on phones.

### Piper via WASM

Piper is "a fast and local neural text-to-speech engine" ([OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl)); note the current first-party repo is **GPL-3.0** (the older rhasspy/piper era was MIT, and the voice models carry their own licenses). Community WASM ports such as [@mintplex-labs/piper-tts-web](https://github.com/Mintplex-Labs/piper-tts-web) compile the whole pipeline — espeak-ng phonemizer plus ONNX inference — to WebAssembly. Piper voices are much smaller than Kokoro (tens of MB) and fast even on CPU, but quality is a clear step below Kokoro, and the maintained web ports are community forks, not first-party.

### Other Transformers.js TTS

Transformers.js [officially supports SpeechT5 and VITS (the MMS-TTS architecture)](https://huggingface.co/docs/transformers.js/index) via the `text-to-speech` pipeline. Both are noticeably worse than Kokoro for English and offer no advantage here.

### WebGPU browser support

Per [caniuse](https://caniuse.com/webgpu): Chrome/Edge 113+ on desktop, Chrome for Android, Samsung Internet 24+, and — as of September 2025 — **Safari 26 on macOS, iOS, iPadOS and visionOS** ([WebKit: "WebGPU … is now shipping in Safari 26"](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)). Firefox still ships it disabled by default on desktop as of v159. Global support ≈ 87%. So a WebGPU-only path strands Firefox users and anyone on older Safari; kokoro-js falls back to WASM, which works everywhere but slowly.

### Assessment

- **Cost:** $0 (bandwidth of serving ~90–160 MB of weights, or let visitors pull them from Hugging Face's CDN).
- **Quality:** Kokoro is genuinely good — better than most OS voices.
- **Latency:** the killer. Before the first word plays, the visitor downloads ~90 MB+ and warms up inference. For a portfolio page a visitor spends two minutes on, that is absurd; on mobile data it is hostile.
- **Privacy:** perfect — text never leaves the device (after the one-time model fetch).
- **Complexity/maintenance:** moderate (worker setup, caching weights in the browser, WASM fallback path), zero per content change.

Right architecture for a TTS *product*; wrong trade for a portfolio.

---

## 4. Build-time pre-generated audio (static files + `<audio>`)

### Architecture

Treat audio like any other build artifact. The listenable copy lives in the repo/config (it already does — the site content is in `src/config/site.ts` and section components). At build time, a script:

1. Extracts each listenable text block.
2. Hashes the text (e.g. SHA-256 of the normalized string, first 8–12 hex chars).
3. If `public/audio/<slug>.<hash>.mp3` already exists, skips it; otherwise runs the TTS engine and writes the file, deleting stale hashes.
4. Emits a small manifest (`audio-manifest.json`, or a generated TS module) mapping block → file + duration.

The player is then a plain `<audio>` element (or a styled play button driving one). `<audio>` has been universal in every browser for over a decade; iOS treats a tap-to-play as the user gesture, no quirks. Note the existing memory rule: the resume-sync action owns `public/cv/` only — the rest of `public/` is portfolio-owned, so `public/audio/` is safe.

### Which engine to generate with

- **Kokoro locally / in CI** (Apache-2.0, `pip install kokoro`): best quality-for-free; runs fine on CPU for a handful of paragraphs ([hexgrad/kokoro](https://github.com/hexgrad/kokoro)).
- **Piper locally / in CI** ([piper1-gpl](https://github.com/OHF-Voice/piper1-gpl)): fastest, smallest; GPL-3.0 applies to the engine you run, not the MP3s it outputs — build-time use is unproblematic.
- **A cloud free tier at build time**: e.g. Google Neural2's recurring [1M free chars/month](https://cloud.google.com/text-to-speech/pricing) regenerates this entire site's text thousands of times over. The key lives in CI secrets, never in the client. Top-shelf quality, still $0.

Because generation is hash-gated and content rarely changes, the pragmatic setup is to run the script **locally** and commit the MP3s (a few hundred KB–few MB total; ~1 MB per ~10 min of 128kbps-ish speech, far less at spoken-word bitrates like 48–64 kbps mono). CI integration is optional polish, not a requirement.

### Storage and bandwidth on static hosts

A spoken-word MP3/Opus of the site's full text is single-digit MB. That is noise against every host's limits: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) allows 1 GB per site and a 100 GB/month soft bandwidth limit; [Cloudflare Pages serves static assets free and unlimited on the free plan](https://developers.cloudflare.com/pages/functions/pricing/); Vercel Hobby and Netlify free tiers (100 GB-class transfer / credit-based) are likewise unthreatened. Audio files are immutable-by-hash, so they cache perfectly at the CDN and in browsers.

### Assessment

- **Cost:** $0. **Infrastructure:** none at runtime — just static files.
- **Quality:** whatever the best free engine produces, **auditioned once by the owner** and identical for every visitor. (Per the repo's working agreement, generated audio should be reviewed before committing, same as visual assets.)
- **Latency:** effectively zero — `<audio>` streams progressively from the CDN on tap.
- **Privacy:** excellent — visitors fetch a static file from the same host as the page; no third party sees anything at read time.
- **Compatibility:** universal; `<audio>` predates every quirk discussed above.
- **Complexity:** one ~100-line generation script + a small player component.
- **Maintenance:** edit text → run `pnpm generate:audio` → only changed blocks regenerate (hash check) → commit. The main failure mode is forgetting to regenerate; a cheap CI guard can diff manifest hashes against source text and fail the build if they drift.

---

## 5. Hybrid / progressive enhancement

Two sensible combinations:

- **Pre-generated audio, Web Speech fallback:** serve MP3s as the primary path; if a block has no audio yet (hash drift, new section), fall back to `speechSynthesis` so the button never breaks. Cheap insurance, small code cost.
- **Web Speech as v0, upgrade later:** ship a `speechSynthesis` button in an afternoon behind a capability check (`'speechSynthesis' in window`), learn whether anyone actually uses it (the site already instruments interactions with Umami events), and only invest in generation if the event data says visitors care. This is the leanest way to de-risk the whole feature.

---

## Comparison

| | Web Speech API | Cloud API (runtime) | In-browser ML (Kokoro) | Pre-generated static audio |
|---|---|---|---|---|
| Cost | $0 | $0 within free tiers + proxy | $0 | $0 |
| Runtime infra | none | serverless proxy + key + rate limiting | none | none |
| Voice quality | uncontrolled, varies per OS/browser | excellent | good (Kokoro) | excellent & consistent; owner-auditioned |
| Latency to first audio | instant (local voices) | ~0.5–2 s + cold starts | 90 MB+ download first | instant (CDN stream) |
| Privacy | good if `localService` voices; text to Google/Apple otherwise | text sent to vendor per listen | perfect after model fetch | perfect (same-origin static file) |
| Browser compat | universal API, quirky behavior (iOS gesture, Chrome 15 s bug) | universal (it's just fetch+audio) | WebGPU ≈87%, WASM slow fallback | universal (`<audio>`) |
| Implementation effort | medium (chunking, voice pick, iOS handling) | high (proxy, secrets, abuse) | high (workers, weights, fallback) | low–medium (script + player) |
| Maintenance per content change | zero | zero | zero | regenerate changed blocks (hash-gated, scriptable) |

---

## Recommendation

**Primary: build-time pre-generated audio (family 4).** Generate MP3/Opus files with Kokoro (or Piper) running locally via a hash-gated script, commit them under `public/audio/`, and play them with a styled `<audio>` control. It is the only option that hits *every* stated constraint simultaneously: $0 with no API key anywhere, zero runtime infrastructure (it is just more static files — perfectly aligned with the existing static export), best-in-class and — critically — *consistent, owner-auditioned* voice quality, instant playback, same-origin privacy, and universal browser support with none of the Web Speech API's per-platform quirks. The maintenance cost (rerun a script when text changes) is real but small, mechanical, and CI-guardable, whereas the alternatives' costs are ones you can't engineer away: Web Speech's quality lottery, cloud APIs' proxy/key/abuse surface, and in-browser ML's 90 MB toll on first listen.

**Runner-up: Web Speech API as progressive enhancement.** Zero build tooling and zero bytes shipped; a fine v0 for gauging demand via the site's existing Umami events, or as a permanent fallback layer under the pre-generated audio — provided it is implemented with sentence-chunking (Chrome's [15-second cutoff](https://issues.chromium.org/issues/41294170)), gesture-gated playback (iOS), `voiceschanged`-aware voice selection, and a preference for `localService` voices for privacy.

---

## Sources

Primary sources cited inline above; key ones:

- Web Speech API Draft CG Report — https://webaudio.github.io/web-speech-api/
- MDN `SpeechSynthesis` — https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- Chromium issues 41294170, 41346274 — https://issues.chromium.org/issues/41294170, https://issues.chromium.org/issues/41346274
- WebKit `SpeechSynthesis.h` (user-gesture restriction) — https://github.com/WebKit/webkit/blob/main/Source/WebCore/Modules/speech/SpeechSynthesis.h
- OpenAI API pricing — https://developers.openai.com/api/docs/pricing
- Google Cloud TTS pricing — https://cloud.google.com/text-to-speech/pricing
- Amazon Polly pricing — https://aws.amazon.com/polly/pricing/
- Azure AI Speech pricing — https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/
- ElevenLabs pricing — https://elevenlabs.io/pricing
- Deepgram pricing — https://deepgram.com/pricing
- Unreal Speech pricing — https://unrealspeech.com/pricing ; PlayHT pricing — https://playht.co/pricing
- Kokoro / kokoro-js — https://github.com/hexgrad/kokoro , https://github.com/hexgrad/kokoro/blob/main/kokoro.js/README.md
- Kokoro-82M ONNX weights (sizes, Apache-2.0) — https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
- Piper (GPL-3.0) — https://github.com/OHF-Voice/piper1-gpl ; WASM port — https://github.com/Mintplex-Labs/piper-tts-web
- Transformers.js supported models — https://huggingface.co/docs/transformers.js/index
- WebGPU support — https://caniuse.com/webgpu ; Safari 26 — https://webkit.org/blog/17333/webkit-features-in-safari-26-0/
- GitHub Pages limits — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Cloudflare Pages pricing (free static assets) — https://developers.cloudflare.com/pages/functions/pricing/
