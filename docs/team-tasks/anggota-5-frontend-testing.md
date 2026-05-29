# Anggota 5 - Frontend, Testing, dan Dokumentasi

## Role Anggota

Frontend, Testing, dan Dokumentasi

## Tanggung Jawab Utama

- Membuat halaman login.
- Membuat halaman register.
- Membuat dashboard mahasiswa.
- Membuat halaman tambah laporan.
- Membuat halaman daftar laporan.
- Membuat halaman detail laporan.
- Membuat dashboard teknisi/admin.
- Membuat halaman kelola kategori.
- Mengintegrasikan frontend dengan API.
- Membuat dokumentasi testing.

## File atau Folder yang Harus Dikerjakan

- `frontend-placeholder`
- `docs/api`

## Endpoint yang Harus Digunakan

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports`
- `PUT /api/reports/:id`
- `DELETE /api/reports/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/reports/:id/updates`
- `POST /api/reports/:id/updates`

## Dependency Task

- Membutuhkan endpoint auth dari Anggota 2.
- Membutuhkan endpoint reports dari Anggota 3.
- Membutuhkan endpoint categories dan report updates dari Anggota 4.
- Dokumentasi testing mengikuti API final yang sudah digabungkan ke `dev`.

## Catatan Branch

Gunakan branch `feat/anggota-5-frontend`.

Frontend boleh dibuat di folder terpisah jika tim menyepakati. Jika frontend belum dibuat sekarang, folder `frontend-placeholder` hanya berisi arahan halaman yang harus dibuat.
