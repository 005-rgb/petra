# Fase 1 — Gameplay Prototype

**Status: COMPLETED — browser gameplay baseline audited**

## What was built

The project now contains an executable HTML5 Canvas prototype served by `main.py`.
It is intentionally dependency-light so the imported repository can validate the
gameplay loop before a Unity project is bootstrapped.

### Implemented Phase 1 scope

- isometric 3/4 road presentation;
- 3-lane movement;
- smooth lane movement with locked tuning values;
- jump, brake, boost, and horn;
- traffic entities with lane-relative movement and lane-change telegraph;
- cone and speed-bump obstacles;
- HP and collision damage;
- crash/fail state;
- 90-second timer;
- pickup at the Warung Pojok;
- destination at Apartemen Senja;
- 960 m route;
- shortcut choice at the 460–540 m segment;
- near miss and combo feedback;
- reward calculation;
- delivery success state;
- deterministic restart;
- local progression persistence: cash, completed level, stars, best time, settings, and last-run telemetry;
- 1/2/3-star result evaluation;
- local telemetry markers for the greybox contract;
- basic synthesized audio feedback;
- keyboard and touch gesture controls;
- mobile action buttons;
- responsive HUD and route minimap;
- prototype acceptance tests.

## Controls

### Desktop

- `A` / `←`: move left
- `D` / `→`: move right
- `W` / `↑`: jump
- `S` / `↓`: brake
- `Space`: hold boost
- `H`: horn
- `Escape`: pause

### Touch

- swipe left/right: change lane;
- swipe up: jump;
- swipe down: brake;
- tap: horn;
- on-screen action buttons: direct controls.

## Validation

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
python tools/smoke_phase1.py
```

The tests verify the server, required gameplay systems, locked Phase 0 values,
UI/HUD surfaces, keyboard/touch input, responsive layout, persistence, star
evaluation, telemetry, and audio hooks. The smoke test verifies every public
asset, the favicon compatibility route, and the expected 404 for unknown routes.

## Honest implementation boundary

The imported repository did not contain a Unity project, 3D asset pipeline, or
Android build target. Therefore this phase delivers a working browser gameplay
baseline in the existing Python scaffold rather than claiming a Unity/Android
build that does not exist. The prototype is the playable reference for the later
Unity implementation. See `docs/audit/phase-0-1-audit.md` for the complete audit
record and remaining integration gates.