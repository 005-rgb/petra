"""Record an Android development APK after a real build and install test."""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUILD_DIR = ROOT / "profiling" / "builds"
BUILD_LADDER = ROOT / "config" / "addendum" / "build-ladder.json"


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--build-id", required=True, choices=("build-00", "build-01", "build-02", "build-03"))
    parser.add_argument("--apk", required=True, type=Path)
    parser.add_argument("--unity-version", required=True)
    parser.add_argument("--sdk-version", required=True)
    parser.add_argument("--ndk-version", required=True)
    parser.add_argument("--jdk-version", required=True)
    parser.add_argument("--device-model", required=True)
    parser.add_argument("--install-result", required=True, choices=("pass", "fail"))
    parser.add_argument("--test-date", default=date.today().isoformat())
    args = parser.parse_args()

    if args.apk.suffix.lower() != ".apk" or not args.apk.is_file():
        fail("--apk must point to an existing .apk file")
    if args.apk.stat().st_size == 0:
        fail("APK is empty")
    if len(args.unity_version.split(".")) < 3:
        fail("Unity version must include an exact patch, for example 2022.3.62f1")
    if not args.test_date or len(args.test_date) != 10:
        fail("--test-date must use YYYY-MM-DD")

    ladder = json.loads(BUILD_LADDER.read_text(encoding="utf-8"))
    entry = next(item for item in ladder["builds"] if item["id"] == args.build_id)
    output = BUILD_DIR / f"{args.build_id}.json"
    if output.exists():
        fail(f"refusing to overwrite existing evidence: {output}")
    digest = hashlib.sha256(args.apk.read_bytes()).hexdigest()
    record = {
        "buildId": args.build_id,
        "contents": entry["contents"],
        "purpose": entry["purpose"],
        "apkPath": str(args.apk),
        "sha256": digest,
        "sizeBytes": args.apk.stat().st_size,
        "unityVersion": args.unity_version,
        "sdkVersion": args.sdk_version,
        "ndkVersion": args.ndk_version,
        "jdkVersion": args.jdk_version,
        "deviceModel": args.device_model,
        "installResult": args.install_result,
        "testDate": args.test_date,
    }
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    print(f"PASS: wrote {output.relative_to(ROOT)}")
    print(f"SHA256: {digest}")
    return 0 if args.install_result == "pass" else 2


if __name__ == "__main__":
    raise SystemExit(main())