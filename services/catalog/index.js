const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET semua properti
router.get('/', async (req, res) => {
  try {
    // Ambil data properti dari service properti (port 5000)
    const propertiResponse = await axios.get('http://localhost:5000/manajemen_properti');
    const properti = propertiResponse.data;

    res.json(properti);
  } catch (err) {
    console.error('Error mengambil semua properti:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data properti' });
  }
});

// GET properti by id + gabung fasilitas + ulasan
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Ambil detail properti dari service properti
    const propertiResponse = await axios.get(`http://localhost:5000/manajemen_properti/${id}`);
    const properti = propertiResponse.data;

    if (!properti) {
      return res.status(404).json({ message: 'Properti tidak ditemukan' });
    }

    // Ambil ulasan dari service review
    const reviewResponse = await axios.get(`http://localhost:3000/review/${id}`);
    const ulasan = reviewResponse.data;

    // Gabungkan hasil
    res.json({
      ...properti,
      ulasan
    });

  } catch (error) {
    console.error('Error mengambil data properti:', error.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data properti' });
  }
});

module.exports = router;
