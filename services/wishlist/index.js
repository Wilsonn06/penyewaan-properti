const express = require('express');
const axios = require('axios');
const db = require('../../db');
const router = express.Router();

const CATALOG_SERVICE_URL = 'http://localhost:3000/catalog';

router.get('/', async (req, res) => {
  const { id_pengguna } = req.query;

  if (!id_pengguna) {
    return res.status(400).json({ message: 'id_pengguna wajib diisi' });
  }
  db.query(
    'SELECT * FROM Wishlist WHERE id_pengguna = ?',
    [id_pengguna],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', detail: err });

      const detailedWishlist = await Promise.all(
        results.map(async (item) => {
          try {
            const response = await axios.get(`${CATALOG_SERVICE_URL}/${item.id_properti}`);
            return {
              ...item,
              properti: response.data
            };
          } catch (error) {
            return {
              ...item,
              properti: null,
              error: 'Properti tidak ditemukan'
            };
          }
        })
      );

      res.json(detailedWishlist);
    }
  );
});

router.post('/', (req, res) => {
  const { id_pengguna, id_properti } = req.body;

  if (!id_pengguna || !id_properti) {
    return res.status(400).json({ message: 'id_pengguna dan id_properti wajib diisi' });
  }

  const query = 'INSERT INTO Wishlist (id_pengguna, id_properti) VALUES (?, ?)';

  db.query(query, [id_pengguna, id_properti], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Properti sudah ada di wishlist' });
      }
      return res.status(500).json({ message: 'Gagal menyimpan wishlist', error: err });
    }

    res.status(201).json({ message: 'Wishlist berhasil disimpan' });
  });
});

module.exports = router;
