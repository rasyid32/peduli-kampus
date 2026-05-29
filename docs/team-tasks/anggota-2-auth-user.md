# Anggota 2 - Backend Auth dan User

## Role Anggota

Backend Auth dan User

## Tanggung Jawab Utama

- Membuat register.
- Membuat login.
- Hashing password dengan bcrypt.
- Membuat JWT token.
- Membuat auth middleware.
- Membuat role middleware.
- Membuat endpoint profile user.

## File yang Harus Dikerjakan

- `src/controllers/authController.js`
- `src/controllers/userController.js`
- `src/routes/authRoutes.js`
- `src/routes/userRoutes.js`
- `src/middlewares/authMiddleware.js`
- `src/middlewares/roleMiddleware.js`

## Endpoint yang Harus Dibuat

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users`

## Dependency Task

- Membutuhkan tabel `users` pada Prisma schema.
- Membutuhkan `bcrypt` untuk hashing password.
- Membutuhkan `jsonwebtoken` untuk JWT.
- Endpoint reports, categories, dan report updates akan memakai middleware auth/role dari anggota 2.

## Catatan Branch

Gunakan branch `feat/anggota-2-auth`.
