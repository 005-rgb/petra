# ROADMAP PEMBANGUNAN GAME
## RUSH RIDER: JAKARTA

**Versi:** 1.0  
**Tanggal:** 7 September 2026  
**Sumber:** PRD — RUSH RIDER: JAKARTA  
**Target platform:** Android, iOS, PC/Web  
**Rekomendasi urutan rilis:** Mobile-first, lalu PC/Web

---

## 1. Ringkasan Eksekutif

RUSH RIDER: JAKARTA adalah game delivery motorcycle endless runner dengan perspektif isometric 3/4. Daya tarik utamanya adalah kombinasi visual Jakarta yang realistis, lalu lintas yang kacau tetapi tetap fair, tekanan waktu, misi delivery, cuaca, banjir, shortcut, combo, dan progression.

Roadmap ini mengubah PRD menjadi urutan kerja produksi yang dapat dieksekusi. Prinsip utamanya:

1. **Buktikan fun terlebih dahulu, sebelum membangun konten dan visual mahal.**
2. **Bangun satu vertical slice berkualitas tinggi sebagai standar semua level.**
3. **Kunci fondasi performa, fairness, dan data sebelum produksi konten massal.**
4. **Produksi mechanic secara bertahap; setiap mechanic baru harus mudah dipahami dan dapat ditelegraph.**
5. **Tunda monetisasi sampai core gameplay terbukti menyenangkan.**

Dengan tim kecil sampai menengah dan fokus mobile-first, estimasi realistis untuk MVP yang playable adalah **7–10 minggu**, sedangkan versi campaign 10 level yang siap diuji publik membutuhkan sekitar **26–34 minggu**. Angka ini bergantung pada ukuran tim, kesiapan aset, dan seberapa banyak aset dibuat sendiri atau dibeli/dilisensikan.

---

## 2. Sasaran Produk dan Batasan MVP

### 2.1 Sasaran pengalaman pemain

Pemain harus merasakan:

- menjadi driver delivery yang mengejar waktu di tengah kemacetan Jakarta;
- kontrol yang mudah dipelajari tetapi sulit dikuasai;
- risiko dan kekacauan yang terasa lucu, bukan curang;
- keputusan cepat antara jalur aman dan shortcut berisiko;
- kepuasan dari delivery sukses, combo, reward, dan upgrade.

### 2.2 Cakupan MVP yang disarankan

MVP tidak langsung membangun semua isi PRD. Cakupan minimum:

- 1 karakter: Arya;
- 1 motor: City 125;
- 1 area Jakarta yang modular;
- 1 kondisi cuaca: sunny;
- 1 tipe order: normal;
- 1 level campaign;
- movement: pindah jalur, brake, jump, boost;
- kamera isometric dengan smooth follow;
- traffic dasar dengan lane switching sederhana;
- collision, HP, crash, restart;
- pickup, timer, delivery, reward;
- HUD dasar;
- save progress lokal;
- object pooling untuk traffic dan obstacle;
- target minimal 30 FPS pada perangkat Android target.

**Tidak termasuk MVP:** real-money payment, leaderboard online, anti-cheat online, lima karakter penuh, lima motor penuh, sepuluh level final, endless mode final, dan asset hyper-realistic lengkap.

---

## 3. Asumsi Tim dan Cara Membaca Jadwal

Roadmap ini memakai asumsi berikut:

- engine: Unity + URP;
- target awal: Android mid-range;
- tim inti: 1 producer/design lead, 2 gameplay programmer, 1 technical artist/3D generalist, 1 UI/audio generalist;
- QA dilakukan sejak prototype, bukan hanya di akhir;
- art outsource atau asset store boleh dipakai untuk mempercepat prototype, tetapi aset komersial harus memiliki lisensi;
- data level, kendaraan, dan tuning disimpan dalam format yang mudah diubah tanpa mengubah kode;
- semua brand dan aset delivery menggunakan nama serta desain orisinal, bukan branding Gojek/Grab.

