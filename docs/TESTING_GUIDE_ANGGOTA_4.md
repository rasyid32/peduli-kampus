# Testing Guide - Anggota 4 Endpoints

Dokumen ini berisi panduan testing untuk endpoints yang dikerjakan oleh Anggota 4 (Categories & Report Updates).

## Setup Sebelum Testing

1. Clone repository dan checkout ke branch dev
2. Setup .env file berdasarkan .env.example
3. Buat database kosong: `peduli_kampus`
4. Jalankan migrations: `npx prisma migrate dev`
5. Jalankan seed (jika ada): `npm run seed`
6. Start server: `npm run dev`

## Endpoints Category (CRUD Kategori)

### 1. GET /api/categories - Melihat Semua Kategori

**Akses**: Semua user (tanpa authentikasi)

**Request**:
```
GET http://localhost:5000/api/categories
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Daftar kategori berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "Kerusakan Pintu",
      "description": "Kategori untuk kerusakan pintu dan jendela",
      "createdAt": "2026-05-30T10:00:00.000Z",
      "updatedAt": "2026-05-30T10:00:00.000Z"
    }
  ]
}
```

---

### 2. GET /api/categories/:id - Melihat Detail Kategori

**Akses**: Semua user (tanpa authentikasi)

**Request**:
```
GET http://localhost:5000/api/categories/1
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Detail kategori berhasil diambil",
  "data": {
    "id": 1,
    "name": "Kerusakan Pintu",
    "description": "Kategori untuk kerusakan pintu dan jendela",
    "createdAt": "2026-05-30T10:00:00.000Z",
    "updatedAt": "2026-05-30T10:00:00.000Z"
  }
}
```

---

### 3. POST /api/categories - Tambah Kategori Baru

**Akses**: Teknisi/Admin only (dengan authentikasi)

**Request**:
```
POST http://localhost:5000/api/categories
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "name": "Kerusakan Atap",
  "description": "Kategori untuk kerusakan atap dan struktur bangunan"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Kategori berhasil dibuat",
  "data": {
    "id": 2,
    "name": "Kerusakan Atap",
    "description": "Kategori untuk kerusakan atap dan struktur bangunan",
    "createdAt": "2026-05-30T11:00:00.000Z",
    "updatedAt": "2026-05-30T11:00:00.000Z"
  }
}
```

**Error Cases**:
- 400 Bad Request: Jika name kosong
- 409 Conflict: Jika kategori dengan nama yang sama sudah ada
- 401 Unauthorized: Jika token tidak valid
- 403 Forbidden: Jika user bukan admin

---

### 4. PUT /api/categories/:id - Edit Kategori

**Akses**: Teknisi/Admin only (dengan authentikasi)

**Request**:
```
PUT http://localhost:5000/api/categories/2
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "name": "Kerusakan Atap - Updated",
  "description": "Kategori yang sudah diupdate"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Kategori berhasil diubah",
  "data": {
    "id": 2,
    "name": "Kerusakan Atap - Updated",
    "description": "Kategori yang sudah diupdate",
    "createdAt": "2026-05-30T11:00:00.000Z",
    "updatedAt": "2026-05-30T11:30:00.000Z"
  }
}
```

---

### 5. DELETE /api/categories/:id - Hapus Kategori

**Akses**: Teknisi/Admin only (dengan authentikasi)

**Request**:
```
DELETE http://localhost:5000/api/categories/2
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Kategori berhasil dihapus"
}
```

**Error Cases**:
- 404 Not Found: Jika kategori tidak ada
- 409 Conflict: Jika kategori masih digunakan oleh laporan
- 401 Unauthorized: Jika token tidak valid
- 403 Forbidden: Jika user bukan admin

---

## Endpoints Report Updates

### 6. GET /api/reports/:id/updates - Melihat Riwayat Update Laporan

**Akses**: Authentikasi required
- Mahasiswa: Hanya bisa melihat update laporan miliknya
- Teknisi/Admin: Bisa melihat semua update laporan

