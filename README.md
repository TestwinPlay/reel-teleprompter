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

Add `--global` to install for all projects.

## Usage

Ask your agent:

```
open the teleprompter
```

```
record a reel about why I switched to a standing desk
```

The agent opens the recorder in your browser and, for the second prompt, drafts and
preloads the script. Recordings go to your Downloads.

### Without an agent

```bash
python3 -m http.server 8777 --bind 127.0.0.1 --directory skills/reel-teleprompter/app
```

Then open http://127.0.0.1:8777/app.html in Chrome or Safari.

## Self-host on Cloudflare (optional)

Adds a public link and the phone remote.

```bash
npm install
npx wrangler login
npm run deploy:production
```

## License

Copyright (c) 2026 TestwinPlay / Aakash Singh.

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or
[MIT license](LICENSE-MIT), at your option. Bundled third-party code keeps its own
licence; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for
inclusion in this project by you, as defined in the Apache-2.0 license, shall be
dual-licensed as above, without any additional terms or conditions.