Durasi pada roadmap adalah estimasi kalender. Beberapa track dapat berjalan paralel setelah fondasinya stabil.

---

## 4. Gambaran Besar Milestone

| Milestone | Durasi | Hasil utama | Gerbang keputusan |
|---|---:|---|---|
| M0 — Pre-production | 1 minggu | scope terkunci, risiko dan target device jelas | lanjut ke prototype |
| M1 — Gameplay Prototype | 2 minggu | satu loop delivery playable dengan placeholder | apakah core loop terasa fun? |
| M2 — Technical Foundation | 2 minggu | sistem modular, save, data, pooling, profiling awal | apakah fondasi siap menerima konten? |
| M3 — Vertical Slice Level 1 | 4 minggu | satu level hampir final dari start sampai reward | apakah kualitas dan performa layak jadi standar? |
| M4 — Campaign Production | 12–16 minggu | 10 level, progression, karakter/motor utama | apakah seluruh campaign konsisten dan fair? |
| M5 — Endless & Online-lite | 3–4 minggu | endless procedural, leaderboard bila diprioritaskan | apakah fitur tambahan meningkatkan retensi? |
| M6 — Polish, QA & Release Candidate | 4–6 minggu | optimasi, balancing, compliance, build kandidat rilis | siap soft launch/beta |

**Total indikatif:** 28–35 minggu untuk versi campaign lengkap. MVP playable dapat dicapai pada akhir M2/M3, sekitar minggu ke-5 sampai ke-9.

---

## 5. Roadmap Detail per Fase

## M0 — Pre-production dan Scope Lock
**Durasi:** Minggu 1

### Tujuan
Menyamakan definisi “fun”, mengunci scope MVP, dan mengurangi risiko terbesar sebelum produksi.

### Pekerjaan utama

- menetapkan Unity version, URP baseline, target device, resolusi, dan frame budget;
- membuat game design brief satu halaman dari PRD;
- mendefinisikan feel kontrol: kecepatan, perpindahan lane, lompatan, rem, boost;
- menentukan ukuran lane, skala pemain, panjang segment, dan satuan jarak;
- memilih satu area untuk prototype: jalan lingkungan/arteri Jakarta yang mudah dibaca;
- menyusun daftar aset placeholder dan aset final;
- menetapkan aturan fairness awal:
  - minimal satu jalur aman;
  - reaction time obstacle ringan minimal 0,6 detik;
  - obstacle berat minimal 1 detik;
  - kombinasi obstacle minimal 1,5 detik;
  - pedestrian mendapat warning 0,5–1,5 detik;
- menyusun naming convention, struktur folder, branching, dan format data;
- memastikan penggunaan brand, logo, seragam, dan signage bersifat orisinal.

### Output

- scope MVP yang disetujui;
- target device matrix;
- daftar risiko dan mitigasi;
- control feel sheet;
- greybox satu level;
- backlog M1–M3;
- daftar keputusan yang masih harus diuji.

### Kriteria selesai

- semua anggota tim dapat menjelaskan core loop dalam satu kalimat;
- tidak ada feature besar yang masuk MVP tanpa alasan validasi;
- target device fisik tersedia atau sudah ditentukan;
- tidak ada ketergantungan eksternal yang belum teridentifikasi.

---

## M1 — Gameplay Prototype
**Durasi:** Minggu 2–3

### Tujuan
Membuktikan apakah permainan inti menyenangkan sebelum investasi visual.

### Pekerjaan utama

#### Gameplay

- player controller dengan lane movement;
- acceleration, brake, jump, dan boost sederhana;
- collision dan respon crash;
- HP dan restart;
- pickup dan delivery trigger;
- timer, distance, dan success/fail state;
- camera isometric 3/4 dengan follow dan damping;
- feedback dasar untuk near miss dan boost.

#### Dunia dan traffic

- satu road segment lurus;
- satu persimpangan sederhana;
- traffic placeholder: motor dan mobil;
- spawner dengan jumlah traffic terkontrol;
- lane switching sederhana;
- obstacle: cone dan speed bump.