**Request**:
```
GET http://localhost:5000/api/reports/1/updates?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Riwayat update laporan berhasil diambil",
  "data": {
    "report": {
      "id": 1,
      "title": "Pintu Rusak di Gedung A",
      "currentStatus": "diproses"
    },
    "updates": [
      {
        "id": 1,
        "reportId": 1,
        "userId": 2,
        "status": "diproses",
        "note": "Masalah sudah diidentifikasi, sedang dalam proses perbaikan",
        "createdAt": "2026-05-30T12:00:00.000Z",
        "user": {
          "id": 2,
          "name": "Admin Teknis",
          "email": "admin@example.com",
          "role": "teknisi_admin"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

**Error Cases**:
- 404 Not Found: Jika laporan tidak ada
- 403 Forbidden: Jika mahasiswa mencoba melihat laporan orang lain
- 401 Unauthorized: Jika token tidak valid

---

### 7. POST /api/reports/:id/updates - Tambah Update Status Laporan

**Akses**: Teknisi/Admin only (dengan authentikasi)

**Request**:
```
POST http://localhost:5000/api/reports/1/updates
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "status": "selesai",
  "note": "Pintu sudah berhasil diperbaiki. Silahkan verifikasi kualitas perbaikan."
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Update status laporan berhasil dibuat",
  "data": {
    "update": {
      "id": 2,
      "reportId": 1,
      "userId": 2,
      "status": "selesai",
      "note": "Pintu sudah berhasil diperbaiki. Silahkan verifikasi kualitas perbaikan.",
      "createdAt": "2026-05-30T13:00:00.000Z",
      "user": {
        "id": 2,
        "name": "Admin Teknis",
        "email": "admin@example.com",
        "role": "teknisi_admin"
      }
    },
    "updatedReport": {
      "id": 1,
      "status": "selesai",
      "updatedAt": "2026-05-30T13:00:00.000Z"
    }
  }
}
```

**Note**: Ketika membuat update, field `status` di tabel `reports` juga otomatis berubah menjadi status yang baru (selesai).

**Error Cases**:
- 400 Bad Request: Jika status tidak valid (harus: menunggu, diproses, selesai, ditolak)
- 404 Not Found: Jika laporan tidak ada
- 401 Unauthorized: Jika token tidak valid
- 403 Forbidden: Jika user bukan admin

---

## Testing dengan Postman

### Persiapan

1. Buka Postman
2. Buat new Collection: "peduli-kampus-anggota4"
3. Add Environment Variable: 
   - `base_url`: `http://localhost:5000`
   - `admin_token`: (akan di-update setelah login sebagai admin)
   - `student_token`: (akan di-update setelah login sebagai mahasiswa)

### Test Scenarios

#### Scenario 1: Create Category (Admin Only)
1. Call POST /api/categories dengan JWT token admin
2. Verify response 201 dengan data kategori baru

#### Scenario 2: Get All Categories (Public)
1. Call GET /api/categories tanpa token
2. Verify response 200 dengan daftar kategori

#### Scenario 3: Mahasiswa Cannot Create Category
1. Call POST /api/categories dengan JWT token mahasiswa
2. Verify response 403 Forbidden

#### Scenario 4: Create Report Update dan Auto Update Report Status
1. Call POST /api/reports/:id/updates dengan status "diproses"
2. Call GET /api/reports/:id untuk verify status berubah
3. Verify field `status` di report adalah "diproses"

#### Scenario 5: Mahasiswa Only See Own Report Updates
1. Mahasiswa A call GET /api/reports/:id/updates untuk laporan Mahasiswa B
2. Verify response 403 Forbidden

#### Scenario 6: Admin Can See All Report Updates
1. Admin call GET /api/reports/1/updates
2. Admin call GET /api/reports/2/updates
3. Verify both returns 200 OK

---

## Catatan Testing

- Gunakan postman atau curl untuk testing
- Pastikan .env sudah dikonfigurasi dengan benar
- Pastikan database sudah di-setup dengan migrations
- Jika ada error, check console server untuk debug messages
- JWT token dapat diperoleh dari endpoint login (yang dikerjakan Anggota 2)

## Dependencies Task Completion

Endpoints Anggota 4 membutuhkan:
- ✅ Database tables (sudah dibuat via migrations)
- ⏳ Auth middleware (sudah dibuat oleh Anggota 4)
- ⏳ Login endpoint (dikerjakan Anggota 2)
- ⏳ Report CRUD (dikerjakan Anggota 3)
