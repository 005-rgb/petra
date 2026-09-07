# RUSH RIDER: JAKARTA

Production handoff package for the mobile-first game defined in the attached PRD.

## Current status

**Phase 0 — Pre-production & Scope Lock: COMPLETED**
**Phase 1 — Gameplay Prototype: COMPLETED**

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
```

The browser prototype is an executable gameplay validation layer while the imported
repository has no Unity project yet. The Unity implementation can use the same
locked values and greybox contract from `docs/phase-0/`.