#### UI dan audio

- HUD: HP, timer, distance, boost;
- layar start, success, fail, restart;
- suara motor, collision, boost, dan delivery placeholder.

### Eksperimen yang wajib diuji

- apakah perpindahan lane terasa responsif?
- apakah pemain memahami tujuan tanpa penjelasan panjang?
- apakah 60–90 detik pertama menghasilkan keputusan menarik?
- apakah crash terasa sebagai akibat skill, bukan kejadian acak?
- apakah boost membantu tanpa menghilangkan kontrol?

### Output

- build prototype yang bisa dimainkan dari start sampai delivery;
- video/gif internal untuk membandingkan feel kontrol;
- catatan playtest minimal 5–8 pemain internal;
- daftar perubahan berbasis observasi, bukan opini.

### Gate M1: Fun Check

Lanjut hanya jika mayoritas tester:

- memahami kontrol dasar tanpa bantuan langsung;
- mau mengulang minimal satu kali setelah gagal;
- dapat menyebutkan keputusan yang mereka buat;
- tidak menemukan obstacle mustahil pada rute uji;
- merasakan delivery dan timer sebagai tujuan yang jelas.

Jika gate gagal, potong fitur tambahan dan iterasi kontrol/traffic terlebih dahulu.

---

## M2 — Technical Foundation
**Durasi:** Minggu 4–5

### Tujuan
Membangun fondasi yang mencegah prototype berubah menjadi technical debt saat konten bertambah.

### Pekerjaan utama

- arsitektur sistem:
  - GameManager;
  - PlayerSystem;
  - TrafficSystem;
  - RoadSystem;
  - MissionSystem;
  - LevelSystem;
  - EconomySystem;
  - UpgradeSystem;
  - AudioSystem;
  - VFXSystem;
  - UIManager;
  - SaveSystem;
- ScriptableObject atau format data setara untuk character, motorcycle, level, mission, traffic, dan reward;
- object pooling untuk traffic, obstacle, particle, dan pickup;
- road segment manager: current, next, previous;
- reset state yang deterministik saat restart;
- local save untuk player level, XP, currency, unlock, upgrade, stars, dan settings;
- input abstraction untuk mobile swipe/hold/tap dan PC keyboard;
- basic analytics hooks lokal untuk mencatat restart, crash, completion, dan waktu level;
- error logging dan debug overlay untuk FPS, object count, serta memory;
- automated smoke test untuk start mission, complete mission, fail mission, save, load, restart.

### Output

- technical foundation build;
- format data level yang terdokumentasi;
- profiler baseline;
- save/load yang dapat diuji berulang;
- reusable road, traffic, dan obstacle pool.

### Kriteria selesai

- menambah data kendaraan atau level tidak memerlukan perubahan pada core controller;
- restart tidak menggandakan object atau state;
- save tidak kehilangan progress setelah aplikasi ditutup;
- gameplay stabil minimal 30 FPS pada target device dengan placeholder;
- tidak ada instantiate/destroy berulang pada loop traffic utama.

---

## M3 — Vertical Slice Level 1
**Durasi:** Minggu 6–9

### Tujuan
Membuat satu level yang merepresentasikan kualitas target game final. Vertical slice menjadi standar produksi untuk level lain.

### Scope Level 1 — Pagi Santai

- setting pagi di jalan lingkungan Jakarta;
- traffic rendah;
- cuaca sunny;
- obstacle: motor, mobil, cone, speed bump;
- tutorial movement;
- satu order normal;
- target time 90 detik;
- reward virtual currency;
- unlock Basic Helmet;
- primary objective delivery;
- secondary objectives: no crash, near miss, shortcut/target time bila sudah tersedia;
- star system 1–3.

### Track produksi

#### Gameplay dan level design

- greybox final lane dan junction;
- tutorial yang tidak mengganggu flow;
- rute utama dan satu shortcut;
- tuning timer, traffic density, reward, dan target time;
- fairness validator versi pertama;
- tuning kamera: zoom, FOV, shake, delivery cinematic.

