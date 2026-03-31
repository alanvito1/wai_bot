const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.test.sqlite');

// Limpar banco de teste anterior se existir
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

// Inicialização básica idêntica ao original
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS conhecimento (id INTEGER PRIMARY KEY AUTOINCREMENT, pergunta TEXT UNIQUE, resposta TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS mensagens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, mensagem TEXT, tipo TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS objecoes (id INTEGER PRIMARY KEY AUTOINCREMENT, objecao TEXT UNIQUE, resposta TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS simulacao (id INTEGER PRIMARY KEY AUTOINCREMENT, ordem INTEGER, etapa TEXT, pergunta TEXT, validacao TEXT DEFAULT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS system_status (id INTEGER PRIMARY KEY, key TEXT UNIQUE, value TEXT)`);
    
    // Status iniciais
    db.run(`INSERT INTO system_status (id, key, value) VALUES (1, 'qr', '')`);
    db.run(`INSERT INTO system_status (id, key, value) VALUES (2, 'status', 'disconnected')`);
});

module.exports = { db, dbPath };
