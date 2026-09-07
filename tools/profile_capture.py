"""Record a real device profiler capture without allowing partial evidence.

Metrics are supplied from Unity Profiler/Android tooling as JSON.  This script
only records those values and performs gate calculations; it never fabricates a
device result.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MATRIX = json.loads((ROOT / "config/addendum/device-matrix.json").read_text(encoding="utf-8"))
SCHEMA = json.loads((ROOT / "config/addendum/capture-schema.json").read_text(encoding="utf-8"))


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--milestone", required=True, help="for example M1")
    parser.add_argument("--build", required=True, help="for example 03")
    parser.add_argument("--device-tier", required=True, choices=("floor", "target", "high"))
    parser.add_argument("--device-model", required=True)
    parser.add_argument("--os-version", required=True)
    parser.add_argument("--gpu-driver", required=True)
    parser.add_argument("--refresh-rate-hz", required=True, type=float)
    parser.add_argument("--free-storage-gb", required=True, type=float)
    parser.add_argument("--scenario", required=True, choices=MATRIX["scenarios"])
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--metrics-file", required=True, type=Path)
    parser.add_argument("--output-dir", default="profiling/captures", type=Path)
    args = parser.parse_args()

    if not re.match(r"^\d{2}$", args.build):
        fail("--build must be two digits, matching the capture naming convention")
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", args.date):
        fail("--date must use YYYY-MM-DD")
    if not args.metrics_file.is_file():
        fail(f"metrics file does not exist: {args.metrics_file}")
    try:
        metrics: dict[str, Any] = json.loads(args.metrics_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"invalid metrics JSON: {exc}")
    missing = set(SCHEMA["metricFields"]) - set(metrics)
    if missing:
        fail(f"metrics file missing: {sorted(missing)}")
    if not isinstance(metrics["crashOrHang"], bool):
        fail("crashOrHang must be true or false")

    name = f"{args.milestone.lower()}-build-{args.build}-{args.device_tier}-{args.scenario}-{args.date}"
    output_dir = ROOT / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)
    output = output_dir / f"{name}.json"
    if output.exists():
        fail(f"refusing to overwrite existing capture: {output}")

    tier = MATRIX["tiers"][args.device_tier]
    frame_ok = metrics["averageFps"] >= tier["targetFps"] and metrics["frameTimeMs"] <= tier["maxFrameTimeMs"]
    object_ok = metrics["objectCountAfterRestart"] <= metrics["objectCountBeforeRestart"]
    gate = {
        "P0": not metrics["crashOrHang"] and (args.device_tier != "floor" or metrics["averageFps"] >= 30),
        "P1": object_ok and metrics["loadingMs"] <= 1000,
        "P2": True,
    }
    capture = {
        "captureName": name,
        "milestone": args.milestone,
        "build": args.build,
        "deviceTier": args.device_tier,
        "deviceModel": args.device_model,
        "osVersion": args.os_version,
        "gpuDriver": args.gpu_driver,
        "refreshRateHz": args.refresh_rate_hz,
        "freeStorageGb": args.free_storage_gb,
        "scenario": args.scenario,
        "date": args.date,
        "metrics": metrics,
        "evaluation": {
            "frameBudgetPass": frame_ok,
            "restartObjectBaselinePass": object_ok,
            "gates": gate,
        },
    }
    output.write_text(json.dumps(capture, indent=2) + "\n", encoding="utf-8")
    try:
        display_path = output.relative_to(ROOT)
    except ValueError:
        display_path = output
    print(f"PASS: wrote {display_path}")
    print(f"RESULT: P0={'PASS' if gate['P0'] else 'FAIL'} P1={'PASS' if gate['P1'] else 'FAIL'}")
    return 0 if all(gate.values()) else 2


if __name__ == "__main__":
    raise SystemExit(main())