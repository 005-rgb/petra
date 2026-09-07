# 02 — Target Device & Performance Budget

## Status

**COMPLETED — budget locked for prototype**

Target ini adalah batas produksi untuk mobile-first. Angka dapat direvisi setelah profiling device nyata, tetapi prototype tidak boleh mengasumsikan hardware high-end.

## Device tiers

| Tier | Baseline | Resolusi uji | Target FPS | Peran |
|---|---|---:|---:|---|
| Floor | Android 4 GB RAM, Snapdragon 660/Helio G80 class, GPU Adreno 610/Mali-G52 class | 1280×720 | ≥30 FPS | perangkat minimum yang masih didukung |
| Target | Android 6 GB RAM, Snapdragon 778G/Dimensity 900 class | 1920×1080 | ≥60 FPS | kualitas dan tuning utama |
| High | Android 8 GB RAM, Snapdragon 8-series/Dimensity 8-series class | 1920×1080+ | ≥60 FPS | headroom dan visual quality |

**Platform policy:** iOS dan PC/Web belum menjadi blocker prototype. Setelah core loop lolos, kontrol dan performance profile dibuat untuk platform tersebut.

## Frame budget

### Floor device

- frame budget: **33,3 ms**;
- gameplay/main thread: ≤ **14 ms**;
- render thread: ≤ **14 ms**;
- remaining margin: ≥ **5 ms**;
- tidak boleh ada spike > **66 ms** selama 30 detik gameplay normal;
- loading hitch > **100 ms** harus dicatat sebagai bug performance.

### Target device

- frame budget: **16,67 ms**;
- gameplay/main thread: ≤ **7 ms**;
- render thread: ≤ **7 ms**;
- remaining margin: ≥ **2,5 ms**;
- tidak boleh ada spike > **33 ms** selama 60 detik gameplay normal.

## Memory and content budget

- managed/native memory soft cap floor: **600 MB** selama gameplay;
- scene activation peak: **≤750 MB**;
- texture hero prototype: maksimal 2K;
- environment prototype: 1K–2K, compressed;
- no 4K texture in prototype;
- active pooled traffic: maksimal 32 entity;
- active obstacle: maksimal 24 entity;
- active particle systems: maksimal 16 instance;
- draw-call target: ≤150 pada target device, ≤100 pada floor device;
- material/shader variants harus dibatasi dan dicatat;
- tidak boleh melakukan Instantiate/Destroy berulang pada gameplay loop;
- road hanya memuat current segment + 2 next + 1 previous.

## Loading and thermal

- cold start ke menu: ≤8 detik pada floor device;
- restart level tanpa scene reload penuh: ≤1 detik target;
- transisi scene/level full: ≤5 detik setelah loading screen tersedia;
- profiling session minimal 10 menit untuk thermal dan battery;
- jika thermal throttling menurunkan FPS di bawah floor, aktifkan dynamic quality sebelum menambah asset.

## Profiling protocol

1. Build development pada floor, target, dan high device.
2. Jalankan rute yang sama selama 90 detik.
3. Uji tiga kondisi: traffic rendah, traffic puncak prototype, dan crash/restart berulang.
4. Rekam average FPS, 1% low, frame time, RAM, GPU, loading, dan suhu.
5. Simpan capture profiler dengan nama `phase0-baseline-<tier>-<date>`.
6. Bug performance dikategorikan:
   - P0: <30 FPS atau crash;
   - P1: spike berulang atau memory leak;
   - P2: visual degradation tanpa dampak playability.

## Performance exit criteria

- floor device tidak turun di bawah 30 FPS selama rute normal;
- restart 20 kali tidak menaikkan memory secara terus-menerus;
- active pooled object kembali ke baseline setelah restart;
- tidak ada shader compilation hitch pada jalur utama setelah warm-up;
- ukuran asset prototype tidak menghambat instalasi dan test iteration.
