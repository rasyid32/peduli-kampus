# API Plan peduli-kampus

Dokumen ini berisi rencana endpoint REST API. Implementasi fitur belum dibuat pada tahap setup pondasi.

## Auth Endpoints

- `POST /api/auth/register` - Register user baru dengan role default mahasiswa.
- `POST /api/auth/login` - Login user dan menghasilkan JWT token.

## User Endpoints

- `GET /api/users/me` - Mengambil profile user yang sedang login.
- `GET /api/users` - Mengambil daftar user, khusus teknisi/admin.

## Report Endpoints

- `GET /api/reports` - Mengambil daftar laporan.
- `GET /api/reports/:id` - Mengambil detail laporan.
- `POST /api/reports` - Membuat laporan kerusakan baru.
- `PUT /api/reports/:id` - Mengubah laporan.
- `DELETE /api/reports/:id` - Menghapus laporan.

## Category Endpoints

- `GET /api/categories` - Mengambil daftar kategori.
- `POST /api/categories` - Membuat kategori baru.
- `PUT /api/categories/:id` - Mengubah kategori.
- `DELETE /api/categories/:id` - Menghapus kategori.

## Report Update Endpoints

- `GET /api/reports/:id/updates` - Mengambil riwayat update status laporan.
- `POST /api/reports/:id/updates` - Membuat update status laporan.
