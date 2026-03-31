const express = require('express');
const { db } = require('../database');

const router = express.Router();

// 🔹 Criar a tabela de logs se não existir
db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// 🔹 Obter todos os logs
router.get('/', (req, res) => {
    db.all("SELECT * FROM logs ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 🔹 Adicionar um log
router.post('/', (req, res) => {
    const { user, message } = req.body;
    if (!user || !message) {
        return res.status(400).json({ error: "Usuário e mensagem são obrigatórios!" });
    }

    db.run("INSERT INTO logs (user, message) VALUES (?, ?)", [user, message], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Log salvo!", id: this.lastID });
        }
    });
});

module.exports = router;
