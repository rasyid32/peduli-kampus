# Anggota 3 - Backend Reports

## Role Anggota

Backend Reports

## Tanggung Jawab Utama

- Membuat CRUD laporan kerusakan.
- Membuat validasi input laporan.
- Membatasi mahasiswa agar hanya bisa melihat laporan miliknya sendiri.
- Membatasi mahasiswa agar hanya bisa edit/hapus laporan saat status `menunggu`.

## File yang Harus Dikerjakan

- `src/controllers/reportController.js`
- `src/routes/reportRoutes.js`

## Endpoint yang Harus Dibuat

- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports`
- `PUT /api/reports/:id`
- `DELETE /api/reports/:id`

## Dependency Task

- Membutuhkan tabel `users`, `categories`, dan `reports`.
- Membutuhkan auth middleware dari Anggota 2.
- Membutuhkan role middleware dari Anggota 2 untuk membedakan akses mahasiswa dan teknisi/admin.

## Catatan Branch

Gunakan branch `feat/anggota-3-reports`.
