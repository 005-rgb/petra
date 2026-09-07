# Physical profiler captures

This directory accepts only captures produced from real Unity/Android sessions.
Do not add guessed, simulated, or browser-only values.

Create a capture with:

```bash
python tools/profile_capture.py \
  --milestone M1 --build 03 --device-tier floor \
  --device-model "<actual model>" --os-version "<actual Android>" \
  --gpu-driver "<actual driver>" --refresh-rate-hz 60 \
  --free-storage-gb 20 --scenario route90 \
  --metrics-file /path/to/unity-metrics.json
```

The output filename follows the addendum convention:
`<milestone>-build-<device>-<scenario>-<date>.json`.
The metrics file must contain every key in
`config/addendum/capture-schema.json`.