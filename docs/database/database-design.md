# Database Design peduli-kampus

## Nama Database

`peduli_kampus`

## Tabel `users`

Menyimpan data pengguna aplikasi.

Kolom utama:

- `id` - Primary key.
- `name` - Nama user.
- `email` - Email unik untuk login.
- `password` - Password yang sudah di-hash.
- `role` - Role user.
- `created_at` - Waktu data dibuat.
- `updated_at` - Waktu data diperbarui.

Role yang digunakan:

- `mahasiswa`
- `teknisi_admin`

## Tabel `categories`

Menyimpan kategori kerusakan atau fasilitas.

Kolom utama:

- `id` - Primary key.
- `name` - Nama kategori.
- `description` - Deskripsi kategori.
- `created_at` - Waktu data dibuat.
- `updated_at` - Waktu data diperbarui.

## Tabel `reports`

Menyimpan laporan kerusakan yang dibuat mahasiswa.

Kolom utama:

- `id` - Primary key.
- `user_id` - Foreign key ke tabel `users`.
- `category_id` - Foreign key ke tabel `categories`.
- `title` - Judul laporan.
- `description` - Deskripsi kerusakan.
- `location` - Lokasi kerusakan.
- `image_url` - URL foto laporan, opsional.
- `status` - Status laporan.
- `priority` - Prioritas laporan.
- `created_at` - Waktu data dibuat.
- `updated_at` - Waktu data diperbarui.

Status laporan:

- `menunggu`
- `diproses`
- `selesai`
- `ditolak`

Priority laporan:

- `rendah`
- `sedang`
- `tinggi`

## Tabel `report_updates`

Menyimpan riwayat update status laporan.

Kolom utama:

- `id` - Primary key.
- `report_id` - Foreign key ke tabel `reports`.
- `user_id` - Foreign key ke tabel `users` yang membuat update.
- `status` - Status laporan pada update tersebut.
- `note` - Catatan update, opsional.
- `created_at` - Waktu update dibuat.

## Relasi Antar Tabel

- Satu `user` dapat membuat banyak `reports`.
- Satu `category` dapat digunakan oleh banyak `reports`.
- Satu `report` dapat memiliki banyak `report_updates`.
- Satu `user` dengan role `teknisi_admin` dapat membuat banyak `report_updates`.
- `report_updates.report_id` memiliki relasi cascade delete jika laporan dihapus.

## Catatan Enum

Enum role, status laporan, dan priority laporan sudah didefinisikan di `prisma/schema.prisma` agar nilai yang masuk ke database konsisten.
