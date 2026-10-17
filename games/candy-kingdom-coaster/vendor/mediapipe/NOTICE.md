# MediaPipe Gesture Recognizer assets

- JavaScript runtime: `@mediapipe/tasks-vision` **1.1.1**, Apache-2.0, from the
  official npm package. Package metadata reports npm integrity
  `sha512-jwntgT5tzDrKOkqg6xNDNpRcTUnGvmylZE5DFnzPXossiWOIDdZX+C81LI75hlXhsG58YZW+lGzcmjH1qrQE/Q==` (full package integrity is available
  from npm); the application vendors the ESM bundle and SIMD/non-SIMD WASM
  loader/binary files only.
- Gesture model: Google's official MediaPipe **HandGestureClassifier** task
  bundle, float16, currently published at
  <https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task>.
  Model guide/card: <https://developers.google.com/edge/mediapipe/solutions/vision/gesture_recognizer> and <https://storage.googleapis.com/mediapipe-assets/gesture_recognizer/model_card_hand_gesture_classification_with_faireness_2022.pdf>. The model card warns that the model has not been tested under all real-world smartphone-camera conditions; it reports evaluation across perceived skin tones but does not guarantee performance on this user's device.
  Model file size: 8,373,440 bytes. SHA-256:
  `97952348cf6a6a4915c2ea1496b4b37ebabc50cbbf80571435643c455f2b0482`.
  The bytes were obtained from public GitHub mirrors and cross-checked between
  two repositories (same Git blob SHA
  `130d1d08b70743f323a42d4291fda9d54853a2fd`). This sandbox could not fetch the
  Google Storage object directly, so byte-for-byte provenance against that
  endpoint is not independently verified here.
- Model labels include `Victory` (✌️) and `Thumb_Up` (👍). No custom skin/shape
  classification code is used in production. The model card reports a 95.5%
  weighted SS F1 across perceived Monk Skin Tone groups on its evaluation set,
  but warns that in-the-wild smartphone-camera conditions were not tested.

The MediaPipe JavaScript/WASM runtime is redistributed under Apache License 2.0;
see [`LICENSE`](./LICENSE). Do not infer that the SDK license automatically
covers the separate `.task` model. Its model-specific license grant was not
independently established in this change; review/confirm it before external
redistribution. The linked Google model card describes intended use, evaluation,
limitations, and dataset/bias notes, but is not itself a license grant.
