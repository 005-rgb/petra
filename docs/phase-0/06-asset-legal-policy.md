# 06 — Asset, Brand, dan Legal Policy

## Status

**COMPLETED — mandatory for all future production assets**

## Brand safety

Game tidak boleh menggunakan tanpa lisensi tertulis:

- nama, logo, warna identitas, seragam, delivery box, atau signage Gojek;
- nama, logo, warna identitas, seragam, delivery box, atau signage Grab;
- brand kendaraan, restoran, bank, operator, atau properti nyata yang dapat dianggap endorsement;
- foto wajah orang nyata sebagai karakter tanpa release;
- peta, foto street view, atau asset kota dengan hak penggunaan yang tidak jelas.

### Direction yang disetujui

- gunakan perusahaan delivery fiktif;
- gunakan signage generik/orisinal seperti “RUSH BOX”, “JALAN CEPAT”, atau nama yang lolos pemeriksaan internal;
- desain warna, logo, uniform, box, dan sticker sendiri;
- karakter adalah karakter original, bukan likeness orang tertentu;
- gunakan Jakarta sebagai inspirasi suasana, bukan menyalin asset berhak cipta.

## Asset provenance record

Setiap asset yang masuk repository wajib memiliki record:

| Field | Wajib |
|---|---|
| Asset ID | Ya |
| Nama/deskripsi | Ya |
| Creator/vendor | Ya |
| Source URL atau reference | Ya |
| License type | Ya |
| Commercial use permitted | Ya |
| Attribution required | Ya/Tidak |
| Modification permitted | Ya/Tidak |
| Date acquired | Ya |
| Reviewer | Ya |

Asset tanpa record dianggap **blocked**, meskipun sudah terlihat bagus di scene.

## Production naming

- `CHR_` character;
- `VEH_` vehicle;
- `ENV_` environment;
- `TRF_` traffic;
- `OBS_` obstacle;
- `VFX_` visual effect;
- `SFX_` sound effect;
- `UI_` interface;
- `MAT_` material;
- `LOC_` level/location.

Contoh:

`VEH_CITY125_PROTO_v001`  
`ENV_JKT_NEIGHBORHOOD_ROAD_A_v001`

## Prototype asset rules

- placeholder boleh memakai primitive atau asset berlisensi;
- placeholder tidak boleh mengandung brand nyata;
- hero character dan motorcycle final ditunda sampai vertical slice;
- semua asset prototype harus memiliki collision sederhana dan budget LOD;
- jangan memulai 2K–4K hero texture sebelum frame budget terukur;
- source file asli disimpan terpisah dari exported runtime asset.

## Review gates

1. **Intake:** provenance record lengkap.
2. **Design:** asset mendukung readability dan tidak menutup safe path.
3. **Technical:** polygon, texture, material, LOD, dan memory budget lolos.
4. **Legal:** brand/originality check lolos.
5. **Build:** asset masuk build reproducible tanpa missing reference.
