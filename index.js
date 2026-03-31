const client = require('./src/bot/client');
const { carregarConfiguracoes } = require('./backend/config');
const { carregarConhecimento, carregarObjecoes } = require('./backend/database');
const { processarMensagem } = require('./src/logic/interacao');
require('dotenv').config();

// 🔒 Modo Seguro: Responde apenas para o administrador em desenvolvimento (evita ban)
const MODO_SEGURO = true; 
const ADMIN_NUMBER = process.env.ADMIN_NUMBER || "5541999609939";

async function iniciarBot() {
    console.log("🔄 Carregando configurações do banco...");
    await carregarConfiguracoes();
    console.log("✅ Configurações carregadas com sucesso!");

    // Atualizar conhecimento e objeções periodicamente
    setInterval(async () => {
        console.log("🔄 Atualizando conhecimento e objeções...");
        await carregarConhecimento();
        await carregarObjecoes();
    }, 600000); // Atualiza a cada 10 minutos

    // ✅ Evento de mensagem recebida
    client.on('message', async message => {
        if (message.from === "status@broadcast") return; // 🔹 Ignora mensagens de status do WhatsApp

        // 🔒 Filtro de Whitelist
        if (MODO_SEGURO) {
            const userId = message.from.replace("@c.us", "").replace("@s.whatsapp.net", "");
            if (!userId.includes(ADMIN_NUMBER)) {
                console.log(`🕵️ Mensagem de ${userId} ignorada (Modo Seguro Ativo)`);
                return;
            }
        }

        await processarMensagem(message);
    });
}

iniciarBot();
