const express = require("express");
const router = express.Router();
const { db } = require("../database");
const { carregarConfiguracoes } = require("../config");

// 🔹 Retorna as configurações salvas no banco
router.get("/", (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) {
            console.error("Erro ao carregar configurações:", err.message);
            return res.status(500).json({ error: "Erro ao carregar configurações" });
        }

        let config = {};
        rows.forEach(row => {
            config[row.key] = row.value;
        });

        res.json(config);
    });
});

// 🔹 Atualiza as configurações no banco e recarrega para o bot
router.post("/", (req, res) => {
    const newConfig = req.body;

    Object.keys(newConfig).forEach(key => {
        db.run(
            "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
            [key, newConfig[key], newConfig[key]],
            err => {
                if (err) {
                    console.error("Erro ao salvar configuração:", err.message);
                }
            }
        );
    });

    // 🔥 Atualiza as configurações do bot sem reiniciar!
    carregarConfiguracoes().then(() => {
        console.log("✅ Configurações recarregadas no bot!");
        res.json({ message: "Configurações salvas e aplicadas!" });
    }).catch(err => {
        console.error("❌ Erro ao recarregar configurações:", err.message);
        res.status(500).json({ error: "Erro ao recarregar configurações." });
    });
});

module.exports = router;
