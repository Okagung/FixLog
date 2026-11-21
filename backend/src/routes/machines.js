const router = require('express').Router();
const db = require('../db');
const n = (v) => (v === undefined ? null : v);

// GET /api/machines?status=&q=
router.get('/', (req, res, next) => {
  try {
    const { status, q } = req.query;
    const where = [];
    const params = [];
    if (status) { where.push('m.status = ?'); params.push(status); }
    if (q) { where.push('(m.name LIKE ? OR m.code LIKE ? OR m.location LIKE ?)'); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
    const rows = db.prepare(
      `SELECT m.*, (SELECT COUNT(*) FROM maintenance WHERE machine_id = m.id) AS total_maintenance
       FROM machines m ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY m.name ASC`).all(...params);
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

// GET /api/machines/:id  (beserta riwayat pemeliharaan)
router.get('/:id', (req, res, next) => {
  try {
    const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
    if (!machine) return res.status(404).json({ success: false, message: 'Mesin tidak ditemukan' });
    const history = db.prepare(
      'SELECT * FROM maintenance WHERE machine_id = ? ORDER BY maintenance_date DESC, id DESC').all(req.params.id);
    res.json({ success: true, data: { ...machine, history } });
  } catch (e) { next(e); }
});

// POST /api/machines
router.post('/', (req, res, next) => {
  try {
    const { code, name, location, status, description } = req.body;
    if (!code || !name || !location)
      return res.status(400).json({ success: false, message: 'code, name, dan location wajib diisi' });
    const r = db.prepare('INSERT INTO machines (code,name,location,status,description) VALUES (?,?,?,?,?)')
      .run(code, name, location, status || 'Normal', n(description));
    res.status(201).json({ success: true, data: { id: Number(r.lastInsertRowid) } });
  } catch (e) { next(e); }
});

// PUT /api/machines/:id
router.put('/:id', (req, res, next) => {
  try {
    const { code, name, location, status, description } = req.body;
    const r = db.prepare('UPDATE machines SET code=?, name=?, location=?, status=?, description=? WHERE id=?')
      .run(n(code), n(name), n(location), n(status), n(description), req.params.id);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Mesin tidak ditemukan' });
    res.json({ success: true, message: 'Mesin diperbarui' });
  } catch (e) { next(e); }
});

// DELETE /api/machines/:id
router.delete('/:id', (req, res, next) => {
  try {
    const r = db.prepare('DELETE FROM machines WHERE id = ?').run(req.params.id);
    if (!r.changes) return res.status(404).json({ success: false, message: 'Mesin tidak ditemukan' });
    res.json({ success: true, message: 'Mesin dihapus' });
  } catch (e) { next(e); }
});

module.exports = router;
