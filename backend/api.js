const express = require("express");
const { db } = require("./database");

const router = express.Router();

// 📊 🔹 Estatísticas Gerais para o Dashboard
router.get("/stats", async (req, res) => {
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
router.get("/stats/horarios", async (req, res) => {
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

// 📈 🔹 Evolução de Leads ao Longo do Tempo
router.get("/stats/leads", async (req, res) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(
                "SELECT DATE(created_at) AS data, COUNT(*) AS total FROM leads GROUP BY data ORDER BY data ASC",
                [],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
        res.json(rows);
    } catch (error) {
        console.error("❌ Erro ao buscar evolução de leads:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
