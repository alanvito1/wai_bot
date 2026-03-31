const client = require('./bot');
const { carregarConfiguracoes } = require('./backend/config');
const { carregarConhecimento, carregarObjecoes } = require('./backend/database');
const { processarMensagem } = require('./interacao');

async function iniciarBot() {
    console.log("🔄 Carregando configurações do banco...");
    await carregarConfiguracoes();
    console.log("✅ Configurações carregadas com sucesso!");

    // Atualizar conhecimento e objeções periodicamente
    setInterval(async () => {
        console.log("🔄 Atualizando conhecimento e objeções...");
        await carregarConhecimento();
        await carregarObjecoes();
    }, 600000); // Atualiza a cada 1 minuto

    // ✅ Evento de mensagem recebida
    client.on('message', async message => {
        if (message.from === "status@broadcast") return; // 🔹 Ignora mensagens de status do WhatsApp
        await processarMensagem(message);
    });
}

iniciarBot();
