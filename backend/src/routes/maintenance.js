const router = require('express').Router();
const db = require('../db');
const n = (v) => (v === undefined ? null : v);

const SELECT = `SELECT mt.*, m.name AS machine_name, m.code AS machine_code, m.location AS machine_location
                FROM maintenance mt JOIN machines m ON m.id = mt.machine_id`;

// Jika pekerjaan selesai, perbarui tanggal perawatan terakhir pada mesin
function syncMachine(id) {
  const row = db.prepare('SELECT machine_id, status, maintenance_date FROM maintenance WHERE id = ?').get(id);
  if (row && row.status === 'Selesai') {
    db.prepare('UPDATE machines SET last_maintenance = MAX(COALESCE(last_maintenance, ?), ?) WHERE id = ?')
      .run(row.maintenance_date, row.maintenance_date, row.machine_id);
  }
}

// GET /api/maintenance?status=
router.get('/', (req, res, next) => {
  try {
    const { status } = req.query;
    const rows = db.prepare(
      `${SELECT} ${status ? 'WHERE mt.status = ?' : ''} ORDER BY mt.maintenance_date DESC, mt.id DESC`)
      .all(...(status ? [status] : []));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

// GET /api/maintenance/:id
router.get('/:id', (req, res, next) => {
  try {
    const row = db.prepare(`${SELECT} WHERE mt.id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

// POST /api/maintenance
router.post('/', (req, res, next) => {
  try {
    const { machine_id, title, type, technician, maintenance_date, status, notes } = req.body;
    if (!machine_id || !title || !technician || !maintenance_date)
      return res.status(400).json({ success: false, message: 'machine_id, title, technician, dan maintenance_date wajib diisi' });
    const r = db.prepare(
      `INSERT INTO maintenance (machine_id,title,type,technician,maintenance_date,status,notes) VALUES (?,?,?,?,?,?,?)`)
      .run(machine_id, title, type || 'Preventive', technician, maintenance_date, status || 'Pending', n(notes));
    const id = Number(r.lastInsertRowid);
    syncMachine(id);
    res.status(201).json({ success: true, data: { id } });
  } catch (e) { next(e); }
});

// PUT /api/maintenance/:id
router.put('/:id', (req, res, next) => {
  try {
    const { machine_id, title, type, technician, maintenance_date, status, notes } = req.body;
    const r = db.prepare(
      `UPDATE maintenance SET machine_id=?, title=?, type=?, technician=?, maintenance_date=?, status=?, notes=? WHERE id=?`)
      .run(n(machine_id), n(title), n(type), n(technician), n(maintenance_date), n(status), n(notes), req.params.id);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    syncMachine(req.params.id);
    res.json({ success: true, message: 'Data diperbarui' });
  } catch (e) { next(e); }
});

// PATCH /api/maintenance/:id/status
router.patch('/:id/status', (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Selesai'].includes(status))
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    const r = db.prepare('UPDATE maintenance SET status = ? WHERE id = ?').run(status, req.params.id);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    syncMachine(req.params.id);
    res.json({ success: true, message: 'Status diperbarui' });
  } catch (e) { next(e); }
});

// DELETE /api/maintenance/:id
router.delete('/:id', (req, res, next) => {
  try {
    const r = db.prepare('DELETE FROM maintenance WHERE id = ?').run(req.params.id);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, message: 'Data dihapus' });
  } catch (e) { next(e); }
});

module.exports = router;