#### Art dan environment

- karakter Arya dengan model/rig final;
- motor City 125 dengan material PBR;
- modular road, rumah, warung, minimarket, kabel, signage orisinal;
- LOD dan texture budget;
- lighting pagi;
- collision mesh dan navigation marker yang efisien.

#### UI/UX

- main menu minimal: Play, Garage, Settings;
- pre-run/order card;
- HUD final untuk Level 1;
- pause, result, stars, reward, dan unlock screen;
- onboarding kontrol mobile dan PC.

#### Audio/VFX

- engine loop;
- horn dan traffic ambience;
- collision dan delivery success;
- boost exhaust VFX;
- dust, brake, skid, dan impact;
- music state normal/rush awal.

#### QA dan performance

- playtest harian pada target device;
- frame time, memory, loading, battery, dan thermal baseline;
- uji resolusi dan aspect ratio;
- crash/restart/save regression.

### Gate M3: Vertical Slice Review

Vertical slice diterima jika:

- satu level dapat dimainkan utuh tanpa intervensi developer;
- player paham order, tujuan, timer, dan hasil level;
- traffic terlihat hidup tetapi dapat diprediksi dari telegraph;
- tidak ada jalur yang mustahil;
- save, reward, stars, dan unlock bekerja;
- minimal 30 FPS pada device minimum;
- visual dan audio cukup kuat untuk menjadi standar level berikutnya.

---

## M4 — Campaign Production
**Durasi:** Minggu 10–25

### Tujuan
Memproduksi 10 level campaign dengan peningkatan difficulty yang jelas dan mechanic baru yang terukur.

### Urutan produksi level

| Level | Tema | Mechanic utama | Fokus validasi |
|---:|---|---|---|
| 1 | Pagi Santai | tutorial movement | keterbacaan kontrol dan delivery |
| 2 | Mulai Macet | near miss dan combo | risk/reward dasar |
| 3 | Pulang Sekolah | random turn | telegraph dan perilaku NPC |
| 4 | Hujan Jakarta | wet road | handling, visibility, kontrol |
| 5 | Banjir | safe route vs flood shortcut | keputusan rute dan risiko |
| 6 | Unpredictable Turn | special NPC AI | fairness saat AI tidak terduga |
| 7 | Office Rush Hour | traffic wave | pembacaan celah dan kepadatan |
| 8 | Jakarta Night | low visibility | lampu, minimap, dan kontras |
| 9 | Jakarta Chaos | gabungan mechanic | beban kognitif dan pacing |
| 10 | Rush Hour: Hell | fase bertingkat | klimaks, endurance, final delivery |

### Cara produksi per level

Setiap level melewati mini-cycle berikut:

1. **Design brief:** tujuan, mechanic, difficulty, route, traffic, reward.
2. **Greybox:** jalur, obstacle, shortcut, spawn, dan timer.
3. **Playtest fairness:** safe path, reaction time, visibility, dan collision.
4. **Art pass:** environment, weather, lighting, signage, props.
5. **Systems pass:** mission, reward, stars, unlock, audio, VFX.
6. **Performance pass:** LOD, pooling, occlusion, texture compression.
7. **Lock review:** level tidak masuk polish sebelum completion rate dan bug kritis memenuhi target.

### Target pacing progression

- Level 1–3: pemain belajar dan membangun kepercayaan;
- Level 4–6: pemain belajar membaca kondisi dan perilaku traffic;
- Level 7–8: tekanan meningkat melalui kepadatan dan visibility;
- Level 9: menguji kombinasi skill;
- Level 10: klimaks dengan fase 20 detik dan final delivery.

### Progression dan content unlock

- level 3: City 150;
- level 4: Raka;
- level 5: Street 160;
- level 6: Sinta;
- level 7: Sport 175;
- level 8: Bimo;
- level 10: Maya dan Hyper Rider;
- upgrade Engine, Brake, Tire, Suspension, Boost secara bertahap;
- cosmetics original: helmet, jacket, pants, shoes, box, wheels, exhaust, stickers.

