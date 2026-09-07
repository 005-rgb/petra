# 07 — Fase 1 Backlog

## Status

**READY — dependency order locked**

Semua task di bawah dapat langsung dibuat sebagai ticket implementasi. P0 dikerjakan berurutan; P1 berjalan setelah loop pertama playable; P2 hanya jika tidak mengganggu Fun Check.

## P0 — must ship prototype loop

### P0-01 — Bootstrap Unity + URP

**Acceptance criteria**

- project Unity + URP dibuat pada exact editor patch yang dicatat;
- scene `Prototype_Level01` dapat dibuka dari clean checkout;
- input abstraction tersedia untuk keyboard dan touch;
- target Android build berhasil dibuat.

### P0-02 — Player movement and lane model

**Acceptance criteria**

- 3 lane dengan center spacing 2,4 m;
- lane change duration 0,22 s dan cooldown 0,18 s;
- input tidak memindahkan player lebih dari satu lane;
- speed, acceleration, brake, jump, dan boost dapat dituning dari data.

### P0-03 — Isometric camera

**Acceptance criteria**

- pitch 40° dan player anchor 42% dari bawah;
- follow damping sesuai control spec;
- boost, near miss, dan crash camera feedback dapat dimatikan lewat debug setting;
- camera tidak memotong destination marker.

### P0-04 — Road greybox and segment manager

**Acceptance criteria**

- 12 segment Level 1 tersusun sesuai greybox document;
- current + next + previous segment tersedia;
- segment dapat di-reset tanpa duplicate object;
- shortcut memiliki entry, exit, dan jalur utama.

### P0-05 — Traffic pool and basic AI

**Acceptance criteria**

- pool motor/mobil aktif;
- traffic bergerak pada lane dengan state minimal cruise, brake, change lane;
- spawn memakai reaction-time budget;
- traffic dapat di-reset dan kembali ke pool.

### P0-06 — Collision, HP, crash, restart

**Acceptance criteria**

- damage minor/medium/major memiliki angka yang jelas;
- HP 100 dan crash pada HP ≤0;
- crash memiliki state yang dapat diselesaikan;
- restart mengembalikan player, traffic, timer, dan reward ke baseline.

### P0-07 — Mission delivery loop

**Acceptance criteria**

- order card menampilkan pickup, destination, distance, timer, reward;
- pickup dan destination memiliki radius sesuai spec;
- success, fail, dan delivery result state berjalan;
- reward diberikan hanya sekali per run.

### P0-08 — HUD and feedback

**Acceptance criteria**

- HUD menampilkan HP, timer, distance, boost, combo/reward placeholder;
- state low time dan low HP terlihat;
- feedback first-time jump/boost tidak muncul berulang tanpa reset;
- HUD tetap terbaca pada 720p dan 1080p.

### P0-09 — Local save and deterministic reset

**Acceptance criteria**

- cash, completed level, stars, dan settings minimal tersimpan;
- save/load berjalan setelah app restart;
- data invalid tidak membuat game crash;
- reset prototype tersedia hanya di development menu.

### P0-10 — Device build and profiler baseline

**Acceptance criteria**

- build terpasang pada floor dan target device;
- rute 90 detik diprofilkan;
- FPS, 1% low, RAM, dan loading dicatat;
- P0 performance issue ditutup sebelum Fun Check.

## P1 — must ship before Fun Check review

- near miss detector;
- combo score sederhana;
- boost pickup;
- horn dan basic engine audio;
- safe-path/manual lane annotations;
- telemetry events lokal;
- test checklist untuk 20 restart dan 5 delivery completion.

## P2 — explicitly deferred

- rain, flood, night;
- final character/motor art;
- online features;
- monetization;
- full 10-level content.

## Execution order

`P0-01 → P0-02 → P0-03 → P0-04 → P0-05 → P0-06 → P0-07 → P0-08 → P0-09 → P0-10`

P1 dapat mulai paralel setelah P0-07 berjalan pada satu route.
