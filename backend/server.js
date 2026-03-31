const express = require("express");
const cors = require("cors");
const { db, buscarStatusSistemas } = require("./database");
const apiRoutes = require("./api");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ API de Configurações Gerais
app.get("/api/settings", (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        let config = {};
        rows.forEach(row => { config[row.key] = row.value; });
        res.json(config);
    });
});

app.post("/api/settings", (req, res) => {
    const settings = req.body;
    const queries = Object.keys(settings).map(key => {
        return db.run("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?", [key, settings[key], settings[key]]);
    });

    Promise.all(queries)
        .then(() => res.json({ message: "✅ Configurações salvas!" }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// ✅ API de Status do Bot (QR Code)
app.get("/api/status", (req, res) => {
    buscarStatusSistemas('status', (status) => {
        buscarStatusSistemas('qr', (qr) => {
            res.json({ status, qr });
        });
    });
});

// 🔹 Rotas da API
app.use("/api", apiRoutes);

// ✅ API de Base de Conhecimento
app.get("/api/knowledge", (req, res) => {
    db.all("SELECT * FROM conhecimento", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post("/api/knowledge", (req, res) => {
    const { pergunta, resposta } = req.body;
    db.run("INSERT INTO conhecimento (pergunta, resposta) VALUES (?, ?)", [pergunta, resposta], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, pergunta, resposta });
        }
    });
});

app.delete("/api/knowledge/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM conhecimento WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Pergunta removida com sucesso!" });
        }
    });
});

// ✅ API de Objeções
app.get("/api/objections", (req, res) => {
    db.all("SELECT * FROM objecoes", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post("/api/objections", (req, res) => {
    const { objecao, resposta } = req.body;
    db.run("INSERT INTO objecoes (objecao, resposta) VALUES (?, ?)", [objecao, resposta], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, objecao, resposta });
        }
    });
});

app.delete("/api/objections/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM objecoes WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Objeção removida com sucesso!" });
        }
    });
});

// ✅ API de Fluxo de Simulação (Perguntas dinâmicas)
app.get("/api/simulation", (req, res) => {
    db.all("SELECT * FROM simulacao ORDER BY ordem ASC", [], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar fluxo de simulação:", err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows || []); // ✅ Sempre retorna um array válido
    });
});

// ✅ Adicionar nova etapa na simulação
app.post("/api/simulation", (req, res) => {
    const { ordem, pergunta } = req.body;
    db.run("INSERT INTO simulacao (ordem, pergunta) VALUES (?, ?)", [ordem, pergunta], function (err) {
        if (err) {
            console.error("❌ Erro ao adicionar etapa:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, ordem, pergunta });
        }
    });
});

// ✅ Atualizar uma etapa da simulação
app.put("/api/simulation/:id", (req, res) => {
    const { id } = req.params;
    const { etapa, pergunta } = req.body;

    db.run("UPDATE simulacao SET etapa = ?, pergunta = ? WHERE id = ?", [etapa, pergunta, id], function (err) {
        if (err) {
            console.error("❌ Erro ao atualizar etapa:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "✅ Etapa atualizada com sucesso!" });
        }
    });
});

// ✅ Excluir uma etapa do fluxo de simulação
app.delete("/api/simulation/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM simulacao WHERE id = ?", id, function (err) {
        if (err) {
            console.error("❌ Erro ao excluir etapa:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "🗑️ Etapa removida com sucesso!" });
        }
    });
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ API rodando na porta ${PORT}`);
});