### Kriteria selesai M4

- 10 level dapat dimainkan dari menu hingga hasil;
- setiap level memiliki objective, reward, dan mechanic yang jelas;
- progression tidak mengunci pemain pada upgrade wajib yang tidak adil;
- semua level lolos fairness validator dan manual playtest;
- campaign dapat diselesaikan tanpa data debug;
- loading dan memory stabil ketika berpindah level.

---

## M5 — Endless Mode dan Fitur Kompetitif
**Durasi:** Minggu 26–29

### Tujuan
Menambah replayability setelah campaign stabil, tanpa mengganggu kualitas campaign.

### Endless mode

- road segment procedural;
- traffic, obstacle, NPC, weather, dan difficulty director;
- difficulty berdasarkan jarak:
  - 0–500 m: 1,0x;
  - 500–1.000 m: 1,2x;
  - 1–2 km: 1,5x;
  - 2–3 km: 2,0x;
  - 3–5 km: 3,0x;
  - 5 km+: extreme;
- seed untuk reproduksi bug dan hasil playtest;
- fairness validator sebelum segment aktif;
- hasil akhir berbasis distance, combo, dan difficulty.

### Leaderboard

Leaderboard online hanya dikerjakan jika:

- core gameplay stabil;
- backend, autentikasi, dan biaya operasional sudah disetujui;
- validasi skor server-side dirancang;
- kebijakan privasi dan moderasi siap.

Untuk MVP/soft launch, leaderboard lokal atau leaderboard dummy dapat ditunda. Jangan menjadikan fitur online sebagai blocker vertical slice.

### Kriteria selesai M5

- endless tidak menghasilkan no-safe-path;
- run dapat direproduksi menggunakan seed;
- difficulty meningkat tanpa spike yang tidak adil;
- object pooling tetap stabil pada run panjang;
- mode dapat dipisahkan dari campaign untuk memudahkan debugging.

---

## M6 — Polish, QA, Soft Launch, dan Release Candidate
**Durasi:** Minggu 30–35

### Tujuan
Menyelesaikan kualitas, performa, stabilitas, compliance, dan kesiapan rilis terbatas.

### Polish

- camera polish: boost, near miss, crash, collision, delivery;
- animation polish: lean, brake, jump, pickup, delivery, celebration;
- VFX: hujan, splash, water displacement, droplets, skid, impact, exhaust;
- audio mixing dan dynamic music:
  - Normal 110 BPM;
  - Rush 125 BPM;
  - Critical 140 BPM;
- UI polish, accessibility dasar, tutorial, dan feedback;
- loading screen dan asynchronous loading;
- balancing economy, XP, stars, unlock, dan upgrade.

### QA matrix

#### Gameplay

- movement, brake, jump, boost;
- collision, HP, crash, restart;
- pickup, delivery, timer, reward;
- mission primary/secondary;
- stars, XP, unlock, upgrade;
- save/load dan reset.

#### AI

- lane switching;
- turn kiri/kanan;
- braking dan panic state;
- traffic wave;
- unpredictable turn dengan telegraph;
- pedestrian crossing dan warning;
- perilaku saat player boost atau crash.

#### Fairness

- minimal satu jalur aman;
- reaction time;
- obstacle spacing;
- shortcut risk/reward;
- tidak ada pedestrian yang muncul langsung di depan player;
- cuaca dan visibility tidak menghapus kemampuan membaca bahaya.

#### Performance

- FPS dan frame time;
- RAM dan GPU;
- loading;
- battery dan thermal;
- device low/mid/high;
- orientasi dan aspect ratio;
- behavior saat aplikasi masuk background.

#### Release

- legal review aset dan brand;
- privacy policy jika ada analytics/account;
- store metadata, age rating, screenshots, icon;
- crash reporting;
- versioning dan rollback build;
- save migration untuk update berikutnya.

