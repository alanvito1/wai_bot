const express = require("express");
const { db } = require("../database");

const router = express.Router();

// 📊 🔹 Estatísticas Gerais para o Dashboard
router.get("/", async (req, res) => {
    try {
        const stats = await new Promise((resolve, reject) => {
            db.get(
                `SELECT 
                    (SELECT COUNT(*) FROM leads) AS totalLeads, 
                    (SELECT COUNT(*) FROM conhecimento) AS totalPerguntas, 
                    (SELECT COUNT(*) FROM mensagens) AS totalMensagens, 
                    (SELECT COUNT(*) FROM leads WHERE status = 'finalizado') AS finalizados, 
                    (SELECT COUNT(*) FROM leads WHERE status = 'não respondeu') AS naoRespondidos
                `,
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        // Calcula a taxa de conversão
        stats.taxaConversao = stats.totalLeads > 0 ? ((stats.finalizados / stats.totalLeads) * 100).toFixed(2) : 0;
        
        res.json(stats);
    } catch (error) {
        console.error("❌ Erro ao buscar estatísticas:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ⏰ 🔹 Obtém os horários de pico de mensagens
router.get("/horarios", async (req, res) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(
                "SELECT strftime('%H', timestamp) AS hora, COUNT(*) AS total FROM mensagens GROUP BY hora",
                [],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
        res.json(rows);
    } catch (error) {
        console.error("❌ Erro ao buscar horários:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 📩 🔹 Registra mensagens enviadas e recebidas
function registrarMensagem(userId, mensagem, tipo) {
    db.run(
        "INSERT INTO mensagens (user_id, mensagem, tipo, timestamp) VALUES (?, ?, ?, datetime('now'))",
        [userId, mensagem, tipo],
        function (err) {
            if (err) console.error("❌ Erro ao registrar mensagem:", err.message);
        }
    );
}

// 📈 🔹 Obtém histórico de mensagens processadas
router.get("/mensagens", async (req, res) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT user_id, mensagem, tipo, timestamp FROM mensagens ORDER BY timestamp DESC", [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        res.json(rows);
    } catch (error) {
        console.error("❌ Erro ao buscar histórico de mensagens:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, registrarMensagem };
