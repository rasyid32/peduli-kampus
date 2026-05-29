# Anggota 4 - Backend Category dan Report Updates

## Role Anggota

Backend Category dan Report Updates

## Tanggung Jawab Utama

- Membuat CRUD kategori.
- Membuat fitur riwayat update laporan.
- Membuat fitur update status laporan oleh teknisi/admin.
- Mengubah status di tabel `reports` ketika ada update baru di `report_updates`.

## File yang Harus Dikerjakan

- `src/controllers/categoryController.js`
- `src/controllers/reportUpdateController.js`
- `src/routes/categoryRoutes.js`
- `src/routes/reportUpdateRoutes.js`

## Endpoint yang Harus Dibuat

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/reports/:id/updates`
- `POST /api/reports/:id/updates`

## Dependency Task

- Membutuhkan tabel `categories`, `reports`, dan `report_updates`.
- Membutuhkan auth middleware dari Anggota 2.
- Membutuhkan role middleware dari Anggota 2 karena update status hanya boleh dilakukan teknisi/admin.
- Perubahan status harus menjaga konsistensi antara `reports.status` dan `report_updates.status`.

## Catatan Branch

Gunakan branch `feat/anggota-4-category-updates`.
