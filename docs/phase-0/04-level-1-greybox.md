# 04 — Level 1 Greybox: Pagi Santai

## Status

**COMPLETED — ready for Unity greybox implementation**

## Design intent

Level pertama mengajarkan kontrol tanpa menghilangkan fantasi “mengejar order”. Pemain harus memahami lane movement, brake, jump, boost, pickup, delivery, dan restart dengan traffic rendah.

## Level contract

| Item | Locked value |
|---|---|
| Nama | Pagi Santai |
| Difficulty | 1/10 |
| Time of day | Morning |
| Weather | Sunny |
| Traffic | Low |
| Route length | sekitar 960 m |
| Timer | 90 s |
| Objective | 1 normal delivery |
| Reward | Rp10.000 virtual currency |
| Unlock | Basic Helmet |
| Primary | Deliver order |
| Secondary | No crash, 3 near miss, use shortcut, finish under 75 s untuk star target |
| Start state | Arya + City 125, HP 100, boost 0% |

## Greybox legend

- `S`: start;
- `P`: pickup;
- `D`: destination;
- `T`: traffic spawn zone;
- `O`: obstacle zone;
- `J`: jump teaching zone;
- `B`: boost teaching zone;
- `C`: checkpoint/telemetry marker;
- `X`: shortcut entrance/exit;
- `SAFE`: lane yang wajib selalu bisa dilewati;
- `|`: lane boundary.

## Segment sequence

| Segmen | Jarak | Isi | Tujuan desain |
|---:|---:|---|---|
| 00 | 0–60 m | S, jalan kosong, signage order | orientasi kamera dan tujuan |
| 01 | 60–140 m | P, 1 motor lambat | pickup dan lane movement |
| 02 | 140–220 m | T low, 1 motor + 1 mobil terpisah | passing aman |
| 03 | 220–300 m | O cone di lane kiri | baca obstacle dan pindah lane |
| 04 | 300–380 m | J speed bump di lane tengah, bahu aman | jump tanpa memaksa |
| 05 | 380–460 m | B boost pickup, straight road | belajar hold boost |
| 06 | 460–540 m | X shortcut alley, jalur utama lebih aman | pilihan rute pertama |
| 07 | 540–640 m | intersection, T 2 motor + 1 mobil | membaca persimpangan |
| 08 | 640–740 m | O cone + speed bump berjeda | gabungkan brake/jump/lane |
| 09 | 740–840 m | T low-medium, 1 vehicle berpindah lane dengan telegraph | antisipasi traffic |
| 10 | 840–900 m | jalan neighborhood, tanpa obstacle baru | recovery dan orientasi D |
| 11 | 900–960 m | D, delivery radius, reward trigger | finish dan reward |

## Safe-path contract

- setiap segmen hanya menutup maksimal 1 dari 3 lane pada satu waktu;
- kombinasi obstacle tidak menutup dua lane tanpa jeda minimal 1,5 s;
- shortcut tidak boleh menjadi satu-satunya jalan untuk memenuhi timer;
- jika player tidak melakukan boost sama sekali, route utama harus tetap selesai dalam 90 s dengan kontrol wajar;
- traffic spawn tidak boleh menempati lane player kurang dari reaction-time budget;
- destination harus terlihat atau terwakili jelas di minimap minimal 80 m sebelum D.

## Tutorial beat

1. **0–60 m:** tampilkan order card dan destination marker; jangan spawn hazard.
2. **60–220 m:** minta pemain berpindah lane untuk melewati traffic ringan.
3. **220–380 m:** kenalkan cone lalu speed bump; tampilkan prompt hanya sekali.
4. **380–540 m:** berikan boost item dengan ruang lebar setelah pickup.
5. **460–540 m:** tampilkan shortcut dengan papan tanda orisinal “Jalur Cepat”.
6. **540–840 m:** validasi kombinasi mechanic tanpa menambah mechanic baru.
7. **840–960 m:** kurangi ancaman dan biarkan pemain fokus pada delivery.

## Telemetry markers

Prototype wajib mencatat:

- `level_start`;
- `pickup_reached`;
- `first_lane_change`;
- `first_jump`;
- `first_boost`;
- `first_collision`;
- `near_miss`;
- `shortcut_enter`;
- `delivery_success`;
- `level_fail`;
- `restart`;
- `level_complete_time`.

Data ini cukup lokal untuk prototype; backend tidak diperlukan.

## Star evaluation

- 1 star: delivery berhasil;
- 2 stars: selesai maksimal 75 detik;
- 3 stars: selesai maksimal 75 detik, no crash, minimal 3 near miss, dan shortcut digunakan.

Timer maksimal level tetap 90 detik. Pemain masih dapat menyelesaikan level dengan 1 star sampai timer habis.

## Greybox exit criteria

- route utama dan shortcut dapat selesai;
- seluruh segmen memiliki owner lane dan safe-path annotation;
- semua obstacle memiliki spawn distance dan reaction-time check;
- destination tidak membutuhkan hafalan map;
- 5 playtest berturut-turut tidak menemukan impossible obstacle;
- level bisa diulang tanpa state lama atau object tertinggal.
