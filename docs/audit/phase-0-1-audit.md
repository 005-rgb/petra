# Audit & Improvement Record — Fase 0 dan Fase 1

**Tanggal audit:** 7 September 2026  
**Scope:** dokumen pre-production, prototype browser, server, acceptance tests, dan workflow preview  
**Status:** **COMPLETED — browser prototype baseline audited**

## Kesimpulan

Fase 0 dan Fase 1 sekarang memiliki baseline yang konsisten dan dapat diverifikasi:

- Fase 0 mendefinisikan scope, angka tuning, route, fairness, legal, risiko, dan backlog.
- Fase 1 menjalankan core delivery loop secara nyata di browser.
- Gap yang ditemukan saat audit sudah diperbaiki atau diberi status eksplisit sebagai gate Unity/device.
- Validasi statis, unit acceptance test, syntax check, HTTP smoke test, workflow, dan preview visual dijalankan.

## Temuan dan tindakan

| ID | Temuan audit | Dampak | Tindakan | Status |
|---|---|---|---|---|
| A-01 | Save sebelumnya hanya menyimpan cash legacy | completed level, stars, settings, dan best time hilang | tambah schema `rushRiderProgress` dengan cash, completedLevels, stars, bestTimes, settings | FIXED |
| A-02 | Star criteria Level 1 belum dikunci | hasil level tidak dapat dibandingkan secara konsisten | kunci 1/2/3 stars: success / ≤75 s / ≤75 s + no crash + 3 near miss + shortcut | FIXED |
| A-03 | Telemetry marker ada di dokumen tetapi belum disimpan | playtest tidak punya bukti event | tambah event lokal dan `rushRiderLastRun` | FIXED |
| A-04 | Basic audio belum diimplementasikan | feedback gameplay belum memenuhi scope prototype | tambah engine loop, horn, jump, boost, pickup, near miss, impact, success/fail | FIXED |
| A-05 | Finish state bisa berpotensi dipanggil dua kali dalam frame yang sama | reward/result dapat double-trigger pada edge case | guard state dan `else if` pada terminal condition | FIXED |
| A-06 | Favicon request menghasilkan 404 | browser console tidak bersih | tambahkan favicon SVG dan legacy `/favicon.ico` mapping | FIXED |
| A-07 | Test suite sebelumnya menemukan 0 test | false confidence | ubah ke `unittest.TestCase` dan pastikan 4 test terdeteksi | FIXED |
| A-08 | P0-10 menyebut floor/target device padahal Unity belum ada | status bisa terbaca overclaim | dokumen Fase 1 menyatakan browser baseline selesai dan Unity/device gate masih eksplisit | FIXED / GATE |

## Contract yang sekarang berlaku

### Persistence

Schema local storage:

```json
{
  "cash": 0,
  "completedLevels": ["level-01"],
  "stars": {"level-01": 1},
  "bestTimes": {"level-01": 82.4},
  "settings": {
    "audioEnabled": true,
    "vibrationEnabled": false
  },
  "lastRun": null
}
```

Event run terakhir disimpan terpisah sebagai array lokal `rushRiderLastRun`.

### Star evaluation Level 1

- **1 star:** delivery berhasil;
- **2 stars:** delivery berhasil dalam ≤75 detik;
- **3 stars:** ≤75 detik, HP tetap 100, minimal 3 near miss, dan shortcut digunakan.

Timer maksimum tetap 90 detik. Target 75 detik hanya digunakan untuk star evaluation.

### Terminal state invariant

`finishRun()` hanya boleh berhasil satu kali untuk satu run. Setelah state berubah dari `running`, update traffic, obstacle, dan terminal condition tidak boleh menghasilkan reward atau result kedua.

## Verification record

Perintah yang harus lulus:

```bash
python tools/validate_phase0.py
python -m unittest discover -s tests -p 'test_*.py' -v
python tools/smoke_phase1.py
python -m py_compile main.py tests/test_phase1.py
node --check public/game.js
git diff --check
```

## Batas audit

Audit ini tidak menyatakan bahwa build Android atau project Unity sudah ada. Repository yang diimpor belum memiliki Unity project. Yang selesai dan dapat dibuktikan sekarang adalah browser gameplay baseline, kontrak data, server workflow, dan seluruh gate otomatis yang dapat dijalankan dari repository ini.

Unity bootstrap, profiling device fisik, Android build, asset pipeline 3D, dan playtest dengan 5 manusia tetap merupakan gate integrasi berikutnya—bukan disamarkan sebagai hasil yang sudah tersedia.
