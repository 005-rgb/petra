# 01 — Scope Lock

## Status

**COMPLETED — locked for prototype**

## Product contract

**RUSH RIDER: JAKARTA** adalah isometric motorcycle delivery runner. Pemain menerima order, menuju pickup, membawa order melewati lalu lintas Jakarta, memilih jalur aman atau shortcut, lalu menyelesaikan delivery sebelum timer habis.

### One-line test

> Jika pemain tidak membuat keputusan berkendara dalam 10 detik pertama, prototype belum membuktikan core fantasy.

## Prototype scope

### In scope

- 1 driver: Arya;
- 1 motorcycle: City 125;
- 1 environment: jalan lingkungan/arteri Jakarta pagi hari;
- 1 weather: Sunny;
- 1 order type: Normal;
- 1 playable level;
- 3-lane movement;
- acceleration, brake, jump, boost, horn;
- isometric camera dengan smooth follow;
- traffic dasar: motor dan mobil;
- obstacle: cone dan speed bump;
- pickup point dan destination;
- timer 90 detik;
- collision, HP, crash, restart;
- basic near miss feedback;
- reward cash virtual;
- basic HUD;
- local save minimal;
- keyboard/PC input untuk development dan mobile input abstraction untuk device.

### Prototype acceptance criteria

Prototype dianggap lolos scope apabila:

1. pemain dapat mulai dari order card tanpa debug command;
2. pemain dapat mencapai pickup;
3. pemain dapat berkendara, menghindari minimal satu traffic, dan mencapai destination;
4. timer, distance, HP, boost, dan reward terbaca;
5. collision menimbulkan konsekuensi dan crash dapat direstart;
6. rute memiliki minimal satu jalur aman yang konsisten;
7. run yang sama dapat diulang dengan state bersih;
8. build berjalan minimal 30 FPS pada floor device dengan placeholder;
9. minimal 5 sesi playtest internal menghasilkan catatan tuning;
10. tidak ada feature non-MVP yang diperlukan untuk menyelesaikan loop.

## Non-goals yang dikunci

Tidak boleh masuk prototype tanpa perubahan scope tertulis:

- real-money payment atau premium currency;
- login, account backend, cloud save;
- leaderboard online dan anti-cheat server;
- 5 karakter dan 5 motor;
- 10 level campaign;
- endless procedural final;
- banjir, hujan, night mode, traffic wave, dan unpredictable turn final;
- hyper-realistic final assets;
- voice acting;
- live events, ads, gacha, atau revive berbayar.

## Definition of fun

Prototype dinilai “fun enough to continue” jika pada playtest:

- 4 dari 5 tester memahami tujuan dan kontrol utama tanpa didampingi;
- 3 dari 5 tester melakukan retry secara sukarela setelah gagal;
- setiap tester dapat menyebutkan minimal satu keputusan yang mereka buat;
- tidak ada tester yang mengalami no-safe-path pada run yang valid;
- masalah utama yang ditemukan dapat dituning melalui parameter, bukan rewrite sistem.

## Scope change rule

Perubahan scope harus memiliki:

- alasan dan user impact;
- estimasi waktu;
- risiko performa;
- dampak pada acceptance criteria;
- keputusan approve dari design lead dan engineering lead.

Tanpa lima hal tersebut, perubahan ditolak sampai setelah Fun Check.
