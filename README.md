# RUSH RIDER: JAKARTA

Production handoff package for the mobile-first game defined in the attached PRD.

## Current status

**Phase 0 — Pre-production & Scope Lock: COMPLETED**
**Phase 1 — Gameplay Prototype: COMPLETED — browser baseline audited**

The complete Phase 0 handoff is in [`docs/phase-0/`](docs/phase-0/). It contains:

- locked MVP scope and non-goals;
- Android device tiers and performance budgets;
- numeric control-feel specification;
- Level 1 greybox route and fairness contract;
- risk register;
- original-asset and legal policy;
- ordered Phase 1 gameplay prototype backlog.

Validate the handoff with:

```bash
python tools/validate_phase0.py
```

The repository does not yet contain a Unity project. The next implementation phase starts with Unity + URP bootstrap, followed by the P0 backlog in `docs/phase-0/07-phase-1-backlog.md`.

## Play the Phase 1 prototype

This repository now contains a real, dependency-light browser prototype in `public/`.
It implements the Phase 1 delivery loop: isometric road view, 3-lane movement,
traffic, obstacles, collision/HP, timer, pickup, delivery, reward, restart,
keyboard controls, touch gestures, and mobile action buttons.

Run it with:

```bash
python main.py
```

Then open the Replit preview. Validate the prototype contract with:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
python tools/smoke_phase1.py
```

The browser prototype is an executable gameplay validation layer while the imported
repository has no Unity project yet. The Unity implementation can use the same
locked values and greybox contract from `docs/phase-0/`. The audit and improvement
record is in [`docs/audit/phase-0-1-audit.md`](docs/audit/phase-0-1-audit.md).

The Unity, Android, physical-device profiling, and 3D asset pipeline addendum is
available in [`docs/roadmap-adendum-unity-android-asset-pipeline.docx`](docs/roadmap-adendum-unity-android-asset-pipeline.docx)
and its editable source at
[`docs/roadmap-adendum-unity-android-asset-pipeline.md`](docs/roadmap-adendum-unity-android-asset-pipeline.md).

## Addendum execution pack

The repository now includes the executable foundation for the addendum:

- Unity runtime bootstrap sources and scene templates under [`unity/`](unity/);
- locked device, performance, project, capture, and asset registry configuration
  under [`config/addendum/`](config/addendum/);
- three original low-poly proof assets with collision and LOD meshes under
  [`assets/proof/`](assets/proof/);
- repository and strict evidence gates:
  `python tools/validate_addendum.py` and
  `python tools/validate_addendum.py --strict`;
- physical capture recorder at `python tools/profile_capture.py`.
- Android build evidence recorder at `python tools/record_android_build.py`;
- Unity template preflight at `python tools/check_unity_template.py`.

The strict gate intentionally remains blocked until an approved Unity patch,
Android toolchain, APK builds, and real floor/target device captures are
provided. See [`docs/phase-1/addendum-execution.md`](docs/phase-1/addendum-execution.md)
for the exact handoff sequence and status.