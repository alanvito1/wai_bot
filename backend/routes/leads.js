const express = require('express');
const { db } = require('../database');

const router = express.Router();

// 🔹 Buscar todos os leads
router.get('/', (req, res) => {
    db.all("SELECT * FROM leads", [], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar leads:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;