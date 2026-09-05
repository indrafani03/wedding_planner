# Wedding Planner

Aplikasi perencanaan pernikahan **khusus mobile**, dibangun dari isi spreadsheet
`docs/wedding cashflow.xlsx`. Semua 9 sheet dipetakan menjadi 9 modul aplikasi.

## Stack

| Bagian   | Teknologi                                                       |
| -------- | --------------------------------------------------------------- |
| Framework| Next.js 16 (App Router, Server Actions, Turbopack)              |
| Database | PostgreSQL (Neon) via Prisma 7 + `@prisma/adapter-pg`           |
| UI       | shadcn/ui (preset `radix-nova`) + Tailwind CSS v4               |
| Font     | Plus Jakarta Sans                                                |

## Modul

| Sheet Excel                | Halaman                 | Isi                                                     |
| -------------------------- | ----------------------- | ------------------------------------------------------- |
| WEDDING CASH FLOW          | `/cashflow`             | Pemasukan/pengeluaran per CPP & CPW, target tabungan     |
| BUDGET LAMARAN             | `/budget/lamaran`       | Rincian biaya lamaran per kategori                       |
| WEDDING BUDGET             | `/budget/wedding`       | Rincian biaya + 4 termin pembayaran                      |
| BUDGET ADMINITRASI         | `/budget-administrasi`  | Estimasi vs harga real, status Not Yet/On Progress/Done  |
| LIST SESERAHAN             | `/seserahan`            | Checklist hantaran: brand, qty, link, budget vs aktual   |
| ADMINISTRASI DAN DOKUMEN   | `/dokumen`              | Berkas N1–N4, KUA, dll. dikelompokkan A–M                |
| DAFTAR TAMU                | `/tamu`                 | Undangan fisik/digital, konfirmasi hadir, cari & filter  |
| VENDOR CHECKLIST           | `/checklist`            | To-do dengan deadline + countdown otomatis               |
| AFTER MARRIED              | `/after-married`        | Perabotan rumah tangga                                   |
| —                          | `/pengaturan`           | Nama pasangan, tanggal, lokasi, target tabungan          |
| —                          | `/`                     | Dashboard: countdown, saldo, total biaya, progress       |

## UI dipaksa mobile

- Konten dikunci dalam frame `max-w-[430px]` (`src/components/mobile-shell.tsx`);
  di layar desktop tampil sebagai "device" di tengah, bukan layout melebar.
- Navigasi bawah 5 tab + drawer "Menu" untuk semua modul.
- Viewport `maximumScale: 1`, `userScalable: false`, `viewportFit: "cover"`.
- Input dipaksa `font-size: 16px` supaya iOS tidak auto-zoom saat fokus.
- Semua form memakai bottom sheet, bukan dialog desktop.

## Kunci PIN

Seluruh aplikasi terkunci di balik **PIN 4 angka** yang di-hardcode di `.env`:

```env
APP_PIN="1234"
```

Ganti nilainya lalu jalankan ulang aplikasi — tidak ada layar "buat PIN",
PIN selalu diambil dari environment.

- Sesi berupa cookie `wp_session` **httpOnly** yang ditandatangani HMAC-SHA256
  dengan `AUTH_SECRET`, berlaku 30 hari.
- **5 kali salah** mengunci percobaan selama 5 menit (tabel `PinAttempt` hanya
  menyimpan penghitung, bukan PIN-nya). Buka paksa dengan `npm run pin:unlock`.
- `src/proxy.ts` mencegat semua navigasi; membuka `/tamu` saat terkunci akan
  diarahkan ke `/masuk?next=/tamu` lalu kembali ke sana setelah PIN benar.
- Setiap Server Action juga diverifikasi ulang lewat `runAction()`, karena action
  bisa dipanggil langsung dengan POST tanpa melewati navigasi.
- Tombol **Kunci aplikasi** ada di halaman `/pengaturan`.

> PIN 4 angka hanya 10.000 kombinasi dan tersimpan sebagai teks polos di `.env`.
> Jaga file `.env` tetap di luar version control (sudah diatur di `.gitignore`).

## Menjalankan

```bash
npm install
cp .env.example .env      # isi DATABASE_URL, AUTH_SECRET, APP_PIN
npx prisma generate
npx prisma db push        # buat tabel
npx prisma db seed        # isi data dari docs/wedding cashflow.xlsx
npm run dev               # http://localhost:3000
```

Seed bersifat idempoten: tabel yang sudah berisi data tidak ditimpa.

## Catatan

- `DATABASE_URL` memakai koneksi **pooled** Neon. Karena itu skema diterapkan
  dengan `prisma db push` (bukan `prisma migrate dev`, yang butuh shadow database).
- Prisma dipin di **7.10.0** (rilis stabil terbaru). Tag `latest` untuk paket CLI
  `prisma` saat ini menunjuk ke `8.0.0-rc`, yang tidak cocok dengan
  `@prisma/client@7.10.0`.
- `npm audit` melaporkan isu pada `mysql2`/`deepmerge-ts`; keduanya dependensi
  transitif **devDependency** Prisma CLI dan tidak ikut ke bundle produksi.
