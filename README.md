# Reel Teleprompter

A free, private browser teleprompter that records Instagram Reels, Shorts and
TikToks from your laptop webcam, packaged as an agent skill for Codex, Claude Code
and other coding agents. No sign-up, no watermark, nothing uploaded.

## What it does

| Feature | What it does | Benefit |
|---|---|---|
| Reel-ready sizes | Records 9:16 (1080×1920), 4:5 (1080×1350), 1:1 or 16:9 straight from a landscape laptop webcam, centre-cropped | Post directly to Instagram, Shorts or TikTok; no cropping in an editor |
| Teleprompter | Script scrolls in a box under the camera with adjustable speed, font size, background and a reading-line highlight; 3-2-1 countdown starts text and recording together | Read naturally while your eyes stay near the lens |
| Never lose your place | Move the text back or ahead with the trackpad, arrow keys, a presenter clicker, or your phone as a remote (hosted version) | Fix a missed line without restarting the take |
| Saved scripts | Several scripts kept in the browser, named by their first line; an agent can draft one and preload it | Switch between reels quickly; "record a reel about X" works in one prompt |
| Screen + face, split screen | Share any app window or the whole screen; layouts: screen above you, you above screen, side by side (16:9), or full screen with a round face bubble | Tutorials, demos and reaction videos in one take |
| No gap, exact framing | Screen and camera meet edge to edge; Auto split sizes the screen to its own shape; a screen map with a draggable yellow box shows and picks the recorded part when it is cropped | Clean, professional split screen; you always know what viewers will see |
| Draw while recording | Pen, highlight, circle and arrow drawn onto the video, with optional 3-second fade; C clears, Esc exits | Point at what matters without editing later |
| Floating preview | Always-on-top window (Chrome) with the prompter, a live preview you can draw on, and record controls; not captured when you share a single window | Watch exactly what is being recorded while you work in another app |
| Clean audio | Choose any mic (USB, wireless lapel, built-in); raw capture without call-style processing; AI noise removal (RNNoise); 80 Hz rumble filter; boost with compressor and limiter; live level meter | Studio-like voice: fan, AC and hiss removed, loud enough, no clipping |
| Take control | Pause and resume into one file, play back the take, then download | Fewer retakes, nothing posted by accident |
| Instagram safe zone | Overlay showing where the caption and buttons will cover the video | Keep faces and text visible after posting |
| Private by design | Camera, screen, mixing and encoding all run in the browser; no account, no upload, no watermark | Safe for client work and unreleased products; free to run |

## Requirements

| Item | Needed |
|---|---|
| Browser | Chrome or Safari on macOS, Windows or Linux (MP4 output). Firefox works but records WebM, which Instagram may reject |
| Local use / agent skill | Python 3 (used only as a static file server on `127.0.0.1`) |
| Agent | Any agent that loads skills via the Skills CLI, for example Codex or Claude Code |
| Floating preview | Chrome (Document Picture-in-Picture); Safari gets a plain video preview |
| Screen recording on macOS | Screen Recording permission for the browser (System Settings → Privacy & Security) |
| Phone remote | The hosted or self-deployed Cloudflare version (needs the small relay Worker) |
| Self-hosting (optional) | A Cloudflare account and Node.js for `wrangler` |

## Install as an agent skill

