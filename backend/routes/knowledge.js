const express = require('express');
const { db, adicionarObjecao } = require('../database');

const router = express.Router();

// 🔹 Buscar todas as perguntas/respostas
router.get('/', (req, res) => {
    db.all("SELECT * FROM conhecimento", [], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar conhecimento:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 🔹 Adicionar uma nova pergunta/resposta
router.post('/', (req, res) => {
    const { pergunta, resposta } = req.body;
    if (!pergunta || !resposta) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    db.run("INSERT INTO conhecimento (pergunta, resposta) VALUES (?, ?)", [pergunta, resposta], function (err) {
        if (err) {
            console.error("❌ Erro ao adicionar pergunta:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, pergunta, resposta });
        }
    });
});

// 🔹 Excluir uma pergunta da base de conhecimento
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM conhecimento WHERE id = ?", id, function (err) {
        if (err) {
            console.error("❌ Erro ao excluir pergunta:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "✅ Pergunta removida com sucesso!" });
        }
    });
});

// 🔹 Buscar todas as objeções cadastradas
router.get('/objections', (req, res) => {
    db.all("SELECT * FROM objecoes", [], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar objeções:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 🔹 Adicionar uma nova objeção
router.post('/objections', (req, res) => {
    const { objecao, resposta } = req.body;
    if (!objecao || !resposta) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    adicionarObjecao(objecao, resposta);
    res.json({ message: "✅ Objeção adicionada com sucesso!" });
});

// 🔹 Excluir uma objeção específica
router.delete('/objections/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM objecoes WHERE id = ?", id, function (err) {
        if (err) {
            console.error("❌ Erro ao excluir objeção:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "✅ Objeção removida com sucesso!" });
        }
    });
});

module.exports = router;