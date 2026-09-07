"""Validate the executable parts of the Unity/Android addendum.

The repository cannot prove an Android build or a physical-device capture on its
own.  This validator therefore separates reproducible repository checks from
evidence gates.  The default report is useful in CI and exits zero when the
repository is internally consistent.  ``--strict`` is the release gate and
exits non-zero until real Unity/toolchain/device evidence is supplied.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "addendum"
ASSET_ROOT = ROOT / "assets"
UNITY_ROOT = ROOT / "unity"
CAPTURE_ROOT = ROOT / "profiling" / "captures"


class Validation:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.passes: list[str] = []

    def ok(self, message: str) -> None:
        self.passes.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)

    def fail(self, message: str) -> None:
        self.errors.append(message)


def load_json(path: Path, result: Validation) -> dict[str, Any]:
    if not path.is_file():
        result.fail(f"missing JSON: {path.relative_to(ROOT)}")
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        result.fail(f"invalid JSON {path.relative_to(ROOT)}: {exc}")
        return {}
    if not isinstance(value, dict):
        result.fail(f"JSON root must be an object: {path.relative_to(ROOT)}")
        return {}
    result.ok(f"valid JSON: {path.relative_to(ROOT)}")
    return value


def obj_stats(path: Path) -> tuple[int, int, int]:
    vertices = 0
    faces = 0
    triangles = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        fields = line.split()
        if not fields:
            continue
        if fields[0] == "v" and len(fields) >= 4:
            vertices += 1
        elif fields[0] == "f" and len(fields) >= 4:
            faces += 1
            triangles += len(fields) - 3
    return vertices, faces, triangles


def validate_registry(result: Validation, budget: dict[str, Any]) -> None:
    registry = load_json(CONFIG / "asset-registry.json", result)
    assets = registry.get("assets", [])
    if not isinstance(assets, list):
        result.fail("asset registry assets must be an array")
        return
    if len(assets) < 3:
        result.fail("asset registry must contain the three proof assets")
    required_fields = {
        "assetId",
        "class",
        "runtimePath",
        "materialPath",
        "collisionProxyPath",
        "lodPaths",
        "creator",
        "sourceReference",
        "licenseType",
        "commercialUsePermitted",
        "attributionRequired",
        "modificationPermitted",
        "dateAcquired",
        "reviewer",
    }
    proof_count = 0
    for record in assets:
        missing = required_fields - set(record)
        if missing:
            result.fail(f"{record.get('assetId', '<unknown>')} missing fields: {sorted(missing)}")
            continue
        asset_id = str(record["assetId"])
        if record.get("role") == "proof":
            proof_count += 1
        if not re.match(r"^(CHR|VEH|ENV|TRF|OBS|VFX|SFX|UI|MAT|LOC)_[A-Z0-9_]+_v\d{3}$", asset_id):
            result.fail(f"invalid production asset ID: {asset_id}")
        runtime = ROOT / record["runtimePath"]
        material = ROOT / record["materialPath"]
        collision = ROOT / record["collisionProxyPath"]
        lods = [ROOT / item for item in record["lodPaths"]]
        if not material.is_file():
            result.fail(f"{asset_id} missing material: {material.relative_to(ROOT)}")
        if int(record.get("materialVariantCount", 0)) > 4:
            result.fail(f"{asset_id} has too many material variants")
        if not record.get("textureCompression"):
            result.fail(f"{asset_id} has no texture compression policy")
        for path, label in [(runtime, "runtime"), (collision, "collision"), *[(p, "LOD") for p in lods]]:
            if not path.is_file():
                result.fail(f"{asset_id} missing {label}: {path.relative_to(ROOT)}")
        if runtime.is_file():
            _, _, triangles = obj_stats(runtime)
            class_budget = budget.get("classes", {}).get(record["class"], {})
            max_triangles = class_budget.get("maxTriangles", 0)
            if triangles > max_triangles:
                result.fail(f"{asset_id} has {triangles} triangles; budget is {max_triangles}")
            else:
                result.ok(f"{asset_id}: {triangles} triangles within {max_triangles} budget")
            max_bytes = class_budget.get("maxRuntimeBytes", 0)
            if runtime.stat().st_size > max_bytes:
                result.fail(f"{asset_id} is {runtime.stat().st_size} bytes; budget is {max_bytes}")
            if "source" in runtime.name.lower():
                result.fail(f"{asset_id} source mesh is incorrectly marked as runtime")
        expected_lods = int(budget.get("classes", {}).get(record["class"], {}).get("requiredLodLevels", 0))
        if len(lods) + 1 < expected_lods:
            result.fail(f"{asset_id} has {len(lods) + 1} total mesh levels; needs {expected_lods}")
        if record.get("licenseType") and record.get("sourceReference"):
            result.ok(f"{asset_id}: provenance record present")
    if proof_count >= 3:
        result.ok("three proof assets are registered")


def validate_project_lock(result: Validation) -> None:
    lock = load_json(CONFIG / "project-lock.json", result)
    editor = lock.get("editor", {})
    android = lock.get("android", {})
    if editor.get("exactVersion") and editor.get("locked") is True:
        result.ok(f"Unity editor locked to {editor['exactVersion']}")
    else:
        result.warn("Unity exact editor patch is not approved; this is a hard pre-Vertical-Slice blocker")
    for field in ("sdkVersion", "ndkVersion", "jdkVersion"):
        if android.get(field):
            result.ok(f"Android {field} recorded")
        else:
            result.warn(f"Android {field} is not recorded")
    if android.get("applicationIdentifier") and android.get("targetArchitectures"):
        result.ok("Android identifier and architecture policy are defined")


def validate_unity_sources(result: Validation) -> None:
    required = [
        "Assets/Gameplay/Runtime/GameManager.cs",
        "Assets/Gameplay/Runtime/PlayerSystem.cs",
        "Assets/Gameplay/Runtime/RoadSystem.cs",
        "Assets/Gameplay/Runtime/TrafficSystem.cs",
        "Assets/Gameplay/Runtime/MissionSystem.cs",
        "Assets/Gameplay/Runtime/SaveSystem.cs",
        "Assets/UI/Runtime/UIManager.cs",
        "Assets/Tools/Runtime/DebugOverlay.cs",
        "Assets/Bootstrap/PrototypeBootstrap.cs",
    ]
    missing = [path for path in required if not (UNITY_ROOT / path).is_file()]
    if missing:
        for path in missing:
            result.fail(f"missing Unity bootstrap source: unity/{path}")
    else:
        result.ok("Unity bootstrap source set is complete")
    for scene in ("Bootstrap.unity", "Prototype_Level01.unity"):
        if not (UNITY_ROOT / "Assets" / "Scenes" / scene).is_file():
            result.fail(f"missing Unity scene: unity/Assets/Scenes/{scene}")
    if not (UNITY_ROOT / "Packages" / "manifest.json").is_file():
        result.fail("missing Unity package manifest")
    if not (UNITY_ROOT / "ProjectSettings" / "ProjectVersion.txt").is_file():
        result.warn("Unity ProjectVersion.txt is intentionally generated only after editor approval")


def validate_captures(result: Validation, matrix: dict[str, Any]) -> int:
    captures = sorted(CAPTURE_ROOT.glob("*.json")) if CAPTURE_ROOT.exists() else []
    valid = 0
    pattern = re.compile(r"^[a-z0-9]+-build-\d{2}-[a-z0-9-]+-[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.json$")
    required_metrics = set(matrix.get("requiredMetrics", []))
    for path in captures:
        if path.name == "README.md":
            continue
        if not pattern.match(path.name):
            result.fail(f"invalid capture filename: {path.name}")
            continue
        capture = load_json(path, result)
        if not set(capture) >= {
            "captureName",
            "milestone",
            "build",
            "deviceTier",
            "deviceModel",
            "osVersion",
            "gpuDriver",
            "refreshRateHz",
            "freeStorageGb",
            "scenario",
            "date",
            "metrics",
        }:
            result.fail(f"capture missing metadata: {path.name}")
            continue
        missing_metrics = required_metrics - set(capture.get("metrics", {}))
        if missing_metrics:
            result.fail(f"capture missing metrics {sorted(missing_metrics)}: {path.name}")
            continue
        valid += 1
    if valid:
        result.ok(f"{valid} profiler capture(s) validated")
    else:
        result.warn("no physical-device profiler captures exist yet")
    return valid


def validate_build_ladder(result: Validation) -> int:
    ladder = load_json(CONFIG / "build-ladder.json", result)
    builds = ladder.get("builds", [])
    recorded = 0
    for build in builds:
        evidence = CAPTURE_ROOT.parent / "builds" / f"{build.get('id')}.json"
        if evidence.is_file():
            recorded += 1
            try:
                record = json.loads(evidence.read_text(encoding="utf-8"))
                if record.get("buildId") != build.get("id") or not record.get("sha256"):
                    result.fail(f"invalid build evidence: {evidence.relative_to(ROOT)}")
                else:
                    result.ok(f"Android evidence recorded: {build['id']}")
            except json.JSONDecodeError:
                result.fail(f"invalid build evidence JSON: {evidence.relative_to(ROOT)}")
    if recorded == 0:
        result.warn("no Android APK build evidence exists yet")
    return recorded


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="fail until all Android evidence gates pass")
    args = parser.parse_args()
    result = Validation()
    matrix = load_json(CONFIG / "device-matrix.json", result)
    budget = load_json(CONFIG / "asset-budget.json", result)
    validate_project_lock(result)
    validate_unity_sources(result)
    validate_registry(result, budget)
    capture_count = validate_captures(result, matrix)
    build_count = validate_build_ladder(result)

    for message in result.passes:
        print(f"PASS: {message}")
    for message in result.warnings:
        print(f"BLOCKED: {message}")
    for message in result.errors:
        print(f"FAIL: {message}")

    if result.errors:
        return 1
    if args.strict and (
        not capture_count
        or build_count < 4
        or not json.loads((CONFIG / "project-lock.json").read_text(encoding="utf-8"))["editor"].get("locked")
    ):
        print("FAIL: strict addendum gate is not ready for Vertical Slice")
        return 1
    print("PASS: repository addendum checks are internally consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())