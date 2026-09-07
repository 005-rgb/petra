# RUSH RIDER: JAKARTA

Production handoff package for the mobile-first game defined in the attached PRD.

## Current status

**Phase 0 — Pre-production & Scope Lock: COMPLETED**

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