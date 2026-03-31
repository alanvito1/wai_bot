const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define o caminho correto do banco dentro da pasta backend
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error("❌ Erro ao abrir o banco de dados:", err.message);
    } else {
        console.log(`✅ Banco de dados conectado! Usando: ${dbPath}`);

        db.serialize(() => {
            // 🔹 Criar tabela de conhecimento
            db.run(`CREATE TABLE IF NOT EXISTS conhecimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pergunta TEXT UNIQUE,
                resposta TEXT
            )`);

            // 🔹 Criar tabela de mensagens
            db.run(`CREATE TABLE IF NOT EXISTS mensagens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                mensagem TEXT,
                tipo TEXT CHECK(tipo IN ('recebida', 'enviada')),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 🔹 Criar tabela de objeções
            db.run(`CREATE TABLE IF NOT EXISTS objecoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                objecao TEXT UNIQUE,
                resposta TEXT
            )`);

            // 🔹 Criar tabela do fluxo de simulação com todas as colunas
            db.run(`CREATE TABLE IF NOT EXISTS simulacao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ordem INTEGER,
                etapa TEXT,
                pergunta TEXT,
                validacao TEXT DEFAULT NULL
            )`);

            // 🔹 Criar tabela de status do sistema (para QR Code e Conexão)
            db.run(`CREATE TABLE IF NOT EXISTS system_status (
                id INTEGER PRIMARY KEY,
                key TEXT UNIQUE,
                value TEXT
            )`);

            // Inicializar status padrão
            db.run(`INSERT OR IGNORE INTO system_status (id, key, value) VALUES (1, 'qr', '')`);
            db.run(`INSERT OR IGNORE INTO system_status (id, key, value) VALUES (2, 'status', 'disconnected')`);
        });
    }
});

/** 🔹 OBJECÕES */
// Adicionar objeção
function adicionarObjecao(objecao, resposta) {
    db.run(`INSERT INTO objecoes (objecao, resposta) VALUES (?, ?)`, [objecao.toLowerCase(), resposta], err => {
        if (err) {
            console.error("⚠️ Erro ao inserir objeção:", err.message);
        } else {
            console.log(`✅ Objeção adicionada: "${objecao}"`);
        }
    });
}

// Buscar objeção
function buscarObjecao(objecao, callback) {
    db.get(`SELECT resposta FROM objecoes WHERE objecao = ?`, [objecao.toLowerCase()], (err, row) => {
        if (err) {
            console.error("❌ Erro na busca de objeção:", err.message);
            callback(null);
        } else {
            callback(row ? row.resposta : null);
        }
    });
}

/** 🔹 CONHECIMENTO */
// Buscar conhecimento
function buscarConhecimento(pergunta, callback) {
    db.get(`SELECT resposta FROM conhecimento WHERE pergunta = ?`, [pergunta.toLowerCase()], (err, row) => {
        if (err) {
            console.error("❌ Erro na busca de conhecimento:", err.message);
            callback(null);
        } else {
            callback(row ? row.resposta : null);
        }
    });
}

// Carregar conhecimento do banco
function carregarConhecimento() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM conhecimento`, (err, rows) => {
            if (err) {
                console.error("❌ Erro ao carregar conhecimento:", err.message);
                reject(err);
            } else {
                console.log("✅ Conhecimento carregado com sucesso!");
                resolve(rows);
            }
        });
    });
}

// Carregar objeções do banco
function carregarObjecoes() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM objecoes`, (err, rows) => {
            if (err) {
                console.error("❌ Erro ao carregar objeções:", err.message);
                reject(err);
            } else {
                console.log("✅ Objeções carregadas com sucesso!");
                resolve(rows);
            }
        });
    });
}

/** 🔹 FLUXO DE SIMULAÇÃO */
// Adicionar uma nova etapa ao fluxo (agora com `validacao`)
function adicionarEtapaSimulacao(ordem, pergunta, validacao) {
    db.run(`INSERT INTO simulacao (ordem, pergunta, validacao) VALUES (?, ?, ?)`, [ordem, pergunta, validacao], err => {
        if (err) {
            console.error("⚠️ Erro ao inserir etapa da simulação:", err.message);
        } else {
            console.log(`✅ Etapa adicionada ao fluxo: "${pergunta}" com validação: "${validacao}"`);
        }
    });
}

// Buscar todas as etapas do fluxo
function buscarFluxoSimulacao(callback) {
    db.all("SELECT * FROM simulacao ORDER BY ordem ASC", [], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar fluxo de simulação:", err.message);
            callback([]);
        } else {
            callback(rows);
        }
    });
}

// Atualizar uma etapa do fluxo (agora permite alterar `validacao`)
function atualizarEtapaSimulacao(id, ordem, pergunta, validacao) {
    db.run(`UPDATE simulacao SET ordem = ?, pergunta = ?, validacao = ? WHERE id = ?`, [ordem, pergunta, validacao, id], function (err) {
        if (err) {
            console.error("❌ Erro ao atualizar etapa da simulação:", err.message);
        } else {
            console.log(`✅ Etapa atualizada: "${pergunta}" com validação: "${validacao}"`);
        }
    });
}

// Excluir uma etapa do fluxo
function excluirEtapaSimulacao(id) {
    db.run("DELETE FROM simulacao WHERE id = ?", id, function (err) {
        if (err) {
            console.error("❌ Erro ao remover etapa da simulação:", err.message);
        } else {
            console.log("✅ Etapa removida com sucesso!");
        }
    });
}

/** 🔹 STATUS DO SISTEMA */
function atualizarStatusSistemas(key, value) {
    db.run(`INSERT INTO system_status (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?`, [key, value, value], err => {
        if (err) {
            console.error(`⚠️ Erro ao atualizar status (${key}):`, err.message);
        }
    });
}

function buscarStatusSistemas(key, callback) {
    db.get(`SELECT value FROM system_status WHERE key = ?`, [key], (err, row) => {
        if (err) {
            console.error(`❌ Erro ao buscar status (${key}):`, err.message);
            callback(null);
        } else {
            callback(row ? row.value : null);
        }
    });
}

module.exports = {
    db,
    adicionarObjecao,
    buscarObjecao,
    buscarConhecimento,
    carregarConhecimento,
    carregarObjecoes,
    adicionarEtapaSimulacao,
    buscarFluxoSimulacao,
    atualizarEtapaSimulacao,
    excluirEtapaSimulacao,
    atualizarStatusSistemas,
    buscarStatusSistemas
};
