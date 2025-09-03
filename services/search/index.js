const express = require('express');
const axios = require('axios');
const router = express.Router();

const CATALOG_SERVICE_URL = 'http://localhost:3000/catalog';

router.get('/', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(`${CATALOG_SERVICE_URL}`);
    const allProperties = response.data;

    const filtered = allProperties.filter(p =>
      p.nama_properti?.toLowerCase().includes(q.toLowerCase()) ||
      p.alamat_properti?.toLowerCase().includes(q.toLowerCase()) ||
      p.tipe_properti?.toLowerCase().includes(q.toLowerCase())
    );

    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal mengambil data dari service catalog' });
  }
});

module.exports = router;
