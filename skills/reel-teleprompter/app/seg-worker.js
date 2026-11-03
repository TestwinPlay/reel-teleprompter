// SPDX-License-Identifier: MIT OR Apache-2.0
// Background removal off the main thread: the page posts a small camera frame, this
// worker runs the MediaPipe selfie segmenter and posts back the person mask.
import { FilesetResolver, ImageSegmenter } from '/vendor/mediapipe/vision_bundle.mjs';

let segmenter = null;

onmessage = async ({ data }) => {
  if (data.init) {
    try {
      // true = the module build of the engine, which loads inside a module worker
      const files = await FilesetResolver.forVisionTasks('/vendor/mediapipe/wasm', true);
      const make = delegate => ImageSegmenter.createFromOptions(files, {
        baseOptions: { modelAssetPath: '/vendor/mediapipe/selfie_segmenter.tflite', delegate },
        runningMode: 'VIDEO', outputCategoryMask: false, outputConfidenceMasks: true,
      });
      segmenter = await make('GPU').catch(() => make('CPU'));
      postMessage({ ready: true });
    } catch (e) {
      postMessage({ error: e.message });
    }
    return;
  }
  const { bitmap, ts } = data;
  let mask = null;
  try {
    segmenter.segmentForVideo(bitmap, ts, res => {
      const m = res.confidenceMasks?.[0];
      // copy: the mask's memory belongs to MediaPipe and is reused next frame
      if (m) mask = { conf: new Float32Array(m.getAsFloat32Array()), w: m.width, h: m.height };
    });
  } catch (e) { /* skip this frame */ }
  bitmap.close();
  postMessage({ mask }, mask ? [mask.conf.buffer] : []);
};