### Kriteria release candidate

- tidak ada blocker atau critical bug;
- campaign dapat diselesaikan;
- MVP acceptance criteria terpenuhi;
- minimal 30 FPS pada device minimum;
- crash-free session sesuai target internal;
- tidak ada data progress yang hilang pada skenario normal;
- semua aset komersial memiliki sumber/lisensi yang terdokumentasi.

---

## 6. Prioritas Sistem dan Dependensi

Urutan pembangunan yang wajib dipertahankan:

1. **Player movement dan core gameplay**
2. **Camera dan collision**
3. **Traffic AI dan pooling**
4. **Road/segment system**
5. **Mission, timer, delivery**
6. **Fairness validator**
7. **Progression, economy, save**
8. **Weather, water, day/night**
9. **Visual quality, animation, VFX**
10. **Audio dan dynamic music**
11. **Endless mode**
12. **Leaderboard dan monetisasi**

### Dependensi kritis

- Procedural road menunggu road segment, lane graph, dan spawn rules stabil.
- Traffic wave menunggu traffic AI dan pooling.
- Flood route menunggu route branching dan weather/water baseline.
- Night mode menunggu lighting budget, minimap, dan visibility readability.
- Endless mode menunggu segment validator dan difficulty director.
- Monetisasi menunggu economy dan progression tervalidasi melalui playtest.
- Leaderboard online menunggu backend, akun, anti-cheat, dan privacy review.

---

## 7. Pembagian Workstream

### Game design dan level design

- core loop, difficulty curve, mission, economy, progression;
- greybox dan route;
- tuning timer, reward, traffic density;
- manual fairness review;
- playtest plan dan keputusan scope.

### Engineering

- controller, camera, collision, mission, level;
- AI state machine;
- road streaming dan procedural generation;
- data-driven content;
- save, pooling, performance;
- build pipeline dan diagnostics.

### Art dan technical art

- character, motor, traffic, environment;
- PBR material, LOD, texture compression;
- lighting, rain, flood, night;
- animation, VFX, camera feedback;
- asset import dan memory budget.

### UI, audio, dan UX

- onboarding, HUD, menu, garage, mission result;
- feedback timer, reward, stars, unlock;
- engine, traffic, weather, city ambience;
- dynamic music states;
- accessibility dan readability.

### QA dan release

- test case dan regression;
- AI/fairness/performance test;
- device matrix;
- bug triage;
- store, legal, privacy, dan release checklist.

---

## 8. Definition of Done Umum

Sebuah fitur dianggap selesai apabila:

- behavior utama berjalan pada device target;
- ada feedback visual/audio yang memadai;
- dapat di-reset dan dimainkan ulang;
- data penting tersimpan dengan benar;
- tidak menghasilkan error atau object leak;
- sudah diuji pada kondisi normal dan edge case;
- tidak menurunkan frame rate di bawah budget;
- dokumentasi tuning dan parameter tersedia;
- tidak menggunakan aset/brand tanpa hak penggunaan;
- lolos review design, engineering, dan QA terkait.

---

## 9. Risiko Utama dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Scope terlalu besar untuk mobile-first | jadwal dan kualitas runtuh | kunci MVP satu karakter, satu motor, satu level |
| Hyper-realistic art terlalu dini | waktu habis sebelum gameplay tervalidasi | placeholder sampai gate M1; final art dimulai di vertical slice |
| Traffic terasa curang | pemain berhenti bermain | telegraph, reaction-time rules, seed, fairness validator |
| Procedural content tidak playable | bug dan frustrasi sulit direproduksi | seed, safe-path validation, segment test |
| Performa buruk karena visual | target device gagal | profiling sejak M1, LOD, pooling, texture budget |
| Economy terlalu grindy | progression tidak memuaskan | tuning berdasarkan playtest, tanpa monetisasi di MVP |
| Ketergantungan backend terlalu awal | scope dan biaya naik | local save dulu; online hanya setelah core game stabil |
| Brand/asset bermasalah secara hukum | risiko takedown dan biaya | semua nama, logo, seragam, signage, dan asset dibuat orisinal |
| Tidak ada device nyata untuk tes | masalah mobile terlambat ditemukan | tetapkan device matrix dan tes fisik sejak prototype |

