# Herkunft (Hintergrund-Erkennung im Videoportal)

- `vision_bundle.mjs`, `wasm/vision_wasm_internal.*`: npm-Paket `@mediapipe/tasks-vision` 0.10.21 (Google, Apache License 2.0). Unverändert, nur der Verweis auf die Source-Map entfernt.
- `selfie_segmenter.tflite`: MediaPipe-Modell „Selfie Segmenter“ (Google, Apache License 2.0), von storage.googleapis.com/mediapipe-models.

Die Dateien liegen bewusst auf der eigenen Website: Beim Videogespräch wird keine Verbindung zu Google aufgebaut, und das Kamerabild verlässt für die Hintergrund-Erkennung nicht das Gerät.
Die Variante ohne SIMD (`vision_wasm_nosimd_internal.*`) ist nicht enthalten; sehr alte Browser bieten den Hintergrund daher nicht an.
