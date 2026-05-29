# peduli-kampus

peduli-kampus adalah backend REST API untuk pelaporan dan pemantauan kerusakan fasilitas kampus. Project ini menggunakan ExpressJS sebagai server API, Prisma sebagai ORM, dan MySQL sebagai database.

## Teknologi

- Node.js
- ExpressJS
- Prisma ORM
- MySQL
- CORS
- dotenv
- bcrypt
- jsonwebtoken
- nodemon

## Install Dependency

```bash
npm install
```

Catatan: environment ini menggunakan Prisma 6.x karena Node.js lokal masih `20.13.1`. Prisma 7.x membutuhkan Node.js `20.19+`.

## Setup Database MySQL

1. Buat database MySQL:

```sql
CREATE DATABASE peduli_kampus;
```

2. Pastikan user MySQL memiliki akses ke database tersebut.

3. Sesuaikan koneksi database pada file `.env`.

## Setup .env

Salin contoh konfigurasi dari `.env.example` ke `.env`, lalu ubah nilainya sesuai environment lokal:

```env
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/peduli_kampus"
JWT_SECRET="ganti_dengan_secret_yang_aman"
```

File `.env` tidak disertakan ke repository dan tidak boleh dibagikan.

## Migrate Prisma

Setelah `DATABASE_URL` benar, jalankan migrasi awal:

```bash
npx prisma migrate dev --name init
```

Untuk generate Prisma Client:

```bash
npx prisma generate
```

## Menjalankan Seed

Setelah migrasi berhasil, jalankan seed untuk membuat akun teknisi/admin awal dan kategori default:

```bash
npm run seed
```

Akun teknisi/admin awal:

```text
email: admin@pedulikampus.test
password: admin123
```

## Menjalankan Server

Mode development:

```bash
npm run dev
```

Mode production:

```bash
npm start
```

Endpoint dasar:

```http
GET /
```

Response:

```json
{
  "message": "API peduli-kampus berjalan"
}
```

## Aturan Branching

- Jangan coding langsung di `main`.
- Jangan coding langsung di `dev`.
- Setiap anggota membuat branch masing-masing.
- Pull dari `dev` sebelum mulai coding.
- Push ke branch masing-masing.
- Buat pull request ke `dev`.
- Anggota 1 melakukan review sebelum merge.

Detail aturan ada di [docs/branching-rules.md](docs/branching-rules.md).

## Pembagian Tugas Anggota

- Anggota 1: Project Leader dan Database Designer, branch `feat/anggota-1-setup-database`.
- Anggota 2: Backend Auth dan User, branch `feat/anggota-2-auth`.
- Anggota 3: Backend Reports, branch `feat/anggota-3-reports`.
- Anggota 4: Backend Category dan Report Updates, branch `feat/anggota-4-category-updates`.
- Anggota 5: Frontend, Testing, dan Dokumentasi, branch `feat/anggota-5-frontend`.

Dokumentasi detail tugas ada di folder [docs/team-tasks](docs/team-tasks).
