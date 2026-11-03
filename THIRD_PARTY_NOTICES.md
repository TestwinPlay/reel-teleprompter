# Third-party notices

Reel Teleprompter is licensed under MIT OR Apache-2.0 (see LICENSE-MIT and
LICENSE-APACHE). It bundles the following third-party code in
`skills/reel-teleprompter/app/vendor/`, which keeps its own licence.

## @sapphi-red/web-noise-suppressor 0.4.1 (MIT)

Files: `index.js`, `rnnoiseWorklet.js`. Source: https://github.com/sapphi-red/web-noise-suppressor

```
MIT License

Copyright (c) 2022 翠 / green

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## shiguredo/rnnoise-wasm (Apache-2.0)

WebAssembly build of RNNoise used by the files above (`rnnoise.wasm`,
`rnnoise_simd.wasm`, and the loader inside `rnnoiseWorklet.js`).
Source: https://github.com/shiguredo/rnnoise-wasm. Licensed under the Apache License,
Version 2.0; the full text is in LICENSE-APACHE.

## xiph/rnnoise (BSD-3-Clause)

The noise-suppression library compiled into `rnnoise.wasm` and `rnnoise_simd.wasm`.
Source: https://github.com/xiph/rnnoise

```
Copyright (c) 2007-2017, 2024 Jean-Marc Valin
Copyright (c) 2023 Amazon
Copyright (c) 2017, Mozilla
Copyright (c) 2005-2017, Xiph.Org Foundation
Copyright (c) 2003-2004, Mark Borgerding

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

- Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

- Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

- Neither the name of the Xiph.Org Foundation nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE FOUNDATION
OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## Google MediaPipe Tasks Vision 1.2.0 and the Selfie Segmenter model (Apache-2.0)

Files: `vendor/mediapipe/vision_bundle.mjs`, `vendor/mediapipe/wasm/*`,
`vendor/mediapipe/selfie_segmenter.tflite`. Used for on-device background removal.
Source: https://github.com/google-ai-edge/mediapipe. Copyright Google LLC. Licensed
under the Apache License, Version 2.0; the full text is in LICENSE-APACHE.

## Mozilla PDF.js 6.5.438 (Apache-2.0)

Files: `vendor/pdfjs/pdf.min.mjs`, `vendor/pdfjs/pdf.worker.min.mjs`,
`vendor/pdfjs/standard_fonts/*`. Used to show PDF pages. Source:
https://github.com/mozilla/pdf.js. Copyright Mozilla Foundation and contributors.
Licensed under the Apache License, Version 2.0 (`vendor/pdfjs/LICENSE`). The standard
fonts directory contains fonts under their own permissive licences, listed in
`vendor/pdfjs/standard_fonts/`.
