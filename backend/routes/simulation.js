const express = require("express");
const { db } = require("../database");

const router = express.Router();

// ✅ Buscar todas as etapas da simulação ordenadas corretamente
router.get("/", (req, res) => {
    db.all("SELECT * FROM simulacao ORDER BY ordem ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ✅ Adicionar uma nova etapa ao fluxo da simulação
router.post("/", (req, res) => {
    const { ordem, etapa, pergunta, validacao } = req.body;

    if (!ordem || !etapa || !pergunta) {
        return res.status(400).json({ error: "Os campos 'ordem', 'etapa' e 'pergunta' são obrigatórios!" });
    }

    db.run("INSERT INTO simulacao (ordem, etapa, pergunta, validacao) VALUES (?, ?, ?, ?)", 
        [ordem, etapa, pergunta, validacao || null], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, ordem, etapa, pergunta, validacao });
            }
        }
    );
});

// ✅ Atualizar uma etapa da simulação
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { ordem, etapa, pergunta, validacao } = req.body;

    db.run("UPDATE simulacao SET ordem = ?, etapa = ?, pergunta = ?, validacao = ? WHERE id = ?", 
        [ordem, etapa, pergunta, validacao || null, id], function (err) {
            if (err) {
                console.error("❌ Erro ao atualizar etapa:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "✅ Etapa da simulação atualizada com sucesso!" });
            }
        }
    );
});

// ✅ Remover uma etapa da simulação
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM simulacao WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "✅ Etapa removida com sucesso!" });
        }
    });
});

module.exports = router;
