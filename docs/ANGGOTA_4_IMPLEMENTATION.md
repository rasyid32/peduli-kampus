# Anggota 4 - Implementation Summary

## Overview

Anggota 4 bertugas mengimplementasikan **CRUD Kategori Fasilitas** dan **Riwayat Update Laporan** untuk aplikasi peduli-kampus.

## Files Yang Dikerjakan

### 1. Controllers

#### `src/controllers/categoryController.js`
Mengimplementasikan CRUD operations untuk kategori dengan fitur:
- **getAllCategories()** - GET daftar semua kategori (public)
- **getCategoryById()** - GET detail kategori berdasarkan ID (public)
- **createCategory()** - POST kategori baru (admin only)
  - Validasi unique name
  - Error handling untuk duplicate
- **updateCategory()** - PUT update kategori (admin only)
  - Validasi perubahan name
- **deleteCategory()** - DELETE kategori (admin only)
  - Cek foreign key constraint sebelum delete
  - Prevent delete jika ada laporan yang menggunakan kategori

#### `src/controllers/reportUpdateController.js`
Mengimplementasikan report updates dengan fitur:
- **getReportUpdates()** - GET riwayat update laporan
  - Role-based filtering: mahasiswa hanya laporan miliknya, admin semua
  - Pagination support
  - Include user data di response
- **createReportUpdate()** - POST update status laporan (admin only)
  - Validate status enum
  - **Transactional update**: membuat ReportUpdate dan update Report.status secara atomic
  - Include user data di response

### 2. Routes

#### `src/routes/categoryRoutes.js`
Routes untuk kategori endpoints:
- `GET /api/categories` - Public endpoint
- `GET /api/categories/:id` - Public endpoint
- `POST /api/categories` - Protected + requireAdmin
- `PUT /api/categories/:id` - Protected + requireAdmin
- `DELETE /api/categories/:id` - Protected + requireAdmin

#### `src/routes/reportUpdateRoutes.js`
Routes untuk report updates endpoints:
- `GET /api/reports/:id/updates` - Protected (requireAuth)
- `POST /api/reports/:id/updates` - Protected + requireAdmin
- Uses `mergeParams: true` untuk akses parent route parameter (:id)

### 3. Middlewares

#### `src/middlewares/authMiddleware.js`
JWT authentication middleware:
- Verify JWT token dari Authorization header
- Extract user data dan simpan di req.user
- Handle token expiration dan invalid token errors
- Return 401 untuk missing/invalid token

#### `src/middlewares/roleMiddleware.js`
Role-based access control middleware:
- **requireRole()** - Factory function untuk flexible role checking
- **requireAdmin** - Shortcut untuk requireRole('teknisi_admin')
- **requireStudent** - Shortcut untuk requireRole('mahasiswa')
- Return 403 Forbidden jika user tidak memiliki role yang sesuai

### 4. Integration

#### `src/app.js`
Menambahkan routes ke express app:
```javascript
app.use('/api/categories', categoryRoutes);
app.use('/api/reports/:id/updates', reportUpdateRoutes);
```

## Endpoints Specification

### Category Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/categories` | ❌ | - | Daftar kategori |
| GET | `/api/categories/:id` | ❌ | - | Detail kategori |
| POST | `/api/categories` | ✅ | admin | Buat kategori |
| PUT | `/api/categories/:id` | ✅ | admin | Edit kategori |
| DELETE | `/api/categories/:id` | ✅ | admin | Hapus kategori |

### Report Update Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/reports/:id/updates` | ✅ | - | Riwayat update* |
| POST | `/api/reports/:id/updates` | ✅ | admin | Buat update** |

*Mahasiswa: hanya laporan miliknya, Admin: semua laporan
**Auto update Report.status ketika ReportUpdate dibuat

## Key Implementation Details

### 1. Role-Based Access Control

Mahasiswa vs Teknisi/Admin:
```
- GET /api/categories: PUBLIC (semua bisa)
- POST/PUT/DELETE /api/categories: ADMIN ONLY
- GET /api/reports/:id/updates: AUTH (mahasiswa: own reports, admin: all)
- POST /api/reports/:id/updates: ADMIN ONLY
```

### 2. Transactional Update (Report + ReportUpdate)

Ketika admin membuat report update, system harus:
1. Create ReportUpdate record
2. Update Report.status dengan status yang sama

Implemented using Prisma transaction untuk atomicity:
```javascript
await prisma.$transaction(async (tx) => {
  const newUpdate = await tx.reportUpdate.create(...);
  const updatedReport = await tx.report.update(...);
  return { update: newUpdate, report: updatedReport };
});
```

### 3. Validation & Error Handling

- Validasi input (name, status, etc)
- Unique constraint checking untuk category name
- Foreign key constraint checking sebelum delete
- Proper HTTP status codes (200, 201, 400, 403, 404, 409, 500)
- Descriptive error messages

### 4. Pagination

Report updates support pagination untuk handle large data:
```javascript
router.get('/', authMiddleware, getReportUpdates);
// Query: ?page=1&limit=10
```

## Database Relations

### Digunakan:
```
User.reports -> Report (1-to-many)
User.reportUpdates -> ReportUpdate (1-to-many)
Category.reports -> Report (1-to-many)
Report.updates -> ReportUpdate (1-to-many)
Report.user, Report.category (foreign key)
ReportUpdate.report, ReportUpdate.user (foreign key)
```

### Constraints:
- `Category.onDelete = Restrict` - prevent delete jika ada reports
- `ReportUpdate.onDelete = Cascade` - auto delete updates jika report dihapus

## Response Format

Semua endpoints menggunakan standard response format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {...},
  "error": "error message (if any)"
}
```

## Testing

Lihat `docs/TESTING_GUIDE_ANGGOTA_4.md` untuk:
- Setup instructions
- Endpoint testing guide
- Example requests & responses
- Postman scenarios

## Dependencies

- **Requires**: Authentication implementation (Anggota 2) untuk JWT tokens
- **Requires**: Report CRUD implementation (Anggota 3) untuk report creation
- **Used by**: Front-end untuk category selection dan report update history

## Branch

Semua changes di-commit ke branch: `feat/anggota-4-category-updates`

## Deadlines Completed

- ✅ Task 32: Model/query untuk tabel categories (Deadline: 09:30)
- ✅ Task 33: Endpoint GET /api/categories (Deadline: 10:00)
- ✅ Task 34: Endpoint POST /api/categories (Deadline: 10:45)
- ✅ Task 35: Endpoint PUT /api/categories/:id (Deadline: 11:30)
- ✅ Task 36: Endpoint DELETE /api/categories/:id (Deadline: 12:00)
- ✅ Task 37: Model/query untuk tabel report_updates (Deadline: 12:30)
- ✅ Task 38: Endpoint GET /api/reports/:id/updates (Deadline: 13:00)
- ✅ Task 39: Endpoint POST /api/reports/:id/updates (Deadline: 13:30)
- ✅ Task 40: Auto update Report.status ketika ReportUpdate dibuat (Deadline: 14:00)

**Final Deadline**: Sabtu 30-05-2026 jam 14:00 ✅
