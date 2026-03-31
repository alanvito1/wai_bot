const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite', err => {
    if (err) {
        console.error("❌ Erro ao abrir o banco de dados:", err.message);
    } else {
        console.log("✅ Banco de dados conectado!");

        // Criar tabela de configurações gerais se não existir
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);
    }
});

// 🔹 Objeto global de configuração
const config = {};

// 🔹 Função para carregar configurações do banco de dados
async function carregarConfiguracoes() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM settings", [], (err, rows) => {
            if (err) {
                console.error("❌ Erro ao carregar configurações:", err.message);
                reject(err);
            } else {
                rows.forEach(row => {
                    // Garante que "welcomeMessage" será tratado como "saudacao"
                    if (row.key === "welcomeMessage") row.key = "saudacao";
                    config[row.key] = row.value;
                });
                console.log("✅ Configurações carregadas com sucesso!", config);
                resolve(config);
            }
        });
    });
}
// 🔹 Função para atualizar configurações no banco de dados
function atualizarConfiguracoes(novasConfigs) {
    return new Promise((resolve, reject) => {
        const queries = Object.keys(novasConfigs).map(key => {
            return new Promise((res, rej) => {
                db.run(
                    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
                    [key, novasConfigs[key], novasConfigs[key]],
                    function (err) {
                        if (err) {
                            rej(err);
                        } else {
                            res();
                        }
                    }
                );
            });
        });

        Promise.all(queries)
            .then(() => {
                console.log("✅ Configurações atualizadas com sucesso!");
                resolve();
            })
            .catch(err => {
                console.error("❌ Erro ao atualizar configurações:", err.message);
                reject(err);
            });
    });
}
// 🔹 Função para buscar a saudação do banco de dados
async function buscarSaudacao() {
    return new Promise((resolve, reject) => {
        db.get("SELECT value FROM settings WHERE key = 'saudacao'", [], (err, row) => {
            if (err) {
                console.error("❌ Erro ao carregar saudação:", err.message);
                reject(err);
            } else {
                resolve(row ? row.value : "Olá! Como posso te ajudar hoje? 😊"); // Padrão caso não exista no banco
            }
        });
    });
}
// 🔹 Função para verificar se a mensagem contém um gatilho de simulação
function verificarGatilhosSimulacao(mensagem) {
    const gatilhos = config.gatilho_simulacao ? config.gatilho_simulacao.split(",") : ["simulação", "quero simular", "fazer simulação", "simular"];
    return gatilhos.some(trigger => mensagem.toLowerCase().includes(trigger.trim().toLowerCase()));
}

// 🔹 Função para verificar se a mensagem contém um cumprimento inicial
function verificarCumprimento(mensagem) {
    const cumprimentos = ["oi", "olá", "ola", "boa tarde", "bom dia", "boa noite", "e aí", "fala", "opa"];
    return cumprimentos.some(c => mensagem.toLowerCase().startsWith(c));
}

// 🔹 Funções de validação de entrada
const validarTelefone = telefone => /^\d{2}9?\d{8}$/.test(telefone);
const validarEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const validarMes = mes => ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"].includes(mes.toLowerCase());
const validarValor = valor => /^\d+(?:\.\d{2})?\s?(R\$|USD|EUR)?$/.test(valor);

// 🔹 Exportar todas as funções corretamente
module.exports = { 
    db, 
    config, 
    carregarConfiguracoes,
    buscarSaudacao,
    verificarGatilhosSimulacao, 
    atualizarConfiguracoes, 
    verificarCumprimento, 
    validarTelefone, 
    validarEmail, 
    validarMes, 
    validarValor 
};
