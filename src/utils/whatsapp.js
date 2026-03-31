const client = require('../bot/client');

/**
 * Funções auxiliares para o WhatsApp.
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendMessage(userId, message) {
    if (!message) return;
    
    // Simular digitação e adicionar delay humano (1 a 3 segundos)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    console.log(`⏳ Aguardando ${delay}ms para enviar mensagem para ${userId}...`);
    try {
        // Obter chat para simular digitação
        const chat = await client.getChatById(userId);
        await chat.sendStateTyping();
        await sleep(delay);
        
        console.log(`🚀 Enviando mensagem para ${userId}: ${message.substring(0, 50)}...`);
        await client.sendMessage(userId, message);
        await chat.clearState();
        
        console.log(`✅ Mensagem enviada para ${userId}`);
    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem para ${userId}:`, error);
        // Fallback simples se getChatById falhar
        await client.sendMessage(userId, message);
    }
}

module.exports = { sendMessage };
