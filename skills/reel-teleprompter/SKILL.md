---
name: reel-teleprompter
description: Launch a free, private browser teleprompter that records Instagram Reels, Shorts and TikToks (9:16, 4:5, 1:1, 16:9) from the laptop webcam, optionally with a shared screen or window, or the user's own videos, images and PDFs, in split screen or behind a background-removed cutout of the user, plus drawing tools, AI noise removal and a floating preview. Use when the user wants to record a reel or talking-head video, use a teleprompter, record their screen with their face, or says "record a reel about X", "open the teleprompter", "teleprompter for Instagram". Can also draft the script and preload it.
license: MIT OR Apache-2.0
---

# Reel Teleprompter

A single-page recorder in `app/` next to this file. Everything runs in the user's
browser: camera, screen capture, mixing and encoding. Nothing is uploaded, and the
skill needs no API keys and no installs beyond Python 3 (for a local static server).

## Launch it

1. Resolve the absolute path of the `app/` directory beside this `SKILL.md`.
2. Pick a free port (try 8777, then 8778, ...) and start a static server bound to
   localhost **in the background**, so it keeps running:

   ```bash
   python3 -m http.server 8777 --bind 127.0.0.1 --directory "<skill-dir>/app"
   ```

   Use `127.0.0.1`, not a LAN address: browsers only allow camera and microphone on
   `localhost`/`127.0.0.1` or HTTPS.
3. Open `http://127.0.0.1:8777/app.html` in the user's normal browser (macOS: `open <url>`;
   Linux: `xdg-open`; Windows: `start`). Chrome or Safari is recommended. In-editor
   preview panes usually block camera and mic, so do not use them.
4. Tell the user to allow camera and microphone. Leave the server running; stop it
   when they say they are done.

## Preloading a script

If the user gives a topic or a script, put it in the URL fragment, URL-encoded:

```
http://127.0.0.1:8777/app.html#script=<encodeURIComponent(script)>
```

The page adds it as a saved script and clears the fragment. The fragment never
reaches any server.

When drafting a script for a Reel:
- Open with a hook the viewer understands in the first 2-3 seconds.
- Short spoken lines, one idea per line, a line break after each sentence.
- 75-150 words for 30-60 seconds; end with one clear call to action.
- Write it in the user's language and voice; do not invent facts, numbers or claims
  about their product. Ask if you need them.

## What to tell the user (only what is relevant)

- **Format**: 9:16 Reels is the default (1080x1920). The webcam is centre-cropped.
- **Mic**: pick it in the Microphone list; set Mic boost so the meter reaches yellow.
  "Noise removal (AI)" is on by default; untick it if the voice sounds thin.
- **Screen + face**: "Add screen / window", then a layout (split, face bubble). Auto
  split leaves no gap. When the screen is cropped, drag the yellow box on the screen
  map to choose the recorded part.
- **Your files as background**: Background → "My files" → Add files (or drag files onto
  the page): videos, images and PDFs play as a slideshow; Prev/Next or [ and ] keys.
- **Cutout**: Layout → "Cutout: me over full background" removes the camera background
  on-device; drag yourself on the preview to move, "Cutout size" to resize. Good light
  and a plain wall behind the user give the cleanest edge.
- **Drawing**: Pen, Highlight, Circle, Arrow draw onto the recording; C clears, Esc exits.
- **Floating preview** (Chrome): an always-on-top window with the prompter, preview
  and record button. Share a single window, not the entire screen, so it is not recorded.
- **Keys**: Space play/pause text, arrows move the text, R record/stop, P pause.
- **Output**: MP4 in Chrome and Safari (WebM elsewhere, which Instagram may reject).
  Downloaded by the browser; nothing is saved by this skill.
- **macOS screen sharing** needs Screen Recording permission for the browser in
  System Settings, Privacy & Security; the browser may need a restart once.

The phone remote only works on the hosted/self-deployed version (it needs the
Cloudflare relay in the repository); it stays hidden when served locally.

## Do not

- Do not serve on `0.0.0.0` or a public interface.
- Do not upload, copy or read the user's recordings; they stay in their Downloads.
- Do not edit files in `app/` to change behaviour for one session.
