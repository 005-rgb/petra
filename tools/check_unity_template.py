"""Static clean-checkout checks for the Unity bootstrap template.

This is not a substitute for opening Unity. It catches missing source/package/
scene wiring before the template reaches an approved Unity machine.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
UNITY = ROOT / "unity"
REQUIRED_PACKAGES = {
    "com.unity.inputsystem": "1.7.0",
    "com.unity.render-pipelines.universal": "14.0.10",
}
REQUIRED_SOURCES = {
    "Assets/Bootstrap/PrototypeBootstrap.cs": ("Prototype_Level01", "Quaternion.Euler(40f"),
    "Assets/Gameplay/Runtime/PlayerSystem.cs": ("Touchscreen.current", "Keyboard.current", "laneSpacing"),
    "Assets/Gameplay/Runtime/GameManager.cs": ("ResetRun", "IResettable"),
    "Assets/Gameplay/Runtime/RoadSystem.cs": ("RoadSegment_", "Build"),
    "Assets/Gameplay/Runtime/TrafficSystem.cs": ("maxTraffic", "ResetState"),
    "Assets/Gameplay/Runtime/MissionSystem.cs": ("pickupAt", "routeLength"),
    "Assets/Gameplay/Runtime/SaveSystem.cs": ("PlayerPrefs", "SaveResult"),
    "Assets/UI/Runtime/UIManager.cs": ("OnGUI", "DELIVERY COMPLETE"),
    "Assets/Tools/Runtime/DebugOverlay.cs": ("f3Key", "OBJECTS"),
}


def main() -> int:
    failures: list[str] = []
    manifest_path = UNITY / "Packages/manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    dependencies = manifest.get("dependencies", {})
    for package, version in REQUIRED_PACKAGES.items():
        if dependencies.get(package) != version:
            failures.append(f"package {package} must be pinned to {version}")

    script_meta = UNITY / "Assets/Bootstrap/PrototypeBootstrap.cs.meta"
    guid_match = re.search(r"^guid:\s*(\w+)$", script_meta.read_text(encoding="utf-8"), re.MULTILINE)
    guid = guid_match.group(1) if guid_match else ""
    for relative, markers in REQUIRED_SOURCES.items():
        path = UNITY / relative
        if not path.is_file():
            failures.append(f"missing {relative}")
            continue
        text = path.read_text(encoding="utf-8")
        for marker in markers:
            if marker not in text:
                failures.append(f"{relative} missing marker {marker}")

    for scene_name in ("Bootstrap.unity", "Prototype_Level01.unity"):
        scene = UNITY / "Assets/Scenes" / scene_name
        if not scene.is_file() or f"guid: {guid}" not in scene.read_text(encoding="utf-8"):
            failures.append(f"{scene_name} is not wired to PrototypeBootstrap")

    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        return 1
    print("PASS: Unity template packages, sources, input abstraction, camera, and scenes are wired.")
    print("BLOCKED: editor compile/open and Android build still require the approved external toolchain.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())