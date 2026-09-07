# 03 — Control Feel Specification

## Status

**COMPLETED — initial tuning contract**

Angka di sini adalah source of truth untuk prototype. Semua nilai harus diekspose sebagai data/tuning parameter, bukan hard-coded tersebar di gameplay code.

## Coordinate and lane model

- lane count: **3**;
- lane width center-to-center: **2,4 m**;
- road width usable: **7,2 m**;
- lane indices: `-1`, `0`, `+1`;
- player starts at center lane `0`;
- lane change tidak boleh melewati dua lane dalam satu input;
- lane change target dikunci setelah input diterima untuk mencegah zig-zag accidental;
- player collision capsule tidak boleh melebihi 65% lane width.

## Player movement

| Parameter | Prototype value | Tuning rule |
|---|---:|---|
| Cruise speed | 14 m/s | target rata-rata agar delivery 90 detik terbaca |
| Minimum controlled speed | 4 m/s | di bawah ini player dianggap braking/obstacle state |
| Maximum normal speed | 17 m/s | tidak boleh membuat timer trivial |
| Boost speed cap | 21 m/s | boost memberi advantage, bukan invulnerability |
| Acceleration 0–cruise | 1,8 s | responsif tetapi tidak instan |
| Brake cruise–low | 0,9 s | cukup untuk membaca obstacle |
| Lane shift duration | 0,22 s | tidak boleh terasa teleport |
| Lane shift cooldown | 0,18 s | mencegah spam input |
| Jump airtime | 0,62 s | cukup melewati speed bump ringan |
| Jump apex | 0,65 m | tidak menghindari kendaraan besar |
| Boost initial duration | 2,5 s | upgrade dapat memperpanjang nanti |
| Boost refill | near miss/combo/item | tidak refill otomatis tanpa aksi |
| Horn cooldown | 0,8 s | feedback, bukan mekanik wajib |

## Input contract

### Mobile

- swipe left/right dengan threshold **60 dp** dan max recognition window **250 ms**;
- swipe up/down dengan threshold **55 dp**;
- hold boost mulai setelah **120 ms**;
- tap horn tidak mengubah lane atau speed;
- input yang terjadi saat crash/reward screen diabaikan;
- input tetap relatif terhadap screen orientation yang didukung.

### PC development

- A/Left: lane left;
- D/Right: lane right;
- W/Up: jump;
- S/Down: brake;
- Space: boost;
- H: horn;
- Escape: pause.

## Camera contract

- projection: perspective;
- pitch: **40°**;
- yaw: mengikuti arah jalan, default 0°;
- player vertical anchor: **42% dari bawah viewport**;
- horizontal anchor: center lane, toleransi ±4% viewport;
- follow damping: position **0,12 s**, rotation **0,16 s**;
- normal FOV: **42°**;
- boost FOV: **46°** selama 0,20 s ease-in/ease-out;
- boost zoom-out: **+6%**;
- near-miss slow motion: **0,12 s** pada time scale 0,85;
- camera shake near miss: ringan, maksimal **0,08°**;
- crash shake: maksimal **0,35°**, durasi ≤0,35 s;
- camera shake tidak boleh mengaburkan HUD atau destination.

## Collision and fairness

- minor collision: -5 HP;
- medium collision: -15 HP;
- major collision: -30 HP;
- prototype maximum HP: **100**;
- critical collision/crash: HP ≤0;
- obstacle ringan harus terlihat minimal **0,6 s** sebelum collision envelope;
- obstacle berat minimal **1,0 s**;
- kombinasi obstacle minimal **1,5 s**;
- pedestrian tidak boleh spawn di depan player tanpa warning;
- every generated/placed obstacle must have at least one valid escape lane;
- boost tidak menghapus collision, tetapi boleh memberi lebih banyak ruang melalui kecepatan.

## Delivery and timer

- target route length: sekitar **960 m**;
- level timer: **90 s**;
- pickup interaction: masuk radius **3 m**, auto-confirm setelah 0,4 s;
- destination interaction: masuk radius **4 m**, delivery cinematic ≤1,5 s;
- timer pause hanya pada pre-run, pause menu, dan result screen;
- timer tidak pause saat pickup/delivery cinematic setelah gameplay dimulai;
- fail jika timer 0 atau HP 0;
- success jika destination valid tercapai sebelum timer 0.

## Tuning boundaries

Tuning dianggap keluar batas jika:

- lane change terasa tidak mungkin dibatalkan pada 3 dari 5 percobaan;
- pemain tidak dapat merespons obstacle sesuai reaction-time budget;
- boost selalu merupakan pilihan terbaik tanpa risiko;
- timer tidak memberi tekanan atau mustahil tanpa upgrade;
- collision berasal dari overlap visual yang tidak terlihat oleh pemain.
