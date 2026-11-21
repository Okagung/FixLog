# FixLog - Industrial Maintenance Tracker

Aplikasi pencatatan & pemantauan pemeliharaan mesin industri.
Tugas Akhir Praktikum Pemrograman Perangkat Bergerak 2026 (React Native).

**Arsitektur:** React Native -> Axios -> Node.js + Express.js (REST API) -> SQLite

## Struktur
- `backend/`  : REST API (Express + SQLite)
- `mobile/`   : aplikasi React Native (Expo)

## Menjalankan Backend
Butuh Node.js >= 22.5 (tanpa XAMPP/MySQL; database SQLite otomatis dibuat & terisi data contoh).
```bash
cd backend
npm install
npm start   # http://localhost:3000
```

## Menjalankan Mobile
Lihat `mobile/README_SETUP.md`. Atur `BASE_URL` di `mobile/src/config.js`.

## Endpoint API
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | /api/dashboard | Ringkasan mesin & pemeliharaan |
| GET | /api/machines | Daftar mesin |
| GET | /api/machines/:id | Detail mesin + riwayat |
| POST/PUT/DELETE | /api/machines[/:id] | CRUD mesin |
| GET | /api/maintenance | Daftar pemeliharaan (?status=) |
| GET | /api/maintenance/:id | Detail pemeliharaan |
| POST | /api/maintenance | Tambah pemeliharaan |
| PUT | /api/maintenance/:id | Ubah pemeliharaan |
| PATCH | /api/maintenance/:id/status | Ubah status |
| DELETE | /api/maintenance/:id | Hapus pemeliharaan |

## Halaman Aplikasi
Home, Machines (list), Machine Detail, Maintenance (list), Maintenance Detail, Add Maintenance, Profile/About.
