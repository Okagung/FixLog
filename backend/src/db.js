// Database SQLite memakai modul bawaan Node.js (node:sqlite) - tanpa XAMPP/MySQL.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, '..', 'fixlog.db'));
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS machines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Normal' CHECK (status IN ('Normal','Perlu Perawatan','Rusak')),
  description TEXT,
  last_maintenance TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS maintenance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Preventive' CHECK (type IN ('Preventive','Corrective','Inspection')),
  technician TEXT NOT NULL,
  maintenance_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Selesai')),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Isi data contoh hanya jika tabel masih kosong
const { n } = db.prepare('SELECT COUNT(*) AS n FROM machines').get();
if (n === 0) {
  const addM = db.prepare('INSERT INTO machines (code,name,location,status,description,last_maintenance) VALUES (?,?,?,?,?,?)');
  [
    ['RM-001', 'Roller Mill A1', 'Mill A - Lantai 2', 'Normal', 'Mesin penggiling gandum tahap pertama dengan kapasitas 120 ton/hari.', '2026-11-02'],
    ['SF-002', 'Plansifter B2', 'Mill A - Lantai 3', 'Perlu Perawatan', 'Mesin pengayak tepung bertingkat. Getaran mulai tidak stabil.', '2026-09-18'],
    ['CV-003', 'Belt Conveyor C1', 'Gudang Produk Jadi', 'Normal', 'Conveyor pengangkut tepung dari silo ke area packing.', '2026-10-25'],
    ['PK-004', 'Packing Machine D1', 'Area Packing', 'Rusak', 'Mesin pengemasan tepung 25 kg. Sensor berat tidak terbaca.', '2026-10-05'],
    ['CP-005', 'Air Compressor E1', 'Utility Room', 'Normal', 'Kompresor udara untuk sistem pneumatik pabrik.', '2026-11-10'],
    ['MT-006', 'Motor Blower F2', 'Mill B - Lantai 1', 'Perlu Perawatan', 'Motor blower pneumatic conveying, suhu motor cenderung naik.', '2026-08-30'],
  ].forEach((r) => addM.run(...r));

  const addT = db.prepare('INSERT INTO maintenance (machine_id,title,type,technician,maintenance_date,status,notes) VALUES (?,?,?,?,?,?,?)');
  [
    [1, 'Penggantian oli gearbox', 'Preventive', 'Budi Santoso', '2026-11-02', 'Selesai', 'Oli diganti sesuai jadwal 3 bulanan. Tidak ditemukan kebocoran.'],
    [2, 'Pengecekan getaran plansifter', 'Inspection', 'Agus Pratama', '2026-11-18', 'In Progress', 'Getaran melebihi batas normal, perlu pengecekan bearing.'],
    [4, 'Perbaikan sensor load cell', 'Corrective', 'Dedi Kurniawan', '2026-11-19', 'In Progress', 'Sensor load cell tidak memberikan pembacaan berat.'],
    [3, 'Pelumasan roller conveyor', 'Preventive', 'Budi Santoso', '2026-10-25', 'Selesai', 'Pelumasan seluruh roller dan pengecekan tegangan belt.'],
    [5, 'Pembersihan filter udara', 'Preventive', 'Rudi Hartono', '2026-11-10', 'Selesai', 'Filter udara dibersihkan dan drain tank dikosongkan.'],
    [6, 'Pengecekan suhu motor blower', 'Inspection', 'Agus Pratama', '2026-11-22', 'Pending', 'Dijadwalkan ukur suhu dan arus motor menggunakan thermal camera.'],
    [1, 'Kalibrasi gap roller', 'Preventive', 'Dedi Kurniawan', '2026-09-12', 'Selesai', 'Gap roller dikalibrasi ulang.'],
  ].forEach((r) => addT.run(...r));
}

module.exports = db;