---

## 10. Metrik Keberhasilan

### Metrik kualitas produk

- kontrol dasar dipahami tester tanpa pendampingan;
- pemain bersedia mengulang setelah gagal;
- completion rate Level 1 meningkat setelah tutorial tuning;
- crash terasa dapat dipelajari dan bukan random;
- tidak ada laporan no-safe-path pada level yang sudah dikunci;
- progress tersimpan dan dipulihkan secara konsisten;
- minimum 30 FPS pada device target terendah.

### Metrik keputusan milestone

- **M1:** fun dan readability;
- **M2:** stabilitas fondasi dan kemampuan iterasi;
- **M3:** kualitas vertical slice serta performa;
- **M4:** konsistensi 10 level dan progression;
- **M5:** replayability dan fairness endless;
- **M6:** stability, polish, compliance, dan kesiapan soft launch.

Angka target retention, monetisasi, atau revenue sebaiknya ditetapkan setelah prototype menghasilkan data playtest. Jangan mengoptimalkan monetisasi sebelum core loop terbukti menyenangkan.

---

## 11. Rencana 10 Hari Pertama

### Hari 1–2

- kunci Unity/URP dan target device;
- buat scene prototype;
- buat greybox road dan lane;
- buat player placeholder;
- tetapkan input keyboard serta mobile abstraction.

### Hari 3–4

- implement lane movement, brake, jump, boost;
- implement kamera isometric;
- tambahkan traffic placeholder dan collision;
- mulai frame-time profiling.

### Hari 5–6

- implement timer, pickup, destination, delivery;
- buat HUD dasar dan fail/success state;
- implement restart deterministik.

### Hari 7–8

- tambahkan near miss, combo sederhana, dan obstacle;
- tuning kecepatan, lane width, reaction time;
- playtest internal pertama.

### Hari 9

- perbaiki tiga masalah terbesar dari playtest;
- tambahkan reward dan save minimal;
- buat build Android target.

### Hari 10

- playtest kedua;
- review Fun Check;
- putuskan: lanjut foundation, iterasi kontrol, atau potong scope.

---

## 12. Keputusan yang Harus Dikunci Sebelum Produksi Penuh

1. Platform launch pertama: Android saja atau Android + iOS.
2. Engine version dan minimum device.
3. Apakah PC/Web rilis bersamaan atau tahap kedua.
4. Sumber asset: in-house, outsource, asset store, atau campuran.
5. Apakah karakter memakai voice/dialogue atau hanya text/audio feedback.
6. Apakah leaderboard online masuk release pertama.
7. Apakah premium currency ditunda sampai update pasca-MVP.
8. Nama brand fiktif delivery, gaya signage, dan aturan legal asset.
9. Target ukuran download dan batas RAM.
10. Model update konten setelah campaign 10 level selesai.

---

## 13. Ringkasan Rekomendasi

Bangun **prototype kecil yang playable dalam 2 minggu**, lalu gunakan **vertical slice Level 1 selama 4 minggu** untuk memvalidasi feel, kualitas visual, performa, dan fairness. Setelah gate tersebut lolos, produksi campaign dengan pendekatan satu level satu mechanic. Endless mode, leaderboard, dan monetisasi diletakkan setelah campaign inti stabil.

Urutan investasi yang disarankan:

> **Gameplay → Fairness → Traffic AI → Level Generation → Mission → Progression → Visual → Audio/VFX → Online/Monetization**

Golden rule selama produksi:

> **FUN > COMPLEXITY**  
> **FAIRNESS > RANDOMNESS**  
> **GAMEPLAY > GRAPHICS**  
> **PLAYER SKILL > PURE LUCK**
