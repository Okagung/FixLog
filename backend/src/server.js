require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ app: 'FixLog API', status: 'running' }));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/maintenance', require('./routes/maintenance'));

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`FixLog API berjalan di port ${PORT}`));
