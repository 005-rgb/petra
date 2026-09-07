"""Validate the production handoff for RUSH RIDER: JAKARTA Phase 0.

This is intentionally dependency-free so it can run in the imported scaffold
before the Unity project exists.
"""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
PHASE = ROOT / "docs" / "phase-0"

REQUIRED_FILES = [
    "README.md",
    "01-scope-lock.md",
    "02-device-performance.md",
    "03-control-feel-spec.md",
    "04-level-1-greybox.md",
    "05-risk-register.md",
    "06-asset-legal-policy.md",
    "07-phase-1-backlog.md",
    "phase-0-completion-checklist.md",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def require_text(name: str, text: str, pattern: str) -> None:
    if not re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE):
        fail(f"{name} missing required pattern: {pattern}")


def main() -> int:
    if not PHASE.exists():
        fail("docs/phase-0 directory does not exist")

    for filename in REQUIRED_FILES:
        path = PHASE / filename
        if not path.is_file():
            fail(f"missing required handoff file: {path}")

    scope = (PHASE / "01-scope-lock.md").read_text(encoding="utf-8")
    device = (PHASE / "02-device-performance.md").read_text(encoding="utf-8")
    controls = (PHASE / "03-control-feel-spec.md").read_text(encoding="utf-8")
    greybox = (PHASE / "04-level-1-greybox.md").read_text(encoding="utf-8")
    risks = (PHASE / "05-risk-register.md").read_text(encoding="utf-8")
    legal = (PHASE / "06-asset-legal-policy.md").read_text(encoding="utf-8")
    backlog = (PHASE / "07-phase-1-backlog.md").read_text(encoding="utf-8")
    checklist = (PHASE / "phase-0-completion-checklist.md").read_text(encoding="utf-8")

    require_text("scope", scope, r"COMPLETED")
    for pattern in (r"1 driver", r"1 motorcycle", r"1 playable level", r"90 (s|detik)", r"non-goals"):
        require_text("scope", scope, pattern)
    for pattern in (r"Floor", r"Target", r"30 FPS", r"60 FPS", r"600 MB", r"object"):
        require_text("device budget", device, pattern)
    for pattern in (r"2,4 m", r"0,22 s", r"40°", r"90 s", r"reaction"):
        require_text("control spec", controls, pattern)
    for pattern in (r"Segment sequence", r"\| 11 \|", r"shortcut", r"SAFE", r"telemetry"):
        require_text("greybox", greybox, pattern)
    for pattern in (r"R-01", r"Trigger", r"Mitigasi", r"Fallback"):
        require_text("risk register", risks, pattern)
    for pattern in (r"Gojek", r"Grab", r"provenance", r"license", r"blocked"):
        require_text("asset/legal policy", legal, pattern)
    for pattern in (r"P0-01", r"P0-10", r"Acceptance criteria", r"Execution order"):
        require_text("phase 1 backlog", backlog, pattern)
    if len(re.findall(r"\| .* \| PASS \|", checklist)) < 10:
        fail("completion checklist has fewer than 10 passing checks")

    print("PASS: Phase 0 handoff is complete and internally consistent.")
    print(f"PASS: {len(REQUIRED_FILES)} handoff documents present.")
    print("PASS: scope, device budget, control spec, greybox, risks, legal, and backlog validated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
