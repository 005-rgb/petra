# 05 — Risk Register

## Status

**COMPLETED — reviewed for prototype handoff**

| ID | Risiko | Probabilitas | Dampak | Trigger | Mitigasi | Fallback | Owner |
|---|---|---|---|---|---|---|---|
| R-01 | Scope membesar sebelum core loop terbukti | Tinggi | Tinggi | fitur non-MVP masuk backlog aktif | scope lock dan gate M1 | buang fitur P2, pertahankan delivery loop | Producer/Design |
| R-02 | Kontrol lane terasa licin atau teleport | Tinggi | Tinggi | retry rendah, feedback kontrol negatif | angka dari control spec + playtest harian | sederhanakan ke snap lane | Gameplay |
| R-03 | Traffic terasa curang | Tinggi | Tinggi | no-safe-path atau collision tanpa telegraph | safe-path validator + reaction budget | turunkan density/aggression | AI/Level |
| R-04 | Performa di bawah 30 FPS | Sedang | Tinggi | floor device <30 FPS | pooling, LOD, budgets, profiling mingguan | turunkan quality preset | Tech Art/Engineering |
| R-05 | Asset hyper-realistic habis waktu | Tinggi | Sedang | visual dikerjakan sebelum fun gate | placeholder sampai vertical slice | gunakan asset berlisensi untuk non-hero | Art Lead |
| R-06 | Brand pihak ketiga tersalin | Sedang | Tinggi | logo/nama/seragam mirip brand nyata | asset/legal policy dan review provenance | ganti asset sebelum build | Producer/Legal |
| R-07 | Procedural road sulit direproduksi | Sedang | Tinggi | bug tidak muncul ulang | seed dan telemetry segment | campaign route authored dulu | Systems |
| R-08 | Save/restart meninggalkan state | Sedang | Tinggi | object count/memory naik setelah restart | deterministic reset + smoke test | reload scene penuh sementara | Systems |
| R-09 | Timer 90 s terlalu mudah/sulit | Sedang | Sedang | completion rate ekstrem | tune route length dan traffic bukan menambah upgrade | lock target 100 s untuk test | Design |
| R-10 | Weather/online menghambat prototype | Tinggi | Sedang | dependency belum siap saat M1 | deferred scope tertulis | sunny/local save only | Producer |

## Risk response rules

- risiko **Tinggi/Tinggi** harus memiliki mitigasi aktif sebelum implementasi;
- trigger harus dicatat sebagai telemetry atau test result, bukan perasaan;
- fallback boleh menurunkan complexity, tetapi tidak boleh melanggar core fantasy;
- risiko legal menghentikan asset tersebut sampai provenance jelas;
- risiko performa diuji pada floor device, bukan hanya editor.

## Escalation thresholds

- dua playtest berturut-turut menemukan no-safe-path: hentikan content expansion dan perbaiki generator/placement;
- floor device <30 FPS selama 10 detik: P0 performance bug;
- memory naik >10% setelah 20 restart: P1 leak/reset bug;
- asset tidak memiliki sumber atau lisensi: jangan masuk build;
- tiga tester tidak memahami delivery goal: revisi onboarding sebelum menambah mechanic.
