const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/:id_properti', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Ulasan WHERE id_properti = ?', [req.params.id_properti]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { isi_ulasan, id_properti } = req.body;
  await db.query('INSERT INTO Ulasan (isi_ulasan, id_properti) VALUES (?, ?)', [isi_ulasan, id_properti]);
  res.status(201).json({ message: 'Ulasan ditambahkan' });
});

module.exports = router;
