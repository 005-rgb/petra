# Fase 0 — Pre-production & Scope Lock

**Project:** RUSH RIDER: JAKARTA  
**Status:** COMPLETED  
**Baseline:** PRD RUSH RIDER: JAKARTA  
**Output:** Paket handoff siap dipakai untuk membangun prototype gameplay.

## Tujuan fase

Fase 0 mengubah PRD menjadi keputusan produksi yang tidak ambigu. Fase ini tidak membuat gameplay final dan tidak memasang Unity karena repository yang diimpor belum memiliki project engine. Hasilnya adalah kontrak produksi untuk prototype:

- scope MVP yang terkunci;
- target device dan performance budget;
- control-feel specification dengan angka awal;
- rancangan greybox Level 1;
- risk register dan mitigasi;
- kebijakan legal dan provenance asset;
- backlog implementasi Fase 1;
- checklist handoff yang dapat divalidasi otomatis.

## Keputusan yang dikunci

| Area | Keputusan |
|---|---|
| Produk | Mobile-first, Android sebagai platform prototype; iOS menyusul setelah core loop stabil |
| Engine | Unity + URP; exact editor patch dipin pada saat bootstrap engine dan tidak di-upgrade selama prototype |
| Kamera | Isometric 3/4, pitch 40°, player anchor 42% dari bawah layar |
| Core loop | Accept order → pickup → rush → avoid traffic → deliver → reward → restart/next |
| MVP | 1 karakter, 1 motor, 1 environment, sunny weather, 1 order, 1 level, basic UI/audio/save |
| Prototype route | 3 lane, sekitar 960 m, satu shortcut, target delivery 90 detik |
| Quality gate | Minimal 30 FPS pada floor device; target 60 FPS pada target device |
| Legal | Semua brand, logo, seragam, signage, dan asset delivery harus fiktif/orisinal atau memiliki lisensi tertulis |
| Deferred | Monetisasi real-money, leaderboard online, account backend, 10 level final, endless final |

## Dokumen di dalam paket

1. [`01-scope-lock.md`](01-scope-lock.md) — batasan MVP, non-goals, dan exit criteria.
2. [`02-device-performance.md`](02-device-performance.md) — device tiers, frame/memory/asset budgets.
3. [`03-control-feel-spec.md`](03-control-feel-spec.md) — angka kontrol, kamera, collision, timer, dan tuning rules.
4. [`04-level-1-greybox.md`](04-level-1-greybox.md) — layout greybox dan beat sheet Level 1.
5. [`05-risk-register.md`](05-risk-register.md) — risiko, owner, trigger, mitigasi, dan keputusan fallback.
6. [`06-asset-legal-policy.md`](06-asset-legal-policy.md) — aturan orisinalitas, lisensi, dan asset intake.
7. [`07-phase-1-backlog.md`](07-phase-1-backlog.md) — backlog implementasi prototype dengan acceptance criteria.
8. [`phase-0-completion-checklist.md`](phase-0-completion-checklist.md) — bukti bahwa fase telah selesai.

## Validation

Jalankan:

```bash
python tools/validate_phase0.py
```

Validator memastikan seluruh dokumen handoff ada, keputusan wajib tidak kosong, dan angka penting tidak bertentangan dengan acceptance criteria.

## Handoff ke Fase 1

Fase 1 dapat dimulai tanpa keputusan produk tambahan. Satu-satunya input teknis yang masih spesifik lingkungan adalah memasang versi patch Unity yang dipilih pada mesin pengembang dan membuat project Unity + URP. Itu adalah bootstrap implementasi, bukan perubahan scope.
