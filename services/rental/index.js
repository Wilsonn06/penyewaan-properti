const express = require('express');
const router = express.Router();
const db = require('../../db');
const axios = require('axios');

// POST buat transaksi sewa
router.post('/', async (req, res) => {
  const { id_pengguna, id_properti, bukti_transfer } = req.body;

  try {
    // 1. Simpan bukti transfer ke service deposit
    const depositResponse = await axios.post('http://localhost:6000/deposit', {
      id_pengguna,
      id_properti,
      bukti_transfer
    });

    const id_deposit = depositResponse.data.id_deposit;

    // 2. Simpan transaksi ke tabel Sewa → status langsung 'active'
    const [result] = await db.query(
      `INSERT INTO Sewa (id_pengguna, id_properti, id_deposit, status)
       VALUES (?, ?, ?, ?)`,
      [id_pengguna, id_properti, id_deposit, 'active']
    );

    // 3. Ambil data pengguna lama dari service penyewa
    const { data: penyewa } = await axios.get(`http://localhost:5000/manajemen_penyewa/${id_pengguna}`);

    // 4. Update data penyewa → set status_sewa = 1, id_properti = yg disewa
    await axios.put(`http://localhost:5000/manajemen_penyewa/${id_pengguna}`, {
      ...penyewa,
      status_sewa: 1,
      id_properti
    });

    res.status(201).json({
      message: 'Transaksi sewa berhasil dibuat',
      id_sewa: result.insertId,
      id_deposit
    });
  } catch (err) {
    console.error('Error membuat transaksi sewa:', err.message);
    res.status(500).json({ message: 'Gagal membuat transaksi sewa' });
  }
});

module.exports = router;
