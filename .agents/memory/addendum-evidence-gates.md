---
name: Addendum evidence gates
description: Durable rule for separating repository implementation from Unity/Android hardware evidence.
---

The project must not claim Android-ready or Vertical-Slice-ready status from repository files alone. Exact Unity patch, Android toolchain versions, APK installation/build evidence, and physical floor/target captures are hard gates.

**Why:** The addendum explicitly treats fabricated or missing device evidence as a production risk; browser validation cannot prove Android performance, thermal behavior, or input reliability.

**How to apply:** Keep `tools/validate_addendum.py --strict` failing until real evidence is recorded. Use repository checks for source, config, asset budgets, and provenance without weakening the strict hardware gate.