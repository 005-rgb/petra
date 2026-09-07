"""Repository acceptance checks for the Unity/Android addendum execution pack."""

from pathlib import Path
import json
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]


class AddendumTests(unittest.TestCase):
    def test_repository_gate_is_consistent(self):
        result = subprocess.run(
            [sys.executable, "tools/validate_addendum.py"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("repository addendum checks are internally consistent", result.stdout)
        self.assertIn("Unity exact editor patch is not approved", result.stdout)

    def test_strict_gate_does_not_claim_missing_hardware_evidence(self):
        result = subprocess.run(
            [sys.executable, "tools/validate_addendum.py", "--strict"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("strict addendum gate is not ready", result.stdout)

    def test_three_proof_assets_have_registry_records(self):
        registry = json.loads((ROOT / "config/addendum/asset-registry.json").read_text())
        self.assertEqual(len(registry["assets"]), 3)
        for record in registry["assets"]:
            self.assertTrue((ROOT / record["runtimePath"]).is_file())
            self.assertTrue((ROOT / record["collisionProxyPath"]).is_file())
            self.assertTrue(record["sourceReference"])
            self.assertTrue(record["licenseType"])


if __name__ == "__main__":
    unittest.main()