With the [Skills CLI](https://skills.sh):

```bash
npx skills add https://github.com/TestwinPlay/reel-teleprompter --skill reel-teleprompter
```

Add `--global` for a user-level install. Run `npx skills --help` to pick agents
(for example Codex or Claude Code) and for non-interactive options.

## Usage

Ask your agent:

```
open the teleprompter
```

```
record a reel about why I switched to a standing desk
```

The agent starts a local server on `127.0.0.1`, opens the recorder in your browser,
and (for the second prompt) drafts the script and preloads it. Recording happens in
your browser and the file goes to your Downloads.

### Without an agent

Python 3 is the only requirement:

```bash
python3 -m http.server 8777 --bind 127.0.0.1 --directory skills/reel-teleprompter/app
```

Then open http://127.0.0.1:8777/app.html in Chrome or Safari.

## Architecture

```
skills/reel-teleprompter/
  SKILL.md           agent instructions (launch, preload script, user tips)
  app/               the whole product: static pages, served locally or by Cloudflare
    index.html       landing page
    app.html         teleprompter + recorder (/app)
    remote.html      phone remote (/remote, hosted version only)
    vendor/noise/    RNNoise worklet + wasm from @sapphi-red/web-noise-suppressor
                     (`npm run vendor` refreshes it after an upgrade)
src/worker.js        optional Cloudflare Worker: phone-remote relay under /api/*
wrangler.jsonc       Cloudflare config: dev (top level), staging, production
```

- **Recording is 100% client-side.** Camera (`getUserMedia`) and optional screen or
  window (`getDisplayMedia`) play in hidden `<video>` elements. A compositor draws
  them into one visible `<canvas>` at the output size (camera only, split
  screen+camera, camera+screen, or screen with a round face bubble). That canvas is
  both the preview and the recording: `canvas.captureStream(30)` + processed mic →
  `MediaRecorder` (MP4 if supported, else WebM) → Blob download. Nothing reaches
  the server.
- **The compositor is driven by a Web Worker timer**, not `requestAnimationFrame`:
  rAF stops when the browser window is covered, which is exactly when someone is
  demoing another app during a screen recording.
- **Audio** is captured with the browser's `echoCancellation`, `noiseSuppression`
  and `autoGainControl` all off: browser call-processing made an external lapel mic
  sound dull. The raw signal then goes through a Web Audio chain at 48 kHz:
  RNNoise (AI noise removal, checkbox, on by default) → 80 Hz high-pass → boost
  slider → compressor → limiter → recording and level meter. Recorded at 256 kbps.
  RNNoise loads lazily; if it fails, the chain runs without it and the page says so.
- **Split screen never shows a gap**: both parts are filled edge to edge. "Auto
  split" sizes the screen part to the shared window's own shape (clamped 25–75%), so
  it is neither cropped nor letterboxed. With a manual share or the bubble "fill"
  option the screen is cropped; a map in the panel shows the whole shared screen
  with a yellow box on the recorded part, and dragging the box moves the crop.
- **Drawing on the recording** (pen, highlight, circle, arrow; optional 3 s fade) is
  stored in output-canvas pixels and drawn by the compositor, so it is recorded.
  Strokes can be drawn on the main preview or the floating preview.
- **Floating preview** uses Chrome's Document Picture-in-Picture: an always-on-top
  window holding the real prompter element, a live preview you can draw on, and
  record/text/tool buttons. It is a separate window, so sharing one app window does
  not record it (sharing the entire screen does). Safari falls back to plain video
  picture-in-picture (preview only).
- **Phone remote relay.** `app.html` creates a random 6-character room code (kept
  in `sessionStorage`) and opens a WebSocket to `/api/room/<CODE>/ws`. The phone
  page POSTs `/api/room/<CODE>/cmd/<command>`. One Durable Object (`Room`) per code
  forwards the command to the sockets in that room. Uses the WebSocket hibernation
  API, so idle rooms cost nothing.
- Scripts are stored in the viewer's `localStorage` only. An agent can hand one over
  in the URL fragment (`app.html#script=<url-encoded>`); the page saves it and clears
  the fragment, which browsers never send to a server.
- Served locally, there is no relay, so the phone-remote line stays hidden.

## Data schema

No database. Durable Object `Room` (SQLite-backed class, migration tag `v1`) stores
nothing; it only holds WebSocket connections.

## API endpoints

| Method | Path | Result |
|---|---|---|
| GET (Upgrade: websocket) | `/api/room/<CODE>/ws` | teleprompter joins room; receives command strings |
| POST | `/api/room/<CODE>/cmd/<command>` | 204 delivered · 404 no teleprompter on that code · 400 bad command |

`<CODE>` = 6 chars `[A-Z2-9]`. `<command>` ∈ `play`, `back`, `ahead`, `rec`, `pause`.
Anything else under `/api` → 400/404.

## Environments

| Env | Worker name | Deploys from | URL |
|---|---|---|---|
| local | `reel-teleprompter-dev` | `npm run dev` | http://127.0.0.1:8787 |
| staging | `reel-teleprompter-staging` | `npm run deploy:staging` (manual) | `reel-teleprompter-staging.<your-subdomain>.workers.dev` |
| production | `reel-teleprompter` | `npm run deploy:production` (manual) | not deployed yet; custom domain not chosen |

No secrets. The Cloudflare account comes from `CLOUDFLARE_ACCOUNT_ID` or the account
you are logged in with; it is deliberately not in `wrangler.jsonc`.

## Deploy and rollback

```
npm install
npx wrangler login            # once per machine
npm run deploy:staging        # test on the workers.dev URL
npm run deploy:production
```

Rollback: `npx wrangler rollback --env production` (picks the previous version), or
`npx wrangler versions list --env production` then deploy a specific version.

Camera access needs HTTPS (or localhost); workers.dev and custom domains are HTTPS.

## Design decisions

- **Static + one tiny Worker**, not a framework: three HTML files need no build step.
- **Shipped as an agent skill**: the app lives inside the skill folder, so `npx skills add`
  installs a working recorder and the hosted site deploys the same files.
- **Client-side recording**: privacy is a selling point, and it costs nothing to host.
- **Mirror on by default** in preview and output, toggleable.
- **Safe-zone overlay** uses 14% top / 35% bottom / 6% sides, taken from Meta's
  published Reels guidance. Assumed, not measured against the live app.
- **Phone remote has no auth beyond the room code** (~1 billion combinations). Worst
  case a guesser can scroll text or start/stop a recording on someone's screen; video
  never leaves the device. Add rate limiting if abuse appears.

## Known limits

- Screen recording captures picture only, no system/app audio (mic is recorded).
  macOS asks once for Screen Recording permission for the browser (System Settings →
  Privacy & Security → Screen Recording); the browser may need a restart after.

- The floating window cannot be translucent (OS windows) and the browser cannot draw
  a marker on other apps; the in-panel screen map shows the recorded area instead.
- Firefox cannot record MP4; the app warns and records WebM (Instagram may reject it).
- Layout is designed for laptops; phones get a stacked layout but are not the target.
- No analytics yet: enable Cloudflare Web Analytics in the dashboard once the domain is set.

## Changelog

- 2026-10-22: Local prototype (single HTML + Python server) turned into a Cloudflare
  Workers project: landing page, `/app`, `/remote`, Durable Object relay replacing the
  LAN-only Python polling server, MP4 warning, mobile stacked layout. Verified locally
  with `wrangler dev`: routes, bad-input rejection, and relay delivery (WebSocket
  receives a POSTed command). Camera/mic recording is not covered by automated checks.
- 2026-10-22: First staging deploy, version `30b9d199-2420-4b6b-925f-36f821e4bb7f`.
  Measured on the live URL: `/`, `/app`, `/remote`, `/robots.txt` return 200; unknown
  path 404; bad command 400; command with no listener 404; WebSocket receives a POSTed
  command (relay works through Cloudflare). Camera/mic recording not yet tested on staging.
- 2026-10-22: Audio too quiet with auto gain off (macOS input volume measured at 38%).
  Added a Web Audio chain before recording: mic → boost (slider 0–24 dB, default +12)
  → compressor (−24 dB, 3:1) → limiter (−2 dB, 20:1) → recording and level meter.
  Measured in-browser with a test tone: 0.05 peak in → 0.385 out at +12 dB; 0.9 in at
  +24 dB → 0.955 out (no clipping). Not yet verified with the real Digitek mic.
- 2026-11-01: Screen recording with split screen. "Add screen / window" uses
  `getDisplayMedia` (macOS picker: a window or the whole screen). Layouts: split
  screen+me, split me+screen (stacked for 9:16/4:5/1:1, side by side for 16:9; screen
  share 30–75%), screen with face bubble (kept above the Reels caption area), me only.
  The canvas is now always on and is the preview. Measured in-browser with synthetic
  sources: each layout puts screen/camera pixels in the expected regions at 1080×1920
  and 1920×1080. Not yet verified with a real screen share or with the window covered.
- 2026-11-01: Removed the black gap in split screen (screen filled edge to edge; new
  default "Auto split" matches the shared window's shape). Added a draggable map of
  the recorded screen area, drawing tools (pen, highlight, circle, arrow, clear,
  3 s fade), a floating always-on-top preview (Document Picture-in-Picture), and
  RNNoise AI noise removal replacing the browser's call-style suppression, plus an
  80 Hz high-pass. Measured in-browser with synthetic sources: 0 black rows between
  screen and camera in auto and 40% manual split; crop box follows the focus point;
  a drawn circle appears in the recorded canvas; RNNoise loads (SIMD wasm, 48 kHz) and
  cuts white noise by 29.6 dB. Not measured: effect on a real voice, the floating
  window (the in-app test browser does not open one), real screen share.
- 2026-11-01: Open-sourced as an agent skill. App moved from `public/` to
  `skills/reel-teleprompter/app/` (Cloudflare assets directory updated), `SKILL.md`
  added, script preload via URL fragment, phone-remote line hidden when no relay
  answers, landing link points at `/app.html` so plain static servers work, account ID
  removed from `wrangler.jsonc`. Licensed MIT OR Apache-2.0 with third-party notices.

## License

Copyright (c) 2026 TestwinPlay / Aakash Singh.

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or
[MIT license](LICENSE-MIT), at your option. Bundled third-party code keeps its own
licence; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for
inclusion in this project by you, as defined in the Apache-2.0 license, shall be
dual-licensed as above, without any additional terms or conditions.
