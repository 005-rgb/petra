# Addendum execution pack

**Project:** RUSH RIDER: JAKARTA  
**Date:** 2026-09-07  
**Status:** repository foundation implemented; physical evidence gates pending

This document is the executable companion to
`docs/roadmap-adendum-unity-android-asset-pipeline.md`. It records what is
implemented in this checkout and what cannot honestly be marked complete without
Unity and Android hardware.

## Implemented now

| Addendum requirement | Repository implementation | Gate |
|---|---|---|
| Unity runtime foundation | `unity/Assets/` contains bootstrap, systems, scene templates, and pinned package manifest | PASS — source present |
| Prototype values | `unity/Assets/Data/PrototypeConfig.cs` mirrors the locked 960 m / 90 s / 2.4 m / 0.22 s contract | PASS — source present |
| Deterministic reset | `GameManager`, `PlayerSystem`, `TrafficSystem`, and `MissionSystem` expose reset state | PASS — source present |
| Debug overlay | `DebugOverlay.cs`, F3 toggle, FPS/object count display | PASS — source present |
| Asset proof | three original low-poly OBJ proof assets with collision and LOD meshes | PASS — budget/provenance validator |
| Material/import proof | each proof asset has an original MTL, bounded material variants, and flat-color texture policy | PASS — registry/asset validator |
| Asset provenance | `config/addendum/asset-registry.json` records source, license, reviewer, and permissions | PASS — schema checked |
| Device matrix | floor / target / high tiers and scenario list | PASS — config checked |
| Capture tool | `tools/profile_capture.py` rejects incomplete metrics and records real captures | PASS — executable |
| Android build evidence | `tools/record_android_build.py` records SHA-256, toolchain versions, install result, and refuses overwrite | PASS — executable; no APK evidence yet |
| Clean template gate | `tools/check_unity_template.py` checks packages, scenes, source markers, camera, and touch/keyboard abstraction | PASS — static; Unity editor still required |
| Readiness gate | `tools/validate_addendum.py` separates repo checks from strict evidence | PASS — executable |

## Explicit blockers

These are intentionally not fabricated:

1. exact Unity editor patch approval and generated `ProjectVersion.txt`;
2. Android SDK, NDK, and JDK versions;
3. Android Build 0–3 APK evidence;
4. physical floor and target device models and profiler captures;
5. Android visual review and thermal/battery results;
6. Unity import verification from a clean editor checkout.

The blockers are recorded as `null` / `not_captured` in the lock and registry.
`python tools/validate_addendum.py --strict` must remain failing until real
evidence is added. This is a safety feature: passing without a real APK and
device capture would violate the addendum's hard blockers.

## Commands

```bash
# Repository and source gates; expected to pass with blocker notices.
python tools/validate_addendum.py

# Full pre-Vertical-Slice evidence gate; expected to fail until hardware evidence exists.
python tools/validate_addendum.py --strict

# Existing browser reference contract.
python -m unittest discover -s tests -p 'test_*.py' -v
python tools/smoke_phase1.py
```

## Unity handoff sequence

1. Approve the exact LTS patch and write it to `config/addendum/project-lock.json`.
2. Create a clean Unity project at that exact patch, then copy `unity/Assets` and
   `unity/Packages` into it.
3. Enable Android Build Support, Input System, URP, LandscapeLeft, Linear color
   space, ARM64, and development logging.
4. Open `Prototype_Level01`, verify the 40° camera and core loop, and create
   Android Build 0.
5. Progress through Build 1/2/3; attach APK checksums and install notes to the
   project handoff.
6. Run the same scenarios on actual floor and target devices and record every
   required metric using `tools/profile_capture.py`.
7. Only after P0 is closed, approve the proof asset import and proceed to
   vertical-slice content.

## Current queue completion boundary

The build ledger, clean-template verifier, material metadata, and all repository
checks are implemented. The following two outcomes remain externally blocked
because this workspace has no Unity editor, Android SDK/ADB, or physical device:

- Build 0–3 cannot be truthfully marked generated/installed.
- Production-quality Level 1 art cannot be approved from procedural proof meshes;
  the current assets are complete pipeline proofs, not final campaign art.