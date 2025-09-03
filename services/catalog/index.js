const express = require('express');
const router = express.Router();
const db = require('../../db');
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Properti');
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil semua properti:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data properti' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [propertiRows] = await db.query('SELECT * FROM Properti WHERE id_properti = ?', [id]);
    const properti = propertiRows[0];
    if (!properti) return res.status(404).json({ message: 'Properti tidak ditemukan' });

    const [fasilitasRows] = await db.query(`
      SELECT f.id_fasilitas, f.nama_fasilitas, f.kondisi_fasilitas, f.lokasi_fasilitas
      FROM Fasilitas f
      JOIN Properti_Fasilitas pf ON f.id_fasilitas = pf.id_fasilitas
      WHERE pf.id_properti = ?
    `, [id]);

    const reviewResponse = await axios.get(`http://localhost:3000/review/${id}`);
    const ulasan = reviewResponse.data;

    res.json({
      ...properti,
      fasilitas: fasilitasRows,
      ulasan: ulasan
    });

  } catch (error) {
    console.error('Error mengambil data properti:', error.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data properti' });
  }
});

module.exports = router;
