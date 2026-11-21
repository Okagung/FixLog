const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  try {
    const m = db.prepare(
      `SELECT COUNT(*) total,
              COALESCE(SUM(status='Normal'),0) normal,
              COALESCE(SUM(status='Perlu Perawatan'),0) perlu,
              COALESCE(SUM(status='Rusak'),0) rusak
       FROM machines`).get();
    const t = db.prepare(
      `SELECT COUNT(*) total,
              COALESCE(SUM(status='Pending'),0) pending,
              COALESCE(SUM(status='In Progress'),0) progress,
              COALESCE(SUM(status='Selesai'),0) selesai
       FROM maintenance`).get();
    const recent = db.prepare(
      `SELECT mt.*, m.name AS machine_name, m.code AS machine_code
       FROM maintenance mt JOIN machines m ON m.id = mt.machine_id
       ORDER BY mt.maintenance_date DESC, mt.id DESC LIMIT 5`).all();
    res.json({ success: true, data: { machines: { ...m }, maintenance: { ...t }, recent } });
  } catch (e) { next(e); }
});

module.exports = router;
