// const express = require('express');
// const router = express.Router();
// const db = require('../../db');

// router.get('/', async (req, res) => {
//   const [rows] = await db.query('SELECT * FROM Penyewa');
//   res.json(rows);
// });

// router.post('/', async (req, res) => {
//   const { nama_penyewa, status_sewa, rekening_penyewa, nomor_telp_penyewa, id_properti } = req.body;
//   await db.query(
//     'INSERT INTO Penyewa (nama_penyewa, status_sewa, rekening_penyewa, nomor_telp_penyewa, id_properti) VALUES (?, ?, ?, ?, ?)',
//     [nama_penyewa, status_sewa, rekening_penyewa, nomor_telp_penyewa, id_properti]
//   );
//   res.status(201).json({ message: 'Penyewa ditambahkan' });
// });

// module.exports = router;
